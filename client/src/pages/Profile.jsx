import { useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom";
import { FaWallet, FaCoins, FaPen, FaTimes } from "react-icons/fa"; // Added FaPen, FaTimes
import { updateUser } from "../utils/api"; // Added updateUser API

const Profile = ({ user, setUser }) => {
	const navigate = useNavigate();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state
	const [formData, setFormData] = useState({});

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		setUser(null);
		navigate("/");
	};

	// Open modal and pre-fill data
	const handleEditClick = () => {
		setFormData({
			firstName: user.firstName,
			lastName: user.lastName,
			initialBalance: user.initialBalance,
			dailySpendingLimit: user.dailySpendingLimit,
		});
		setIsEditModalOpen(true);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			const updatedUser = await updateUser(user._id, formData);
			setUser({ ...user, ...updatedUser });
			localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
			setIsEditModalOpen(false);
		} catch (error) {
			alert("Failed to update profile");
		}
	};

	return (
		<div className="p-2 lg:pt-20 lg:px-6 max-w-screen mx-auto min-h-screen">
			<h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-2">
				My Profile
			</h1>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[800px]">
				<div className="bg-brand-500 h-32 relative">
					<div className="absolute -bottom-10 left-8">
						<div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
							<div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-3xl">
								<span className="font-bold text-brand-500">
									{user.firstName ? user.firstName[0].toUpperCase() : "U"}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="pt-14 px-8 pb-8 relative">
					{/* EDIT BUTTON Added Here */}
					<button
						onClick={handleEditClick}
						className="absolute top-4 right-8 flex items-center gap-2 text-gray-500 hover:text-brand-600 border border-gray-200 px-4 py-2 rounded-xl transition-all">
						<FaPen size={12} /> <span className="text-sm font-bold">Edit</span>
					</button>

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

			{/* EDIT PROFILE MODAL */}
			{isEditModalOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
					<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
						<div className="p-4 border-b border-gray-100 flex justify-between items-center">
							<h3 className="font-bold text-lg text-gray-800">Edit Profile</h3>
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="text-gray-400 hover:text-gray-600">
								<FaTimes size={20} />
							</button>
						</div>

						<form onSubmit={handleSave} className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
										First Name
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
										value={formData.firstName}
										onChange={(e) =>
											setFormData({ ...formData, firstName: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
										Last Name
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
										value={formData.lastName}
										onChange={(e) =>
											setFormData({ ...formData, lastName: e.target.value })
										}
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
									Initial Balance
								</label>
								<input
									type="number"
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
									value={formData.initialBalance}
									onChange={(e) =>
										setFormData({ ...formData, initialBalance: e.target.value })
									}
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
									Daily Spending Limit
								</label>
								<input
									type="number"
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
									value={formData.dailySpendingLimit}
									onChange={(e) =>
										setFormData({
											...formData,
											dailySpendingLimit: e.target.value,
										})
									}
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 mt-4">
								Save Changes
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
