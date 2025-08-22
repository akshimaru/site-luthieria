-- Create analytics tables for visitor tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  os TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0
);

-- Create visitors table to track unique visitors
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_page_views INTEGER DEFAULT 1,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  is_returning BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_session_id ON visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON visitors(first_visit DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/insert for analytics
CREATE POLICY "Allow public insert on page_views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on visitors" ON visitors
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins) to read analytics data
CREATE POLICY "Allow authenticated read on page_views" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on visitors" ON visitors
  FOR SELECT USING (auth.role() = 'authenticated');
