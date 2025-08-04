-- Update existing developer projects to have proper minimum investment and fix image URLs
UPDATE developer_projects 
SET 
  min_investment = 70000,
  image_url = CASE 
    WHEN image_url LIKE '%apartment-greece%' THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
    WHEN image_url LIKE '%villa-bali%' THEN 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
    WHEN image_url LIKE '%beach-house%' THEN 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80'
    WHEN image_url LIKE '%villa-mexico%' THEN 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80'
    WHEN image_url LIKE '%coworking%' THEN 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    WHEN image_url LIKE '%desert-oasis%' THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ELSE 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80'
  END
WHERE image_url IS NOT NULL;