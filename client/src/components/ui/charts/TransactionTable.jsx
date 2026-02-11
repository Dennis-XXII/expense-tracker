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
import {
	FaTrash,
	FaFilter,
	FaSortAmountDown,
	FaArrowUp,
	FaArrowDown,
} from "react-icons/fa";

const TransactionTable = ({ transactions, onDelete }) => {
	const [filterMonth, setFilterMonth] = useState("all");
	const [filterType, setFilterType] = useState("all");
	const [filterCategory, setFilterCategory] = useState("all");
	const [sortOrder, setSortOrder] = useState("dateDesc");

	// extract unique months for dropdown
	const availableMonths = useMemo(() => {
		const months = new Set();
		transactions.forEach((t) => {
			const monthStr = format(parseISO(t.date), "yyyy-MM");
			months.add(monthStr);
		});
		return Array.from(months).sort().reverse();
	}, [transactions]);

	// filter and sort logic
	const filteredTransactions = useMemo(() => {
		let result = [...transactions];

		// 1. Month Filter
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

		// 2. Type & Category Filter
		if (filterType !== "all")
			result = result.filter((t) => t.type === filterType);
		if (filterCategory !== "all")
			result = result.filter((t) => t.category === filterCategory);

		// 3. Sorting
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
			{/* Headers*/}
			<div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-20">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
							<FaFilter size={14} />
						</div>
						<h3 className="font-bold text-gray-800">Transactions</h3>
						<span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
							{filteredTransactions.length}
						</span>
					</div>

					{/* Filter Inputs */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<select
							className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"
							value={filterMonth}
							onChange={(e) => setFilterMonth(e.target.value)}>
							<option value="all">Months</option>
							{availableMonths.map((m) => (
								<option key={m} value={m}>
									{format(parseISO(m + "-01"), "MMM yyyy")}
								</option>
							))}
						</select>

						<select
							className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"
							value={filterType}
							onChange={(e) => {
								setFilterType(e.target.value);
								setFilterCategory("all");
							}}>
							<option value="all">Types</option>
							<option value="income">Income</option>
							<option value="expense">Expense</option>
						</select>

						<select
							className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}>
							<option value="all">Categories</option>
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
								className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none pl-8 appearance-none"
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value)}>
								<option value="dateDesc">Newest</option>
								<option value="dateAsc">Oldest</option>
								<option value="amountDesc">High Amount</option>
								<option value="amountAsc">Low Amount</option>
							</select>
							<FaSortAmountDown
								className="absolute left-3 top-3 text-gray-400"
								size={12}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile List */}
			<div className="block md:hidden overflow-y-auto max-h-[700px] pb-20">
				<ul className="divide-y divide-gray-50">
					{filteredTransactions.map((t) => (
						<li
							key={t._id}
							className="p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
							{/* Left Side: Icon + Text */}
							<div className="flex items-center gap-4">
								{/* Icon Circle */}
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
										t.type === "income"
											? "bg-purple-100 text-purple-600"
											: "bg-red-50 text-red-500"
									}`}>
									{t.type === "income" ? (
										<FaArrowDown className="transform -rotate-45" size={14} />
									) : (
										<FaArrowUp className="transform rotate-45" size={14} />
									)}
								</div>

								{/* Text Info */}
								<div className="flex flex-col">
									<span className="font-bold text-gray-800 text-sm truncate max-w-[140px]">
										{t.description || t.category}
									</span>
									<span className="text-xs text-gray-400 font-medium mt-0.5">
										{format(parseISO(t.date), "MMM do, yyyy")}
									</span>
								</div>
							</div>

							{/* Right Side: Amount + Delete */}
							<div className="flex items-center gap-3">
								<span
									className={`font-bold text-base ${
										t.type === "income" ? "text-emerald-500" : "text-rose-500"
									}`}>
									{t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
								</span>

								<button
									onClick={() => onDelete(t._id)}
									className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
									<FaTrash size={14} />
								</button>
							</div>
						</li>
					))}

					{/* Empty State */}
					{filteredTransactions.length === 0 && (
						<div className="p-8 text-center text-gray-400 text-sm">
							No transactions found.
						</div>
					)}
				</ul>
			</div>

			{/* Desktop Table */}
			<div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-thin">
				<table className="w-full text-sm text-left border-collapse">
					<thead className="text-xs text-gray-500 uppercase bg-gray-50/80 backdrop-blur sticky top-0 z-10">
						<tr>
							<th className="px-6 py-4 font-semibold">Date</th>
							<th className="px-6 py-4 font-semibold">Category</th>
							<th className="px-6 py-4 font-semibold">Description</th>
							<th className="px-6 py-4 font-semibold text-right">Amount</th>
							<th className="px-6 py-4 font-semibold text-center">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{filteredTransactions.map((t) => (
							<tr
								key={t._id}
								className="group hover:bg-gray-50/80 transition-colors">
								<td className="px-6 py-4 text-gray-600">
									<div className="font-medium text-gray-800">
										{format(parseISO(t.date), "MMM dd")}
									</div>
									<div className="text-xs text-gray-400">
										{format(parseISO(t.date), "yyyy")}
									</div>
								</td>
								<td className="px-6 py-4">
									<span
										className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
											t.type === "income"
												? "bg-emerald-50 text-emerald-700 border-emerald-100"
												: "bg-rose-50 text-rose-700 border-rose-100"
										}`}>
										<span
											className={`w-1.5 h-1.5 rounded-full ${t.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
										{t.category}
									</span>
								</td>
								<td
									className="px-6 py-4 text-gray-600 max-w-xs truncate"
									title={t.description}>
									{t.description || (
										<span className="text-gray-300 italic">No description</span>
									)}
								</td>
								<td
									className={`px-6 py-4 text-right font-medium ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
									{t.type === "income" ? "+" : "-"} ฿{t.amount.toLocaleString()}
								</td>
								<td className="px-6 py-4 text-center">
									<button
										onClick={() => onDelete(t._id)}
										className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
										<FaTrash size={14} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TransactionTable;
