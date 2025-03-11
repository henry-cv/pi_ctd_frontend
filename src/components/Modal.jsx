import { useState } from 'react';
import { X } from 'lucide-react';
import '../../css/Modal.css'; // Importamos los estilos
import propTypes from 'prop-types';

const Modal = ({ title, content, link, maxWidth }) => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: `${maxWidth}px` }} >
        <button
          onClick={closeModal}
          className="modal-close-button"
        >
          <X size={24} />
        </button>

        <h3 className="modal-title">
          {title}
        </h3>

        <div className="modal-message-area">
          <p className="modal-text">
            {content}
          </p>
        </div>

        <div className="modal-link-container">
          <p>
            <a
              href="/politicas"
              className="modal-link"
            >
              {link.title}
            </a> {link.text}
          </p>
        </div>
      </div>
    </div >
  );
};
Modal.propTypes = {
  title: propTypes.string.isRequired,
  content: propTypes.string.isRequired,
  link: propTypes.shape({
    title: propTypes.string,
    text: propTypes.string,
  }),
  maxWidth: propTypes.number.isRequired,
}
export default Modal;