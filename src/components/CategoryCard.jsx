import "../css/components/CategoryCard.css";
import PropTypes from "prop-types";

const CategoryCard = ({ title, image }) => {
  return (
    <div className="category-card">
      <div className="category-item">
        <img src={image} alt={title} className="category-image" />
        <div className="category-content">
          <h3 className="category-title">{title}</h3>
        </div>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default CategoryCard;
