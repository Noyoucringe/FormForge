#!/bin/bash

# FormForge Build & Load Script
# This script builds the extension and provides instructions for loading it

echo "🔨 Building FormForge..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📦 Next steps:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' (tdsoggle in top right)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'dist' folder from this project"
    echo ""
    echo "📝 For development with hot reload:"
    echo "   npm run dev"
    echo ""
    echo "🧪 After loading, visit any form and click the FormForge icon!"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
