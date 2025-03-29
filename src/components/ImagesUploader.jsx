import { useState } from "react";
import "../css/components/ImageUploader.css";
import { FaUpload, FaTrash } from "react-icons/fa";
import propTypes from "prop-types";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ImagesUploader = ({ onImagesSelected, existingImages = [], isEditMode, allowUpload }) => {
  const [images, setImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (!allowUpload) return;

    const files = Array.from(e.target.files);

    // Validar archivos
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError("Algunos archivos no son válidos. Asegúrate de que sean imágenes (JPG, JPEG, PNG, WEBP) y no excedan 4MB.");
    }

    if (validFiles.length === 0) return;
    setUploading(true);

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    // Notificar al componente padre sobre los archivos seleccionados
    onImagesSelected?.(updatedImages.map(img => img.file));
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    if (!images[index]) return;

    const { preview } = images[index];
    const updatedImages = [...images];
    // Liberar URL de objeto para evitar fugas de memoria
    URL.revokeObjectURL(preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    // Notificar al componente padre sobre la actualización
    onImagesSelected?.(updatedImages.map(img => img.file));
  };

  const truncateString = (str, length) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  return (
    <div className="image-uploader-container">
      {isEditMode && (
        <div className="existing-images">
          {existingImages.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.preview} alt={`Vista previa ${index}`} />
            </div>
          ))}
        </div>
      )}
      {allowUpload && (
        <label htmlFor="photos" className="file-label">
          <FaUpload className="upload-icon" />
          <span>Seleccionar imágenes</span>
          <span className="file-types">JPG, JPEG, PNG, o WEBP (Máx 4MB) </span>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={uploading}
          />
        </label>
      )}
      {uploading && (
        <div className="upload-loading">
          <p>Procesando imágenes...</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      {images.length > 0 && (
        <div className="image-previews">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.preview} alt={`Vista previa ${index}`} />
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveImage(index)}
                disabled={uploading}
              >
                <FaTrash className="icon-trash" />
              </button>
              <div className="file-name">{truncateString(image.file?.name, 15)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
ImagesUploader.propTypes = {
  onImagesSelected: propTypes.func,
  existingImages: propTypes.array,
  isEditMode: propTypes.bool,
  allowUpload: propTypes.bool
}
export default ImagesUploader;
