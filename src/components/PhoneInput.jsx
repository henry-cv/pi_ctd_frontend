import { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import '../css/components/PhoneInput.css';
import FieldError from './FieldError';
import PropTypes from 'prop-types';


const PhoneInput = ({ country, phoneData, setPhoneData }) => {
  const [phone, setPhone] = useState(phoneData?.phone || "");
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState("");

  // Maneja el input del número
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (!value) {
      setIsValid(null);
      setError("");
      return;
    }

    const fullNumber = `${country.dial_code}${value}`;
    const parsedNumber = parsePhoneNumberFromString(fullNumber);

    if (parsedNumber && parsedNumber.isValid() && parsedNumber.country === country.code) {
      setIsValid(true);
      setError("");
      setPhoneData({
        dial_code: country.dial_code,
        phone: parsedNumber.nationalNumber,
      });
    } else {
      setIsValid(false);
      setError("El número ingresado no es válido");
      setPhoneData(null);
    }
  };


  return (
    <div className="container-whatsapp-number">
      <div className="phone-number">
        <label htmlFor="phone-number">Teléfono:</label>
        <div className="phone-field">
          <span className="dial-code">{phoneData?.dial_code}</span>
          <input
            type="tel"
            name="telefono"
            id="phone-number"
            placeholder="1234567890"
            value={phoneData?.phone}
            onChange={handlePhoneChange}
          />
          {isValid === true && <span className="icon success">✅</span>}
          {isValid === false && <span className="icon error">❌</span>}
        </div>
        {error && <FieldError message={error} />}
      </div>
    </div>
  );
};
PhoneInput.propTypes = {
  country: PropTypes.shape({
    dial_code: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }).isRequired,
  setPhoneData: PropTypes.func.isRequired,
  phoneData: PropTypes.object.isRequired,
};

export default PhoneInput;
