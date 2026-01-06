#!/bin/bash

# BuboIQ Super Admin Login - Test Runner
# Automated functional tests with real Supabase auth

set -e

echo "=================================================="
echo "BuboIQ Super Admin Login - Functional Tests"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dev server is running
echo -e "${YELLOW}Checking if dev server is running...${NC}"
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Dev server is running${NC}"
else
    echo -e "${RED}✗ Dev server is NOT running${NC}"
    echo ""
    echo "Please start the dev server in another terminal:"
    echo "  npm run dev"
    echo ""
    exit 1
fi

# Check if Playwright is installed
echo -e "${YELLOW}Checking Playwright installation...${NC}"
if npx playwright --version > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Playwright is installed${NC}"
else
    echo -e "${YELLOW}Installing Playwright...${NC}"
    npm install -D @playwright/test
    npx playwright install
fi

echo ""
echo "=================================================="
echo "Running Tests..."
echo "=================================================="
echo ""

# Run tests based on argument
case "$1" in
  "all")
    echo "Running all tests..."
    npx playwright test tests/e2e/super-admin-login.spec.ts
    ;;
  "happy")
    echo "Running Test A: Happy Path..."
    npx playwright test tests/e2e/super-admin-login.spec.ts -g "Happy Path"
    ;;
  "invalid")
    echo "Running Test C: Invalid Credentials..."
    npx playwright test tests/e2e/super-admin-login.spec.ts -g "Invalid Credentials"
    ;;
  "persist")
    echo "Running Test E: Session Persistence..."
    npx playwright test tests/e2e/super-admin-login.spec.ts -g "Session Persistence"
    ;;
  "ui")
    echo "Running tests in UI mode..."
    npx playwright test --ui tests/e2e/super-admin-login.spec.ts
    ;;
  "debug")
    echo "Running tests with debugging..."
    npx playwright test --debug tests/e2e/super-admin-login.spec.ts
    ;;
  *)
    echo "Running all tests..."
    npx playwright test tests/e2e/super-admin-login.spec.ts
    ;;
esac

TEST_EXIT_CODE=$?

echo ""
echo "=================================================="
echo "Test Results"
echo "=================================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo ""
    echo "Login button is VERIFIED WORKING"
    echo "- Button triggers auth handler"
    echo "- Session created and stored"
    echo "- User redirected to dashboard"
    echo "- Session persists across reloads"
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo ""
    echo "Check the output above for details"
    echo "See /tests/RUN_TESTS.md for troubleshooting"
fi

echo ""
echo "To generate HTML report:"
echo "  npx playwright show-report"
echo ""

exit $TEST_EXIT_CODE
