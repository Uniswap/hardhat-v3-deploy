# @uniswap/hardhat-v3-deploy

Deploy Uniswap V3 contracts in development.

## Installation

```sh
$ npm install @justin-gee/uniswap-tokamak-hardhat-v3-deploy
```

Import the plugin in your `hardhat.config.js`:

```js
require("@justin-gee/uniswap-tokamak-hardhat-v3-deploy");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@justin-gee/uniswap-tokamak-hardhat-v3-deploy";
```

Now, run `npx hardhat` and you should see:

```
AVAILABLE TASKS:

  accounts      	Prints the list of accounts
  ...
  tokamak-uniswap-v3-deploy	Deploys Uniswap V3 contracts
  ...
  test          	Runs mocha tests
```

Great! Now, to deploy the contracts:

```sh
$ npx hardhat tokamak-uniswap-v3-deploy
```

And you're done. Time to build something great.

## Plugin Development

TODO
