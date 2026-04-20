import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MapPin, Calendar, User, Tag, Layers, Microscope } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para el ícono de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

const categorias = { FOS: "Fósil", MIN: "Mineral", ROC: "Roca", PAL: "Paleontológico" };

export default function DetalleFosil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [fosil, setFosil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get(`/fosiles/${id}`);
        setFosil(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  if (cargando) {
    return (
      <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Cargando...</p>
      </div>
    );
  }

  if (!fosil) {
    return (
      <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Fósil no encontrado</p>
      </div>
    );
  }

  const esInvestigador = usuario && (usuario.rol === "INVESTIGADOR" || usuario.rol === "ADMIN");

  return (
    <div className="container" style={{ padding: "32px 20px", maxWidth: "900px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "var(--text-secondary)",
          display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "14px"
        }}>
          <ArrowLeft size={16} /> Volver
        </button>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 600 }}>{fosil.nombre}</h1>
            <span className={`badge badge-${fosil.categoria.toLowerCase()}`}>{categorias[fosil.categoria]}</span>
            <span className={`badge badge-${fosil.estado.toLowerCase()}`}>{fosil.estado}</span>
          </div>
          {fosil.codigo && (
            <p style={{ fontSize: "14px", color: "var(--accent)", fontFamily: "monospace" }}>{fosil.codigo}</p>
          )}
        </div>

        {/* Imágenes */}
        {fosil.imagenes && fosil.imagenes.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "28px" }}>
            {fosil.imagenes.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
                <img
                  src={`http://localhost:3001/uploads/${img.ruta}`}
                  alt={`${fosil.nombre} - ${img.tipo}`}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = ""; e.target.style.background = "var(--primary-dark)"; e.target.style.height = "180px"; }}
                />
                <div style={{ padding: "8px", fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                  {img.tipo.replace("_", " ")}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
          {/* Descripción */}
          <div style={{
            gridColumn: "1 / -1", background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "20px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Tag size={16} color="var(--accent)" /> Descripción
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{fosil.descripcion}</p>
          </div>

          {/* Ubicación */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "20px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} color="var(--accent)" /> Ubicación
            </h3>
            {fosil.canton && (
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                {fosil.canton.nombre}, {fosil.canton.provincia?.nombre}
              </p>
            )}
            {fosil.ubicacionTexto && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{fosil.ubicacionTexto}</p>
            )}
          </div>

          {/* Período */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "20px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={16} color="var(--accent)" /> Clasificación geológica
            </h3>
            {fosil.periodo && (
              <>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Era: {fosil.periodo.era?.nombre}</p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Período: {fosil.periodo.nombre}</p>
              </>
            )}
          </div>

          {/* Descubrimiento */}
          <div style={{
            gridColumn: "1 / -1", background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "20px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} color="var(--accent)" /> Descubrimiento
            </h3>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "14px", color: "var(--text-secondary)" }}>
              {fosil.explorador && <span>Registrado por: {fosil.explorador.nombre}</span>}
              {fosil.quienEncontro && <span>Encontrado por: {fosil.quienEncontro}</span>}
              {fosil.fechaHallazgo && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={14} /> {new Date(fosil.fechaHallazgo).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Info científica (solo investigador/admin) */}
          {esInvestigador && (fosil.contextoGeologico || fosil.estadoOriginal || fosil.composicion || fosil.estudioIntro) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                gridColumn: "1 / -1", background: "var(--bg-card)",
                border: "1px solid var(--accent)", borderRadius: "var(--radius)", padding: "20px"
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)" }}>
                <Microscope size={16} /> Información científica
              </h3>
              <div style={{ display: "grid", gap: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
                {fosil.contextoGeologico && <div><strong style={{ color: "var(--text-primary)" }}>Contexto geológico:</strong> {fosil.contextoGeologico}</div>}
                {fosil.estadoOriginal && <div><strong style={{ color: "var(--text-primary)" }}>Estado original:</strong> {fosil.estadoOriginal}</div>}
                {fosil.composicion && <div><strong style={{ color: "var(--text-primary)" }}>Composición:</strong> {fosil.composicion}</div>}
                {fosil.estudioIntro && <div><strong style={{ color: "var(--text-primary)" }}>Estudio:</strong> {fosil.estudioIntro}</div>}
                {fosil.referencias && <div><strong style={{ color: "var(--text-primary)" }}>Referencias:</strong> {fosil.referencias}</div>}
              </div>
            </motion.div>
          )}

          {/* Taxonomía */}
          {fosil.taxonomia && (
            <div style={{
              gridColumn: "1 / -1", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "20px"
            }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>Clasificación taxonómica</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                {fosil.taxonomia.nivel}: {fosil.taxonomia.nombre}
              </p>
            </div>
          )}
        </div>

        {/* Mapa */}
        {fosil.latitud && fosil.longitud && (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "28px"
          }}>
            <h3 style={{ padding: "16px 20px 0", fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} color="var(--accent)" /> Ubicación del hallazgo
            </h3>
            <div style={{ height: "350px", marginTop: "12px" }}>
              <MapContainer center={[fosil.latitud, fosil.longitud]} zoom={10} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[fosil.latitud, fosil.longitud]}>
                  <Popup>{fosil.nombre}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}