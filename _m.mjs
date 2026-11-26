import { createRequire } from 'module';
const r = createRequire(import.meta.url);
const { chromium } = r('playwright');
const { source: axeSource } = r('axe-core');
const BASE='http://127.0.0.1:4320';
const b=await chromium.launch(); const pbs=[];
// Prestation avec domicile : declaration-impots-retraite (4 modalités)
for (const vp of [{w:390,n:'mobile'},{w:1280,n:'bureau'}]) {
  const p=await b.newPage({viewport:{width:vp.w,height:900}});
  await p.goto(`${BASE}/commande/declaration-impots-retraite`,{waitUntil:'networkidle'});
  await p.waitForSelector('text=Comment souhaitez-vous');
  const n=await p.locator('input[name=modalite]').count();
  console.log(`${vp.n} : ${n} modalités proposées (attendu 4)`);
  if(n!==4) pbs.push(`${vp.n}: ${n} modalités`);
  await p.addScriptTag({content:axeSource});
  let res=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
  console.log(`  axe étape déroulement : ${res.violations.length}`);
  for(const v of res.violations){pbs.push(`${vp.n} ${v.id} ×${v.nodes.length}`);console.log(`    ! ${v.id} ×${v.nodes.length}`);}
  // Avancer sans choisir
  await p.getByRole('button',{name:'Continuer'}).click(); await p.waitForTimeout(250);
  console.log(`  bloqué sans choix : ${await p.locator('text=Comment souhaitez-vous').isVisible()}`);
  if(!(await p.locator('text=Comment souhaitez-vous').isVisible())) pbs.push(`${vp.n}: non bloqué`);
  // Choisir « à distance » : pas de zone demandée
  await p.locator('input[value=distance]').check(); await p.waitForTimeout(200);
  console.log(`  zone demandée pour « à distance » : ${await p.locator('select[name=zone]').count()>0}`);
  if(await p.locator('select[name=zone]').count()>0) pbs.push(`${vp.n}: zone demandée à distance`);
  // Choisir « sur place » : zone demandée
  await p.locator('input[value=domicile]').check(); await p.waitForTimeout(200);
  const zoneVisible = await p.locator('select[name=zone]').count()>0;
  console.log(`  zone demandée pour « sur place » : ${zoneVisible}`);
  if(!zoneVisible) pbs.push(`${vp.n}: zone non demandée sur place`);
  await p.getByRole('button',{name:'Continuer'}).click(); await p.waitForTimeout(250);
  console.log(`  bloqué sans zone : ${await p.locator('text=Comment souhaitez-vous').isVisible()}`);
  if(!(await p.locator('text=Comment souhaitez-vous').isVisible())) pbs.push(`${vp.n}: zone non exigée`);
  await p.locator('select[name=zone]').selectOption('nord-vaudois'); await p.waitForTimeout(200);
  // Frais inactifs : le total ne doit pas bouger
  const t=(await p.locator('aside .font-display.text-3xl').innerText()).trim();
  console.log(`  total avec zone à CHF 25 proposés, frais inactifs : ${t}`);
  if(t.includes('25') && !t.includes('249')) pbs.push(`${vp.n}: frais ajoutés alors qu'inactifs (${t})`);
  const of=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(of>1) pbs.push(`${vp.n}: débordement ${of}px`);
  console.log(`  débordement : ${of}px`);
  await p.close();
}
// Prestation sans choix : l'étape doit être absente
const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto(`${BASE}/commande/resiliation-abonnement`,{waitUntil:'networkidle'});
const sansChoix = await p.locator('text=Comment souhaitez-vous').count();
console.log(`\nprestation à distance seule : étape déroulement présente = ${sansChoix>0} (attendu false)`);
if(sansChoix>0) pbs.push('étape déroulement affichée sans alternative');
await p.close(); await b.close();
console.log('\n===== BILAN =====');
console.log(pbs.length?pbs.map(x=>'- '+x).join('\n'):'Aucun problème détecté.');
