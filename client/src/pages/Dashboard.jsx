import { useEffect, useState, useMemo } from "react";
import { getTransactions, getSummary, addTransaction } from "../utils/api";

// Date Utilities
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	subDays,
	isWithinInterval,
	parseISO,
	endOfDay,
} from "date-fns";
import TransactionForm from "../components/ui/cards/TransactionForm";
import ExpensePieChart from "../components/ui/charts/ExpensePieChart";
import MonthlyComparisonChart from "../components/ui/charts/MonthlyComparisonChart";
import BalanceTrendChart from "../components/ui/charts/BalanceTrendChart";
import {
	FaWallet,
	FaArrowDown,
	FaArrowUp,
	FaCreditCard,
	FaFilter,
	FaTimes,
} from "react-icons/fa";

const Dashboard = ({ user }) => {
	const [transactions, setTransactions] = useState([]);
	const [apiSummary, setApiSummary] = useState({
		dailyLimit: 0,
		spentToday: 0,
		remainingToday: 0,
	});
	const [loading, setLoading] = useState(true);

	// FILTER STATE
	const [timeFilter, setTimeFilter] = useState("thisMonth");

	// MODAL STATE
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchData = async () => {
		try {
			const [transData, summaryData] = await Promise.all([
				getTransactions(user._id),
				getSummary(user._id),
			]);
			setTransactions(transData);
			setApiSummary(summaryData);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [user._id]);

	const filteredTransactions = useMemo(() => {
		const now = new Date();
		let start, end;

		switch (timeFilter) {
			case "allTime":
				return transactions;
			case "thisWeek":
				start = startOfWeek(now, { weekStartsOn: 0 });
				end = endOfWeek(now, { weekStartsOn: 0 });
				break;
			case "last30":
				start = subDays(now, 30);
				end = endOfDay(now);
				break;
			case "thisMonth":
			default:
				start = startOfMonth(now);
				end = endOfMonth(now);
				break;
		}

		return transactions.filter((t) =>
			isWithinInterval(parseISO(t.date), { start, end }),
		);
	}, [timeFilter, transactions]);

	const dashboardStats = useMemo(() => {
		//stat filter for income and expense
		const income = filteredTransactions
			.filter((t) => t.type === "income")
			.reduce((acc, t) => acc + t.amount, 0);

		const expense = filteredTransactions
			.filter((t) => t.type === "expense")
			.reduce((acc, t) => acc + t.amount, 0);

		//constant balance
		const totalIncomeAllTime = transactions
			.filter((t) => t.type === "income")
			.reduce((acc, t) => acc + t.amount, 0);

		const totalExpenseAllTime = transactions
			.filter((t) => t.type === "expense")
			.reduce((acc, t) => acc + t.amount, 0);

		// Financial Formula - Global Balance (Initial + Total Income - Total Expense)
		const globalBalance =
			(user.initialBalance || 0) + totalIncomeAllTime - totalExpenseAllTime;

		return {
			income,
			expense,
			balance: globalBalance,
		};
	}, [filteredTransactions, transactions, user.initialBalance]);

	const handleAddTransaction = async (data) => {
		try {
			await addTransaction({ ...data, userId: user._id });
			await fetchData();
			setIsModalOpen(false);
		} catch (error) {
			alert("Failed to add transaction");
		}
	};

	const TimeofDay = () => {
		const hour = new Date().getHours();
		if (hour < 12 && hour > 5) return "Morning";
		else if (hour < 18 && hour >= 12) return "Afternoon";
		else return "Evening";
	};

	if (loading)
		return (
			<div className="min-h-[calc(100vh-5rem)] flex items-center justify-center text-gray-500">
				Loading your data...
			</div>
		);

	return (
		<div className="px-6 max-w-screen mx-auto my-auto space-y-2 min-h-[calc(100vh-5rem)] relative">
			{/* Greeting */}
			<div className="flex flex-row justify-between items-center py-8 ">
				<h1 className="text-5xl font-base text-gray-800 align-middle tracking-tight">
					Good {TimeofDay()}, {user.firstName || user.username}!
				</h1>

				<button
					className="inline-flex bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all flex items-center gap-3 "
					onClick={() => setIsModalOpen(true)}>
					<span className="text-xl font-light">+</span>
					<span className="text-sm font-medium">Add Transaction</span>
				</button>
			</div>
			{/* Filter & Stats Cards */}
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-gray-200 text-gray-600 ">
					<span className="text-sm font-medium">Filter</span>
					<FaFilter size={12} />
				</div>
				<div className="relative group">
					<select
						value={timeFilter}
						onChange={(e) => setTimeFilter(e.target.value)}
						className="appearance-none bg-white pl-6 pr-10 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all cursor-pointer  focus:outline-none focus:ring-2 focus:ring-gray-100">
						<option value="allTime">All Time</option>
						<option value="thisMonth">This Month</option>
						<option value="last30">Last 30 Days</option>
						<option value="thisWeek">This Week</option>
					</select>
					<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
						<svg
							className="w-3 h-3 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
				<div className="bg-white px-6 py-6 rounded-xl  flex flex-col justify-between ">
					<div className="flex items-center gap-3 text-blue-600 mb-2">
						<div className="p-2 bg-blue-50 rounded-lg">
							<FaWallet />
						</div>
						<span className="text-sm font-medium text-gray-500">Balance</span>
					</div>
					{/* GLOBAL BALANCE*/}
					<p
						className={`text-5xl py-3 font-bold ${dashboardStats.balance >= 0 ? "text-gray-800" : "text-rose-600"}`}>
						฿{dashboardStats.balance.toLocaleString()}
					</p>
				</div>
				<div className="bg-white px-6 py-6 rounded-xl flex flex-col justify-between ">
					<div className="flex items-center gap-3 text-emerald-600 mb-2">
						<div className="p-2 bg-emerald-50 rounded-lg">
							<FaArrowUp />
						</div>
						<span className="text-sm font-medium text-gray-500">Income</span>
					</div>
					{/* Filtered Income */}
					<p className="text-5xl py-3 font-bold text-gray-800">
						฿{dashboardStats.income.toLocaleString()}
					</p>
				</div>

				<div className="bg-white px-6 py-6 rounded-xl flex flex-col justify-between ">
					<div className="flex items-center gap-3 text-rose-600 mb-2">
						<div className="p-2 bg-rose-50 rounded-lg">
							<FaArrowDown />
						</div>
						<span className="text-sm font-medium text-gray-500">Expenses</span>
					</div>
					{/* Filtered Expenses */}
					<p className="text-5xl py-3 font-bold text-gray-800">
						฿{dashboardStats.expense.toLocaleString()}
					</p>
				</div>

				<div className="bg-white px-6 py-6 rounded-xl flex flex-col justify-between relative overflow-hidden ">
					<div className="flex items-center gap-3 text-amber-600 mb-2 z-10">
						<div className="p-2 bg-amber-50 rounded-lg">
							<FaCreditCard />
						</div>
						<span className="text-sm font-medium text-gray-500">
							Daily Limit
						</span>
					</div>
					<div className="flex justify-between items-end z-10">
						<div>
							<p className="text-5xl py-3 font-bold text-gray-800">
								฿{apiSummary.spentToday.toLocaleString()}
								<span className="text-xs font-normal text-gray-400">
									{" "}
									spent
								</span>
							</p>
						</div>
						<div
							className={`text-right py-3 ${apiSummary.remainingToday < 0 ? "text-rose-600" : "text-emerald-600"}`}>
							<p className="text-xs font-medium uppercase tracking-wider">
								Remaining
							</p>
							<p className="text-lg font-bold">
								{apiSummary.remainingToday < 0
									? "OVER"
									: `฿${apiSummary.remainingToday.toLocaleString()}`}
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div className="h-96">
					<ExpensePieChart transactions={filteredTransactions} />
				</div>
				<div className="h-96 w-full">
					<MonthlyComparisonChart
						transactions={filteredTransactions}
						timeFilter={timeFilter}
					/>
				</div>
				<div className="h-96 w-full">
					<BalanceTrendChart
						transactions={transactions}
						initialBalance={user.initialBalance || 0}
						timeFilter={timeFilter}
					/>
				</div>
			</div>

			{/* ADD TRANSACTION MODAL */}
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

export default Dashboard;
