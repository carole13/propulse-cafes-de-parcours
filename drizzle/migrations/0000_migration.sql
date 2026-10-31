-- Pro'pulse schema
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('propulse','externe')),
  start_at timestamptz NOT NULL,
  location text,
  sector text,
  speaker_name text,
  speaker_role text,
  speaker_bio text,
  capacity integer CHECK (capacity IS NULL OR capacity >= 0),
  external_url text,
  image_url text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events are public" ON public.events FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('interview','parcours-atypique','vos-questions')),
  excerpt text,
  content text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are public" ON public.articles FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  motivation text NOT NULL,
  questions text,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT registrations_event_email_unique UNIQUE (event_id, email)
);
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
-- No policies: no public read or write. Inserts happen server-side only.

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company_role text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Remaining seats: returns only a number, never registrant data.
CREATE OR REPLACE FUNCTION public.remaining_seats(_event_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN e.capacity IS NULL THEN NULL
    ELSE GREATEST(e.capacity - (SELECT count(*) FROM public.registrations r WHERE r.event_id = e.id), 0)::int END
  FROM public.events e
  WHERE e.id = _event_id AND e.published = true AND e.type = 'propulse';
$$;
REVOKE ALL ON FUNCTION public.remaining_seats(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.remaining_seats(uuid) TO anon, authenticated, service_role;