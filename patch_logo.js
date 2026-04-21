const fs = require('fs');
const file = 'frontend/src/components/Logo.tsx';
let logo = fs.readFileSync(file, 'utf8');

// Replace the mounted check and conditional logic
logo = logo.replace(
  /const \[mounted, setMounted\] = useState\(false\);[\s\S]*?const altText = variant === "full"\? "AI Portal Logo" : "AI Portal Icon";/,
  `// Removed mounted state for faster initial render
    const altText = variant === "full" ? "AI Portal Logo" : "AI Portal Icon";`
);

// Replace the img tag with two img tags utilizing tailwind dark mode display utilities
logo = logo.replace(
  /\{\/\* eslint-disable-next-line @next\/next\/no-img-element \*\/\}[\s\S]*?<img[\s\S]*?src=\{imgSrc\}[\s\S]*?alt=\{altText\}[\s\S]*?className=\{`\$\{sizeClasses\[size\]\} object-contain bg-transparent transition-colors duration-300 ease-in-out`\}[\s\S]*?\/>/,
  `{/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={variant === "full" ? "/logos/logo-full-light.png" : "/logos/logo-icon-light.png"}
                alt={altText}
                className={\`\${sizeClasses[size]} object-contain bg-transparent transition-colors duration-300 ease-in-out block dark:hidden\`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={variant === "full" ? "/logos/logo-full-dark.png" : "/logos/logo-icon-dark.png"}
                alt={altText}
                className={\`\${sizeClasses[size]} object-contain bg-transparent transition-colors duration-300 ease-in-out hidden dark:block\`}
            />`
);

fs.writeFileSync(file, logo, 'utf8');
console.log('Logo updated successfully.');
