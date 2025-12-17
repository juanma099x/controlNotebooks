"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { updateComputer } from "../../actions";
import type { Inventory } from "../../../schema";

interface EditFormProps {
  computer: Inventory;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
    >
      {pending ? "Guardando..." : "Guardar Cambios"}
    </button>
  );
}

export function EditForm({ computer }: EditFormProps) {
  const initialState = { message: null, errors: {} };
  const updateComputerWithId = updateComputer.bind(null, computer.id);
  const [state, dispatch] = useActionState(updateComputerWithId, initialState);

  return (
    <form action={dispatch} className="space-y-4">
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
        {state.errors?.descripcion && <p className="mt-1 text-sm text-red-500">{state.errors.descripcion[0]}</p>}
      </div>
      <div>
        <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-600">Marca</label>
        <input type="text" name="marca" id="marca" defaultValue={computer.marca} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        {state.errors?.marca && <p className="mt-1 text-sm text-red-500">{state.errors.marca[0]}</p>}
      </div>
      <div>
        <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-600">Modelo</label>
        <input type="text" name="modelo" id="modelo" defaultValue={computer.modelo} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        {state.errors?.modelo && <p className="mt-1 text-sm text-red-500">{state.errors.modelo[0]}</p>}
      </div>
      <div>
        <label htmlFor="numeroSerie" className="block mb-2 text-sm font-medium text-gray-600">Número de Serie</label>
        <input type="text" name="numeroSerie" id="numeroSerie" defaultValue={computer.numeroSerie} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        {state.errors?.numeroSerie && <p className="mt-1 text-sm text-red-500">{state.errors.numeroSerie[0]}</p>}
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
        {state.errors?.status && <p className="mt-1 text-sm text-red-500">{state.errors.status[0]}</p>}
      </div>
      <SubmitButton />
      {state.message && <p className="mt-2 text-sm text-red-500 text-center">{state.message}</p>}
    </form>
  );
}

```

#### 2. Actualizar la Página de Edición (Servidor)

Ahora, modifica `app/inventory/[id]/edit/page.tsx` para que sea un Componente de Servidor que obtenga los datos y renderice nuestro nuevo `EditForm`.

```diff
--- a/c:\Users\Usuario\Downloads\control-netbooks\control-netbooks\app\inventory\[id]\edit\page.tsx
+++ b/c:\Users\Usuario\Downloads\control-netbooks\control-netbooks\app\inventory\[id]\edit\page.tsx
@@ -1,141 +1,48 @@
import { db } from "../../../db";
import { inventory } from "../../../schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditForm } from "./EditForm";

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
        <EditForm computer={computer} />
      </div>
    </div>
  );
}