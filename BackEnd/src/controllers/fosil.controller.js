const prisma = require("../lib/prisma");

// LISTAR FÓSILES PÚBLICOS (solo publicados, con paginación)
const listarPublicos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 20;
    const salto = (pagina - 1) * limite;

    const [fosiles, total] = await Promise.all([
      prisma.fosil.findMany({
        where: { estado: "PUBLICADO", activo: true },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          categoria: true,
          creadoEn: true,
          imagenes: { where: { tipo: "GENERAL" }, take: 1 }
        },
        orderBy: { creadoEn: "desc" },
        skip: salto,
        take: limite
      }),
      prisma.fosil.count({ where: { estado: "PUBLICADO", activo: true } })
    ]);

    res.json({
      fosiles,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar fósiles" });
  }
};

// LISTAR TODOS (admin ve todo, explorador ve los suyos)
const listarTodos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 20;
    const salto = (pagina - 1) * limite;

    let where = { activo: true };

    if (req.usuario.rol === "EXPLORADOR") {
      where.exploradorId = req.usuario.id;
    }

    const [fosiles, total] = await Promise.all([
      prisma.fosil.findMany({
        where,
        include: {
          explorador: { select: { id: true, nombre: true } },
          canton: { include: { provincia: true } },
          imagenes: { take: 1 }
        },
        orderBy: { creadoEn: "desc" },
        skip: salto,
        take: limite
      }),
      prisma.fosil.count({ where })
    ]);

    res.json({
      fosiles,
      paginacion: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar fósiles" });
  }
};

// VER DETALLE (público ve básico, investigador ve todo)
const verDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const fosil = await prisma.fosil.findUnique({
      where: { id: parseInt(id) },
      include: {
        explorador: { select: { id: true, nombre: true } },
        revisor: { select: { id: true, nombre: true } },
        canton: { include: { provincia: true } },
        periodo: { include: { era: true } },
        taxonomia: true,
        imagenes: true,
        videos: true
      }
    });

    if (!fosil || !fosil.activo) {
      return res.status(404).json({ error: "Fósil no encontrado" });
    }

    res.json(fosil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener fósil" });
  }
};

// CREAR FÓSIL (explorador o admin)
const crear = async (req, res) => {
  try {
    const {
      nombre, descripcion, categoria, latitud, longitud,
      ubicacionTexto, contextoGeologico, estadoOriginal,
      composicion, estudioIntro, referencias, fechaHallazgo,
      quienEncontro, cantonId, periodoId, taxonomiaId
    } = req.body;

    if (!nombre || !descripcion || !categoria) {
      return res.status(400).json({ error: "Nombre, descripción y categoría son obligatorios" });
    }

    const fosil = await prisma.fosil.create({
      data: {
        nombre,
        descripcion,
        categoria,
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null,
        ubicacionTexto,
        contextoGeologico,
        estadoOriginal,
        composicion,
        estudioIntro,
        referencias,
        fechaHallazgo: fechaHallazgo ? new Date(fechaHallazgo) : null,
        quienEncontro,
        exploradorId: req.usuario.id,
        cantonId: cantonId ? parseInt(cantonId) : null,
        periodoId: periodoId ? parseInt(periodoId) : null,
        taxonomiaId: taxonomiaId ? parseInt(taxonomiaId) : null
      }
    });

    // Generar código único
    if (fosil.cantonId) {
      const canton = await prisma.canton.findUnique({
        where: { id: fosil.cantonId },
        include: { provincia: true }
      });

      if (canton) {
        const codigo = `CRI-${canton.provincia.codigo}-${canton.codigo}-${categoria}-${String(fosil.id).padStart(5, "0")}`;
        await prisma.fosil.update({
          where: { id: fosil.id },
          data: { codigo }
        });
        fosil.codigo = codigo;
      }
    }

    // Guardar imágenes si vinieron archivos
    if (req.files && req.files.length > 0) {
      for (const archivo of req.files) {
        await prisma.imagen.create({
          data: {
            ruta: archivo.filename,
            tipo: req.body.tipoImagen || "GENERAL",
            fosilId: fosil.id
          }
        });
      }
    }

    res.status(201).json({ mensaje: "Fósil registrado", fosil });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear fósil" });
  }
};

// EDITAR FÓSIL
const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const fosilExistente = await prisma.fosil.findUnique({ where: { id: parseInt(id) } });

    if (!fosilExistente || !fosilExistente.activo) {
      return res.status(404).json({ error: "Fósil no encontrado" });
    }

    if (req.usuario.rol === "EXPLORADOR" && fosilExistente.exploradorId !== req.usuario.id) {
      return res.status(403).json({ error: "Solo podés editar tus propios fósiles" });
    }

    const {
      nombre, descripcion, categoria, latitud, longitud,
      ubicacionTexto, contextoGeologico, estadoOriginal,
      composicion, estudioIntro, referencias, fechaHallazgo,
      quienEncontro, cantonId, periodoId, taxonomiaId
    } = req.body;

    const fosil = await prisma.fosil.update({
      where: { id: parseInt(id) },
      data: {
        nombre, descripcion, categoria,
        latitud: latitud ? parseFloat(latitud) : undefined,
        longitud: longitud ? parseFloat(longitud) : undefined,
        ubicacionTexto, contextoGeologico, estadoOriginal,
        composicion, estudioIntro, referencias,
        fechaHallazgo: fechaHallazgo ? new Date(fechaHallazgo) : undefined,
        quienEncontro,
        cantonId: cantonId ? parseInt(cantonId) : undefined,
        periodoId: periodoId ? parseInt(periodoId) : undefined,
        taxonomiaId: taxonomiaId ? parseInt(taxonomiaId) : undefined
      }
    });

    res.json({ mensaje: "Fósil actualizado", fosil });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar fósil" });
  }
};

// APROBAR O RECHAZAR (solo admin)
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!["PUBLICADO", "RECHAZADO"].includes(estado)) {
      return res.status(400).json({ error: "Estado debe ser PUBLICADO o RECHAZADO" });
    }

    const fosil = await prisma.fosil.update({
      where: { id: parseInt(id) },
      data: {
        estado,
        revisorId: req.usuario.id
      }
    });

    res.json({ mensaje: `Fósil ${estado.toLowerCase()}`, fosil });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar estado" });
  }
};

// SOFT DELETE (solo admin)
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.fosil.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    });

    res.json({ mensaje: "Fósil eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar fósil" });
  }
};

// BÚSQUEDA CON FILTROS
const buscar = async (req, res) => {
  try {
    const { nombre, categoria, eraId, periodoId, cantonId, provinciaId } = req.query;
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 20;
    const salto = (pagina - 1) * limite;

    let where = { estado: "PUBLICADO", activo: true };

    if (nombre) {
      where.nombre = { contains: nombre, mode: "insensitive" };
    }
    if (categoria) {
      where.categoria = categoria;
    }
    if (periodoId) {
      where.periodoId = parseInt(periodoId);
    }
    if (eraId) {
      where.periodo = { eraId: parseInt(eraId) };
    }
    if (cantonId) {
      where.cantonId = parseInt(cantonId);
    }
    if (provinciaId) {
      where.canton = { provinciaId: parseInt(provinciaId) };
    }

    const [fosiles, total] = await Promise.all([
      prisma.fosil.findMany({
        where,
        include: {
          canton: { include: { provincia: true } },
          periodo: { include: { era: true } },
          imagenes: { where: { tipo: "GENERAL" }, take: 1 }
        },
        orderBy: { creadoEn: "desc" },
        skip: salto,
        take: limite
      }),
      prisma.fosil.count({ where })
    ]);

    res.json({
      fosiles,
      paginacion: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la búsqueda" });
  }
};

module.exports = {
  listarPublicos, listarTodos, verDetalle,
  crear, editar, cambiarEstado, eliminar, buscar
};