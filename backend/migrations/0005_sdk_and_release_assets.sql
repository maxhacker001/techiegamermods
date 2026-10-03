-- Migration 0005: public SDK metadata + optional release assets/config files.
-- This extends the existing live schema without changing the existing APK upload tables.

ALTER TABLE versions ADD COLUMN min_sdk TEXT;
ALTER TABLE versions ADD COLUMN target_sdk TEXT;

CREATE TABLE IF NOT EXISTS release_assets (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL,
  asset_type TEXT NOT NULL DEFAULT 'config',
  label TEXT NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  bytes INTEGER NOT NULL DEFAULT 0,
  sha256 TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (version_id) REFERENCES versions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_release_assets_version
  ON release_assets(version_id);

CREATE INDEX IF NOT EXISTS idx_release_assets_published
  ON release_assets(published);
