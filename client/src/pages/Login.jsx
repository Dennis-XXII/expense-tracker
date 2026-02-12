import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/api";

const Login = ({ setUser }) => {
	const [formData, setFormData] = useState({ username: "", pin: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const user = await loginUser(formData);
			setUser(user);
			localStorage.setItem("user", JSON.stringify(user));
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-xl  w-96">
				<h2 className="text-2xl font-bold mb-6 text-center text-brand-500">
					Expense<span className="text-rose-600">.</span>Tracker
				</h2>

				{error && (
					<div className="bg-red-100 text-red-700 p-2 mb-4 rounded-lg text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							className="mt-1 w-full p-2 border rounded-lg focus:ring-brand-500 focus:border-gray-800"
							value={formData.username}
							onChange={(e) =>
								setFormData({ ...formData, username: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							PIN (4-6 digits)
						</label>
						<input
							type="password"
							maxLength="6"
							className="mt-1 w-full p-2 border rounded-lg focus:ring-brand-500 focus:border-gray-800"
							value={formData.pin}
							onChange={(e) =>
								setFormData({ ...formData, pin: e.target.value })
							}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-brand-500 text-white p-2 rounded-lg hover:bg-gray-800">
						Login
					</button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-600">
					New here?{" "}
					<Link to="/register" className="text-blue-500 hover:underline">
						Create Account
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
