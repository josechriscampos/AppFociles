-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('INVESTIGADOR', 'EXPLORADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoFosil" AS ENUM ('PENDIENTE', 'PUBLICADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "CategoriaFosil" AS ENUM ('FOS', 'MIN', 'ROC', 'PAL');

-- CreateEnum
CREATE TYPE "TipoImagen" AS ENUM ('ANTES_EXTRACCION', 'DESPUES_LIMPIEZA', 'ANALISIS', 'GENERAL');

-- CreateEnum
CREATE TYPE "NivelTaxonomico" AS ENUM ('REINO', 'FILO', 'CLASE', 'ORDEN', 'FAMILIA', 'GENERO', 'ESPECIE');

-- CreateTable
CREATE TABLE "provincias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cantones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "cantones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eras_geologicas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "eras_geologicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodos_geologicos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "eraId" INTEGER NOT NULL,

    CONSTRAINT "periodos_geologicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" "NivelTaxonomico" NOT NULL,
    "padreId" INTEGER,

    CONSTRAINT "taxonomias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "pais" TEXT,
    "profesion" TEXT,
    "telefono" TEXT,
    "centro" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'INVESTIGADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fosiles" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" "CategoriaFosil" NOT NULL,
    "estado" "EstadoFosil" NOT NULL DEFAULT 'PENDIENTE',
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "ubicacionTexto" TEXT,
    "contextoGeologico" TEXT,
    "estadoOriginal" TEXT,
    "composicion" TEXT,
    "estudioIntro" TEXT,
    "referencias" TEXT,
    "fechaHallazgo" TIMESTAMP(3),
    "quienEncontro" TEXT,
    "exploradorId" INTEGER NOT NULL,
    "revisorId" INTEGER,
    "cantonId" INTEGER,
    "periodoId" INTEGER,
    "taxonomiaId" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fosiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes" (
    "id" SERIAL NOT NULL,
    "ruta" TEXT NOT NULL,
    "tipo" "TipoImagen" NOT NULL DEFAULT 'GENERAL',
    "angulo" TEXT,
    "fosilId" INTEGER NOT NULL,

    CONSTRAINT "imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "ruta" TEXT NOT NULL,
    "descripcion" TEXT,
    "fosilId" INTEGER NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provincias_codigo_key" ON "provincias"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cantones_codigo_key" ON "cantones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "eras_geologicas_nombre_key" ON "eras_geologicas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "periodos_geologicos_nombre_key" ON "periodos_geologicos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomias_nombre_nivel_key" ON "taxonomias"("nombre", "nivel");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fosiles_codigo_key" ON "fosiles"("codigo");

-- AddForeignKey
ALTER TABLE "cantones" ADD CONSTRAINT "cantones_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodos_geologicos" ADD CONSTRAINT "periodos_geologicos_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "eras_geologicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxonomias" ADD CONSTRAINT "taxonomias_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "taxonomias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosiles" ADD CONSTRAINT "fosiles_exploradorId_fkey" FOREIGN KEY ("exploradorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosiles" ADD CONSTRAINT "fosiles_revisorId_fkey" FOREIGN KEY ("revisorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosiles" ADD CONSTRAINT "fosiles_cantonId_fkey" FOREIGN KEY ("cantonId") REFERENCES "cantones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosiles" ADD CONSTRAINT "fosiles_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodos_geologicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosiles" ADD CONSTRAINT "fosiles_taxonomiaId_fkey" FOREIGN KEY ("taxonomiaId") REFERENCES "taxonomias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes" ADD CONSTRAINT "imagenes_fosilId_fkey" FOREIGN KEY ("fosilId") REFERENCES "fosiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_fosilId_fkey" FOREIGN KEY ("fosilId") REFERENCES "fosiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
