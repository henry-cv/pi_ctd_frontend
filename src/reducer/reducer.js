export const reducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_THEME":
        return {...state,
            theme: state.theme === "" ? "dark" : "" };
      default:
        throw new Error("Acción no existente");
    }
  };
  