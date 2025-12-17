"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { addComputer } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
    >
      {pending ? "Guardando..." : "Añadir Computadora"}
    </button>
  );
}

export default function NewInventoryPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(addComputer, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <div className="flex items-center mb-6">
          <Link href="/inventory" className="text-gray-500 hover:text-gray-800 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-700">
            Añadir Nueva Computadora al Inventario
          </h1>
        </div>

        <form action={dispatch} className="space-y-4">
          <div>
            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-600">Descripción</label>
            <input
              id="descripcion"
              name="descripcion"
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {state.errors?.descripcion && <p className="mt-1 text-sm text-red-500">{state.errors.descripcion[0]}</p>}
          </div>
          <div>
            <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-600">Marca</label>
            <input
              id="marca"
              name="marca"
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {state.errors?.marca && <p className="mt-1 text-sm text-red-500">{state.errors.marca[0]}</p>}
          </div>
          <div>
            <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-600">Modelo</label>
            <input
              id="modelo"
              name="modelo"
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {state.errors?.modelo && <p className="mt-1 text-sm text-red-500">{state.errors.modelo[0]}</p>}
          </div>
          <div>
            <label htmlFor="numeroSerie" className="block mb-2 text-sm font-medium text-gray-600">Número de Serie</label>
            <input
              id="numeroSerie"
              name="numeroSerie"
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