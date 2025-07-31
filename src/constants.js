export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const ChainsConfig = {
	SEPOLIA: {
		chainId: 11155111,
		chainName: "Ethereum Sepolia",
		nativeCurrency: { name: "Ether", symbol: "sETH", decimals: 18 },
		rpcUrls: ["https://sepolia.infura.io/v3/b9794ad1ddf84dfb8c34d6bb5dca2001"],
		blockExplorerUrls: ["https://sepolia.etherscan.io/"],
	},
};

export const CHAIN = ChainsConfig[11155111];
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
