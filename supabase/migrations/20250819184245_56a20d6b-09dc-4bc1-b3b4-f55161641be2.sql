-- Create function to reset developer projects funding for testing
CREATE OR REPLACE FUNCTION reset_developer_project_funding(p_project_id uuid DEFAULT NULL)
RETURNS jsonb AS $$
DECLARE
  v_reset_count integer := 0;
  v_result jsonb;
BEGIN
  -- If specific project ID provided, reset only that project
  IF p_project_id IS NOT NULL THEN
    UPDATE developer_projects 
    SET current_funding = 0, updated_at = now()
    WHERE id = p_project_id;
    
    GET DIAGNOSTICS v_reset_count = ROW_COUNT;
    
    -- Also delete all investments for this project
    DELETE FROM developer_investments 
    WHERE project_id = p_project_id;
    
  ELSE
    -- Reset all projects to low funding for testing
    UPDATE developer_projects 
    SET current_funding = CASE 
      WHEN target_funding > 0 THEN target_funding * 0.15  -- Set to 15% funding
      ELSE 0 
    END,
    updated_at = now();
    
    GET DIAGNOSTICS v_reset_count = ROW_COUNT;
    
    -- Delete all developer investments
    DELETE FROM developer_investments;
  END IF;
  
  -- Return summary
  v_result := jsonb_build_object(
    'reset_projects', v_reset_count,
    'project_id', COALESCE(p_project_id::text, 'all'),
    'timestamp', now()
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;