'use server';

import { db, inventory } from '@/app/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addNetbook(formData: FormData) {
  const descripcion = formData.get('descripcion') as string;
  const marca = formData.get('marca') as string;
  const modelo = formData.get('modelo') as string;
  const numeroSerie = formData.get('numeroSerie') as string;

  // Validación simple (puedes expandirla según necesites)
  if (!descripcion || !marca || !modelo || !numeroSerie) {
    console.error('Todos los campos son requeridos.');
    // En una app real, devolverías un mensaje de error al usuario.
    return;
  }

  await db.insert(inventory).values({
    descripcion,
    marca,
    modelo,
    numeroSerie,
    status: 'Disponible', // Por defecto, una nueva netbook está disponible
  });

  revalidatePath('/registros'); // O la ruta donde veas el inventario total
  redirect('/registros'); // Redirige al usuario a la lista de registros
}
