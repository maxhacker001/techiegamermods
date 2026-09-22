# Techie Gamer Mods V2 Backend Foundation

This directory defines the backend contract for the next version of Techie Gamer Mods.

## Target stack

- Cloudflare Workers for the API/runtime.
- Cloudflare D1 for application/version metadata.
- Cloudflare R2 for binary files and screenshots.
- GitHub remains the source-code repository and CI host.

Cloudflare's current documentation lists a Workers Free plan, D1 free allowances, and an R2 free allowance with no egress bandwidth charge. Review current pricing before production rollout.

## Separation of responsibilities

```text
GitHub
  └── HTML/CSS/JS + Worker source + schema

Cloudflare Worker
  └── authenticated API

D1
  ├── apps
  ├── versions
  ├── files
  ├── tutorials
  └── statistics

R2
  ├── APK/XAPK/etc. objects
  └── image objects
```

The browser never receives R2 access credentials.

## Publish flow

1. Admin authenticates.
2. Admin creates/edits app metadata.
3. Admin creates a version.
4. Binary is uploaded to object storage.
5. Server calculates/stores SHA-256 and file size.
6. Verification state is recorded.
7. Admin publishes the version.
8. Public API exposes the newest published version.
9. Website and Android client consume the same API.

## Migration rule

The existing `js/data.js` file is treated as legacy input. Do not blindly import its placeholder URLs or unverified security claims into production records.

Legacy values such as `example.com`, `YOUR_...`, or placeholder social URLs should become draft/unavailable records until a real value exists.
