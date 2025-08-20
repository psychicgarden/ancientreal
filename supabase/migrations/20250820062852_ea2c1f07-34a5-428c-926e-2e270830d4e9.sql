-- Phase 2: Selective Reset - Remove only mock user properties while preserving platform data
BEGIN;

-- Delete mock user properties (they'll be archived automatically by triggers if any exist)
DELETE FROM user_properties;

-- Delete related user transactions (only those tied to property purchases)
DELETE FROM user_transactions 
WHERE transaction_type IN ('property_purchase', 'purchase');

-- Reset tokens_sold for fractional properties to 0 (clean slate for real purchases)
UPDATE property_fractionalization 
SET tokens_sold = 0, updated_at = now();

-- Verify what we preserved (should show existing developer projects, fractional properties)
SELECT 'Platform Status After Reset' as status,
  (SELECT COUNT(*) FROM developer_projects WHERE project_status = 'active') as active_developer_projects,
  (SELECT COUNT(*) FROM developer_investments WHERE investment_status = 'active') as active_developer_investments,
  (SELECT COUNT(*) FROM property_fractionalization WHERE is_active = true) as active_fractional_properties,
  (SELECT COUNT(*) FROM fractional_investments WHERE status = 'active') as active_fractional_investments,
  (SELECT COUNT(*) FROM user_properties) as remaining_user_properties,
  (SELECT COUNT(*) FROM user_transactions) as remaining_transactions;

COMMIT;