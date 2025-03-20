import Rating from '@mui/material/Rating';
import '../styles/CustomRating.css';

const CustomRating = ({ value, readOnly = true, precision = 0.5, onChange }) => {
  return (
    <Rating
      className="custom-rating"
      name="custom-rating"
      value={value}
      precision={precision}
      readOnly={readOnly}
      onChange={onChange}
      sx={{ fontSize: '1.2rem' }}
    />
  );
};

export default CustomRating;
