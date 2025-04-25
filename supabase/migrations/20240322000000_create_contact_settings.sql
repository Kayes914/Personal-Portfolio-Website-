-- Create contact_settings table
CREATE TABLE IF NOT EXISTS contact_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Let''s Connect',
    description TEXT NOT NULL DEFAULT 'Feel free to reach out through any of these channels',
    email TEXT NOT NULL DEFAULT 'your.email@example.com',
    phone TEXT NOT NULL DEFAULT '+1 234 567 890',
    location TEXT NOT NULL DEFAULT 'Your Location, Country',
    social_links JSONB NOT NULL DEFAULT '{
        "github": "https://github.com/yourusername",
        "linkedin": "https://linkedin.com/in/yourusername",
        "twitter": "https://twitter.com/yourusername",
        "facebook": "https://facebook.com/yourusername"
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_settings_updated_at
    BEFORE UPDATE ON contact_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default row if not exists
INSERT INTO contact_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM contact_settings); 