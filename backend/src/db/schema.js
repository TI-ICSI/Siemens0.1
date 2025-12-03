import { pgTable, serial, varchar, integer, text, timestamp} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const inventarioGeneral = pgTable('inventarioGeneral',{
    id: serial('id').primaryKey(),
    mes: varchar('mes', { length: 50 }).notNull(),
    anio: integer('anio'), // Opcional: para mejor organización
    ubicacion: text('ubicacion'),
    localidad:  varchar('localidad', { length: 100 }),

    // Campos de control
    total_equipos: integer('total_equipos').default(0), // Contador actualizado

    // Auditoría
    creado_por: integer('creado_por'), // ID del usuario que creó
    fecha_creacion: timestamp('fecha_creacion', { mode: 'date', precision: 6 }).defaultNow(),
    fecha_actualizacion: timestamp('fecha_actualizacion', { mode: 'date', precision: 6 }).$onUpdate(() => new Date()),

})

export const equiposInventario = pgTable('equipos_inventario',{
    id: serial('id').primaryKey(),
  
    // Relación con inventario principal (FOREIGN KEY)
    inventario_id: integer('inventario_id')
    .notNull()
    .references(() => inventarioGeneral.id, { onDelete: 'cascade' }), // Si borras inventario, se borran sus equipos

    // Datos específicos del equipo
    numero_serie: varchar('numero_serie', { length: 100 }).notNull().unique(),
    nota: varchar('nota', {length: 100}).notNull(),
    imagen_url: varchar('imagen_url', { length: 500 }),



})