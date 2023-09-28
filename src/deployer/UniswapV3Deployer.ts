import { Signer, Contract, ContractFactory, utils, BigNumber } from "ethers";
import { linkLibraries } from "../util/linkLibraries";
import {
  Receipt,
  DeployResult,
  DeploymentsExtension,
} from "hardhat-deploy/types";

type ContractJson = { abi: any; bytecode: string };
type Args = { w9: string; ncl: string };
interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;

  removed: boolean;

  address: string;
  data: string;

  topics: Array<string>;

  transactionHash: string;
  logIndex: number;
}
interface TransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  root?: string;
  gasUsed: BigNumber;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<Log>;
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: BigNumber;
  byzantium: boolean;
  status?: number;
}
interface UniversalRouterParams {
  permit2: string;
  weth9: string;
  steth: string;
  wsteth: string;
  seaportV1_5: string;
  seaportV1_4: string;
  openseaConduit: string;
  nftxZap: string;
  x2y2: string;
  foundation: string;
  sudoswap: string;
  elementMarket: string;
  nft20Zap: string;
  cryptopunks: string;
  looksRareV2: string;
  routerRewardsDistributor: string;
  looksRareRewardsDistributor: string;
  looksRareToken: string;
  v2Factory: string;
  v3Factory: string;
  pairInitCodeHash: string;
  poolInitCodeHash: string;
}
const artifacts: { [name: string]: ContractJson } = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Quoter: require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"),
  QuoterV2: require("@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"),
  TickLens: require("@uniswap/v3-periphery/artifacts/contracts/lens/TickLens.sol/TickLens.json"),
  UniswapInterfaceMulticall: require("@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json"),
  SwapRouter02: require("@uniswap/swap-router-contracts/artifacts/contracts/SwapRouter02.sol/SwapRouter02.json"),
  UniswapV3PoolSwapTest: require("../abis/UniswapV3PoolSwapTest.sol/UniswapV3PoolSwapTest.json"), //from v3-core/contracts/test
  BancorConverterRegistry: require("../abis/BancorConverterRegistry.sol/BancorConverterRegistry.json"),
  Multicall2: require("../abis/Multicall2.sol/Multicall2.json"),
  Permit2: require("../abis/Permit2.sol/Permit2.json"),
  UnsupportedProtocol: require("../abis/UnsupportedProtocol.sol/UnsupportedProtocol.json"),
  UniversalRouter: require("../abis/UniversalRouter.sol/UniversalRouter.json"),
};

// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IUniswapV3Factory = Contract;

export class UniswapV3Deployer {
  static async deployUniswap(
    args: Args,
    actor: Signer,
    deployments: DeploymentsExtension
  ): Promise<[{ [name: string]: Contract }, DeployResult]> {
    const deployer = new UniswapV3Deployer(actor);
    const { w9: WETH9Address, ncl: nativeCurrencyLabel } = args;
    console.log("WETH9Address", WETH9Address);
    console.log("nativeCurrencyLabel", nativeCurrencyLabel);
    const factoryV2Address = "0x0000000000000000000000000000000000000000";
    let allGasUsed = BigNumber.from("0");
    let txReceipt: TransactionReceipt;
    //factory
    const factory = await deployer.deployFactory();
    txReceipt = await factory.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //router
    const router = await deployer.deployRouter(factory.address, WETH9Address);
    txReceipt = await router.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    // nftDescriptorLibrary
    const nftDescriptorLibrary = await deployer.deployNFTDescriptorLibrary();
    txReceipt = await nftDescriptorLibrary.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //positionDescriptor
    const positionDescriptor = await deployer.deployPositionDescriptor(
      nftDescriptorLibrary.address,
      WETH9Address,
      nativeCurrencyLabel
    );
    txReceipt = await positionDescriptor.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //positionManager
    const positionManager = await deployer.deployNonfungiblePositionManager(
      factory.address,
      WETH9Address,
      positionDescriptor.address
    );
    txReceipt = await positionManager.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //Quoter
    const quoter = await deployer.deployQuoter(factory.address, WETH9Address);
    txReceipt = await quoter.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //QuoterV2
    const quoterV2 = await deployer.deployQuoterV2(
      factory.address,
      WETH9Address
    );
    txReceipt = await quoterV2.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //TickLens
    const tickLens = await deployer.deployTickLens();
    txReceipt = await tickLens.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //UniswapInterfaceMulticall
    const uniswapInterfaceMulticall = await deployer.deployUniswapInterfaceMulticall();
    txReceipt = await uniswapInterfaceMulticall.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //BancorConverterRegistry
    const bancorConverterRegistry = await deployer.deployBancorConverterRegistry();
    txReceipt = await bancorConverterRegistry.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //SwapRouter02
    const swapRouter02 = await deployer.deploySwapRouter02(
      factoryV2Address,
      factory.address,
      positionManager.address,
      WETH9Address
    );
    txReceipt = await swapRouter02.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //UniswapV3PoolSwapTest
    const uniswapV3PoolSwapTest = await deployer.deployUniswapV3PoolSwapTest();
    txReceipt = await uniswapV3PoolSwapTest.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //Multicall2
    const multicall2 = await deployer.deployMulticall2();
    txReceipt = await multicall2.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //Permit2
    const permit2 = await deployer.deployPermit2(deployments);
    const permit2Receipt = permit2.receipt as Receipt;
    allGasUsed = allGasUsed.add(permit2Receipt.gasUsed);
    //UnsupportedProtocol
    const unsupportedProtocol = await deployer.deployUnsupportedProtocol();
    txReceipt = await unsupportedProtocol.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);
    //UniversalRouter
    const universalRouter = await deployer.deployUniversalRouter({
      permit2: permit2.address,
      weth9: WETH9Address,
      steth: unsupportedProtocol.address,
      wsteth: unsupportedProtocol.address,
      seaportV1_5: unsupportedProtocol.address,
      seaportV1_4: unsupportedProtocol.address,
      openseaConduit: unsupportedProtocol.address,
      nftxZap: unsupportedProtocol.address,
      x2y2: unsupportedProtocol.address,
      foundation: unsupportedProtocol.address,
      sudoswap: unsupportedProtocol.address,
      elementMarket: unsupportedProtocol.address,
      nft20Zap: unsupportedProtocol.address,
      cryptopunks: unsupportedProtocol.address,
      looksRareV2: unsupportedProtocol.address,
      routerRewardsDistributor: unsupportedProtocol.address,
      looksRareRewardsDistributor: unsupportedProtocol.address,
      looksRareToken: unsupportedProtocol.address,
      v2Factory: unsupportedProtocol.address,
      v3Factory: factory.address,
      pairInitCodeHash:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      poolInitCodeHash:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    });
    txReceipt = await universalRouter.deployTransaction.wait();
    allGasUsed = allGasUsed.add(txReceipt.gasUsed);

    console.log("allGasUsed", allGasUsed.toString());

    return [
      {
        UniswapV3Factory: factory,
        SwapRouter: router,
        NFTDescriptor: nftDescriptorLibrary,
        NonfungibleTokenPositionDescriptor: positionDescriptor,
        NonfungiblePositionManager: positionManager,
        Quoter: quoter,
        QuoterV2: quoterV2,
        TickLens: tickLens,
        UniswapInterfaceMulticall: uniswapInterfaceMulticall,
        BancorConverterRegistry: bancorConverterRegistry,
        SwapRouter02: swapRouter02,
        UniswapV3PoolSwapTest: uniswapV3PoolSwapTest,
        Multicall2: multicall2,
        UnsupportedProtocol: unsupportedProtocol,
        UniversalRouter: universalRouter,
      },
      permit2,
    ];
  }

  deployer: Signer;

  constructor(deployer: Signer) {
    this.deployer = deployer;
  }

  async deployPermit2(deployments: DeploymentsExtension) {
    return await deployments.deploy("Permit2", {
      from: await this.deployer.getAddress(),
      args: [],
      deterministicDeployment:
        "0x00000000000000000000000000000000000000005eb67581652632000a6cbedf",
      contract: {
        abi: artifacts.Permit2.abi,
        bytecode: artifacts.Permit2.bytecode,
      },
    });
  }

  async deployUnsupportedProtocol() {
    return await this.deployContract<Contract>(
      artifacts.UnsupportedProtocol.abi,
      artifacts.UnsupportedProtocol.bytecode,
      [],
      this.deployer
    );
  }

  async deployUniversalRouter(params: UniversalRouterParams) {
    return await this.deployContract<Contract>(
      artifacts.UniversalRouter.abi,
      artifacts.UniversalRouter.bytecode,
      [params],
      this.deployer
    );
  }

  async deployMulticall2() {
    return await this.deployContract<Contract>(
      artifacts.Multicall2.abi,
      artifacts.Multicall2.bytecode,
      [],
      this.deployer
    );
  }

  async deployUniswapV3PoolSwapTest() {
    return await this.deployContract<Contract>(
      artifacts.UniswapV3PoolSwapTest.abi,
      artifacts.UniswapV3PoolSwapTest.bytecode,
      [],
      this.deployer
    );
  }

  async deploySwapRouter02(
    factoryV2Address: string,
    factoryV3Address: string,
    positionManagerAddress: string,
    weth9Address: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.SwapRouter02.abi,
      artifacts.SwapRouter02.bytecode,
      [
        factoryV2Address,
        factoryV3Address,
        positionManagerAddress,
        weth9Address,
      ],
      this.deployer
    );
  }

  async deployBancorConverterRegistry() {
    return await this.deployContract<Contract>(
      artifacts.BancorConverterRegistry.abi,
      artifacts.BancorConverterRegistry.bytecode,
      [],
      this.deployer
    );
  }

  async deployQuoter(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.Quoter.abi,
      artifacts.Quoter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployTickLens() {
    return await this.deployContract<Contract>(
      artifacts.TickLens.abi,
      artifacts.TickLens.bytecode,
      [],
      this.deployer
    );
  }

  async deployUniswapInterfaceMulticall() {
    return await this.deployContract<Contract>(
      artifacts.UniswapInterfaceMulticall.abi,
      artifacts.UniswapInterfaceMulticall.bytecode,
      [],
      this.deployer
    );
  }

  async deployQuoterV2(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.QuoterV2.abi,
      artifacts.QuoterV2.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployFactory() {
    return await this.deployContract<Contract>(
      artifacts.UniswapV3Factory.abi,
      artifacts.UniswapV3Factory.bytecode,
      [],
      this.deployer
    );
  }

  async deployWETH9() {
    return await this.deployContract<Contract>(
      artifacts.WETH9.abi,
      artifacts.WETH9.bytecode,
      [],
      this.deployer
    );
  }

  async deployRouter(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.SwapRouter.abi,
      artifacts.SwapRouter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployNFTDescriptorLibrary() {
    return await this.deployContract<Contract>(
      artifacts.NFTDescriptor.abi,
      artifacts.NFTDescriptor.bytecode,
      [],
      this.deployer
    );
  }

  async deployPositionDescriptor(
    nftDescriptorLibraryAddress: string,
    weth9Address: string,
    nativeCurrencyLabel: string
  ) {
    const linkedBytecode = linkLibraries(
      {
        bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
        linkReferences: {
          "NFTDescriptor.sol": {
            NFTDescriptor: [
              {
                length: 20,
                start: 1681,
              },
            ],
          },
        },
      },
      {
        NFTDescriptor: nftDescriptorLibraryAddress,
      }
    );
    const nativeCurrencyLabelBytes = await utils.keccak256(
      utils.toUtf8Bytes(nativeCurrencyLabel)
    );
    return (await this.deployContract(
      artifacts.NonfungibleTokenPositionDescriptor.abi,
      linkedBytecode,
      [weth9Address, nativeCurrencyLabelBytes],
      this.deployer
    )) as Contract;
  }

  async deployNonfungiblePositionManager(
    factoryAddress: string,
    weth9Address: string,
    positionDescriptorAddress: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.NonfungiblePositionManager.abi,
      artifacts.NonfungiblePositionManager.bytecode,
      [factoryAddress, weth9Address, positionDescriptorAddress],
      this.deployer
    );
  }

  private async deployContract<T>(
    abi: any,
    bytecode: string,
    deployParams: Array<any>,
    actor: Signer
  ) {
    const factory = new ContractFactory(abi, bytecode, actor);
    return await factory.deploy(...deployParams);
  }
}
