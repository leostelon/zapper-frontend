import "./App.css";
import { useEffect } from "react";
import { SwapBox } from "./components/SwapBox";
import WalletBadge from "./components/WalletBadge";

function App() {
	async function test() {}

	useEffect(() => {
		test();
	}, []);

	return (
		<div className="App">
			<WalletBadge />
			<div className="body">
				<SwapBox />
			</div>
		</div>
	);
}

export default App;
