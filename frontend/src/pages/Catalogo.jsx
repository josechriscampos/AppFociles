import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Search, Filter, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const categorias = {
  FOS: "Fósil", MIN: "Mineral", ROC: "Roca", PAL: "Paleontológico"
};

export default function Catalogo() {
  const [fosiles, setFosiles] = useState([]);
  const [paginacion, setPaginacion] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [eraId, setEraId] = useState("");
  const [eras, setEras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    api.get("/catalogo/eras").then(res => setEras(res.data));
  }, []);

  useEffect(() => {
    cargar();
  }, [pagina, categoria, eraId]);

  const cargar = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      params.append("pagina", pagina);
      params.append("limite", 12);
      if (busqueda) params.append("nombre", busqueda);
      if (categoria) params.append("categoria", categoria);
      if (eraId) params.append("eraId", eraId);

      const res = await api.get(`/fosiles/buscar?${params}`);
      setFosiles(res.data.fosiles);
      setPaginacion(res.data.paginacion);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPagina(1);
    cargar();
  };

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "8px" }}>Catálogo de fósiles</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Explorá nuestra colección completa</p>

        {/* Filtros */}
        <form onSubmit={handleBuscar} style={{
          display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap",
          background: "var(--bg-card)", padding: "16px", borderRadius: "var(--radius)",
          border: "1px solid var(--border)"
        }}>
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              style={{ paddingLeft: "36px" }}
            />
          </div>
          <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1); }} style={{ width: "160px" }}>
            <option value="">Todas las categorías</option>
            <option value="FOS">Fósil</option>
            <option value="MIN">Mineral</option>
            <option value="ROC">Roca</option>
            <option value="PAL">Paleontológico</option>
          </select>
          <select value={eraId} onChange={(e) => { setEraId(e.target.value); setPagina(1); }} style={{ width: "160px" }}>
            <option value="">Todas las eras</option>
            {eras.map(era => (
              <option key={era.id} value={era.id}>{era.nombre}</option>
            ))}
          </select>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={14} /> Filtrar
          </motion.button>
        </form>

        {/* Grid de fósiles */}
        {cargando ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: "var(--bg-card)", borderRadius: "var(--radius)", height: "320px",
                border: "1px solid var(--border)", animation: "pulse 1.5s infinite"
              }} />
            ))}
          </div>
        ) : fosiles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: "16px" }}>No se encontraron fósiles con esos filtros</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              <AnimatePresence>
                {fosiles.map((fosil, i) => (
                  <motion.div
                    key={fosil.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/fosil/${fosil.id}`}>
                      <motion.div
                        whileHover={{ y: -4, borderColor: "var(--accent)" }}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                          overflow: "hidden",
                          transition: "border-color 0.3s",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{
                          height: "180px",
                          background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative"
                        }}>
                          {fosil.imagenes && fosil.imagenes.length > 0 ? (
                            <img
                              src={`http://localhost:3001/uploads/${fosil.imagenes[0].ruta}`}
                              alt={fosil.nombre}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <span style={{ fontSize: "48px", opacity: 0.3 }}>🦴</span>
                          )}
                          <span className={`badge badge-${fosil.categoria.toLowerCase()}`} style={{ position: "absolute", top: "10px", right: "10px" }}>
                            {categorias[fosil.categoria]}
                          </span>
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{fosil.nombre}</h3>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {fosil.descripcion}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <Clock size={12} /> {new Date(fosil.creadoEn).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Paginación */}
            {paginacion.totalPaginas > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="btn btn-secondary"
                  style={{ padding: "8px 12px", opacity: pagina === 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  Página {paginacion.pagina} de {paginacion.totalPaginas}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPagina(p => Math.min(paginacion.totalPaginas, p + 1))}
                  disabled={pagina === paginacion.totalPaginas}
                  className="btn btn-secondary"
                  style={{ padding: "8px 12px", opacity: pagina === paginacion.totalPaginas ? 0.5 : 1 }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}