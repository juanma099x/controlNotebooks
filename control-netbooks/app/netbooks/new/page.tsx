"use client"; // Este componente ahora maneja estado, por lo que es un Client Component.

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { saveNetbook } from "../actions";

export default function NewNetbookPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(saveNetbook, initialState);

  // Componente para el botón de envío que muestra un estado de carga
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
      >
        {pending ? "Guardando..." : "Guardar Netbook"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">Añadir Nueva Netbook</h1>
        <form action={dispatch} className="space-y-4">
          <div>
            <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-600">Marca</label>
            <input
              type="text"
              name="brand"
              id="brand"
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {state.errors?.marca && <p className="mt-1 text-sm text-red-500">{state.errors.marca[0]}</p>}
          </div>
          <div>
            <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-600">Modelo</label>
            <input
              type="text"
              name="model"
              id="model"
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {state.errors?.modelo && <p className="mt-1 text-sm text-red-500">{state.errors.modelo[0]}</p>}
          </div>
          <div>
            <label htmlFor="serialNumber" className="block mb-2 text-sm font-medium text-gray-600">Número de Serie</label>
            <input
              type="text"
              name="serialNumber"
              id="serialNumber"
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {state.errors?.numeroSerie && <p className="mt-1 text-sm text-red-500">{state.errors.numeroSerie[0]}</p>}
          </div>
          <SubmitButton />
          {state.message && <p className="mt-2 text-sm text-red-500 text-center">{state.message}</p>}
        </form>
      </div>
    </div>
  );
}
