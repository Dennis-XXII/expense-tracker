const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
			index: true,
		},
		type: {
			type: String,
			enum: ["income", "expense"],
			required: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		date: {
			type: Date,
			default: Date.now,
			index: true, // Index for date queries
		},
		description: {
			type: String,
			default: "",
			maxlength: 300, // Prevent long descriptions
		},
	},
	{
		timestamps: true,
	},
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
