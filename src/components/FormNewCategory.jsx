import "../css/global/variables.css";
import "../css/components/FormNewCategory.css";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ButtonBluePill from "./ButtonBluePill";
import FieldError from "./FieldError";
import { validarTexto, validarAreaTexto } from "../utils/utils";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useContextGlobal } from "../gContext/globalContext";

const FormNewCategory = () => {

  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [errorCategory, setErrorCategory] = useState("");

  const [description, setDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
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
        `La desripción debe tener entre 4 y máximo ${maximo} carácteres`
      );
    } else {
      setErrorDescription("");
    }
    setDescription(texto);
  };

  // Nueva función para manejar las imágenes seleccionadas
  const handleImagesSelected = (files) => {
    setSelectedImages(files);
  };

  //Manejador del Evento Submit del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (errorCategory || errorDescription) {
      alert("Por favor, corrige los errores en el formulario antes de enviar.");
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
    const categoryData = {
      nombre: category,
      descripcion: description

    };

    // Agregar el objeto producto como una parte JSON
    formData.append(
      "categoria",
      new Blob([JSON.stringify(categoryData)], { type: "application/json" })
    );

    // Agregar cada imagen como una parte separada
    selectedImages.forEach((file) => {
      formData.append("imagenCategoria", file);
    });
    console.log(`--->${categoryData}<---`)
    console.log("Enviando datos al backend...");

    try {
      const token = state.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      const response = await fetch("/api/categoria/registrar", {
        method: "POST",
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
        title: "¡Categoría Creada!",
        text: "La categoría se ha guardado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        navigate("/administrador/categorias");
      });

      // Limpiar formulario después de un envío exitoso
      setCategory("");
      setDescription("");
      setSelectedImages([]);
      //navigate('/administrador/categorias');

    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al enviar los datos: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <form action="" className="form-base new-category" onSubmit={handleSubmit}>
      <div className="container-title">
        <label htmlFor="category">Nombre Categoría</label>
        <input
          id="category"
          type="text"
          placeholder="Ingresa título de la categoría"
          name="categoria"
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
          value={description}
          onChange={handleDescriptionChange}
          required>
        </textarea>
        {errorDescription && <FieldError message={errorDescription} />}
      </div>
      <div className="container-images">
        <label>Imágenes:</label>
        <ImageUploader onImagesSelected={handleImagesSelected} />
        {selectedImages.length > 0 && (
          <p className="selected-count">
            {selectedImages.length} imagen(es) seleccionada(s)
          </p>
        )}
      </div>
      <div className="div-submit">
        <ButtonBluePill
          text="Cancelar"
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
  )
}

export default FormNewCategory