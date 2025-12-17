'use server';

import { z } from 'zod';
import { db } from '../db';
import { inventory } from '../schema';
import { redirect } from 'next/navigation';

// Definimos el esquema de validación con Zod
const NetbookSchema = z.object({
  marca: z.string().min(1, 'La marca es obligatoria.'),
  modelo: z.string().min(1, 'El modelo es obligatorio.'),
  numeroSerie: z.string().min(1, 'El número de serie es obligatorio.'),
});

export async function saveNetbook(prevState: any, formData: FormData) {
  // Extraemos los datos del formulario y los validamos
  const validatedFields = NetbookSchema.safeParse({
    marca: formData.get('brand'),
    modelo: formData.get('model'),
    numeroSerie: formData.get('serialNumber'),
  });

  // Si la validación falla, devolvemos los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear la netbook.',
    };
  }

  const { marca, modelo, numeroSerie } = validatedFields.data;
  const descripcion = `Netbook ${marca} ${modelo} SN: ${numeroSerie}`;

  try {
    await db.insert(inventory).values({ descripcion, marca, modelo, numeroSerie, status: 'Disponible' });
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo guardar la netbook.' };
  }

  redirect('/inventory');
}