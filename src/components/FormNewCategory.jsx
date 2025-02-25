import "../css/Form.css";
import "../css/variables.css";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ButtonBluePill from "./ButtonBluePill";

const FormNewCategory = () => {

  const [category, setCategory] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputCategory = (e) => {
    setCategory(e.target.value);
  }
  // Nueva función para manejar las imágenes seleccionadas
  const handleImagesSelected = (files) => {
    setSelectedImages(files);
  };

  return (
    <form action="" className="new-category">
      <div className="container-title">
        <label htmlFor="">Nombre Categoria</label>
        <input type="text" placeholder="Ingresa título de la categoría" name="categoria" onBlur={handleInputCategory} value={category} required />
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