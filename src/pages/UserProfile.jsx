// src/pages/UserProfile.jsx
import React, { useState } from "react";
import "../css/pages/UserProfile.css";
import UserProfileSectionsTabs from "../components/UserProfileSectionsTabs";
import FormEditUser from "../components/FormEditUser";
import UserFavorites from "../components/UserFavorites";
import { useContextGlobal } from "../gContext/globalContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import UserBookings from "../components/MyBookings/UserBookings";

const UserProfile = () => {
  const { state } = useContextGlobal();

  const [userData, setUserData] = useState(state.user);

  const getUserInitials = `${userData?.nombre?.[0] || "U"}${
    userData?.apellido?.[0] || "U"
  }`.toUpperCase();

  const handleResendEmail = () => {
    console.log("Reenviar email a", userData.email);
    // Aquí se podría llamar a una API para reenviar el correo
  };

  // Determinar qué contenido mostrar según la pestaña activa
  const renderActiveTabContent = () => {
    switch (state.userFiltersTabs.activeTab) {
      case "edit-profile":
        return <FormEditUser userData={userData} setUserData={setUserData} />;
      case "reservations":
        return <UserBookings />;
      case "favorites":
        return <UserFavorites />;
      default:
        return <FormEditUser userData={userData} setUserData={setUserData} />;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <div className="user-info-profile">
          <div className="avatar-container">
            <Avatar sx={{ width: 120, height: 120, background: "#f6d85f", color: "black", fontSize: "40px" }}>
              {getUserInitials}
            </Avatar>
          </div>
          <div className="user-details-banner">
            <h2>{userData.nombre} {userData.apellido}</h2>
            <p>{userData.email}</p>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 2, 
                backgroundColor: "#f6d85f", 
                color: "black", 
                textTransform: "none", 
                '&:hover': { backgroundColor: "#e6c750" } 
              }}
              onClick={handleResendEmail}
            >
              Reenviar Mail
            </Button>
          </div>
        </div>
      </div>

      <UserProfileSectionsTabs />
      {renderActiveTabContent()}
    </div>
  );
};

export default UserProfile;
