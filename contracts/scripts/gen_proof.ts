#!/usr/bin/env node

import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
// import hre from 'hardhat'
// import "@nomiclabs/hardhat-ethers";
import { ethers } from 'ethers';
import Web3 from 'web3'
import { generate_proof, is_member } from '../src/_aqua/semaphore';

import abiWrapped from "../artifacts/contracts/AssetWrapper.sol/AssetWrapper.json"
const pk = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"

const main = async () => {
    // each compiled aqua function require a connected client
    await Fluence.start({ 
        connectTo: krasnodar[0],
        defaultTtlMs: 15000
     });
    const web3 = new Web3("http://127.0.0.1:8545" as string)
    const acc = web3.eth.accounts.wallet.add( pk as string)
    console.log({acc})

    const contract = new web3.eth.Contract(abiWrapped.abi as any, "0x0165878A594ca255338adfa4d48449f69242Eb8F")

    const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
    const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)

    const proof = await generate_proof(acc.address)
    console.log({proof})

    await contract.methods.initializeBundle(acc.address, groupId, proof.byteSignal,
      proof.fullProof.publicSignals.nullifierHash, proof.solidityProof).send({
      from: acc.address,
      gas: 5000000
    })

    const balanceOf = await contract.methods.balanceOf(acc.address).call()
    console.log({balanceOf})

    // const sign = await web3.eth.accounts.sign('Sign this message to create your identity!', pk)
    // const message = await signer[1].signMessage("Sign this message to create your identity!")
   

    // let wrapped = new hre.ethers.Contract("0x0165878a594ca255338adfa4d48449f69242eb8f", abiWrapped.abi, signer[1])

    // const tx = await wrapped.initializeBundle(signer[5].address, groupId, proof.byteSignal, 
    //     proof.fullProof.publicSignals.nullifierHash, proof.solidityProof) 
        
    // console.log({value: tx.value})

    const result = await is_member(acc.address);
    console.log(result);

    // const owner = await wrapped.ownerOf(tx.value)

    // console.log({owner})

    process.exit(0);
};

main().catch((err) => {
    console.log(err);
    process.exit(1);
});