import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { FaPen } from "react-icons/fa";
import "../css/components/ProfileImageUploader.css";

const ProfileImageUploader = forwardRef(({ initialImage, onImageChange }, ref) => {
  const [image, setImage] = useState(initialImage || null);
  const [originalImage, setOriginalImage] = useState(initialImage || null);
  
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
      setOriginalImage(initialImage);
    }
  }, [initialImage]);

  // Exponemos métodos al componente padre usando useImperativeHandle
  useImperativeHandle(ref, () => ({
    reset: () => {
      setImage(originalImage);
      return originalImage;
    }
  }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
    const isValidSize = file.size <= 4 * 1024 * 1024; // 4MB
    
    if (!isValidType || !isValidSize) {
      alert("El archivo no es válido. Asegúrate de que sea una imagen (JPG, JPEG, PNG, WEBP) y no exceda 4MB.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setImage(preview);
    
    // Enviamos tanto el archivo como la URL de vista previa
    onImageChange(file, preview);
  };

  return (
    <div className="profile-image-uploader">
      <div className="avatar-container">
        <div className="avatar">
          <img 
            src={image || "https://via.placeholder.com/150"} 
            alt="Foto de perfil" 
            className="profile-image"
          />
          <label htmlFor="profile-photo" className="edit-button">
            <FaPen />
            <input
              type="file"
              id="profile-photo"
              name="profile-photo"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
});

export default ProfileImageUploader;