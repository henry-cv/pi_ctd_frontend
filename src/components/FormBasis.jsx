import "../css/Form.css";
import { useState } from "react";

const FormBasis = () => {
  const [showExtraFields, setShowExtraFields] = useState(false);

  const toggleExtraFields = () => {
    setShowExtraFields(!showExtraFields);
  };

  return (
    <form className="form-base">
      <div>
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Inserta un título"
        />
      </div>
      <div>
        <label htmlFor="description">Descripción:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe tu actividad o evento y detalla lo que incluye para que las personas sepan qué recibirán."
        ></textarea>
      </div>
      <div>
        <label htmlFor="address">Dirección:</label>
        <input type="text" id="address" name="address" placeholder="Ingresa tu dirección" />
      </div>
      <div>
        <label htmlFor="city">Ciudad:</label>
        <select id="city" name="city" >
          <option value="" disabled selected>Selecciona tu ciudad</option>
          <option value="buenosaires">Buenos Aires</option>
          <option value="lapaz">La paz</option>
          <option value="lima">Lima</option>
          <option value="quito">Quito</option>
        </select>
      </div>
      <div>
        <button
          type="button"
          onClick={toggleExtraFields}
          className="hamburger-button"
        >
          &#9776; Añadir Tarifas {/* Icono de hamburguesa con label */}
        </button>
      </div>
      {showExtraFields && (
        <div className="extra-fields">
          <div>
            <label htmlFor="rateName">Nombre Tarifa:</label>
            <input
              type="text"
              id="rateName"
              name="rateName"
              placeholder="Inserta el nombre de la tarifa"
            />
          </div>
          <div>
            <label htmlFor="ratePrice">Precio:</label>
            <input
              type="number"
              id="ratePrice"
              name="ratePrice"
              placeholder="Inserta el precio"
            />
          </div>
          <div>
            <button type="button" className="save-rate-button">
              Guardar Tarifa
            </button>
          </div>
        </div>
      )}
      <div className="rates">
        <div>
          <label htmlFor="rateValue">Valor Tarifa:</label>
          <input
            type="number"
            id="rateValue"
            min="300"
            name="rateValue"
            placeholder="Inserta el valor"
          />
        </div>
        <div>
          <label htmlFor="rateType">Tarifa por:</label>
          <select id="rateType" name="rateType">
            <option value="" disabled selected>Selecciona el precio por tipo</option>
            <option value="perPerson">Por persona</option>
            <option value="perCouple">Por pareja</option>
            <option value="perGroup6">Por grupo (6)</option>
            <option value="perGroup10">Por grupo (10)</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="eventType">Tipo de evento:</label>
        <select id="eventType" name="eventType">
          <option value="type1">Tipo 1</option>
          <option value="type2">Tipo 2</option>
          <option value="type3">Tipo 3</option>
          <option value="type4">Tipo 4</option>
        </select>
      </div>
      <div>
        <label htmlFor="category">Categorías:</label>
        <select id="category" name="category">
          <option value="category1">Categoría 1</option>
          <option value="category2">Categoría 2</option>
          <option value="category3">Categoría 3</option>
          <option value="category4">Categoría 4</option>
        </select>
      </div>
      <div>
        <label htmlFor="language">Idioma:</label>
        <select id="language" name="language">
          <option value="spanish">Español</option>
          <option value="english">Inglés</option>
          <option value="italian">Italiano</option>
          <option value="french">Francés</option>
        </select>
      </div>
    </form>
  );
};

export default FormBasis;
