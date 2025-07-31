import { BASE_URL } from "../constants";

const API_BASE_URL = BASE_URL;

export async function createOrder(secret_hash, quote_id) {
	try {
		const response = await fetch(`${API_BASE_URL}/order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret_hash,
				quote_id,
			}),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to create order");
		}

		const data = await response.json();
		console.log("Order created:", data);
		return data;
	} catch (error) {
		throw new Error(error?.response?.data?.message || "Failed to get quote");
	}
}
