'use client';

import { Button } from '@/components/ui/button';

interface ReturnLoanButtonProps {
  recordId: number;
  inventoryId: number;
  // Accept the server action as a prop
  returnLoan: (recordId: number, inventoryId: number) => Promise<void | { message: string; } | undefined>;
}

export function ReturnLoanButton({ recordId, inventoryId, returnLoan }: ReturnLoanButtonProps) {
  // Bind the action with the required IDs
  const action = returnLoan.bind(null, recordId, inventoryId);

  return (
    <form action={action}>
      <Button variant="outline" size="sm">
        Marcar como Devuelto
      </Button>
    </form>
  );
}
