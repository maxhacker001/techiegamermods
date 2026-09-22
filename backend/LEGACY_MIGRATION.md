# Legacy Catalog Migration Report

Source:
`js/data.js`

Snapshot reviewed during V2 foundation work.

## Current legacy issues

- 37 catalog records are defined.
- The record ID `remini-mod` is duplicated.
- 56 download properties currently point at `example.com` or otherwise unusable placeholders.
- 30 YouTube/video entries contain placeholder identifiers or demo URLs.
- Many screenshot/icon paths referenced by the catalog do not exist in the repository.
- Download fields are inconsistent: some records use `download`, some `download_apk`, some also use `download_extra`.
- Some tutorial records use `download: "#"` even though no downloadable file exists.
- Some catalog content uses historical dates from 2025 and should not be treated as the current release timestamp.
- The current site contains client-side “trust” text that is not backed by a verification service.

## Migration rules

A legacy record should enter V2 as a draft when:

1. Its ID is duplicated.
2. Its file URL is a placeholder.
3. Its icon is missing.
4. Its release metadata is incomplete.

A record can be published after:

1. The app has a unique slug.
2. The version has a valid version name.
3. Real downloadable files exist in object storage, when a download is advertised.
4. File size and SHA-256 are recorded.
5. Verification status is explicitly recorded.
6. Any external tutorial/store URL is a real URL.
7. The app's public description is reviewed.

## Canonical V2 download data

The public application should never read arbitrary legacy fields directly.

Use:

```text
App
  └── Version
        └── File
              ├── file_type
              ├── storage_key
              ├── bytes
              ├── sha256
              ├── scan_status
              └── published
```

This makes one version capable of having APK, XAPK, APKS, OBB, patch, or other files without changing the app schema.

## Next migration phase

The next implementation step is a read-only import/preview tool. It will:

- parse the legacy catalog;
- normalize field names;
- generate stable slugs;
- report duplicate IDs;
- report missing local assets;
- flag placeholder URLs;
- calculate a proposed V2 import set;
- never publish records automatically.

Only approved records should then be inserted into D1.
