const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Sembrando datos...");

  // ============================================
  // USUARIOS
  // ============================================
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@fosiles.com" },
    update: {},
    create: { email: "admin@fosiles.com", password: passwordHash, nombre: "Administrador General", rol: "ADMIN" }
  });

  const investigador1 = await prisma.usuario.upsert({
    where: { email: "maria@fosiles.com" },
    update: {},
    create: { email: "maria@fosiles.com", password: passwordHash, nombre: "María López", rol: "INVESTIGADOR", pais: "Costa Rica", profesion: "Paleontóloga", centro: "UCR" }
  });

  const investigador2 = await prisma.usuario.upsert({
    where: { email: "carlos@fosiles.com" },
    update: {},
    create: { email: "carlos@fosiles.com", password: passwordHash, nombre: "Carlos Ramírez", rol: "INVESTIGADOR", pais: "Costa Rica", profesion: "Geólogo", centro: "UNA" }
  });

  const explorador1 = await prisma.usuario.upsert({
    where: { email: "ana@fosiles.com" },
    update: {},
    create: { email: "ana@fosiles.com", password: passwordHash, nombre: "Ana Jiménez", rol: "EXPLORADOR", pais: "Costa Rica" }
  });

  const explorador2 = await prisma.usuario.upsert({
    where: { email: "pedro@fosiles.com" },
    update: {},
    create: { email: "pedro@fosiles.com", password: passwordHash, nombre: "Pedro Mora", rol: "EXPLORADOR", pais: "Costa Rica" }
  });

  const explorador3 = await prisma.usuario.upsert({
    where: { email: "laura@fosiles.com" },
    update: {},
    create: { email: "laura@fosiles.com", password: passwordHash, nombre: "Laura Solano", rol: "EXPLORADOR", pais: "Costa Rica" }
  });

  const investigador3 = await prisma.usuario.upsert({
    where: { email: "jose@fosiles.com" },
    update: {},
    create: { email: "jose@fosiles.com", password: passwordHash, nombre: "José Hernández", rol: "INVESTIGADOR", pais: "Panamá", profesion: "Biólogo", centro: "UNACHI" }
  });

  const investigador4 = await prisma.usuario.upsert({
    where: { email: "sofia@fosiles.com" },
    update: {},
    create: { email: "sofia@fosiles.com", password: passwordHash, nombre: "Sofía Vargas", rol: "INVESTIGADOR", pais: "Costa Rica", profesion: "Arqueóloga", centro: "UNED" }
  });

  const explorador4 = await prisma.usuario.upsert({
    where: { email: "diego@fosiles.com" },
    update: {},
    create: { email: "diego@fosiles.com", password: passwordHash, nombre: "Diego Castro", rol: "EXPLORADOR", pais: "Costa Rica" }
  });

  const admin2 = await prisma.usuario.upsert({
    where: { email: "admin2@fosiles.com" },
    update: {},
    create: { email: "admin2@fosiles.com", password: passwordHash, nombre: "Roberto Admin", rol: "ADMIN" }
  });

  const investigador5 = await prisma.usuario.upsert({
    where: { email: "elena@fosiles.com" },
    update: {},
    create: { email: "elena@fosiles.com", password: passwordHash, nombre: "Elena Rojas", rol: "INVESTIGADOR", pais: "México", profesion: "Paleobotánica", centro: "UNAM" }
  });

  const explorador5 = await prisma.usuario.upsert({
    where: { email: "marco@fosiles.com" },
    update: {},
    create: { email: "marco@fosiles.com", password: passwordHash, nombre: "Marco Ureña", rol: "EXPLORADOR", pais: "Costa Rica" }
  });

  const investigador6 = await prisma.usuario.upsert({
    where: { email: "lucia@fosiles.com" },
    update: {},
    create: { email: "lucia@fosiles.com", password: passwordHash, nombre: "Lucía Cordero", rol: "INVESTIGADOR", pais: "Costa Rica", profesion: "Geóloga", centro: "TEC" }
  });

  const explorador6 = await prisma.usuario.upsert({
    where: { email: "andres@fosiles.com" },
    update: {},
    create: { email: "andres@fosiles.com", password: passwordHash, nombre: "Andrés Brenes", rol: "EXPLORADOR", pais: "Costa Rica" }
  });

  const investigador7 = await prisma.usuario.upsert({
    where: { email: "paula@fosiles.com" },
    update: {},
    create: { email: "paula@fosiles.com", password: passwordHash, nombre: "Paula Chaves", rol: "INVESTIGADOR", pais: "Costa Rica", profesion: "Mineralogista", centro: "UCR" }
  });

  console.log("Usuarios creados: 15");

  // ============================================
  // PROVINCIAS Y CANTONES
  // ============================================
  const provinciasData = [
    { nombre: "San José", codigo: "SJO", cantones: [
      { nombre: "San José", codigo: "SJO" }, { nombre: "Desamparados", codigo: "DES" }, { nombre: "Pérez Zeledón", codigo: "PZE" }
    ]},
    { nombre: "Alajuela", codigo: "ALA", cantones: [
      { nombre: "Alajuela", codigo: "ALA" }, { nombre: "San Ramón", codigo: "SRM" }, { nombre: "Grecia", codigo: "GRE" }, { nombre: "San Carlos", codigo: "SCA" }
    ]},
    { nombre: "Cartago", codigo: "CAR", cantones: [
      { nombre: "Cartago", codigo: "CAR" }, { nombre: "Turrialba", codigo: "TUR" }
    ]},
    { nombre: "Heredia", codigo: "HER", cantones: [
      { nombre: "Heredia", codigo: "HER" }, { nombre: "Barva", codigo: "BAR" }
    ]},
    { nombre: "Guanacaste", codigo: "GUA", cantones: [
      { nombre: "Liberia", codigo: "LIB" }, { nombre: "Nicoya", codigo: "NIC" }, { nombre: "Santa Cruz", codigo: "SCR" }
    ]},
    { nombre: "Puntarenas", codigo: "PUN", cantones: [
      { nombre: "Puntarenas", codigo: "PUN" }, { nombre: "Esparza", codigo: "ESP" }, { nombre: "Osa", codigo: "OSA" }
    ]},
    { nombre: "Limón", codigo: "LIM", cantones: [
      { nombre: "Limón", codigo: "LIM" }, { nombre: "Talamanca", codigo: "TAL" }
    ]}
  ];

  const cantonesCreados = {};

  for (const prov of provinciasData) {
    const provincia = await prisma.provincia.upsert({
      where: { codigo: prov.codigo },
      update: {},
      create: { nombre: prov.nombre, codigo: prov.codigo }
    });

    for (const cant of prov.cantones) {
      const canton = await prisma.canton.upsert({
        where: { codigo: cant.codigo },
        update: {},
        create: { nombre: cant.nombre, codigo: cant.codigo, provinciaId: provincia.id }
      });
      cantonesCreados[cant.codigo] = canton;
    }
  }

  console.log("Provincias creadas: 7 | Cantones creados: " + Object.keys(cantonesCreados).length);

  // ============================================
  // ERAS Y PERÍODOS GEOLÓGICOS
  // ============================================
  const erasData = [
    { nombre: "Paleozoico", periodos: ["Cámbrico", "Ordovícico", "Silúrico", "Devónico", "Carbonífero", "Pérmico"] },
    { nombre: "Mesozoico", periodos: ["Triásico", "Jurásico", "Cretácico"] },
    { nombre: "Cenozoico", periodos: ["Paleógeno", "Neógeno", "Cuaternario"] }
  ];

  const periodosCreados = {};

  for (const eraData of erasData) {
    const era = await prisma.eraGeologica.upsert({
      where: { nombre: eraData.nombre },
      update: {},
      create: { nombre: eraData.nombre }
    });

    for (const periodoNombre of eraData.periodos) {
      const periodo = await prisma.periodoGeologico.upsert({
        where: { nombre: periodoNombre },
        update: {},
        create: { nombre: periodoNombre, eraId: era.id }
      });
      periodosCreados[periodoNombre] = periodo;
    }
  }

  console.log("Eras creadas: 3 | Períodos creados: " + Object.keys(periodosCreados).length);

  // ============================================
  // TAXONOMÍAS
  // ============================================
  async function crearTaxonomia(nombre, nivel, padreId) {
    return prisma.taxonomia.upsert({
      where: { nombre_nivel: { nombre, nivel } },
      update: {},
      create: { nombre, nivel, padreId }
    });
  }

  // Cadena 1: T-Rex
  const animalia = await crearTaxonomia("Animalia", "REINO", null);
  const chordata = await crearTaxonomia("Chordata", "FILO", animalia.id);
  const reptilia = await crearTaxonomia("Reptilia", "CLASE", chordata.id);
  const saurischia = await crearTaxonomia("Saurischia", "ORDEN", reptilia.id);
  const tyrannosauridae = await crearTaxonomia("Tyrannosauridae", "FAMILIA", saurischia.id);
  const tyrannosaurus = await crearTaxonomia("Tyrannosaurus", "GENERO", tyrannosauridae.id);
  const trex = await crearTaxonomia("Tyrannosaurus rex", "ESPECIE", tyrannosaurus.id);

  // Cadena 2: Helecho fósil
  const plantae = await crearTaxonomia("Plantae", "REINO", null);
  const pteridophyta = await crearTaxonomia("Pteridophyta", "FILO", plantae.id);
  const polypodiopsida = await crearTaxonomia("Polypodiopsida", "CLASE", pteridophyta.id);
  const polypodiales = await crearTaxonomia("Polypodiales", "ORDEN", polypodiopsida.id);
  const polypodiaceae = await crearTaxonomia("Polypodiaceae", "FAMILIA", polypodiales.id);
  const polypodium = await crearTaxonomia("Polypodium", "GENERO", polypodiaceae.id);
  const pvulgare = await crearTaxonomia("Polypodium vulgare", "ESPECIE", polypodium.id);

  // Extra para llegar a 15+
  const mammalia = await crearTaxonomia("Mammalia", "CLASE", chordata.id);

  console.log("Taxonomías creadas: 16");

  // ============================================
  // FÓSILES
  // ============================================
  const fosilesData = [
    { nombre: "Diente de T-Rex", descripcion: "Diente fosilizado de Tyrannosaurus Rex encontrado en excelente estado de conservación", categoria: "PAL", cantonCod: "SRM", periodo: "Cretácico", taxonomiaId: trex.id, explorador: explorador1 },
    { nombre: "Helecho Pétreo", descripcion: "Impresión de helecho fósil en roca sedimentaria del período Carbonífero", categoria: "FOS", cantonCod: "TUR", periodo: "Carbonífero", taxonomiaId: pvulgare.id, explorador: explorador2 },
    { nombre: "Amonita de Nicoya", descripcion: "Caparazón espiralado de amonita encontrado en la península de Nicoya", categoria: "PAL", cantonCod: "NIC", periodo: "Jurásico", taxonomiaId: null, explorador: explorador1 },
    { nombre: "Cuarzo Cristalino", descripcion: "Formación de cristales de cuarzo con inclusiones minerales", categoria: "MIN", cantonCod: "CAR", periodo: "Cámbrico", taxonomiaId: null, explorador: explorador3 },
    { nombre: "Roca Volcánica Irazú", descripcion: "Muestra de basalto con vesículas del volcán Irazú", categoria: "ROC", cantonCod: "CAR", periodo: "Cuaternario", taxonomiaId: null, explorador: explorador2 },
    { nombre: "Trilobite Centroamericano", descripcion: "Fósil de trilobite encontrado en sedimentos marinos antiguos", categoria: "PAL", cantonCod: "OSA", periodo: "Ordovícico", taxonomiaId: null, explorador: explorador1 },
    { nombre: "Ámbar con Insecto", descripcion: "Pieza de ámbar con insecto preservado del período Neógeno", categoria: "FOS", cantonCod: "LIM", periodo: "Neógeno", taxonomiaId: null, explorador: explorador4 },
    { nombre: "Coral Fosilizado", descripcion: "Colonia de coral fosilizada encontrada en formación calcárea", categoria: "FOS", cantonCod: "SCR", periodo: "Cretácico", taxonomiaId: null, explorador: explorador3 },
    { nombre: "Pirita Dorada", descripcion: "Cristales cúbicos de pirita encontrados en veta mineral", categoria: "MIN", cantonCod: "SCA", periodo: "Devónico", taxonomiaId: null, explorador: explorador5 },
    { nombre: "Hueso Perezoso Gigante", descripcion: "Fragmento de fémur de megaterio encontrado en cueva", categoria: "PAL", cantonCod: "PZE", periodo: "Cuaternario", taxonomiaId: mammalia.id, explorador: explorador2 },
    { nombre: "Hoja Fosilizada", descripcion: "Impresión perfecta de hoja dicotiledónea en arenisca", categoria: "FOS", cantonCod: "GRE", periodo: "Paleógeno", taxonomiaId: plantae.id, explorador: explorador6 },
    { nombre: "Obsidiana Tallada", descripcion: "Fragmento de obsidiana con posibles marcas de uso humano", categoria: "ROC", cantonCod: "LIB", periodo: "Cuaternario", taxonomiaId: null, explorador: explorador1 },
    { nombre: "Diente de Tiburón", descripcion: "Diente fosilizado de megalodón encontrado en costa pacífica", categoria: "PAL", cantonCod: "PUN", periodo: "Neógeno", taxonomiaId: chordata.id, explorador: explorador4 },
    { nombre: "Calcita Espática", descripcion: "Cristales de calcita con forma romboédrica en geoda", categoria: "MIN", cantonCod: "HER", periodo: "Triásico", taxonomiaId: null, explorador: explorador5 },
    { nombre: "Gasterópodo Marino", descripcion: "Concha espiralada fosilizada de caracol marino prehistórico", categoria: "PAL", cantonCod: "TAL", periodo: "Jurásico", taxonomiaId: animalia.id, explorador: explorador6 }
  ];

  for (const f of fosilesData) {
    const canton = cantonesCreados[f.cantonCod];
    const periodo = periodosCreados[f.periodo];
    const provincia = await prisma.canton.findUnique({
      where: { id: canton.id },
      include: { provincia: true }
    });

    const fosil = await prisma.fosil.create({
      data: {
        nombre: f.nombre,
        descripcion: f.descripcion,
        categoria: f.categoria,
        estado: "PUBLICADO",
        latitud: 9.5 + Math.random() * 1.5,
        longitud: -84.5 + Math.random() * 2,
        exploradorId: f.explorador.id,
        revisorId: admin.id,
        cantonId: canton.id,
        periodoId: periodo.id,
        taxonomiaId: f.taxonomiaId
      }
    });

    const codigoFosil = `CRI-${provincia.provincia.codigo}-${canton.codigo}-${f.categoria}-${String(fosil.id).padStart(5, "0")}`;
    await prisma.fosil.update({
      where: { id: fosil.id },
      data: { codigo: codigoFosil }
    });
  }

  console.log("Fósiles creados: 15");

  // ============================================
  // CONTACTOS
  // ============================================
  const contactosData = [
    { nombre: "Juan Pérez", email: "juan@gmail.com", mensaje: "Me gustaría visitar el centro de investigación" },
    { nombre: "Lisa Chen", email: "lisa@university.edu", mensaje: "I'm interested in collaborating on paleontological research" },
    { nombre: "Roberto Arias", email: "roberto@hotmail.com", mensaje: "¿Tienen programa de voluntariado para exploración?" },
    { nombre: "Carmen Solís", email: "carmen@uned.cr", mensaje: "Quisiera información sobre los fósiles de Guanacaste" },
    { nombre: "Tom Wilson", email: "tom@museum.org", mensaje: "We'd like to discuss a fossil exchange program" },
    { nombre: "Andrea Mora", email: "andrea@gmail.com", mensaje: "Encontré lo que parece un fósil, ¿cómo puedo reportarlo?" },
    { nombre: "Miguel Fonseca", email: "miguel@tec.cr", mensaje: "Solicito acceso como investigador para mi tesis" },
    { nombre: "Sarah Brown", email: "sarah@geo.uk", mensaje: "Requesting information about geological formations in Costa Rica" },
    { nombre: "Pablo Vindas", email: "pablo@yahoo.com", mensaje: "¿Ofrecen tours educativos para escuelas?" },
    { nombre: "Isabel Torres", email: "isabel@ucr.cr", mensaje: "Interesada en las muestras minerales de la colección" },
    { nombre: "David Kim", email: "david@paleoresearch.com", mensaje: "Looking for collaboration on Mesozoic fossils" },
    { nombre: "Marta Chacón", email: "marta@gmail.com", mensaje: "Mi hijo encontró una roca rara, ¿pueden identificarla?" },
    { nombre: "Fernando Rojas", email: "fernando@una.cr", mensaje: "Propuesta de investigación conjunta sobre el Cenozoico" },
    { nombre: "Amy Zhang", email: "amy@stanford.edu", mensaje: "Interested in your amber collection for entomological study" },
    { nombre: "Ricardo Soto", email: "ricardo@outlook.com", mensaje: "¿Cuál es el horario de atención del centro?" }
  ];

  for (const c of contactosData) {
    await prisma.contacto.create({ data: c });
  }

  console.log("Contactos creados: 15");
  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });