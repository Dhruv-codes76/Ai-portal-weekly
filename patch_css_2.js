const fs = require('fs');
const file = 'frontend/src/app/globals.css';
let css = fs.readFileSync(file, 'utf8');

// The original plan step specifically requested updating `.dark .premium-hover:hover`
// I will apply this requested update as well, although I've also done a body gradient.
css = css.replace(
  /background:\s*linear-gradient\(145deg,\s*rgba\(255,255,255,0\.08\),\s*rgba\(255,255,255,0\.02\)\);/,
  `background: linear-gradient(145deg, rgba(255, 0, 128, 0.1), rgba(0, 128, 255, 0.1));`
);

fs.writeFileSync(file, css, 'utf8');
console.log('CSS updated successfully.');
