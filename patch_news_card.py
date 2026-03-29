import re

with open('frontend/src/components/NewsCard/index.tsx', 'r') as f:
    content = f.read()

# Replace text-white and other fixed dark mode colors with proper dark: variants
content = content.replace('text-white', 'text-gray-900 dark:text-white')
content = content.replace('text-gray-300', 'text-gray-600 dark:text-gray-300')
content = content.replace('text-gray-400', 'text-gray-500 dark:text-gray-400')
content = content.replace('bg-black/95', 'bg-white dark:bg-black/95')
content = content.replace('border-white/10', 'border-gray-200 dark:border-white/10')
content = content.replace('hover:bg-white/10', 'hover:bg-gray-100 dark:hover:bg-white/10')

# Restore category/source badge text colors since they have colored backgrounds
content = content.replace('bg-black/60 backdrop-blur-md text-gray-900 dark:text-white', 'bg-black/60 backdrop-blur-md text-white')
content = content.replace('bg-blue-600/80 text-gray-900 dark:text-white', 'bg-blue-600/80 text-white')
content = content.replace('bg-orange-600/80 text-gray-900 dark:text-white', 'bg-orange-600/80 text-white')
content = content.replace('bg-gradient-to-r from-purple-600/80 to-blue-500/80 text-gray-900 dark:text-white', 'bg-gradient-to-r from-purple-600/80 to-blue-500/80 text-white')

with open('frontend/src/components/NewsCard/index.tsx', 'w') as f:
    f.write(content)
