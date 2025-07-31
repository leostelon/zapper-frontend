import "./SwapBox.css";
import { FaBitcoin, FaEthereum, FaExchangeAlt } from "react-icons/fa";
import TokenSelector from "./TokenSelector";
import { useState } from "react";

const tokens = [
	{
		chain: "Bitcoin Testnet 4",
		id: 991,
		token: { name: "Bitcoin", symbol: "BTC", icon: <FaBitcoin /> },
	},
	{
		chain: "Sepolia",
		id: 11155111,
		token: {
			name: "Ether",
			symbol: "ETH",
			icon: <FaEthereum />,
		},
	},
];

export const SwapBox = () => {
	const [sendToken, setSendToken] = useState(null);
	const [receiveToken, setReceiveToken] = useState(null);

	const availableForSend = tokens.filter((t) => t.id !== receiveToken?.id);
	const availableForReceive = tokens.filter((t) => t.id !== sendToken?.id);

	return (
		<div className="swap-box">
			<div className="swap-section">
				<p className="label">Send</p>
				<div className="input-container">
					<input type="text" placeholder="0" />
					<TokenSelector
						selected={sendToken}
						onSelect={setSendToken}
						exclude={receiveToken}
						tokens={availableForSend}
					/>
				</div>
			</div>

			<div className="divider">
				<FaExchangeAlt />
			</div>

			<div className="swap-section">
				<p className="label">Receive</p>
				<div className="input-container">
					<input type="text" placeholder="0" />
					<TokenSelector
						selected={receiveToken}
						onSelect={setReceiveToken}
						exclude={sendToken}
						tokens={availableForReceive}
					/>
				</div>
			</div>

			<button className="swap-button">Swap</button>
		</div>
	);
};
