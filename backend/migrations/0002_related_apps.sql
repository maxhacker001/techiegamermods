-- Add manually managed related-app relationships.
-- Safe to run against an existing V2 D1 database.
CREATE TABLE IF NOT EXISTS app_relations (
  app_id TEXT NOT NULL,
  related_app_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (app_id, related_app_id),
  CHECK (app_id <> related_app_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (related_app_id) REFERENCES apps(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_relations_app
  ON app_relations(app_id);

CREATE INDEX IF NOT EXISTS idx_app_relations_related
  ON app_relations(related_app_id);
