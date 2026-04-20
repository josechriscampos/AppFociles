import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import DetalleFosil from "./pages/DetalleFosil";
import Contacto from "./pages/Contacto";
import RegistrarFosil from "./pages/RegistrarFosil";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/fosil/:id" element={<DetalleFosil />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registrar-fosil" element={<RegistrarFosil />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}