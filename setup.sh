#!/bin/bash
# GitHub Username Auto-Updater - Setup Script (Linux/macOS)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  GitHub Username Auto-Updater - Setup Script${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}[1/3] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}  OK Node.js $NODE_VERSION detected${NC}"
else
    echo -e "${RED}  ERROR Node.js not found - Please install Node.js v18+${NC}"
fi
echo ""

# Check dependencies
echo -e "${YELLOW}[2/3] Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}  OK Dependencies already installed${NC}"
else
    echo -e "  Installing dependencies..."
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  OK Dependencies installed successfully${NC}"
    else
        echo -e "${RED}  ERROR Failed to install dependencies${NC}"
    fi
fi
echo ""

# Check .env
echo -e "${YELLOW}[3/3] Checking configuration...${NC}"
if [ -f ".env" ]; then
    if grep -q "GITHUB_TOKEN=ghp_" .env; then
        echo -e "${GREEN}  OK .env file configured with token${NC}"
    else
        echo -e "${YELLOW}  WARN .env file exists but token not configured${NC}"
        echo -e "${GRAY}       Edit .env and add: GITHUB_TOKEN=ghp_your_token${NC}"
    fi
else
    echo -e "${YELLOW}  WARN .env file not found${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}  OK Created .env file from example${NC}"
        echo -e "${GRAY}     Edit .env and add your GitHub token${NC}"
    fi
fi
echo ""

# Show commands
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  Quick Start Commands${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo "Show help:"
echo -e "${GRAY}  node index.js --help${NC}"
echo ""
echo "Test with dry-run:"
echo -e "${GRAY}  node index.js --old olduser --new newuser --token ghp_xxx --dry-run${NC}"
echo ""
echo "Run with .env:"
echo -e "${GRAY}  node index.js --dry-run${NC}"
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  Documentation${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo "  README.md          - Full documentation"
echo "  QUICKSTART.md      - 5-minute setup guide"
echo "  TESTING.md         - Testing guide"
echo "  PROJECT_SUMMARY.md - Complete overview"
echo ""
echo "  Get GitHub Token: https://github.com/settings/tokens"
echo "  Required scopes: repo, read:user"
echo ""
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "${GREEN}  Setup complete! Run: node index.js --help${NC}"
echo ""
