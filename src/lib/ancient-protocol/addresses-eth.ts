/**
 * Ancient Lending Protocol - ETH Version Contract Addresses
 * 
 * This is the ETH version for easy testing - no USDT needed!
 * Just send ETH value with transactions.
 */

export const ETH_CONTRACTS = {
  BASE_SEPOLIA: {
    chainId: 84532,
    AncientMortgageETH: "0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1",
    Treasury: "0x966feD85116F6D283921a6ed176D7643a99cbf94",
    explorer: "https://sepolia.basescan.org",
  }
} as const;

export const getETHContract = (chainId: number) => {
  switch (chainId) {
    case 84532:
      return ETH_CONTRACTS.BASE_SEPOLIA.AncientMortgageETH;
    default:
      throw new Error(`ETH contract not deployed on chain ${chainId}`);
  }
};

export const getExplorerUrl = (chainId: number, address: string) => {
  switch (chainId) {
    case 84532:
      return `${ETH_CONTRACTS.BASE_SEPOLIA.explorer}/address/${address}`;
    default:
      return `https://etherscan.io/address/${address}`;
  }
};

