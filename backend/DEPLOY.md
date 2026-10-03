# Techie Gamer Mods production backend setup

This repository keeps the public site on GitHub Pages and the API, database, and binary storage on Cloudflare Workers + D1 + R2.

## 1. Install and sign in

From the repository root:

```bash
npx wrangler login
```

Cloudflare's current Wrangler documentation supports OAuth login through this command. citeturn289475search10

## 2. Create the production D1 database

From `worker/`:

```bash
npx wrangler d1 create techie-gamer-mods
```

The command returns the database UUID. Put that UUID into `worker/wrangler.jsonc` as `database_id`. citeturn289475search1

## 3. Create the R2 bucket

```bash
npx wrangler r2 bucket create techie-gamer-mods-files
```

The Worker is already configured to bind that bucket as `BUCKET`. citeturn572647search6

## 4. Create the database tables

For a new database, run the schema from the repository:

```bash
npx wrangler d1 execute techie-gamer-mods --remote --file=../backend/schema.sql
npx wrangler d1 execute techie-gamer-mods --remote --file=../backend/seed_categories.sql
```

For future changes, use versioned D1 migrations rather than repeatedly re-running the whole schema. Cloudflare documents `d1 migrations create` and `d1 migrations apply` for this workflow. citeturn289475search6turn289475search9

## 5. Set the admin secret

The production Worker expects an `ADMIN_TOKEN` secret.

```bash
npx wrangler secret put ADMIN_TOKEN
```

Enter a long random value when Wrangler prompts for it. Never put the real value into GitHub source code or `wrangler.jsonc`. Cloudflare recommends Worker secrets for sensitive values. citeturn289475search4

## 6. Deploy the Worker

From `worker/`:

```bash
npx wrangler deploy
```

Wrangler deploys the Worker and provides a `workers.dev` URL. citeturn289475search0

## 7. Connect the GitHub Pages admin panel

Open:

```
https://maxhacker001.github.io/techiegamermods/admin/
```

Enter the Worker URL in **API base URL**, for example:

```
https://techie-gamer-mods-api.<your-subdomain>.workers.dev
```

Enter the admin token, choose **Save session**, then press **Test API**.

A successful connection should return the Worker health response.

## 8. Production upload behavior

Small files can use the normal upload route.

Large APK/XAPK/APKS/OBB files use the resumable R2 multipart pipeline. Cloudflare documents multipart uploads for large objects and recommends them when resumability and parallel uploads are useful. R2 supports multipart objects up to the documented multi-terabyte range, while individual Worker requests are much smaller, so the Admin splits large files into multiple parts. citeturn572647search0turn572647search3turn289475search0

## Restore the legacy catalog once

The original GitHub Pages catalog contains the app/game/tutorial entries that existed before the V2 CMS. To restore those entries into D1 without creating duplicates, run this once from the repository's `worker/` folder after the Worker is connected:

```bash
npx wrangler d1 execute techie-gamer-mods --remote --file=../backend/seed_legacy_catalog.sql
```

The restore is idempotent: existing slugs/versions are left alone, including the current InShot release. After it finishes, refresh the Admin Catalog and the legacy entries will be available to select; you only need to upload the real files for the releases you want to publish.

## Related apps migration

The Admin CMS can now manage the **Related Apps** shown on each public app/download page. Apply the migration once to an existing D1 database:

```bash
npx wrangler d1 execute techie-gamer-mods --remote --file=../backend/migrations/0002_related_apps.sql
```

In the Admin CMS, select an app and put the other app slugs in **Related apps**, separated by commas. The public page then shows those apps in the Related Apps section.

## Release workflow

Use the Admin in this order:

1. Create the app once.
2. Create its version.
3. Upload the real file.
4. Confirm the real file size.
5. Verify the file.
6. Publish the file.
7. Publish the version.
8. Publish the app.
9. Upload screenshots/tutorials as needed.

The public download route only serves a file when the required publication/verification states are satisfied.
