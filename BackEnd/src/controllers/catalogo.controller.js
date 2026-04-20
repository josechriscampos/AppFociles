const prisma = require("../lib/prisma");

const provincias = async (req, res) => {
  try {
    const datos = await prisma.provincia.findMany({
      include: { cantones: true },
      orderBy: { nombre: "asc" }
    });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener provincias" });
  }
};

const eras = async (req, res) => {
  try {
    const datos = await prisma.eraGeologica.findMany({
      include: { periodos: true },
      orderBy: { nombre: "asc" }
    });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eras" });
  }
};

const taxonomias = async (req, res) => {
  try {
    const { nivel, padreId } = req.query;
    let where = {};

    if (nivel) where.nivel = nivel;
    if (padreId) where.padreId = parseInt(padreId);
    if (!padreId && nivel === "REINO") where.padreId = null;

    const datos = await prisma.taxonomia.findMany({
      where,
      orderBy: { nombre: "asc" }
    });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener taxonomías" });
  }
};

module.exports = { provincias, eras, taxonomias };