import Web3 from "web3";
import { CHAIN } from "../constants";

export async function connectWalletToSite() {
	try {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
			return true;
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
			return true;
		} else {
			console.log(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
			return false;
		}
	} catch (e) {
		if (e.code === 4001) {
			console.log(e.message);
		}
		return false;
	}
}

export async function switchChain() {
	const config = { ...CHAIN };
	config.chainId = Web3.utils.toHex(CHAIN.chainId);

	try {
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: config.chainId }],
		});
	} catch (error) {
		if (error.code === 4902) {
			try {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [config],
				});
			} catch (addError) {
				console.error(addError);
			}
		}
	}
}

export async function getWalletAddress() {
	try {
		const accounts = await window.ethereum.request({
			method: "eth_accounts",
		});
		return accounts[0];
	} catch (error) {
		console.log(error);
	}
}
