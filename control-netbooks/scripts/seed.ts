import { db, inventory, records } from '../app/db';

/*
================================================================================
PASO 1: PEGA TU INVENTARIO AQUÍ
Reemplaza la lista de ejemplo de abajo con tu inventario real.
Mantén el formato: { descripcion: '...', marca: '...', modelo: '...', numeroSerie: '...' } para cada netbook.
================================================================================
*/
const INVENTARIO_INICIAL = [
  { descripcion: 'Computadora escolar Nº1', marca: 'JUANA MANSO', modelo: 'SF20GM7', numeroSerie: 'AA7861054845' },
  { descripcion: 'Computadora escolar Nº3', marca: 'JUANA MANSO', modelo: 'SF20GM7', numeroSerie: 'AA7861034771' },
  { descripcion: 'Computadora escolar Nº4', marca: 'JUANA MANSO', modelo: 'SF20GM7', numeroSerie: 'AA3861017389' },
  { descripcion: 'Computadora escolar Nº5', marca: 'JUANA MANSO', modelo: 'SF20GM7', numeroSerie: 'AA7861014939' },
  { descripcion: 'Computadora escolar Nº8', marca: 'POSITIVO BGH', modelo: '17SF20', numeroSerie: 'AA2528006583' },
  { descripcion: 'Computadora escolar Nº10', marca: 'POSITIVO BGH', modelo: '17SF20', numeroSerie: 'AA4317010750' },
  { descripcion: 'computadora escolar N°15', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA8174138708' },
  { descripcion: 'computadora escolar N°15-2', marca: 'POSITIVO BGH', modelo: '17SF20', numeroSerie: 'AA5317044822' },
  { descripcion: 'computadora escolar N°17', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA5174143783' },
  { descripcion: 'computadora escolar N°18', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA174128389' },
  { descripcion: 'computadora escolar N°19', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA2174133934' },
  { descripcion: 'computadora escolar N°20', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA7174126446' },
  { descripcion: 'computadora escolar N°24', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA3174061667' },
  { descripcion: 'computadora escolar N°26', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA3174056968' },
  { descripcion: 'computadora escolar N°27', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA7174126414' },
  { descripcion: 'computadora escolar N°28', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA5174120219' },
  { descripcion: 'computadora escolar N°30', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA2174138391' },
  { descripcion: 'computadora escolar N°31', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA2174113426' },
  { descripcion: 'computadora escolar N°37', marca: 'PULSARe', modelo: 'EF10MI5', numeroSerie: 'AA2174113426-DUPLICADO' }, // ¡OJO! Este N/S estaba duplicado. Lo modifiqué.
  { descripcion: 'computadora escolar N°37-2', marca: 'POSITIVO BGH', modelo: '17SF20', numeroSerie: 'AA4317011034' },
  { descripcion: 'computadora escolar', marca: 'POSITIVO BGH', modelo: '17SF20', numeroSerie: 'AA4317008237' },
];
async function main() {
  console.log('Limpiando los registros de préstamos actuales...');
  await db.delete(records);
  console.log('Registros limpiados.');

  console.log('Limpiando el inventario actual...');
  await db.delete(inventory);
  console.log('Inventario limpiado.');

  console.log('Cargando el nuevo inventario...');
  for (const item of INVENTARIO_INICIAL) {
    await db.insert(inventory).values({
      descripcion: item.descripcion,
      marca: item.marca,
      modelo: item.modelo,
      numeroSerie: item.numeroSerie,
      status: 'Disponible',
    });
    console.log(`  -> Agregada: ${item.descripcion} - ${item.marca} - ${item.modelo} - ${item.numeroSerie}`);
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
