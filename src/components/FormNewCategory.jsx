import "../css/variables.css";
import "../css/FormNewCategory.css";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ButtonBluePill from "./ButtonBluePill";
import FieldError from "./FieldError";
import { validarTexto } from "../utils/utils";

const FormNewCategory = () => {

  const [category, setCategory] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Nueva función para manejar las imágenes seleccionadas
  const handleImagesSelected = (files) => {
    setSelectedImages(files);
  };

  //Manejador del Evento Submit del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (errorCategory) {
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
    };

    // Agregar el objeto producto como una parte JSON
    formData.append(
      "categoria",
      new Blob([JSON.stringify(categoryData)], { type: "application/json" })
    );

    // Agregar cada imagen como una parte separada
    selectedImages.forEach((file) => {
      formData.append("imagenes", file);
    });
    console.log(`--->${categoryData}<---`)
    console.log("Enviando datos al backend...");

    try {
      const response = await fetch("/api/categoria/registrar", {
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
      setCategory("");
      setSelectedImages([]);
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
        <label htmlFor="">Nombre Categoría</label>
        <input type="text" placeholder="Ingresa título de la categoría" name="categoria" onBlur={handleCategoryBlur} value={category} onChange={(e) => setCategory(e.target.value)} required />
        {errorCategory && <FieldError message={errorCategory} />}
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