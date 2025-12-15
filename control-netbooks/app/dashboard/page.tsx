import Link from "next/link";
import Image from "next/image";
import { FilePlus, ClipboardList } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 sm:p-24 bg-gray-50">
      {/* Encabezado */}
      <div className="text-center w-full">
        <Image
          src="/logo.png" 
          alt="Logo de la Escuela"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Control de Netbooks
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mt-2">
          Escuela Industrial N°9
        </p>
      </div>

      {/* Contenido Principal - Botones */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-24">
        <Link href="/netbooks/new" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:scale-105">
          <FilePlus size={24} />
          <span>Registrar Préstamo</span>
        </Link>
        <Link href="/registros" className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform hover:scale-105">
          <ClipboardList size={24} />
          <span>Ver Registros</span>
        </Link>
      </div>
    </main>
  );
}
