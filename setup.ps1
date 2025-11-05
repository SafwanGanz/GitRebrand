# GitHub Username Auto-Updater - Setup Script

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GitHub Username Auto-Updater - Setup Script" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/3] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK Node.js $nodeVersion detected" -ForegroundColor Green
} else {
    Write-Host "  ERROR Node.js not found" -ForegroundColor Red
}
Write-Host ""

# Check dependencies
Write-Host "[2/3] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  OK Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "  Installing dependencies..." -ForegroundColor White
    npm install | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "  ERROR Failed to install dependencies" -ForegroundColor Red
    }
}
Write-Host ""

# Check .env
Write-Host "[3/3] Checking configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "GITHUB_TOKEN=ghp_") {
        Write-Host "  OK .env file configured with token" -ForegroundColor Green
    } else {
        Write-Host "  WARN .env file exists but token not configured" -ForegroundColor Yellow
        Write-Host "       Edit .env and add: GITHUB_TOKEN=ghp_your_token" -ForegroundColor Gray
    }
} else {
    Write-Host "  WARN .env file not found" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  OK Created .env file from example" -ForegroundColor Green
        Write-Host "     Edit .env and add your GitHub token" -ForegroundColor Gray
    }
}
Write-Host ""

# Show commands
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Quick Start Commands" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Show help:" -ForegroundColor White
Write-Host "  node index.js --help" -ForegroundColor Gray
Write-Host ""
Write-Host "Test with dry-run:" -ForegroundColor White
Write-Host "  node index.js --old olduser --new newuser --token ghp_xxx --dry-run" -ForegroundColor Gray
Write-Host ""
Write-Host "Run with .env:" -ForegroundColor White
Write-Host "  node index.js --dry-run" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Documentation" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  README.md          - Full documentation" -ForegroundColor White
Write-Host "  QUICKSTART.md      - 5-minute setup guide" -ForegroundColor White
Write-Host "  TESTING.md         - Testing guide" -ForegroundColor White
Write-Host "  PROJECT_SUMMARY.md - Complete overview" -ForegroundColor White
Write-Host ""
Write-Host "  Get GitHub Token: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "  Required scopes: repo, read:user" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Setup complete! Run: node index.js --help" -ForegroundColor Green
Write-Host ""
