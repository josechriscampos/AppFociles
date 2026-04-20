require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos de uploads (imágenes y videos)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({ mensaje: "API de Fósiles funcionando" });
});

// Aquí iremos agregando las rutas conforme las creemos
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/fosiles", require("./routes/fosil.routes"));
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/contacto", require("./routes/contacto.routes"));
app.use("/api/catalogo", require("./routes/catalogo.routes"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});