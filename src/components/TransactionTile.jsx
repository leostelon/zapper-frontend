import "./TransactionTile.css";
import { FaArrowRight } from "react-icons/fa";

function TransactionTile({ fromAmount, fromTokens, toAmount, toTokens, date }) {
	function formatReadableTime(isoString) {
		const date = new Date(isoString);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});;
	}

	return (
		<div className="transaction-tile">
			<div className="left-section">
				<p className="amount">{fromAmount}</p>
				<div className="icons">{fromTokens}</div>
				<p className="status">Completed</p>
			</div>

			<div className="arrow-section">
				<FaArrowRight />
			</div>

			<div className="right-section">
				<p className="amount">{toAmount}</p>
				<div className="icons">{toTokens}</div>
				<p className="date">updated {formatReadableTime(date)}</p>
			</div>
		</div>
	);
}

export default TransactionTile;
