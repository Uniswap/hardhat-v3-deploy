# uniswap-v3-deploy-plugin

Deploy Uniswap V3 contracts in development.

## Installation

```sh
$ npm install uniswap-v3-deploy-plugin
```

Import the plugin in your `hardhat.config.js`:

```js
require("uniswap-v3-deploy-plugin");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "uniswap-v3-deploy-plugin";
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
