// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

// @route   PUT /api/users/:id
// @desc    Update user profile (Names, Balance, Limits)
router.put("/:id", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: "Invalid User ID" });
		}

		const { firstName, lastName, initialBalance, dailySpendingLimit } =
			req.body;

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update fields only if they are provided in the request
		if (firstName) user.firstName = firstName.trim();
		if (lastName) user.lastName = lastName.trim();
		if (initialBalance !== undefined)
			user.initialBalance = Number(initialBalance);
		if (dailySpendingLimit !== undefined)
			user.dailySpendingLimit = Number(dailySpendingLimit);

		const updatedUser = await user.save();

		// Return updated user info (excluding PIN)
		res.json({
			_id: updatedUser._id,
			username: updatedUser.username,
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			initialBalance: updatedUser.initialBalance,
			dailySpendingLimit: updatedUser.dailySpendingLimit,
		});
	} catch (error) {
		console.error("Update profile error:", error);
		res.status(500).json({ message: "Error updating profile" });
	}
});

module.exports = router;
