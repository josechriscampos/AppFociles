import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Send, Mail, User, MessageSquare, CheckCircle } from "lucide-react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await api.post("/contacto", { nombre, email, mensaje });
      setEnviado(true);
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al enviar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Mail size={32} color="var(--accent)" style={{ marginBottom: "12px" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Contacto</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
            ¿Tenés dudas, querés colaborar o reportar un hallazgo? Escribinos.
          </p>
        </div>

        {enviado ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "var(--bg-card)", border: "1px solid var(--success)",
              borderRadius: "var(--radius)", padding: "40px", textAlign: "center"
            }}
          >
            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: "16px" }} />
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Mensaje enviado</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
              Gracias por contactarnos. Te responderemos pronto.
            </p>
            <button onClick={() => setEnviado(false)} className="btn btn-primary">
              Enviar otro mensaje
            </button>
          </motion.div>
        ) : (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "32px"
          }}>
            {error && (
              <div style={{
                background: "#3d1f1f", color: "#f87171", padding: "10px 14px",
                borderRadius: "8px", fontSize: "13px", marginBottom: "16px"
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <User size={14} /> Nombre
                </label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre completo" />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <Mail size={14} /> Correo electrónico
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <MessageSquare size={14} /> Mensaje
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                  placeholder="Escribí tu mensaje..."
                  rows={5}
                  style={{ resize: "vertical" }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={cargando}
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <Send size={16} /> {cargando ? "Enviando..." : "Enviar mensaje"}
              </motion.button>
            </form>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
          También podés escribirnos a contacto@unadeca.net
        </p>
      </motion.div>
    </div>
  );
}