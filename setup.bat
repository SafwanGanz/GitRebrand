@echo off
REM GitHub Username Auto-Updater - Setup Script (Windows Batch)

echo.
echo ============================================================
echo   GitHub Username Auto-Updater - Setup Script
echo ============================================================
echo.

REM Check Node.js
echo [1/3] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo   OK Node.js %NODE_VERSION% detected
) else (
    echo   ERROR Node.js not found - Please install Node.js v18+
)
echo.

REM Check dependencies
echo [2/3] Checking dependencies...
if exist "node_modules\" (
    echo   OK Dependencies already installed
) else (
    echo   Installing dependencies...
    call npm install
    if %errorlevel% equ 0 (
        echo   OK Dependencies installed successfully
    ) else (
        echo   ERROR Failed to install dependencies
    )
)
echo.

REM Check .env
echo [3/3] Checking configuration...
if exist ".env" (
    findstr /C:"GITHUB_TOKEN=ghp_" .env >nul 2>&1
    if %errorlevel% equ 0 (
        echo   OK .env file configured with token
    ) else (
        echo   WARN .env file exists but token not configured
        echo        Edit .env and add: GITHUB_TOKEN=ghp_your_token
    )
) else (
    echo   WARN .env file not found
    if exist ".env.example" (
        copy ".env.example" ".env" >nul 2>&1
        echo   OK Created .env file from example
        echo      Edit .env and add your GitHub token
    )
)
echo.

REM Show commands
echo ============================================================
echo   Quick Start Commands
echo ============================================================
echo.
echo Show help:
echo   node index.js --help
echo.
echo Test with dry-run:
echo   node index.js --old olduser --new newuser --token ghp_xxx --dry-run
echo.
echo Run with .env:
echo   node index.js --dry-run
echo.
echo ============================================================
echo   Documentation
echo ============================================================
echo.
echo   README.md          - Full documentation
echo   QUICKSTART.md      - 5-minute setup guide
echo   TESTING.md         - Testing guide
echo   PROJECT_SUMMARY.md - Complete overview
echo.
echo   Get GitHub Token: https://github.com/settings/tokens
echo   Required scopes: repo, read:user
echo.
echo ============================================================
echo.
echo   Setup complete! Run: node index.js --help
echo.
pause
