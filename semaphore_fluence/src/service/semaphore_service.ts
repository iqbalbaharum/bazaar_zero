import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { ISemaphoreServiceDef, Generate_proofResult } from '../_aqua/semaphore'
import Web3 from 'web3'
import { ethers } from 'ethers'
import fs, { readFileSync } from 'fs'
import AssetWrapperAbi from '../data/AssetWrapper_abi.json'
// import identityFile from '../../static/identityCommitments.json'

const wasmFilePath = "./static/semaphore.wasm"
const zkeyFilePath = "./static/semaphore.zkey"

export class SemaphoreService implements ISemaphoreServiceDef {

  async add_member(message: string): Promise<Generate_proofResult> {
    let resp: Generate_proofResult = {
      byteSignal: '',
      fullProof: {
        proof: {
          curve: '',
          pi_a: [''],
          pi_b: [['']],
          pi_c: [''],
          protocol: ''
        },
        publicSignals: {
          externalNullifier: '',
          merkleRoot: '',
          nullifierHash: '',
          signalHash: ''
        }
      },
      solidityProof: ['','','','','','','','']

    }

    const web3 = new Web3(process.env.ETH_RPC_URL_HTTP as string)

    try {
        web3.eth.accounts.wallet.add(process.env.ETH_PRIVATE_KEY as string)
        const contract = new web3.eth.Contract(AssetWrapperAbi as any, process.env.ASSET_WRAPPER_NFT)

        const identity = new Identity(message)
        const identityCommitment = identity.generateCommitment()

        const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
        const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)

        const group = new Group()
        const identityFile = readFileSync(__dirname + '/../../static/identityCommitments.json', 'utf-8')
        let identityJson: string[] = JSON.parse(identityFile)

        if (identityJson.indexOf(identityCommitment.toString()) < 0) {
          identityJson = [...identityJson, identityCommitment.toString()]

          await contract.methods.addMember(groupId, identityCommitment).send({
            from: process.env.ETH_PUBLIC_KEY,
            gasPrice: 5000000,
            gas: 10000000
          })

        }
        group.addMembers(identityJson)

        const numLeaves = await contract.methods.getNumberOfLeaves(groupId).call()

        const signal = 'bazaar zero'
        const bytes32Signal = ethers.utils.formatBytes32String(signal)

        const fullProof = await generateProof(identity, group, groupId, signal, {
            wasmFilePath,
            zkeyFilePath
        })

        const solidityProof = packToSolidityProof(fullProof.proof)

        console.log({numLeaves, fullProof})
        
        console.log({group: group.members})

        let idJson = []

        for (const member of group.members) {
          idJson.push(member.toString())
        }
        fs.writeFileSync(__dirname + '/../../static/identityCommitments.json', JSON.stringify(idJson));

        return {
          byteSignal: bytes32Signal,
          fullProof: {
            proof: {
              curve: fullProof.proof.curve,
              pi_a: fullProof.proof.pi_a.map(p => p.toString()),
              pi_b: fullProof.proof.pi_b.map(p => p.map(pp => pp.toString())),
              pi_c: fullProof.proof.pi_c.map(p => p.toString()),
              protocol: fullProof.proof.protocol
            },
            publicSignals: {
              externalNullifier: fullProof.publicSignals.externalNullifier.toString(),
              merkleRoot: fullProof.publicSignals.merkleRoot.toString(),
              nullifierHash: fullProof.publicSignals.nullifierHash.toString(),
              signalHash: fullProof.publicSignals.signalHash.toString()
            }
          },
          solidityProof: solidityProof.map(s => s.toString())
        }
    } catch (e) {
      console.log(e)
    }
    return resp

  }

  is_member(message: string): boolean {
    let isMember = false
    try {
      const identity = new Identity(message)
      const identityCommitment = identity.generateCommitment()

      const identityFile = readFileSync(__dirname + '/../../static/identityCommitments.json', 'utf-8')
      let identityJson: string[] = JSON.parse(identityFile)

      console.log({identityJson})

      return identityJson.indexOf(identityCommitment.toString()) > -1
    } catch (e) {
      console.log(e)
    }

    return isMember
  }
}