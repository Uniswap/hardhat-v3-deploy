import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./type-extensions";
import { save } from "./util/save_deployed";
import Table from "cli-table3";
import { UniswapV3Deployer } from "./deployer/UniswapV3Deployer";

type Args = { w9: string; ncl: string };
task("tokamak-uniswap-v3-deploy", "Deploys Uniswap V3 contracts")
  .addOptionalParam(
    "w9",
    "WETH9 Address",
    "0x4200000000000000000000000000000000000006",
    types.string
  )
  .addOptionalParam("ncl", "nativeCurrencyLabel", "ETH", types.string)
  .setAction(async (args, hre) => {
    const [actor] = await hre.ethers.getSigners();
    const networkName = hre.network.name;
    const deployResults = await UniswapV3Deployer.deployUniswap(
      args as Args,
      actor,
      hre.deployments
    );
    const contracts = deployResults[0];
    const permit2 = deployResults[1];
    save(networkName, contracts, permit2);
    const table = new Table({
      head: ["Contract", "Address"],
      style: { border: [] },
    });
    for (const item of Object.keys(contracts)) {
      table.push([item, contracts[item].address]);
    }
    table.push(["Permit2", permit2.address]);
    console.info(table.toString());
  });
