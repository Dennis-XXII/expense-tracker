import { useEffect, useState } from "react";
import {
	getTransactions,
	deleteTransaction,
	addTransaction,
} from "../utils/api";
import TransactionTable from "../components/ui/charts/TransactionTable";
import TransactionForm from "../components/ui/cards/TransactionForm";
import { FaTimes } from "react-icons/fa";

const Transactions = ({ user }) => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchTransactions = async () => {
		try {
			const data = await getTransactions(user._id);
			setTransactions(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching transactions:", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, [user._id]);

	const handleAddTransaction = async (data) => {
		try {
			await addTransaction({ ...data, userId: user._id });
			fetchTransactions();
			setIsModalOpen(false);
		} catch (error) {
			alert("Failed to add transaction");
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this transaction?")) return;
		try {
			await deleteTransaction(id);
			setTransactions((prev) => prev.filter((t) => t._id !== id));
		} catch (error) {
			alert("Failed to delete transaction");
		}
	};

	if (loading)
		return (
			<div className="min-h-[calc(100vh-5rem)] flex items-center justify-center text-gray-500">
				Loading history...
			</div>
		);

	return (
		<div className="p-6 max-w-screen mx-auto my-auto min-h-[calc(100vh-5rem)] bg-gray-50/50">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-800">
					Transaction History
				</h1>
				<button
					className="inline-flex bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all flex items-center gap-3 "
					onClick={() => setIsModalOpen(true)}>
					<span className="text-md lg:text font-light">+</span>
					<span className="text-xs lg:text-sm font-medium">
						Add Transaction
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1">
				<div className="w-full bg-white rounded-xl  border border-gray-100 h-[750px] overflow-hidden">
					<TransactionTable
						transactions={transactions}
						onDelete={handleDelete}
					/>
				</div>
			</div>
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl  w-full max-w-md overflow-hidden relative animate-fade-in">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
							<FaTimes size={20} />
						</button>
						<div className="h-full">
							<TransactionForm onAddTransaction={handleAddTransaction} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Transactions;
