-- =============================================
-- Supabase Storage Bucket
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

-- Authenticated users can upload
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
