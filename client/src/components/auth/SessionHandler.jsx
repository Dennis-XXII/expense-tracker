import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionHandler = ({ setUser }) => {
	const navigate = useNavigate();
	//20 minutes inactivity timeout
	const TIMEOUT_DURATION = 20 * 60 * 1000;

	useEffect(() => {
		let logoutTimer;

		// // Function to run when user is inactive
		const handleLogout = () => {
			console.log("User inactive. Logging out...");
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			setUser(null);
			navigate("/");
		};

		// // Function to reset the timer on any activity
		const resetTimer = () => {
			if (logoutTimer) clearTimeout(logoutTimer);
			logoutTimer = setTimeout(handleLogout, TIMEOUT_DURATION);
		};

		// // Listen for these events
		const events = [
			"mousedown",
			"mousemove",
			"keydown",
			"scroll",
			"touchstart",
			"click",
			"keyup",
			"wheel",
		];

		// // Attach listeners
		events.forEach((event) => {
			window.addEventListener(event, resetTimer);
		});

		// // Start the timer initially
		resetTimer();

		// // Cleanup on unmount
		return () => {
			if (logoutTimer) clearTimeout(logoutTimer);
			events.forEach((event) => {
				window.removeEventListener(event, resetTimer);
			});
		};
	}, [navigate, setUser]);

	return null;
};

export default SessionHandler;
