import { useState } from "react";
import "../css/components/ImageUploader.css";
import { FaUpload, FaTrash, FaGripLines } from "react-icons/fa";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente individual para cada imagen que se puede arrastrar
const SortableImageItem = ({ image, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.id
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="image-preview sortable-item"
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <FaGripLines />
      </div>
      <img src={image.preview} alt={`Vista previa ${index}`} />
      <button
        type="button"
        className="remove-button"
        onClick={() => onRemove(index)}
      >
        <FaTrash className="icon-trash" />
      </button>
      <div className="file-name">
        {image.file.name.length > 15 ? image.file.name.substring(0, 15) + '...' : image.file.name}
      </div>
    </div>
  );
};

// Componente principal
const ImageUploader = ({ onImagesSelected }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
//const [quantityError, setQuantityError] = useState("")
  
  // Configuración de sensores para arrastrar
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validar archivos
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 4 * 1024 * 1024; // 4MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert("Algunos archivos no son válidos. Asegúrate de que sean imágenes (JPG, JPEG, PNG, WEBP) y no excedan 4MB.");
    }

    if (validFiles.length === 0) return;
    setUploading(true);

    const newImages = validFiles.map((file) => ({
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID único
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    // Notificar al componente padre sobre los archivos seleccionados
    onImagesSelected(updatedImages.map(img => img.file));
    setUploading(false);
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
  
  // Manejar el evento de fin de arrastre
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        // Notificar al componente padre sobre la nueva ordenación
        onImagesSelected(newOrder.map(img => img.file));
        return newOrder;
      });
    }
  };

  return (
    <div className="image-uploader-container">
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
      
      {uploading && (
        <div className="upload-loading">
          <p>Procesando imágenes...</p>
        </div>
      )}
      
      {images.length > 0 && (
        <div className="image-previews-container">
          <p className="drag-instructions">Mantén presionado el icono de la izquierda de cada foto y arrástrala para cambiar su orden.</p>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={images.map(img => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="image-previews">
                {images.map((image, index) => (
                  <SortableImageItem 
                    key={image.id}
                    image={image}
                    index={index}
                    onRemove={handleRemoveImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;