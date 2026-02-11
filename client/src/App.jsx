import { useState, useEffect } from "react";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/ui/NavBar.jsx";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

function App() {
	const [user, setUser] = useState(null);

	// Check if user is already logged in
	useEffect(() => {
		const loggedInUser = localStorage.getItem("user");
		if (loggedInUser) {
			setUser(JSON.parse(loggedInUser));
		}
	}, []);

	// Logout
	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<Router>
			<div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
				{/* Simple Navbar */}
				{user && <Navbar user={user} setUser={setUser} />}

				<Routes>
					{/* Public Routes */}
					<Route
						path="/"
						element={
							!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />
						}
					/>
					<Route
						path="/register"
						element={
							!user ? (
								<Register setUser={setUser} />
							) : (
								<Navigate to="/dashboard" />
							)
						}
					/>

					{/* Protected Route */}
					<Route
						path="/dashboard"
						element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
					/>
					<Route
						path="/transactions"
						element={user ? <Transactions user={user} /> : <Navigate to="/" />}
					/>
					<Route
						path="/profile"
						element={
							user ? (
								<Profile user={user} setUser={setUser} />
							) : (
								<Navigate to="/" />
							)
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
