# Bazaar Zero

Bazaar zero is a decentralized trustless distributed digital marketplace network using Zero Knowledge Proof, Sequence Wallet & Fluence Network on Polygon.

![Bazaar Zero Architecture](/img/Bazaar_Zero.png "Bazaar Zero Architecture")
![Bazaar Zero Asset Wrapper](/img/Bazaar_Zero2.png "Bazaar Zero Asset Wrapper")

## Problem statement
- Seller need more secure platform to sell their digital products without exposing private information such as keys
- Seller did not want to host/market their products only on 1 platform
- Seller want total control of their products

## Use Case
- Every shop node can be run anywhere whether locally or remotely powered by Fluence Network
- Every shop node has their own unique wallet powered by Sequence wallet
- A custom service can be deployed on top of the shop nodes network to gain access of peer information like for this example (Consumer search service)
- Only verified shop node can be allowed to trade (Zero Knowledge Proof)

## Technologies
- Polygon
- Fluence Network
- Zero Knowledge Proof - Semaphore Identity
- Sequence Wallet
- Moralis
- Infura
- React
- Node JS
- Solidity

## Smart Contracts
- Asset Wrapper - https://polygonscan.com/address/0xB9eE9a8a22A4A551E98E901901670aD672ce15Cb
- ERC20 - https://polygonscan.com/address/0xDe96B5c07d2AD92d560eCCce9eE41126CFb10278
- ERC721 - https://polygonscan.com/address/0xFf7ABbEDBe0A0823F906Cb1f476771eF89595546
- ERC1155 - https://polygonscan.com/address/0xAfc5626d16e3A7b6497946d53ae99Dae4E87B5Bb

## Project Breakdown

This projects consists of 3 parts:
| Title | Folder |
| ----- | ------ |
| Zero Knowledge Proof - Semaphore | [semaphore_fluence](https://github.com/iqbalbaharum/bazaar_zero/tree/master/semaphore_fluence)|
| Shop Node | [client](https://github.com/iqbalbaharum/bazaar_zero/tree/master/client) |
| Consumer Search Node | [consumers/search](https://github.com/iqbalbaharum/bazaar_zero/tree/master/consumers/search) |

## Installation
Bazaar Zero requires  [Node.js](https://nodejs.org/) v16 to run.

Install Aqua compiler.
```npm -g install @fluencelabs/aqua```

and to make the Aqua library available to Typescript applications
```npm -g install @fluencelabs/aqua-lib```

copy the ```.env.example``` to ```.env``` and fill accordingly

Install the dependencies and devDependencies and start the server.

```sh
cd semaphore_fluence
npm i
npm run start
```
```sh
cd client
npm i
npm run start
```
```sh
cd consumers/search
npm i
npm run start
```

