const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

// LISTAR USUARIOS (admin)
const listar = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { activo: true },
      select: {
        id: true,
        email: true,
        nombre: true,
        pais: true,
        profesion: true,
        telefono: true,
        centro: true,
        rol: true,
        creadoEn: true
      },
      orderBy: { creadoEn: "desc" }
    });

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

// VER UN USUARIO
const verPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        nombre: true,
        pais: true,
        profesion: true,
        telefono: true,
        centro: true,
        rol: true,
        creadoEn: true,
        fosilesRegistrados: {
          select: { id: true, nombre: true, estado: true, creadoEn: true },
          orderBy: { creadoEn: "desc" }
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// CAMBIAR ROL (admin)
const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!["INVESTIGADOR", "EXPLORADOR", "ADMIN"].includes(rol)) {
      return res.status(400).json({ error: "Rol no válido" });
    }

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { rol },
      select: { id: true, email: true, nombre: true, rol: true }
    });

    res.json({ mensaje: "Rol actualizado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar rol" });
  }
};

// EDITAR PERFIL (el propio usuario)
const editarPerfil = async (req, res) => {
  try {
    const { nombre, pais, profesion, telefono, centro } = req.body;

    const usuario = await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { nombre, pais, profesion, telefono, centro },
      select: {
        id: true,
        email: true,
        nombre: true,
        pais: true,
        profesion: true,
        telefono: true,
        centro: true,
        rol: true
      }
    });

    res.json({ mensaje: "Perfil actualizado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar perfil" });
  }
};

// CAMBIAR CONTRASEÑA (el propio usuario)
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ error: "Ambas contraseñas son obligatorias" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id }
    });

    const esCorrecta = await bcrypt.compare(passwordActual, usuario.password);
    if (!esCorrecta) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

    const hash = await bcrypt.hash(passwordNueva, 10);
    await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { password: hash }
    });

    res.json({ mensaje: "Contraseña actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
};

// DESACTIVAR USUARIO - soft delete (admin)
const desactivar = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({ error: "No podés desactivar tu propia cuenta" });
    }

    await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    });

    res.json({ mensaje: "Usuario desactivado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar usuario" });
  }
};

module.exports = { listar, verPorId, cambiarRol, editarPerfil, cambiarPassword, desactivar };