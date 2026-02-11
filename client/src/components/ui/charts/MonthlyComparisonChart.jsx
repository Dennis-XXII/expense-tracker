import { useState, useMemo } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	format,
	isSameDay,
	parseISO,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	subDays,
	subMonths,
} from "date-fns";

const MonthlyComparisonChart = ({ transactions, timeFilter = "last30" }) => {
	// Internal visual filter (Income vs Expense lines)
	const [typeFilter, setTypeFilter] = useState("all");

	const { chartData, tickInterval } = useMemo(() => {
		const today = new Date();
		let start, end, dateFormat, interval;

		switch (timeFilter) {
			case "thisWeek":
				start = startOfWeek(today, { weekStartsOn: 0 });
				end = endOfWeek(today, { weekStartsOn: 0 });
				dateFormat = "EEE";
				interval = 0;
				break;
			case "thisMonth":
				start = startOfMonth(today);
				end = endOfMonth(today);
				dateFormat = "MMM dd";
				interval = 4;
				break;
			case "allTime": // Cap "All Time" to last 3 Months
				start = subMonths(today, 3);
				end = today;
				dateFormat = "MMM dd";
				interval = 10;
				break;
			case "last30":
			default:
				start = subDays(today, 29);
				end = today;
				dateFormat = "MMM dd";
				interval = 5;
				break;
		}

		const days = eachDayOfInterval({ start, end });

		const data = days.map((day) => {
			const dailyTrans = transactions.filter((t) =>
				isSameDay(parseISO(t.date), day),
			);

			// Sum up amounts
			const income = dailyTrans
				.filter((t) => t.type === "income")
				.reduce((sum, t) => sum + t.amount, 0);

			const expense = dailyTrans
				.filter((t) => t.type === "expense")
				.reduce((sum, t) => sum + t.amount, 0);

			return {
				label: format(day, dateFormat),
				fullDate: format(day, "MMM dd, yyyy"),
				income,
				expense,
			};
		});

		return { chartData: data, tickInterval: interval };
	}, [transactions, timeFilter]);

	// Custom Tooltip
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const fullDate = payload[0].payload.fullDate;

			return (
				<div className="bg-white p-4 border border-gray-100  rounded-xl min-w-[150px]">
					<p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wide">
						{fullDate}
					</p>
					<div className="space-y-1">
						{(typeFilter === "all" || typeFilter === "income") && (
							<div className="flex items-center justify-between gap-4">
								<span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
									<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
									Income
								</span>
								<span className="text-emerald-700 font-semibold ">
									+฿{payload[0].value.toLocaleString()}
								</span>
							</div>
						)}
						{(typeFilter === "all" || typeFilter === "expense") && (
							<div className="flex items-center justify-between gap-4">
								<span className="text-rose-600 text-sm font-medium flex items-center gap-1">
									<span className="w-2 h-2 rounded-full bg-rose-500"></span>
									Expense
								</span>
								<span className="text-rose-700 font-semibold ">
									-฿{payload[1].value.toLocaleString()}
								</span>
							</div>
						)}
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="h-full w-full bg-white rounded-xl  border border-gray-100 p-4 flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-bold text-gray-700 text-sm">Trend Overview</h3>
				<select
					className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:bg-gray-100"
					value={typeFilter}
					onChange={(e) => setTypeFilter(e.target.value)}>
					<option value="all">Show Both</option>
					<option value="income">Income Only</option>
					<option value="expense">Expenses Only</option>
				</select>
			</div>

			<div className="flex-grow w-full min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<defs>
							<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
								<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
								<stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
							</linearGradient>
						</defs>

						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#f3f4f6"
						/>

						<XAxis
							dataKey="label"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 11, fill: "#9ca3af" }}
							interval={tickInterval} // Dynamic interval based on range
							dy={10}
						/>

						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 11, fill: "#9ca3af" }}
							tickFormatter={(value) => `฿${value}`}
							width={50}
						/>

						<Tooltip content={<CustomTooltip />} />

						{(typeFilter === "all" || typeFilter === "income") && (
							<Area
								type="monotone"
								dataKey="income"
								stroke="#10b981"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#colorIncome)"
								activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
							/>
						)}

						{(typeFilter === "all" || typeFilter === "expense") && (
							<Area
								type="monotone"
								dataKey="expense"
								stroke="#ef4444"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#colorExpense)"
								activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
							/>
						)}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default MonthlyComparisonChart;
