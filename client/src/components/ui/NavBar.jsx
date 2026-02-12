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
			<nav className="hidden md:block sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md  ">
				<div className="max-w-screen mx-auto px-6 h-16 flex items-center justify-between">
					<Link
						to="/dashboard"
						className="flex items-center gap-2 font-bold text-xl text-gray-800 tracking-tight hover:opacity-80 transition-opacity">
						<div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center -sm">
							<FaWallet size={16} className="text-white" />
						</div>
						<span className="font-bold text-xl">
							Expense<span className="text-rose-500">.</span>Tracker
						</span>
					</Link>

					{/* 2. Navigation Links (Center) */}
					{user && (
						<div className="grid grid-cols-3 items-center gap-1 bg-gray-100 p-1 rounded-full ">
							<Link
								to="/dashboard"
								className={`flex w-full place-items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
									isActive("/dashboard")
										? "bg-white text-brand-500 rounded-full"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
								}`}>
								<FaChartPie size={14} />
								Dashboard
							</Link>
							<Link
								to="/transactions"
								className={`flex w-full place-items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
									isActive("/transactions")
										? "bg-white text-brand-500 rounded-full"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
								}`}>
								<FaList size={14} />
								Transactions
							</Link>
							<Link
								to="/profile"
								className={`flex w-full place-items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
									isActive("/profile")
										? "bg-white text-brand-500 rounded-full"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
								}`}>
								<FaUser size={14} />
								Profile
							</Link>
						</div>
					)}

					{/* 3. User / Logout (Right) */}
					{user && (
						<div className="flex items-center gap-4">
							<button
								onClick={handleLogout}
								className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all  ransparent hover:"
								title="Logout">
								<FaSignOutAlt size={18} />
							</button>
						</div>
					)}
				</div>
			</nav>

			{user && (
				<nav className="md:hidden px-4 py-2 bg-white fixed bottom-0 left-0 right-0 z-50">
					<div className="grid grid-cols-3 items-center bg-gray-100 rounded-full justify-around h-16 px-1">
						<Link
							to="/dashboard"
							className={`flex flex-col col-span-1 items-center justify-center gap-1 px-6 py-2 rounded-full transition-all ${
								isActive("/dashboard")
									? "text-brand-500 bg-white"
									: "text-gray-400"
							}`}>
							<FaChartPie size={20} />
							<span className="text-xs font-medium">Dashboard</span>
						</Link>

						<Link
							to="/transactions"
							className={`flex flex-col col-span-1 items-center justify-center gap-1 px-6 py-2 rounded-full transition-all ${
								isActive("/transactions")
									? "text-brand-500 bg-white"
									: "text-gray-400"
							}`}>
							<FaList size={20} />
							<span className="text-xs font-medium">Transactions</span>
						</Link>

						<Link
							to="/profile"
							className={`flex flex-col col-span-1 items-center justify-center gap-1 px-6 py-2 rounded-full transition-all ${
								isActive("/profile")
									? "text-brand-500 bg-white"
									: "text-gray-400"
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
