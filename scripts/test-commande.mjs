/**
 * Parcours de commande, de bout en bout, à trois largeurs d'écran.
 *
 * Vérifie : les étapes affichées selon la prestation, le choix du
 * déroulement, la demande de zone, le total, les blocages de validation,
 * l'enregistrement, et l'accessibilité WCAG 2.1 AA à chaque étape.
 *
 *   BASE_URL   adresse du site à tester (défaut http://127.0.0.1:3000)
 */
import { createRequire } from 'module';
const r = createRequire(import.meta.url);
const { chromium } = r('playwright');
const { source: axeSource } = r('axe-core');

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const bilan = [];

const noter = (message) => {
  bilan.push(message);
  console.log(`    ! ${message}`);
};

async function axe(page, label) {
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(() =>
    axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    }),
  );
  console.log(`  axe ${label} : ${res.violations.length} violation(s)`);
  for (const v of res.violations) noter(`${label} — ${v.id} ×${v.nodes.length}`);
}

async function debordement(page, label) {
  const px = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (px > 1) noter(`${label} — débordement horizontal de ${px}px`);
  return px;
}

/** Étapes annoncées par l'indicateur de progression. */
const etapes = (page) => page.$$eval('form ol li', (els) => els.map((e) => e.textContent.trim()));

/* ------------------------------------------------------------------
   Cas 1 : prestation avec déroulement ET options
------------------------------------------------------------------- */

for (const vp of [
  { w: 390, h: 844, n: 'mobile' },
  { w: 768, h: 1024, n: 'tablette' },
  { w: 1280, h: 900, n: 'bureau' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  console.log(`\n=== ${vp.n} ${vp.w}px — déclaration de couple (déroulement + options) ===`);

  await page.goto(`${BASE}/commande/declaration-impots-couple`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Comment souhaitez-vous');

  const liste = await etapes(page);
  console.log(`  étapes : ${liste.join(' · ')}`);
  if (liste.length !== 4) noter(`${vp.n} — ${liste.length} étapes au lieu de 4`);

  await axe(page, `${vp.n}/déroulement`);
  await debordement(page, `${vp.n}/déroulement`);

  // Avancer sans choisir doit être refusé.
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.waitForTimeout(250);
  if (!(await page.locator('text=Comment souhaitez-vous').isVisible())) {
    noter(`${vp.n} — l'étape déroulement n'est pas bloquée sans choix`);
  } else {
    console.log('  bloqué sans choix de déroulement : oui');
  }

  // « À distance » ne doit pas demander de zone.
  await page.locator('input[value=distance]').check();
  await page.waitForTimeout(200);
  if ((await page.locator('select[name=zone]').count()) > 0) {
    noter(`${vp.n} — une zone est demandée pour une prestation à distance`);
  }

  // Un rendez-vous doit en demander une.
  await page.locator('input[value=presentiel]').check();
  await page.waitForTimeout(200);
  if ((await page.locator('select[name=zone]').count()) === 0) {
    noter(`${vp.n} — aucune zone demandée pour un rendez-vous`);
  } else {
    console.log('  zone demandée pour un rendez-vous : oui');
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.waitForTimeout(250);
    if (!(await page.locator('text=Comment souhaitez-vous').isVisible())) {
      noter(`${vp.n} — la zone n'est pas exigée`);
    } else {
      console.log('  bloqué sans zone : oui');
    }
    await page.locator('select[name=zone]').selectOption('nord-vaudois');
  }

  // Les frais de déplacement sont inactifs : le total ne doit pas bouger.
  const avant = (await page.locator('aside .font-display.text-3xl').innerText()).trim();
  console.log(`  total avec zone à frais proposés, frais inactifs : ${avant}`);
  if (!avant.includes('159')) noter(`${vp.n} — frais de déplacement ajoutés alors qu'inactifs (${avant})`);

  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.waitForSelector('text=Des options');
  await axe(page, `${vp.n}/options`);

  await page.getByText('Portefeuille de titres', { exact: true }).click();
  await page.getByText('Bien immobilier', { exact: true }).click();
  const total = (await page.locator('aside .font-display.text-3xl').innerText()).trim();
  console.log(`  total 159 + 30 + 50 → ${total}`);
  if (!total.includes('239')) noter(`${vp.n} — total incorrect : ${total}`);

  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.waitForSelector('text=Vos coordonnées');
  await axe(page, `${vp.n}/informations`);

  // Avancer sans rien remplir doit être refusé.
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.waitForTimeout(300);
  const erreurs = await page.locator('p.text-red-700').count();
  if (!(await page.locator('text=Vos coordonnées').isVisible()) || erreurs === 0) {
    noter(`${vp.n} — l'étape informations n'est pas bloquée à vide`);
  } else {
    console.log(`  bloqué à vide : oui (${erreurs} messages)`);
  }

  for (const [label, valeur] of [
    ['Prénom', 'Marie'],
    ['Nom', 'Dupont'],
    ['Adresse e-mail', 'marie.dupont@example.ch'],
    ['Adresse', 'Rue du Lac 12'],
    ['NPA', '1400'],
    ['Localité', 'Yverdon-les-Bains'],
    ['Année fiscale concernée', '2025'],
    ['Commune de taxation', 'Yverdon-les-Bains'],
  ]) {
    await page.getByLabel(label, { exact: true }).fill(valeur);
  }
  await page.getByLabel('Canton', { exact: true }).selectOption('VD');
  await page.getByLabel('État civil', { exact: true }).selectOption('marie');
  for (const q of [
    'Avez-vous déposé une déclaration l’an dernier ?',
    'Êtes-vous propriétaire d’un bien immobilier ?',
    'Détenez-vous des titres ou des placements ?',
  ]) {
    await page.getByRole('group', { name: q }).getByText('Oui', { exact: true }).click();
  }

  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.waitForSelector('text=Avant de valider');
  await axe(page, `${vp.n}/récapitulatif`);
  await debordement(page, `${vp.n}/récapitulatif`);

  // Valider sans accepter les conditions doit être refusé.
  await page.getByRole('button', { name: 'Valider la commande' }).click();
  await page.waitForTimeout(300);
  if (!(await page.locator('text=Avant de valider').isVisible())) {
    noter(`${vp.n} — commande validée sans acceptation des conditions`);
  } else {
    console.log('  bloqué sans acceptation des conditions : oui');
  }

  const cases = page.locator('input[type=checkbox]');
  const n = await cases.count();
  await cases.nth(n - 2).check();
  await cases.nth(n - 1).check();
  await page.getByRole('button', { name: 'Valider la commande' }).click();
  await page.waitForSelector('text=Commande enregistrée', { timeout: 20000 });
  const ref = (await page.locator('text=/YG-[0-9A-Z]+-[0-9A-Z]+/').first().innerText()).trim();
  console.log(`  commande enregistrée, référence : ${ref}`);
  if (!/^YG-/.test(ref)) noter(`${vp.n} — référence absente ou mal formée`);
  await axe(page, `${vp.n}/écran de confirmation`);

  await page.close();
}

/* ------------------------------------------------------------------
   Cas 2 : prestation sans alternative de déroulement
------------------------------------------------------------------- */

console.log('\n=== prestation à distance seule : pas d’étape déroulement ===');
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/commande/resiliation-abonnement`, { waitUntil: 'networkidle' });
  const liste = await etapes(page);
  console.log(`  étapes : ${liste.join(' · ')}`);
  if (liste.some((e) => e.includes('Déroulement'))) {
    noter('étape déroulement affichée pour une prestation sans alternative');
  }
  await page.close();
}

/* ------------------------------------------------------------------
   Cas 3 : une session de paiement forgée n’est jamais « payée »
------------------------------------------------------------------- */

console.log('\n=== session de paiement forgée ===');
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/commande/confirmation?ref=YG-FORGE&session=cs_forge_par_un_visiteur`, {
    waitUntil: 'networkidle',
  });
  const texte = await page.locator('body').innerText();
  console.log(`  présentée comme payée : ${texte.includes('Paiement reçu') ? 'OUI' : 'non'}`);
  if (texte.includes('Paiement reçu')) noter('une session forgée est présentée comme payée');
  await axe(page, 'confirmation');
  await page.close();
}

await browser.close();
console.log('\n========== BILAN ==========');
console.log(bilan.length === 0 ? 'Aucun problème détecté.' : bilan.map((x) => `- ${x}`).join('\n'));
process.exit(bilan.length === 0 ? 0 : 1);
