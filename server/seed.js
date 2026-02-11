const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Adjust paths if your models are in a different folder
const User = require("./models/User");
const Transaction = require("./models/Transaction");

dotenv.config();

// Helper to get random number between min and max
const getRandomAmount = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedData = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB Connected...");

		// 1. FLUSH DATA
		await User.deleteMany({});
		await Transaction.deleteMany({});
		console.log("Database Flushed.");

		// 2. CREATE USER: Dennis Swar
		const salt = await bcrypt.genSalt(10);
		const hashedPin = await bcrypt.hash("1234", salt);

		const user = await User.create({
			username: "dennis123", // New Username
			firstName: "Dennis", // New Name
			lastName: "Swar",
			pin: hashedPin,
			initialBalance: 50000,
			dailySpendingLimit: 2000,
		});

		console.log(`User created: ${user.username} (PIN: 1234)`);

		// 3. GENERATE TRANSACTIONS (Last 3 Months)
		const transactions = [];
		const endDate = new Date(); // Today
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 3); // Go back 3 months
		startDate.setDate(1); // Start from the 1st of that month

		// Loop through every single day from Start Date until Today
		for (
			let d = new Date(startDate);
			d <= endDate;
			d.setDate(d.getDate() + 1)
		) {
			const currentDate = new Date(d);
			const dayOfMonth = currentDate.getDate();
			const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat

			// --- A. MONTHLY RECURRING (Salary & Rent) ---
			// Let's say Salary comes on the 28th, Rent is paid on the 1st

			// 1. Pay Rent (1st of month)
			if (dayOfMonth === 1) {
				transactions.push({
					user: user._id,
					type: "expense",
					category: "Housing",
					amount: 6000,
					description: "Monthly Rent Payment",
					date: new Date(currentDate),
				});
				// Utilities (Internet/Water) on the 1st too
				transactions.push({
					user: user._id,
					type: "expense",
					category: "Utilities",
					amount: getRandomAmount(1200, 1500),
					description: "Electric & Water Bill",
					date: new Date(currentDate),
				});
			}

			// 2. Salary (28th of month)
			if (dayOfMonth === 28) {
				transactions.push({
					user: user._id,
					type: "income",
					category: "Salary",
					amount: 20000,
					description: "Monthly Salary (Main Job)",
					date: new Date(currentDate),
				});
			}

			// --- B. WEEKLY / RANDOM INCOME (Freelance) ---
			// Approx once a week (15% chance per day), Max 5000
			if (Math.random() < 0.15) {
				const freelanceAmount = getRandomAmount(1500, 5000);
				transactions.push({
					user: user._id,
					type: "income",
					category: "Freelance",
					amount: freelanceAmount,
					description: "Freelance Project Payment",
					date: new Date(currentDate),
				});
			}

			// --- C. DAILY EXPENSES (Food, Transport, etc) ---

			// 1. Food (Very frequent - 90% chance per day)
			// Goal: ~5000/mo => ~160/day. We'll vary it between 80 and 350.
			if (Math.random() < 0.9) {
				const foodDesc = ["Lunch", "Dinner", "Groceries", "Coffee", "Snacks"][
					getRandomAmount(0, 4)
				];
				transactions.push({
					user: user._id,
					type: "expense",
					category: "Food",
					amount: getRandomAmount(80, 350),
					description: foodDesc,
					date: new Date(currentDate),
				});
			}

			// 2. Transport (Work days mostly)
			if (dayOfWeek >= 1 && dayOfWeek <= 5) {
				// Mon-Fri
				if (Math.random() < 0.8) {
					// 80% chance on work days
					transactions.push({
						user: user._id,
						type: "expense",
						category: "Transport",
						amount: getRandomAmount(45, 150),
						description: "BTS/Taxi Commute",
						date: new Date(currentDate),
					});
				}
			}

			// 3. Shopping / Entertainment (Random, lower frequency)
			// Goal: ~3000/mo for "Other".
			if (Math.random() < 0.2) {
				// 20% chance
				const shopDesc = [
					"7-Eleven",
					"Online Shopping",
					"Cinema",
					"Subscription",
					"Gadget",
				][getRandomAmount(0, 4)];
				transactions.push({
					user: user._id,
					type: "expense",
					category: "Shopping",
					amount: getRandomAmount(200, 1200),
					description: shopDesc,
					date: new Date(currentDate),
				});
			}
		}

		await Transaction.insertMany(transactions);
		console.log(
			`Successfully generated ${transactions.length} transactions over the last 3 months.`,
		);

		console.log("-----------------------------------");
		console.log("SEED COMPLETE. Login with:");
		console.log("Username: dennis123");
		console.log("PIN:      1234");
		console.log("-----------------------------------");

		process.exit();
	} catch (error) {
		console.error("Seed Error:", error);
		process.exit(1);
	}
};

seedData();
