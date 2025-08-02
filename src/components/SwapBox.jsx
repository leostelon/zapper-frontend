import "./SwapBox.css";
import { FaBitcoin, FaEthereum, FaExchangeAlt, FaWallet } from "react-icons/fa";
import TokenSelector from "./TokenSelector";
import { useState } from "react";
import { connectWalletToSite, getWalletAddress } from "../utils/wallet";
import { getQuote } from "../api/quote";
import Web3 from "web3";
import {
	ERC20_ABI,
	SEPOLIA_ESCROW_FACTORY_CA,
	SEPOLIA_WETH_CA,
	ZERO_ADDRESS,
} from "../constants";
import { useEffect } from "react";
import { crypto as bjsCrypto } from "bitcoinjs-lib";
import { createOrder } from "../api/order";
import { BN } from "bn.js";
import Notification from "./Notification";
import Loader from "./Loader";
import { formatTokenAmount } from "../utils/formatTokenAmount";

const tokens = [
	{
		chain: "Bitcoin Testnet 4",
		id: 991,
		token: {
			address: ZERO_ADDRESS,
			name: "Bitcoin",
			symbol: "BTC",
			icon: <FaBitcoin />,
		},
	},
	{
		chain: "Sepolia",
		id: 11155111,
		token: {
			address: "0xa6cd47FB9A6D7cFAA08577323f0f31Ed2b20965e",
			name: "Ether",
			symbol: "ETH",
			icon: <FaEthereum />,
		},
	},
];

export const SwapBox = () => {
	const [sendToken, setSendToken] = useState(null);
	const [receiveToken, setReceiveToken] = useState(null);
	const [connectedWalletAddress, setConnectedWalletAddress] = useState(null);
	const [quote, setQuote] = useState(null);
	const [sendInputAmount, setSendInputAmount] = useState(null);
	const [sendTokenBalance, setSendTokenBalance] = useState(null);
	const [swapLoading, setSwapLoading] = useState(false);
	const [notification, setNotification] = useState(null);

	const availableForSend = tokens.filter((t) => t.id !== receiveToken?.id);
	const availableForReceive = tokens.filter((t) => t.id !== sendToken?.id);

	async function fetchQuote(enableEstimate = false) {
		try {
			if (!sendToken || !receiveToken || !sendInputAmount) {
				setQuote(null);
				return;
			}
			let amount = Web3.utils.toWei(sendInputAmount, 18);
			const isBitcoin = sendToken.id === 991;
			if (isBitcoin) amount = Web3.utils.toWei(sendInputAmount, 8);
			const result = await getQuote({
				srcChainId: sendToken.id,
				dstChainId: receiveToken.id,
				srcTokenAddress: sendToken.token.address,
				dstTokenAddress: receiveToken.token.address,
				amount,
				walletAddress: connectedWalletAddress ?? ZERO_ADDRESS,
				enableEstimate,
			});
			setQuote(result);
			return result;
		} catch (err) {
			console.error("Error:", err.message);
		}
	}

	async function getConnectedWalletAddress() {
		const wa = await getWalletAddress();
		if (wa) {
			setConnectedWalletAddress(wa);
			const b = await getERC20Balance(wa);
			setSendTokenBalance(b);
		}
	}

	async function checkAndApproveERC20(requiredAmount) {
		const web3 = new Web3(window.ethereum);
		const tokenContract = new web3.eth.Contract(ERC20_ABI, SEPOLIA_WETH_CA);

		const currentBalance = await tokenContract.methods
			.balanceOf(connectedWalletAddress)
			.call();
		if (new BN(currentBalance).lt(new BN(requiredAmount)))
			return alert("Insufficient WETH balance.");
		const currentAllowance = await tokenContract.methods
			.allowance(connectedWalletAddress, SEPOLIA_ESCROW_FACTORY_CA)
			.call();
		if (new BN(currentAllowance).lt(new BN(requiredAmount))) {
			console.log("Approving token...");
			const tx = await tokenContract.methods
				.approve(SEPOLIA_ESCROW_FACTORY_CA, requiredAmount)
				.send({ from: connectedWalletAddress });
			return tx;
		} else {
			console.log("Already approved.");
			return null;
		}
	}

	function exchangeTokens() {
		setSendToken(receiveToken);
		setReceiveToken(sendToken);
	}

	const showNotification = (msg, type = "info") => {
		setNotification({ msg, type });
	};

	async function handleSwap() {
		try {
			setSwapLoading(true);
			if (!connectedWalletAddress) {
				const res = await connectWalletToSite();
				if (res) getConnectedWalletAddress();
			} else {
				const quote = await fetchQuote(true);
				await checkAndApproveERC20(quote.srcTokenAmount);
				const preimage = generateRandomHex();
				const preimageBuffer = Buffer.from(preimage);
				const hash = bjsCrypto.hash160(preimageBuffer);
				await handleCreateOrder(preimage, hash.toString("hex"), quote._id);
			}
			showNotification("Created order🥳", "success");
			setSwapLoading(false);
		} catch (error) {
			console.log(error);
			setSwapLoading(false);
			showNotification(error.message, "error");
		}
	}

	function generateRandomHex(size = 16) {
		const array = new Uint8Array(size);
		crypto.getRandomValues(array);
		return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
	}

	async function handleCreateOrder(preimage, secret_hash, quote_id) {
		try {
			const response = await createOrder(secret_hash, quote_id);
			localStorage.setItem(response._id, preimage);
			return response;
		} catch (err) {
			console.error("Error:", err.message);
		}
	}

	async function getERC20Balance(walletAddress) {
		const web3 = new Web3(window.ethereum);
		const contract = new web3.eth.Contract(ERC20_ABI, SEPOLIA_WETH_CA);
		try {
			const balance = await contract.methods.balanceOf(walletAddress).call();
			return balance;
		} catch (err) {
			console.error("Failed to fetch token balance:", err);
			return null;
		}
	}

	useEffect(() => {
		getConnectedWalletAddress();
		const handler = setTimeout(() => {
			fetchQuote();
		}, 500);
		return () => clearTimeout(handler);
	}, [sendToken, receiveToken, sendInputAmount]);

	return (
		<div className="swap-box">
			{notification && (
				<Notification
					message={notification.msg}
					type={notification.type}
					onClose={() => setNotification(null)}
				/>
			)}
			<div className="swap-section">
				<div className="input-container">
					<div style={{ height: "100%" }}>
						<p
							className="label"
							style={{ marginTop: "0", marginBottom: "12px" }}
						>
							Send
						</p>
						<input
							type="text"
							placeholder="0"
							onChange={(v) => setSendInputAmount(v.currentTarget.value)}
						/>
					</div>
					<div className="token-selector-wrapper">
						<div className="balance-row">
							<FaWallet className="balance-icon" />
							<span className="balance-text">
								{formatTokenAmount(sendTokenBalance, SEPOLIA_WETH_CA) ?? "0.00"}{" "}
								{sendToken?.token?.symbol}
							</span>
						</div>
						<TokenSelector
							selected={sendToken}
							onSelect={setSendToken}
							exclude={receiveToken}
							tokens={availableForSend}
						/>
					</div>
				</div>
			</div>

			<div className="divider" onClick={exchangeTokens}>
				<FaExchangeAlt />
			</div>

			<div className="swap-section">
				<p className="label">Receive</p>
				<div className="input-container">
					<input
						type="text"
						placeholder="0"
						value={
							quote
								? formatTokenAmount(quote.dstTokenAmount, quote.dstTokenAddress)
								: "0"
						}
					/>
					<TokenSelector
						selected={receiveToken}
						onSelect={setReceiveToken}
						exclude={sendToken}
						tokens={availableForReceive}
					/>
				</div>
			</div>

			<button
				className="swap-button"
				onClick={handleSwap}
				style={{
					backgroundColor: quote ? "#7979f6ff" : "#e2e2f4",
					color: "#ffffff",
				}}
			>
				{connectedWalletAddress ? swapLoading ? <Loader /> : "Swap" : "Connect"}
			</button>
		</div>
	);
};
