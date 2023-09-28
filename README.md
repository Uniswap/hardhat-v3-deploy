# @tokamak-network/tokamak-uniswap-v3-deploy

Deploy Uniswap V3 contracts in development.

## Installation

### You also need to download hardhat-deploy.

```sh
$ npm install @tokamak-network/tokamak-uniswap-v3-deploy hardhat-deploy
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-deploy");
require("@tokamak-network/tokamak-uniswap-v3-deploy");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-deploy";
import "@tokamak-network/tokamak-uniswap-v3-deploy";
```

Now, run `npx hardhat` and you should see:

```
AVAILABLE TASKS:

  accounts      	Prints the list of accounts
  ...
  tokamak-uniswap-v3-deploy Deploys Uniswap V3 contracts
  ...
  test          	Runs mocha tests
```

If you run `npx hardhat tokamak-uniswap-v3-deploy --help`, you should see:

```
...
Usage: hardhat [GLOBAL OPTIONS] tokamak-uniswap-v3-deploy [--ncl <STRING>] [--w9 <STRING>]

OPTIONS:

  --ncl nativeCurrencyLabel (default: "ETH")
  --w9  WETH9 Address (default: "0x4200000000000000000000000000000000000006")
...
```

Great! Now, to deploy the contracts locally:

```sh
$ npx hardhat tokamak-uniswap-v3-deploy
```

After setting network to tokamak, deploy to tokamak

```sh
$ npx hardhat tokamak-uniswap-v3-deploy --network tokamak
```

If you want to set Native Token Address and nativeCurrencyLabel, for example :

```sh
npx hardhat tokamak-uniswap-v3-deploy --w9 0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2 --ncl TON
```

And you're done. Time to build something great.

## Total Gas Used

30,413,266
