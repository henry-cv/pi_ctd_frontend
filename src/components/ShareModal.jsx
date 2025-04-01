import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
	EmailShareButton,
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	EmailIcon,
	FacebookIcon,
	TwitterIcon,
	WhatsappIcon,
} from "react-share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faStar } from "@fortawesome/free-solid-svg-icons";
import "../css/components/ShareModal.css";

const ShareModal = ({ open, onClose, activity, image }) => {
	const [copied, setCopied] = useState(false);
	const shareUrl = window.location.href;
	const title = `¡Descubre ${activity.nombre} en GoBook!`;
	const shareDescription = `${activity.nombre} en ${activity.ciudad}, ${activity.pais}. ¡Una experiencia increíble que no te puedes perder!`;

	const handleCopyLink = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Esta función abrirá enlaces en una nueva pestaña
	const openInNewTab = (url) => {
		const newWindow = window.open(url, "_blank");
		newWindow.opener = null;
		return true;
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			className="share-modal"
		>
			<DialogTitle className="share-modal-title">
				Comparte esta actividad
				<IconButton
					edge="end"
					color="inherit"
					onClick={onClose}
					aria-label="cerrar"
					className="close-button"
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent className="share-modal-content">
				<div className="activity-preview">
					<div className="activity-preview-image">
						<img src={image} alt={activity.nombre} />
					</div>
					<div className="activity-preview-info">
						<h3>{activity.nombre}</h3>
						<p className="location">
							{activity.ciudad}, {activity.pais}
						</p>
						<div className="rating">
							<FontAwesomeIcon icon={faStar} className="star-icon" />
							<span>{activity.calificacion || 4.5}/5</span>
						</div>
					</div>
				</div>

				<div className="share-grid-container">
					<button
						className={`share-button-link div1 ${copied ? "copied" : ""}`}
						onClick={handleCopyLink}
					>
						<FontAwesomeIcon icon={faCopy} />
						<span>{copied ? "Enlace copiado" : "Copiar enlace"}</span>
					</button>

					<WhatsappShareButton
						url={shareUrl}
						title={shareDescription}
						className="share-button-social div2"
						beforeOnClick={() =>
							openInNewTab(
								`https://wa.me/?text=${encodeURIComponent(shareDescription + " " + shareUrl)}`,
							)
						}
					>
						<WhatsappIcon
							size={32}
							round
							bgStyle={{ fill: "#FFFFFF" }}
							iconFillColor="#000000"
						/>
						<span>WhatsApp</span>
					</WhatsappShareButton>

					<TwitterShareButton
						url={shareUrl}
						title={shareDescription}
						className="share-button-social div3"
						beforeOnClick={() =>
							openInNewTab(
								`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareDescription)}`,
							)
						}
					>
						<TwitterIcon
							size={32}
							round
							bgStyle={{ fill: "#FFFFFF" }}
							iconFillColor="#000000"
						/>
						<span>Twitter</span>
					</TwitterShareButton>

					<EmailShareButton
						url={shareUrl}
						subject={title}
						body={shareDescription}
						className="share-button-social div4"
						beforeOnClick={() =>
							openInNewTab(
								`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareDescription + "\n\n" + shareUrl)}`,
							)
						}
					>
						<EmailIcon
							size={32}
							round
							bgStyle={{ fill: "#FFFFFF" }}
							iconFillColor="#000000"
						/>
						<span>Correo</span>
					</EmailShareButton>

					<FacebookShareButton
						url={shareUrl}
						quote={shareDescription}
						className="share-button-social div5"
						beforeOnClick={() =>
							openInNewTab(
								`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareDescription)}`,
							)
						}
					>
						<FacebookIcon
							size={32}
							round
							bgStyle={{ fill: "#FFFFFF" }}
							iconFillColor="#000000"
						/>
						<span>Facebook</span>
					</FacebookShareButton>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ShareModal;
