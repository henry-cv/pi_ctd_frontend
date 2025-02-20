import "../css/Form.css";
import "../css/variables.css";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ButtonBluePill from "./ButtonBluePill";
import { FaSave } from "react-icons/fa";
import Horas from "./Horas";
import DateCalendar from "./DateCalendar";
import Days from "./Days";
import { validarTexto, validarAreaTexto } from "../utils/utils";
import FieldError from "./FieldError";


const FormBasis = () => {
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [eventType, setEventType] = useState("");
  const [titulo, setTitulo] = useState("");
  const [errorTitulo, setErrorTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");
  //const [direccion, setDireccion] = useState("");
  //const [errorDireccion, setErrorDireccion] = useState("");
  //const [nombreTarifa, setNombreTarifa] = useState("");
  //const [errorNombreTarifa, setErrorNombreTarifa] = useState("");

  const [valorTarifa, setValorTarifa] = useState("");
  const [tipoTarifa, setTipoTarifa] = useState("");
  const [idioma, setIdioma] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [diasDisponible, setDiasDisponible] = useState([]);
  const [fechaEvento, setFechaEvento] = useState("");
  //const [categoriasNombres, setCategoriasNombres] = useState(new Set());
  //const [imagenes, setImagenes] = useState([]);


  const toggleExtraFields = () => {
    setShowExtraFields(!showExtraFields);
  };

  const handleDelete = () => {
    console.log("Hizo click en eliminar tarifa");
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleTitleBlur = (e) => {
    const maximo = 50;
    const texto = e.target.value;
    if (!validarTexto(texto, maximo)) {
      setErrorTitulo(
        `Título debe tener entre 4 y máximo ${maximo}, sin números o caracteres especiales`
      );
    } else {
      setErrorTitulo("");
    }
  };

  const handleDescriptionChange = (e) => {
    const texto = e.target.value;
    const maximo = 100;
    if (!validarAreaTexto(texto, maximo)) {
      setErrorDescripcion(`La desripción debe tener entre 4 y máximo ${maximo} carácteres`);
    } else {
      setErrorDescripcion("");
    }
    setDescripcion(texto);
  };
  const handleAddressBlur = (e) => {
    const maximo = 60;
    const texto = e.target.value;
    if (!validarAreaTexto(texto, maximo)) {
      setErrorDireccion(`La dirección debe tener entre 4 y máximo ${maximo} caracteres`);
    } else {
      setErrorDireccion("");
    }
    setDireccion(texto);
  };
  const handleRateNameBlur = (e) => {
    const maximo = 50;
    const texto = e.target.value;
    if (!validarTexto(texto, maximo)) {
      setErrorNombreTarifa(
        `Nombre de tarifa debe tener entre 4 y máximo ${maximo}, sin números o caracteres especiales`
      );
    } else {
      setErrorNombreTarifa("");
    }
  };

  // const handleDateChange = (date) => {
  //   setFechaEvento(date);
  // };

  // const handleHoursChange = (start, end) => {
  //   setHoraInicio(start);
  //   setHoraFin(end);
  // };
  const handleDateChange = (e) => {
    setFechaEvento(e.target.value);  // ✅ Captura correctamente la fecha seleccionada
};

const handleHoraInicioChange = (e) => {
    setHoraInicio(e.target.value);  // ✅ Captura correctamente la hora de inicio
};

const handleHoraFinChange = (e) => {
    setHoraFin(e.target.value);  // ✅ Captura correctamente la hora de fin
};

  const handleDaysChange = (selectedDays) => {
    setDiasDisponible(selectedDays);
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if (tipoTarifa === "") {
      alert("Debe seleccionar un tipo de tarifa");
      return;
  }

  if (isNaN(valorTarifa) || valorTarifa <= 0) {
      alert("El valor de la tarifa debe ser un número positivo");
      return;
  }

    const formData = {
      nombre: titulo,
      descripcion,
      valorTarifa: parseFloat(valorTarifa),
      tipoTarifa,
      idioma,
      horaInicio: `${horaInicio}:00`,
      horaFin: `${horaFin}:00`,
      tipoEvento: eventType,
      diasDisponible: eventType === "RECURRENTE" ? diasDisponible : null,
      fechaEvento: eventType === "FECHA_UNICA" ? fechaEvento : null,
      //categoriasNombres: Array.from(categoriasNombres),
      //imagenes,
    }
    console.log("Enviando datos al backend:", JSON.stringify(formData, null, 2));

    try {
      const response = await fetch("/api/producto/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      alert("Datos enviados correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al enviar los datos: ${error.message}`);
    }
  };



    
  


  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="container-name">
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          name="nombre"
          placeholder="Inserta un título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={handleTitleBlur}
          required
        />
        {errorTitulo && <FieldError message={errorTitulo} />}
      </div>
      <div className="container-description">
        <label htmlFor="description">Descripción:</label>
        <textarea
          id="description"
          name="descripcion"
          placeholder="Describe tu actividad o evento y detalla lo que incluye para que las personas sepan qué recibirán."
          value={descripcion}
          onChange={handleDescriptionChange}
          required
        ></textarea>
        {errorDescripcion && <FieldError message={errorDescripcion} />}
      </div>
      {/* <div className="container-address">
        <label htmlFor="address">Dirección:</label>
        <input
          type="text"
          id="address"
          name="direccion"
          placeholder="Ingresa tu dirección"
          value={direccion}
          onChange={handleAddressBlur}
          required
        />
        {errorDireccion && <FieldError message={errorDireccion} />}
      </div>
      <div className="container-city">
        <label htmlFor="city">Ciudad:</label>
        <select id="city" name="ciudad" required>
          <option value="" disabled selected>
            Selecciona tu ciudad
          </option>
          <option value="buenosaires">Buenos Aires</option>
          <option value="lapaz">La paz</option>
          <option value="lima">Lima</option>
          <option value="quito">Quito</option>
        </select>
      </div> */}
      <div className="container-addrate">
        <button
          type="button"
          onClick={toggleExtraFields}
          className="hamburger-button"
        >
          &#x2795; Añadir Tarifas {/* Icono de hamburguesa con label */}
        </button>
      </div>
      {showExtraFields && (
        <div className="extra-fields">
          <div>
            <label htmlFor="rateName">Nombre Tarifa:</label>
            <select 
    id="rateType" 
    value={tipoTarifa} 
    onChange={(e) => setTipoTarifa(e.target.value)} // ✅ Captura correctamente el valor seleccionado
    required
  >
    <option value="" disabled>Selecciona el tipo de tarifa</option>
    <option value="POR_PERSONA">Por persona</option>
    <option value="POR_PAREJA">Por pareja</option>
    <option value="POR_GRUPO_6">Por grupo (6)</option>
    <option value="POR_GRUPO_10">Por grupo (10)</option>
  </select>
            {/* {errorNombreTarifa && <FieldError message={errorNombreTarifa} />} */}
          </div>
          <div>
            <label htmlFor="ratePrice">Precio:</label>
            <input
              type="number"
              id="ratePrice"
              min="1"
              placeholder="Inserta el precio"
              required
            />
          </div>
          <div className="centered-button">
            <button type="button" className="save-rate-button">
              <FaSave />
            </button>
          </div>
        </div>
      )}
      <div className="rates">
      <div>
        <label htmlFor="rateValue">Valor tarifa:</label>
        <input 
            type="number" 
            id="rateValue" 
            value={valorTarifa} 
            onChange={(e) => setValorTarifa(e.target.value)} 
            required 
        />
    </div>
    <div>
        <label htmlFor="rateType">Tarifa por:</label>
        <select 
            id="rateType" 
            name="tipoTarifa" 
            value={tipoTarifa} // ✅ Se enlaza correctamente con el estado
            onChange={(e) => setTipoTarifa(e.target.value)} // ✅ Captura el valor correctamente
            required
        >
            <option value="" disabled>Selecciona el tipo de tarifa</option>
            <option value="POR_PERSONA">Por persona</option>
            <option value="POR_PAREJA">Por pareja</option>
            <option value="POR_GRUPO_6">Por grupo (6)</option>
            <option value="POR_GRUPO_10">Por grupo (10)</option>
        </select>
    </div>
        <button type="button" className="delete-button" onClick={handleDelete}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <div className="container-events">
        <label htmlFor="eventType">Tipo de evento:</label>
        <select
          id="eventType"
          name="eventType"
          onChange={handleEventTypeChange}
          required
        >
          <option value="" disabled selected>
            Selecciona tipo de evento
          </option>
          <option value="FECHA_UNICA">Fecha única</option>
          <option value="RECURRENTE">Recurrente</option>
        </select>
      </div>
      {eventType === "FECHA_UNICA" && (
        <div className="container-dates">
          <DateCalendar onChange={handleDateChange} />
          <Horas onHoraInicioChange={handleHoraInicioChange} onHoraFinChange={handleHoraFinChange}/>
        </div>
      )}
      {eventType === "RECURRENTE" && (
        <div className="container-days">
          <Days selectedDays={diasDisponible} onChange={handleDaysChange} />
          <Horas onHoraInicioChange={handleHoraInicioChange} onHoraFinChange={handleHoraFinChange}/>
        </div>
      )}

      {/* <div className="container-categories">
        <label htmlFor="category">Categorías:</label>
        <select id="category" name="categoria">
          <option value="" disabled selected>
            Selecciona la categoría
          </option>
          <option value="cultural">Cultural</option>
          <option value="gastronomia">Gastronomía</option>
          <option value="airelibre">Aire libre</option>
          <option value="cuidadobienestar">Cuidado y Bienestar</option>
        </select>
      </div> */}
      <div className="container-languages">
        <label htmlFor="language">Idioma:</label>
        <select id="language" value={idioma} onChange={(e) => setIdioma(e.target.value)} required>
          <option value="" disabled>Selecciona idioma</option>
          <option value="Español">Español</option>
        </select>
      </div>
      {/* <ImageUploader /> */}
      <div className="div-p-preview">
        <p>
          Puedes previsualizar como quedará tu actividad dando click en el boton
          vista previa.
        </p>
      </div>
      <div className="div-submit">
        <ButtonBluePill
          text="Vista Previa"
          className="button-yellow btn-preview"
        />
        <ButtonBluePill text="Guardar" className="button-blue btn-save" />
      </div>
    </form>
  );
};

export default FormBasis;
