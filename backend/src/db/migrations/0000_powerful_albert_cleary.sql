CREATE TABLE "equipos_inventario" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventario_id" integer NOT NULL,
	"numero_serie" varchar(100) NOT NULL,
	"nota" varchar(100) NOT NULL,
	"imagen_url" varchar(500),
	CONSTRAINT "equipos_inventario_numero_serie_unique" UNIQUE("numero_serie")
);
--> statement-breakpoint
CREATE TABLE "inventarioGeneral" (
	"id" serial PRIMARY KEY NOT NULL,
	"mes" varchar(50) NOT NULL,
	"anio" integer,
	"ubicacion" text,
	"localidad" varchar(100),
	"total_equipos" integer DEFAULT 0,
	"creado_por" integer,
	"fecha_creacion" timestamp (6) DEFAULT now(),
	"fecha_actualizacion" timestamp (6)
);
--> statement-breakpoint
ALTER TABLE "equipos_inventario" ADD CONSTRAINT "equipos_inventario_inventario_id_inventarioGeneral_id_fk" FOREIGN KEY ("inventario_id") REFERENCES "public"."inventarioGeneral"("id") ON DELETE cascade ON UPDATE no action;