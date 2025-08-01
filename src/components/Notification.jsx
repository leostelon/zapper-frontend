import { useEffect, useState } from "react";
import "./Notification.css";

const Notification = ({ message, type = "info", onClose }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// Fade in
		setVisible(true);

		// Start fade out before unmount
		const fadeOutTimeout = setTimeout(() => setVisible(false), 2500);
		const removeTimeout = setTimeout(onClose, 3000);

		return () => {
			clearTimeout(fadeOutTimeout);
			clearTimeout(removeTimeout);
		};
	}, [onClose]);

	return (
		<div className={`notification ${type} ${visible ? "fade-in" : "fade-out"}`}>
			{message}
		</div>
	);
};

export default Notification;
