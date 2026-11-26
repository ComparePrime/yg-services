import { createRequire } from 'module';
const r = createRequire(import.meta.url);
const { chromium } = r('playwright');
const { source: axeSource } = r('axe-core');
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const b = await chromium.launch();
const bilan = [];

async function axe(p, label) {
  await p.addScriptTag({ content: axeSource });
  const res = await p.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }));
  console.log(`  axe ${label} : ${res.violations.length} violation(s)`);
  for (const v of res.violations) { bilan.push(`${label} — ${v.id} ×${v.nodes.length}`); console.log(`    ! ${v.id} (${v.impact}) ×${v.nodes.length}`); }
}

for (const vp of [{w:390,h:844,n:'mobile'},{w:768,h:1024,n:'tablette'},{w:1280,h:900,n:'bureau'}]) {
  const p = await b.newPage({ viewport: { width: vp.w, height: vp.h } });
  console.log(`\n=== ${vp.n} ${vp.w}px ===`);
  await p.goto(`${BASE}/commande/declaration-impots-couple`, { waitUntil: 'networkidle' });
  await p.waitForSelector('text=Des options');
  await axe(p, `${vp.n}/options`);

  await p.getByText('Portefeuille de titres', {exact:true}).click();
  await p.getByText('Bien immobilier', {exact:true}).click();
  const t = (await p.locator('aside .font-display.text-3xl').innerText()).trim();
  console.log(`  total 159+30+50 → ${t}`);
  if (!t.includes('239')) bilan.push(`${vp.n} total faux : ${t}`);

  await p.getByRole('button', {name:'Continuer'}).click();
  await p.waitForSelector('text=Vos coordonnées');
  await axe(p, `${vp.n}/informations`);

  for (const [l,v] of [['Prénom','Marie'],['Nom','Dupont'],['Adresse e-mail','marie.dupont@example.ch'],['Adresse','Rue du Lac 12'],['NPA','1400'],['Localité','Yverdon-les-Bains'],['Année fiscale concernée','2025'],['Commune de taxation','Yverdon-les-Bains']]) await p.getByLabel(l,{exact:true}).fill(v);
  await p.getByLabel('Canton',{exact:true}).selectOption('VD');
  await p.getByLabel('État civil',{exact:true}).selectOption('marie');
  for (const q of ['Avez-vous déposé une déclaration l’an dernier ?','Êtes-vous propriétaire d’un bien immobilier ?','Détenez-vous des titres ou des placements ?'])
    await p.getByRole('group',{name:q}).getByText('Oui',{exact:true}).click();

  await p.getByRole('button',{name:'Continuer'}).click();
  await p.waitForSelector('text=Avant de valider');
  await axe(p, `${vp.n}/récapitulatif`);
  const of = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`  débordement horizontal : ${of}px`);
  if (of > 1) bilan.push(`${vp.n} débordement ${of}px`);

  // Les deux cases sont nécessaires
  await p.getByRole('button',{name:'Valider la commande'}).click();
  await p.waitForTimeout(300);
  if (!(await p.locator('text=Avant de valider').isVisible())) bilan.push(`${vp.n} : validée sans consentement`);
  console.log(`  bloqué sans consentement : ${await p.locator('text=Avant de valider').isVisible()}`);

  const cases = p.locator('input[type=checkbox]');
  const n = await cases.count();
  await cases.nth(n-2).check();
  await cases.nth(n-1).check();
  await p.getByRole('button',{name:'Valider la commande'}).click();
  await p.waitForSelector('text=Commande enregistrée', { timeout: 15000 });
  const ref = await p.locator('text=/YG-[0-9A-Z]+-[0-9A-Z]+/').first().innerText();
  console.log(`  commande enregistrée, référence affichée : ${ref.trim()}`);
  if (!/YG-/.test(ref)) bilan.push(`${vp.n} : pas de référence`);
  await axe(p, `${vp.n}/confirmation-écran`);
  if (vp.n === 'bureau') await p.screenshot({ path: process.env.SCREENSHOT_DIR ? process.env.SCREENSHOT_DIR + '/commande-ok.png' : 'commande-ok.png', fullPage: true });
  await p.close();
}

// Session de paiement forgée
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto(`${BASE}/commande/confirmation?ref=YG-TEST&session=cs_forge_par_un_visiteur`, { waitUntil:'networkidle' });
const txt = await p.locator('body').innerText();
console.log(`\n=== session forgée ===\n  présentée comme payée : ${txt.includes('Paiement reçu') ? 'OUI → PROBLÈME' : 'non'}`);
if (txt.includes('Paiement reçu')) bilan.push('session forgée acceptée comme payée');
await axe(p, 'confirmation');
await p.close();
await b.close();

console.log('\n========== BILAN ==========');
console.log(bilan.length ? bilan.map(x=>'- '+x).join('\n') : 'Aucun problème détecté.');
