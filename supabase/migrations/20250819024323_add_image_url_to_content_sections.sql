-- Add image_url column to content_sections table
ALTER TABLE content_sections 
ADD COLUMN image_url TEXT;

-- Update the RLS (Row Level Security) policies if needed
-- The existing policies should still work since we're just adding a nullable column
