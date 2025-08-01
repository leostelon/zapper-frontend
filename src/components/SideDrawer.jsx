import "./SideDrawer.css";

function SideDrawer({ isOpen, onClose, children }) {
	return (
		<>
			<div className={`side-drawer ${isOpen ? "open" : ""}`}>
				<button className="close-btn" onClick={onClose}>
					×
				</button>
				{children}
			</div>
			{isOpen && <div className="backdrop" onClick={onClose} />}
		</>
	);
}

export default SideDrawer;
