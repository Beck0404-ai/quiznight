-- SDY Dornogovi Quiz Night - Supabase Table Setup
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/iiybfbllhnklczhjiqts/sql

CREATE TABLE IF NOT EXISTS public.quiz_state (
  id TEXT PRIMARY KEY DEFAULT 'active_game',
  current_slide INTEGER DEFAULT 0,
  teams JSONB DEFAULT '[]'::jsonb,
  revealed_answers JSONB DEFAULT '{}'::jsonb,
  chosen_options JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quiz_state ENABLE ROW LEVEL SECURITY;

-- Allow public read and write access for the quiz night game
CREATE POLICY "Allow public read quiz_state" 
ON public.quiz_state FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert/update quiz_state" 
ON public.quiz_state FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Insert initial row if not exists
INSERT INTO public.quiz_state (id) 
VALUES ('active_game') 
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime for instant live sync between projector and presenter
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_state;
