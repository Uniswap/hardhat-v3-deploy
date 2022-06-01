# @uniswap/hardhat-v3-deploy

Deploy Uniswap V3 contracts in development.

## Installation

```sh
$ npm install @uniswap/hardhat-v3-deploy
```

Import the plugin in your `hardhat.config.js`:

```js
require("@uniswap/hardhat-v3-deploy");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@uniswap/hardhat-v3-deploy";
```

Now, run `npm run hardhat` and you should see:

```
AVAILABLE TASKS:

  accounts      	Prints the list of accounts
  ...
  deploy-uniswap	Deploys Uniswap V3 contracts
  ...
  test          	Runs mocha tests
```

Great! Now, to deploy the contracts:

```sh
$ npm run hardhat deploy-uniswap
```

And you're done. Time to build something great.

## Plugin Development

TODO
