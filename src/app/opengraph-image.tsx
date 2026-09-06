import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

/**
 * Image de partage générée au build (Open Graph et Twitter Card).
 * Next.js l'applique automatiquement à toutes les pages du site.
 */
export const alt = 'YG Services — Création web, administration & optimisation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
          <span style={{ color: '#ffffff', fontSize: 44, fontWeight: 700 }}>YG</span>
          <span style={{ color: '#8592a3', fontSize: 26, letterSpacing: '6px' }}>SERVICES</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#ffffff', fontSize: 68, lineHeight: 1.1 }}>
            {siteConfig.signature}
          </span>
          <span style={{ color: '#cd8c4c', fontSize: 34, marginTop: 28 }}>
            {siteConfig.positioning}
          </span>
        </div>

        <span style={{ color: '#667488', fontSize: 26 }}>
          {siteConfig.person.fullName} — {siteConfig.location.short}
        </span>
      </div>
    ),
    size,
  );
}
