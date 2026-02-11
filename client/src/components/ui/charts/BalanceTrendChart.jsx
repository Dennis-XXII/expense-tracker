import { useMemo } from "react";
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
	compareAsc,
	startOfDay,
} from "date-fns";

const BalanceTrendChart = ({ transactions, initialBalance, timeFilter }) => {
	const { chartData, tickInterval } = useMemo(() => {
		const today = new Date();
		let start, end, dateFormat, interval;

		// Determine Range
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
			case "allTime":
				// ALL TIME = show last 3 Months For now - Dennis
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

		// Sort Transactions y date (Oldest to Newest)
		const sortedTrans = [...transactions].sort((a, b) =>
			compareAsc(parseISO(a.date), parseISO(b.date)),
		);

		// Calculate Running Balance
		let runningBalance = initialBalance || 0;
		const startTime = startOfDay(start).getTime();

		// Process all history BEFORE the start date
		sortedTrans.forEach((t) => {
			if (parseISO(t.date).getTime() < startTime) {
				if (t.type === "income") runningBalance += t.amount;
				else runningBalance -= t.amount;
			}
		});

		// Generate Daily Data Points
		const days = eachDayOfInterval({ start, end });

		const data = days.map((day) => {
			const dailyTrans = sortedTrans.filter((t) =>
				isSameDay(parseISO(t.date), day),
			);

			dailyTrans.forEach((t) => {
				if (t.type === "income") runningBalance += t.amount;
				else runningBalance -= t.amount;
			});

			return {
				label: format(day, dateFormat),
				fullDate: format(day, "MMM dd, yyyy"),
				balance: runningBalance,
			};
		});

		return { chartData: data, tickInterval: interval };
	}, [transactions, initialBalance, timeFilter]);

	// Custom Tooltip
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg min-w-[150px]">
					<p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">
						{data.fullDate}
					</p>
					<div className="flex items-center justify-between gap-4">
						<span className="text-gray-500 text-sm font-medium flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-brand-500"></span>
							Net Worth
						</span>
						<span className="text-gray-800 font-bold">
							฿{data.balance.toLocaleString()}
						</span>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="h-full w-full bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-bold text-gray-700 text-sm">Net Worth Trend</h3>
			</div>

			<div className="flex-grow w-full min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<defs>
							<linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#ababab" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#414141" stopOpacity={0} />
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
							interval={tickInterval}
							dy={10}
						/>

						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 11, fill: "#9ca3af" }}
							tickFormatter={(value) => `฿${value / 1000}k`}
							width={40}
						/>

						<Tooltip content={<CustomTooltip />} />

						<Area
							type="monotone"
							dataKey="balance"
							stroke="#000000"
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorBalance)"
							activeDot={{ r: 6, strokeWidth: 0, fill: "#000000" }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default BalanceTrendChart;
