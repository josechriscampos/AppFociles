const express = require("express");
const router = express.Router();
const fosilController = require("../controllers/fosil.controller");
const { verificarToken, verificarRol } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// PÚBLICAS
router.get("/publicos", fosilController.listarPublicos);
router.get("/buscar", fosilController.buscar);
router.get("/:id", fosilController.verDetalle);

// PROTEGIDAS (requieren login)
router.get("/",
  verificarToken,
  verificarRol("EXPLORADOR", "ADMIN"),
  fosilController.listarTodos
);

router.post("/",
  verificarToken,
  verificarRol("EXPLORADOR", "ADMIN"),
  upload.array("imagenes", 10),
  fosilController.crear
);

router.put("/:id",
  verificarToken,
  verificarRol("EXPLORADOR", "ADMIN"),
  fosilController.editar
);

router.patch("/:id/estado",
  verificarToken,
  verificarRol("ADMIN"),
  fosilController.cambiarEstado
);

router.delete("/:id",
  verificarToken,
  verificarRol("ADMIN"),
  fosilController.eliminar
);

module.exports = router;