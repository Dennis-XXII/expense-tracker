const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// DASHBOARD SUMMARY ROUTES (Used by Dashboard Cards & Charts)
// @route   GET /api/transactions/summary/:userId
router.get("/summary/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		const userObjectId = new mongoose.Types.ObjectId(userId);

		// Aggregate Totals
		const stats = await Transaction.aggregate([
			{ $match: { user: userObjectId } },
			{ $group: { _id: "$type", total: { $sum: "$amount" } } },
		]);

		const totals = stats.reduce(
			(acc, curr) => {
				acc[curr._id] = curr.total;
				return acc;
			},
			{ income: 0, expense: 0 },
		);

		// Calculate Balance: Initial + Income - Expense
		const currentBalance =
			(user.initialBalance || 0) + totals.income - totals.expense;

		// Daily Logic (Bangkok Time)
		const now = new Date();
		const bangkokDateString = new Intl.DateTimeFormat("en-US", {
			timeZone: "Asia/Bangkok",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(now);
		const [month, day, year] = bangkokDateString.split("/");
		const bangkokMidnight = new Date(
			`${year}-${month}-${day}T00:00:00.000+07:00`,
		);

		const todaysExpenses = await Transaction.aggregate([
			{
				$match: {
					user: userObjectId,
					type: "expense",
					date: { $gte: bangkokMidnight },
				},
			},
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		const spentToday = todaysExpenses[0] ? todaysExpenses[0].total : 0;

		res.json({
			totalIncome: totals.income,
			totalExpenses: totals.expense,
			balance: currentBalance,
			dailyLimit: user.dailySpendingLimit,
			spentToday,
			remainingToday: user.dailySpendingLimit - spentToday,
		});
	} catch (error) {
		console.error("Summary error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Generic Routes for Transactions

// @route   GET /api/transactions/:userId
// @desc    Used by TransactionTable to LIST history
router.get("/:userId", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		const transactions = await Transaction.find({
			user: req.params.userId,
		}).sort({ date: -1 });
		res.json(transactions);
	} catch (error) {
		res.status(500).json({ message: "Error fetching transactions" });
	}
});

// @route   POST /api/transactions
// @desc    Used by TransactionForm to ADD new items
router.post("/", async (req, res) => {
	const { userId, type, category, amount, date, description } = req.body;

	try {
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Valid user ID required" });
		}
		if (!amount || amount <= 0) {
			return res.status(400).json({ message: "Amount must be positive" });
		}

		const transaction = await Transaction.create({
			user: userId,
			type,
			category: category || "Uncategorized",
			amount: Number(amount),
			date: date || Date.now(),
			description: description || "",
		});

		res.status(201).json(transaction);
	} catch (error) {
		res.status(500).json({ message: "Error creating transaction" });
	}
});

// @route   DELETE /api/transactions/:id
// @desc    Used by TransactionTable to DELETE items
router.delete("/:id", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: "Invalid ID" });

		const t = await Transaction.findByIdAndDelete(req.params.id);

		if (!t) return res.status(404).json({ message: "Transaction not found" });

		res.json({ message: "Deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting transaction" });
	}
});

module.exports = router;
