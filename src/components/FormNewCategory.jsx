import "../css/global/variables.css";
import "../css/components/FormNewCategory.css";
import { useState, useEffect } from "react";
import ImageXUploader from "./ImageXUploader";
import ButtonBluePill from "./ButtonBluePill";
import FieldError from "./FieldError";
import { validarTexto, validarAreaTexto } from "../utils/utils";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useContextGlobal } from "../gContext/globalContext";
import PropTypes from "prop-types";

const FormNewCategory = ({ isEditMode = false }) => {

  const location = useLocation();
  const categoryId = location.state?.categoryId || null;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [errorCategory, setErrorCategory] = useState("");

  const [description, setDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  const [selectedImage, setSelectedImage] = useState([]);
  const [existingImage, setExistingImage] = useState("");
  const [errorFile, setErrorFile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state } = useContextGlobal();

  const handleCategoryBlur = (e) => {
    const texto = e.target.value;
    const maximo = 60;
    if (!validarTexto(texto, maximo)) {
      setErrorCategory(
        `La categoría debe tener entre 4 y máximo ${maximo} carácteres, sin números o carácteres especiales`
      );
    } else {
      setErrorCategory("");
      setCategory(texto);
    }
  };
  const handleDescriptionChange = (e) => {
    const texto = e.target.value;
    const maximo = 100;
    if (!validarAreaTexto(texto, maximo)) {
      setErrorDescription(
        `La descripción debe tener entre 4 y máximo ${maximo} carácteres`
      );
    } else {
      setErrorDescription("");
    }
    setDescription(texto);
  };

  // Nueva función para manejar las imágenes seleccionadas
  const handleImageSelected = (files) => {
    if (!Array.isArray(files)) setErrorFile("Deberia ser un arreglo on una imágen")
    setSelectedImage(files);
  };

  // useEffect para buscar categoría por Id y cargarla en el formulario
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/categoria/${categoryId}`);
          if (!response.ok) {
            throw new Error(`Error al cargar la actividad: ${response.status}`);
          }
          const data = await response.json();
          console.log("Categoría cargada:", data);

          // Asignación de estados
          setCategory(data.nombre || "");
          setDescription(data.descripcion || "");

          setExistingImage(data.imagenCategoriaUrl)
        } catch (error) {
          console.error("Error cargando categoría:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo cargar la categoría. Por favor, inténtalo nuevamente.",
            icon: "error",
            customClass: {
              popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
            },
          });
          navigate("/administrador/categorias");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategory();
  }, [categoryId]); // Eliminada la dependencia innecesaria `navigate`


  //Manejador del Evento Submit del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditMode
      ? `/api/categoria/editar/${categoryId}`
      : "/api/categoria/registrar";

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

    // Validaciones
    if (errorCategory || errorDescription) {
      showErrorAlert("Por favor, ingresa los datos correctamente en el formulario antes de enviar.");
      return;
    }

    if (!isEditMode && selectedImage.length === 0) {
      showErrorAlert("Debe seleccionar al menos una imagen");
      return;
    }

    // Prevenir múltiples envíos
    setIsSubmitting(true);

    // Crear FormData para enviar archivos y datos
    const formData = new FormData();

    // Datos del producto como JSON string
    const categoryData = {
      nombre: category,
      descripcion: description

    };
    console.log("Datos a enviar:", JSON.stringify(categoryData));

    // Agregar el objeto producto como una parte JSON
    formData.append(
      "categoria",
      new Blob([JSON.stringify(categoryData)], { type: "application/json" })
    );

    // Agregar cada imagen como una parte separada
    selectedImage.forEach((file) => {
      formData.append("imagenCategoria", file);
    });
    console.log(`--->${categoryData}<---`)
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
      //alert("Categoría creada correctamente");

      //Agregada para Sweet Alert 2
      Swal.fire({
        title: isEditMode ? "¡Categoría Actualizada!" : "¡Categoría Creada!",
        text: "La categoría se guardó correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
        }
      }).then(() => {
        navigate("/administrador/categorias");
      });

      // Limpiar formulario después de un envío exitoso
      setCategory("");
      setDescription("");
      setSelectedImage([]);
      //navigate('/administrador/categorias');

    } catch (error) {
      console.error("Error:", error.message);
      //alert(`Error al enviar los datos: ${error.message}`);
      showErrorAlert("Error", "No se pudo completar la operación.");
    } finally {
      setIsSubmitting(false);
    }

  };
  if (loading) {
    return <p>Cargando datos de la categoría...</p>;
  }
  return (
    <form action="" className="form-base new-category" onSubmit={handleSubmit}>
      <div className="container-title">
        <h2>{isEditMode ? "Editar Categoría" : "Agregar Categoría"}</h2>

        <label htmlFor="category">Nombre Categoría</label>
        <input
          id="category"
          type="text"
          placeholder="Ingresa título de la categoría"
          name="categoria"
          title="Ingrese letras únicamente y símbolo punto '.' si desea"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onBlur={handleCategoryBlur}
          required />
        {errorCategory && <FieldError message={errorCategory} />}
      </div>
      <div className="container-description">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          placeholder="Ingresa descripción de la categoría"
          name="descripcion"
          title="Este campo si admite números y los símbolos: ':' , * - • ; _"
          value={description}
          onChange={handleDescriptionChange}
          required>
        </textarea>
        {errorDescription && <FieldError message={errorDescription} />}
      </div>
      <div className="container-images">
        <label>Imágenes:</label>
        {/* <ImageUploader onImagesSelected={handleImagesSelected} /> */}
        <ImageXUploader
          onImagesSelected={handleImageSelected}
          existingImages={existingImage ? [existingImage] : []}
          isEditMode={!!existingImage}
          /* La doble negación obtiene un valor booleano de la variable */
          allowUpload={true}
          maxImages={1}
        />
        {errorFile && <FieldError message={errorFile} />}
        {selectedImage.length === 1 && (
          <p className="selected-count">
            {selectedImage.length} imagen seleccionada
          </p>
        )}
      </div>
      <div className="div-submit">
        <ButtonBluePill
          text="Cancelar"
          className="button-yellow btn-preview"
          type="button"
          onClick={() => navigate("/administrador/categorias")}
        />
        <ButtonBluePill
          text={isSubmitting ? "Guardando..." : "Guardar"}
          className="button-blue btn-save"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  )
}
FormNewCategory.propTypes = {
  isEditMode: PropTypes.bool,
}
export default FormNewCategory
