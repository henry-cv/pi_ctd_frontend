import { useState, useEffect } from "react";
import "../css/pages/UserProfile.css";
import ButtonBluePill from "../components/ButtonBluePill";
import { FaPen, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import ButtonGral from "../components/ButtonGral";

function FormEditUser({ userData, setUserData }) {
  const [formData, setFormData] = useState(userData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    console.log("Datos guardados:", formData);
  };

  const handleCancel = () => {
    setFormData(userData); // Restablece los datos originales
    console.log("Cambios cancelados");
  };

  const handleAvatarChange = () => console.log("Cambio de avatar");

  return (
    <>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-data-picture-columns">
          <div className="form-data">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="email-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="form-input"
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contraseña">Cambiar contraseña</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="contraseña"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="repetirContraseña"
                  name="repetirContraseña"
                  value={formData.repetirContraseña}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Repetir Contraseña"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-picture-section">
            <div className="profile-picture-container">
              <img
                src="../../public/user_example.webp"
                alt="Imagen de perfil"
                className="profile-picture"
              />
              <button
                type="button"
                className="edit-picture-button"
                onClick={handleAvatarChange}
              >
                <FaPen className="icon-pencil-edit" />
              </button>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="button button-yellow btn-preview"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCancel();
            }}
          >
            Cancelar
          </button>
          {/* <ButtonBluePill
            text="Cancelar"
            className="button-yellow btn-preview"
            type="button"
            onClick={handleCancel} 
          /> */}
          <ButtonBluePill
            text="Guardar"
            type="submit"
            className="button-blue btn-save"
          />
        </div>
      </form>

      <div className="delete-account-container">
        <ButtonGral
          text={"Eliminar Cuenta"}
          color="yellow"
          icon={<FaTrash size={"1.5rem"} />}
        />
      </div>
    </>
  );
}

export default FormEditUser;
