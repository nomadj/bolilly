// npx hardhat ignition deploy ignition/modules/Counter.ts --network amoy

import type { HardhatUserConfig } from "hardhat/config";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
// import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const infuraApiKey = process.env.INFURA_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  plugins: [hardhatIgnitionViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
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
      url: `https://polygon-amoy.infura.io/v3/${infuraApiKey}`,
      accounts: privateKey ? [privateKey] : []
    },
  },
};

export default config;
