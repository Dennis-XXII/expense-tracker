import { useState } from "react";
import {
	EXPENSE_CATEGORIES,
	INCOME_CATEGORIES,
} from "../../../utils/constants";

const TransactionForm = ({ onAddTransaction }) => {
	const [formData, setFormData] = useState({
		type: "expense",
		amount: "",
		category: EXPENSE_CATEGORIES[0],
		description: "",
		date: new Date().toISOString().split("T")[0],
	});

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
		// // Reset form
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
		<div className="h-full flex flex-col">
			<div className="p-4 border-b border-gray-100 flex justify-between items-center mb-4">
				<h3 className="font-bold text-lg text-gray-800">New Transaction</h3>
			</div>

			<form
				onSubmit={handleSubmit}
				className="px-6 pb-6 flex flex-col gap-4 h-full overflow-y-auto">
				<div className="flex bg-gray-100 p-1 rounded-xl mb-2">
					<button
						type="button"
						onClick={() => setType("expense")}
						className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
							formData.type === "expense"
								? "bg-white text-rose-600 shadow-sm"
								: "text-gray-500"
						}`}>
						Expense
					</button>
					<button
						type="button"
						onClick={() => setType("income")}
						className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
							formData.type === "income"
								? "bg-white text-emerald-600 shadow-sm"
								: "text-gray-500"
						}`}>
						Income
					</button>
				</div>

				<div>
					<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
						Amount
					</label>
					<input
						type="number"
						placeholder="0.00"
						required
						min="0"
						className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
						value={formData.amount}
						onChange={(e) =>
							setFormData({ ...formData, amount: e.target.value })
						}
					/>
				</div>

				<div>
					<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
						Category
					</label>
					<select
						className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
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

				<div>
					<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
						Date
					</label>
					<input
						type="date"
						required
						className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-600"
						value={formData.date}
						onChange={(e) => setFormData({ ...formData, date: e.target.value })}
					/>
				</div>

				<div>
					<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
						Description
					</label>
					<textarea
						rows="2"
						placeholder="What was this for?"
						className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
					/>
				</div>

				<button
					type="submit"
					className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 mt-4 ${
						formData.type === "expense"
							? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
							: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
					}`}>
					{formData.type === "expense" ? "Add Expense" : "Add Income"}
				</button>
			</form>
		</div>
	);
};

export default TransactionForm;
