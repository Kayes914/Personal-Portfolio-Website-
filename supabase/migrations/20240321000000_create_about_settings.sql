-- Create about_settings table
CREATE TABLE IF NOT EXISTS public.about_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT[] NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_about_settings_updated_at
    BEFORE UPDATE ON public.about_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default row if it doesn't exist
INSERT INTO public.about_settings (title, description, image_url)
SELECT 
    'Crafting Digital Experiences with Modern Web Technologies',
    ARRAY[
        'Hello! I''m [Your Name], a Full Stack Web Developer passionate about creating innovative digital solutions. With expertise in React, Next.js, Laravel, and Node.js, I specialize in building scalable and user-friendly web applications.',
        'My approach combines clean code practices with modern development tools to deliver high-quality solutions. I focus on creating seamless user experiences while ensuring robust and efficient server-side operations.',
        'When I''m not coding, I''m constantly exploring new technologies and best practices to stay at the forefront of web development. I believe in writing clean, maintainable code and creating applications that make a difference.'
    ],
    '/your-image.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM public.about_settings
); 