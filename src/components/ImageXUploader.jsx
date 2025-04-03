import { useState, useEffect } from "react";
import "../css/components/ImageUploader.css";
import { FaUpload, FaTrash } from "react-icons/fa";
import propTypes from "prop-types";
import FieldError from "./FieldError";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ImageXUploader = ({
  onImagesSelected,
  onRemoveExistingImage,
  isEditMode = false,
  allowUpload = true,
  maxImages = 5,
  existingImages = maxImages > 1 ? [] : ""
}) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /* useEffect(() => {
    const remoteImages = existingImages.map((url) => ({
      file: null,
      preview: url,
      isRemote: true,
    }));
    setImages(remoteImages);
  }, [existingImages]); */
  useEffect(() => {
    if (isEditMode && existingImages) {
      const remoteImages = existingImages.map((url) => ({
        file: null,
        preview: url,
        isRemote: true,
      }));
      setImages(remoteImages);
    }
  }, [existingImages, isEditMode]);

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return validTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
  };

  const handleImageChange = (e) => {
    if (!allowUpload) return;

    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateImage);

    if (validFiles.length !== files.length) {
      setError("Algunos archivos no son válidos. Asegúrate de que sean imágenes (JPG, JPEG, PNG, WEBP) y no excedan 4MB.");
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
      // 📌 CASO: Solo se permite una imagen (Formulario de Categoría)
      if (images.length > 0) {
        URL.revokeObjectURL(images[0].preview);
      }
      setImages(newImages.slice(0, 1)); // Solo mantiene 1 imagen
      onImagesSelected?.(newImages[0]?.file || null); // Enviamos 1 archivo, no un array
    } else {
      // 📌 CASO: Se permiten múltiples imágenes (Formulario de Actividad)
      const totalImages = images.filter(img => !img.isRemote).length + newImages.length;

      if (totalImages > maxImages) {
        setError(`Solo puedes subir un máximo de ${maxImages} imágenes.`);
        setUploading(false);
        return;
      }

      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      setImages(updatedImages);
      const filesToSend = updatedImages.filter(img => img.file).map(img => img.file);
      console.log("Imágenes enviadas al padre:", filesToSend.length);
      onImagesSelected?.(filesToSend); // Enviamos un array de imágenes al padre
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
