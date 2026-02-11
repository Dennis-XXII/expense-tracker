const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 12,
			unique: true,
			trim: true,
			lowercase: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		initialBalance: {
			type: Number,
			default: 0,
		},
		dailySpendingLimit: {
			type: Number,
			default: 1000,
		},
		pin: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("User", userSchema);
