import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api";

const Register = ({ setUser }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		pin: "",
		initialBalance: "1",
		dailySpendingLimit: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (formData.username.length < 8)
			return setError("Username must be 8+ chars");
		if (formData.pin.length < 4) return setError("PIN must be 4-6 digits");

		try {
			const user = await registerUser(formData);
			setUser(user);
			localStorage.setItem("user", JSON.stringify(user));
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
			<div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
					Create Account
				</h2>

				{error && (
					<div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Auth Info */}
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<label className="block text-sm font-medium text-gray-700">
								Username (8-12 chars)
							</label>
							<input
								type="text"
								className="mt-1 w-full p-2 border rounded"
								value={formData.username}
								onChange={(e) =>
									setFormData({ ...formData, username: e.target.value })
								}
								required
							/>
						</div>
						<div className="col-span-2">
							<label className="block text-sm font-medium text-gray-700">
								PIN (4-6 digits)
							</label>
							<input
								type="password"
								className="mt-1 w-full p-2 border rounded"
								value={formData.pin}
								onChange={(e) =>
									setFormData({ ...formData, pin: e.target.value })
								}
								required
							/>
						</div>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700">
							First Name
						</label>
						<input
							type="text"
							className="mt-1 w-full p-2 border rounded"
							value={formData.firstName}
							onChange={(e) =>
								setFormData({ ...formData, firstName: e.target.value })
							}
							required
						/>
					</div>
					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700">
							Last Name
						</label>
						<input
							type="text"
							className="mt-1 w-full p-2 border rounded"
							value={formData.lastName}
							onChange={(e) =>
								setFormData({ ...formData, lastName: e.target.value })
							}
							required
						/>
					</div>

					<div className="border-t pt-4">
						<h3 className="text-sm font-semibold text-gray-500 mb-3">
							Financial Setup
						</h3>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-medium text-gray-700">
									Initial Balance (THB)
								</label>
								<input
									type="number"
									className="mt-1 w-full p-2 border rounded"
									placeholder="0.00"
									value={formData.initialBalance}
									onChange={(e) =>
										setFormData({ ...formData, initialBalance: e.target.value })
									}
								/>
							</div>
							<div className="col-span-2">
								<label className="block text-xs font-medium text-gray-700">
									Daily Spending Limit (฿)
								</label>
								<input
									type="number"
									className="mt-1 w-full p-2 border rounded"
									placeholder="e.g. 1000"
									value={formData.dailySpendingLimit}
									onChange={(e) =>
										setFormData({
											...formData,
											dailySpendingLimit: e.target.value,
										})
									}
								/>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-brand-500 text-white p-2 rounded-lg hover:bg-gray-800 mt-4">
						Register
					</button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link to="/" className="text-blue-500 hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
