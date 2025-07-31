import { useEffect, useState } from "react";
import { connectWalletToSite, getWalletAddress } from "../utils/wallet";
import "./WalletBadge.css";
import { FaEthereum } from "react-icons/fa";

const WalletBadge = () => {
	const [address, setaddress] = useState(null);

	async function setWalletAddress() {
		const wa = await getWalletAddress();
		if (!wa || wa.length < 6) return;
		setaddress(`${wa.slice(0, 4)}...${wa.slice(-3)}`);
	}

	useEffect(() => {
		setWalletAddress();
	}, []);

	return (
		<div
			className="wallet-badge-container"
			onClick={async () => {
				if (!address) {
					const res = await connectWalletToSite();
					if (res) setWalletAddress();
				}
			}}
		>
			<img src="./logo.png" alt="Logo" className="site-logo" />
			<div className="wallet-badge">
				<span className="wallet-text">{address ?? "Connect"}</span>
				<div className="eth-icon">
					<FaEthereum />
				</div>
			</div>
		</div>
	);
};

export default WalletBadge;
