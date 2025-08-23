/*
  # Sistema CMS Completo - Prime Luthieria

  ## Tabelas criadas:
  1. **site_config** - Configurações gerais do site
  2. **meta_tags** - Tags SEO dinâmicas por página
  3. **services** - Serviços oferecidos pela luthieria
  4. **gallery_items** - Galeria de fotos e vídeos
  5. **testimonials** - Depoimentos de clientes
  6. **media_files** - Arquivos de mídia organizados
  7. **content_sections** - Seções editáveis de conteúdo
  8. **admin_users** - Usuários administrativos

  ## Segurança:
  - RLS habilitado em todas as tabelas
  - Policies para leitura pública e edição admin
  - Triggers para updated_at automático

  ## Storage:
  - Buckets: services, gallery, general
*/

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE content_type AS ENUM ('text', 'html', 'markdown');
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE gallery_category AS ENUM ('violao', 'guitarra', 'baixo', 'violino', 'instrumentos_sopro', 'outros');

-- 1. Site Configuration
CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Serviços Prime Luthieria',
  phone text NOT NULL DEFAULT '(11) 99999-9999',
  email text NOT NULL DEFAULT 'contato@primeluthieria.com.br',
  address text NOT NULL DEFAULT 'Rua dos Músicos, 123 - São Paulo, SP',
  business_hours jsonb NOT NULL DEFAULT '{"seg_sex": "08:00-18:00", "sab": "08:00-12:00", "dom": "Fechado"}',
  social_media jsonb DEFAULT '{"facebook": "", "instagram": "", "whatsapp": ""}',
  logo_url text,
  favicon_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Meta Tags for SEO
CREATE TABLE IF NOT EXISTS meta_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text UNIQUE NOT NULL,
  page_title text NOT NULL,
  meta_description text NOT NULL,
  meta_keywords text,
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website',
  schema_json jsonb,
  canonical_url text,
  robots text DEFAULT 'index,follow',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text NOT NULL,
  full_description text,
  price_from decimal(10,2),
  price_to decimal(10,2),
  price_text text DEFAULT 'Consulte',
  image_url text,
  gallery_images text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_url text NOT NULL,
  thumbnail_url text,
  media_type media_type NOT NULL DEFAULT 'image',
  category gallery_category NOT NULL DEFAULT 'outros',
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_photo text,
  testimonial_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Media Files
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  mime_type text,
  category text DEFAULT 'general',
  alt_text text,
  caption text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Content Sections
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  content_type content_type DEFAULT 'html',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meta_tags_updated_at BEFORE UPDATE ON meta_tags FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS Policies - Public read access for content
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read meta_tags" ON meta_tags FOR SELECT USING (true);
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery_items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read public media_files" ON media_files FOR SELECT USING (is_public = true);
CREATE POLICY "Public read active content_sections" ON content_sections FOR SELECT USING (is_active = true);

-- Admin policies - full CRUD access for authenticated admin users
CREATE POLICY "Admin full access site_config" ON site_config FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin full access meta_tags" ON meta_tags FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin full access services" ON services FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin full access gallery_items" ON gallery_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin full access media_files" ON media_files FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin full access content_sections" ON content_sections FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin read own profile" ON admin_users FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "Admin update own profile" ON admin_users FOR UPDATE TO authenticated USING (auth_user_id = auth.uid());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('services', 'services', true),
('gallery', 'gallery', true),
('general', 'general', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public read services bucket" ON storage.objects FOR SELECT USING (bucket_id = 'services');
CREATE POLICY "Public read gallery bucket" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read general bucket" ON storage.objects FOR SELECT USING (bucket_id = 'general');

CREATE POLICY "Admin upload services bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'services' AND 
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin upload gallery bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'gallery' AND 
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin upload general bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'general' AND 
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admin delete services bucket" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'services' AND 
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin delete gallery bucket" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'gallery' AND 
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Admin delete general bucket" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'general' AND 
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
);