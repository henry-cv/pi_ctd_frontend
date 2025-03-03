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
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT_USER":
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
    default:
      throw new Error("Acción no existente");
  }
};