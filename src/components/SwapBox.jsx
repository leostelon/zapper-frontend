import "./SwapBox.css";
import { FaExchangeAlt } from "react-icons/fa";
import TokenSelector from "./TokenSelector";

export const SwapBox = () => {
	return (
		<div className="swap-box">
			<div className="swap-section">
				<p className="label">Send</p>
				<div className="input-container">
					<input type="text" placeholder="0" />
					<TokenSelector />
				</div>
			</div>

			<div className="divider">
				<FaExchangeAlt />
			</div>

			<div className="swap-section">
				<p className="label">Receive</p>
				<div className="input-container">
					<input type="text" placeholder="0" />
					<TokenSelector />
				</div>
			</div>

			<button className="swap-button">Swap</button>
		</div>
	);
};
