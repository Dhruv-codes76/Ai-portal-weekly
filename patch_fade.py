import re

with open('frontend/src/components/NewsCard/index.tsx', 'r') as f:
    content = f.read()

# Fix the gradient overlay to match the light/dark mode changes
# Replace `from-black/95 via-black/80 to-transparent` with responsive colors
content = content.replace(
    'from-black/95 via-black/80 to-transparent',
    'from-white via-white/80 to-transparent dark:from-black/95 dark:via-black/80 dark:to-transparent'
)

with open('frontend/src/components/NewsCard/index.tsx', 'w') as f:
    f.write(content)
