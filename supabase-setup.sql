-- Supabase Database Setup for Project Likes System
-- Run this SQL in your Supabase SQL Editor

-- 1. Create project_likes table
CREATE TABLE IF NOT EXISTS project_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  liked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 2. Create project_stats table
CREATE TABLE IF NOT EXISTS project_stats (
  project_id TEXT PRIMARY KEY,
  total_likes INTEGER DEFAULT 0,
  unique_likers INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON project_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_liked ON project_likes(liked);

-- 4. Create function to update project stats
CREATE OR REPLACE FUNCTION update_project_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update stats for the affected project
  INSERT INTO project_stats (project_id, total_likes, unique_likers, last_updated)
  SELECT 
    COALESCE(NEW.project_id, OLD.project_id),
    COUNT(*) FILTER (WHERE liked = true),
    COUNT(DISTINCT user_id) FILTER (WHERE liked = true),
    NOW()
  FROM project_likes 
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  ON CONFLICT (project_id) 
  DO UPDATE SET 
    total_likes = EXCLUDED.total_likes,
    unique_likers = EXCLUDED.unique_likers,
    last_updated = EXCLUDED.last_updated;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to automatically update stats
DROP TRIGGER IF EXISTS trigger_update_project_stats ON project_likes;
CREATE TRIGGER trigger_update_project_stats
  AFTER INSERT OR UPDATE OR DELETE ON project_likes
  FOR EACH ROW EXECUTE FUNCTION update_project_stats();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stats ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
-- Allow anyone to read project_likes
CREATE POLICY "Anyone can read project_likes" ON project_likes
  FOR SELECT USING (true);

-- Allow anyone to insert/update their own likes
CREATE POLICY "Anyone can manage their own likes" ON project_likes
  FOR ALL USING (true);

-- Allow anyone to read project_stats
CREATE POLICY "Anyone can read project_stats" ON project_stats
  FOR SELECT USING (true);

-- 8. Insert some sample project stats (optional)
INSERT INTO project_stats (project_id, total_likes, unique_likers) VALUES
  ('kişisel-portfolyo', 0, 0),
  ('online-grocery-app', 0, 0),
  ('döviz-kuru-takip-uygulaması', 0, 0),
  ('payment-form-application', 0, 0),
  ('currency-exchange-tracking-app', 0, 0)
ON CONFLICT (project_id) DO NOTHING;
