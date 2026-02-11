const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://expense-tracker-gamma-jade.vercel.app",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

// Health check
app.get("/", (req, res) => {
	res.json({ message: "Expense Tracker API is running" });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Server error:", err.stack);
	res.status(500).json({
		message: "Something went wrong!",
		error: process.env.NODE_ENV === "development" ? err.message : undefined,
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
