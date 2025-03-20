import { useState, useEffect } from "react";
import "../css/pages/dashboard.css";
import "../css/components/AsignarRol.css";
import { useContextGlobal } from "../gContext/globalContext";
import Swal from "sweetalert2";

const AsignarRol = () => {
  const { state } = useContextGlobal();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        // Obtenemos el token del estado global o localStorage
        const token = state.token || localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }
        
        const response = await fetch("/api/usuario/listar", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al obtener usuarios: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Usuarios obtenidos:", data);
        
        // Filtrar para no mostrar el usuario logueado ni los superadmin
        const usuariosFiltrados = data.filter(user => 
          user.email !== state.user?.email && !user.esSuperAdmin
        );
        
        setUsuarios(usuariosFiltrados);
        setFilteredUsuarios(usuariosFiltrados);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [state.token, state.user?.email]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredUsuarios(usuarios);
    } else {
      setFilteredUsuarios(
        usuarios.filter(
          (usuario) =>
            usuario.nombre?.toLowerCase().includes(term.toLowerCase()) ||
            usuario.apellido?.toLowerCase().includes(term.toLowerCase()) ||
            usuario.email?.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const handleToggleAccess = async (usuario) => {
    try {
      setActionLoading(true);
      
      // Determinamos el nuevo rol (contrario al actual)
      const nuevoRol = usuario.usuarioRoles === "USER" ? "ADMIN" : "USER";
      
      // Preparamos los datos para enviar al servidor
      const payload = {
        email: usuario.email,
        rol: nuevoRol
      };
      
      console.log("Enviando payload:", payload);
      
      // Obtenemos el token del estado global o localStorage
      const token = state.token || localStorage.getItem("token");
      
      // Realizamos la petición al backend
      const response = await fetch("/api/usuario/modificarusuariorole", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      // Leemos el texto de la respuesta una sola vez
      const responseText = await response.text();
      console.log("Respuesta del servidor (texto):", responseText);
      
      // Intentamos parsear la respuesta como JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Respuesta parseada:", data);
      } catch (e) {
        console.error("No se pudo parsear la respuesta como JSON", e);
        data = { message: responseText };
      }
      
      // Verificamos si hubo un error en la respuesta
      if (!response.ok) {
        throw new Error(`Error al cambiar rol: ${response.status} - ${responseText}`);
      }
      
      // Si llegamos aquí, la solicitud fue exitosa
      // Actualizamos los estados locales
      const updatedUsuarios = usuarios.map((user) => {
        if (user.id === usuario.id) {
          return {
            ...user,
            usuarioRoles: nuevoRol
          };
        }
        return user;
      });
      
      setUsuarios(updatedUsuarios);
      
      const updatedFilteredUsuarios = filteredUsuarios.map((user) => {
        if (user.id === usuario.id) {
          return {
            ...user,
            usuarioRoles: nuevoRol
          };
        }
        return user;
      });
      
      setFilteredUsuarios(updatedFilteredUsuarios);
      
      // Mostramos un mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Rol actualizado",
        text: `El rol de ${usuario.nombre} ${usuario.apellido} ha sido cambiado a ${nuevoRol}`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: ` ${state.theme ? "swal2-dark" : ""}`, 
        }
      });
      
    } catch (error) {
      console.error("Error cambiando el rol:", error);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al cambiar el rol del usuario",
        customClass: {
          popup: ` ${state.theme ? "swal2-dark" : ""}`, 
        }
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="asignar-rol-container">
      <h2 className="dark_activities">Asignar Rol</h2>
      <p className="rol-description">Aquí puedes otorgar permisos de administrador a otros usuarios.</p>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <div className="user-table">
        <div className="table-header">
          <div className="column nombre">Nombre</div>
          <div className="column asignar-acceso">Asignar acceso</div>
        </div>
        
        {filteredUsuarios.length > 0 ? (
          filteredUsuarios.map((usuario) => (
            <div key={usuario.id} className="user-row">
              <div className="user-info">
                <input type="checkbox" className="user-checkbox" />
                <div className="user-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${usuario.nombre}+${usuario.apellido}&background=random`} alt={`${usuario.nombre} ${usuario.apellido}`} />
                </div>
                <div className="user-name">{usuario.nombre} {usuario.apellido}</div>
              </div>
              <div className="user-access">
                <label className={`switch ${actionLoading ? 'disabled' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={usuario.usuarioRoles === "ADMIN"}
                    onChange={() => handleToggleAccess(usuario)} 
                    disabled={actionLoading}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          ))
        ) : (
          <div className="no-users">
            <p>
              {searchTerm 
                ? "No se encontraron usuarios que coincidan con la búsqueda." 
                : "No hay usuarios disponibles para asignar roles."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsignarRol;