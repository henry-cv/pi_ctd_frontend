export const reducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_THEME":
        return {...state,
            theme: state.theme === "" ? "dark" : "" };
      case "SET_ACTIVE_TAB":
        return { ...state, activeTab: action.payload };
      default:
        throw new Error("Acción no existente");
    }
  };
  