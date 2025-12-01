/*
  Warnings:

  - You are about to drop the column `animal_especie` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `animal_nombre` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `evidencia_imagen` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `latitud` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the `Alertas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `animal_id` to the `Reporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evidencia_id` to the `Reporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Reporte` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Alertas" DROP CONSTRAINT "Alertas_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reporte" DROP CONSTRAINT "Reporte_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_rolId_fkey";

-- AlterTable
ALTER TABLE "public"."Reporte" DROP COLUMN "animal_especie",
DROP COLUMN "animal_nombre",
DROP COLUMN "descripcion",
DROP COLUMN "evidencia_imagen",
DROP COLUMN "latitud",
DROP COLUMN "longitud",
DROP COLUMN "titulo",
DROP COLUMN "usuarioId",
ADD COLUMN     "animal_id" INTEGER NOT NULL,
ADD COLUMN     "evidencia_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "cantidadReportes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."Alertas";

-- DropTable
DROP TABLE "public"."Roles";

-- CreateTable
CREATE TABLE "public"."Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Departamento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "habitad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "imagen_url" TEXT NOT NULL,
    "video_url" TEXT,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evidencia" (
    "id" SERIAL NOT NULL,
    "descipcion" TEXT NOT NULL,
    "imagen_url" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "departamento_id" TEXT NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "imagen_url" TEXT,
    "user_id" INTEGER NOT NULL,
    "categoria" TEXT,
    "lugar" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento_Categhporia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Evento_Categhporia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "public"."Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "public"."Departamento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_Categhporia_nombre_key" ON "public"."Evento_Categhporia"("nombre");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "public"."Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "public"."Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reporte" ADD CONSTRAINT "Reporte_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reporte" ADD CONSTRAINT "Reporte_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reporte" ADD CONSTRAINT "Reporte_evidencia_id_fkey" FOREIGN KEY ("evidencia_id") REFERENCES "public"."Evidencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
