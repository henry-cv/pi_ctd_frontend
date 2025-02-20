import { useState } from "react";
import "../css/ImageUploader.css";
import { FaUpload } from "react-icons/fa"; // Importa el ícono de subida

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleUpload = (image, index) => {
    const uploadTask = fakeUpload(image.file); // Simula una subida de archivo

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [index]: progress,
      }));
    });
  };

  const fakeUpload = () => {
    return {
      on: (event, callback) => {
        if (event === "state_changed") {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
              callback({ bytesTransferred: progress, totalBytes: 100 });
            } else {
              clearInterval(interval);
            }
          }, 100);
        }
      },
    };
  };

  return (
    <div>
      <label htmlFor="photos" className="file-label">
        <FaUpload className="upload-icon" />
        <span>Link, or drag and drop</span>
        <span className="file-types">SVG, JPG, PNG, or GIF (Máx 3MB) </span>
        <input
          type="file"
          id="photos"
          name="photos"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </label>
      <div className="image-previews">
        {images.map((image, index) => (
          <div key={index} className="image-preview">
            <img src={image.preview} alt={`Preview ${index}`} />
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${uploadProgress[index] || 0}%` }}
              ></div>
            </div>
            <button type="button" onClick={() => handleUpload(image, index)}>
              Subir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;