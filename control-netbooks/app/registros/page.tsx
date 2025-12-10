import { db, records, inventory } from '@/app/db';
import Link from 'next/link';
import { FilePenLine, Trash2, Undo2, ArrowLeft, FilePlus } from 'lucide-react';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function markAsReturned(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  const now = new Date();
  const fechaDevolucion = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaDevolucion = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

  const loanRecord = await db.select({ inventoryId: records.inventoryId }).from(records).where(eq(records.id, id));
  const inventoryId = loanRecord[0]?.inventoryId;

  await db
    .update(records)
    .set({
      estado: 'Devuelto',
      fechaDevolucion: fechaDevolucion,
      horaDevolucion: horaDevolucion,
    })
    .where(eq(records.id, id));

  if (inventoryId) {
    await db.update(inventory).set({ status: 'Disponible' }).where(eq(inventory.id, inventoryId));
  }

  revalidatePath('/registros');
}

async function deleteLoan(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));

  const loanRecord = await db.select({ inventoryId: records.inventoryId }).from(records).where(eq(records.id, id));
  const inventoryId = loanRecord[0]?.inventoryId;

  await db.delete(records).where(eq(records.id, id));

  if (inventoryId) {
    await db.update(inventory).set({ status: 'Disponible' }).where(eq(inventory.id, inventoryId));
  }

  revalidatePath('/registros');
}

export default async function RecordsPage() {
  const allRecords = await db.select().from(records).orderBy(records.id).all();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Panel de Préstamos</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver al Menú</span>
            </Link>
            <Link
              href="/netbooks/new"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <FilePlus size={20} />
              <span>Registrar Préstamo</span>
            </Link>
          </div>
        </header>
        <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
          {/* La clase 'border-collapse' es clave para que los bordes se fusionen */}
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {/* A cada celda del encabezado le ponemos un borde completo */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Alumno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Fecha de Retiro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Fecha de Devolución</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {allRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500 border border-gray-300">
                    No hay registros de préstamos todavía.
                  </td>
                </tr>
              ) : (
                allRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    {/* A cada celda de datos también le ponemos un borde completo */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">{record.nombreAlumno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{record.curso}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{record.descripcionNetbook}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{record.modeloNetbook}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{`${record.fechaRetiro} ${record.horaRetiro}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center border border-gray-200">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.estado === 'Prestado' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {record.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">
                      {record.fechaDevolucion ? `${record.fechaDevolucion} ${record.horaDevolucion}` : '---'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium border border-gray-200">
                      <div className="flex items-center justify-center gap-4">
                        <Link href={`/registros/${record.id}/edit`} className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors" title="Editar">
                          <FilePenLine size={18} />
                        </Link>
                        {record.estado === 'Prestado' ? (
                          <form action={markAsReturned}>
                            <input type="hidden" name="id" value={record.id} />
                            <button type="submit" className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors" title="Marcar como Devuelto">
                              <Undo2 size={18} />
                            </button>
                          </form>
                        ) : (
                          <span className="p-2 text-gray-400" title="Ya fue devuelto">
                            <Undo2 size={18} />
                          </span>
                        )}
                        <form action={deleteLoan}>
                          <input type="hidden" name="id" value={record.id} />
                          <button type="submit" className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors" title="Borrar">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
