import re

with open('frontend/src/components/NewsCard/index.tsx', 'r') as f:
    content = f.read()

# Make the NewsCard background a visually appealing gradient instead of flat black/95
content = content.replace(
    'bg-white dark:bg-black/95',
    'bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black'
)

with open('frontend/src/components/NewsCard/index.tsx', 'w') as f:
    f.write(content)
