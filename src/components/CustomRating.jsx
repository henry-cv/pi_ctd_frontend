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
      sx={{ 
        fontSize: '1.2rem',
        "& .MuiRating-iconFilled": {
          color: "#6749D9"  // Color azul en modo claro
        },
        "& .MuiRating-iconEmpty": {
          color: "#6749D9",
          opacity: 0.4
        },
        "@media (prefers-color-scheme: dark)": {
          "& .MuiRating-iconFilled": {
            color: "#EEC52D"  // Color amarillo en modo oscuro
          },
          "& .MuiRating-iconEmpty": {
            color: "#EEC52D",
            opacity: 0.4
          }
        }
      }}
    />
  );
};

export default CustomRating;
