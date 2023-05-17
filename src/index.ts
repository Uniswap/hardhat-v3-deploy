import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./type-extensions";
import {save} from "./util/save_deployed";

import Table from "cli-table3";

import { UniswapV3Deployer } from "./deployer/UniswapV3Deployer";

task("tokamak-uniswap-v3-deploy", "Deploys Uniswap V3 contracts", async (args, hre) => {
  const [actor] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  const contracts = await UniswapV3Deployer.deploy(actor);
  save(networkName, contracts);
  const table = new Table({
    head: ["Contract", "Address"],
    style: { border: [] },
  });
  for (const item of Object.keys(contracts)) {
    table.push([item, contracts[item].address]);
  }
  console.info(table.toString());
});
