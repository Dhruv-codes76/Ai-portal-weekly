import re

with open('frontend/src/components/NewsCard/index.tsx', 'r') as f:
    content = f.read()

# Replace the specific hover:text-gray-900 dark:text-white issue in buttons
content = content.replace("hover:text-gray-900 dark:text-white", "hover:text-gray-900 dark:hover:text-white")

with open('frontend/src/components/NewsCard/index.tsx', 'w') as f:
    f.write(content)
