import { db } from "../../../db";
import { inventory } from "../../../schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateComputerSimple } from "../../actions"; // <-- Usamos la nueva acción simple

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditComputerPage({ params }: EditPageProps) {
  const computerId = parseInt(params.id, 10);

  if (isNaN(computerId)) {
    notFound();
  }

  const computer = await db.query.inventory.findFirst({
    where: eq(inventory.id, computerId),
  });

  if (!computer) {
    notFound();
  }

  // Usamos .bind para pre-cargar el ID de la computadora en la server action
  const updateActionWithId = updateComputerSimple.bind(null, computer.id);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <div className="flex items-center mb-6">
          <Link href="/inventory" className="text-gray-500 hover:text-gray-800 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-700">
            Editar Netbook #{computer.id}
          </h1>
        </div>

        <form action={updateActionWithId} className="space-y-4">
          <div>
            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-600">Descripción</label>
            <input
              type="text"
              name="descripcion"
              id="descripcion"
              defaultValue={computer.descripcion}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-600">Marca</label>
            <input type="text" name="marca" id="marca" defaultValue={computer.marca} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
          </div>
          <div>
            <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-600">Modelo</label>
            <input type="text" name="modelo" id="modelo" defaultValue={computer.modelo} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
          </div>
          <div>
            <label htmlFor="numeroSerie" className="block mb-2 text-sm font-medium text-gray-600">Número de Serie</label>
            <input type="text" name="numeroSerie" id="numeroSerie" defaultValue={computer.numeroSerie} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
          </div>
          <div>
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-600">Estado</label>
            <select
              name="status"
              id="status"
              defaultValue={computer.status}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Disponible">Disponible</option>
              <option value="Prestado">Prestado</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}