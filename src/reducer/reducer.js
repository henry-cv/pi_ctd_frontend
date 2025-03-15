export const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      return {
        ...state,
        theme: state.theme === "" ? "dark" : "",
      };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "LOGIN_USER":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        usuarioRoles: action.payload.user.usuarioRoles,
      };
    case "LOGOUT_USER":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    case "SET_ACTIVITY":
      console.log("elpayload");
      console.log(action.payload);
      return { ...state, activity: action.payload };

    case "SET_RESERVATION":
      return {
        ...state,
        reservation: [...state.reservation, action.payload],
      };
      case "SET_URL_REDIRECTION":
        localStorage.setItem("urlRedirection", action.payload);  
        return {
          ...state,
          urlRedirection: action.payload,
        };
      case "ORIGIN_ACCESS":
        return {
          ...state,
          isAccessModal: action.payload,
        };

    default:
      throw new Error("Acción no existente");
  }
};
