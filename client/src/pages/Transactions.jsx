import { useEffect, useState } from "react";
import {
	getTransactions,
	deleteTransaction,
	addTransaction,
	updateTransaction, // // Import update API
} from "../utils/api";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/constants";
import TransactionTable from "../components/ui/charts/TransactionTable";
import TransactionForm from "../components/ui/cards/TransactionForm";
import { FaTimes } from "react-icons/fa";

const Transactions = ({ user }) => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	// --- STATE FOR ADD MODAL ---
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	// --- STATE FOR EDIT MODAL ---
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	// Local state for the edit form inputs
	const [editFormData, setEditFormData] = useState({
		type: "expense",
		amount: "",
		category: "",
		date: "",
		description: "",
	});

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
			setIsAddModalOpen(false);
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

	// Open the Edit Modal and fill the form with existing data
	const openEditModal = (transaction) => {
		setEditingId(transaction._id);
		setEditFormData({
			type: transaction.type,
			amount: transaction.amount,
			category: transaction.category,
			date: new Date(transaction.date).toISOString().split("T")[0], // Format date for input
			description: transaction.description || "",
		});
		setIsEditModalOpen(true);
	};

	// Submit the Edit Form
	const handleUpdateSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateTransaction(editingId, editFormData);
			fetchTransactions();
			setIsEditModalOpen(false);
			setEditingId(null);
		} catch (error) {
			alert("Failed to update transaction");
		}
	};

	if (loading)
		return (
			<div className="min-h-[calc(100vh-5rem)] flex items-center justify-center text-gray-500">
				Loading history...
			</div>
		);

	return (
		<div className="p-2 lg:pt-20 lg:px-6 max-w-screen mx-auto my-auto min-h-[calc(100vh-5rem)] bg-gray-50/50">
			<div className="mb-2 flex items-center justify-between">
				<h1 className="text-lg lg:text-xl font-bold text-gray-800">
					Transaction History
				</h1>
				<button
					className="inline-flex bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all flex items-center gap-3 "
					onClick={() => setIsAddModalOpen(true)}>
					<span className="text-md lg:text font-light">+</span>
					<span className="text-xs lg:text-sm font-medium">
						Add Transaction
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1">
				<div className="w-full bg-white rounded-xl border border-gray-100 h-[750px] overflow-hidden">
					<TransactionTable
						transactions={transactions}
						onDelete={handleDelete}
						onEdit={openEditModal}
					/>
				</div>
			</div>

			{/* Add transaction form */}
			{isAddModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative animate-fade-in">
						<button
							onClick={() => setIsAddModalOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
							<FaTimes size={20} />
						</button>
						<div className="h-full">
							<TransactionForm onAddTransaction={handleAddTransaction} />
						</div>
					</div>
				</div>
			)}

			{/* Edit transaction form */}
			{isEditModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative animate-fade-in">
						<div className="p-4 border-b border-gray-100 flex justify-between items-center">
							<h3 className="font-bold text-lg text-gray-800">
								Edit Transaction
							</h3>
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="text-gray-400 hover:text-gray-600">
								<FaTimes size={20} />
							</button>
						</div>

						<form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
							{/* Type Toggle */}
							<div className="flex bg-gray-100 p-1 rounded-xl">
								<button
									type="button"
									onClick={() =>
										setEditFormData({ ...editFormData, type: "expense" })
									}
									className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
										editFormData.type === "expense"
											? "bg-white text-rose-600 shadow-sm"
											: "text-gray-500"
									}`}>
									Expense
								</button>
								<button
									type="button"
									onClick={() =>
										setEditFormData({ ...editFormData, type: "income" })
									}
									className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
										editFormData.type === "income"
											? "bg-white text-emerald-600 shadow-sm"
											: "text-gray-500"
									}`}>
									Income
								</button>
							</div>

							{/* Amount */}
							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
									Amount
								</label>
								<input
									type="number"
									required
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
									value={editFormData.amount}
									onChange={(e) =>
										setEditFormData({ ...editFormData, amount: e.target.value })
									}
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
									Category
								</label>
								<select
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
									value={editFormData.category}
									onChange={(e) =>
										setEditFormData({
											...editFormData,
											category: e.target.value,
										})
									}>
									{(editFormData.type === "expense"
										? EXPENSE_CATEGORIES
										: INCOME_CATEGORIES
									).map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))}
								</select>
							</div>

							{/* Date */}
							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
									Date
								</label>
								<input
									type="date"
									required
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
									value={editFormData.date}
									onChange={(e) =>
										setEditFormData({ ...editFormData, date: e.target.value })
									}
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
									Description
								</label>
								<input
									type="text"
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
									value={editFormData.description}
									onChange={(e) =>
										setEditFormData({
											...editFormData,
											description: e.target.value,
										})
									}
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 mt-4">
								Save Changes
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Transactions;
