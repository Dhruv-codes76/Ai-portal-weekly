import re

with open('frontend/src/components/NewsReelItem.tsx', 'r') as f:
    content = f.read()

# Make sure Heart is actually in the lucide-react import
if 'Heart' not in content[:500]:
    content = content.replace('Share2,', 'Share2, Heart,')

with open('frontend/src/components/NewsReelItem.tsx', 'w') as f:
    f.write(content)
