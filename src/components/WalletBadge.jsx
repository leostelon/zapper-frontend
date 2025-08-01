import { useEffect, useState } from "react";
import {
	connectWalletToSite,
	getWalletAddress,
	switchChain,
} from "../utils/wallet";
import "./WalletBadge.css";
import { FaEthereum, FaSignOutAlt } from "react-icons/fa";
import { ERC20_ABI, SEPOLIA_WETH_CA } from "../constants";
import Web3 from "web3";
import Loader from "./Loader";
import Notification from "./Notification";
import SideDrawer from "./SideDrawer";

const WalletBadge = () => {
	const [address, setaddress] = useState(null);
	const [swapLoading, setSwapLoading] = useState(false);
	const [notification, setNotification] = useState(null);
	const [openDrawer, setOpenDrawer] = useState(false);

	async function setWalletAddress() {
		const wa = await getWalletAddress();
		if (!wa || wa.length < 6) return;
		setaddress(wa);
	}

	async function handleSwap() {
		if (!address) return alert("Connect your wallet");
		await swapToWeth();
	}

	const showNotification = (msg, type = "info") => {
		setNotification({ msg, type });
	};

	async function swapToWeth() {
		try {
			setSwapLoading(true);
			await switchChain();
			const web3 = new Web3(window.ethereum);
			const tokenContract = new web3.eth.Contract(ERC20_ABI, SEPOLIA_WETH_CA);
			const tx = await tokenContract.methods
				.deposit()
				.send({ from: address, value: Web3.utils.toWei("0.001", "ether") });
			setSwapLoading(false);
			showNotification("Swap completed 🥳", "success");
			return tx;
		} catch (error) {
			console.log(error);
			showNotification("Swap failed", "error");
			setSwapLoading(false);
		}
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
			{notification && (
				<Notification
					message={notification.msg}
					type={notification.type}
					onClose={() => setNotification(null)}
				/>
			)}
			<SideDrawer isOpen={openDrawer} onClose={() => setOpenDrawer(false)}>
				<h2>History</h2>
				<p>This is inside the drawer.</p>
			</SideDrawer>
			<img src="./logo.png" alt="Logo" className="site-logo" />
			<p className="faucet" onClick={handleSwap}>
				{swapLoading ? <Loader /> : "Swap 0.001ETH to WETH"}
			</p>
			<div className="nav-right">
				<button className="history-button" onClick={() => setOpenDrawer(true)}>
					<FaSignOutAlt />
				</button>
				<div className="wallet-badge">
					<span className="wallet-text">
						{address
							? `${address.slice(0, 4)}...${address.slice(-3)}`
							: "Connect"}
					</span>
					<div className="eth-icon">
						<FaEthereum />
					</div>
				</div>
			</div>
		</div>
	);
};

export default WalletBadge;
