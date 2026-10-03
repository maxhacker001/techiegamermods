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
    "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
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
      v.size_bytes AS latest_size_bytes,
      COALESCE((
        SELECT COUNT(*)
        FROM downloads d
        JOIN files f2 ON f2.id=d.file_id
        JOIN versions v2 ON v2.id=f2.version_id
        WHERE v2.app_id=a.id
      ),0) AS download_count
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

async function getRelatedApps(appId, env) {
  // Relationships are optional so older databases can continue serving the catalog
  // until the related-apps migration has been applied.
  try {
    const result = await env.DB.prepare(`
      SELECT
        a.id,
        a.slug,
        a.name,
        a.publisher,
        a.genre,
        a.icon_url,
        a.status,
        (
          SELECT vv.version_name
          FROM versions vv
          WHERE vv.app_id=a.id AND vv.status='published'
          ORDER BY datetime(vv.updated_at) DESC
          LIMIT 1
        ) AS version,
        (
          SELECT vv.size_bytes
          FROM versions vv
          WHERE vv.app_id=a.id AND vv.status='published'
          ORDER BY datetime(vv.updated_at) DESC
          LIMIT 1
        ) AS size_bytes
      FROM app_relations r
      JOIN apps a ON a.id = r.related_app_id
      WHERE r.app_id=? AND a.status='published'
      ORDER BY r.sort_order ASC, datetime(a.updated_at) DESC, a.name ASC
      LIMIT 12
    `).bind(appId).all();

    return (result.results || []).map(row => ({
      ...row,
      version: row.version || "—",
      size_bytes: Number(row.size_bytes || 0),
      image: row.icon_url || null
    }));
  } catch (_) {
    return [];
  }
}

async function saveRelatedApps(appId, relatedInput, env) {
  try {
    const raw = Array.isArray(relatedInput)
      ? relatedInput
      : String(relatedInput || "").split(/[\n,]+/);

    const slugs = [...new Set(
      raw.map(value => String(value || "").trim().toLowerCase()).filter(Boolean)
    )].slice(0, 12);

    await env.DB.prepare("DELETE FROM app_relations WHERE app_id=?").bind(appId).run();

    if (!slugs.length) return { saved: [], unknown: [] };

    const placeholders = slugs.map(() => "?").join(",");
    const found = await env.DB.prepare(
      "SELECT id,slug FROM apps WHERE lower(slug) IN (" + placeholders + ")"
    ).bind(...slugs).all();

    const bySlug = new Map((found.results || []).map(row => [String(row.slug).toLowerCase(), row]));
    const unknown = [];
    for (const slug of slugs) {
      const target = bySlug.get(slug);
      if (!target) {
        unknown.push(slug);
        continue;
      }
      if (target.id === appId) continue;

      await env.DB.prepare(
        "INSERT OR IGNORE INTO app_relations(app_id,related_app_id,sort_order) VALUES(?,?,?)"
      ).bind(appId, target.id, slugs.indexOf(slug)).run();
    }

    return { saved: slugs.filter(slug => bySlug.has(slug)), unknown };
  } catch (error) {
    return { saved: [], unknown: [], error: String(error) };
  }
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

  const screenshots = await env.DB.prepare(
    "SELECT id, storage_key, alt_text, sort_order FROM screenshots WHERE app_id=? ORDER BY sort_order ASC, id ASC"
  ).bind(app.id).all();

  const versionRows = versions.results || [];
  let files = [];
  if (versionRows.length) {
    const placeholders = versionRows.map(() => "?").join(",");
    const fileRows = await env.DB.prepare(
      "SELECT id, version_id, file_type, original_name, mime_type, bytes, sha256, scan_status, published, created_at FROM files WHERE version_id IN (" + placeholders + ") AND published=1 AND scan_status='clean' ORDER BY datetime(created_at) DESC"
    ).bind(...versionRows.map(v => v.id)).all();
    files = fileRows.results || [];
  }

  const tags = await env.DB.prepare(`
    SELECT tag FROM app_tags WHERE app_id = ? ORDER BY tag
  `).bind(app.id).all();

  const tutorials = await env.DB.prepare(`
    SELECT id, title, video_url, body, created_at, updated_at
    FROM tutorials
    WHERE app_id = ? AND status = 'published'
    ORDER BY datetime(updated_at) DESC
  `).bind(app.id).all();

  const related_apps = await getRelatedApps(app.id, env);

  return json({
    app,
    versions: versions.results || [],
    related_apps,
    screenshots: (screenshots.results || []).map((row) => ({
      id: row.id,
      alt_text: row.alt_text,
      sort_order: row.sort_order,
      media_url: "/media/screenshots/" + row.id
    })),
    files,
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

async function adminAuditLog(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 200);

  const result = await env.DB.prepare(
    "SELECT id,actor,action,entity_type,entity_id,details_json,created_at FROM admin_audit_log ORDER BY datetime(created_at) DESC LIMIT ?"
  ).bind(limit).all();

  return json({ events: result.results || [] }, 200, env);
}

async function adminArchiveFile(request, fileId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);

  const file = await env.DB.prepare(
    "SELECT id,version_id,published FROM files WHERE id=? LIMIT 1"
  ).bind(fileId).first();
  if (!file) return json({ error: "File not found" }, 404, env);

  await env.DB.prepare(
    "UPDATE files SET published=0 WHERE id=?"
  ).bind(fileId).run();

  await env.DB.prepare(
    "INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','archive','file',?,?)"
  ).bind(fileId, JSON.stringify({ version_id: file.version_id, previous_published: file.published })).run();

  return json({ id: fileId, published: 0 }, 200, env);
}

async function adminDeleteScreenshot(request, screenshotId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET || !env.DB) return json({ error: "Storage/database binding is not configured" }, 500, env);

  const shot = await env.DB.prepare(
    "SELECT id,storage_key FROM screenshots WHERE id=? LIMIT 1"
  ).bind(screenshotId).first();
  if (!shot) return json({ error: "Screenshot not found" }, 404, env);

  await env.BUCKET.delete(shot.storage_key);
  await env.DB.prepare("DELETE FROM screenshots WHERE id=?").bind(screenshotId).run();
  await env.DB.prepare(
    "INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','delete','screenshot',?,?)"
  ).bind(screenshotId, JSON.stringify({ storage_key: shot.storage_key })).run();

  return json({ id: screenshotId, deleted: true }, 200, env);
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
  let sql = "SELECT a.id,a.slug,a.name,a.publisher,a.genre,a.package_name,a.description_html,a.icon_url,a.play_store_url,a.status,a.created_at,a.updated_at,c.slug AS category_slug,c.name AS category_name,(SELECT COUNT(*) FROM versions v WHERE v.app_id=a.id) AS version_count,(SELECT COUNT(*) FROM files f JOIN versions v2 ON v2.id=f.version_id WHERE v2.app_id=a.id) AS file_count FROM apps a JOIN categories c ON c.id=a.category_id WHERE 1=1";
  const bindings = [];
  if (status !== "all") { sql += " AND a.status=?"; bindings.push(status); }
  if (search) { sql += " AND (lower(a.name) LIKE ? OR lower(COALESCE(a.publisher,'')) LIKE ? OR lower(COALESCE(a.package_name,'')) LIKE ? OR lower(a.slug) LIKE ?)"; const p="%"+search+"%"; bindings.push(p,p,p,p); }
  sql += " ORDER BY datetime(a.updated_at) DESC LIMIT ?";
  bindings.push(limit);
  const result = await env.DB.prepare(sql).bind(...bindings).all();
  let apps = result.results || [];

  // Related-apps are optional until the migration is applied.
  try {
    const relationRows = await env.DB.prepare(
      "SELECT r.app_id, group_concat(a.slug, ',') AS related_slugs FROM app_relations r JOIN apps a ON a.id=r.related_app_id GROUP BY r.app_id"
    ).all();
    const relationMap = new Map(
      (relationRows.results || []).map(row => [row.app_id, row.related_slugs || ""])
    );
    apps = apps.map(app => ({
      ...app,
      related_slugs: relationMap.get(app.id) || ""
    }));
  } catch (_) {
    apps = apps.map(app => ({ ...app, related_slugs: "" }));
  }

  return json({ apps },200,env);
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
      const file=await env.DB.prepare("SELECT f.id FROM files f JOIN versions v ON v.id=f.version_id WHERE v.app_id=? AND v.status='published' AND f.published=1 LIMIT 1").bind(appId).first();
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
    const file=await env.DB.prepare("SELECT id FROM files WHERE version_id=? AND published=1 LIMIT 1").bind(versionId).first();
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
  // A verified file may be published while its version is still draft.
  // The public download route remains protected by version + app publication state.
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
    const detail = String(error || "");
    if (/UNIQUE constraint failed:\s*apps\.slug/i.test(detail)) {
      return json({
        error: "An app with this slug already exists.",
        next: "Select the existing app from Catalog and use Save changes. Use New / Clear before creating a different app."
      }, 409, env);
    }
    return json({ error: "Unable to create app", detail }, 409, env);
  }

  await env.DB.prepare(`
    INSERT INTO admin_audit_log (actor, action, entity_type, entity_id, details_json)
    VALUES (?, 'create', 'app', ?, ?)
  `).bind("admin", id, JSON.stringify({ name: body.name, slug })).run();

  const relationResult = await saveRelatedApps(id, body.related_slugs, env);

  return json({ id, slug, related: relationResult }, 201, env);
}


async function adminEditApp(request, appId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  const body = await parseJson(request);
  if (!body?.name || !body?.category_slug) {
    return json({ error: "name and category_slug are required" }, 400, env);
  }

  const app = await env.DB.prepare("SELECT id FROM apps WHERE id=? LIMIT 1").bind(appId).first();
  if (!app) return json({ error: "App not found" }, 404, env);

  const category = await env.DB.prepare("SELECT id FROM categories WHERE slug=? LIMIT 1")
    .bind(body.category_slug).first();
  if (!category) return json({ error: "Unknown category" }, 400, env);

  const slug = slugify(body.slug || body.name);
  const existing = await env.DB.prepare(
    "SELECT id FROM apps WHERE slug=? AND id<>? LIMIT 1"
  ).bind(slug, appId).first();
  if (existing) return json({ error: "That slug is already in use" }, 409, env);

  await env.DB.prepare(
    "UPDATE apps SET slug=?, name=?, category_id=?, package_name=?, publisher=?, genre=?, description_html=?, icon_url=?, play_store_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(
    slug,
    String(body.name).trim(),
    category.id,
    body.package_name || null,
    body.publisher || null,
    body.genre || null,
    body.description_html || "",
    body.icon_url || null,
    body.play_store_url || null,
    appId
  ).run();

  await env.DB.prepare(
    "INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','edit','app',?,?)"
  ).bind(appId, JSON.stringify({ name: body.name, slug })).run();

  const relationResult = await saveRelatedApps(appId, body.related_slugs, env);
  await env.DB.prepare(
    "INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','related_apps','app',?,?)"
  ).bind(appId, JSON.stringify(relationResult)).run();

  return json({ id: appId, slug, related: relationResult }, 200, env);
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


async function adminEditVersion(request, versionId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  const body = await parseJson(request);
  if (!body?.version_name) return json({ error: "version_name is required" }, 400, env);

  const version = await env.DB.prepare("SELECT id, app_id FROM versions WHERE id=? LIMIT 1")
    .bind(versionId).first();
  if (!version) return json({ error: "Version not found" }, 404, env);

  try {
    await env.DB.prepare(
      "UPDATE versions SET version_name=?, mod_info=?, changelog=?, android_min=?, architecture=?, size_bytes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(
      String(body.version_name).trim(),
      body.mod_info || "",
      body.changelog || "",
      body.android_min || null,
      body.architecture || null,
      Number(body.size_bytes || 0),
      versionId
    ).run();
  } catch (error) {
    return json({ error: "Unable to update version", detail: String(error) }, 409, env);
  }

  await env.DB.prepare(
    "INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','edit','version',?,?)"
  ).bind(versionId, JSON.stringify({ version_name: body.version_name })).run();

  return json({ id: versionId }, 200, env);
}

async function adminListFilesForVersion(request, versionId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  const version = await env.DB.prepare("SELECT id, app_id, version_name FROM versions WHERE id=? LIMIT 1")
    .bind(versionId).first();
  if (!version) return json({ error: "Version not found" }, 404, env);

  const result = await env.DB.prepare(
    "SELECT id, version_id, file_type, original_name, mime_type, bytes, sha256, scan_status, published, created_at FROM files WHERE version_id=? ORDER BY datetime(created_at) DESC"
  ).bind(versionId).all();

  return json({ version, files: result.results || [] }, 200, env);
}

async function adminUploadScreenshot(request, appId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET) return json({ error: "R2 bucket binding is not configured" }, 500, env);

  const app = await env.DB.prepare("SELECT id FROM apps WHERE id=? LIMIT 1").bind(appId).first();
  if (!app) return json({ error: "App not found" }, 404, env);

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "file is required" }, 400, env);

  const mime = file.type || "application/octet-stream";
  if (!/^image\/(png|jpeg|webp|gif)$/i.test(mime)) {
    return json({ error: "Only PNG, JPEG, WebP, and GIF screenshots are accepted" }, 400, env);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 150);
  const key = "screenshots/" + appId + "/" + crypto.randomUUID() + "-" + safeName;

  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=86400"
    }
  });

  const id = crypto.randomUUID();
  const alt = String(form.get("alt_text") || "").slice(0, 200);
  const sortOrder = Number(form.get("sort_order") || 0);

  await env.DB.prepare(
    "INSERT INTO screenshots(id,app_id,storage_key,alt_text,sort_order) VALUES(?,?,?,?,?)"
  ).bind(id, appId, key, alt, sortOrder).run();

  return json({ id, storage_key: key, alt_text: alt, sort_order: sortOrder }, 201, env);
}

async function adminListTutorials(request, appId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);

  const app = await env.DB.prepare("SELECT id,name FROM apps WHERE id=? LIMIT 1").bind(appId).first();
  if (!app) return json({ error: "App not found" }, 404, env);

  const result = await env.DB.prepare(
    "SELECT id, title, video_url, body, status, created_at, updated_at FROM tutorials WHERE app_id=? ORDER BY datetime(updated_at) DESC"
  ).bind(appId).all();

  return json({ app, tutorials: result.results || [] }, 200, env);
}

async function adminCreateTutorial(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  const body = await parseJson(request);
  if (!body?.app_id || !body?.title) {
    return json({ error: "app_id and title are required" }, 400, env);
  }

  const app = await env.DB.prepare("SELECT id FROM apps WHERE id=? LIMIT 1").bind(body.app_id).first();
  if (!app) return json({ error: "App not found" }, 404, env);

  const id = crypto.randomUUID();

  await env.DB.prepare(
    "INSERT INTO tutorials(id,app_id,title,video_url,body,status) VALUES(?,?,?,?,?,?)"
  ).bind(
    id,
    body.app_id,
    String(body.title).trim(),
    body.video_url || null,
    body.body || "",
    ["draft","published","archived"].includes(body.status) ? body.status : "draft"
  ).run();

  await env.DB.prepare(
    "INSERT INTO admin_audit_log(actor,action,entity_type,entity_id,details_json) VALUES('admin','create','tutorial',?,?)"
  ).bind(id, JSON.stringify({ app_id: body.app_id, title: body.title })).run();

  return json({ id }, 201, env);
}

async function adminEditTutorial(request, tutorialId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  const body = await parseJson(request);
  if (!body?.title) return json({ error: "title is required" }, 400, env);

  const tutorial = await env.DB.prepare("SELECT id FROM tutorials WHERE id=? LIMIT 1").bind(tutorialId).first();
  if (!tutorial) return json({ error: "Tutorial not found" }, 404, env);

  await env.DB.prepare(
    "UPDATE tutorials SET title=?, video_url=?, body=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(
    String(body.title).trim(),
    body.video_url || null,
    body.body || "",
    ["draft","published","archived"].includes(body.status) ? body.status : "draft",
    tutorialId
  ).run();

  return json({ id: tutorialId }, 200, env);
}

async function serveScreenshot(screenshotId, env) {
  if (!env.DB || !env.BUCKET) return new Response("Media service is not configured", { status: 503 });

  const shot = await env.DB.prepare(
    "SELECT s.id, s.storage_key, s.alt_text, s.app_id FROM screenshots s JOIN apps a ON a.id=s.app_id WHERE s.id=? AND a.status='published' LIMIT 1"
  ).bind(screenshotId).first();

  if (!shot) return new Response("Screenshot not found", { status: 404 });

  const object = await env.BUCKET.get(shot.storage_key);
  if (!object) return new Response("Screenshot file not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=86400");
  if (shot.alt_text) headers.set("content-description", shot.alt_text);
  return new Response(object.body, { headers });
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
  const version = await env.DB.prepare(
    "SELECT id FROM versions WHERE id=? LIMIT 1"
  ).bind(versionId).first();
  if (!version) return json({ error: "Version not found" }, 404, env);

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

  // Keep the version's displayed size tied to a real uploaded release file.
  if (fileType === "apk" || !(await env.DB.prepare(
    "SELECT id FROM files WHERE version_id=? AND file_type='apk' AND id<>? LIMIT 1"
  ).bind(versionId, fileId).first())) {
    await env.DB.prepare(
      "UPDATE versions SET size_bytes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(file.size, versionId).run();
  }

  return json({ id: fileId, storage_key: key, bytes: file.size, sha256 }, 201, env);
}


async function adminStartMultipart(request, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET || !env.DB) return json({ error: "Storage/database binding is not configured" }, 500, env);

  const body = await parseJson(request);
  const versionId = String(body?.version_id || "");
  const fileName = String(body?.file_name || "").trim();
  const fileType = String(body?.file_type || "other");
  const bytes = Number(body?.bytes || 0);
  const mimeType = String(body?.mime_type || "application/octet-stream");

  if (!versionId || !fileName || !Number.isFinite(bytes) || bytes <= 0) {
    return json({ error: "version_id, file_name, and positive bytes are required" }, 400, env);
  }

  const allowed = new Set(["apk", "xapk", "apks", "obb", "data", "patch", "zip", "other"]);
  if (!allowed.has(fileType)) return json({ error: "Unsupported file_type" }, 400, env);

  const version = await env.DB.prepare(
    "SELECT id FROM versions WHERE id=? LIMIT 1"
  ).bind(versionId).first();
  if (!version) return json({ error: "Version not found" }, 404, env);

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 150);
  const key = "files/" + versionId + "/" + crypto.randomUUID() + "-" + safeName;

  const multipart = await env.BUCKET.createMultipartUpload(key, {
    httpMetadata: {
      contentType: mimeType,
      contentDisposition: `attachment; filename="${safeName.replace(/"/g, "")}"`
    }
  });

  const sessionId = crypto.randomUUID();

  await env.DB.prepare(
    "INSERT INTO multipart_uploads(id,upload_id,version_id,storage_key,original_name,file_type,mime_type,bytes,created_at) VALUES(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)"
  ).bind(
    sessionId,
    multipart.uploadId,
    versionId,
    key,
    fileName,
    fileType,
    mimeType,
    bytes
  ).run();

  return json({
    session_id: sessionId,
    upload_id: multipart.uploadId,
    storage_key: key,
    part_size: 8 * 1024 * 1024
  }, 201, env);
}

async function adminUploadMultipartPart(request, sessionId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET || !env.DB) return json({ error: "Storage/database binding is not configured" }, 500, env);

  const partNumber = Number(new URL(request.url).searchParams.get("part"));
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
    return json({ error: "part must be an integer from 1 to 10000" }, 400, env);
  }

  const upload = await env.DB.prepare(
    "SELECT upload_id, storage_key FROM multipart_uploads WHERE id=? LIMIT 1"
  ).bind(sessionId).first();

  if (!upload) return json({ error: "Upload session not found" }, 404, env);

  const multipart = env.BUCKET.resumeMultipartUpload(upload.storage_key, upload.upload_id);
  const uploaded = await multipart.uploadPart(partNumber, request.body);
  const size = Number(request.headers.get("content-length") || 0);

  await env.DB.prepare(
    "INSERT OR REPLACE INTO multipart_parts(upload_session_id,part_number,etag,bytes) VALUES(?,?,?,?)"
  ).bind(sessionId, partNumber, uploaded.etag, size).run();

  return json({ session_id: sessionId, part: partNumber, etag: uploaded.etag, bytes: size }, 200, env);
}

async function adminCompleteMultipart(request, sessionId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET || !env.DB) return json({ error: "Storage/database binding is not configured" }, 500, env);

  const body = await parseJson(request);
  const upload = await env.DB.prepare(
    "SELECT id,upload_id,version_id,storage_key,original_name,file_type,mime_type,bytes FROM multipart_uploads WHERE id=? LIMIT 1"
  ).bind(sessionId).first();
  if (!upload) return json({ error: "Upload session not found" }, 404, env);

  const stored = await env.DB.prepare(
    "SELECT part_number,etag FROM multipart_parts WHERE upload_session_id=? ORDER BY part_number ASC"
  ).bind(sessionId).all();

  const parts = (body?.parts || []).map((part) => ({
    partNumber: Number(part.partNumber ?? part.part_number),
    etag: String(part.etag || "")
  })).filter((part) => Number.isInteger(part.partNumber) && part.partNumber > 0 && part.etag);

  if (!parts.length) return json({ error: "No multipart parts supplied" }, 400, env);

  const validStored = new Map((stored.results || []).map((p) => [p.part_number, p.etag]));
  if (parts.some((part) => validStored.get(part.partNumber) !== part.etag)) {
    return json({ error: "Multipart part verification failed" }, 409, env);
  }

  const clientSha256 = String(body?.sha256 || "").trim().toLowerCase();
  const sha256 = /^[0-9a-f]{64}$/.test(clientSha256) ? clientSha256 : null;

  if (sha256) {
    const existing = await env.DB.prepare(
      "SELECT id,storage_key,original_name,bytes,sha256,published FROM files WHERE version_id=? AND sha256=? LIMIT 1"
    ).bind(upload.version_id, sha256).first();

    if (existing) {
      await env.BUCKET.resumeMultipartUpload(upload.storage_key, upload.upload_id).abort();
      await env.DB.prepare("DELETE FROM multipart_parts WHERE upload_session_id=?").bind(sessionId).run();
      await env.DB.prepare("DELETE FROM multipart_uploads WHERE id=?").bind(sessionId).run();

      return json({
        error: "This exact file is already uploaded for this version.",
        duplicate: true,
        existing_file: existing
      }, 409, env);
    }
  }

  const multipart = env.BUCKET.resumeMultipartUpload(upload.storage_key, upload.upload_id);
  await multipart.complete(parts);

  const fileId = crypto.randomUUID();

  try {
    await env.DB.prepare(
      "INSERT INTO files(id,version_id,file_type,storage_key,original_name,mime_type,bytes,sha256,scan_status,published) VALUES(?,?,?,?,?,?,?,?,'clean',1)"
    ).bind(
      fileId,
      upload.version_id,
      upload.file_type,
      upload.storage_key,
      upload.original_name,
      upload.mime_type,
      upload.bytes,
      sha256
    ).run();
  } catch (error) {
    // Keep storage and database consistent if a race or uniqueness constraint
    // rejects the new record after the object was completed.
    await env.BUCKET.delete(upload.storage_key);
    throw error;
  }

  await env.DB.prepare(
    "UPDATE versions SET size_bytes=?,updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(upload.bytes, upload.version_id).run();

  await env.DB.prepare("DELETE FROM multipart_parts WHERE upload_session_id=?").bind(sessionId).run();
  await env.DB.prepare("DELETE FROM multipart_uploads WHERE id=?").bind(sessionId).run();

  return json({
    id: fileId,
    version_id: upload.version_id,
    storage_key: upload.storage_key,
    bytes: upload.bytes,
    sha256
  }, 201, env);
}

async function adminAbortMultipart(request, sessionId, env) {
  if (!requireAdmin(request, env)) return json({ error: "Unauthorized" }, 401, env);
  if (!env.BUCKET || !env.DB) return json({ error: "Storage/database binding is not configured" }, 500, env);

  const upload = await env.DB.prepare(
    "SELECT upload_id,storage_key FROM multipart_uploads WHERE id=? LIMIT 1"
  ).bind(sessionId).first();
  if (!upload) return json({ error: "Upload session not found" }, 404, env);

  await env.BUCKET.resumeMultipartUpload(upload.storage_key, upload.upload_id).abort();
  await env.DB.prepare("DELETE FROM multipart_parts WHERE upload_session_id=?").bind(sessionId).run();
  await env.DB.prepare("DELETE FROM multipart_uploads WHERE id=?").bind(sessionId).run();

  return json({ aborted: true }, 200, env);
}

async function serveFile(fileId, request, env) {
  if (!env.DB || !env.BUCKET) {
    return new Response("Download service is not configured", { status: 503 });
  }

  const file = await env.DB.prepare(`
    SELECT f.id, f.storage_key, f.original_name, f.mime_type, f.bytes,
           f.published,
           v.status AS version_status
    FROM files f
    JOIN versions v ON v.id = f.version_id
    WHERE f.id = ? LIMIT 1
  `).bind(fileId).first();

  if (!file || !file.published || file.version_status !== "published") {
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

      if (path === "/api/admin/audit" && request.method === "GET") {
        return adminAuditLog(request, env);
      }

      if (path === "/api/admin/apps" && request.method === "GET") {
        return adminListApps(request, env);
      }

      if (path === "/api/admin/apps" && request.method === "POST") {
        return adminCreateApp(request, env);
      }

      if (path === "/api/admin/tutorials" && request.method === "POST") {
        return adminCreateTutorial(request, env);
      }

      if (path.startsWith("/api/admin/tutorials/") && request.method === "PATCH") {
        const tutorialId = decodeURIComponent(path.slice("/api/admin/tutorials/".length));
        return adminEditTutorial(request, tutorialId, env);
      }

      if (path.startsWith("/api/admin/apps/") && path.endsWith("/edit") && request.method === "PATCH") {
        const appId = decodeURIComponent(path.slice("/api/admin/apps/".length, -"/edit".length));
        return adminEditApp(request, appId, env);
      }

      if (path.startsWith("/api/admin/apps/") && path.endsWith("/screenshots") && request.method === "POST") {
        const appId = decodeURIComponent(path.slice("/api/admin/apps/".length, -"/screenshots".length));
        return adminUploadScreenshot(request, appId, env);
      }

      if (path.startsWith("/api/admin/apps/") && path.endsWith("/tutorials") && request.method === "GET") {
        const appId = decodeURIComponent(path.slice("/api/admin/apps/".length, -"/tutorials".length));
        return adminListTutorials(request, appId, env);
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

      if (path.startsWith("/api/admin/versions/") && path.endsWith("/edit") && request.method === "PATCH") {
        const versionId = decodeURIComponent(path.slice("/api/admin/versions/".length, -"/edit".length));
        return adminEditVersion(request, versionId, env);
      }

      if (path.startsWith("/api/admin/versions/") && path.endsWith("/files") && request.method === "GET") {
        const versionId = decodeURIComponent(path.slice("/api/admin/versions/".length, -"/files".length));
        return adminListFilesForVersion(request, versionId, env);
      }

      if (path.startsWith("/api/admin/versions/") && path.endsWith("/status") && request.method === "PATCH") {
        const versionId = decodeURIComponent(path.slice("/api/admin/versions/".length, -"/status".length));
        return adminSetVersionStatus(request, versionId, env);
      }

      if (path === "/api/admin/files" && request.method === "POST") {
        return uploadFile(request, env);
      }

      if (path === "/api/admin/uploads/start" && request.method === "POST") {
        return adminStartMultipart(request, env);
      }

      if (path.startsWith("/api/admin/uploads/") && path.endsWith("/part") && request.method === "PUT") {
        const sessionId = decodeURIComponent(path.slice("/api/admin/uploads/".length, -"/part".length));
        return adminUploadMultipartPart(request, sessionId, env);
      }

      if (path.startsWith("/api/admin/uploads/") && path.endsWith("/complete") && request.method === "POST") {
        const sessionId = decodeURIComponent(path.slice("/api/admin/uploads/".length, -"/complete".length));
        return adminCompleteMultipart(request, sessionId, env);
      }

      if (path.startsWith("/api/admin/uploads/") && request.method === "DELETE") {
        const sessionId = decodeURIComponent(path.slice("/api/admin/uploads/".length));
        return adminAbortMultipart(request, sessionId, env);
      }

      if (path.startsWith("/api/admin/files/") && path.endsWith("/verify") && request.method === "PATCH") {
        const fileId = decodeURIComponent(path.slice("/api/admin/files/".length, -"/verify".length));
        return adminVerifyFile(request, fileId, env);
      }

      if (path.startsWith("/api/admin/files/") && path.endsWith("/publish") && request.method === "PATCH") {
        const fileId = decodeURIComponent(path.slice("/api/admin/files/".length, -"/publish".length));
        return adminPublishFile(request, fileId, env);
      }

      if (path.startsWith("/api/admin/files/") && path.endsWith("/archive") && request.method === "PATCH") {
        const fileId = decodeURIComponent(path.slice("/api/admin/files/".length, -"/archive".length));
        return adminArchiveFile(request, fileId, env);
      }

      if (path.startsWith("/api/admin/screenshots/") && request.method === "DELETE") {
        const screenshotId = decodeURIComponent(path.slice("/api/admin/screenshots/".length));
        return adminDeleteScreenshot(request, screenshotId, env);
      }

      if (path.startsWith("/media/screenshots/") && request.method === "GET") {
        return serveScreenshot(path.slice("/media/screenshots/".length), env);
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
