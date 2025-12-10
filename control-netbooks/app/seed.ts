import { db, inventory } from '../app/db';

/*
================================================================================
PASO 1: PEGA TU INVENTARIO AQUÍ
Reemplaza la lista de ejemplo de abajo con tu inventario real.
Mantén el formato: { modelo: '...', numeroSerie: '...' } para cada netbook.
================================================================================
*/
const INVENTARIO_INICIAL = [
  { modelo: 'G5', numeroSerie: 'G5-001-ABC' },
  { modelo: 'G5', numeroSerie: 'G5-002-DEF' },
  { modelo: 'G7', numeroSerie: 'G7-101-GHI' },
  { modelo: 'G7', numeroSerie: 'G7-102-JKL' },
  { modelo: 'G8', numeroSerie: 'G8-201-MNO' },
  // <-- Puedes agregar tantas netbooks como necesites aquí
];

async function main() {
  console.log('Limpiando el inventario actual...');
  await db.delete(inventory);
  console.log('Inventario limpiado.');

  console.log('Cargando el nuevo inventario...');
  for (const item of INVENTARIO_INICIAL) {
    await db.insert(inventory).values({
      modelo: item.modelo,
      numeroSerie: item.numeroSerie,
      status: 'Disponible',
    });
    console.log(`  -> Agregada: ${item.modelo} - ${item.numeroSerie}`);
  }

  console.log('¡Carga de inventario completada!');
}

main()
  .catch((e) => {
    console.error('Hubo un error al cargar el inventario:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });