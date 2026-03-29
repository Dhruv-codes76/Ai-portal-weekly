import re

with open('frontend/src/components/NewsReelItem.tsx', 'r') as f:
    content = f.read()

# Replace unused ExternalLink with Heart
content = content.replace('ExternalLink,', '')

with open('frontend/src/components/NewsReelItem.tsx', 'w') as f:
    f.write(content)
