#!/bin/bash
echo "🚀 Starting RAM Optimization..."

# 1. Clean Next.js cache
if [ -d "frontend/.next" ]; then
    echo "🧹 Cleaning Next.js build cache..."
    rm -rf frontend/.next
fi

# 2. Clean Node Modules cache (safe)
echo "🧹 Cleaning npm/yarn caches..."
rm -rf frontend/node_modules/.cache
rm -rf backend/node_modules/.cache

# 3. Prisma generated files (if they exist)
if [ -d "backend/src/generated" ]; then
    echo "🧹 Cleaning generated Prisma files..."
    rm -rf backend/src/generated
fi

echo "✅ Clean up complete! Restart your editor if it still feels slow."
echo "💡 Tip: Only open ONE workspace folder to significantly reduce RAM usage."
