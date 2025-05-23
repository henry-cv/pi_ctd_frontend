// src/pages/UserProfile.jsx
import React, { useState } from "react";
import "../css/pages/UserProfile.css";
import UserProfileSectionsTabs from "../components/UserProfileSectionsTabs";
import FormEditUser from "../components/FormEditUser";
import UserFavorites from "../components/UserFavorites";
import { useContextGlobal } from "../gContext/globalContext";
import Avatar from "@mui/material/Avatar";
import UserBookings from "../components/MyBookings/UserBookings";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";

const UserProfile = () => {
  const { state } = useContextGlobal();

  const style = {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "50vh", 
    fontSize: "24px", 
    fontWeight: "bold", 
    textAlign: "center",
    color:"gray"
  };

  const [userData, setUserData] = useState(state.user);

  const getUserInitials = `${userData?.nombre?.[0] || "U"}${
    userData?.apellido?.[0] || "U"
  }`.toUpperCase();

  // Determinar qué contenido mostrar según la pestaña activa
  const renderActiveTabContent = () => {
    switch(state.userFiltersTabs.activeTab) {
      case "edit-profile":
        return <FormEditUser userData={userData} setUserData={setUserData} />;
      case "reservations":
        return <UserBookings/>;
      case "favorites":
        return <UserFavorites />;
      default:
        return <FormEditUser userData={userData} setUserData={setUserData} />;
    }
  };

  return (
    <div className="profile-user-page">
          <div className="profile-container">
            <BasicBreadcrumbs/>
      <div className="profile-banner">
        <div className="user-info-profile">
          <div className="avatar-container">
            <Avatar sx={{ width: 120, height: 120, background: "#f6d85f", color:"black", fontSize:"40px" }}>
              {getUserInitials}
            </Avatar>
          </div>
          <div className="user-details-banner">
            <h2>{userData.nombre} {userData.apellido}</h2>
            <p>{userData.email}</p>
          </div>
        </div>
      </div>

      <UserProfileSectionsTabs />
      
      {renderActiveTabContent()}
    </div>

    </div>

  );
};

export default UserProfile;