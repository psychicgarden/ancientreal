require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');

module.exports = {
	solidity: {
		version: '0.8.19',
		settings: {
			optimizer: { enabled: true, runs: 200 },
			viaIR: true,
		},
	},
	paths: {
		sources: 'src/contracts',
		tests: 'test',
	},
};