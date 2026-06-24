
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS travel_styles text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS tours_category_idx ON public.tours(category);
CREATE INDEX IF NOT EXISTS tours_travel_styles_idx ON public.tours USING GIN(travel_styles);
