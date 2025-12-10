import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Nueva tabla para el inventario de netbooks
export const inventory = sqliteTable('inventario', { // Cambiado a 'inventario' para consistencia
  id: integer('id').primaryKey({ autoIncrement: true }),
  descripcion: text('descripcion').notNull(),
  marca: text('marca').notNull(),
  modelo: text('modelo').notNull(),
  numeroSerie: text('numero_serie').notNull().unique(),
  status: text('status', { enum: ['Disponible', 'Prestado', 'En Mantenimiento'] }).notNull().default('Disponible'),
});

export const records = sqliteTable('records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: text('timestamp').notNull().default(new Date().toISOString()),
  fechaRetiro: text('fecha_retiro').notNull(),
  horaRetiro: text('hora_retiro').notNull(),
  nombreAlumno: text('nombre_alumno').notNull(),
  curso: text('curso').notNull(),
  modeloNetbook: text('modelo_netbook').notNull(),
  descripcionNetbook: text('descripcion_netbook'),
  estado: text('estado', { enum: ['Prestado', 'Devuelto'] }).notNull().default('Prestado'),
  fechaDevolucion: text('fecha_devolucion'),
  horaDevolucion: text('hora_devolucion'),
  observaciones: text('observaciones'),
  inventoryId: integer('inventory_id').references(() => inventory.id),
});
