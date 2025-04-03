// src/components/FavoriteButton.jsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useContextGlobal } from "../gContext/globalContext";
import { useFavoritesContext } from "./UserFavorites";
import "../css/components/FavoriteButton.css";

const FavoriteButton = ({ productoId }) => {
  const { state } = useContextGlobal();
  const favoritesContext = useFavoritesContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si el producto es favorito al cargar el componente
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!state.token) return;
      
      try {
        const response = await fetch(`/api/favoritos/verificar/${productoId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.esFavorito);
        }
      } catch (error) {
        console.error("Error al verificar favorito:", error);
      }
    };
    
    checkFavoriteStatus();
  }, [productoId, state.token]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Evitar navegación a la página de detalle
    e.stopPropagation(); // Evitar que el clic se propague al contenedor padre
    
    if (!state.token) {
      // Redirigir a login si no está autenticado
      window.location.href = "/entrar";
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Eliminar de favoritos
        const response = await fetch(`/api/favoritos/eliminar/${productoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        
        if (response.ok) {
          setIsFavorite(false);
          // Notificar al contexto de favoritos que este item ha sido eliminado
          if (favoritesContext?.onFavoriteRemoved) {
            favoritesContext.onFavoriteRemoved(productoId);
          }
        }
      } else {
        // Agregar a favoritos
        const response = await fetch("/api/favoritos/agregar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`
          },
          body: JSON.stringify({ productoId })
        });
        
        if (response.ok) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <FontAwesomeIcon 
        icon={isFavorite ? faHeartSolid : faHeartRegular} 
        className="favorite-icon"
      />
    </button>
  );
};

export default FavoriteButton;