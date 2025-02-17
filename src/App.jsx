import "./css/variables.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
