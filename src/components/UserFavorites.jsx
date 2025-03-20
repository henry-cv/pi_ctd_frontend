// src/components/UserFavorites.jsx
import { useState, useEffect } from "react";
import { useContextGlobal } from "../gContext/globalContext";
import ActivityCard from "./ActivityCard";
import "../css/components/UserFavorites.css";

const UserFavorites = () => {
  const { state } = useContextGlobal();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!state.token) return;

      try {
        setLoading(true);
        const response = await fetch("/api/favoritos/listar", {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener favoritos");
        }

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [state.token]);

  if (loading) {
    return (
      <div className="user-favorites-loading">
        <div className="spinner"></div>
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-favorites-error">
        <p>Error al cargar favoritos: {error}</p>
        <button onClick={() => window.location.reload()}>Intentar nuevamente</button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="user-favorites-empty">
        <h3>No tienes actividades favoritas</h3>
        <p>Explora nuestras actividades y marca las que más te gusten para guardarlas aquí.</p>
        <a href="/" className="explore-link">Explorar actividades</a>
      </div>
    );
  }

  return (
    <div className="user-favorites-container">
      <h2>Mis Favoritos</h2>
      <div className="user-favorites-grid">
        {favorites.map((favorite) => (
          <ActivityCard
            key={favorite.id}
            id={favorite.producto.id}
            image={favorite.producto.productoImagenesSalidaDto?.[0]?.rutaImagen}
            title={favorite.producto.nombre}
            location={`${favorite.producto.ciudad}, ${favorite.producto.pais}`}
            tipoEvento={favorite.producto.tipoEvento}
            horaInicio={favorite.producto.horaInicio}
            horaFin={favorite.producto.horaFin}
            diasDisponible={favorite.producto.diasDisponible}
            price={favorite.producto.valorTarifa}
            rating={4.5} // Valor predeterminado si no hay calificación
            categories={favorite.producto.categorias}
          />
        ))}
      </div>
    </div>
  );
};

export default UserFavorites;