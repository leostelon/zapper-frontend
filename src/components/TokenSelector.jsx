import React, { useState } from "react";
import "./TokenSelector.css";
import { FaBitcoin, FaAngleDown, FaTimes } from "react-icons/fa";

const TokenSelector = () => {
	const [showPopup, setShowPopup] = useState(false);

	const tokens = [
		{
			chain: "Bitcoin",
			token: { name: "Bitcoin", symbol: "BTC", icon: <FaBitcoin /> },
		},
		{
			chain: "Solana",
			token: {
				name: "Solana",
				symbol: "SOL",
				icon: (
					<img
						src="https://cryptologos.cc/logos/solana-sol-logo.png"
						alt="sol"
						width="18"
					/>
				),
			},
		},
	];

	const togglePopup = () => setShowPopup(!showPopup);

	return (
		<div className="token-selector-wrapper">
			<div className="select-box" onClick={togglePopup}>
				<span>BTC</span>
				<FaAngleDown />
			</div>

			{showPopup && (
				<div className="popup-overlay" onClick={togglePopup}>
					<div className="popup" onClick={(e) => e.stopPropagation()}>
						<div className="popup-header">
							<span>Select token to send</span>
							<FaTimes onClick={togglePopup} />
						</div>

						<div className="token-list">
							{tokens.map(({ chain, token }, index) => (
								<div key={index} className="token-item">
									<div className="token-icon">{token.icon}</div>
									<div className="token-details">
										<span className="token-name">{token.name}</span>
										<span className="token-symbol">{token.symbol}</span>
									</div>
									<div className="token-chain">{chain}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TokenSelector;
