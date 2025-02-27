import React, { useState } from "react";
import "../css/pages/UserProfile.css";
import UserProfileSectionsTabs from "../components/UserProfileSectionsTabs";
import FormEditUser from "../components/FormEditUser";
import { useContextGlobal } from "../gContext/globalContext";

const UserProfile = () => {
   const { state } = useContextGlobal();
   const style = {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "50vh", 
    fontSize: "24px", 
  fontWeight: "bold", 
    textAlign: "center" }

  const [userData, setUserData] = useState({
    nombre: "Sara",
    apellido: "Mendez",
    email: "saris@gmail.com",
    contraseña: "",
    repetirContraseña: "",
  });

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <div className="user-info-profile">
          <div className="avatar-container">
            <img src="../../public/user_example.webp" alt="Avatar del usuario" className="avatar" />
          </div>
          <div className="user-details">
            <h2>{userData.nombre} {userData.apellido}</h2>
            <p>{userData.email}</p>
          </div>
        </div>
      </div>

      <UserProfileSectionsTabs />

      {state.activeTab === "edit-profile" ? (
  <FormEditUser userData={userData} setUserData={setUserData} />
) : state.activeTab === "reservations" ? (
  <>
    <p style={style}>Lista de reservas</p>

  </>
) : (
  <p style={style}>Lista de favoritos</p>
)}

      
    </div>
  );
};

export default UserProfile;
