import "./css/global/variables.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContextProvider, useContextGlobal } from "./gContext/globalContext";
import AppRoutes from "./Routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";

// Componente interno que usa el contexto
function AppContent() {
  const { state } = useContextGlobal();
  
  return (
    <div className={`bg-white min-h-screen ${state.theme}`}>
      <ScrollToTop/>
      <AppRoutes />
    </div>
  );
}

// Componente principal que provee el contexto
function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <AppContent />
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;