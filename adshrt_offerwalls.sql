-- SQL Script to add offerwall settings with actual credentials
-- CPAGrip and AdBlueMedia configurations from previous project

-- Insert CPAGrip offerwall settings
INSERT INTO offerwall_settings (id, network, is_enabled, api_key, secret_key, user_id, postback_url, updated_at)
VALUES (
  gen_random_uuid(),
  'cpagrip',
  true,
  '35b59eb1af2454f46fe63ad7d34f923b',  -- CPAGrip API Key
  '35b59eb1af2454f46fe63ad7d34f923b',  -- CPAGrip Secret Key
  '621093',  -- CPAGrip User ID
  NULL,  -- Default postback URL will be used (/api/postback/cpagrip)
  NOW()
)
ON CONFLICT (network) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  api_key = EXCLUDED.api_key,
  secret_key = EXCLUDED.secret_key,
  user_id = EXCLUDED.user_id,
  updated_at = NOW();

-- Insert AdBlueMedia (AdGate Media) offerwall settings
INSERT INTO offerwall_settings (id, network, is_enabled, api_key, secret_key, user_id, postback_url, updated_at)
VALUES (
  gen_random_uuid(),
  'adbluemedia',
  true,
  'f24063d0d801e4daa846e9da4454c467',  -- AdBlueMedia API Key
  'f24063d0d801e4daa846e9da4454c467',  -- AdBlueMedia Secret Key
  '518705',  -- AdBlueMedia Wall ID
  NULL,  -- Default postback URL will be used (/api/postback/adbluemedia)
  NOW()
)
ON CONFLICT (network) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  api_key = EXCLUDED.api_key,
  secret_key = EXCLUDED.secret_key,
  user_id = EXCLUDED.user_id,
  updated_at = NOW();

-- Verify the inserted settings
SELECT network, is_enabled, 
       CASE WHEN api_key IS NOT NULL THEN 'Set' ELSE 'Not Set' END as api_key_status,
       CASE WHEN user_id IS NOT NULL THEN 'Set' ELSE 'Not Set' END as user_id_status
FROM offerwall_settings;
