const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contacto.controller");
const { verificarToken, verificarRol } = require("../middlewares/auth.middleware");

// Público
router.post("/", contactoController.enviar);

// Admin
router.get("/", verificarToken, verificarRol("ADMIN"), contactoController.listar);

module.exports = router;