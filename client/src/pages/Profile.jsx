import { useNavigate } from "react-router-dom";
import { FaWallet, FaCashRegister, FaCoins } from "react-icons/fa";

const Profile = ({ user, setUser }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Clear localStorage
		localStorage.removeItem("user");
		localStorage.removeItem("token");

		// Reset State
		setUser(null);

		// Redirect to Login
		navigate("/");
	};

	return (
		<div className="p-2 lg:pt-20 lg:px-6 max-w-screen mx-auto min-h-screen">
			<h1 className="hidden md:blocktext-3xl font-bold text-gray-800 mb-2">
				My Profile
			</h1>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[800px]">
				<div className="bg-brand-500 h-32 relative">
					<div className="absolute -bottom-10 left-8">
						<div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
							<div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-3xl">
								<span className="font-bold text-blue-600">
									{user.firstName ? user.firstName[0].toUpperCase() : "U"}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="pt-14 px-8 pb-8">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-800">
							{user.firstName} {user.lastName}
						</h2>
						<p className="text-gray-500 font-medium">@{user.username}</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
							<div className="flex items-center gap-2 mb-1">
								<FaCoins />
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
									Daily Spending Limit
								</p>
							</div>
							<p className="text-xl font-bold text-gray-800">
								฿{user.dailySpendingLimit?.toLocaleString()}
							</p>
						</div>

						<div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
							<div className="flex items-center gap-2 mb-1">
								<FaWallet />
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
									Initial Balance
								</p>
							</div>
							<p className="text-xl font-bold text-gray-800">
								฿{user.initialBalance?.toLocaleString()}
							</p>
						</div>
					</div>
					<div className="pt-6 border-t border-gray-100">
						<button
							onClick={handleLogout}
							className="w-full md:w-auto px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
							<span>Sign Out</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
