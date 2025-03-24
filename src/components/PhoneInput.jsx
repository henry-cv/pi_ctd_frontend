import { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import '../css/components/PhoneInput.css';
//import { countryCodeList } from "../constants/data/countryCodeList.js";
import PropTypes from 'prop-types';

const PhoneInput = ({ country }) => {
  //  const [selectedCountry, setSelectedCountry] = useState(countryCodeList[0]);
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(null);

  // Maneja cambio en el select de país
  /* const handleCountryChange = (e) => {
    const country = countryCodeList.find(c => c.code === e.target.value);
    console.log("Country encontrado: ", country)
    setSelectedCountry(country);
    setIsValid(null); // Reinicia validez
  }; */

  // Maneja el input del número
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    console.log("phoneNumber: ", phone)
    const fullNumber = `${country.dial_code}${value}`;
    console.log("fullNumber: ", fullNumber);
    const parsedNumber = parsePhoneNumberFromString(fullNumber);
    console.log("parsedNumber: ", parsedNumber);

    // Verifica si el número es válido para el país seleccionado
    if (parsedNumber && parsedNumber.isValid() && parsedNumber.country === country.code) {
      setIsValid(true);
    } else {
      setIsValid(false);
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
            placeholder="123456789"
            value={phone}
            onChange={handlePhoneChange}
          />
          {isValid === true && <span className="icon success">✅</span>}
          {isValid === false && <span className="icon error">❌</span>}
        </div>
      </div>
    </div>
  );
};
PhoneInput.propTypes = {
  country: PropTypes.object,
}
export default PhoneInput;
