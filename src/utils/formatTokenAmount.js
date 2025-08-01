import Web3 from "web3";

const tokenDecimals = {
	"0xa6cd47FB9A6D7cFAA08577323f0f31Ed2b20965e": 18,
	"0x0000000000000000000000000000000000000000": 8,
};

export function formatTokenAmount(input, tokenAddress) {
	if (!input) return "0";
	const tD = tokenDecimals[tokenAddress];
	console.log(tD);
	const amount = Web3.utils.fromWei(input, tD);
	const num = parseFloat(amount);
	if (isNaN(num)) return "0";

	const decimals = num < 1 ? 5 : 3;
	return Math.floor(num * 10 ** decimals) / 10 ** decimals;
}
