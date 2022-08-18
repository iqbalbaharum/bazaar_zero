// const { Identity } = require("@semaphore-protocol/identity")
// const { Group } = require("@semaphore-protocol/group")
// const { generateProof, packToSolidityProof } = require("@semaphore-protocol/proof")
// const identityCommitments = require("../static/identityCommitments.json")
// const { expect } = require("chai")

// /* Import the Ethers.js JavaScript library for interacting with Ethereum. */
// const { run, ethers } = require("hardhat")

// describe("Greeters", function () {
//     let contract
//     let signers

//     before(async () => {
//         contract = await run("deploy", { logs: true })

//         /**
//          * In Ethers.js, a Signer object represents an Ethereum Account
//          * that you can use to sign messages and transactions, and then send
//          * signed transactions to the Ethereum Network to execute
//          * state-changing operations.
//          */
//         signers = await ethers.getSigners()
//     })

//     describe("# greet", () => {
//         /** Use the trusted setup files. **/
//         const wasmFilePath = "./static/semaphore.wasm"
//         const zkeyFilePath = "./static/semaphore.zkey"

//         it("Should greet", async () => {
//             const greeting = "Hello world"
//             const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

//             /**
//              * In Ethers.js, Signer.signMessage returns a Promise which resolves to the Raw Signature of a message.
//              * The following code gets the first (Signer) account and assigns the signature Promise to the message variable.
//              */
//             const message = await signers[0].signMessage("Sign this message to create your identity!")
            
//             const identity = new Identity(message)


//             const group = new Group()

//             group.addMembers(identityCommitments)

//             const fullProof = await generateProof(identity, group, group.root, greeting, {
//                 wasmFilePath,
//                 zkeyFilePath
//             })
//             const solidityProof = packToSolidityProof(fullProof.proof)

//             const transaction = contract.greet(
//                 bytes32Greeting,
//                 fullProof.publicSignals.nullifierHash,
//                 solidityProof
//             )

//             console.log({message, identity, fullProof, group, solidityProof})


//             await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
//         })
//     })
// })