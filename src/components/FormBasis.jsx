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
import PropTypes from "prop-types";
import { useContextGlobal } from "../gContext/globalContext";

const FormBasis = ({ isEditMode = false }) => {
  const location = useLocation();
  const activityId = location.state?.activityId || null;
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
  const { state } = useContextGlobal();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriasIds, setCategoriasIds] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [caracteristicasIds, setCaracteristicasIds] = useState([]);
  const [allowImageUpload, setAllowImageUpload] = useState(false); // Nueva variable de estado


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
    const maximo = 200;
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
  const ensureTimeHasSeconds = (timeString) => {
    if (!timeString) return timeString;
    const colonCount = (timeString.match(/:/g) || []).length;
    if (colonCount === 2) return timeString;
    
      return `${timeString}:00`;
  };
  // Nueva función para manejar las imágenes seleccionadas
  const handleImagesSelected = (files) => {
    setSelectedImages(files);
  };
  //Manejador para permitir subir nuevas imágenes
  const handleAllowImageUploadChange = (e) => {
    setAllowImageUpload(e.target.checked);
  };

  //Para manejar los cambios en el select de categorías
  const handleCategoriaChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const categoriasIdsArray = selectedOptions.map((option) => parseInt(option.value, 10));
    setCategoriasIds(categoriasIdsArray);
    console.log("Categorías seleccionadas:", categoriasIdsArray);
  };
  const handleCaracteristicasChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const caracteristicasIdsArray = selectedOptions.map((option) => parseInt(option.value, 10));
    setCaracteristicasIds(caracteristicasIdsArray);
    console.log("Características seleccionadas:", caracteristicasIdsArray);
  };
  // useEffect para traer las categorias existentes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categoria/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener las categorías: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        console.log(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // useEffect para traer las caracteristicas existentes
  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const response = await fetch("/api/caracteristica/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener las características: ${response.status}`);
        }
        const data = await response.json();
        setCharacteristics(data);
        console.log(data);
      } catch (error) {
        console.error("Error cargando características:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacteristics();
  }, []);
  // useEffect para buscar actividad por Id y cargarla en el formulario
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

          const catIds = data.categorias ? data.categorias.map(cat => cat.id) : [];
          setCategoriasIds(catIds);
          const charIds = data.caracteristicas ? data.caracteristicas.map(char => char.id) : [];
          setCaracteristicasIds(charIds);

          setTipoTarifa(data.tipoTarifa);
          setIdioma(data.idioma);
          setHoraInicio(data.horaInicio);
          setHoraFin(data.horaFin);
          setDiasDisponible(data.diasDisponible || []);
          setFechaEvento(data.fechaEvento || "");
          setSelectedImages(data.productoImagenesSalidaDto || []);
          //setExistingImages(data.productoImagenesSalidaDto.map(img => ({ id: img.id, url: img.rutaImagen })));

          setEventType(data.eventType || data.tipoEvento);

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

    if (!isEditMode && selectedImages.length === 0) {
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
      categoriasIds: categoriasIds, // Ya son números según tu payload
      caracteristicasIds: caracteristicasIds, // Ya son números según tu payload
      idioma,
      horaInicio: ensureTimeHasSeconds(horaInicio),
      horaFin: ensureTimeHasSeconds(horaFin),
      tipoEvento: eventType,
      diasDisponible: eventType === "RECURRENTE" ? diasDisponible : null,
      fechaEvento: eventType === "FECHA_UNICA" ? fechaEvento : null,
    };
    console.log("Datos a enviar:", JSON.stringify(productoData));

    // Agregar el objeto producto como una parte JSON
    formData.append(
      "producto",
      new Blob([JSON.stringify(productoData)], { type: "application/json" })
    );
    // Agregar cada imagen como una parte separada
    //Está es la válida
    selectedImages.forEach((file) => {
      formData.append("imagenes", file);
    });

    console.log(productoData);
    console.log("Enviando datos al backend...");
    try {
      const token = state.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      setCategoriasIds([]);
      setCaracteristicasIds([]);
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
          autoComplete="on"
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
          autoComplete="on"
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
      <div className="container-categories">
        <label htmlFor="category">Categorías:</label>
        {categories.length > 0 &&
          <select multiple onChange={handleCategoriaChange}
            value={categoriasIds.map(id => id.toString())} // Importante: convierte a string para HTML select
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
        }
      </div>
      <div className="container-features">
        <label htmlFor="features">Características:</label>
        <select
          multiple
          name="caracteristicas"
          id="features"
          className="features-select"
          onChange={handleCaracteristicasChange}
          value={caracteristicasIds.map(id => id.toString())} // Importante: convierte a string para HTML select
        >
          <option value="" disabled>Selecciona la característica</option>
          {characteristics.map((caracteristica) => (
            <option key={caracteristica.id} value={caracteristica.id}>{`${caracteristica.icono} ${caracteristica.nombre}`}</option>
          ))}
        </select>
      </div>
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
        {isEditMode && existingImages.length > 0 && (
          <>
            <label>Imágenes Existentes:</label>
            <div className="existing-images">
              {existingImages.map((img) => (
                <div key={img.id} className="image-preview">
                  <img src={img.url} alt="Imagen existente" />
                </div>
              ))}
            </div>
          </>
        )}

        {isEditMode && (
          <div className="allow-upload">
            <label>
              <input
                type="checkbox"
                checked={allowImageUpload}
                onChange={handleAllowImageUploadChange}
              />
              Permitir agregar nuevas imágenes
            </label>
          </div>
        )}

        {(!isEditMode || allowImageUpload) && (
          <>
            <label>{isEditMode ? "Nuevas Imágenes:" : "Imágenes:"}</label>
            <ImageUploader onImagesSelected={handleImagesSelected} />
            {selectedImages.length > 0 && (
              <p className="selected-count">
                {selectedImages.length} imagen(es) seleccionada(s)
              </p>
            )}
          </>
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
    </form >
  );
};
FormBasis.propTypes = {
  isEditMode: PropTypes.bool,
}
export default FormBasis;
