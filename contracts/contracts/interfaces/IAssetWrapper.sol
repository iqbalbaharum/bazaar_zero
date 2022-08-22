// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface for an AssetWrapper contract
 */
interface IAssetWrapper {

     /**
     * @dev Emitted when an ERC721 token is deposited
     */
    event DepositERC20(address indexed depositor, uint256 indexed bundleId, address tokenAddress, uint256 amount, string title);

    /**
     * @dev Emitted when an ERC721 token is deposited
     */
    event DepositERC721(address indexed depositor, uint256 indexed bundleId, address tokenAddress, uint256 tokenId, string title);

    /**
     * @dev Emitted when an ERC1155 token is deposited
     */
    event DepositERC1155(
        address indexed depositor,
        uint256 indexed bundleId,
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        string title
    );

    /**
     * @dev Emitted when ETH is deposited
     */
    event Withdraw(address indexed withdrawer, uint256 indexed bundleId);

    event Sell(address indexed seller, uint256 indexed bundleId, uint256 price, address nodeAddress);

    event Buy(address indexed buyer, uint256 indexed bundleId, uint256 price, address nodeAddress);

    /**
     * @dev Creates a new bundle token for `to`. Its token ID will be
     * automatically assigned (and available on the emitted {IERC721-Transfer} event)
     *
     * See {ERC721-_mint}.
     */
    function initializeBundle(address to, uint256 groupId, string memory title, string memory description, bytes32 signal, uint256 _nullifierHash,
        uint256[8] calldata _proof) external returns (uint256);

    /**
     * @dev Deposit some ERC20 tokens into a given bundle
     *
     * Requirements:
     *
     * - The bundle with id `bundleId` must have been initialized with {initializeBundle}
     * - `amount` tokens from `msg.sender` on `tokenAddress` must have been approved to this contract
     */
    function depositERC20(
        address tokenAddress,
        uint256 amount,
        uint256 bundleId,
        string memory title
    ) external;
    /**
     * @dev Deposit an ERC721 token into a given bundle
     *
     * Requirements:
     *
     * - The bundle with id `bundleId` must have been initialized with {initializeBundle}
     * - The `tokenId` NFT from `msg.sender` on `tokenAddress` must have been approved to this contract
     */
    function depositERC721(
        address tokenAddress,
        uint256 tokenId,
        uint256 bundleId,
        string memory title
    ) external;

    /**
     * @dev Deposit an ERC1155 token into a given bundle
     *
     * Requirements:
     *
     * - The bundle with id `bundleId` must have been initialized with {initializeBundle}
     * - The `tokenId` from `msg.sender` on `tokenAddress` must have been approved for at least `amount`to this contract
     */
    function depositERC1155(
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 bundleId,
        string memory title
    ) external;


    /**
     * @dev Withdraw all assets in the given bundle, returning them to the msg.sender
     *
     * Requirements:
     *
     * - The bundle with id `bundleId` must have been initialized with {initializeBundle}
     * - The bundle with id `bundleId` must be owned by or approved to msg.sender
     */
    function withdraw(uint256 bundleId) external;

    function sell(uint256 bundleId, uint256 price, address nodeAddress) external;

    function buy(uint256 bundleId) external payable;

}