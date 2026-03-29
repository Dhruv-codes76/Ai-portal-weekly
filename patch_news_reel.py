import re

with open('frontend/src/components/NewsReelItem.tsx', 'r') as f:
    content = f.read()

# 1. Update text styles to remove truncation (line-clamp-2 and line-clamp-3)
content = content.replace('line-clamp-2', '')
content = content.replace('line-clamp-3', '')

# 2. Update the buttons to be "Youtube style".
# The current buttons are:
# - Bookmark (Save)
# - Share2 (Share)
# - ArrowRight (Read Full Article)
# We want to remove "Read Full Article", add "Like", and style them like YouTube shorts actions (stacked vertically on right, or clean horizontal row if vertical isn't fit for reel).
# The prompt says: "overhaul the reels layout... remove the read button, add a like button... put buttons in youtube shapes like".

# Let's inspect NewsReelItem.tsx to see what it currently has:
