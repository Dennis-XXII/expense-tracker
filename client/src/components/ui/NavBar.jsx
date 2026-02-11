import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	FaChartPie,
	FaList,
	FaUser,
	FaSignOutAlt,
	FaWallet,
} from "react-icons/fa";
const Navbar = ({ user, setUser }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("user");
		setUser(null);
		navigate("/login");
	};

	const isActive = (path) => location.pathname === path;

	return (
		<>
			{/* Desktop Navbar */}
			<nav className="hidden md:block min-w-screen flex justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
				<div className="max-w-7xl px-6 h-16 flex items-center justify-between">
					{/* Logo */}
					<Link
						to="/dashboard"
						className="flex items-center gap-2 font-bold text-xl text-gray-800 tracking-tight">
						<div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
							<FaWallet size={20} className="text-white" />
						</div>
						<span className="font-bold text-2xl">
							Expense<span className="text-rose-500">Tracker</span>
						</span>
					</Link>

					{user && (
						<div className="flex items-center gap-2">
							<Link
								to="/dashboard"
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
									isActive("/dashboard")
										? "bg-brand-500 text-white"
										: "text-gray-600 hover:bg-gray-100"
								}`}>
								<FaChartPie />
								Dashboard
							</Link>
							<Link
								to="/transactions"
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
									isActive("/transactions")
										? "bg-brand-500 text-white"
										: "text-gray-600 hover:bg-gray-100"
								}`}>
								<FaList />
								Transactions
							</Link>
							<Link
								to="/profile"
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
									isActive("/profile")
										? "bg-brand-500 text-white"
										: "text-gray-600 hover:bg-gray-100"
								}`}>
								<FaUser />
								Profile
							</Link>
						</div>
					)}

					{user && (
						<button
							onClick={handleLogout}
							className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
							title="Logout">
							<FaSignOutAlt size={18} />
						</button>
					)}
				</div>
			</nav>

			{user && (
				<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
					<div className="flex items-center justify-around h-16 px-4">
						<Link
							to="/dashboard"
							className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all ${
								isActive("/dashboard")
									? "text-blue-600 bg-blue-50"
									: "text-gray-600"
							}`}>
							<FaChartPie size={20} />
							<span className="text-xs font-medium">Dashboard</span>
						</Link>

						<Link
							to="/transactions"
							className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all ${
								isActive("/transactions")
									? "text-blue-600 bg-blue-50"
									: "text-gray-600"
							}`}>
							<FaList size={20} />
							<span className="text-xs font-medium">Transactions</span>
						</Link>

						<Link
							to="/profile"
							className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all ${
								isActive("/profile")
									? "text-blue-600 bg-blue-50"
									: "text-gray-600"
							}`}>
							<FaUser size={20} />
							<span className="text-xs font-medium">Profile</span>
						</Link>
					</div>
				</nav>
			)}
		</>
	);
};
export default Navbar;
