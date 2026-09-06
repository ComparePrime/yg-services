import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

/**
 * Image de partage générée au build (Open Graph et Twitter Card).
 * Next.js l'applique automatiquement à toutes les pages du site.
 *
 * Le logo est lu depuis le disque et intégré en base64 : `ImageResponse` ne
 * peut pas résoudre un chemin relatif au moment de la génération.
 */
export const alt = 'YG Services — Création web, administration & optimisation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function logoDataUri() {
  const file = path.join(process.cwd(), 'public', 'images', 'logo-yg-horizontal-clair.png');
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#12161d',
          padding: '78px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri()} alt="" width={380} height={81} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#ffffff', fontSize: 64, lineHeight: 1.1 }}>
            {siteConfig.signature}
          </span>
          <span style={{ color: '#6fa1c8', fontSize: 32, marginTop: 26 }}>
            {siteConfig.positioning}
          </span>
        </div>

        <span style={{ color: '#8592a3', fontSize: 25 }}>
          {siteConfig.person.fullName} — {siteConfig.location.short}
        </span>
      </div>
    ),
    size,
  );
}
