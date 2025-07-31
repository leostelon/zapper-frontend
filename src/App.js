import "./App.css";
import { useEffect } from "react";
import { SwapBox } from "./components/SwapBox";

function App() {
	async function test() {
		
	}

	useEffect(() => {
		test();
	}, []);

	return (
		<div className="App">
			<SwapBox />
		</div>
	);
}

export default App;
