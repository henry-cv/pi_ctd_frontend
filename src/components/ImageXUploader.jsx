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

  useEffect(() => {
    const remoteImages = existingImages.map((url) => ({
      file: null,
      preview: url,
      isRemote: true,
    }));
    setImages(remoteImages);
  }, [existingImages]);

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return validTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
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

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isRemote: false,
    }));

    setUploading(true);

    if (maxImages === 1) {
      if (images.length > 0) {
        URL.revokeObjectURL(images[0].preview);
      }
      setImages(newImages.slice(0, 1)); // Solo permite 1 imagen
      onImagesSelected?.(newImages[0]?.file || null);
    } else {
      // 🔥 Aquí está la corrección:
      // Contamos solo imágenes LOCALES antes de agregar nuevas
      const localImages = images.filter(img => !img.isRemote);
      const availableSlots = maxImages - localImages.length;

      if (newImages.length > availableSlots) {
        setError(`Solo puedes subir un máximo de ${maxImages} imágenes.`);
        setUploading(false);
        return;
      }

      const updatedImages = [...localImages, ...newImages].slice(0, maxImages);
      setImages(updatedImages);

      // 📌 Nos aseguramos de enviar correctamente todos los archivos al padre
      const filesToSend = updatedImages.map(img => img.file).filter(Boolean);
      console.log("Imágenes enviadas al padre:", filesToSend.length);
      onImagesSelected?.(filesToSend);
    }

    setUploading(false);
  };



  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const imgToRemove = updatedImages[index];

    if (!imgToRemove) return;

    if (imgToRemove.isRemote) {
      onRemoveExistingImage?.(imgToRemove.preview);
    } else {
      URL.revokeObjectURL(imgToRemove.preview);
    }

    updatedImages.splice(index, 1);
    setImages(updatedImages);

    // Notificar la eliminación correctamente
    if (maxImages === 1) {
      onImagesSelected?.(null);
    } else {
      onImagesSelected?.(updatedImages.filter((img) => img.file).map((img) => img.file));
    }
  };

  const truncateString = (str, length) => (str.length > length ? str.substring(0, length) + "..." : str);

  return (
    <div className="image-uploader-container">
      {allowUpload && (
        <label htmlFor="photos" className="file-label">
          <FaUpload className="upload-icon" />
          <span>{maxImages === 1 ? "Seleccionar imagen" : "Seleccionar imágenes"}</span>
          <span className="file-types">JPG, JPEG, PNG, WEBP (Máx 4MB)</span>
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

      {uploading && <div className="upload-loading"><p>Procesando imágenes...</p></div>}

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
