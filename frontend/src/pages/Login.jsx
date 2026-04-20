import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../services/api";
import { Bone, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("INVESTIGADOR");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (modo === "login") {
        const res = await api.post("/auth/login", { email, password });
        login(res.data.token, res.data.usuario);
        navigate("/catalogo");
      } else {
        await api.post("/auth/registrar", { email, password, nombre, rol });
        const res = await api.post("/auth/login", { email, password });
        login(res.data.token, res.data.usuario);
        navigate("/catalogo");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "40px",
          width: "100%",
          maxWidth: "420px"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Bone size={32} color="var(--accent)" style={{ marginBottom: "12px" }} />
          <h2 style={{ fontSize: "22px", fontWeight: 600 }}>
            {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            {modo === "login" ? "Ingresá tus credenciales" : "Completá tus datos"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#3d1f1f",
              color: "#f87171",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px"
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {modo === "registro" && (
            <>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Nombre completo</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre" />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Tipo de cuenta</label>
                <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ width: "100%" }}>
                  <option value="INVESTIGADOR">Investigador</option>
                  <option value="EXPLORADOR">Explorador</option>
                </select>
              </div>
            </>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={verPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)" }}
              >
                {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={cargando}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "15px" }}
          >
            {cargando ? "Cargando..." : modo === "login" ? "Ingresar" : "Registrarse"}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--text-secondary)" }}>
          {modo === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "14px", textDecoration: "underline" }}
          >
            {modo === "login" ? "Crear una" : "Iniciá sesión"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}