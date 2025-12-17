'use server';

import { z } from 'zod';
import { db } from '../db';
import { inventory, records } from '../schema';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

// Esquema de validación para el formulario de préstamo
const LoanSchema = z.object({
  studentName: z.string().min(3, 'El nombre del alumno es obligatorio.'),
  course: z.string().min(1, 'El curso es obligatorio.'),
  computerId: z.coerce.number().gt(0, 'Debes seleccionar una computadora.'),
  // Validamos que la fecha y hora sean un string no vacío
  fecha_retiro: z.string().min(1, 'La fecha y hora de retiro son obligatorias.'),
  descripcion: z.string().optional(), // El campo es opcional
});

export async function createLoan(prevState: any, formData: FormData) {
  const validatedFields = LoanSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el préstamo.',
    };
  }

  const { studentName, course, computerId, fecha_retiro, descripcion } = validatedFields.data;

  try {
    // Usamos una transacción para asegurar que ambas operaciones se completen con éxito.
    await db.transaction(async (tx) => {
      // 1. Insertar el nuevo registro de préstamo con la fecha del formulario
      await tx.insert(records).values({
        studentName: `${studentName} - ${course}`, // Guardamos nombre y curso juntos
        computerId,
        fecha_retiro: new Date(fecha_retiro),
        descripcion: descripcion, // Guardamos la descripción
      });

      // 2. Actualizar el estado de la computadora a "Prestado"
      await tx.update(inventory)
        .set({ status: 'Prestado' })
        .where(eq(inventory.id, computerId));
    });
  } catch (e) {
    console.error(e);
    return { message: 'Error de base de datos: No se pudo registrar el préstamo.' };
  }

  // Redirigimos al dashboard para confirmar que la operación fue exitosa.
  redirect('/dashboard');
}