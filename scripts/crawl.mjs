import { createRequire } from 'module';
const r = createRequire(import.meta.url);
const { chromium } = r('playwright');
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const b = await chromium.launch();
const p = await b.newPage();
const vus = new Set(), file = ['/'], pbs = [];
while (file.length) {
  const u = file.shift();
  if (vus.has(u)) continue; vus.add(u);
  const res = await p.goto(BASE + u, { waitUntil: 'domcontentloaded' });
  const st = res?.status() ?? 0;
  if (st >= 400) { pbs.push(`${u} → HTTP ${st}`); continue; }
  const h1 = await p.locator('h1').count();
  if (h1 !== 1) pbs.push(`${u} → ${h1} H1`);
  const t = await p.title();
  if (!t) pbs.push(`${u} → titre vide`);
  if ([...t].length > 65) pbs.push(`${u} → titre ${[...t].length} car.`);
  const d = await p.locator('meta[name=description]').getAttribute('content').catch(() => null);
  if (d && [...d].length > 165) pbs.push(`${u} → description ${[...d].length} car.`);
  const liens = await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const l of liens) if (l?.startsWith('/') && !l.startsWith('//')) file.push(l.split('#')[0].split('?')[0]);
}
await b.close();
console.log(`${vus.size} URL parcourues`);
console.log(pbs.length ? pbs.map(x=>'- '+x).join('\n') : 'Aucune anomalie.');
