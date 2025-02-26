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
  const [valorTarifa, setValorTarifa] = useState("");
  const [tipoTarifa, setTipoTarifa] = useState("");
  const [idioma, setIdioma] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [diasDisponible, setDiasDisponible] = useState([]);
  const [fechaEvento, setFechaEvento] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setErrorDescripcion(
        `La desripción debe tener entre 4 y máximo ${maximo} carácteres`
      );
    } else {
      setErrorDescripcion("");
    }
    setDescripcion(texto);
  };

  const handleDateChange = (e) => {
    setFechaEvento(e.target.value);
  };

  const handleHoraInicioChange = (e) => {
    setHoraInicio(e.target.value);
  };

  const handleHoraFinChange = (e) => {
    setHoraFin(e.target.value);
  };

  const handleDaysChange = (selectedDays) => {
    setDiasDisponible(selectedDays);
  };

  // Nueva función para manejar las imágenes seleccionadas
  const handleImagesSelected = (files) => {
    setSelectedImages(files);
  };

  // En la función handleSubmit dentro de FormBasis.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (errorTitulo || errorDescripcion) {
      alert("Por favor, corrige los errores en el formulario antes de enviar.");
      return;
    }

    if (tipoTarifa === "") {
      alert("Debe seleccionar un tipo de tarifa");
      return;
    }

    if (isNaN(valorTarifa) || valorTarifa <= 0) {
      alert("El valor de la tarifa debe ser un número positivo");
      return;
    }

    if (selectedImages.length === 0) {
      alert("Debe seleccionar al menos una imagen");
      return;
    }

    // Prevenir múltiples envíos
    setIsSubmitting(true);

    // Crear FormData para enviar archivos y datos
    const formData = new FormData();

    // Datos del producto como JSON string
    const productoData = {
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
    };

    // Agregar el objeto producto como una parte JSON
    formData.append(
      "producto",
      new Blob([JSON.stringify(productoData)], { type: "application/json" })
    );

    // Agregar cada imagen como una parte separada
    selectedImages.forEach((file) => {
      formData.append("imagenes", file);
    });

    console.log("Enviando datos al backend...");

    try {
      const response = await fetch("/api/producto/registrar", {
        method: "POST",
        body: formData,
        // No establecer Content-Type, el navegador lo configura automáticamente con boundary para multipart/form-data
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error en la solicitud: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      alert("Producto creado correctamente");

      // Limpiar formulario después de un envío exitoso
      setTitulo("");
      setDescripcion("");
      setValorTarifa("");
      setTipoTarifa("");
      setIdioma("");
      setHoraInicio("");
      setHoraFin("");
      setEventType("");
      setDiasDisponible([]);
      setFechaEvento("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al enviar los datos: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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

      <div className="container-addrate">
        <button
          type="button"
          onClick={toggleExtraFields}
          className="hamburger-button"
        >
          &#x2795; Añadir Tarifas
        </button>
      </div>
      {showExtraFields && (
        <div className="extra-fields">
          <div>
            <label htmlFor="rateName">Valor tarifa:</label>
            <select
              id="rateType"
              value={tipoTarifa}
              onChange={(e) => setTipoTarifa(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona el tipo de tarifa
              </option>
              <option value="POR_PERSONA">Por persona</option>
              <option value="POR_PAREJA">Por pareja</option>
              <option value="POR_GRUPO_6">Por grupo (6)</option>
              <option value="POR_GRUPO_10">Por grupo (10)</option>
            </select>
          </div>
          <div>
            <label htmlFor="ratePrice">Tarifa por:</label>
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
            min="1"
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
            value={tipoTarifa}
            onChange={(e) => setTipoTarifa(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona el tipo de tarifa
            </option>
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
          value={eventType}
          onChange={handleEventTypeChange}
          required
        >
          <option value="" disabled>
            Selecciona tipo de evento
          </option>
          <option value="FECHA_UNICA">Fecha única</option>
          <option value="RECURRENTE">Recurrente</option>
        </select>
      </div>
      {eventType === "FECHA_UNICA" && (
        <div className="container-dates">
          <DateCalendar onChange={handleDateChange} />
          <Horas
            onHoraInicioChange={handleHoraInicioChange}
            onHoraFinChange={handleHoraFinChange}
          />
        </div>
      )}

      {eventType === "RECURRENTE" && (
        <div className="container-days">
          <Days selectedDays={diasDisponible} onChange={handleDaysChange} />
          <Horas
            onHoraInicioChange={handleHoraInicioChange}
            onHoraFinChange={handleHoraFinChange}
          />
        </div>
      )}

      <div className="container-languages">
        <label htmlFor="language">Idioma:</label>
        <select
          id="language"
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecciona idioma
          </option>
          <option value="Español">Español</option>
        </select>
      </div>

      {/* Componente ImageUploader actualizado */}
      <div className="container-images">
        <label>Imágenes:</label>
        <ImageUploader onImagesSelected={handleImagesSelected} />
        {selectedImages.length > 0 && (
          <p className="selected-count">
            {selectedImages.length} imagen(es) seleccionada(s)
          </p>
        )}
      </div>

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
          type="button"
        />
        <ButtonBluePill
          text={isSubmitting ? "Guardando..." : "Guardar"}
          className="button-blue btn-save"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default FormBasis;
