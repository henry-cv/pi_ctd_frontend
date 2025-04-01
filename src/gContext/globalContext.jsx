import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "../reducer/reducer";
import axios from "axios";

const initialState = {
  theme: "",
  userFiltersTabs:{
    activeTab: "edit-profile",
    selectedFilters: "confirm"
  }
  ,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  isLoading: true,
  usuarioRoles: null,
  activity: null,
  reservation:{ 
    theBooking: JSON.parse(localStorage.getItem("reservation")) || [], 
    isBooking: false},
    urlRedirection: localStorage.getItem("urlRedirection") || "",
    isAccessModal: false,
    bookingModals:{
      pastDate:"",
      callEffect: false,
      isActiveModal:true,  
    }
  
};

export const ContextGlobal = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token almacenado:", token);

    if (token) {
      try {
        const payload = token.split(".")[1];
        console.log("Payload del token:", payload);

        const decodedPayload = atob(payload);
        console.log("Payload decodificado:", decodedPayload);

        const { sub } = JSON.parse(decodedPayload); // Extrae el email del campo "sub"
        console.log("Email extraído del token (sub):", sub);

        if (sub) {
          const fetchUserData = async (email) => {
            try {
              const response = await axios.get(`/api/usuario/${email}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const userData = response.data;
              console.log("Datos del usuario obtenidos:", userData);

              dispatch({
                type: "LOGIN_USER",
                payload: { user: userData, token },
              });
            } catch (error) {
              console.error("Error al obtener los datos del usuario:", error);
              localStorage.removeItem("token");
              dispatch({ type: "LOGOUT_USER" });
            } finally {
              dispatch({ type: "STOP_LOADING" });
            }
          };

          fetchUserData(sub);
        } else {
          console.error("El token no contiene un email válido.");
          dispatch({ type: "STOP_LOADING" });
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
        dispatch({ type: "STOP_LOADING" });
      }
    } else {
      dispatch({ type: "STOP_LOADING" });
    }
  }, []);

  useEffect(() => {
    if (state.reservation) {
      localStorage.setItem("reservation", JSON.stringify(state.reservation));
    }
  }, [state.reservation]);

  return (
    <ContextGlobal.Provider value={{ state, dispatch }}>
      {children}
    </ContextGlobal.Provider>
  );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);
