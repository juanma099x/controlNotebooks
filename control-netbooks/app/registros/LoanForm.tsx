'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createLoan } from './actions';

type Computer = { id: number; descripcion: string | null; status: string };

interface LoanFormProps {
  computers: Computer[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
    >
      {pending ? 'Registrando...' : 'Confirmar Préstamo'}
    </button>
  );
}

export function LoanForm({ computers }: LoanFormProps) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createLoan, initialState);

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label htmlFor="studentName" className="block mb-2 text-sm font-medium text-gray-600">Nombre Completo del Alumno</label>
        <input id="studentName" name="studentName" required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        {state.errors?.studentName && <p className="mt-1 text-sm text-red-500">{state.errors.studentName[0]}</p>}
      </div>
      <div>
        <label htmlFor="course" className="block mb-2 text-sm font-medium text-gray-600">Curso</label>
        <input id="course" name="course" required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        {state.errors?.course && <p className="mt-1 text-sm text-red-500">{state.errors.course[0]}</p>}
      </div>
      <div>
        <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-600">Descripción (Opcional)</label>
        <textarea id="descripcion" name="descripcion" rows={3} className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Ej: Se retira para trabajo práctico durante el fin de semana."></textarea>
        {state.errors?.descripcion && <p className="mt-1 text-sm text-red-500">{state.errors.descripcion[0]}</p>}
      </div>
      <div>
        <label htmlFor="fecha_retiro" className="block mb-2 text-sm font-medium text-gray-600">Fecha y Hora de Retiro</label>
        <input type="datetime-local" id="fecha_retiro" name="fecha_retiro" required className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        {state.errors?.fecha_retiro && <p className="mt-1 text-sm text-red-500">{state.errors.fecha_retiro[0]}</p>}
      </div>
      <div>
        <label htmlFor="computerId" className="block mb-2 text-sm font-medium text-gray-600">Seleccionar Netbook</label>
        <select id="computerId" name="computerId" required defaultValue="" className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
          <option value="" disabled>-- Elige una netbook disponible --</option>
          {computers.map((computer) => (
            <option key={computer.id} value={computer.id} disabled={computer.status !== 'Disponible'}>
              {computer.descripcion} ({computer.status})
            </option>
          ))}
        </select>
        {state.errors?.computerId && <p className="mt-1 text-sm text-red-500">{state.errors.computerId[0]}</p>}
      </div>
      <SubmitButton />
      {state.message && <p className="mt-2 text-sm text-red-500 text-center">{state.message}</p>}
    </form>
  );
}