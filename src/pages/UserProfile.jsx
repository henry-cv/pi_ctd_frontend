import React, { useState } from 'react';
import '../css/UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    nombre: 'Sara',
    apellido: 'Mendez',
    email: 'saris@gmail.com',
    contraseña: '',
    repetirContraseña: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setUserData(prev => ({ ...prev, [name]: value }));
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Datos a enviar:', userData);
  };
  const handleAvatarChange = () => console.log('Cambio de avatar');

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <div className="user-info">
          <div className="avatar-container">
            <img src="../../public/user_example.webp" alt="Avatar del usuario" className="avatar" />
          </div>
          <div className="user-details">
            <h2>{userData.nombre} {userData.apellido}</h2>
            <p>{userData.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className="tab-button active">Editar Perfil</button>
        <button className="tab-button">Mis reservas</button>
        <button className="tab-button">Mis Favoritos</button>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-data-picture-columns">
          <div className="form-data">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" value={userData.nombre} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input type="text" id="apellido" name="apellido" value={userData.apellido} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="email-container">
                <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} className="form-input" disabled />
                <button type="button" className="modify-button">Modificar</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contraseña">Cambiar contraseña</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="contraseña"
                  name="contraseña"
                  value={userData.contraseña}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contraseña"
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="repetirContraseña"
                  name="repetirContraseña"
                  value={userData.repetirContraseña}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Repetir Contraseña"
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(prev => !prev)}>
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-picture-section">
            <div className="profile-picture-container">
              <img src="../../public/user_example.webp" alt="Imagen de perfil" className="profile-picture" />
              <button type="button" className="edit-picture-button" onClick={handleAvatarChange}>✏️</button>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button type="button" className="cancel-button">Cancelar</button>
          <button type="submit" className="save-button">Guardar</button>
        </div>
      </form>

      <div className="delete-account-container">
        <button type="button" className="delete-account-button">
          <span className="trash-icon">🗑️</span> Eliminar cuenta
        </button>
      </div>
    </div>
  );
};

export default UserProfile;