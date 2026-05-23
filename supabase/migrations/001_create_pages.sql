-- Pages table for form/page content scoped to clients
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  schema_json JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, slug)
);

CREATE INDEX IF NOT EXISTS pages_client_id_idx ON pages(client_id);
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own client pages"
  ON pages FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own client pages"
  ON pages FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT client_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own client pages"
  ON pages FOR UPDATE
  USING (
    client_id IN (
      SELECT client_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own client pages"
  ON pages FOR DELETE
  USING (
    client_id IN (
      SELECT client_id FROM users WHERE id = auth.uid()
    )
  );
