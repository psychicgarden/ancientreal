// Wallet connection persistence utilities
const STORAGE_KEYS = {
  LAST_WALLET: 'ancient:lastWallet',
  LAST_ACCOUNT: 'ancient:lastAccount',
  CONNECTION_PREFERENCE: 'ancient:autoConnect'
} as const;

export const WalletStorage = {
  // Save wallet connection preference
  saveWalletConnection: (account: string, walletType: string = 'metamask') => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LAST_WALLET, walletType);
    localStorage.setItem(STORAGE_KEYS.LAST_ACCOUNT, account);
    localStorage.setItem(STORAGE_KEYS.CONNECTION_PREFERENCE, 'true');
  },

  // Get last wallet preference
  getLastWallet: (): { wallet: string | null; account: string | null; shouldAutoConnect: boolean } => {
    if (typeof window === 'undefined') return { wallet: null, account: null, shouldAutoConnect: false };
    
    return {
      wallet: localStorage.getItem(STORAGE_KEYS.LAST_WALLET),
      account: localStorage.getItem(STORAGE_KEYS.LAST_ACCOUNT),
      shouldAutoConnect: localStorage.getItem(STORAGE_KEYS.CONNECTION_PREFERENCE) === 'true'
    };
  },

  // Clear wallet connection data
  clearWalletConnection: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.LAST_WALLET);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACCOUNT);
    localStorage.removeItem(STORAGE_KEYS.CONNECTION_PREFERENCE);
  }
};