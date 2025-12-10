"use server";

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { records } from "../schema";

// Inicializamos la base de datos aquí
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);
export async function createLoan(formData: FormData) {
  const newLoan = {
    // Asegúrate de que los nombres coincidan con tu formulario y schema
    nombreAlumno: formData.get("studentName") as string, // 'studentName' viene del formulario
    netbookId: formData.get("model") as string, // 'model' viene del formulario
    fechaRetiro: new Date().toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
    horaRetiro: new Date().toLocaleTimeString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
  };

  // Insertar en la base de datos
  await db.insert(records).values(newLoan);

  // Limpiar la caché de la página de inicio para que muestre el nuevo registro
  revalidatePath("/registros");

  // Redirigir al usuario a la página de inicio
  redirect("/registros");
}