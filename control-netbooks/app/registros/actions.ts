"use server";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '../db';
import { inventory, records } from '../schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const LoanSchema = z.object({
  nombreAlumno: z.string().min(1, 'El nombre del alumno es requerido'),
  curso: z.string().min(1, 'El curso es requerido'),
  fechaRetiro: z.string().min(1, 'La fecha de retiro es requerida'),
  inventoryId: z.coerce.number().min(1, 'Debe seleccionar una netbook'),
  descripcion: z.string().optional(),
});

export async function createLoan(prevState: any, formData: FormData) {
  const validatedFields = LoanSchema.safeParse({
    nombreAlumno: formData.get('nombreAlumno'),
    curso: formData.get('course'), // 'course' from the form
    fechaRetiro: formData.get('fechaRetiro'),
    inventoryId: formData.get('inventoryId'),
    descripcion: formData.get('descripcion'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error de validación',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { nombreAlumno, curso, fechaRetiro, inventoryId, descripcion } = validatedFields.data;
  const [fecha, hora] = fechaRetiro.split('T');

  try {
    const netbook = await db.query.inventory.findFirst({
      where: eq(inventory.id, inventoryId),
    });

    if (!netbook) {
      return { message: 'La netbook no fue encontrada en el inventario.' };
    }

    if (netbook.status !== 'Disponible') {
        return { message: 'La netbook no está disponible.' };
    }

    const result = await db.transaction((tx) => {
        const insertResult = tx.insert(records).values({
            nombreAlumno,
            curso,
            modeloNetbook: netbook.modelo,
            descripcionNetbook: netbook.descripcion,
            fechaRetiro: fecha,
            horaRetiro: hora,
            inventoryId: netbook.id,
            observaciones: descripcion
        }).run();

        tx.update(inventory)
            .set({ status: 'Prestado' })
            .where(eq(inventory.id, inventoryId)).run();
        
        return insertResult;
    });

    const newId = result.lastInsertRowid;

    revalidatePath('/registros');
    revalidatePath('/registros/historial');
    revalidatePath('/dashboard');
    
    redirect('/registros/historial');
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error al registrar el préstamo:', error);
    return {
      message: 'Error de base de datos: No se pudo registrar el préstamo.',
    };
  }
}

export async function deleteLoan(id: number) {
  try {
    const record = await db.query.records.findFirst({
      where: eq(records.id, id),
    });

    if (!record || !record.inventoryId) {
      throw new Error('Registro o inventoryId no encontrado.');
    }

    await db.transaction((tx) => {
      tx.delete(records).where(eq(records.id, id)).run();

      tx.update(inventory)
        .set({ status: 'Disponible' })
        .where(eq(inventory.id, record.inventoryId)).run();
    });

    revalidatePath('/registros/historial');
    revalidatePath('/dashboard');
    return { message: 'Préstamo eliminado exitosamente.' };
  } catch (error) {
    console.error('Error al eliminar el préstamo:', error);
    return { error: 'Error de base de datos: No se pudo eliminar el préstamo.' };
  }
}

export async function returnLoan(id: number) {
    try {
      const record = await db.query.records.findFirst({
        where: eq(records.id, id),
      });
  
      if (!record || !record.inventoryId) {
        throw new Error('Registro no encontrado.');
      }

      const now = new Date();
      const fechaDevolucion = now.toISOString().split('T')[0];
      const horaDevolucion = now.toTimeString().split(' ')[0];
  
      await db.transaction((tx) => {
        tx.update(records)
          .set({ estado: 'Devuelto', fechaDevolucion: fechaDevolucion, horaDevolucion: horaDevolucion })
          .where(eq(records.id, id)).run();
  
        tx.update(inventory)
          .set({ status: 'Disponible' })
          .where(eq(inventory.id, record.inventoryId)).run();
      });
  
      revalidatePath('/registros/historial');
      revalidatePath('/dashboard');
      return { message: 'Préstamo marcado como devuelto exitosamente.' };
    } catch (error) {
      console.error('Error al devolver el préstamo:', error);
      return { error: 'Error de base de datos: No se pudo marcar el préstamo como devuelto.' };
    }
  }

const UpdateLoanSchema = z.object({
  nombreAlumno: z.string().min(1, 'El nombre es requerido'),
  curso: z.string().min(1, 'El curso es requerido'),
  modeloNetbook: z.string().min(1, 'El modelo es requerido'),
  fechaRetiro: z.string().min(1, 'La fecha es requerida'),
  horaRetiro: z.string().min(1, 'La hora es requerida'),
});

export async function updateLoan(id: number, formData: FormData) {
  const validatedFields = UpdateLoanSchema.safeParse({
    nombreAlumno: formData.get('nombreAlumno'),
    curso: formData.get('curso'),
    modeloNetbook: formData.get('modeloNetbook'),
    fechaRetiro: formData.get('fechaRetiro'),
    horaRetiro: formData.get('horaRetiro'),
  });

  if (!validatedFields.success) {
    // Aquí podrías manejar los errores de validación, por ahora lo omitimos para simplicidad
    // y nos enfocamos en la lógica de actualización.
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Error de validación',
    };
  }

  try {
    await db.update(records)
      .set(validatedFields.data)
      .where(eq(records.id, id));

    revalidatePath('/registros/historial');
  
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error al actualizar el préstamo:', error);
    return { error: 'Error de base de datos: No se pudo actualizar el préstamo.' };
  }
  redirect('/registros/historial');
}

export async function getHistory() {
    try {
      const data = await db.query.records.findMany({
        orderBy: (records, { desc }) => [desc(records.timestamp)],
      });
      return { data };
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      return { error: 'Error de base de datos: No se pudo obtener el historial.' };
    }
}
