import { useState, useEffect, useRef } from "react";
import "../css/pages/UserProfile.css";
import ButtonBluePill from "../components/ButtonBluePill";
import { FaTrash } from "react-icons/fa";
import ButtonGral from "../components/ButtonGral";
import Swal from "sweetalert2";
import ProfileImageUploader from "./ProfileImageUploader";
import { useContextGlobal } from "../gContext/globalContext";
import DeleteUSer from "./DeleteUSer";

const FormEditUser = ({ setUserData })=> {
  const { state,dispatch } = useContextGlobal();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const userData = state.user;
  const [formData, setFormData] = useState({
    ...userData,
    contraseña: "",
    repetirContraseña: "",
    // currentPassword: "",
  });
  const [originalData, setOriginalData] = useState({ ...userData });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [changePassword, setChangePassword] = useState(false);

  const imageUploaderRef = useRef(null);

  useEffect(() => {
    setFormData({
      ...userData,
      contraseña: "",
      repetirContraseña: "",
      // currentPassword: "",
    });
    setOriginalData({ ...userData });
  }, [userData]);

  useEffect(() => {
    const hasDataChanged =
      formData.nombre !== originalData.nombre ||
      formData.apellido !== originalData.apellido ||
      profileImage !== null ||
      // (formData.currentPassword &&
      //   formData.currentPassword !== userData.contraseñaActual) ||
      formData.contraseña ||
      formData.repetirContraseña;

    const passwordsMatch =
      (!formData.contraseña && !formData.repetirContraseña) ||
      (formData.contraseña &&
        formData.contraseña === formData.repetirContraseña);

    const requiredFieldsValid =
      formData.nombre?.trim() && formData.apellido?.trim();

    const isFormValid = hasDataChanged && passwordsMatch && requiredFieldsValid;

    setIsButtonDisabled(!isFormValid);

    const newErrors = {};
    if (
      formData.contraseña &&
      formData.repetirContraseña &&
      formData.contraseña !== formData.repetirContraseña
    ) {
      newErrors.password = "Las contraseñas no coinciden";
    }
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellido?.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    setErrors(newErrors);
  }, [formData ]);

  // const handleProfileImageChange = (file, previewUrl) => {
  //   setProfileImage(file);
  //   setFormData((prev) => ({
  //     ...prev,
  //     profileImage: previewUrl,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa correctamente todos los campos requeridos.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        }
      });
      return;
    }
  
    // if (formData.currentPassword && formData.currentPassword !== userData.contraseñaActual) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     currentPassword: "La contraseña actual no coincide",
    //   }));
    //   Swal.fire({
    //     title: "Error",
    //     text: "La contraseña actual no coincide.",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    //   return;
    // }
  
    // if (formData.currentPassword === userData.contraseñaActual) {
    //   if (!formData.contraseña || !formData.repetirContraseña || formData.contraseña !== formData.repetirContraseña) {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       password: "Las nuevas contraseñas deben estar llenas y coincidir",
    //     }));
    //     Swal.fire({
    //       title: "Error",
    //       text: "Las nuevas contraseñas deben estar llenas y coincidir.",
    //       icon: "error",
    //       confirmButtonText: "OK",
    //     });
    //     return;
    //   }
    // }
  
    const submitData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email, 
  
    };
  
    try {
      const response = await fetch("/api/usuario/modificarusuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.token}`
        },
        body: JSON.stringify(submitData),
      });


  
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }
  
      const data = await response.json();
      const token = state.token

            dispatch({
              type: "LOGIN_USER",
              payload: { user: data, token },
            });

      console.log("Usuario actualizado:", data);
  
      Swal.fire({
        title: "¡Datos guardados!",
        text: "Los cambios se han guardado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 1800,
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        }
      });
  
      setUserData(formData);
      setOriginalData({ ...formData });
  
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el usuario. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        }
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
  
    if (!formData.apellido?.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
  
    if (formData.contraseña && formData.repetirContraseña && formData.contraseña !== formData.repetirContraseña) {
      newErrors.password = "Las contraseñas no coinciden";
    }
  
    setErrors(newErrors);
    return newErrors;
  };
  

  const handleCancel = () => {
    setFormData({
      ...originalData,
      contraseña: "",
      repetirContraseña: "",
      // currentPassword: "",
    });

    if (imageUploaderRef.current) {
      imageUploaderRef.current.reset();
    }

    setProfileImage(null);
    setErrors({});
    setIsButtonDisabled(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true); 
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-data-picture-columns">
          <div className="form-data">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                  className={`form-input ${errors.nombre ? "error-input" : ""}`}
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido || ""}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.apellido ? "error-input" : ""
                  }`}
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="email-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  className="form-input"
                  disabled
                />
              </div>
            </div>

            {/* <div className="form-group">
              <label htmlFor="currentPassword">Contraseña actual</label>
              <div className="password-container">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.currentPassword ? 'error-input' : ''}`}
                  placeholder="Contraseña actual"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                </button>
              </div>
              {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
            </div> */}

            <div className="form-group">
              <div className="Change-Password-check">
                <label htmlFor="contraseña">Cambiar contraseña</label>

                <input
                  type="checkbox"
                  id="changePassword"
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                />
              </div>

              {changePassword ? (
                <>
                  <div className="password-container">
                    <input
                      type="password"
                      id="contraseña"
                      name="contraseña"
                      value={formData.contraseña}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Contraseña"
                    />
                  </div>

                  <div className="form-group">
                    <div className="password-container">
                      <input
                        type="password"
                        id="repetirContraseña"
                        name="repetirContraseña"
                        value={formData.repetirContraseña}
                        onChange={handleChange}
                        className={`form-input ${
                          errors.password ? "error-input" : ""
                        }`}
                        placeholder="Repetir Contraseña"
                      />
                    </div>
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* 
          <div className="profile-picture-section">
            <ProfileImageUploader
              ref={imageUploaderRef}
              initialImage={userData.profileImage}
              onImageChange={handleProfileImageChange}
            />
          </div> */}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className={
              isButtonDisabled
                ? "button btn-yellow-disabled btn-preview"
                : "button button-yellow btn-preview"
            }
            onClick={handleCancel}
            disabled={isButtonDisabled}
          >
            Cancelar
          </button>
          <ButtonBluePill
            text="Guardar"
            type="submit"
            className={
              isButtonDisabled
                ? "btn-blue-disabled btn-save"
                : "button-blue btn-save"
            }
            disabled={isButtonDisabled}
          />
        </div>
      </form>

      <div className="delete-account-container">
        <ButtonGral
          text={"Eliminar Cuenta"}
          color="yellow"
          icon={<FaTrash size={"1.5rem"} />}
          onClick={() => handleDeleteClick(userData.id)}
        />
      </div>
      {showModal && (
        <DeleteUSer id={selectedId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default FormEditUser;
