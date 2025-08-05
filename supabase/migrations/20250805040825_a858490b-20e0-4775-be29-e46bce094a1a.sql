-- Clean up duplicate test investments, keeping only the most recent one
DELETE FROM developer_investments 
WHERE user_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94' 
  AND project_id = '2a80599f-7664-4b99-b582-e7cc4de4c12d'
  AND id NOT IN (
    SELECT id FROM developer_investments 
    WHERE user_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94' 
      AND project_id = '2a80599f-7664-4b99-b582-e7cc4de4c12d'
    ORDER BY created_at DESC 
    LIMIT 1
  );