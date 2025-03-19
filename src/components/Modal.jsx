import { useState } from 'react';
import { X } from 'lucide-react';
import '../css/components/Modal.css';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContextGlobal } from "../gContext/globalContext";

const Modal = ({ title, content, link, maxWidth, isOpen, onClose, path }) => {

  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const navigate = useNavigate();
  const { state } = useContextGlobal();
  const { theme } = state;
  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${theme}`} style={{ maxWidth: maxWidth ? `${maxWidth}px` : "840px" }} >

        <button
          onClick={closeModal}
          className={`modal-close-button ${theme}`}
        >
          <X size={24} />
        </button>

        <h3 className={`modal-title ${theme}`}>
          {title}
        </h3>

        <div className={`modal-message-area ${theme}`}>
          <p className={`modal-text ${theme}`} >
            {content}
          </p>
        </div>

        <div className={`modal-link-container ${theme}`}>
          <p>
            {/* <span className='modal-link' onClick={() => { navigate(path); setTimeout(() => window.location.reload(), 300); }}>{link.title} {link.text}</span> */}
            <span className={`modal-link ${theme}`} onClick={() => { navigate(path); }}>{link.title} {link.text}</span>
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
  isOpen: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  path: propTypes.string
}
export default Modal;
