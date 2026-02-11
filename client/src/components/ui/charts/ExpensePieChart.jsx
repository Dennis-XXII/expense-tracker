import { useMemo } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const COLORS = [
	"#3b82f6", // Blue
	"#10b981", // Emerald
	"#f59e0b", // Amber
	"#ef4444", // Rose
	"#8b5cf6", // Violet
	"#06b6d4", // Cyan
	"#ec4899", // Pink
	"#6366f1", // Indigo
];

const ExpensePieChart = ({ transactions }) => {
	// 1. AGGREGATE: Just sum up whatever transactions are passed in
	const chartData = useMemo(() => {
		const aggregated = transactions.reduce((acc, t) => {
			// Only count expenses
			if (t.type === "expense") {
				acc[t.category] = (acc[t.category] || 0) + t.amount;
			}
			return acc;
		}, {});

		return Object.keys(aggregated).map((key) => ({
			name: key,
			value: aggregated[key],
		}));
	}, [transactions]);

	const totalExpense = chartData.reduce((acc, curr) => acc + curr.value, 0);

	// Custom Tooltip
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0];
			return (
				<div className="bg-white p-3 border border-gray-100  rounded-xl">
					<div className="flex items-center gap-2 mb-1">
						<span
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: data.payload.fill }}></span>
						<p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide">
							{data.name}
						</p>
					</div>
					<p className="text-gray-800 font-bold  text-lg">
						฿{data.value.toLocaleString()}
					</p>
					<p className="text-xs text-gray-400 mt-1">
						{totalExpense > 0
							? ((data.value / totalExpense) * 100).toFixed(1)
							: 0}
						%
					</p>
				</div>
			);
		}
		return null;
	};

	if (chartData.length === 0) {
		return (
			<div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100">
				<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
					<span className="text-xl">📉</span>
				</div>
				<p className="text-sm font-medium">No expenses found</p>
			</div>
		);
	}

	return (
		<div className="h-full w-full bg-white rounded-xl border border-gray-100  p-4 relative">
			<ResponsiveContainer
				width="100%"
				height="100%"
				appearence="none"
				outline="none">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={85}
						paddingAngle={2}
						dataKey="value"
						cornerRadius={1}
						stroke="none">
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
								style={{
									outline: "none",
									tabIndex: -1,
								}}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
					<Legend
						verticalAlign="bottom"
						height={36}
						iconType="circle"
						iconSize={8}
						formatter={(value) => (
							<span className="text-xs text-gray-600 font-medium ml-1">
								{value}
							</span>
						)}
					/>
					<text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
						<tspan
							x="50%"
							dy="-30"
							fontSize="12"
							fill="#9ca3af"
							fontWeight="500">
							Total Spent
						</tspan>
						<tspan
							x="50%"
							dy="20"
							fontSize="18"
							fill="#1f2937"
							fontWeight="bold">
							฿{totalExpense.toLocaleString()}
						</tspan>
					</text>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default ExpensePieChart;
