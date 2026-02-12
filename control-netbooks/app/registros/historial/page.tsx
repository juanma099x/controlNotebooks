import { db } from '../../db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReturnLoanButton } from '../ReturnLoanButton';
import { DeleteLoanButton } from '../DeleteLoanButton';
import { returnLoan, deleteLoan } from '../actions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from 'lucide-react';

export default async function HistoryPage() {
  // Obtener todos los registros de la base de datos, ordenados por el más reciente.
  const allRecords = await db.query.records.findMany({
    orderBy: (records, { desc }) => [desc(records.timestamp)],
  });

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Historial de Préstamos</h1>
          <Link href="/dashboard">
            <Button>Volver al Menú</Button>
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th scope="col" className="pl-4 pr-2 py-3"></th>
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
                    <td className="pl-6 pr-2 py-4 align-middle">
                      {record.observaciones && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-7 w-7 text-indigo-600 hover:text-indigo-800 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border-gray-200 rounded-lg shadow-lg max-w-xs p-0">
                            <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                              <h3 className="font-semibold text-gray-900">Descripción Adicional</h3>
                            </div>
                            <div className="p-3">
                              <p className="text-sm text-gray-800">{record.observaciones}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{record.nombreAlumno}</div>
                        <div className="text-gray-500">{record.curso}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.descripcionNetbook}</div>
                      <div className="text-gray-500">{record.modeloNetbook}</div>
                    </td>
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
                        <span className="font-mono text-xs">ID: {record.id}</span>
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
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      No hay registros para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
