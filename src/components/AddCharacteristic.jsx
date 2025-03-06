import FormNewCharacteristic from './FormNewCharacteristic';
import "../css/pages/dashboard.css";

const AddCharacteristic = () => {
  return (
    <div className="add-characteristic-container">
      <h2 className="dark_activities section-title">Nueva Característica</h2>
      <div className="form-container">
        <FormNewCharacteristic />
      </div>
    </div>
  );
};

export default AddCharacteristic;