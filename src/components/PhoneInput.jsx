import { useEffect, useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import '../css/components/PhoneInput.css';
import FieldError from './FieldError';
import PropTypes from 'prop-types';


const PhoneInput = ({ country, telefono, setTelefono }) => {
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState(country.dial_code || "");
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (telefono) {
      const parsedNumber = parsePhoneNumberFromString(telefono);
      if (parsedNumber) {
        setPhone(parsedNumber.nationalNumber);
        setDialCode(parsedNumber.countryCallingCode || country.dial_code || "");
      }
    } else {
      setPhone("");
      setDialCode(country.dial_code || "");
    }
  }, [telefono, country]);
  useEffect(() => {
    if (country) {
      setDialCode(country.dial_code);
    }
  }, [country]);

  // Maneja el input del número
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (!value) {
      setIsValid(null);
      setError("");
      return;
    }

    const fullNumber = `${dialCode}${value}`;
    const parsedNumber = parsePhoneNumberFromString(fullNumber);

    if (parsedNumber && parsedNumber.isValid() && parsedNumber.country === country.code) {
      setIsValid(true);
      setError("");
      setTelefono(parsedNumber.number);
    } else {
      setIsValid(false);
      setError("El número ingresado no es válido");
      setTelefono("");
    }
  };


  return (
    <div className="container-whatsapp-number">
      <div className="phone-number">
        <label htmlFor="phone-number">Teléfono:</label>
        <div className="phone-field">
          <span className="dial-code">{dialCode}</span>
          <input
            type="tel"
            name="telefono"
            id="phone-number"
            placeholder="1234567890"
            value={phone}
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
  }),
  setTelefono: PropTypes.func.isRequired,
  telefono: PropTypes.string,
};

export default PhoneInput;
