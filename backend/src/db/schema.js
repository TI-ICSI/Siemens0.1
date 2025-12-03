import { pgTable, serial, varchar, integer, text, timestamp} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const inventarioGeneral = pgTable('inventarioGeneral',{
    id: serial('id').primaryKey(),
    mes: varchar('mes', { length: 50 }).notNull(),
    anio: integer('anio'), // Opcional: para mejor organización
    ubicacion: text('descripcion'),
    localidad:  varchar('ubicacion', { length: 100 }),

    // Campos de control
    total_equipos: integer('total_equipos').default(0), // Contador actualizado

    // Auditoría
    creado_por: integer('creado_por'), // ID del usuario que creó
    fecha_creacion: timestamp('fecha_creacion', { mode: 'date', precision: 6 }).defaultNow(),
    fecha_actualizacion: timestamp('fecha_actualizacion', { mode: 'date', precision: 6 }).$onUpdate(() => new Date()),

})