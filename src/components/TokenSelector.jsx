import { useState } from "react";
import "./TokenSelector.css";
import { FaTimes } from "react-icons/fa";

const TokenSelector = ({ selected, onSelect, exclude, tokens }) => {
	const [showPopup, setShowPopup] = useState(false);
	const filteredTokens = tokens.filter((token) => token.id !== exclude?.id);

	const togglePopup = () => setShowPopup(!showPopup);

	return (
		<div className="token-selector-wrapper">
			<div className="select-box" onClick={togglePopup}>
				{selected ? (
					<>
						{selected.token.icon} {selected.token.symbol}
					</>
				) : (
					"Select Token"
				)}
			</div>

			{showPopup && (
				<div className="popup-overlay" onClick={togglePopup}>
					<div className="popup" onClick={(e) => e.stopPropagation()}>
						<div className="popup-header">
							<span>Select token to send</span>
							<FaTimes onClick={togglePopup} style={{ cursor: "pointer" }} />
						</div>

						<div className="token-list">
							{filteredTokens.map((t, index) => (
								<div
									key={index}
									className="token-item"
									onClick={() => {
										onSelect(t);
										setShowPopup(false);
									}}
								>
									<div className="token-icon">{t.token.icon}</div>
									<div className="token-details">
										<span className="token-name">{t.token.name}</span>
										<span className="token-symbol">{t.token.symbol}</span>
									</div>
									<div className="token-chain">{t.chain}</div>
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
