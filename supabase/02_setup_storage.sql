-- 1. Create a new storage bucket called 'storyepisodes-media'
INSERT INTO storage.buckets (id, name, public)
VALUES ('storyepisodes-media', 'storyepisodes-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view media
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'storyepisodes-media' );

-- 3. Allow authenticated users to upload media
CREATE POLICY "Authenticated users can upload media" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'storyepisodes-media' );

-- 4. Allow authenticated users to update their media
CREATE POLICY "Authenticated users can update media" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'storyepisodes-media' );

-- 5. Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete media" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'storyepisodes-media' );
