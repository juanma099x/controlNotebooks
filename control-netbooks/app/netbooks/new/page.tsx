import { db, records, inventory } from '@/app/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function createLoan(formData: FormData) {
  'use server';
  const nombreAlumno = formData.get('nombreAlumno') as string;
  const curso = formData.get('curso') as string;
  const inventoryId = Number(formData.get('inventoryId'));

  // Validar que se seleccionó una netbook
  if (!inventoryId) {
    // En una aplicación real, aquí devolveríamos un mensaje de error
    console.error('No se seleccionó una netbook.');
    return;
  }

  const netbook = await db.select().from(inventory).where(eq(inventory.id, inventoryId)).get();
  const modeloNetbook = netbook?.modelo || 'Desconocido';
  const descripcionNetbook = netbook?.descripcion || 'Sin descripción';

  if (!netbook || netbook.status !== 'Disponible') {
    // Doble chequeo para evitar prestar una netbook no disponible
    console.error('La netbook seleccionada no está disponible.');
    return;
  }

  // Insertar el nuevo registro de préstamo
  await db.insert(records).values({
    nombreAlumno,
    curso,
    inventoryId,
    modeloNetbook: modeloNetbook,
    descripcionNetbook: descripcionNetbook,
    fechaRetiro: formData.get('fechaRetiro') as string,
    horaRetiro: formData.get('horaRetiro') as string,
    estado: 'Prestado',
  });

  // Actualizar el estado de la netbook a 'Prestado'
  await db.update(inventory).set({ status: 'Prestado' }).where(eq(inventory.id, inventoryId));

  revalidatePath('/registros');
  redirect('/registros');
}

export default async function NewLoanPage() {
  const availableNetbooks = await db.select().from(inventory).where(eq(inventory.status, 'Disponible')).all();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Registrar Nuevo Préstamo</h1>
        
        <form action={createLoan} className="space-y-6">
          <div>
            <label htmlFor="nombreAlumno" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Alumno
            </label>
            <input
              type="text"
              id="nombreAlumno"
              name="nombreAlumno"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label htmlFor="curso" className="block text-sm font-medium text-gray-700 mb-1">
              Curso
            </label>
            <input
              type="text"
              id="curso"
              name="curso"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 5to 1ra"
            />
          </div>

          <div>
            <label htmlFor="inventoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Netbook Disponible
            </label>
            <select
              id="inventoryId"
              name="inventoryId"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                {availableNetbooks.length > 0 ? 'Seleccione una netbook...' : 'No hay netbooks disponibles'}
              </option>
              {availableNetbooks.map(netbook => (
                <option key={netbook.id} value={netbook.id}>
                  {netbook.descripcion} - {netbook.marca} ({netbook.modelo})
                </option>
              ))}
            </select>
          </div>

          {/* --- CAMPOS DE FECHA Y HORA RESTAURADOS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fechaRetiro" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Retiro</label>
              <input type="date" id="fechaRetiro" name="fechaRetiro" required defaultValue={new Date().toISOString().split('T')[0]} className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="horaRetiro" className="block text-sm font-medium text-gray-700 mb-1">Hora de Retiro</label>
              <input type="time" id="horaRetiro" name="horaRetiro" required defaultValue={new Date().toTimeString().split(' ')[0].substring(0, 5)} className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          {/* --- FIN DE CAMPOS RESTAURADOS --- */}

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/registros" className="px-6 py-2 text-sm font-semibold text-gray-600 rounded-md hover:bg-gray-100">
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={availableNetbooks.length === 0}
            >
              Guardar Préstamo
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
