-- BuboIQ Stripe Billing Integration Schema
-- Add Stripe-related columns to support subscription billing

-- Add Stripe columns to orgs table (idempotent - safe to run multiple times)
ALTER TABLE orgs 
ADD COLUMN IF NOT EXISTS tier text DEFAULT 'Starter' CHECK (tier IN ('Starter','Pro','Team'));

ALTER TABLE orgs 
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

ALTER TABLE orgs 
ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Add Stripe columns to users table as fallback (if orgs table doesn't exist)
-- This is for backward compatibility with existing systems
DO $$ 
BEGIN
    -- Check if users table exists and add columns if needed
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS tier text DEFAULT 'Starter' CHECK (tier IN ('Starter','Pro','Team'));
        
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS stripe_customer_id text;
        
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
    END IF;
END $$;

-- Index for faster Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_orgs_stripe_customer ON orgs(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_orgs_stripe_subscription ON orgs(stripe_subscription_id);

-- If users table exists, add indexes there too
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
        CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription ON users(stripe_subscription_id);
    END IF;
END $$;

COMMENT ON COLUMN orgs.tier IS 'Subscription tier: Starter, Pro, or Team';
COMMENT ON COLUMN orgs.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN orgs.stripe_subscription_id IS 'Active Stripe subscription ID';