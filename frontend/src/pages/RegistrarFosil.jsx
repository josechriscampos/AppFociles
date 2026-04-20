import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Upload, MapPin, Save, AlertCircle } from "lucide-react";

export default function RegistrarFosil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [provincias, setProvincias] = useState([]);
  const [eras, setEras] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [capturandoGPS, setCapturandoGPS] = useState(false);

  const [form, setForm] = useState({
    nombre: "", descripcion: "", categoria: "FOS",
    provinciaId: "", cantonId: "", latitud: "", longitud: "",
    ubicacionTexto: "", contextoGeologico: "", estadoOriginal: "",
    fechaHallazgo: "", quienEncontro: "", eraId: "", periodoId: "",
    tipoImagen: "GENERAL"
  });

  useEffect(() => {
    if (!usuario || (usuario.rol !== "EXPLORADOR" && usuario.rol !== "ADMIN")) {
      navigate("/login");
      return;
    }
    api.get("/catalogo/provincias").then(res => setProvincias(res.data));
    api.get("/catalogo/eras").then(res => setEras(res.data));
  }, []);

  useEffect(() => {
    if (form.provinciaId) {
      const prov = provincias.find(p => p.id === parseInt(form.provinciaId));
      setCantones(prov ? prov.cantones : []);
      setForm(f => ({ ...f, cantonId: "" }));
    }
  }, [form.provinciaId]);

  useEffect(() => {
    if (form.eraId) {
      const era = eras.find(e => e.id === parseInt(form.eraId));
      setPeriodos(era ? era.periodos : []);
      setForm(f => ({ ...f, periodoId: "" }));
    }
  }, [form.eraId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const capturarGPS = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      return;
    }
    setCapturandoGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitud: pos.coords.latitude.toFixed(6),
          longitud: pos.coords.longitude.toFixed(6)
        }));
        setCapturandoGPS(false);
      },
      () => {
        setError("No se pudo obtener la ubicación. Ingresá las coordenadas manualmente.");
        setCapturandoGPS(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("categoria", form.categoria);
      if (form.cantonId) formData.append("cantonId", form.cantonId);
      if (form.latitud) formData.append("latitud", form.latitud);
      if (form.longitud) formData.append("longitud", form.longitud);
      if (form.ubicacionTexto) formData.append("ubicacionTexto", form.ubicacionTexto);
      if (form.contextoGeologico) formData.append("contextoGeologico", form.contextoGeologico);
      if (form.estadoOriginal) formData.append("estadoOriginal", form.estadoOriginal);
      if (form.fechaHallazgo) formData.append("fechaHallazgo", form.fechaHallazgo);
      if (form.quienEncontro) formData.append("quienEncontro", form.quienEncontro);
      if (form.periodoId) formData.append("periodoId", form.periodoId);
      formData.append("tipoImagen", form.tipoImagen);

      for (const img of imagenes) {
        formData.append("imagenes", img);
      }

      await api.post("/fosiles", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/catalogo");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar");
    } finally {
      setCargando(false);
    }
  };

  const estiloSeccion = {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "24px", marginBottom: "20px"
  };

  const estiloLabel = {
    fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px"
  };

  const estiloGrid = {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px"
  };

  return (
    <div className="container" style={{ padding: "32px 20px", maxWidth: "700px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>Registrar nuevo fósil</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          El fósil quedará como pendiente hasta que un administrador lo apruebe.
        </p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
            background: "#3d1f1f", color: "#f87171", padding: "12px 16px",
            borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Info básica */}
          <div style={estiloSeccion}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Información básica</h3>
            <div style={{ marginBottom: "14px" }}>
              <label style={estiloLabel}>Nombre del hallazgo *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Diente fosilizado" />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={estiloLabel}>Descripción *</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3} placeholder="Describí el hallazgo..." style={{ resize: "vertical" }} />
            </div>
            <div style={estiloGrid}>
              <div>
                <label style={estiloLabel}>Categoría *</label>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                  <option value="FOS">Fósil general</option>
                  <option value="MIN">Mineral</option>
                  <option value="ROC">Roca</option>
                  <option value="PAL">Paleontológico</option>
                </select>
              </div>
              <div>
                <label style={estiloLabel}>Fecha de hallazgo</label>
                <input type="date" name="fechaHallazgo" value={form.fechaHallazgo} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div style={estiloSeccion}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Ubicación</h3>
            <div style={estiloGrid}>
              <div>
                <label style={estiloLabel}>Provincia</label>
                <select name="provinciaId" value={form.provinciaId} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>Cantón</label>
                <select name="cantonId" value={form.cantonId} onChange={handleChange} disabled={!form.provinciaId}>
                  <option value="">Seleccionar</option>
                  {cantones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ ...estiloGrid, marginTop: "14px" }}>
              <div>
                <label style={estiloLabel}>Latitud</label>
                <input name="latitud" value={form.latitud} onChange={handleChange} placeholder="9.9345" />
              </div>
              <div>
                <label style={estiloLabel}>Longitud</label>
                <input name="longitud" value={form.longitud} onChange={handleChange} placeholder="-84.0875" />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              onClick={capturarGPS}
              disabled={capturandoGPS}
              className="btn btn-secondary"
              style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
            >
              <MapPin size={14} /> {capturandoGPS ? "Capturando..." : "Capturar GPS automático"}
            </motion.button>
            <div style={{ marginTop: "14px" }}>
              <label style={estiloLabel}>Descripción de ubicación</label>
              <input name="ubicacionTexto" value={form.ubicacionTexto} onChange={handleChange} placeholder="Ej: Cerca del río, a 500m del camino principal" />
            </div>
          </div>

          {/* Clasificación */}
          <div style={estiloSeccion}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Clasificación geológica</h3>
            <div style={estiloGrid}>
              <div>
                <label style={estiloLabel}>Era geológica</label>
                <select name="eraId" value={form.eraId} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {eras.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>Período</label>
                <select name="periodoId" value={form.periodoId} onChange={handleChange} disabled={!form.eraId}>
                  <option value="">Seleccionar</option>
                  {periodos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Contexto */}
          <div style={estiloSeccion}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Contexto del hallazgo</h3>
            <div style={{ marginBottom: "14px" }}>
              <label style={estiloLabel}>¿Quién lo encontró?</label>
              <input name="quienEncontro" value={form.quienEncontro} onChange={handleChange} placeholder="Nombre de quien lo encontró" />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={estiloLabel}>Estado original del fósil</label>
              <textarea name="estadoOriginal" value={form.estadoOriginal} onChange={handleChange} rows={2} placeholder="¿Cómo estaba cuando lo encontraron?" style={{ resize: "vertical" }} />
            </div>
            <div>
              <label style={estiloLabel}>Contexto geológico</label>
              <textarea name="contextoGeologico" value={form.contextoGeologico} onChange={handleChange} rows={2} placeholder="Tipo de roca, formación, estrato..." style={{ resize: "vertical" }} />
            </div>
          </div>

          {/* Imágenes */}
          <div style={estiloSeccion}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Fotografías</h3>
            <div style={{ marginBottom: "14px" }}>
              <label style={estiloLabel}>Tipo de imagen</label>
              <select name="tipoImagen" value={form.tipoImagen} onChange={handleChange}>
                <option value="GENERAL">General</option>
                <option value="ANTES_EXTRACCION">Antes de extracción</option>
                <option value="DESPUES_LIMPIEZA">Después de limpieza</option>
                <option value="ANALISIS">Análisis</option>
              </select>
            </div>
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              border: "2px dashed var(--border)", borderRadius: "var(--radius)",
              padding: "28px", cursor: "pointer", transition: "border-color 0.3s"
            }}>
              <Upload size={24} color="var(--text-muted)" />
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Click para seleccionar imágenes
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                JPG, PNG o WebP — Máximo 10MB cada una
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImagenes(Array.from(e.target.files))}
                style={{ display: "none" }}
              />
            </label>
            {imagenes.length > 0 && (
              <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--accent)" }}>
                {imagenes.length} imagen(es) seleccionada(s)
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={cargando}
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <Save size={18} /> {cargando ? "Registrando..." : "Registrar fósil"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}