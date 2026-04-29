const fs = require('fs');
const file = 'frontend/src/app/globals.css';
let css = fs.readFileSync(file, 'utf8');

// Replace the .dark block
css = css.replace(
  /\.dark\s*{[\s\S]*?--border:\s*rgba\(255, 255, 255, 0\.1\);\s*}/,
  `.dark {
    /* AMOLED friendly deep black */
    --background: #000000;
    --foreground: #F5F5F7; /* Apple-like off-white */
    --card: rgba(255, 255, 255, 0.05);
    --card-foreground: #F5F5F7;
    --muted: rgba(255, 255, 255, 0.08);
    --muted-foreground: #A1A1AA;
    --border: rgba(255, 255, 255, 0.12);
  }`
);

// Replace the premium-hover base class transition
css = css.replace(
  /\.premium-hover\s*{\s*transition:\s*transform 0\.2s cubic-bezier\(0\.4, 0, 0\.2, 1\), box-shadow 0\.2s cubic-bezier\(0\.4, 0, 0\.2, 1\);\s*will-change:\s*transform;\s*}/,
  `.premium-hover {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, background, backdrop-filter;
  }`
);

// Replace the hover block for dark theme
css = css.replace(
  /\.dark\s*\.premium-hover:hover\s*{\s*box-shadow:\s*0 0 15px rgba\(255, 255, 255, 0\.05\);\s*}/,
  `.dark .premium-hover:hover {
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
      background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }`
);

fs.writeFileSync(file, css, 'utf8');
console.log('CSS updated successfully.');
