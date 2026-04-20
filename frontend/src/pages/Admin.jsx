import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Users, Bone, Mail, Check, X, Trash2, Shield, Clock } from "lucide-react";

export default function Admin() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("fosiles");
  const [fosiles, setFosiles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario || usuario.rol !== "ADMIN") {
      navigate("/login");
      return;
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [f, u, m] = await Promise.all([
        api.get("/fosiles?limite=100"),
        api.get("/usuarios"),
        api.get("/contacto")
      ]);
      setFosiles(f.data.fosiles || []);
      setUsuarios(u.data || []);
      setMensajes(m.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/fosiles/${id}/estado`, { estado });
      cargarDatos();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarFosil = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este fósil?")) return;
    try {
      await api.delete(`/fosiles/${id}`);
      cargarDatos();
    } catch (err) {
      console.error(err);
    }
  };

  const cambiarRol = async (id, rol) => {
    try {
      await api.patch(`/usuarios/${id}/rol`, { rol });
      cargarDatos();
    } catch (err) {
      console.error(err);
    }
  };

  const desactivarUsuario = async (id) => {
    if (!confirm("¿Desactivar este usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      cargarDatos();
    } catch (err) {
      console.error(err);
    }
  };

  const estiloTab = (t) => ({
    padding: "10px 20px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: 500,
    background: tab === t ? "var(--accent)" : "var(--bg-card)",
    color: tab === t ? "var(--primary-dark)" : "var(--text-secondary)",
    transition: "all 0.3s"
  });

  const estiloTabla = {
    width: "100%", borderCollapse: "collapse", fontSize: "14px"
  };

  const estiloTh = {
    textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)",
    color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px"
  };

  const estiloTd = {
    padding: "12px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)"
  };

  if (cargando) {
    return <div className="container" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>Cargando panel...</div>;
  }

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <Shield size={24} color="var(--accent)" />
          <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Panel de administración</h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Fósiles", valor: fosiles.length, icon: <Bone size={20} />, color: "#4ade80" },
            { label: "Pendientes", valor: fosiles.filter(f => f.estado === "PENDIENTE").length, icon: <Clock size={20} />, color: "#fbbf24" },
            { label: "Usuarios", valor: usuarios.length, icon: <Users size={20} />, color: "#60a5fa" },
            { label: "Mensajes", valor: mensajes.length, icon: <Mail size={20} />, color: "#c084fc" }
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px" }}>
              <div style={{ color: s.color, marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{s.valor}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button onClick={() => setTab("fosiles")} style={estiloTab("fosiles")}>Fósiles</button>
          <button onClick={() => setTab("usuarios")} style={estiloTab("usuarios")}>Usuarios</button>
          <button onClick={() => setTab("mensajes")} style={estiloTab("mensajes")}>Mensajes</button>
        </div>

        {/* Contenido */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "auto" }}>
          <AnimatePresence mode="wait">
            {tab === "fosiles" && (
              <motion.div key="fosiles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <table style={estiloTabla}>
                  <thead>
                    <tr>
                      <th style={estiloTh}>Nombre</th>
                      <th style={estiloTh}>Categoría</th>
                      <th style={estiloTh}>Estado</th>
                      <th style={estiloTh}>Explorador</th>
                      <th style={estiloTh}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fosiles.map(f => (
                      <tr key={f.id}>
                        <td style={{ ...estiloTd, color: "var(--text-primary)", fontWeight: 500 }}>{f.nombre}</td>
                        <td style={estiloTd}><span className={`badge badge-${f.categoria.toLowerCase()}`}>{f.categoria}</span></td>
                        <td style={estiloTd}><span className={`badge badge-${f.estado.toLowerCase()}`}>{f.estado}</span></td>
                        <td style={estiloTd}>{f.explorador?.nombre || "-"}</td>
                        <td style={estiloTd}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {f.estado === "PENDIENTE" && (
                              <>
                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => cambiarEstado(f.id, "PUBLICADO")}
                                  style={{ background: "#1a3d2e", border: "none", color: "#4ade80", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                                  <Check size={14} /> Aprobar
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => cambiarEstado(f.id, "RECHAZADO")}
                                  style={{ background: "#3d1f1f", border: "none", color: "#f87171", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                                  <X size={14} /> Rechazar
                                </motion.button>
                              </>
                            )}
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => eliminarFosil(f.id)}
                              style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "6px 8px", borderRadius: "6px" }}>
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {tab === "usuarios" && (
              <motion.div key="usuarios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <table style={estiloTabla}>
                  <thead>
                    <tr>
                      <th style={estiloTh}>Nombre</th>
                      <th style={estiloTh}>Email</th>
                      <th style={estiloTh}>Rol</th>
                      <th style={estiloTh}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id}>
                        <td style={{ ...estiloTd, color: "var(--text-primary)", fontWeight: 500 }}>{u.nombre}</td>
                        <td style={estiloTd}>{u.email}</td>
                        <td style={estiloTd}>
                          <select value={u.rol} onChange={(e) => cambiarRol(u.id, e.target.value)}
                            style={{ padding: "4px 8px", fontSize: "12px", width: "auto" }}>
                            <option value="INVESTIGADOR">Investigador</option>
                            <option value="EXPLORADOR">Explorador</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td style={estiloTd}>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => desactivarUsuario(u.id)}
                            style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "6px 8px", borderRadius: "6px" }}>
                            <Trash2 size={14} />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {tab === "mensajes" && (
              <motion.div key="mensajes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <table style={estiloTabla}>
                  <thead>
                    <tr>
                      <th style={estiloTh}>Nombre</th>
                      <th style={estiloTh}>Email</th>
                      <th style={estiloTh}>Mensaje</th>
                      <th style={estiloTh}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensajes.map(m => (
                      <tr key={m.id}>
                        <td style={{ ...estiloTd, fontWeight: 500, color: "var(--text-primary)" }}>{m.nombre}</td>
                        <td style={estiloTd}>{m.email}</td>
                        <td style={{ ...estiloTd, maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.mensaje}</td>
                        <td style={estiloTd}>{new Date(m.creadoEn).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}