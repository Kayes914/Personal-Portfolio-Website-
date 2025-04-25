-- Create hero_settings table
CREATE TABLE IF NOT EXISTS public.hero_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    available_text TEXT NOT NULL DEFAULT 'I''m available for new projects',
    busy_text TEXT NOT NULL DEFAULT 'I''m really busy right now',
    offline_text TEXT NOT NULL DEFAULT 'I''m currently offline',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_settings_updated_at
    BEFORE UPDATE ON public.hero_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default row if not exists
INSERT INTO public.hero_settings (id, status, available_text, busy_text, offline_text)
VALUES ('00000000-0000-0000-0000-000000000000', 'available', 'I''m available for new projects', 'I''m really busy right now', 'I''m currently offline')
ON CONFLICT (id) DO NOTHING; 