import '../css/CategoryCard.css';

const CategoryCard = () => {
  return (
    <div className="category-card">
      <img src="/categoria_ejemplo.jpg" alt="Categoría" className="category-image" />
      <div className="category-content">
        <h3 className="category-title">Nombre Categoría</h3>
        <p className="category-count">20 actividades</p>
      </div>
    </div>
  );
};

export default CategoryCard;