import { Group } from "@semaphore-protocol/group"
import identityCommitments from "../static/identityCommitments.json"
import { task, types } from "hardhat/config"
import { Fluence, KeyPair } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
// @ts-ignore
import { poseidon_gencontract } from "circomlibjs"
import abiWrapped from "../artifacts/contracts/AssetWrapper.sol/AssetWrapper.json"

import { generate_proof, is_member } from '../src/_aqua/semaphore'

const relay = krasnodar[0];
const skBytes = 'DbIYns8KclPLTSLZCdei9RkssJ46fbzqD4wfrfXjCu0=';

/**
 *  The `task.setAction` function exposes the `ethers` Javascript library for interacting with Ethereum.
 */
task("deploy", "Deploy a DOSA Marketplace contracts")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }) => {
      const poseidonT3ABI = poseidon_gencontract.generateABI(2)
      const poseidonT3Bytecode = poseidon_gencontract.createCode(2)

      const signer = await ethers.getSigners();

      const PoseidonLibT3Factory = new ethers.ContractFactory(poseidonT3ABI, poseidonT3Bytecode, signer[0])
      const poseidonT3Lib = await PoseidonLibT3Factory.deploy()

      await poseidonT3Lib.deployed()

      logs && console.log(`PoseidonT3 library has been deployed to: ${poseidonT3Lib.address}`)

      const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
          libraries: {
              PoseidonT3: poseidonT3Lib.address
          }
      })
      const incrementalBinaryTreeLib = await IncrementalBinaryTreeLibFactory.deploy()

      await incrementalBinaryTreeLib.deployed()

      logs && console.log(`IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`)
        const VerifierContract = await ethers.getContractFactory("Verifier20")
        const verifier = await VerifierContract.deploy()

        await verifier.deployed()

        logs && console.log(`Verifier contract has been deployed to: ${verifier.address}`)

        const CoinContract = await ethers.getContractFactory("DosaCoin")
        const coin = await CoinContract.deploy()

        await coin.deployed()

        logs && console.log(`Coin contract has been deployed to: ${coin.address}`)

        const NFTContract = await ethers.getContractFactory("DosaNFT")
        const nft = await NFTContract.deploy()

        await nft.deployed()

        logs && console.log(`NFT contract has been deployed to: ${nft.address}`)

        const ConsumableContract = await ethers.getContractFactory("DosaConsumable")
        const consumable = await ConsumableContract.deploy()

        await consumable.deployed()

        logs && console.log(`Consumable contract has been deployed to: ${consumable.address}`)

        const WrappedNFTContract = await ethers.getContractFactory("AssetWrapper", {
          libraries: {
            IncrementalBinaryTree: incrementalBinaryTreeLib.address
          }
        })
        const wrapped = await WrappedNFTContract.deploy("DosaMarketplace", "DosaM", verifier.address, 20)

        await wrapped.deployed()

        const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
        await wrapped.createSubscription(subscriptionName)

        // await wrapped.createGroup(1, 20, 0, signer[0].address)

        logs && console.log(`Wrapped NFT contract has been deployed to: ${wrapped.address}`)
        

        // const GreetersContract = await ethers.getContractFactory("Greeters")

        // const group = new Group()

        // group.addMembers(identityCommitments)

        // console.log({group})

        // const greeters = await GreetersContract.deploy(group.root, verifier.address)

        // await greeters.deployed()

        // logs && console.log(`Greeters contract has been deployed to: ${greeters.address}`)

        return {
          nft,
          consumable,
          wrapped,
          coin
        }
    })
  task("init_bundle", "Initialize bundle asset wrapper")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }) => {

      try {
        await Fluence.start({
            connectTo: relay,
            KeyPair: await KeyPair.fromEd25519SK(Buffer.from(skBytes, 'base64')),
            defaultTtlMs: 15000
        });

        console.log('application started');
        console.log('peer id is: ', Fluence.getStatus().peerId);
        console.log('relay address: ', relay.multiaddr);
        console.log('relay is: ', Fluence.getStatus().relayPeerId);

        const signer = await ethers.getSigners();

        const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
        const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)

        // const proof = {
        //   "byteSignal": "0x6d65737361676500000000000000000000000000000000000000000000000000",
        //   "fullProof": {
        //     "proof": {
        //       "curve": "bn128",
        //       "pi_a": [
        //         "2143959979584264051757004367190744619832743398406757922809900179361524377112",
        //         "5511768726325905335356873458925247414335857788249323311431410355515202757793",
        //         "1"
        //       ],
        //       "pi_b": [
        //         [
        //           "10697226664283972597918199842038112699385146268422980931900557292497564695874",
        //           "16776684893928729274853179679367433747518805994386183098628110990262508385284"
        //         ],
        //         [
        //           "7919580326589778799386153485075592758402849288659708361855027930548288058269",
        //           "6070412366290970540922836584575530241588685554983540079978078152888205507544"
        //         ],
        //         [
        //           "1",
        //           "0"
        //         ]
        //       ],
        //       "pi_c": [
        //         "9418089122171353102404332527122843769252005711793453760313692186684493762339",
        //         "6964102923917313528154803223849389617647340454283742221736100147074551633267",
        //         "1"
        //       ],
        //       "protocol": "groth16"
        //     },
        //     "publicSignals": {
        //       "externalNullifier": "144697982492314917177753111945674633467768426931413132404872536330491568483",
        //       "merkleRoot": "17407215210344901905274401928876794748925941591067660003435448339970643618567",
        //       "nullifierHash": "7670176610235154370267818552088787105964323661601138496105148370813737262501",
        //       "signalHash": "105872545344638755136365035488254451553682718570255048525714426383450050431"
        //     }
        //   },
        //   "solidityProof": [
        //     "2143959979584264051757004367190744619832743398406757922809900179361524377112",
        //     "5511768726325905335356873458925247414335857788249323311431410355515202757793",
        //     "16776684893928729274853179679367433747518805994386183098628110990262508385284",
        //     "10697226664283972597918199842038112699385146268422980931900557292497564695874",
        //     "6070412366290970540922836584575530241588685554983540079978078152888205507544",
        //     "7919580326589778799386153485075592758402849288659708361855027930548288058269",
        //     "9418089122171353102404332527122843769252005711793453760313692186684493762339",
        //     "6964102923917313528154803223849389617647340454283742221736100147074551633267"
        //   ]
        // }
        const message = await signer[1].signMessage("Sign this message to create your identity!")
        // const proof = await generate_proof(message)
        // console.log({proof})

        // let wrapped = new ethers.Contract("0x0165878a594ca255338adfa4d48449f69242eb8f", abiWrapped.abi, signer[1])

        // const tx = await wrapped.initializeBundle(signer[5].address, groupId, proof.byteSignal, 
        //     proof.fullProof.publicSignals.nullifierHash, proof.solidityProof)  
        
        // console.log({tx})
        const isMember = await is_member(message).then(s => {
          console.log({s})
        })
        console.log({isMember})
        await Fluence.stop();
      } catch (err) {
        console.log(err)
      }
    })