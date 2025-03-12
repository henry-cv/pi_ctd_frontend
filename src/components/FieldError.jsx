import "../css/components/FieldError.css"; // Importa el archivo FieldError.css
import PropTypes from "prop-types";

const FieldError = ({ message }) => {
  return <p style={{ color: "var(--color-error)" }}>{message}</p>;
};

FieldError.propTypes = {
  message: PropTypes.string.isRequired,
};

export default FieldError;
