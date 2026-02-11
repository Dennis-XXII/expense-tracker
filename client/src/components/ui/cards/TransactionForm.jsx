import { useState, useEffect } from "react";
import {
	EXPENSE_CATEGORIES,
	INCOME_CATEGORIES,
} from "../../../utils/constants";
import { FaPlusCircle } from "react-icons/fa";

const TransactionForm = ({ onAddTransaction }) => {
	const [formData, setFormData] = useState({
		type: "expense",
		amount: "",
		category: EXPENSE_CATEGORIES[0],
		description: "",
		date: new Date().toISOString().split("T")[0],
	});

	// Toggle Tabs
	const setType = (type) => {
		setFormData((prev) => ({
			...prev,
			type,
			category:
				type === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onAddTransaction(formData);
		setFormData((prev) => ({
			...prev,
			amount: "",
			description: "",
			category:
				prev.type === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
		}));
	};

	const currentCategories =
		formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
			<div className="flex border-b border-gray-100">
				<button
					type="button"
					onClick={() => setType("expense")}
					className={`flex-1 py-4 text-sm font-semibold transition-colors ${
						formData.type === "expense"
							? "bg-rose-50 text-rose-600 border-b-2 border-rose-500"
							: "text-gray-500 hover:bg-gray-50"
					}`}>
					Add Expense
				</button>
				<button
					type="button"
					onClick={() => setType("income")}
					className={`flex-1 py-4 text-sm font-semibold transition-colors ${
						formData.type === "income"
							? "bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500"
							: "text-gray-500 hover:bg-gray-50"
					}`}>
					Add Income
				</button>
			</div>

			<form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 h-full">
				<div>
					<label className="block text-xs font-medium text-gray-500 mb-1">
						Amount (THB)
					</label>
					<div className="relative">
						<input
							type="number"
							placeholder="0.00"
							className="w-full pl-7 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
							value={formData.amount}
							onChange={(e) =>
								setFormData({ ...formData, amount: e.target.value })
							}
							required
						/>
					</div>
				</div>
				{/* Date & Category */}
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1">
							Date
						</label>
						<input
							type="date"
							className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none"
							value={formData.date}
							onChange={(e) =>
								setFormData({ ...formData, date: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1">
							Category
						</label>
						<select
							className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
							value={formData.category}
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}
							required>
							{currentCategories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Description */}
				<div className="flex-1">
					<label className="block text-xs font-medium text-gray-500 mb-1">
						Description
					</label>
					<textarea
						rows="2"
						placeholder="What was this for?"
						className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
					/>
				</div>

				{/* Submit */}
				<button
					type="submit"
					className={`w-full py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
						formData.type === "expense"
							? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
							: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
					}`}>
					<FaPlusCircle />
					{formData.type === "expense" ? "Record Expense" : "Record Income"}
				</button>
			</form>
		</div>
	);
};

export default TransactionForm;
