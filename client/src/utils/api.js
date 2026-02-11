import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
	headers: {
		"Content-Type": "application/json",
	},
});
console.log("API Base URL:", api.defaults.baseURL);

export const registerUser = async (userData) => {
	const response = await api.post("/auth/register", userData);
	return response.data;
};

export const loginUser = async (credentials) => {
	const response = await api.post("/auth/login", credentials);
	return response.data;
};

export const getTransactions = async (userId) => {
	const response = await api.get(`/transactions/${userId}`);
	return response.data;
};

export const getSummary = async (userId) => {
	const response = await api.get(`/transactions/summary/${userId}`);
	return response.data;
};

export const addTransaction = async (transactionData) => {
	const response = await api.post("/transactions", transactionData);
	return response.data;
};

export const deleteTransaction = async (id) => {
	const response = await api.delete(`/transactions/${id}`);
	return response.data;
};

export default api;
