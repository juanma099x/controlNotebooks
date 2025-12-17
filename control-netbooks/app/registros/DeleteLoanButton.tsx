'use client';

import { Button } from '@/components/ui/button';

interface DeleteLoanButtonProps {
  recordId: number;
  inventoryId: number | null;
  // Accept the server action as a prop
  deleteLoan: (recordId: number, inventoryId: number | null) => Promise<void | { message: string; } | undefined>;
}

export function DeleteLoanButton({ recordId, inventoryId, deleteLoan }: DeleteLoanButtonProps) {
  // Bind the action with the required IDs
  const action = deleteLoan.bind(null, recordId, inventoryId);

  return (
    <form action={action}>
      <Button variant="destructive" size="sm">
        Borrar
      </Button>
    </form>
  );
}
