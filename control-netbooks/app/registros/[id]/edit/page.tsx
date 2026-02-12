import { db } from '../../../db';
import { eq } from 'drizzle-orm';
import { records } from '../../../schema';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateLoan } from '../../actions';


async function getLoanById(id: number) {
  const result = await db.select().from(records).where(eq(records.id, id));
  return result[0];
}

export default async function EditLoanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loanId = Number(id);

  // Un ID válido debe ser un número entero y positivo.
  if (!Number.isInteger(loanId) || loanId <= 0) {
    redirect('/registros/historial');
  }

  const loan = await getLoanById(loanId);

  if (!loan) {
    return <div>Registro no encontrado.</div>;
  }

  const updateLoanWithId = updateLoan.bind(null, loanId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Editar Préstamo</h1>
          <p className="text-gray-600 mt-2">Modifica los datos del registro.</p>
        </header>

        <form action={updateLoanWithId} className="w-full p-8 bg-white rounded-lg shadow-md border border-gray-200 space-y-6">
          {/* Alumno y Curso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombreAlumno" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre y Apellido del Alumno
              </label>
              <input
                type="text"
                id="nombreAlumno"
                name="nombreAlumno"
                required
                defaultValue={loan.nombreAlumno}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                defaultValue={loan.curso}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Modelo */}
          <div>
            <label htmlFor="modeloNetbook" className="block text-sm font-medium text-gray-700 mb-1">
              Modelo de Netbook
            </label>
            <input
              type="text"
              id="modeloNetbook"
              name="modeloNetbook"
              required
              defaultValue={loan.modeloNetbook}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fecha y Hora de Retiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fechaRetiro" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Retiro
              </label>
              <input type="date" id="fechaRetiro" name="fechaRetiro" required defaultValue={loan.fechaRetiro} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="horaRetiro" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Retiro
              </label>
              <input type="time" id="horaRetiro" name="horaRetiro" required defaultValue={loan.horaRetiro} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-4">
            <Link href="/registros/historial" className="text-sm font-medium text-gray-600 hover:text-gray-800">
              ← Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
