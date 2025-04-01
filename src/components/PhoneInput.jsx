import { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import '../css/components/PhoneInput.css';
//import { countryCodeList } from "../constants/data/countryCodeList.js";
import FieldError from './FieldError';
import PropTypes from 'prop-types';


const PhoneInput = ({ country, setPhoneNumber }) => {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState("");

  // Maneja el input del número
  const handlePhoneChange = (e) => {
    setIsValid(null); // Reinicia validez
    const value = e.target.value;
    setPhone(value);

    const fullNumber = `${country.dial_code}${value}`;
    const parsedNumber = parsePhoneNumberFromString(fullNumber);

    // Verifica si el número es válido para el país seleccionado
    if (parsedNumber && parsedNumber.isValid() && parsedNumber.country === country.code) {
      setIsValid(true);
      setPhoneNumber(parsedNumber.number);
      //console.log("PhoneInput component, valor de parsedNumber: ", parsedNumber + "-->" + parsedNumber.number);
      setError("");
    } else {
      setIsValid(false);
      setError("El número ingresado no es válido")
    }
  };

  return (
    <div className="container-whatsapp-number">
      <div className="phone-number">
        <label htmlFor="phone-number">Teléfono:</label>
        <div className="phone-field">
          <span className="dial-code">{country.dial_code}</span>
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
  country: PropTypes.object,
  phoneNumber: PropTypes.string,
  setPhoneNumber: PropTypes.func
}

export default PhoneInput;
