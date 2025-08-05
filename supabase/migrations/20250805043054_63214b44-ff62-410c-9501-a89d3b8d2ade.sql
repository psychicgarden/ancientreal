-- Add 'presale' as a valid project status
ALTER TABLE developer_projects DROP CONSTRAINT IF EXISTS developer_projects_project_status_check;
ALTER TABLE developer_projects ADD CONSTRAINT developer_projects_project_status_check 
  CHECK (project_status IN ('active', 'completed', 'cancelled', 'presale'));