import { db } from '../db';
import { inventory } from '../schema';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { eq } from 'drizzle-orm';
import { LoanForm } from './LoanForm';

export default async function RegistrarPrestamoPage() {
  // Obtenemos solo las computadoras que están "Disponibles"
  const availableComputers = await db
    .select()
    .from(inventory)
    .where(eq(inventory.status, 'Disponible'));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-700">
            Registrar Nuevo Préstamo
          </h1>
        </div>
        {availableComputers.length === 0 ? (
          <div className="text-center p-4 border-l-4 border-yellow-400 bg-yellow-50 text-yellow-700">
            <p className="font-bold">No hay computadoras disponibles</p>
            <p>Todas las computadoras están actualmente prestadas o en mantenimiento.</p>
          </div>
        ) : (
          <LoanForm computers={availableComputers} />
        )}
      </div>
    </div>
  );
}