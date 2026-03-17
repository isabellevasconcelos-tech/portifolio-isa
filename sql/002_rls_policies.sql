-- =============================================
-- Row Level Security Policies
-- =============================================

-- PROFILE
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert profile" ON public.profile FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update profile" ON public.profile FOR UPDATE USING (auth.role() = 'authenticated');

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible projects" ON public.projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Authenticated full access projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- SKILLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible skills" ON public.skills FOR SELECT USING (is_visible = true);
CREATE POLICY "Authenticated full access skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send message" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read messages" ON public.messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update messages" ON public.messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete messages" ON public.messages FOR DELETE USING (auth.role() = 'authenticated');

-- BLOG POSTS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated full access posts" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
