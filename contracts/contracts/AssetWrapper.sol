// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAssetWrapper.sol";
import "./ERC721Permit.sol";

import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/**
 * @dev {ERC721} token allowing users to create bundles of assets.
 *
 * Users can create new bundles, which grants them an NFT to
 * reclaim all assets stored in the bundle. They can then
 * store various types of assets in that bundle. The bundle NFT
 * can then be used or traded as an asset in its own right.
 * At any time, the holder of the bundle NFT can redeem it for the
 * underlying assets.
 */
contract AssetWrapper is
    Context,
    ERC721Enumerable,
    ERC721Burnable,
    ERC1155Holder,
    ERC721Holder,
    ERC721Permit,
    Ownable,
    IAssetWrapper,
    SemaphoreCore,
    SemaphoreGroups
{
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdTracker;

    struct ERC20Holding {
        address tokenAddress;
        uint256 amount;
        string title;
    }

    struct ERC721Holding {
        address tokenAddress;
        uint256 tokenId;
        string title;
    }

    struct ERC1155Holding {
        address tokenAddress;
        uint256 tokenId;
        uint256 amount;
        string title;
    }
    
    struct Bundle {
      address owner;
      uint256 bundleId;
      address nodeAddress;
      uint256 price;
      string title;
      ERC721Holding[] bundleERC721;
      ERC1155Holding[] bundleERC1155;
      ERC20Holding[] bundleERC20;
    }

    mapping(uint256 => Bundle) public bundles;

    mapping(address => uint256[]) public bundleIdsByAddress;

    // The external verifier used to verify Semaphore proofs.
    IVerifier public verifier;
    uint8 public treeDepth;

    event SubscriptionCreated(uint256 indexed groupId, bytes32 subscriptionName);
    event ProofVerified(uint256 indexed groupId, bytes32 signal);

    /**
     * @dev Initializes the token with name and symbol parameters
     */
    constructor(string memory name, string memory symbol, address _verifier, uint8 _treeDepth) ERC721(name, symbol) ERC721Permit(name) {
      verifier = IVerifier(_verifier);
      treeDepth = _treeDepth;
    }

    function getBundleIdsByAddress(address seller) public view returns (uint[] memory) {
      return bundleIdsByAddress[seller];
    }

    function getBundles(uint256 tokenId) public view returns (Bundle memory) {
      return bundles[tokenId];
    }

    function hashSubscriptionName(bytes32 groupId) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(groupId))) >> 8;
    }

    function createSubscription(
        bytes32 subscriptionName
    ) public onlyOwner {
        uint256 groupId = hashSubscriptionName(subscriptionName);
        _createGroup(groupId, treeDepth, 0);

        emit SubscriptionCreated(groupId, subscriptionName);
    }

    function addMember(uint256 groupId, uint256 identityCommitment) public onlyOwner {
        _addMember(groupId, identityCommitment);
    }

    /**
     * @inheritdoc IAssetWrapper
     */
    function initializeBundle(address to, uint256 groupId, string memory title, bytes32 signal, uint256 _nullifierHash,
        uint256[8] calldata _proof) external returns (uint256) {
        uint256 root = getRoot(groupId);

        _verifyProof(signal, root, _nullifierHash, groupId, _proof, verifier);

        uint256 _tokenId = _tokenIdTracker.current();
        _mint(to, _tokenId);
        _tokenIdTracker.increment();

        // Prevent double-greeting (nullifierHash = hash(root + identityNullifier)).
        // Every user can greet once.
        // _saveNullifierHash(_nullifierHash);
        bundleIdsByAddress[to].push(_tokenId);
        bundles[_tokenId].owner = to;
        bundles[_tokenId].bundleId = _tokenId;
        bundles[_tokenId].title = title;

        emit ProofVerified(groupId, signal);

        return _tokenId;
    }

    /**
     * @inheritdoc IAssetWrapper
     */
    function depositERC20(
        address tokenAddress,
        uint256 amount,
        uint256 bundleId,
        string memory title
    ) external override {
        require(_exists(bundleId), "Bundle does not exist");

        SafeERC20.safeTransferFrom(IERC20(tokenAddress), _msgSender(), address(this), amount);

        // Note: there can be multiple `ERC20Holding` objects for the same token contract
        // in a given bundle. We could deduplicate them here, though I don't think
        // it's worth the extra complexity - the end effect is the same in either case.
        bundles[bundleId].bundleERC20.push(ERC20Holding(tokenAddress, amount, title));
        emit DepositERC20(_msgSender(), bundleId, tokenAddress, amount, title);
    }

    /**
     * @inheritdoc IAssetWrapper
     */
    function depositERC721(
        address tokenAddress,
        uint256 tokenId,
        uint256 bundleId,
        string memory title
    ) external override {
        require(_exists(bundleId), "Bundle does not exist");

        IERC721(tokenAddress).transferFrom(_msgSender(), address(this), tokenId);

        bundles[bundleId].bundleERC721.push(ERC721Holding(tokenAddress, tokenId, title));
        emit DepositERC721(_msgSender(), bundleId, tokenAddress, tokenId, title);
    }

    /**
     * @inheritdoc IAssetWrapper
     */
    function depositERC1155(
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 bundleId,
        string memory title
    ) external override {
        require(_exists(bundleId), "Bundle does not exist");

        IERC1155(tokenAddress).safeTransferFrom(_msgSender(), address(this), tokenId, amount, "");

        bundles[bundleId].bundleERC1155.push(ERC1155Holding(tokenAddress, tokenId, amount, title));
        emit DepositERC1155(_msgSender(), bundleId, tokenAddress, tokenId, amount, title);
    }


    /**
     * @inheritdoc IAssetWrapper
     */
    function withdraw(uint256 bundleId) external override {
        // require(bundles[bundleId].owner == msg.sender, "Non-owner withdrawal");
        require(_isApprovedOrOwner(_msgSender(), bundleId), "AssetWrapper: Non-owner withdrawal");
        burn(bundleId);

        ERC20Holding[] memory erc20Holdings = bundles[bundleId].bundleERC20;
        for (uint256 i = 0; i < erc20Holdings.length; i++) {
            SafeERC20.safeTransferFrom(IERC20(erc20Holdings[i].tokenAddress), 
                _msgSender(), bundles[bundleId].owner, erc20Holdings[i].amount);
        }
        // delete bundleERC20Holdings[bundleId];

        ERC721Holding[] memory erc721Holdings = bundles[bundleId].bundleERC721;
        for (uint256 i = 0; i < erc721Holdings.length; i++) {
            IERC721(erc721Holdings[i].tokenAddress).safeTransferFrom(
                _msgSender(),
                bundles[bundleId].owner,
                erc721Holdings[i].tokenId
            );
        }
        // delete bundleERC721Holdings[bundleId];

        ERC1155Holding[] memory erc1155Holdings = bundles[bundleId].bundleERC1155;
        for (uint256 i = 0; i < erc1155Holdings.length; i++) {
            IERC1155(erc1155Holdings[i].tokenAddress).safeTransferFrom(
                _msgSender(),
                bundles[bundleId].owner,
                erc1155Holdings[i].tokenId,
                erc1155Holdings[i].amount,
                ""
            );
        }
        // delete bundleERC1155Holdings[bundleId];
        delete bundles[bundleId];

        emit Withdraw(_msgSender(), bundleId);
    }

    function sell(uint256 bundleId, uint256 price, address nodeAddress) external override {
      require(_exists(bundleId), "No asset found");
      require(msg.sender == bundles[bundleId].owner, "Non-owner selling");

      bundles[bundleId].price = price;
      bundles[bundleId].nodeAddress = nodeAddress;

      _transfer(msg.sender, nodeAddress, bundleId);

      ERC20Holding[] memory erc20Holdings = bundles[bundleId].bundleERC20;
      for (uint256 i = 0; i < erc20Holdings.length; i++) {
          SafeERC20.safeTransferFrom(IERC20(erc20Holdings[i].tokenAddress), 
              address(this), bundles[bundleId].nodeAddress, erc20Holdings[i].amount);
      }
      // delete bundleERC20Holdings[bundleId];

      ERC721Holding[] memory erc721Holdings = bundles[bundleId].bundleERC721;
      for (uint256 i = 0; i < erc721Holdings.length; i++) {
          IERC721(erc721Holdings[i].tokenAddress).safeTransferFrom(
              address(this),
              bundles[bundleId].nodeAddress,
              erc721Holdings[i].tokenId
          );
      }
      // delete bundleERC721Holdings[bundleId];

      ERC1155Holding[] memory erc1155Holdings = bundles[bundleId].bundleERC1155;
      for (uint256 i = 0; i < erc1155Holdings.length; i++) {
          IERC1155(erc1155Holdings[i].tokenAddress).safeTransferFrom(
              address(this),
              bundles[bundleId].nodeAddress,
              erc1155Holdings[i].tokenId,
              erc1155Holdings[i].amount,
              ""
          );
      }
      emit Sell(_msgSender(), bundleId, price, nodeAddress);
    }

    function buy(uint256 bundleId) external payable {
      require(_exists(bundleId), "No asset found");
      require(msg.value >= bundles[bundleId].price, "Insufficient price");

      ERC20Holding[] memory erc20Holdings = bundles[bundleId].bundleERC20;

        for (uint256 i = 0; i < erc20Holdings.length; i++) {
            SafeERC20.safeTransferFrom(IERC20(erc20Holdings[i].tokenAddress), 
                bundles[bundleId].nodeAddress, _msgSender(), erc20Holdings[i].amount);
        }
        // delete bundleERC20Holdings[bundleId];

        ERC721Holding[] memory erc721Holdings = bundles[bundleId].bundleERC721;
        for (uint256 i = 0; i < erc721Holdings.length; i++) {
            IERC721(erc721Holdings[i].tokenAddress).safeTransferFrom(
                bundles[bundleId].nodeAddress,
                _msgSender(),
                erc721Holdings[i].tokenId
            );
        }
        // delete bundleERC721Holdings[bundleId];

        ERC1155Holding[] memory erc1155Holdings = bundles[bundleId].bundleERC1155;
        for (uint256 i = 0; i < erc1155Holdings.length; i++) {
            IERC1155(erc1155Holdings[i].tokenAddress).safeTransferFrom(
                bundles[bundleId].nodeAddress,
                _msgSender(),
                erc1155Holdings[i].tokenId,
                erc1155Holdings[i].amount,
                ""
            );
        }
        // delete bundleERC1155Holdings[bundleId];

        emit Buy(_msgSender(), bundleId, bundles[bundleId].price, bundles[bundleId].nodeAddress);
        delete bundles[bundleId];
    }

    /**
     * @dev Hook that is called before any token transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}