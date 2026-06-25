
-- Settings (singleton)
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  company_name text NOT NULL DEFAULT 'Europe Tourism Bureau',
  tagline text,
  description text,
  email text,
  phone text,
  whatsapp_number text,
  address text,
  logo_url text,
  instagram_url text,
  facebook_url text,
  twitter_url text,
  youtube_url text,
  linkedin_url text,
  notify_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are public readable"
  ON public.settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage settings"
  ON public.settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_settings_updated
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.settings (singleton, company_name, tagline, description, email, phone, whatsapp_number, address, instagram_url, facebook_url, twitter_url)
VALUES (true, 'Europe Tourism Bureau', 'Curated Journeys Across Europe',
  'Plan luxury escorted tours and tailor-made holidays across Europe.',
  'hello@europetourismbureau.com', '+44 20 0000 0000', '447700000000', 'London, United Kingdom',
  'https://instagram.com', 'https://facebook.com', 'https://twitter.com');

-- Storage RLS: allow admins to manage media in our buckets; public read.
CREATE POLICY "Public read media buckets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('tours','destinations','blogs','banners'));

CREATE POLICY "Admins write media buckets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('tours','destinations','blogs','banners') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update media buckets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('tours','destinations','blogs','banners') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete media buckets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('tours','destinations','blogs','banners') AND public.has_role(auth.uid(), 'admin'));
