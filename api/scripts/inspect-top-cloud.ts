import fs from 'node:fs';
import path from 'node:url';
import { fileURLToPath } from 'node:url';

const raw = JSON.parse(fs.readFileSync('api/src/modules/procurement/data/real-placsp-tenders.json', 'utf8'));

const cloudTenders = raw.filter(t => {
  const text = (t.title + ' ' + (t.description || '')).toLowerCase();
  return (
    text.includes('cloud') ||
    text.includes('nube') ||
    text.includes('desarrollo') ||
    text.includes('migración') ||
    text.includes('evolutivo') ||
    text.includes('software') ||
    text.includes('ciberseguridad') ||
    text.includes('datos abiertos') ||
    text.includes('plataforma')
  );
});

console.log(`Total cloud/software tenders found: ${cloudTenders.length}`);
for (let i = 0; i < 8; i++) {
  const t = cloudTenders[i];
  console.log(`\n[${i+1}] ID: ${t.sourceTenderId}`);
  console.log(`    Title: ${t.title}`);
  console.log(`    Authority: ${t.authority?.name}`);
  console.log(`    Budget: ${((t.budgetAmountCents || 0)/100).toLocaleString('es-ES')} €`);
  console.log(`    Docs: ${t.documents?.length || 0}`);
}
