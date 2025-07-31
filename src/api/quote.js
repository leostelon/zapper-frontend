import axios from "axios";

const API_BASE_URL = "http://localhost:3000/quote";

export async function getQuote(body) {
	try {
		const response = await axios.post(API_BASE_URL, body);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message || "Failed to get quote"
		);
	}
}