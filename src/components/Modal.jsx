import { useState } from 'react';
import { X } from 'lucide-react';
import '../css/components/Modal.css';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Modal = ({ title, content, link, maxWidth, isOpen, onClose, path }) => {

  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  if (!isModalOpen) return null;


  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: maxWidth ? `${maxWidth}px` : "840px" }} >
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
            {/* <span className='modal-link' onClick={() => navigate(path)}>
              {link.title}{" "}
            </span> */}

            {/* <span className='modal-link' onClick={() => { navigate(path); setTimeout(() => window.location.reload(), 300); }}>{link.title} {link.text}</span> */}
            {/* <span onClick={() => { navigate(`${path}#article-id}`); setTimeout(() => window.location.reload(), 100); }}>{link.title} {link.text}</span> */}
            <span onClick={() => { navigate(`${path}#article-id`); setTimeout(() => window.location.reload(), 100); }}>{link.title} {link.text}</span>



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
