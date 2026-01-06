#!/bin/bash

# BuboIQ Coming Soon Mode Verification
# Run this script to verify the Coming Soon implementation

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 BuboIQ Coming Soon Mode Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check feature flag status
echo "📋 Checking Feature Flag Status..."
if grep -q "BILLING_ENABLED: false" utils/feature-flags.ts; then
    echo -e "${GREEN}✓${NC} Billing is DISABLED (Coming Soon mode active)"
    BILLING_STATUS="disabled"
else
    echo -e "${YELLOW}⚠${NC} Billing is ENABLED (Normal mode)"
    BILLING_STATUS="enabled"
fi
echo ""

# Check required files exist
echo "📁 Verifying Required Files..."

files=(
    "utils/feature-flags.ts"
    "components/marketing/ComingSoonModal.tsx"
    "components/marketing/HomePage.tsx"
    "components/marketing/StripePricingPageV2.tsx"
    "components/settings/BillingSettings.tsx"
    "App.tsx"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
        all_files_exist=false
    fi
done
echo ""

# Check for feature flag imports
echo "🔍 Checking Feature Flag Integration..."

components=(
    "components/marketing/HomePage.tsx"
    "components/marketing/StripePricingPageV2.tsx"
    "components/settings/BillingSettings.tsx"
    "App.tsx"
)

all_imports_present=true
for component in "${components[@]}"; do
    if grep -q "isBillingEnabled" "$component" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $component uses isBillingEnabled()"
    else
        echo -e "${RED}✗${NC} $component missing isBillingEnabled()"
        all_imports_present=false
    fi
done
echo ""

# Check for ComingSoonModal usage
echo "🎨 Checking ComingSoonModal Integration..."

modal_components=(
    "components/marketing/HomePage.tsx"
    "components/marketing/StripePricingPageV2.tsx"
    "components/settings/BillingSettings.tsx"
    "App.tsx"
)

all_modals_present=true
for component in "${modal_components[@]}"; do
    if grep -q "ComingSoonModal" "$component" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $component renders ComingSoonModal"
    else
        echo -e "${RED}✗${NC} $component missing ComingSoonModal"
        all_modals_present=false
    fi
done
echo ""

# Check Coming Soon configuration
echo "⚙️  Checking Configuration..."
if grep -q "ctaAction" utils/feature-flags.ts; then
    echo -e "${GREEN}✓${NC} Coming Soon config present"
    
    # Extract CTA action
    CTA_ACTION=$(grep "ctaAction:" utils/feature-flags.ts | head -1 | cut -d'"' -f2)
    if [[ $CTA_ACTION == mailto:* ]]; then
        echo -e "${GREEN}✓${NC} CTA uses mailto (waitlist email)"
    elif [[ $CTA_ACTION == http* ]]; then
        echo -e "${GREEN}✓${NC} CTA uses URL (external form)"
    else
        echo -e "${YELLOW}⚠${NC} CTA action format: $CTA_ACTION"
    fi
else
    echo -e "${RED}✗${NC} Coming Soon config missing"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$all_files_exist" = true ] && [ "$all_imports_present" = true ] && [ "$all_modals_present" = true ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    
    if [ "$BILLING_STATUS" = "disabled" ]; then
        echo -e "${GREEN}🎉 Coming Soon Mode is ACTIVE and properly configured${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Test locally: npm run dev"
        echo "  2. Click 'Start free 14-day trial' → Should show Coming Soon modal"
        echo "  3. Deploy to production: vercel --prod"
        echo "  4. When ready to enable billing:"
        echo "     • Edit utils/feature-flags.ts"
        echo "     • Change BILLING_ENABLED: false → true"
        echo "     • Deploy"
    else
        echo -e "${YELLOW}⚠️  Implementation is correct, but billing is ENABLED${NC}"
        echo ""
        echo "To activate Coming Soon mode:"
        echo "  • Edit utils/feature-flags.ts"
        echo "  • Change BILLING_ENABLED: true → false"
        echo "  • Deploy"
    fi
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo "Please review the errors above and fix missing files/imports."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Documentation:"
echo "  • Full guide: COMING_SOON_MODE.md"
echo "  • Deployment: DEPLOY_WITH_COMING_SOON.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
