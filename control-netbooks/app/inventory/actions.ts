'use server';

import { db } from '../db';
import { inventory } from '../schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Define un esquema de validación con Zod
const ComputerSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es obligatoria.'),
  marca: z.string().min(1, 'La marca es obligatoria.'),
  modelo: z.string().min(1, 'El modelo es obligatorio.'),
  numeroSerie: z.string().min(1, 'El número de serie es obligatorio.'),
});

export async function addComputer(prevState: any, formData: FormData) {
  const validatedFields = ComputerSchema.safeParse(Object.fromEntries(formData.entries()));

  // Si la validación falla, devuelve los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(inventory).values({
      ...validatedFields.data,
      status: 'Disponible', // Por defecto, una nueva computadora está disponible
    });
  } catch (error) {
    return { message: 'Error de base de datos: No se pudo crear la computadora.' };
  }

  // redirect invalida el caché automáticamente, por lo que revalidatePath es redundante.
  redirect('/inventory');
}

// Esquema para la actualización, que incluye el estado
const UpdateComputerSchema = ComputerSchema.extend({
  status: z.enum(['Disponible', 'Prestado', 'En Mantenimiento']),
});

export async function updateComputer(computerId: number, prevState: any, formData: FormData) {
  const validatedFields = UpdateComputerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.update(inventory)
      .set(validatedFields.data)
      .where(eq(inventory.id, computerId));
  } catch (error) {
    return { message: 'Error de base de datos: No se pudo actualizar la computadora.' };
  }

  redirect('/inventory');
}

export async function deleteComputer(computerId: number) {
  // Es buena práctica envolver las operaciones de DB en un try/catch
  try {
    await db.delete(inventory).where(eq(inventory.id, computerId));
  } catch (error) {
    // En una app real, podrías registrar este error
    // y devolver un mensaje para que la UI lo muestre.
    return { message: 'Error de base de datos: No se pudo eliminar la computadora.' };
  }

  redirect('/inventory');
}

/**
 * Acción simplificada para la página de edición que no usa useFormState.
 */
export async function updateComputerSimple(computerId: number, formData: FormData) {
  const validatedFields = UpdateComputerSchema.safeParse(Object.fromEntries(formData.entries()));

  // En una app real, aquí devolveríamos un error para mostrarlo en la UI.
  // Por ahora, si la validación falla, simplemente no hacemos nada.
  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { message: "La validación falló." };
  }

  try {
    await db.update(inventory).set(validatedFields.data).where(eq(inventory.id, computerId));
  } catch (error) {
    return { message: 'Error de base de datos: No se pudo actualizar la computadora.' };
  }

  redirect('/inventory');
}