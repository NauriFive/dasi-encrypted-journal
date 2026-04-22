CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_entries_user ON journal_entries(user_id);
CREATE INDEX idx_entries_search ON journal_entries USING GIN(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,'')));