import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Bone, LogIn, LogOut, User, Shield, Search } from "lucide-react";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      style={{
        background: "var(--primary-dark)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 0",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Bone size={24} color="var(--accent)" />
          <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--accent)" }}>
            FosilCR
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/catalogo" style={{ color: "var(--text-secondary)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Search size={16} /> Catálogo
          </Link>
          <Link to="/contacto" style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Contacto
          </Link>

          {usuario ? (
            <>
              {(usuario.rol === "EXPLORADOR" || usuario.rol === "ADMIN") && (
                <Link to="/registrar-fosil" style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                  Registrar fósil
                </Link>
              )}
              {usuario.rol === "ADMIN" && (
                <Link to="/admin" style={{ color: "var(--accent)", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Shield size={14} /> Admin
                </Link>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  <User size={14} style={{ verticalAlign: "middle" }} /> {usuario.email}
                </span>
                <button onClick={handleLogout} className="btn" style={{ background: "transparent", color: "var(--danger)", padding: "6px 12px", fontSize: "13px" }}>
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px" }}>
                <LogIn size={14} /> Ingresar
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}