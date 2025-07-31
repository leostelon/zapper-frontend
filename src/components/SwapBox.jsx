import "./SwapBox.css";
import { FaBitcoin, FaEthereum, FaExchangeAlt } from "react-icons/fa";
import TokenSelector from "./TokenSelector";
import { useState } from "react";
import { connectWalletToSite, getWalletAddress } from "../utils/wallet";
import { getQuote } from "../api/quote";
import Web3 from "web3";
import { ZERO_ADDRESS } from "../constants";
import { useEffect } from "react";

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
		} catch (err) {
			console.error("Error:", err.message);
		}
	}

	async function getConnectedWalletAddress() {
		const wa = await getWalletAddress();
		setConnectedWalletAddress(wa);
	}

	function exchangeTokens() {
		setSendToken(receiveToken);
		setReceiveToken(sendToken);
	}

	async function handleSwap() {
		const res = await connectWalletToSite();
		if (res) getConnectedWalletAddress();
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
			<div className="swap-section">
				<p className="label">Send</p>
				<div className="input-container">
					<input
						type="text"
						placeholder="0"
						onChange={(v) => setSendInputAmount(v.currentTarget.value)}
					/>
					<TokenSelector
						selected={sendToken}
						onSelect={setSendToken}
						exclude={receiveToken}
						tokens={availableForSend}
					/>
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
								? Math.floor(
										Web3.utils.fromWei(
											quote.dstTokenAmount,
											sendToken.id === 991 ? "ether" : 8
										) * 1000
								  ) / 1000
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
				{connectedWalletAddress ? "Swap" : "Connect"}
			</button>
		</div>
	);
};
