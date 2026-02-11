import { useState, useMemo } from "react";
import {
	format,
	parseISO,
	startOfMonth,
	endOfMonth,
	isWithinInterval,
} from "date-fns";
import {
	EXPENSE_CATEGORIES,
	INCOME_CATEGORIES,
} from "../../../utils/constants";
import { FaTrash, FaFilter, FaSortAmountDown } from "react-icons/fa";

const TransactionTable = ({ transactions, onDelete }) => {
	const [filterMonth, setFilterMonth] = useState("all");
	const [filterType, setFilterType] = useState("all");
	const [filterCategory, setFilterCategory] = useState("all");
	const [sortOrder, setSortOrder] = useState("dateDesc");

	// 1. Extract unique months
	const availableMonths = useMemo(() => {
		const months = new Set();
		transactions.forEach((t) => {
			const monthStr = format(parseISO(t.date), "yyyy-MM");
			months.add(monthStr);
		});
		return Array.from(months).sort().reverse();
	}, [transactions]);

	// 2. Filter & Sort Logic
	const filteredTransactions = useMemo(() => {
		let result = [...transactions];

		// Month Filter
		if (filterMonth !== "all") {
			const [year, month] = filterMonth.split("-");
			const startDate = startOfMonth(
				new Date(parseInt(year), parseInt(month) - 1),
			);
			const endDate = endOfMonth(new Date(parseInt(year), parseInt(month) - 1));

			result = result.filter((t) =>
				isWithinInterval(parseISO(t.date), { start: startDate, end: endDate }),
			);
		}

		// Type Filter
		if (filterType !== "all") {
			result = result.filter((t) => t.type === filterType);
		}

		// Category Filter
		if (filterCategory !== "all") {
			result = result.filter((t) => t.category === filterCategory);
		}

		// Sort
		result.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);

			switch (sortOrder) {
				case "dateDesc":
					return dateB - dateA;
				case "dateAsc":
					return dateA - dateB;
				case "amountDesc":
					return b.amount - a.amount;
				case "amountAsc":
					return a.amount - b.amount;
				default:
					return 0;
			}
		});

		return result;
	}, [transactions, filterMonth, filterType, filterCategory, sortOrder]);

	const allCategories = [
		...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
	].sort();

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
			{/* Header Controls */}
			<div className="p-5 border-b border-gray-100 bg-white">
				<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
							<FaFilter size={14} />
						</div>
						<h3 className="font-bold text-gray-800">Transactions</h3>
						<span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
							{filteredTransactions.length}
						</span>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{/* Custom Select Styles */}
						<select
							className="px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none transition-all cursor-pointer hover:bg-gray-100"
							value={filterMonth}
							onChange={(e) => setFilterMonth(e.target.value)}>
							<option value="all">All Months</option>
							{availableMonths.map((m) => (
								<option key={m} value={m}>
									{format(parseISO(m + "-01"), "MMM yyyy")}
								</option>
							))}
						</select>

						<select
							className="px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none transition-all cursor-pointer hover:bg-gray-100"
							value={filterType}
							onChange={(e) => {
								setFilterType(e.target.value);
								setFilterCategory("all");
							}}>
							<option value="all">All Types</option>
							<option value="income">Income</option>
							<option value="expense">Expense</option>
						</select>

						<select
							className="px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none transition-all cursor-pointer hover:bg-gray-100"
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}>
							<option value="all">All Categories</option>
							{filterType === "income"
								? INCOME_CATEGORIES.map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))
								: filterType === "expense"
									? EXPENSE_CATEGORIES.map((c) => (
											<option key={c} value={c}>
												{c}
											</option>
										))
									: allCategories.map((c) => (
											<option key={c} value={c}>
												{c}
											</option>
										))}
						</select>

						<div className="relative">
							<select
								className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none transition-all cursor-pointer hover:bg-gray-100 appearance-none pl-4 text-center"
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value)}>
								<option value="dateDesc">Newest</option>
								<option value="dateAsc">Oldest</option>
								<option value="amountDesc">High Amount</option>
								<option value="amountAsc">Low Amount</option>
							</select>
							<FaSortAmountDown
								className="absolute left-3 top-3 text-gray-400"
								size={14}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Scrollable Table Area */}
			<div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
				<table className="w-full text-sm text-left border-collapse">
					<thead className="text-xs text-gray-500 uppercase bg-gray-50/80 backdrop-blur sticky top-0 z-10">
						<tr>
							<th className="px-6 py-4 font-semibold tracking-wider">Date</th>
							<th className="px-6 py-4 font-semibold tracking-wider">
								Category
							</th>
							<th className="px-6 py-4 font-semibold tracking-wider">
								Description
							</th>
							<th className="px-6 py-4 font-semibold tracking-wider text-right">
								Amount
							</th>
							<th className="px-6 py-4 font-semibold tracking-wider text-center">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{filteredTransactions.map((t) => (
							<tr
								key={t._id}
								className="group hover:bg-gray-50/80 transition-colors duration-150">
								{/* Date Column */}
								<td className="px-6 py-4 whitespace-nowrap text-gray-600">
									<div className="font-medium text-gray-800">
										{format(parseISO(t.date), "MMM dd")}
									</div>
									<div className="text-xs text-gray-400">
										{format(parseISO(t.date), "yyyy")}
									</div>
								</td>

								{/* Category Badge */}
								<td className="px-6 py-4">
									<span
										className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
											t.type === "income"
												? "bg-emerald-50 text-emerald-700 border-emerald-100"
												: "bg-rose-50 text-rose-700 border-rose-100"
										}`}>
										<span
											className={`w-1.5 h-1.5 rounded-full ${
												t.type === "income" ? "bg-emerald-500" : "bg-rose-500"
											}`}></span>
										{t.category}
									</span>
								</td>

								{/* Description */}
								<td
									className="px-6 py-4 text-gray-600 max-w-xs truncate"
									title={t.description}>
									{t.description || (
										<span className="text-gray-300 italic">No description</span>
									)}
								</td>

								{/* Amount */}
								<td
									className={`px-6 py-4 text-right font-medium tracking-tight ${
										t.type === "income" ? "text-emerald-600" : "text-rose-600"
									}`}>
									{t.type === "income" ? "+" : "-"} ฿{t.amount.toLocaleString()}
								</td>

								{/* Action Button */}
								<td className="px-6 py-4 text-center">
									<button
										onClick={() => onDelete(t._id)}
										className="p-2 text-danger-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
										title="Delete Transaction">
										<FaTrash size={14} />
									</button>
								</td>
							</tr>
						))}

						{/* Empty State */}
						{filteredTransactions.length === 0 && (
							<tr>
								<td colSpan="5" className="px-6 py-12 text-center">
									<div className="flex flex-col items-center justify-center text-gray-400 gap-3">
										<div className="p-4 bg-gray-50 rounded-full">
											<FaFilter size={24} className="text-gray-300" />
										</div>
										<p className="text-sm font-medium">
											No transactions found matching your filters.
										</p>
										<button
											onClick={() => {
												setFilterMonth("all");
												setFilterType("all");
												setFilterCategory("all");
											}}
											className="text-xs text-blue-500 hover:underline">
											Clear all filters
										</button>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TransactionTable;
