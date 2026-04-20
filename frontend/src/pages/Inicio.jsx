import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bone, Globe, Shield, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6 }
  })
};

export default function Inicio() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "80px 20px", textAlign: "center", background: "linear-gradient(180deg, var(--primary-dark) 0%, var(--bg-main) 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--bg-card)", padding: "6px 16px", borderRadius: "20px", marginBottom: "24px", border: "1px solid var(--border)" }}>
            <Bone size={14} color="var(--accent)" />
            <span style={{ fontSize: "13px", color: "var(--accent)" }}>Centro de Investigación Paleontológica</span>
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: 700, lineHeight: 1.2, marginBottom: "16px" }}>
            Descubrí el pasado<br />
            <span style={{ color: "var(--accent)" }}>de Costa Rica</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 32px" }}>
            Explorá nuestra colección de fósiles, minerales y rocas. Un viaje a través de millones de años de historia natural.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/catalogo">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Search size={18} /> Explorar catálogo
              </motion.button>
            </Link>
            <Link to="/contacto">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "16px" }}>
                Contactanos
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: "60px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
          {[
            { icon: <Bone size={28} />, titulo: "Catálogo digital", desc: "Más de cientos de fósiles catalogados con información científica detallada y fotografías de alta calidad." },
            { icon: <Globe size={28} />, titulo: "Mapa interactivo", desc: "Visualizá en un mapa la ubicación exacta donde se descubrió cada fósil en territorio costarricense." },
            { icon: <Users size={28} />, titulo: "Colaboración", desc: "Investigadores y exploradores trabajan juntos para documentar y preservar el patrimonio paleontológico." },
            { icon: <Shield size={28} />, titulo: "Datos verificados", desc: "Cada hallazgo pasa por un proceso de revisión antes de ser publicado en el catálogo." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "28px",
                transition: "border-color 0.3s"
              }}
              whileHover={{ borderColor: "var(--accent)" }}
            >
              <div style={{ color: "var(--accent)", marginBottom: "16px" }}>{feat.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>{feat.titulo}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="container" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "12px" }}>¿Encontraste un fósil?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Registrate como explorador y ayudá a documentar el patrimonio natural de Costa Rica.</p>
          <Link to="/login">
            <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "15px" }}>
              Crear cuenta
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          © 2026 FosilCR — Sistema de Catalogación de Fósiles — UNADECA
        </p>
      </footer>
    </div>
  );
}