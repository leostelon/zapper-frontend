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

export const CHAIN = ChainsConfig.SEPOLIA;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SEPOLIA_WETH_CA = "0xa6cd47FB9A6D7cFAA08577323f0f31Ed2b20965e";
export const SEPOLIA_ESCROW_FACTORY_CA =
	"0xFBD620A006B85eA9744aB66BA4Ee63C0365C3F47";

export const ERC20_ABI = [
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address",
			},
			{
				name: "",
				type: "address",
			},
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "guy",
				type: "address",
			},
			{
				name: "wad",
				type: "uint256",
			},
		],
		name: "approve",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [],
		name: "deposit",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function",
	},
];
