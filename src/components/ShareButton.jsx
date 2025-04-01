import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import "../css/components/ShareButton.css";

const ShareButton = ({ onClick }) => {
	return (
		<button className="share-button" onClick={onClick} aria-label="Compartir">
			<FontAwesomeIcon icon={faShareNodes} className="share-icon" />
		</button>
	);
};

export default ShareButton;
