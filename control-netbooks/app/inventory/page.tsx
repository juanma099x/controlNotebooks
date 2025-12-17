import { db } from "../db";
import { inventory } from "../schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton"; // Import the new component

export default async function InventoryPage() {
  const computers = await db.select().from(inventory).all();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Computadoras
          </h1>
          <Link href="/inventory/new">
            <Button>Añadir Nueva Computadora</Button>
          </Link>
        </div>

        {computers.length === 0 ? (
          <p className="text-center text-gray-600">No hay computadoras registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Descripción</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Marca</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Modelo</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Número de Serie</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {computers.map((computer) => (
                  <tr key={computer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{computer.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{computer.descripcion}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{computer.marca}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{computer.modelo}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{computer.numeroSerie}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{computer.status}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <Link href={`/inventory/${computer.id}/edit`}>
                        <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                      </Link>
                      <DeleteButton computerId={computer.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
