import { useEffect, useState } from "react";
import {
	connectWalletToSite,
	getWalletAddress,
	switchChain,
} from "../utils/wallet";
import "./WalletBadge.css";
import { FaBitcoin, FaEthereum, FaSignOutAlt } from "react-icons/fa";
import { ERC20_ABI, SEPOLIA_WETH_CA } from "../constants";
import Web3 from "web3";
import Loader from "./Loader";
import Notification from "./Notification";
import SideDrawer from "./SideDrawer";
import TransactionTile from "./TransactionTile";
import { getOrder, getOrders, redeemOrder } from "../api/order";
import { formatTokenAmount } from "../utils/formatTokenAmount";
import { getLastElement } from "../utils/getLastElement";

const WalletBadge = () => {
	const [address, setaddress] = useState(null);
	const [swapLoading, setSwapLoading] = useState(false);
	const [notification, setNotification] = useState(null);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [orders, setOrders] = useState([]);
	let redeemInterval;

	async function setWalletAddress() {
		const wa = await getWalletAddress();
		if (!wa || wa.length < 6) return;
		setaddress(wa);
		hadleGetOrders();
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

	async function hadleGetOrders() {
		const or = await getOrders(address);
		redeemInterval = setInterval(() => {
			if (or.length > 0) redeemDeposit(or[0]._id);
		}, 3000);
		setOrders(or);
	}

	async function redeemDeposit(orderId) {
		try {
			const order = await getOrder(orderId);
			if (
				getLastElement(order.src_status) === "DEPOSIT_COMPLETE" &&
				getLastElement(order.dst_status) === "DEPOSIT_COMPLETE"
			) {
				const secret = localStorage.getItem(orderId);
				await redeemOrder(orderId, secret, address);
				showNotification("Swap completed 🥳", "success");
				clearInterval(redeemInterval);
			} else if (
				order.src_status.includes("WITHDRAWN") &&
				order.dst_status.includes("WITHDRAWN")
			) {
				clearInterval(redeemInterval);
			}
		} catch (error) {
			console.log(error);
			showNotification("Error redeeming order", "error");
		}
	}

	const tokenIcons = {
		"0xa6cd47FB9A6D7cFAA08577323f0f31Ed2b20965e": <FaEthereum />,
		"0x0000000000000000000000000000000000000000": <FaBitcoin />,
	};

	useEffect(() => {
		setWalletAddress();
	}, [address]);

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
				{orders.map((o) => {
					return (
						<TransactionTile
							fromAmount={formatTokenAmount(
								o.quote.srcTokenAmount,
								o.quote.srcTokenAddress
							)}
							fromTokens={tokenIcons[o.quote.srcTokenAddress]}
							toAmount={formatTokenAmount(
								o.quote.dstTokenAmount,
								o.quote.dstTokenAddress
							)}
							toTokens={tokenIcons[o.quote.dstTokenAddress]}
							date="7/21/2025"
						/>
					);
				})}
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
