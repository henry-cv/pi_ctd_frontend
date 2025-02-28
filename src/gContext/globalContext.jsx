import { createContext, useContext, useReducer } from "react";
import { reducer } from "../reducer/reducer";

const initialState = {
  theme: "",
  activeTab: "edit-profile",
};

export const ContextGlobal = createContext();

export const ContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <ContextGlobal.Provider value={{ state, dispatch }}>
      {children}
    </ContextGlobal.Provider>
  );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);
