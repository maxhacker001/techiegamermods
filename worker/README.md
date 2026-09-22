# Cloudflare Worker backend

This is the V2 API runtime.

## Endpoints

### Public

- `GET /api/health`
- `GET /api/categories`
- `GET /api/apps`
  - `?category=apps`
  - `?category=games`
  - `?search=spotify`
- `GET /api/apps/:slug`
- `GET /download/:file_id`

The download endpoint only serves files marked:
- file `published = 1`
- file `scan_status = 'clean'`
- version `status = 'published'`

It also records a download event in D1.

### Admin

All admin endpoints require:

`Authorization: Bearer <ADMIN_TOKEN>`

- `GET /api/admin/stats`
- `POST /api/admin/apps`
- `POST /api/admin/versions`
- `POST /api/admin/files` (multipart form with `file`, `version_id`, `file_type`)

## Production notes

1. Create a Cloudflare D1 database.
2. Apply `backend/schema.sql` and `backend/seed_categories.sql`.
3. Create the R2 bucket.
4. Replace the placeholder D1 ID in `wrangler.jsonc`.
5. Set `ADMIN_TOKEN` with Wrangler secret storage; never commit it.
6. For high-volume binary uploads, migrate the admin UI to direct-to-R2 signed uploads rather than sending large binaries through a Worker request.
7. Later, replace the single admin bearer token with a stronger identity layer such as Cloudflare Access or an application-level admin session.

This backend is intentionally isolated from the legacy static catalog. The next frontend phase will add API fallback/migration without breaking the existing site.
