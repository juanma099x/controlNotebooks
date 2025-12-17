import { db } from '../../db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReturnLoanButton } from '../ReturnLoanButton';
import { DeleteLoanButton } from '../DeleteLoanButton';
import { returnLoan, deleteLoan } from '../actions';

export default async function HistoryPage() {
  // Obtener todos los registros de la base de datos, ordenados por el más reciente.
  const allRecords = await db.query.records.findMany({
    orderBy: (records, { desc }) => [desc(records.timestamp)],
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Historial de Préstamos</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Alumno</th>
                <th scope="col" className="px-6 py-3 font-medium">Netbook</th>
                <th scope="col" className="px-6 py-3 font-medium">Fecha de Retiro</th>
                <th scope="col" className="px-6 py-3 font-medium">Fecha de Devolución</th>
                <th scope="col" className="px-6 py-3 font-medium">Estado</th>
                <th scope="col" className="px-6 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody suppressHydrationWarning={true}>
              {allRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.nombreAlumno}</div>
                    <div className="text-gray-500">{record.curso}</div>
                  </td>
                  <td className="px-6 py-4">{record.modeloNetbook}</td>
                  <td className="px-6 py-4">{record.fechaRetiro} <span className="text-gray-500">{record.horaRetiro}</span></td>
                  <td className="px-6 py-4">
                    {record.fechaDevolucion ? (
                      <>{record.fechaDevolucion} <span className="text-gray-500">{record.horaDevolucion}</span></>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.estado === 'Prestado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {record.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/registros/${record.id}/edit`}>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      {record.estado === 'Prestado' && record.inventoryId && (
                        <ReturnLoanButton
                          recordId={record.id}
                          inventoryId={record.inventoryId}
                          returnLoan={returnLoan}
                        />
                      )}
                      <DeleteLoanButton
                        recordId={record.id}
                        inventoryId={record.inventoryId}
                        deleteLoan={deleteLoan}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {allRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No hay registros para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
