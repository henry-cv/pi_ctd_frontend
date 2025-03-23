import { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import '../css/PhoneInput.css';
import { countryCodeList } from "../constants/data/countryCodeList.js";

const PhoneInput = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodeList[0]);
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(null);

  // Maneja cambio en el select de país
  const handleCountryChange = (e) => {
    const country = countryCodeList.find(c => c.code === e.target.value);
    console.log("Country encontrado: ", country)
    setSelectedCountry(country);
    setIsValid(null); // Reinicia validez
  };

  // Maneja el input del número
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    console.log("phoneNumber: ", phone)
    const fullNumber = `${selectedCountry.dialCode}${value}`;
    console.log("fullNumber: ", fullNumber);
    const parsedNumber = parsePhoneNumberFromString(fullNumber);
    console.log("parsedNumber: ", parsedNumber);

    // Verifica si el número es válido para el país seleccionado
    if (parsedNumber && parsedNumber.isValid() && parsedNumber.country === selectedCountry.code) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="container-whatsapp-number">
      <div className="country-code" >
        <label htmlFor="country-select">País:</label>
        <select id="country-select" onChange={handleCountryChange} value={selectedCountry.code}>
          <option value="" disabled>Selecciona el código</option>
          {countryCodeList.map((country, index) => (
            <option key={index} value={country.code}>
              {country.name} ({country.dialCode})
            </option>
          ))}
        </select>
      </div>
      <div className="phone-number">
        <label htmlFor="phone-number">Teléfono:</label>
        <div className="phone-field">
          <span className="dial-code">{selectedCountry.dialCode}</span>
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

export default PhoneInput;
