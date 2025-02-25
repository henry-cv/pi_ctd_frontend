import { useState } from "react";
import "../css/ImageUploader.css";
import { FaUpload, FaTrash } from "react-icons/fa";

const ImageUploader = ({ onImagesSelected }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar archivos
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 3MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert("Algunos archivos no son válidos. Asegúrate de que sean imágenes (jpg, png, GIF, SVG) y no excedan 10MB.");
    }

    if (validFiles.length === 0) return;

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    
    // Notificar al componente padre sobre los archivos seleccionados
    onImagesSelected(updatedImages.map(img => img.file));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    // Liberar URL de objeto para evitar fugas de memoria
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // Notificar al componente padre sobre la actualización
    onImagesSelected(updatedImages.map(img => img.file));
  };

  return (
    <div className="image-uploader-container">
      <label htmlFor="photos" className="file-label">
        <FaUpload className="upload-icon" />
        <span>Seleccionar imágenes</span>
        <span className="file-types">SVG, JPG, PNG, o GIF (Máx 3MB) </span>
        <input
          type="file"
          id="photos"
          name="photos"
          accept="image/jpeg,image/webp,image/gif,image/svg+xml"
          multiple
          onChange={handleImageChange}
          disabled={uploading}
        />
      </label>

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
                <FaTrash />
              </button>
              <div className="file-name">{image.file.name.length > 15 ? image.file.name.substring(0, 15) + '...' : image.file.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;