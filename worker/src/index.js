const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function response(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function corsHeaders(env) {
  const origin = env.WEB_ORIGIN || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}

function json(data, status, env, headers = {}) {
  return response(data, status, { ...corsHeaders(env), ...headers });
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function requireAdmin(request, env) {
  const expected = env.ADMIN_TOKEN;
  if (!expected) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${expected}`;
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function listApps(request, env) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 30), 1), 100);

  let sql = `
    SELECT
      a.id, a.slug, a.name, a.publisher, a.genre, a.description_html,
      a.icon_url, a.play_store_url, a.status, a.created_at, a.updated_at,
      c.slug AS category_slug, c.name AS category_name,
      v.id AS latest_version_id,
      v.version_name AS latest_version,
      v.mod_info AS latest_mod_info,
      v.size_bytes AS latest_size_bytes
    FROM apps a
    JOIN categories c ON c.id = a.category_id
    LEFT JOIN versions v ON v.id = (
      SELECT vv.id
      FROM versions vv
      WHERE vv.app_id = a.id AND vv.status = 'published'
      ORDER BY datetime(vv.updated_at) DESC
      LIMIT 1
    )
    WHERE a.status = 'published'
  `;

  const bindings = [];

  if (category) {
    sql += " AND c.slug = ?";
    bindings.push(category);
  }

  if (search) {
    sql += `
      AND (
        lower(a.name) LIKE ?
        OR lower(COALESCE(a.publisher, '')) LIKE ?
        OR lower(COALESCE(a.genre, '')) LIKE ?
        OR lower(a.description_html) LIKE ?
        OR EXISTS (
          SELECT 1 FROM app_tags t
          WHERE t.app_id = a.id AND lower(t.tag) LIKE ?
        )
      )
    `;
    const pattern = `%${search}%`;
    bindings.push(pattern, pattern, pattern, pattern, pattern);
  }

  sql += " ORDER BY datetime(a.updated_at) DESC LIMIT ?";
  bindings.push(limit);

  const { results = [] } = await env.DB.prepare(sql).bind(...bindings).all();
  return json({ apps: results }, 200, env);
}

async function getApp(slug, env) {
  const app = await env.DB.prepare(`
    SELECT
      a.*, c.slug AS category_slug, c.name AS category_name
    FROM apps a
    JOIN categories c ON c.id = a.category_id
    WHERE a.slug = ? AND a.status = 'published'
    LIMIT 1
  `).bind(slug).first();

  if (!app) return json({ error: "App not found" }, 404, env);

  const versions = await env.DB.prepare(`
    SELECT id, version_name, mod_info, changelog, android_min,
           architecture, size_bytes, status, created_at, updated_at
    FROM versions
    WHERE app_id = ? AND status = 'published'
    ORDER BY datetime(updated_at) DESC
  `).bind(app.id).all();

  const screenshots = await env.DB.prepare(`
    SELECT id, storage_key, alt_text, sort_order
    FROM screenshots
    WHERE app_id = ?
    ORDER BY sort_order ASC, id ASC
  `).bind(app.id).all();

  const tags = await env.DB.prepare(`
    SELECT tag FROM app_tags WHERE app_id = ? ORDER BY tag
  `).bind(app.id).all();

  const tutorials = await env.DB.prepare(`
    SELECT id, title, video_url, body, created_at, updated_at
    FROM tutorials
    WHERE app_id = ? AND status = 'published'
    ORDER BY datetime(updated_at) DESC
  `).bind(app.id).all();

  return json({
    app,
    versions: versions.results || [],
    screenshots: screenshots.results || [],
    tags: (tags.results || []).map((row) => row.tag),
    tutorials: tutorials.results || []
  }, 200, env);
}

async function listCategories(env) {
  const { results = [] } = await env.DB.prepare(
    "SELECT id, slug, name, description FROM categories ORDER BY name ASC"
  ).all();
  return json({ categories: results }, 200, env);
}

async function adminStats(env) {
  if (!env.DB) return json({ error: "Database binding is not configured" }, 500, env);

  const queries = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM apps").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM apps WHERE status='published'").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM versions").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM files").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM downloads").first()
  ]);

  return json({
    apps: Number(queries[0]?.count || 0),
    published_apps: Number(queries[1]?.count || 0),
    versions: Number(queries[2]?.count || 0),
    files: Number(queries[3]?.count || 0),
    downloads: Number(queries[4]?.count || 0)
  }, 200, env);
}
async function adminListApps(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "all";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 200);
  let sql = "SELECT a.id,a.slug,a.name,a.publisher,a.genre,a.package_name,a.icon_url,a.play_store_url,a.status,a.created_at,a.updated_at,c.slug AS category_slug,c.name AS category_name,(SELECT COUNT(*) FROM versions v WHERE v.app_id=a.id) AS version_count,(SELECT COUNT(*) FROM files f JOIN versions v2 ON v2.id=f.version_id WHERE v2.app_id=a.id) AS file_count FROM apps a JOIN categories c ON c.id=a.category_id WHERE 1=1";
  const bindings = [];
  if (status !== "all") { sql += " AND a.status=?"; bindings.push(status); }
  if (search) { sql += " AND (lower(a.name) LIKE ? OR lower(COALESCE(a.publisher,'')) LIKE ? OR lower(COALESCE(a.package_name,'')) LIKE ? OR lower(a.slug) LIKE ?)"; const p="%"+search+"%"; bindings.push(p,p,p,p); }
  sql += " ORDER BY datetime(a.updated_at) DESC LIMIT ?";
  bindings.push(limit);
  const result = await env.DB.prepare(sql).bind(...bindings).all();
  return json({ apps: result.results || [] },200,env);
}

async function adminListVersions(appId, env) {
  const app = await env.DB.prepare("SELECT id,slug,name FROM apps WHERE id=? LIMIT 1").bind(appId).first();
  if (!app) return json({ error:"App not found" },404,env);
  const result = await env.DB.prepare("SELECT v.id,v.app_id,v.version_name,v.mod_info,v.changelog,v.android_min,v.architecture,v.size_bytes,v.status,v.created_at,v.updated_at,(SELECT COUNT(*) FROM files f WHERE f.version_id=v.id) AS file_count,(SELECT COUNT(*) FROM files f WHERE f.version_id=v.id AND f.scan_status='clean' AND f.published=1) AS published_clean_file_count FROM versions v WHERE v.app_id=? ORDER BY datetime(v.updated_at) DESC").bind(appId).all();
  return json({ app,versions:result.results || [] },200,env);
}

async function adminSetAppStatus(request, appId, env) {
  if (!requireAdmin(request, env)) return json({ error:"Unauthorized" },401,env);
  const body=await parseJson(request);
  const status=body?.status;
  if (!["draft","published","archived"].includes(status)) return json({error:"Invalid app status"},400,env);
  const app=await env.DB.prepare("SELECT a.id,c.slug AS category_slug FROM apps a JOIN categories c ON c.id=a.category_id WHERE a.id=? LIMIT 1").bind(appId).first();
  if (!app) return json({error:"App not found"},404,env);
  if(status==="published"){
    const version=await env.DB.prepare("SELECT id FROM versions WHERE app_id=? AND status='published' ORDER BY datetime(updated_at) DESC LIMIT 1").bind(appId).first();
    if(!version) return json({error:"Publish at least one version first"},409,env);
    if(app.category_slug!=="tutorials"){
      const file=await env.DB.prepare("SELECT f.id FROM files f JOIN versions v ON v.id=f.version_id WHERE v.app_id=? AND v.status='published' AND f.published=1 AND f.scan_status='clean' LIMIT 1").bind(appId).first();
      if(!file) return json({error:"Publish at least one verified clean file first"},409,env);
    }
  }
  await env.DB.prepare("UPDATE apps SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,appId).run();
  await env.DB.prepare("INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','status_change','app',?,?)").bind(appId,JSON.stringify({status})).run();
  return json({id:appId,status},200,env);
}

async function adminSetVersionStatus(request, versionId, env) {
  if (!requireAdmin(request, env)) return json({ error:"Unauthorized" },401,env);
  const body=await parseJson(request);
  const status=body?.status;
  if (!["draft","published","archived"].includes(status)) return json({error:"Invalid version status"},400,env);
  const version=await env.DB.prepare("SELECT id,app_id FROM versions WHERE id=? LIMIT 1").bind(versionId).first();
  if(!version) return json({error:"Version not found"},404,env);
  if(status==="published"){
    const file=await env.DB.prepare("SELECT id FROM files WHERE version_id=? AND published=1 AND scan_status='clean' LIMIT 1").bind(versionId).first();
    if(!file) return json({error:"Publish at least one clean, published file first"},409,env);
  }
  await env.DB.prepare("UPDATE versions SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,versionId).run();
  await env.DB.prepare("INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','status_change','version',?,?)").bind(versionId,JSON.stringify({status})).run();
  return json({id:versionId,status},200,env);
}

async function adminVerifyFile(request, fileId, env) {
  if (!requireAdmin(request, env)) return json({ error:"Unauthorized" },401,env);
  const body=await parseJson(request);
  const scanStatus=body?.scan_status;
  const note=String(body?.note || "").slice(0,2000);
  if (!["pending","clean","flagged","failed","unknown"].includes(scanStatus)) return json({error:"Invalid scan_status"},400,env);
  const file=await env.DB.prepare("SELECT id,sha256,original_name FROM files WHERE id=? LIMIT 1").bind(fileId).first();
  if(!file) return json({error:"File not found"},404,env);
  await env.DB.prepare("UPDATE files SET scan_status=?,published=0 WHERE id=?").bind(scanStatus,fileId).run();
  await env.DB.prepare("INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','manual_verification','file',?,?)").bind(fileId,JSON.stringify({scan_status:scanStatus,note,sha256:file.sha256,original_name:file.original_name})).run();
  return json({id:fileId,scan_status:scanStatus,published:0,note},200,env);
}

async function adminPublishFile(request, fileId, env) {
  if (!requireAdmin(request, env)) return json({ error:"Unauthorized" },401,env);
  const file=await env.DB.prepare("SELECT f.id,f.scan_status,v.status AS version_status FROM files f JOIN versions v ON v.id=f.version_id WHERE f.id=? LIMIT 1").bind(fileId).first();
  if(!file) return json({error:"File not found"},404,env);
  if(file.scan_status!=="clean") return json({error:"Only clean files can be published"},409,env);
  if(file.version_status!=="published") return json({error:"Publish the version first"},409,env);
  await env.DB.prepare("UPDATE files SET published=1 WHERE id=?").bind(fileId).run();
  await env.DB.prepare("INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','publish','file',?,?)").bind(fileId,JSON.stringify({published:1})).run();
  return json({id:fileId,published:1},200,env);
}

async function adminCreateApp(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);

  const body = await parseJson(request);
  if (!body?.name || !body?.category_slug) {
    return json({ error: "name and category_slug are required" }, 400, env);
  }

  const category = await env.DB.prepare(
    "SELECT id FROM categories WHERE slug = ? LIMIT 1"
  ).bind(body.category_slug).first();

  if (!category) return json({ error: "Unknown category" }, 400, env);

  const id = crypto.randomUUID();
  const slug = slugify(body.slug || body.name);

  try {
    await env.DB.prepare(`
      INSERT INTO apps (
        id, slug, name, category_id, package_name, publisher, genre,
        description_html, icon_url, play_store_url, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      slug,
      body.name,
      category.id,
      body.package_name || null,
      body.publisher || null,
      body.genre || null,
      body.description_html || "",
      body.icon_url || null,
      body.play_store_url || null,
      body.status === "published" ? "published" : "draft"
    ).run();
  } catch (error) {
    return json({ error: "Unable to create app", detail: String(error) }, 409, env);
  }

  await env.DB.prepare(`
    INSERT INTO admin_audit_log (actor, action, entity_type, entity_id, details_json)
    VALUES (?, 'create', 'app', ?, ?)
  `).bind("admin", id, JSON.stringify({ name: body.name, slug })).run();

  return json({ id, slug }, 201, env);
}

async function adminCreateVersion(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);

  const body = await parseJson(request);
  if (!body?.app_id || !body?.version_name) {
    return json({ error: "app_id and version_name are required" }, 400, env);
  }

  const id = crypto.randomUUID();

  try {
    await env.DB.prepare(`
      INSERT INTO versions (
        id, app_id, version_name, mod_info, changelog,
        android_min, architecture, size_bytes, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.app_id,
      body.version_name,
      body.mod_info || "",
      body.changelog || "",
      body.android_min || null,
      body.architecture || null,
      Number(body.size_bytes || 0),
      body.status === "published" ? "published" : "draft"
    ).run();
  } catch (error) {
    return json({ error: "Unable to create version", detail: String(error) }, 409, env);
  }

  return json({ id }, 201, env);
}

async function uploadFile(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET) return json({ error: "R2 bucket binding is not configured" }, 500, env);

  const form = await request.formData();
  const file = form.get("file");
  const versionId = String(form.get("version_id") || "");
  const fileType = String(form.get("file_type") || "other");

  if (!(file instanceof File) || !versionId) {
    return json({ error: "file and version_id are required" }, 400, env);
  }

  const allowed = new Set(["apk", "xapk", "apks", "obb", "data", "patch", "zip", "other"]);
  if (!allowed.has(fileType)) {
    return json({ error: "Unsupported file_type" }, 400, env);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 150);
  const key = `files/${versionId}/${crypto.randomUUID()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const sha256 = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");

  await env.BUCKET.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
      contentDisposition: `attachment; filename="${safeName.replace(/"/g, "")}"`
    },
    customMetadata: {
      originalName: file.name,
      sha256,
      versionId
    }
  });

  const fileId = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO files (
      id, version_id, file_type, storage_key, original_name,
      mime_type, bytes, sha256, scan_status, published
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0)
  `).bind(
    fileId,
    versionId,
    fileType,
    key,
    file.name,
    file.type || "application/octet-stream",
    file.size,
    sha256
  ).run();

  return json({ id: fileId, storage_key: key, bytes: file.size, sha256 }, 201, env);
}

async function serveFile(fileId, request, env) {
  if (!env.DB || !env.BUCKET) {
    return new Response("Download service is not configured", { status: 503 });
  }

  const file = await env.DB.prepare(`
    SELECT f.id, f.storage_key, f.original_name, f.mime_type, f.bytes,
           f.scan_status, f.published,
           v.status AS version_status
    FROM files f
    JOIN versions v ON v.id = f.version_id
    WHERE f.id = ? LIMIT 1
  `).bind(fileId).first();

  if (!file || !file.published || file.scan_status !== "clean" || file.version_status !== "published") {
    return new Response("File is not available", { status: 404 });
  }

  const object = await env.BUCKET.get(file.storage_key);
  if (!object) return new Response("File not found", { status: 404 });

  await env.DB.prepare(
    "INSERT INTO downloads (file_id, referrer, user_agent) VALUES (?, ?, ?)"
  ).bind(
    file.id,
    request.headers.get("referer"),
    request.headers.get("user-agent")
  ).run();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-type", file.mime_type || "application/octet-stream");
  headers.set("content-disposition", `attachment; filename="${String(file.original_name).replace(/"/g, "")}"`);
  headers.set("cache-control", "public, max-age=3600");

  return new Response(object.body, { headers });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (path === "/api/health" && request.method === "GET") {
        return json({ ok: true, service: "techie-gamer-mods-api", version: "v2" }, 200, env);
      }

      if (path === "/api/categories" && request.method === "GET") {
        return listCategories(env);
      }

      if (path === "/api/apps" && request.method === "GET") {
        return listApps(request, env);
      }

      if (path.startsWith("/api/apps/") && request.method === "GET") {
        const slug = decodeURIComponent(path.slice("/api/apps/".length));
        return getApp(slug, env);
      }

      if (path === "/api/admin/stats" && request.method === "GET") {
        if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
        return adminStats(env);
      }

      if (path === "/api/admin/apps" && request.method === "GET") {
        return adminListApps(request, env);
      }

      if (path === "/api/admin/apps" && request.method === "POST") {
        return adminCreateApp(request, env);
      }

      if (path.startsWith("/api/admin/apps/") && path.endsWith("/status") && request.method === "PATCH") {
        const appId = decodeURIComponent(path.slice("/api/admin/apps/".length, -"/status".length));
        return adminSetAppStatus(request, appId, env);
      }

      if (path.startsWith("/api/admin/apps/") && path.endsWith("/versions") && request.method === "GET") {
        return adminListVersions(decodeURIComponent(path.slice("/api/admin/apps/".length, -"/versions".length)), env);
      }

      if (path === "/api/admin/versions" && request.method === "POST") {
        return adminCreateVersion(request, env);
      }

      if (path.startsWith("/api/admin/versions/") && path.endsWith("/status") && request.method === "PATCH") {
        const versionId = decodeURIComponent(path.slice("/api/admin/versions/".length, -"/status".length));
        return adminSetVersionStatus(request, versionId, env);
      }

      if (path === "/api/admin/files" && request.method === "POST") {
        return uploadFile(request, env);
      }

      if (path.startsWith("/api/admin/files/") && path.endsWith("/verify") && request.method === "PATCH") {
        const fileId = decodeURIComponent(path.slice("/api/admin/files/".length, -"/verify".length));
        return adminVerifyFile(request, fileId, env);
      }

      if (path.startsWith("/api/admin/files/") && path.endsWith("/publish") && request.method === "PATCH") {
        const fileId = decodeURIComponent(path.slice("/api/admin/files/".length, -"/publish".length));
        return adminPublishFile(request, fileId, env);
      }

      if (path.startsWith("/download/") && request.method === "GET") {
        return serveFile(path.slice("/download/".length), request, env);
      }

      return json({ error: "Not found" }, 404, env);
    } catch (error) {
      console.error(error);
      return json({ error: "Internal server error" }, 500, env);
    }
  }
};
