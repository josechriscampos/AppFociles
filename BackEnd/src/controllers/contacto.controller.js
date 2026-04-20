const prisma = require("../lib/prisma");

// ENVIAR MENSAJE (público, sin login)
const enviar = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: "Nombre, email y mensaje son obligatorios" });
    }

    const contacto = await prisma.contacto.create({
      data: { nombre, email, mensaje }
    });

    res.status(201).json({ mensaje: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
};

// LISTAR MENSAJES (solo admin)
const listar = async (req, res) => {
  try {
    const mensajes = await prisma.contacto.findMany({
      orderBy: { creadoEn: "desc" }
    });

    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar mensajes" });
  }
};

module.exports = { enviar, listar };