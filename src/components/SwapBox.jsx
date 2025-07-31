import "./SwapBox.css";
import { FaBitcoin, FaAngleDown, FaExchangeAlt } from "react-icons/fa";

export const SwapBox = () => {
	return (
		<div className="swap-box">
			<div className="swap-section">
				<p className="label">Send</p>
				<div className="input-container">
					<input type="text" placeholder="0" />
					<div className="token-select">
						<span>BTC</span>
						<FaBitcoin />
						<FaAngleDown />
					</div>
				</div>
			</div>

			<div className="divider">
				<FaExchangeAlt />
			</div>

			<div className="swap-section">
				<p className="label">Receive</p>
				<div className="input-container">
					<input type="text" placeholder="0" />
					<div className="token-select">
						<span>Select token</span>
						<FaAngleDown />
					</div>
				</div>
			</div>

			<button className="swap-button">Swap</button>
		</div>
	);
};
