'use client';

import { Button } from "@/components/ui/button";
import { deleteComputer } from "./actions";

interface DeleteButtonProps {
  computerId: number;
}

export function DeleteButton({ computerId }: DeleteButtonProps) {
  // Usamos .bind para pre-cargar el ID en la server action
  const deleteAction = deleteComputer.bind(null, computerId);

  return (
    <form action={deleteAction} className="inline-block">
      <Button type="submit" variant="destructive" size="sm" onClick={(e) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta computadora?')) {
          e.preventDefault();
        }
      }}>Eliminar</Button>
    </form>
  );
}