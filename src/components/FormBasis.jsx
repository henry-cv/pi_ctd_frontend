import "../css/components/Form.css";
import "../css/global/variables.css";

import { useState, useEffect } from "react";
import ImageXUploader from "./ImageXUploader";
import ButtonBluePill from "./ButtonBluePill";
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
import { paymentPolicies, cancellationPolicies } from "../constants/data/policiesDataInfo";
import PhoneInput from "./PhoneInput.jsx";

const FormBasis = ({ isEditMode = false }) => {
  const location = useLocation();
  const activityId = location.state?.activityId || null;

  const [eventType, setEventType] = useState("");

  const [titulo, setTitulo] = useState("");
  const [errorTitulo, setErrorTitulo] = useState("");

  const [descripcion, setDescripcion] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");

  const [valorTarifa, setValorTarifa] = useState(1.00);
  const [tipoTarifa, setTipoTarifa] = useState("");
  const [idioma, setIdioma] = useState("");
  const [paymentPolicyValue, setPaymentPolicy] = useState("");
  const [cancellationPolicyValue, setCancellationPolicy] = useState("");

  const [countryValue, setCountryValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United States",
    code: "US",
    dial_code: "+1"
  },);
  const [cityValue, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [quota, setQuota] = useState(1);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [diasDisponible, setDiasDisponible] = useState([]);
  const [fechaEvento, setFechaEvento] = useState("");
  const [fechaFinEvento, setFechaFinEvento] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Imágenes existentes
  const [errorFile, setErrorFile] = useState("");
  const { state } = useContextGlobal();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriasIds, setCategoriasIds] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [caracteristicasIds, setCaracteristicasIds] = useState([]);
  const [allowImageUpload, setAllowImageUpload] = useState(false); // Nueva variable de estado

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleTitleBlur = (e) => {
    const maximo = 50;
    const texto = e.target.value;
    if (!validarTexto(texto, maximo)) {
      setErrorTitulo(
        `Título debe tener entre 4 y máximo ${maximo} carácteres, sin números o caracteres especiales`
      );
    } else {
      setErrorTitulo("");
    }
    setTitulo(texto);
  };

  const handleAddress = (e) => {
    const maximo = 150;
    const texto = e.target.value;
    if (!validarAreaTexto(texto, maximo)) {
      setAddressError(
        `Dirección debe tener máximo ${maximo} carácteres.`
      );
    } else {
      setAddressError("");
    }
    setAddress(texto);
  };

  const handleDescriptionChange = (e) => {
    const texto = e.target.value;
    const maximo = 100;
    if (!validarAreaTexto(texto, maximo)) {
      setErrorDescripcion(
        `La descripción debe tener entre 4 y máximo ${maximo} carácteres`
      );
    } else {
      setErrorDescripcion("");
    }
    setDescripcion(texto);
  };

  const handleDaysChange = (selectedDays) => {
    setDiasDisponible(selectedDays);
  };
  /* const ensureTimeHasSeconds = (timeString) => {
    if (!timeString) return timeString;
    const colonCount = (timeString.match(/:/g) || []).length;
    if (colonCount === 2) return timeString;

    return `${timeString}:00`;
  }; */
  // Nueva función para manejar las imágenes seleccionadas
  const handleImagesSelected = (files) => {
    if (!Array.isArray(files)) {
      setErrorFile("Debe seleccionar al menos una imagen válida.");
      return;
    }
    setErrorFile("");
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
    //console.log("Categorías seleccionadas:", categoriasIdsArray);
  };
  const handleCaracteristicasChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const caracteristicasIdsArray = selectedOptions.map((option) => parseInt(option.value, 10));
    setCaracteristicasIds(caracteristicasIdsArray);
    //console.log("Características seleccionadas:", caracteristicasIdsArray);
  };
  const handleCountryChange = (e) => {
    const country = countries.find(c => c.name === e.target.value);
    setSelectedCountry(country);
    setCountryValue(country.name);
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
        //console.log(data);
      } catch (error) {
        console.error("Error cargando características:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacteristics();
  }, []);

  // GetCountries
  useEffect(() => {
    const UrlCountriesAPI = 'https://countriesnow.space/api/v0.1/countries/codes';
    // Está Url también trae los dial-code de cada país
    const fetchCountries = async () => {
      try {
        //const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");
        const response = await fetch(UrlCountriesAPI);
        if (!response.ok) {
          throw new Error(`Error al obtener los paises: ${response.status}`);
        }
        const data = await response.json();
        setCountries(data.data);
        //console.log("Countries", data.data);
      } catch (error) {
        console.error("Error cargando paises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // GetCities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        if (countryValue == "")
          return;
        //console.log("Selected Country", countryValue);

        const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: countryValue })
        },
        );

        if (!response.ok) {
          throw new Error(`Error al obtener las ciudades: ${response.status}`);
        }
        const data = await response.json();
        setCities(data.data);
        // console.log("Cities", data.data);
      } catch (error) {
        console.error("Error cargando ciudades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [countryValue]);

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
          console.log("Actividad cargada:", data);

          // Asignación de estados
          setTitulo(data.nombre || "");
          setDescripcion(data.descripcion || "");
          setValorTarifa(data.valorTarifa || "");

          const catIds = data.categorias ? data.categorias.map((cat) => cat.id) : [];
          setCategoriasIds(catIds);

          const charIds = data.caracteristicas ? data.caracteristicas.map((char) => char.id) : [];
          setCaracteristicasIds(charIds);

          setTipoTarifa(data.tipoTarifa || "");
          setIdioma(data.idioma || "");
          setPaymentPolicy(data.politicaPagos || "");
          setCancellationPolicy(data.politicaCancelacion || "");
          setCountryValue(data.pais || "");
          setCity(data.ciudad || "");
          setAddress(data.direccion || "");
          setPhoneNumber(data.telefono || "");
          /* setHoraInicio(data.horaInicio?.substring(0, 5) || ""); */
          setHoraInicio(data?.horaInicio || "");
          /* setHoraFin(data.horaFin?.substring(0, 5) || ""); */
          setHoraFin(data?.horaFin || "");

          setDiasDisponible(data.diasDisponible || null);
          setSelectedImages(data.productoImagenesSalidaDto || []);

          // Cargar imágenes existentes
          const images = data.productoImagenesSalidaDto || [];
          /* setExistingImages(images.map((img) => ({ id: img.id, url: img.rutaImagen }))); */
          setExistingImages((images || []).map((img) => ({ id: img.id, url: img.rutaImagen })));
          setEventType(data.eventType || data.tipoEvento || "");
        } catch (error) {
          console.error("Error cargando actividad:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo cargar la actividad. Por favor, inténtalo nuevamente.",
            icon: "error",
            customClass: {
              popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
            },
          });
          navigate("/administrador/actividades");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchActivity();
  }, [activityId]); // Eliminada la dependencia innecesaria `navigate`

  //UseEffect para consultar la disponibilidad por activityId
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!activityId) return;
      if (activityId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/disponibilidad/${activityId}`);
          if (!response.ok) {
            throw new Error(`Error al cargar la disponibilidad: ${response.status}`);
          }

          const data = await response.json();
          console.log("Disponibilidad cargada: ", data);
          if (data.length === 0) return;

          if (data.length > 0) {
            // Asignar cupos
            setQuota(data[0]?.cuposTotales || null);

            // Calcular fechas extrema
            const fechasOrdenadas = data
              .map(item => new Date(item.fechaEvento))
              .sort((a, b) => a - b);

            const fechaInicio = fechasOrdenadas[0]?.toISOString().split("T")[0];
            const fechaFin = fechasOrdenadas[fechasOrdenadas.length - 1]?.toISOString().split("T")[0];

            setFechaEvento(fechaInicio);
            setFechaFinEvento(fechaFin);
          }

        } catch (error) {
          console.error("Error cargando disponibilidad:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo cargar la disponibilidad.",
            icon: "error",
            customClass: {
              popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
            }
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAvailability();
  }, [activityId]);

  // Función handleSubmit dentro de FormBasis.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditMode
      ? `/api/producto/editar/${activityId}`
      : "/api/producto/registrar";

    const method = isEditMode ? "PUT" : "POST";

    const showErrorAlert = (title, text) => {
      Swal.fire({
        title,
        text,
        icon: "error",
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
        }
      });
    };

    if (errorTitulo || errorDescripcion) {
      showErrorAlert("Error", "Por favor, corrige los errores en el formulario antes de enviar.");
      return;
    }

    if (tipoTarifa === "") {
      showErrorAlert("Error", "Debe seleccionar un tipo de tarifa");
      return;
    }

    if (isNaN(valorTarifa) || valorTarifa <= 0) {
      showErrorAlert("Error", "El valor de la tarifa debe ser un número positivo");
      return;
    }

    if (!isEditMode && selectedImages.length < 5) {
      showErrorAlert("Error", "Debe seleccionar al menos 5 imagenes");
      return;
    }
    if (!fechaEvento || (eventType === "RECURRENTE" && !fechaFinEvento)) {
      showErrorAlert("Fechas requeridas", "Debes seleccionar una fecha de inicio y fin.");
      return;
    }

    if (eventType === "RECURRENTE" && fechaEvento > fechaFinEvento) {
      showErrorAlert("Error en fechas", "La fecha de inicio no puede ser posterior a la fecha de fin.");
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
      horaInicio,
      horaFin,
      tipoEvento: eventType,
      diasDisponible: eventType === "RECURRENTE" ? diasDisponible : null,
      fechaEvento,
      fechaFinEvento: eventType === "FECHA_UNICA" ? null : fechaFinEvento,
      politicaPagos: paymentPolicyValue,
      politicaCancelacion: cancellationPolicyValue,
      pais: countryValue,
      ciudad: cityValue,
      telefono: phoneNumber,
      direccion: address,
      cuposTotales: parseInt(quota),
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
          `Error en la solicitud: ${response.status} - ${errorText} --${response.statusText}`
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
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
        }
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
      setPaymentPolicy("");
      setCancellationPolicy("");
      setCountryValue("");
      setCity("");
      setAddress("");
      setQuota("");
      setHoraInicio("");
      setHoraFin("");
      setEventType("");
      setDiasDisponible([]);
      setFechaEvento("");
      setSelectedImages([]);
      setPhoneNumber("");
    } catch (error) {
      console.error("Error:", error.message, "Error completo: ", error);
      //alert(`Error al enviar los datos: ${error.message}`);
      Swal.fire({
        title: "Error",
        text: "No se pudo completar la operación.",
        icon: "error",
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
        }
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
          onChange={handleTitleBlur}
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

      <div className="container-country">
        <label htmlFor="country">País:</label>
        <select
          id="country"
          value={countryValue}
          onChange={(e) => handleCountryChange(e)}
          required>
          <option value="" disabled>
            Selecciona el País
          </option>
          {countries.map((country) => (
            <option data-dial={country.dial_code} key={country.name} value={country.name}> {country.name}</option>
          ))}
        </select>
      </div>

      <div className="container-city">
        <label htmlFor="city">Ciudad:</label>
        <select
          id="city"
          value={cityValue}
          onChange={(e) => setCity(e.target.value)}
          required>
          <option value="" disabled>
            Selecciona la ciudad
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="container-address">
        <label htmlFor="address">Dirección:</label>
        <input
          type="text"
          id="address"
          name="Dirección"
          placeholder="Escriba la dirección"
          value={address}
          onChange={handleAddress}
          autoComplete="on"
          required
        />
        {addressError && <FieldError message={addressError} />}
      </div>
      <PhoneInput country={selectedCountry} setPhoneNumber={setPhoneNumber} />
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
      </div>
      <div className="container-quota">
        <label htmlFor="quota">Cupos:</label>
        <input
          type="number"
          id="quota"
          name="Cupos"
          placeholder="Cantidad de Cupos totales"
          value={quota}
          onChange={(e) => setQuota(parseInt(e.target.value))}
          min="1"
          autoComplete="off"
          required
        />
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
      {
        eventType === "FECHA_UNICA" && (
          <div className="container-dates">
            <DateCalendar eventType={eventType}
              fechaEvento={fechaEvento}
              setFechaEvento={setFechaEvento}
              fechaFinEvento={fechaFinEvento}
              setFechaFinEvento={setFechaFinEvento} />
            <Horas
              horaInicio={horaInicio}
              horaFin={horaFin}
              setHoraInicio={setHoraInicio}
              setHoraFin={setHoraFin}
            />
          </div>
        )
      }

      {
        eventType === "RECURRENTE" && (
          <div className="container-days">
            <Days selectedDays={diasDisponible} onChange={handleDaysChange} />
            <Horas
              horaInicio={horaInicio}
              horaFin={horaFin}
              setHoraInicio={setHoraInicio}
              setHoraFin={setHoraFin}
            />
            <DateCalendar eventType={eventType}
              fechaEvento={fechaEvento}
              setFechaEvento={setFechaEvento}
              fechaFinEvento={fechaFinEvento}
              setFechaFinEvento={setFechaFinEvento} />
          </div>
        )
      }
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
            <option key={caracteristica.id} value={caracteristica.id}>{`${caracteristica.nombre}`}</option>
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

      <div className="container-paymentPolicy">
        <label htmlFor="paymentPolicy">Política de Pago:</label>
        <select
          id="paymentPolicy"
          value={paymentPolicyValue}
          onChange={(e) => setPaymentPolicy(e.target.value)}
          required>
          <option value="" disabled>
            Selecciona la Política
          </option>
          {paymentPolicies.map((policy) => (
            <option key={policy.id} value={policy.id}>{policy.selectText}</option>
          ))}
        </select>
      </div>

      <div className="container-cancellationPolicy">
        <label htmlFor="cancellationPolicy">Política de Cancelación:</label>
        <select
          id="cancellationPolicy"
          value={cancellationPolicyValue}
          onChange={(e) => setCancellationPolicy(e.target.value)}
          required>
          <option value="" disabled>
            Selecciona la Política
          </option>
          {cancellationPolicies.map((policy) => (
            <option key={policy.id} value={policy.id}>{policy.selectText}</option>
          ))}
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
            <ImageXUploader
              onImagesSelected={handleImagesSelected}
              existingImages={existingImages ? [existingImages] : []}
              isEditMode={!!isEditMode}
            />
            {errorFile && <FieldError message={errorFile} />}
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
