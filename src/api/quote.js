import axios from "axios";
import { BASE_URL } from "../constants";

const API_BASE_URL = BASE_URL;

export async function getQuote(body) {
	try {
		const response = await axios.post(`${API_BASE_URL}/quote`, body);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message || "Failed to get quote"
		);
	}
}