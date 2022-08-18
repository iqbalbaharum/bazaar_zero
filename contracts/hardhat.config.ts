// require("@nomicfoundation/hardhat-toolbox");
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle"
import "hardhat-dependency-compiler"

/** Import your deploy task */
import "./tasks/deploy"

const { ETHER_SCAN, ALCHEMY_API_KEY_RINKEBY, ALCHEMY_API_KEY_ETH, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      chainId: 31337,
    },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY_ETH}`,
      }
    },
    rinkeby: {
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY_RINKEBY}`,
      accounts: [PRIVATE_KEY as any],
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY as any]
    },
    polygon_testnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: [PRIVATE_KEY as any]
    }
  },
  dependencyCompiler: {
    /** Allows Hardhat to compile the external Verifier.sol contract. */
    paths: ["@semaphore-protocol/contracts/verifiers/Verifier20.sol"]
  }
};

export default config;

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: {
//     version: "0.8.9",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
//   dependencyCompiler: {
//     /** Allows Hardhat to compile the external Verifier.sol contract. */
//     paths: ["@semaphore-protocol/contracts/verifiers/Verifier20.sol"]
//   }
// };
