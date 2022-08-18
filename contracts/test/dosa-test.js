const { Identity } = require("@semaphore-protocol/identity")
const { Group } = require("@semaphore-protocol/group")
const { generateProof, packToSolidityProof } = require("@semaphore-protocol/proof")
const { expect } = require("chai")

/* Import the Ethers.js JavaScript library for interacting with Ethereum. */
const { run, ethers } = require("hardhat")

describe("Dosa Marketplace", function () {
    let nft, consumable, wrapped, coin
    let signer, owner, seller, buyer, shop
    const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
    const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)
    const wasmFilePath = "./static/semaphore.wasm"
    const zkeyFilePath = "./static/semaphore.zkey"
    const price = ethers.utils.parseUnits('0.05', 'ether');
    const group = new Group()
    const tokenId = 0
    const bundleId = 0

    console.log({subscriptionName, groupId})

    before(async () => {
        ({ nft, consumable, wrapped, coin } = await run("deploy", { logs: true }))

        /**
         * In Ethers.js, a Signer object represents an Ethereum Account
         * that you can use to sign messages and transactions, and then send
         * signed transactions to the Ethereum Network to execute
         * state-changing operations.
         */
         signer = await ethers.getSigners();
         console.log({signer: signer.length})
         owner = signer[0]
         seller = signer[1]
         buyer = signer[2]
         shop = signer[3]
    })

    describe("# DOSA NFT", () => {
      it("mint nft success", async () => {
          await nft.safeMint(seller.address, 'http://localhost/dosa')

          let ownerNFT = await nft.ownerOf(tokenId);
          expect(ownerNFT)
            .to
            .equal(seller.address);
      })
      it("mint consumable success", async () => {
          await consumable.mint(seller.address, tokenId, 1, 0x00)

          let ownerNFT = await nft.ownerOf(0);
          expect(ownerNFT)
            .to
            .equal(seller.address);
      })
      it("mint coin success", async () => {
        const amount = 1
        await coin.mint(seller.address, amount)

        let ownerCoin = await nft.balanceOf(seller.address);
        expect(ownerCoin)
          .to
          .equal(1);
    })
    })

    describe("# Wrapped NFT", () => {
      it("Should create subscription", async () => {
          const transaction = wrapped.createSubscription(subscriptionName)

          await expect(transaction).to.emit(wrapped, "SubscriptionCreated").withArgs(groupId, subscriptionName)
      })
      it("Should add a member to an existing subscription", async () => {
        wrapped = wrapped.connect(owner)
        for (let i =1; i < 5; i++) {
          const message = await signer[i].signMessage("Sign this message to create your identity!")
            
          const identity = new Identity(message)
          const identityCommitment = identity.generateCommitment()
          const transaction = wrapped.addMember(groupId, identityCommitment)

          const groupRoot = await wrapped.getRoot(groupId)
          const numLeaves = await wrapped.getNumberOfLeaves(groupId)
          // if (i>=3 && i<=4)
          group.addMember(identityCommitment)

          console.log({i, groupRoot, numLeaves})

          await expect(transaction).to.emit(wrapped, "MemberAdded").withArgs(groupId, identityCommitment, groupRoot)
        }
      })
      it("init bundle", async () => {
        const message = await seller.signMessage("Sign this message to create your identity!")
            
        const identity = new Identity(message)

        const signal = "Great!"
        const bytes32Signal = ethers.utils.formatBytes32String(signal)

        const fullProof = await generateProof(identity, group, groupId, signal, {
            wasmFilePath,
            zkeyFilePath
        })
        const solidityProof = packToSolidityProof(fullProof.proof)

        wrapped = wrapped.connect(seller)
        const txInit = wrapped.initializeBundle(seller.address, groupId, bytes32Signal, 
          fullProof.publicSignals.nullifierHash, solidityProof)

        await expect(txInit).to.emit(wrapped, "ProofVerified").withArgs(groupId, bytes32Signal)

        let ownerNFT = await wrapped.ownerOf(0)
        expect(ownerNFT).to.equal(seller.address)
      })
      it("deposit erc721", async () => {

        wrapped = wrapped.connect(seller)
        await nft.connect(seller).approve(wrapped.address, tokenId);
        const tx = wrapped.depositERC721(nft.address, tokenId, bundleId, "NFT 1")
        await expect(tx)
          .to.emit(wrapped, 'DepositERC721').withArgs(seller.address, bundleId, nft.address, tokenId, "NFT 1");

        const ownerNFT = await nft.ownerOf(tokenId)
        expect(ownerNFT).to.equal(wrapped.address)
        // await nft.connect(signer[1]).approve(wrapped.address, 0);
        const bundleAddress = await wrapped.getBundleIdsByAddress(seller.address)
        console.log({bundleAddress: bundleAddress})

        const bundleList = await wrapped.getBundles(bundleId)
        console.log({owner: bundleList.owner, erc721: bundleList.bundleERC721})
      });
      it("sell erc721 to node", async () => {

        wrapped = wrapped.connect(seller)
        // await nft.connect(signer[1]).approve(wrapped.address, 0);
        const tx = wrapped.sell(bundleId, price, shop.address)
        await expect(tx)
          .to.emit(wrapped, 'Sell').withArgs(seller.address, bundleId, price, shop.address);

        const ownerNFT = await nft.ownerOf(tokenId)
        expect(ownerNFT).to.equal(shop.address)
        await nft.connect(shop).approve(wrapped.address, tokenId);
      });
      it("buy erc721", async () => {
        wrapped = wrapped.connect(buyer)
        const tx = wrapped.buy(bundleId, {
          value: price,
          gasLimit: 3000000
        })
        await expect(tx)
          .to.emit(wrapped, 'Buy').withArgs(buyer.address, bundleId, price, shop.address);
        
        const ownerNFT = await nft.ownerOf(tokenId)
        expect(ownerNFT).to.equal(buyer.address)

        wrapped = wrapped.connect(shop)
        await wrapped.burn(bundleId)
      });
    })
})