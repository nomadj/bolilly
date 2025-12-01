// npx hardhat ignition deploy ignition/modules/Counter.ts --network amoy

import type { HardhatUserConfig } from "hardhat/config";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
// import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
// import { config as dotenvConfig } from "dotenv";
import * as dotenv from "dotenv";

// dotenvConfig();
dotenv.config();

console.log("Private key:", JSON.stringify(process.env.PRIVATE_KEY));

const infuraApiKey = process.env.INFURA_API_KEY;
// const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  plugins: [hardhatIgnitionViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20",
      },
      production: {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    amoy: {
      type: "http",
      chainType: "l1",
      // url: `https://polygon-amoy.infura.io/v3/${infuraApiKey}`,
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};

export default config;
