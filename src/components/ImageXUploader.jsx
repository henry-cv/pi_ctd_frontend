import { useState, useEffect } from "react";
import "../css/components/ImageUploader.css";
import { FaUpload, FaTrash } from "react-icons/fa";
import propTypes from "prop-types";
import FieldError from "./FieldError";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ImageXUploader = ({
  onImagesSelected,
  onRemoveExistingImage,
  existingImages = [],
  isEditMode = false,
  allowUpload = true,
  maxImages = 5,
}) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar imágenes precargadas (remotas) en modo edición
  useEffect(() => {
    if (existingImages.length > 0) {
      const remoteImages = existingImages.map((url) => ({
        file: null,
        preview: url,
        isRemote: true,
      }));
      setImages(remoteImages);
    }
  }, [existingImages]);

  // Función para validar imágenes
  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= MAX_FILE_SIZE;
    return isValidType && isValidSize;
  };

  const handleImageChange = (e) => {
    if (!allowUpload) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter(validateImage);

    if (validFiles.length !== files.length) {
      setError(
        "Algunos archivos no son válidos. Asegúrate de que sean imágenes (JPG, JPEG, PNG, WEBP) y no excedan 4MB."
      );
    } else {
      setError(null);
    }

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      setError(
        `Solo puedes subir un máximo de ${maxImages} imagen${maxImages > 1 ? "es" : ""}.`
      );
      return;
    }

    setUploading(true);

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isRemote: false,
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    // Notificar solo archivos nuevos
    onImagesSelected?.(updatedImages.filter((img) => img.file !== null).map((img) => img.file));
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const imgToRemove = updatedImages[index];

    if (!imgToRemove) return;

    // Imagen existente del backend
    if (imgToRemove.isRemote) {
      onRemoveExistingImage?.(imgToRemove.preview); // o pasar un ID si tienes uno
      updatedImages.splice(index, 1);
      setImages(updatedImages);
      return;
    }

    // Imagen recién subida (local)
    URL.revokeObjectURL(imgToRemove.preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    // Notificar solo los archivos locales
    onImagesSelected?.(updatedImages.filter((img) => img.file !== null).map((img) => img.file));
  };

  const truncateString = (str, length) => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + "..." : str;
  };

  return (
    <div className="image-uploader-container">
      {allowUpload && (
        <label htmlFor="photos" className="file-label">
          <FaUpload className="upload-icon" />
          <span>Seleccionar imagen{maxImages > 1 ? "es" : ""}</span>
          <span className="file-types">JPG, JPEG, PNG, o WEBP (Máx 4MB)</span>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={maxImages > 1}
            onChange={handleImageChange}
            disabled={uploading || images.length >= maxImages}
          />
        </label>
      )}

      {uploading && (
        <div className="upload-loading">
          <p>Procesando imagen{maxImages > 1 ? "es" : ""}...</p>
        </div>
      )}

      {error && <FieldError message={error} />}

      {images.length > 0 && (
        <div className="image-previews">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.preview} alt={`Vista previa ${index}`} />
              {allowUpload && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={uploading}
                >
                  <FaTrash className="icon-trash" />
                </button>
              )}
              <div className="file-name">
                {image.file ? truncateString(image.file.name, 15) : "Imagen existente"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImageXUploader.propTypes = {
  onImagesSelected: propTypes.func,
  onRemoveExistingImage: propTypes.func,
  existingImages: propTypes.array,
  isEditMode: propTypes.bool,
  allowUpload: propTypes.bool,
  maxImages: propTypes.number,
};

export default ImageXUploader;
