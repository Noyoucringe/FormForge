@echo off
REM FormForge Build & Load Script for Windows

echo 🔨 Building FormForge...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo 📦 Next steps:
    echo 1. Open Chrome and go to chrome://extensions/
    echo 2. Enable 'Developer mode' (toggle in top right)
    echo 3. Click 'Load unpacked'
    echo 4. Select the 'dist' folder from this project
    echo.
    echo 📝 For development with hot reload:
    echo    npm run dev
    echo.
    echo 🧪 After loading, visit any form and click the FormForge icon!
) else (
    echo ❌ Build failed. Check errors above.
    exit /b 1
)
