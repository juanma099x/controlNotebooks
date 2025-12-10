import { db, inventory } from './app/db';

// --- ¡AQUÍ PEGA TUS DATOS DE EXCEL! ---
// Sigue este formato: { serialNumber: "NÚMERO DE SERIE", model: "MODELO" }
const netbooksData = [
  { serialNumber: "AA7861054845", model: "JUANA MANSO SF20GM7" },
  { serialNumber: "AA7861034771", model: "JUANA MANSO SF20GM7" },
  { serialNumber: "AA3861017389", model: "JUANA MANSO SF20GM7" },
  { serialNumber: "AA7861014939", model: "JUANA MANSO SF20GM7" },
  { serialNumber: "AA2528006583", model: "POSITIVO BGH 17SF20" },
  { serialNumber: "AA4317010750", model: "POSITIVO BGH 17SF20" },
  { serialNumber: "AA8174138708", model: "PULSARe EF10MI5" },
  { serialNumber: "AA5317044822", model: "POSITIVO BGH 17SF20" },
  { serialNumber: "AA5174143783", model: "PULSARe EF10MI5" },
  { serialNumber: "AA174128389", model: "PULSARe EF10MI5" },
  { serialNumber: "AA2174133934", model: "PULSARe EF10MI5" },
  { serialNumber: "AA7174126446", model: "PULSARe EF10MI5" },
  { serialNumber: "AA3174061667", model: "PULSARe EF10MI5" },
  { serialNumber: "AA3174056968", model: "PULSARe EF10MI5" },
  { serialNumber: "AA7174126414", model: "PULSARe EF10MI5" },
  { serialNumber: "AA5174120219", model: "PULSARe EF10MI5" },
  { serialNumber: "AA2174138391", model: "PULSARe EF10MI5" },
  { serialNumber: "AA2174113426", model: "PULSARe EF10MI5" },
  { serialNumber: "AA4317011034", model: "POSITIVO BGH 17SF20" },
  { serialNumber: "AA4317008237", model: "POSITIVO BGH 17SF20" },
];
// -----------------------------------------

async function seed() {
  console.log('Limpiando inventario existente...');
  await db.delete(inventory);

  console.log(`Insertando ${netbooksData.length} netbooks en el inventario...`);
  if (netbooksData.length > 0) {
    await db.insert(inventory).values(netbooksData);
 }

console.log('¡Inventario cargado con éxito!');

// Forzamos la salida para evitar que la terminal se quede colgada
process.exit(0);
}

seed().catch((e) => {
  console.error('Error al cargar el inventario:', e);
  process.exit(1);
});