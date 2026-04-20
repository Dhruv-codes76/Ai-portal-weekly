import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'AI Portal Weekly';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse components must be Vercel's Satori compatible
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #000000, #111111)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter',
        }}
      >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '60px 80px',
                borderRadius: '40px',
                background: 'rgba(255, 255, 255, 0.03)',
            }}
        >
            <div 
                style={{ 
                    fontSize: '84px', 
                    fontWeight: 800,
                    marginBottom: '20px',
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                    backgroundClip: 'text',
                    color: 'transparent',
                }}
            >
                AI Portal Weekly
            </div>
            <div 
                style={{ 
                    fontSize: '32px', 
                    color: '#94a3b8',
                    maxWidth: '700px',
                    textAlign: 'center',
                    fontWeight: 400,
                    lineHeight: 1.4,
                }}
            >
                Honest AI intelligence and curated tools for India's next-gen tech workforce.
            </div>
        </div>
        
        <div 
            style={{ 
                position: 'absolute',
                bottom: '40px',
                fontSize: '24px',
                color: '#475569',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
            }}
        >
            www.aiportalweekly.com
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
