const express = require("express");
const router = express.Router();
const catalogoController = require("../controllers/catalogo.controller");

// Todas públicas (para llenar dropdowns)
router.get("/provincias", catalogoController.provincias);
router.get("/eras", catalogoController.eras);
router.get("/taxonomias", catalogoController.taxonomias);

module.exports = router;