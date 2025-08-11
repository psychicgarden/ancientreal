-- Create function to get user fractional investments with property details
CREATE OR REPLACE FUNCTION get_user_fractional_investments(wallet_address text)
RETURNS TABLE (
  id uuid,
  property_id uuid,
  investor_wallet_address text,
  investment_amount numeric,
  token_amount numeric,
  ownership_percentage numeric,
  investment_date timestamptz,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  property_name text,
  property_location text,
  property_image_url text,
  current_speculation_price numeric,
  monthly_base_rent numeric,
  total_tokens_available numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    fi.id,
    fi.property_id,
    fi.investor_wallet_address,
    fi.investment_amount,
    fi.token_amount,
    fi.ownership_percentage,
    fi.investment_date,
    fi.status,
    fi.created_at,
    fi.updated_at,
    pf.property_name,
    pf.property_location,
    pf.property_image_url,
    pf.current_speculation_price,
    pf.monthly_base_rent,
    pf.total_tokens_available
  FROM public.fractional_investments fi
  JOIN public.property_fractionalization pf ON fi.property_id = pf.id
  WHERE fi.investor_wallet_address = wallet_address
    AND fi.status = 'active'
  ORDER BY fi.created_at DESC;
$$;

-- Update property status when fractional investment is successful
UPDATE public.user_properties 
SET is_active = false,
    updated_at = now()
WHERE property_name ILIKE '%art deco%' 
  AND is_active = true;