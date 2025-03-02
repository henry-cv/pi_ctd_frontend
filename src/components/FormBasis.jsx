import "../css/components/Form.css";
import "../css/global/variables.css";

import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import ButtonBluePill from "./ButtonBluePill";
import { FaSave } from "react-icons/fa";
import Horas from "./Horas";
import DateCalendar from "./DateCalendar";
import Days from "./Days";
import { validarTexto, validarAreaTexto } from "../utils/utils";
import FieldError from "./FieldError";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";

const FormBasis = ({ isEditMode = false }) => {
  const location = useLocation();
  const activityId = location.state?.activityId || null;


  //const activityToEdit = location.state?.activity || null;
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
  const [existingImages, setExistingImages] = useState([]); // Imágenes existentes

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


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

  useEffect(() => {
    const fetchActivity = async () => {
      if (activityId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/producto/${activityId}`);
          if (!response.ok) {
            throw new Error(`Error al cargar la actividad: ${response.status}`);
          }
          const data = await response.json();
          setTitulo(data.nombre);
          setDescripcion(data.descripcion);
          setValorTarifa(data.valorTarifa);
          setTipoTarifa(data.tipoTarifa);
          setIdioma(data.idioma);
          setHoraInicio(data.horaInicio);
          setHoraFin(data.horaFin);
          setDiasDisponible(data.diasDisponible || []);
          setFechaEvento(data.fechaEvento || "");
          setSelectedImages(data.productoImagenesSalidaDto || []);
          setEventType(data.eventType || data.tipoEvento);
          /* if (data.tipoEvento === "RECURRENTE") {
            setDiasDisponible(data.diasDisponible || []);
          } */
          // Cargar imágenes existentes
          const images = data.productoImagenesSalidaDto || []; // El backend debe devolver las URLs de las imágenes existentes
          setExistingImages(images.map((img) => ({ id: img.id, url: img.rutaImagen })));
          console.log("data activityID obtenida:");
          console.log(data);
        } catch (error) {
          console.error("Error cargando actividad:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo cargar la actividad.",
            icon: "error",
          });
          navigate("/administrador/actividades");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchActivity();
  }, [activityId, navigate]);

  // Función handleSubmit dentro de FormBasis.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditMode
      ? `/api/producto/editar/${activityId}`
      : "/api/producto/registrar";

    const method = isEditMode ? "PUT" : "POST";

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
    // Agregar imágenes nuevas al FormData
    /*     selectedImages.forEach((file) => {
          formData.append("imagenesNuevas", file);
        }); */

    // Agregar cada imagen como una parte separada
    selectedImages.forEach((file) => {
      formData.append("imagenes", file);
    });
    console.log(productoData);
    console.log("Enviando datos al backend...");
    console.log(endpoint);
    console.log("FORMDATA para enviar: ")
    console.info(formData);
    try {
      const response = await fetch(endpoint, {
        method,
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
      // alert("Producto creado correctamente");

      Swal.fire({
        title: isEditMode ? "¡Actividad Actualizada!" : "¡Actividad Creada!",
        text: "La actividad se guardó correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/administrador/actividades");
      });

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
      console.error("Error:", error.message, "Error completo: ", error);
      //alert(`Error al enviar los datos: ${error.message}`);
      Swal.fire({
        title: "Error",
        text: "No se pudo completar la operación.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }

  };
  if (loading) {
    return <p>Cargando datos de la actividad...</p>;
  }
  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="container-name">
        <h2>{isEditMode ? "Editar Actividad" : "Agregar Actividad"}</h2>

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
          <DateCalendar onChange={handleDateChange} selectedDate={fechaEvento} />
          <Horas
            onHoraInicioChange={handleHoraInicioChange}
            horaInicio={horaInicio}
            onHoraFinChange={handleHoraFinChange}
            horaFin={horaFin}
          />
        </div>
      )}

      {eventType === "RECURRENTE" && (
        <div className="container-days">
          <Days selectedDays={diasDisponible} onChange={handleDaysChange} />
          <Horas
            horaInicio={horaInicio}
            horaFin={horaFin}
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
        {existingImages &&
          <label>Imágenes Existentes:</label>}
        {existingImages.length > 0 &&
          <div className="existing-images">
            {existingImages.map((img) => (
              <div key={img.id} className="image-preview">
                <img src={img.url} alt="Imagen existente" />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveExistingImage(img.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        }
        <label>Nuevas Imágenes:</label>
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
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </ButtonBluePill>
      </div>
    </form>
  );
};
FormBasis.propTypes = {
  isEditMode: PropTypes.bool,
}
export default FormBasis;
