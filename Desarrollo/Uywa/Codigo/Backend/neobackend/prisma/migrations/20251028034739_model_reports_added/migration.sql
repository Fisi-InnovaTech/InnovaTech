-- CreateTable
CREATE TABLE "public"."Reporte" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "evidencia_imagen" TEXT,
    "animal_nombre" TEXT NOT NULL,
    "animal_especie" TEXT,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Reporte" ADD CONSTRAINT "Reporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
