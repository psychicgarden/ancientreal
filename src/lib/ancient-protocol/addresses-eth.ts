/**
 * Ancient Lending Protocol - ETH Version Contract Addresses
 * 
 * This is the ETH version for easy testing - no USDT needed!
 * Just send ETH value with transactions.
 */

export const ETH_CONTRACTS = {
  BASE_SEPOLIA: {
    chainId: 84532,
    AncientMortgageETH: "0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc",
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

