const fs = require('fs');
const file = 'frontend/src/app/globals.css';
let css = fs.readFileSync(file, 'utf8');

// The user specifically wants YouTube Music app live blur gradient background on the whole body, not just hover.
// We manipulate .dark to add gradient background that looks like YouTube Music (dark with color blobs)
css = css.replace(
  /\.dark\s*{[\s\S]*?--background:\s*#000000;[\s\S]*?}/,
  `.dark {
    /* AMOLED friendly deep black with YouTube Music style gradient */
    --background: radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.05), transparent 25%), #000000;
    --foreground: #F5F5F7; /* Apple-like off-white */
    --card: rgba(255, 255, 255, 0.05);
    --card-foreground: #F5F5F7;
    --muted: rgba(255, 255, 255, 0.08);
    --muted-foreground: #A1A1AA;
    --border: rgba(255, 255, 255, 0.12);
  }`
);

// We need to make the body support live blur of the content passing under header, or just live blur elements.
// To get the "live blur" finish on cards (since we already have gradient on background)
css = css.replace(
  /--card:\s*rgba\(255, 255, 255, 0\.05\);/,
  `--card: rgba(255, 255, 255, 0.05);\n    backdrop-filter: blur(20px);\n    -webkit-backdrop-filter: blur(20px);`
);

fs.writeFileSync(file, css, 'utf8');
console.log('CSS updated successfully.');
