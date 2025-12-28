require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: '0.8.19',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		sources: 'src/contracts',
		tests: 'test',
		cache: 'cache',
		artifacts: 'artifacts',
	},
	networks: {
		fuji: {
			type: 'http',
			url: 'https://api.avax-test.network/ext/bc/C/rpc',
			chainId: 43113,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			gas: 8000000,
			gasPrice: 25000000000, // 25 gwei
		},
		avalanche: {
			type: 'http',
			url: 'https://api.avax.network/ext/bc/C/rpc',
			chainId: 43114,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			gas: 8000000,
			gasPrice: 25000000000, // 25 gwei
		},
	},
	etherscan: {
		apiKey: {
			avalanche: process.env.SNOWTRACE_API_KEY || '',
			avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
		},
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: 'USD',
		gasPrice: 25,
		token: 'AVAX',
		gasPriceApi: 'https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice',
	},
};
