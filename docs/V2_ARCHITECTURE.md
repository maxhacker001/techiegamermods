# Techie Gamer Mods V2 Architecture

## Current goal

Evolve the GitHub Pages prototype into a maintainable content platform while preserving the existing Techie Gamer visual identity.

## Phase 1 — Foundation

- Correct GitHub Pages PWA paths.
- Add service-worker registration and an offline fallback.
- Add robots.txt and sitemap.xml.
- Improve homepage/app/tutorial metadata.
- Stop demo/placeholder download URLs from acting like real downloads.
- Keep the existing `main` branch intact until QA is complete.

## Phase 2 — Content model

The current `js/data.js` catalog becomes a migration source, not the long-term database.

Recommended record shape:

```text
App
- id
- slug
- name
- category
- package_name
- publisher
- genre
- description
- icon_url
- play_store_url
- latest_version_id
- tags
- status
- created_at
- updated_at

Version
- id
- app_id
- version
- mod_info
- changelog
- android_min
- architecture
- size_bytes
- release_status
- created_at

File
- id
- version_id
- type
- storage_key
- sha256
- bytes
- mime_type
- scan_status
- created_at
```

## Phase 3 — Admin

The future admin panel should provide:

1. App creation/editing.
2. Version creation.
3. File uploads.
4. Screenshot management.
5. Tutorial/YouTube links.
6. Changelog editing.
7. Publish/unpublish controls.
8. Download statistics.
9. File verification status.
10. Audit history.

The public site should never receive storage credentials.

## Phase 4 — Storage

GitHub remains source-code hosting.

APK/XAPK/OBB/other binary files should live in object storage rather than inside the Git repository. The application stores only metadata and storage keys.

Preferred future structure:

```text
Web
  ↓
API
  ↓
Database
  ├── App records
  ├── Versions
  └── File metadata
        ↓
Object storage
```

## Phase 5 — Public URLs

Target structure:

```text
www.<domain>/
  apps/
  games/
  tutorials/

download.<domain>/
  <stable download route>
```

The exact domain depends on the hosting/storage provider selected later.

## Phase 6 — Android

The Android app should consume the same public web application/API instead of maintaining a second hard-coded catalog.

## Rules for data quality

- Never publish an `example.com` placeholder as a live download.
- Never publish `YOUR_...` placeholder video links.
- Keep app IDs unique.
- Store release dates as real timestamps.
- Store file sizes from actual uploaded files.
- Generate SHA-256 from the uploaded bytes.
- Only display a security/verification badge when the corresponding check actually happened.
