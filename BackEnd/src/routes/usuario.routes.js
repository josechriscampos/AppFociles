const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const { verificarToken, verificarRol } = require("../middlewares/auth.middleware");

// Perfil propio (cualquier usuario autenticado)
router.put("/perfil", verificarToken, usuarioController.editarPerfil);
router.patch("/password", verificarToken, usuarioController.cambiarPassword);

// Admin
router.get("/", verificarToken, verificarRol("ADMIN"), usuarioController.listar);
router.get("/:id", verificarToken, verificarRol("ADMIN"), usuarioController.verPorId);
router.patch("/:id/rol", verificarToken, verificarRol("ADMIN"), usuarioController.cambiarRol);
router.delete("/:id", verificarToken, verificarRol("ADMIN"), usuarioController.desactivar);

module.exports = router;