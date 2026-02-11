const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
	const {
		username,
		pin,
		firstName,
		lastName,
		initialBalance,
		dailySpendingLimit,
	} = req.body;

	try {
		// --- Validation ---
		if (
			!username ||
			username.trim().length < 8 ||
			username.trim().length > 12
		) {
			return res
				.status(400)
				.json({ message: "Username must be 8-12 characters" });
		}

		if (!pin || !/^\d{4,6}$/.test(pin)) {
			return res.status(400).json({ message: "PIN must be 4-6 digits" });
		}

		if (!firstName || !lastName) {
			return res
				.status(400)
				.json({ message: "First and Last name are required" });
		}

		// initial Balance check
		if (initialBalance === undefined || initialBalance === null) {
			return res.status(400).json({ message: "Initial balance is required" });
		}

		// Check if user exists
		const userExists = await User.findOne({
			username: username.toLowerCase().trim(),
		});
		if (userExists) {
			return res.status(400).json({ message: "Username already exists" });
		}

		// password hashing
		const salt = await bcrypt.genSalt(10);
		const hashedPin = await bcrypt.hash(pin, salt);

		// Create user
		const user = await User.create({
			username: username.toLowerCase().trim(),
			pin: hashedPin, // Store the Hash
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			initialBalance: Number(initialBalance),
			dailySpendingLimit: Number(dailySpendingLimit) || 1000,
		});

		// Response (Exclude PIN)
		res.status(201).json({
			_id: user._id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			initialBalance: user.initialBalance,
			dailySpendingLimit: user.dailySpendingLimit,
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ message: "Server error during registration" });
	}
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
	const { username, pin } = req.body;

	try {
		if (!username || !pin) {
			return res.status(400).json({ message: "Username and PIN are required" });
		}

		// Find user
		const user = await User.findOne({
			username: username.toLowerCase().trim(),
		});
		if (!user) {
			return res.status(401).json({ message: "Invalid username or PIN" });
		}

		// --- COMPARE HASHED PIN ---
		const isMatch = await bcrypt.compare(pin, user.pin);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid username or PIN" });
		}

		// Response
		res.json({
			_id: user._id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			initialBalance: user.initialBalance,
			dailySpendingLimit: user.dailySpendingLimit,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error during login" });
	}
});

module.exports = router;
