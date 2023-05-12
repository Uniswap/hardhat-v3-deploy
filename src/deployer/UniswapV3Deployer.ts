import { Signer, Contract, ContractFactory, utils } from "ethers";
import { linkLibraries } from "../util/linkLibraries";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("../abis/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("../abis/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Quoter :require("../abis/Quoter.sol/Quoter.json"),
  QuoterV2 : require("../abis/QuoterV2.sol/QuoterV2.json"),
  TickLens : require("../abis/TickLens.sol/TickLens.json"),
  UniswapInterfaceMulticall : require("../abis/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json"),
  BancorConverterRegistry : require("../abis/BancorConverterRegistry.sol/BancorConverterRegistry.json"),
  SwapRouter02 : require("../abis/SwapRouter02.sol/SwapRouter02.json"),
  UniswapV3PoolSwapTest : require("../abis/UniswapV3PoolSwapTest.sol/UniswapV3PoolSwapTest.json"),
  Multicall : require("../abis/Multicall.sol/Multicall.json")
};

// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IUniswapV3Factory = Contract;

export class UniswapV3Deployer {
  static async deploy(actor: Signer): Promise<{ [name: string]: Contract }> {
    const deployer = new UniswapV3Deployer(actor);
    const WETH9Address = '0x4200000000000000000000000000000000000006';
    const factoryV2Address = "0x0000000000000000000000000000000000000000";
    const factory = await deployer.deployFactory();
    const router = await deployer.deployRouter(factory.address, WETH9Address);
    const nftDescriptorLibrary = await deployer.deployNFTDescriptorLibrary();
    const positionDescriptor = await deployer.deployPositionDescriptor(
      nftDescriptorLibrary.address,
      WETH9Address
    );
    const positionManager = await deployer.deployNonfungiblePositionManager(
      factory.address,
      WETH9Address,
      positionDescriptor.address
    );
    //Quoter, QuoterV2, TickLens,UniswapInterfaceMulticall
    const quoter = await deployer.deployQuoter(factory.address, WETH9Address);
    const quoterV2 = await deployer.deployQuoterV2(factory.address, WETH9Address);
    const tickLens = await deployer.deployTickLens();
    const uniswapInterfaceMulticall = await deployer.deployUniswapInterfaceMulticall();
    const bancorConverterRegistry = await deployer.deployBancorConverterRegistry();
    const swapRouter02 = await deployer.deploySwapRouter02(
      factoryV2Address,
      factory.address,
      positionManager.address,
      WETH9Address
    );
    const uniswapV3PoolSwapTest = await deployer.deployUniswapV3PoolSwapTest();
    const multicall = await deployer.deployMulticall();
  

    return {
      factory,
      router,
      nftDescriptorLibrary,
      positionDescriptor,
      positionManager,
      quoter,
      quoterV2,
      tickLens,
      uniswapInterfaceMulticall,
      bancorConverterRegistry,
      swapRouter02,
      uniswapV3PoolSwapTest,
      multicall
    };
  }

  deployer: Signer;

  constructor(deployer: Signer) {
    this.deployer = deployer;
  }

  async deployMulticall(){
    return await this.deployContract<Contract>(
      artifacts.Multicall.abi,
      artifacts.Multicall.bytecode,
      [],
      this.deployer
    );
  }

  async deployUniswapV3PoolSwapTest(){
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
  ){
    return await this.deployContract<Contract>(
      artifacts.SwapRouter02.abi,
      artifacts.SwapRouter02.bytecode,
      [factoryV2Address, factoryV3Address, positionManagerAddress, weth9Address],
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

  async deployQuoter(
    factoryAddress: string,
    weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.Quoter.abi,
      artifacts.Quoter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployTickLens(){
    return await this.deployContract<Contract>(
      artifacts.TickLens.abi,
      artifacts.TickLens.bytecode,
      [],
      this.deployer
    );
  }

  async deployUniswapInterfaceMulticall(){
    return await this.deployContract<Contract>(
      artifacts.UniswapInterfaceMulticall.abi,
      artifacts.UniswapInterfaceMulticall.bytecode,
      [],
      this.deployer
    );
  }

  async deployQuoterV2(
    factoryAddress: string,
    weth9Address: string) {
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
    weth9Address: string
  ) {
    const linkedBytecode = linkLibraries(
      {
        bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
        linkReferences: {
          "NFTDescriptor.sol": {
            NFTDescriptor: [
              {
                length: 20,
                start: 1577,
              },
            ],
          },
        },
      },
      {
        NFTDescriptor: nftDescriptorLibraryAddress,
      }
    );
    const nativeCurrencyLabelBytes = await utils.keccak256(utils.toUtf8Bytes("TON"));
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
