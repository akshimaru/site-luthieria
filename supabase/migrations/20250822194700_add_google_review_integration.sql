-- Add google_review_id column to testimonials table for Google Reviews integration
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS google_review_id TEXT UNIQUE;

-- Create index for better performance when checking existing reviews
CREATE INDEX IF NOT EXISTS idx_testimonials_google_review_id 
ON testimonials(google_review_id);

-- Add comment to document the purpose
COMMENT ON COLUMN testimonials.google_review_id IS 'ID único da avaliação no Google My Business para evitar duplicatas';
