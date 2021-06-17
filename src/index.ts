import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./type-extensions";

import Table from "cli-table3";

import { UniswapV3Deployer } from "./deployer/UniswapV3Deployer";

task("deploy-uniswap", "Deploys Uniswap V3 contracts", async (args, hre) => {
  const [actor] = await hre.ethers.getSigners();
  const contracts = await UniswapV3Deployer.deploy(actor);

  const table = new Table({
    head: ["Contract", "Address"],
    style: { border: [] },
  });
  for (const item of Object.keys(contracts)) {
    table.push([item, contracts[item].address]);
  }
  console.info(table.toString());
});
