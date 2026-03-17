-- =============================================
-- Seed Data (initial profile)
-- =============================================

INSERT INTO public.profile (full_name, title, subtitle, bio, description, social_links)
VALUES (
  'Isabela',
  'Desenvolvedora Full Stack',
  'Criando experiencias digitais incriveis',
  'Sou uma desenvolvedora apaixonada por tecnologia e design.',
  'Com experiencia em desenvolvimento web, busco sempre criar solucoes elegantes e funcionais. Meu foco e entregar projetos de alta qualidade que fazem a diferenca.',
  '[{"platform": "github", "url": "https://github.com/", "icon": "github"}, {"platform": "linkedin", "url": "https://linkedin.com/in/", "icon": "linkedin"}]'::jsonb
);
