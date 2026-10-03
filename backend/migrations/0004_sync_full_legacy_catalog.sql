-- Sync the complete original catalog into the live D1 CMS.
-- This migration restores editable app/game descriptions and full MOD feature lists
-- from the last known complete catalog, while preserving uploaded R2 files/icons.
PRAGMA foreign_keys = ON;

UPDATE apps
SET name='CapCut MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='ByteDance Pte. Ltd.', genre='Video Players & Editors', description_html='<strong>UNLIMITED CREATIVITY FOR VIDEO EDITING</strong><br><br>
    CapCut MOD APK is the ultimate all-in-one video editing app that empowers you to create stunning content.<br><br>

    <strong>ADVANCED KEYFRAME ANIMATION</strong><br><br>
    Add precise control to your edits with keyframe animation. Animate any element smoothly.<br><br>

    <strong>THOUSANDS OF PREMIUM EFFECTS & TEMPLATES</strong><br><br>
    Access a massive library of pro templates, trending effects, transitions, and filters.<br><br>

    <strong>PROFESSIONAL TOOLS WITHOUT LIMITS</strong><br><br>
    Multi-layer editing, voice-over recording, speed control, chroma key, and more.<br><br>

    <strong>PERFECT FOR CONTENT CREATORS</strong><br><br>
    Whether you''re making TikTok videos, YouTube shorts, or Instagram Reels — CapCut MOD gives you everything unlocked.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/capcut.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.lemon.lvoverseas',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='capcut-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001002',a.id,'12.3.0','Pro Unlocked
Pro Unlocked
No Watermark
All Effects Enabled
Premium Transitions
4K Export
Keyframe Animation','Legacy catalog restore','',NULL,81788928,'published'
FROM apps a
WHERE a.slug='capcut-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='12.3.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
No Watermark
All Effects Enabled
Premium Transitions
4K Export
Keyframe Animation',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 81788928 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='capcut-mod' LIMIT 1)
  AND version_name='12.3.0';

UPDATE apps
SET name='Spotify MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Spotify AB', genre='Music & Audio', description_html='<strong>PREMIUM EXPERIENCE WITHOUT SUBSCRIPTION</strong><br><br>
    Spotify MOD APK gives you full Premium experience for free. Listen to millions of songs and podcasts without restrictions.<br><br>

    <strong>AD-FREE LISTENING FOREVER</strong><br><br>
    No interruptions from audio or banner ads. Stream smoothly.<br><br>

    <strong>UNLIMITED SKIPS & ON-DEMAND PLAYBACK</strong><br><br>
    Skip as many tracks as you want. Choose any song instantly — no shuffle required.<br><br>

    <strong>OFFLINE DOWNLOADS</strong><br><br>
    Download playlists, albums, and podcasts for offline listening.<br><br>

    <strong>VERY HIGH AUDIO QUALITY</strong><br><br>
    Stream at 320kbps — hear every detail as the artist intended.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/spotify.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.spotify.music',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='spotify-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001003',a.id,'8.9.18','Premium Unlocked
Premium Unlocked
No Ads
Unlimited Skips
Offline Download
Very High Quality Audio','Legacy catalog restore','',NULL,47185920,'published'
FROM apps a
WHERE a.slug='spotify-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='8.9.18');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
No Ads
Unlimited Skips
Offline Download
Very High Quality Audio',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 47185920 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='spotify-mod' LIMIT 1)
  AND version_name='8.9.18';

UPDATE apps
SET name='Remini MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Bending Spoons', genre='Photo Editing', description_html='<strong>AI PHOTO ENHANCER</strong><br><br>
    Remini MOD APK - Unlimited AI credits, HD enhancement, no ads.<br><br>

    <strong>RESTORE OLD PHOTOS</strong><br><br>
    Bring blurry or old photos back to life with AI.<br><br>

    <strong>ENHANCE QUALITY</strong><br><br>
    Turn low-resolution photos into HD.<br><br>

    <strong>BATCH PROCESSING</strong><br><br>
    Enhance multiple photos at once.<br><br>

    <strong>NO LIMITS</strong><br><br>
    Unlimited processing without waiting.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/remini.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.remini.app',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='remini-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001004',a.id,'3.8.5','Pro Unlocked
Pro Unlocked
Unlimited Credits
HD Enhancement
Batch Processing
No Ads','Legacy catalog restore','',NULL,68157440,'published'
FROM apps a
WHERE a.slug='remini-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.8.5');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
Unlimited Credits
HD Enhancement
Batch Processing
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 68157440 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='remini-mod' LIMIT 1)
  AND version_name='3.8.5';

UPDATE apps
SET name='Alight Motion MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Alight Creative, Inc.', genre='Video Editing', description_html='<strong>PROFESSIONAL MOTION DESIGN</strong><br><br>
    Alight Motion MOD APK - Full Pro unlocked, no watermark, all premium effects.<br><br>

    <strong>KEYFRAME ANIMATION</strong><br><br>
    Precise control over every element.<br><br>

    <strong>PREMIUM EFFECTS & PRESETS</strong><br><br>
    Blur, glow, distortion, vector graphics.<br><br>

    <strong>XML PROJECT SUPPORT</strong><br><br>
    Import and export projects easily.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Export clean videos.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/alightmotion.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.alightcreative.motion',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='alight-motion-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001005',a.id,'5.0.0','Pro Unlocked
Pro Unlocked
No Watermark
All Premium Effects
Keyframe Animation
XML Import/Export','Legacy catalog restore','',NULL,104857600,'published'
FROM apps a
WHERE a.slug='alight-motion-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='5.0.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
No Watermark
All Premium Effects
Keyframe Animation
XML Import/Export',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 104857600 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='alight-motion-mod' LIMIT 1)
  AND version_name='5.0.0';

UPDATE apps
SET name='KineMaster MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='KineMaster Corporation', genre='Video Editing', description_html='<strong>POWERFUL VIDEO EDITOR</strong><br><br>
    KineMaster MOD APK - No watermark, premium assets, chroma key.<br><br>

    <strong>CHROMA KEY</strong><br><br>
    Professional green screen effects.<br><br>

    <strong>PREMIUM ASSET STORE</strong><br><br>
    All transitions, effects, music unlocked.<br><br>

    <strong>4K EXPORT</strong><br><br>
    High quality video output.<br><br>

    <strong>MULTI-LAYER EDITING</strong><br><br>
    Add multiple video, image, text layers.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/kinemaster.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.nexstreaming.app.kinemasterfree',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='kinemaster-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001006',a.id,'7.4.0','Diamond Unlocked
Diamond Unlocked
No Watermark
Chroma Key
Premium Assets
4K Export','Legacy catalog restore','',NULL,99614720,'published'
FROM apps a
WHERE a.slug='kinemaster-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='7.4.0');

UPDATE versions
SET mod_info='Diamond Unlocked
Diamond Unlocked
No Watermark
Chroma Key
Premium Assets
4K Export',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 99614720 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='kinemaster-mod' LIMIT 1)
  AND version_name='7.4.0';

UPDATE apps
SET name='InShot MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='InShot Inc.', genre='Video Editing', description_html='<strong>EASY & POWERFUL VIDEO EDITOR</strong><br><br>
    InShot MOD APK - Pro unlocked, no ads, all filters.<br><br>

    <strong>ALL FILTERS & EFFECTS</strong><br><br>
    Premium transitions and effects.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Clean export.<br><br>

    <strong>MUSIC LIBRARY</strong><br><br>
    Add trending music.<br><br>

    <strong>TEXT & STICKERS</strong><br><br>
    Animated text and stickers.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/inshot.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.camerasideas.instashot',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='inshot-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001007',a.id,'2.0.0','Pro Unlocked
Pro Unlocked
No Ads
All Filters
No Watermark
Music Library','Legacy catalog restore','',NULL,73400320,'published'
FROM apps a
WHERE a.slug='inshot-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.0.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
No Ads
All Filters
No Watermark
Music Library',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 73400320 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='inshot-mod' LIMIT 1)
  AND version_name='2.0.0';

UPDATE apps
SET name='VN Video Editor MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Ubiquiti Labs', genre='Video Editing', description_html='<strong>PROFESSIONAL VIDEO EDITOR</strong><br><br>
    VN MOD APK - Pro templates, multi-layer editing, no watermark.<br><br>

    <strong>MULTI-LAYER TIMELINE</strong><br><br>
    Professional editing control.<br><br>

    <strong>PRO TEMPLATES</strong><br><br>
    Ready-to-use professional templates.<br><br>

    <strong>KEYFRAME & MASK</strong><br><br>
    Advanced animation and masking tools.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Export clean videos.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/vn.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.frontrow.vlog',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='vn-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001008',a.id,'2.2.0','Pro Unlocked
Pro Unlocked
No Watermark
Multi-Layer
Pro Templates
Keyframe & Mask','Legacy catalog restore','',NULL,167772160,'published'
FROM apps a
WHERE a.slug='vn-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.2.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
No Watermark
Multi-Layer
Pro Templates
Keyframe & Mask',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 167772160 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='vn-mod' LIMIT 1)
  AND version_name='2.2.0';

UPDATE apps
SET name='PowerDirector MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='CyberLink', genre='Video Editing', description_html='<strong>PROFESSIONAL VIDEO EDITOR</strong><br><br>
    PowerDirector MOD - Premium effects, chroma key, 4K support.<br><br>

    <strong>CHROMA KEY</strong><br><br>
    Professional green screen effects.<br><br>

    <strong>4K SUPPORT</strong><br><br>
    Export in ultra high definition.<br><br>

    <strong>PREMIUM EFFECTS</strong><br><br>
    All pro effects and transitions unlocked.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean editing experience.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/powerdirector.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.cyberlink.powerdirector.DRA140225_01',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='powerdirector-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001009',a.id,'13.0.0','Premium Unlocked
Premium Unlocked
Chroma Key
4K Export
Premium Effects
No Ads','Legacy catalog restore','',NULL,125829120,'published'
FROM apps a
WHERE a.slug='powerdirector-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='13.0.0');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
Chroma Key
4K Export
Premium Effects
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 125829120 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='powerdirector-mod' LIMIT 1)
  AND version_name='13.0.0';

UPDATE apps
SET name='Canva MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Canva', genre='Graphic Design', description_html='<strong>GRAPHIC DESIGN MADE EASY</strong><br><br>
    Canva MOD - Pro templates, elements, background remover unlocked.<br><br>

    <strong>PRO TEMPLATES</strong><br><br>
    Thousands of premium templates.<br><br>

    <strong>ALL ELEMENTS</strong><br><br>
    Premium photos, icons, fonts.<br><br>

    <strong>BACKGROUND REMOVER</strong><br><br>
    Remove backgrounds with one tap.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Export clean designs.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/canva.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.canva.editor',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='canva-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001010',a.id,'2.250.0','Pro Unlocked
Pro Unlocked
All Premium Templates
Premium Elements
Background Remover
No Watermark','Legacy catalog restore','',NULL,41943040,'published'
FROM apps a
WHERE a.slug='canva-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.250.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
All Premium Templates
Premium Elements
Background Remover
No Watermark',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 41943040 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='canva-mod' LIMIT 1)
  AND version_name='2.250.0';

UPDATE apps
SET name='GBWhatsApp MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='', genre='Communication', description_html='<strong>ENHANCED WHATSAPP EXPERIENCE</strong><br><br>
    GBWhatsApp MOD - Privacy options, custom themes, dual account.<br><br>

    <strong>PRIVACY OPTIONS</strong><br><br>
    Hide online status, blue ticks, typing.<br><br>

    <strong>CUSTOM THEMES</strong><br><br>
    Thousands of themes available.<br><br>

    <strong>DUAL ACCOUNT</strong><br><br>
    Run two WhatsApp on one phone.<br><br>

    <strong>MESSAGE SCHEDULER</strong><br><br>
    Schedule messages to send later.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/gbwhatsapp.png' ELSE icon_url END,
    play_store_url='',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='gbwhatsapp-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001011',a.id,'17.85','Pro Unlocked
Privacy Options
Custom Themes
Dual Account
Message Scheduler
No Ads','Legacy catalog restore','',NULL,62914560,'published'
FROM apps a
WHERE a.slug='gbwhatsapp-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='17.85');

UPDATE versions
SET mod_info='Pro Unlocked
Privacy Options
Custom Themes
Dual Account
Message Scheduler
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 62914560 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='gbwhatsapp-mod' LIMIT 1)
  AND version_name='17.85';

UPDATE apps
SET name='PicsArt MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='PicsArt Inc.', genre='Photo & Video Editor', description_html='<strong>ALL-IN-ONE PHOTO & VIDEO EDITOR</strong><br><br>
    PicsArt Gold MOD - All stickers, effects, AI tools unlocked.<br><br>

    <strong>AI TOOLS</strong><br><br>
    Background remover, AI replace, object removal.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean editing experience without interruptions.<br><br>

    <strong>PROFESSIONAL FEATURES</strong><br><br>
    Layers, masks, dispersion, clone tool.<br><br>

    <strong>THOUSANDS OF STICKERS & FONTS</strong><br><br>
    Full access to premium content.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/picsart.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.picsart.studio',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='picsart-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001012',a.id,'25.0.0','Gold Unlocked
Gold Unlocked
No Ads
AI Tools
Background Remover
All Stickers & Effects','Legacy catalog restore','',NULL,83886080,'published'
FROM apps a
WHERE a.slug='picsart-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='25.0.0');

UPDATE versions
SET mod_info='Gold Unlocked
Gold Unlocked
No Ads
AI Tools
Background Remover
All Stickers & Effects',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 83886080 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='picsart-mod' LIMIT 1)
  AND version_name='25.0.0';

UPDATE apps
SET name='PhotoRoom MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='PhotoRoom', genre='Photo Editing', description_html='<strong>INSTANT BACKGROUND REMOVE</strong><br><br>
    PhotoRoom MOD - Unlimited background remove, pro templates.<br><br>

    <strong>BATCH EDITING</strong><br><br>
    Edit multiple photos at once.<br><br>

    <strong>HD EXPORT</strong><br><br>
    High quality output every time.<br><br>

    <strong>PROFESSIONAL TEMPLATES</strong><br><br>
    Product photos, portraits, Instagram posts.<br><br>

    <strong>NO LIMITS</strong><br><br>
    Full pro access without restrictions.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/photoroom.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.photoroom.app',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='photoroom-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001013',a.id,'4.8.0','Pro Unlocked
Pro Unlocked
Unlimited Remove
Pro Templates
Batch Edit
HD Export','Legacy catalog restore','',NULL,57671680,'published'
FROM apps a
WHERE a.slug='photoroom-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='4.8.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
Unlimited Remove
Pro Templates
Batch Edit
HD Export',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 57671680 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='photoroom-mod' LIMIT 1)
  AND version_name='4.8.0';

UPDATE apps
SET name='Truecaller Premium MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Truecaller', genre='Communication', description_html='<strong>ADVANCED CALLER ID & SPAM PROTECTION</strong><br><br>
    Truecaller Premium MOD - No ads, ghost call, who viewed profile.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean interface without interruptions.<br><br>

    <strong>GHOST CALL</strong><br><br>
    Schedule fake calls to escape situations.<br><br>

    <strong>WHO VIEWED MY PROFILE</strong><br><br>
    See who checked your profile.<br><br>

    <strong>ADVANCED SPAM BLOCKING</strong><br><br>
    Block by name, series, or country.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/truecaller.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.truecaller',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='truecaller-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001014',a.id,'13.5.0','Premium Unlocked
Premium Unlocked
No Ads
Ghost Call
Who Viewed Profile
Advanced Spam Block','Legacy catalog restore','',NULL,94371840,'published'
FROM apps a
WHERE a.slug='truecaller-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='13.5.0');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
No Ads
Ghost Call
Who Viewed Profile
Advanced Spam Block',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 94371840 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='truecaller-mod' LIMIT 1)
  AND version_name='13.5.0';

UPDATE apps
SET name='SnapTube MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='', genre='Video Downloader', description_html='<strong>DOWNLOAD FROM ANY PLATFORM</strong><br><br>
    SnapTube MOD - Download videos from YouTube, Facebook, Instagram, TikTok.<br><br>

    <strong>4K & 8K SUPPORT</strong><br><br>
    Download in highest quality available.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean experience without interruptions.<br><br>

    <strong>BATCH DOWNLOAD</strong><br><br>
    Download multiple videos at once.<br><br>

    <strong>AUDIO EXTRACT</strong><br><br>
    Convert videos to MP3.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/snaptube.png' ELSE icon_url END,
    play_store_url='',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='snaptube-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001015',a.id,'7.0.0','VIP Unlocked
VIP Unlocked
No Ads
4K Download
Batch Download
Audio Extract','Legacy catalog restore','',NULL,26214400,'published'
FROM apps a
WHERE a.slug='snaptube-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='7.0.0');

UPDATE versions
SET mod_info='VIP Unlocked
VIP Unlocked
No Ads
4K Download
Batch Download
Audio Extract',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 26214400 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='snaptube-mod' LIMIT 1)
  AND version_name='7.0.0';

UPDATE apps
SET name='Telegram Premium MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Telegram FZ-LLC', genre='Communication', description_html='<strong>FASTER & MORE FEATURES</strong><br><br>
    Telegram Premium MOD - Unlimited cloud, faster download, premium stickers.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean chat experience.<br><br>

    <strong>FASTER DOWNLOADS</strong><br><br>
    2x faster speed.<br><br>

    <strong>UNLIMITED CLOUD</strong><br><br>
    Store unlimited files.<br><br>

    <strong>PREMIUM STICKERS & REACTIONS</strong><br><br>
    Exclusive animated stickers.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/telegram.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=org.telegram.messenger',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='telegram-premium-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001016',a.id,'10.5.0','Premium Unlocked
Premium Unlocked
No Ads
Faster Download
Unlimited Cloud
Premium Stickers','Legacy catalog restore','',NULL,57671680,'published'
FROM apps a
WHERE a.slug='telegram-premium-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='10.5.0');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
No Ads
Faster Download
Unlimited Cloud
Premium Stickers',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 57671680 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='telegram-premium-mod' LIMIT 1)
  AND version_name='10.5.0';

UPDATE apps
SET name='Instagram Pro (Insta Thunder)', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='', genre='Social', description_html='<strong>ADVANCED INSTAGRAM EXPERIENCE</strong><br><br>
    Insta Thunder MOD - Download media, no ads, privacy options.<br><br>

    <strong>DOWNLOAD ANYTHING</strong><br><br>
    Photos, videos, stories, reels.<br><br>

    <strong>PRIVACY FEATURES</strong><br><br>
    Hide view stories, typing status, online status.<br><br>

    <strong>DARK MODE & CUSTOM THEMES</strong><br><br>
    Full customization.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean feed and stories.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/instathunder.png' ELSE icon_url END,
    play_store_url='',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='insta-thunder-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001017',a.id,'300.0','Pro Unlocked
Pro Unlocked
Download Media
No Ads
Privacy Options
Dark Mode','Legacy catalog restore','',NULL,73400320,'published'
FROM apps a
WHERE a.slug='insta-thunder-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='300.0');

UPDATE versions
SET mod_info='Pro Unlocked
Pro Unlocked
Download Media
No Ads
Privacy Options
Dark Mode',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 73400320 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='insta-thunder-mod' LIMIT 1)
  AND version_name='300.0';

UPDATE apps
SET name='Twitter X Gold MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='', genre='Social', description_html='<strong>ENHANCED TWITTER EXPERIENCE</strong><br><br>
    Twitter Gold MOD - No ads, download videos, premium features.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean timeline and replies.<br><br>

    <strong>DOWNLOAD VIDEOS</strong><br><br>
    Save any video or GIF.<br><br>

    <strong>BLUE TICK HIDE</strong><br><br>
    Read messages without showing seen.<br><br>

    <strong>LONGER POSTS</strong><br><br>
    Write longer tweets.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/twittergold.png' ELSE icon_url END,
    play_store_url='',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='twitter-gold-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001018',a.id,'10.5.0','Premium Unlocked
Premium Unlocked
No Ads
Download Videos
Blue Tick Hide
Longer Posts','Legacy catalog restore','',NULL,104857600,'published'
FROM apps a
WHERE a.slug='twitter-gold-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='10.5.0');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
No Ads
Download Videos
Blue Tick Hide
Longer Posts',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 104857600 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='twitter-gold-mod' LIMIT 1)
  AND version_name='10.5.0';

UPDATE apps
SET name='Netflix MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Netflix Inc.', genre='Entertainment', description_html='<strong>WATCH EVERYTHING FREE</strong><br><br>
    Netflix MOD - 4K streaming, no ads, download all content.<br><br>

    <strong>ALL CONTENT UNLOCKED</strong><br><br>
    Watch any movie or series from any region.<br><br>

    <strong>NO ADS</strong><br><br>
    Uninterrupted viewing experience.<br><br>

    <strong>OFFLINE DOWNLOAD</strong><br><br>
    Download for offline watching.<br><br>

    <strong>4K & HDR</strong><br><br>
    Highest quality streaming.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/netflix.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='netflix-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001019',a.id,'8.12.0','Premium Unlocked
Premium Unlocked
4K Streaming
No Ads
Download All
All Regions','Legacy catalog restore','',NULL,62914560,'published'
FROM apps a
WHERE a.slug='netflix-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='8.12.0');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
4K Streaming
No Ads
Download All
All Regions',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 62914560 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='netflix-mod' LIMIT 1)
  AND version_name='8.12.0';

UPDATE apps
SET name='Crunchyroll MOD', category_id=(SELECT id FROM categories WHERE slug='apps' LIMIT 1),
    publisher='Crunchyroll', genre='Entertainment', description_html='<strong>ULTIMATE ANIME STREAMING</strong><br><br>
    Crunchyroll MOD - Ad-free anime, offline download, simulcasts.<br><br>

    <strong>NO ADS</strong><br><br>
    Watch without interruptions.<br><br>

    <strong>OFFLINE DOWNLOAD</strong><br><br>
    Download episodes for offline.<br><br>

    <strong>SIMULCASTS</strong><br><br>
    New episodes 1 hour after Japan.<br><br>

    <strong>HD & FULL LIBRARY</strong><br><br>
    Access everything in high quality.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/crunchyroll.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.crunchyroll.crunchyroid',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='crunchyroll-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001020',a.id,'3.5.0','Premium Unlocked
Premium Unlocked
No Ads
Offline Download
Simulcasts
HD Streaming','Legacy catalog restore','',NULL,73400320,'published'
FROM apps a
WHERE a.slug='crunchyroll-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.5.0');

UPDATE versions
SET mod_info='Premium Unlocked
Premium Unlocked
No Ads
Offline Download
Simulcasts
HD Streaming',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 73400320 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='crunchyroll-mod' LIMIT 1)
  AND version_name='3.5.0';

UPDATE apps
SET name='Free Fire MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Garena International', genre='Action', description_html='<strong>DOMINATE EVERY MATCH</strong><br><br>
      Free Fire MOD APK with unlimited diamonds, aimbot, ESP wallhack, and anti-ban protection. Get instant access to premium items and dominate the battlefield.<br><br>

      <strong>UNLIMITED DIAMONDS & RESOURCES</strong><br><br>
      Buy any skin, character, weapon, or bundle without grinding. Everything is available from the start.<br><br>

      <strong>AIMBOT & AUTO HEADSHOT</strong><br><br>
      Lock onto enemies automatically with perfect accuracy. Land headshots consistently for quick eliminations.<br><br>

      <strong>ESP WALLHACK & NO RECOIL</strong><br><br>
      See enemies through walls, track their movement, and fire with zero recoil for unmatched control.<br><br>

      <strong>SAFE WITH ANTI-BAN</strong><br><br>
      Advanced protection keeps your account secure while enjoying all premium advantages.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/freefire.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.dts.freefireth',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='freefire-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001021',a.id,'1.104.1','Unlimited Diamonds
Unlimited Diamonds
Aimbot + Auto Headshot
No Recoil
ESP Wallhack
Anti-Ban Protection','Legacy catalog restore','',NULL,681574400,'published'
FROM apps a
WHERE a.slug='freefire-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.104.1');

UPDATE versions
SET mod_info='Unlimited Diamonds
Unlimited Diamonds
Aimbot + Auto Headshot
No Recoil
ESP Wallhack
Anti-Ban Protection',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 681574400 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='freefire-mod' LIMIT 1)
  AND version_name='1.104.1';

UPDATE apps
SET name='PUBG Mobile MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Level Infinite', genre='Action', description_html='<strong>ULTIMATE BATTLE ROYALE DOMINATION</strong><br><br>
      PUBG Mobile MOD APK with unlimited UC, wallhack, aimbot, and magic bullet. Unlock every premium item and dominate every match.<br><br>

      <strong>UNLIMITED UC & RESOURCES</strong><br><br>
      Purchase any outfit, vehicle skin, weapon upgrade, or Royale Pass tier instantly.<br><br>

      <strong>AIMBOT & MAGIC BULLET</strong><br><br>
      Automatic targeting with perfect accuracy—even through obstacles for guaranteed hits.<br><br>

      <strong>WALLHACK & NO GRASS</strong><br><br>
      See enemies through walls and remove grass for clear visibility in every environment.<br><br>

      <strong>ZERO RECOIL & HIGH DAMAGE</strong><br><br>
      Fire with perfect stability and increased damage output for faster eliminations.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/pubg.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.tencent.ig',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='pubg-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001022',a.id,'3.5.0','Global Unlimited UC
Unlimited UC
Wallhack
Aimbot
No Grass + High Damage
Magic Bullet','Legacy catalog restore','',NULL,1288490189,'published'
FROM apps a
WHERE a.slug='pubg-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.5.0');

UPDATE versions
SET mod_info='Global Unlimited UC
Unlimited UC
Wallhack
Aimbot
No Grass + High Damage
Magic Bullet',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 1288490189 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='pubg-mod' LIMIT 1)
  AND version_name='3.5.0';

UPDATE apps
SET name='Mobile Legends MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Moonton', genre='MOBA', description_html='<strong>EPIC MOBA DOMINATION</strong><br><br>
      Mobile Legends MOD APK with map hack, drone view, unlimited diamonds, and all skins unlocked. Gain complete battlefield awareness and premium cosmetics.<br><br>

      <strong>UNLOCK ALL SKINS & HEROES</strong><br><br>
      Access every epic, legend, and special skin instantly. Customize your heroes with the rarest cosmetics.<br><br>

      <strong>MAP HACK & DRONE VIEW</strong><br><br>
      See the entire map and enemy positions. Expand your camera view for perfect strategic planning.<br><br>

      <strong>UNLIMITED DIAMONDS</strong><br><br>
      Purchase anything in the shop without limits. Upgrade emblems and acquire battle effects freely.<br><br>

      <strong>RADAR HACK & NO COOLDOWN</strong><br><br>
      Track enemies precisely and spam skills without waiting—turn matches in your favor.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/mlbb.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.mobile.legends',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='mlbb-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001023',a.id,'1.8.66','Unlock All Skins
Unlimited Diamonds
Map Hack
Drone View
Unlock All Skins
Radar Hack','Legacy catalog restore','',NULL,146800640,'published'
FROM apps a
WHERE a.slug='mlbb-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.8.66');

UPDATE versions
SET mod_info='Unlock All Skins
Unlimited Diamonds
Map Hack
Drone View
Unlock All Skins
Radar Hack',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 146800640 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='mlbb-mod' LIMIT 1)
  AND version_name='1.8.66';

UPDATE apps
SET name='Subway Surfers MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='SYBO Games', genre='Endless Runner', description_html='Subway Surfers MOD APK - Unlimited coins & keys, all characters unlocked.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/subwaysurfers.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='subway-surfers-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001024',a.id,'3.25.0','Unlimited Coins
Unlimited Coins & Keys
All Characters Unlocked
All Boards
No Ads
God Mode','Legacy catalog restore','',NULL,178257920,'published'
FROM apps a
WHERE a.slug='subway-surfers-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.25.0');

UPDATE versions
SET mod_info='Unlimited Coins
Unlimited Coins & Keys
All Characters Unlocked
All Boards
No Ads
God Mode',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 178257920 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='subway-surfers-mod' LIMIT 1)
  AND version_name='3.25.0';

UPDATE apps
SET name='Candy Crush Saga MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='King', genre='Puzzle', description_html='Candy Crush Saga MOD APK - Unlimited lives, boosters, all levels unlocked.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/candycrush.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.king.candycrushsaga',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='candy-crush-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001025',a.id,'1.290.0','Unlimited Lives
Unlimited Lives
Unlimited Boosters
All Levels Unlocked
Unlimited Gold
No Ads','Legacy catalog restore','',NULL,94371840,'published'
FROM apps a
WHERE a.slug='candy-crush-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.290.0');

UPDATE versions
SET mod_info='Unlimited Lives
Unlimited Lives
Unlimited Boosters
All Levels Unlocked
Unlimited Gold
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 94371840 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='candy-crush-mod' LIMIT 1)
  AND version_name='1.290.0';

UPDATE apps
SET name='Clash of Clans MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Supercell', genre='Strategy', description_html='Clash of Clans MOD APK - Unlimited gems, gold, elixir, private server.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/clashclans.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.supercell.clashofclans',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='clash-clans-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001026',a.id,'16.0.0','Unlimited Gems
Unlimited Gems
Unlimited Gold & Elixir
Private Server
All Troops Max
No Ads','Legacy catalog restore','',NULL,314572800,'published'
FROM apps a
WHERE a.slug='clash-clans-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='16.0.0');

UPDATE versions
SET mod_info='Unlimited Gems
Unlimited Gems
Unlimited Gold & Elixir
Private Server
All Troops Max
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 314572800 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='clash-clans-mod' LIMIT 1)
  AND version_name='16.0.0';

UPDATE apps
SET name='Roblox MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Roblox Corporation', genre='Adventure', description_html='Roblox MOD APK - Menu mod, fly, speed, god mode.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/roblox.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.roblox.client',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='roblox-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001027',a.id,'2.644.704','Menu MOD
Fly
Speed Hack
No Clip
God Mode
Unlimited Robux','Legacy catalog restore','',NULL,157286400,'published'
FROM apps a
WHERE a.slug='roblox-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.644.704');

UPDATE versions
SET mod_info='Menu MOD
Fly
Speed Hack
No Clip
God Mode
Unlimited Robux',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 157286400 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='roblox-mod' LIMIT 1)
  AND version_name='2.644.704';

UPDATE apps
SET name='Call of Duty Mobile MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Activision', genre='FPS', description_html='Call of Duty Mobile MOD APK - Unlimited CP, aimbot, no recoil.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/codmobile.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='cod-mobile-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001028',a.id,'1.0.45','Unlimited CP
Unlimited CP
Aimbot
No Recoil
Wall Hack
Unlocked Skins','Legacy catalog restore','',NULL,2684354560,'published'
FROM apps a
WHERE a.slug='cod-mobile-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.0.45');

UPDATE versions
SET mod_info='Unlimited CP
Unlimited CP
Aimbot
No Recoil
Wall Hack
Unlocked Skins',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 2684354560 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='cod-mobile-mod' LIMIT 1)
  AND version_name='1.0.45';

UPDATE apps
SET name='Among Us MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Innersloth', genre='Social Deduction', description_html='Among Us MOD APK - Always impostor, no kill cooldown, speed hack.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/amongus.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.innersloth.spacemafia',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='among-us-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001029',a.id,'2024.12.9','Always Impostor
Always Impostor
No Kill Cooldown
Speed Hack
See Impostor
Unlocked Skins','Legacy catalog restore','',NULL,209715200,'published'
FROM apps a
WHERE a.slug='among-us-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2024.12.9');

UPDATE versions
SET mod_info='Always Impostor
Always Impostor
No Kill Cooldown
Speed Hack
See Impostor
Unlocked Skins',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 209715200 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='among-us-mod' LIMIT 1)
  AND version_name='2024.12.9';

UPDATE apps
SET name='Stumble Guys MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Kitka Games', genre='Party', description_html='Stumble Guys MOD APK - Unlimited gems, all skins unlocked.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/stumbleguys.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.kitkagames.fallguysmobile',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='stumble-guys-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001030',a.id,'0.63','Unlimited Gems
Unlimited Gems
All Skins Unlocked
No Ads
Speed Hack
God Mode','Legacy catalog restore','',NULL,188743680,'published'
FROM apps a
WHERE a.slug='stumble-guys-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='0.63');

UPDATE versions
SET mod_info='Unlimited Gems
Unlimited Gems
All Skins Unlocked
No Ads
Speed Hack
God Mode',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 188743680 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='stumble-guys-mod' LIMIT 1)
  AND version_name='0.63';

UPDATE apps
SET name='Brawl Stars MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Supercell', genre='MOBA', description_html='Brawl Stars MOD APK - Unlimited gems, all brawlers unlocked.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/brawlstars.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.supercell.brawlstars',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='brawl-stars-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001031',a.id,'53.176','Unlimited Gems
Unlimited Gems
All Brawlers Unlocked
Unlimited Tickets
Private Server
No Ads','Legacy catalog restore','',NULL,471859200,'published'
FROM apps a
WHERE a.slug='brawl-stars-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='53.176');

UPDATE versions
SET mod_info='Unlimited Gems
Unlimited Gems
All Brawlers Unlocked
Unlimited Tickets
Private Server
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 471859200 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='brawl-stars-mod' LIMIT 1)
  AND version_name='53.176';

UPDATE apps
SET name='Shadow Fight 3 MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Nekki', genre='Fighting', description_html='Shadow Fight 3 MOD APK - Unlimited money, frozen enemy.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/shadowfight3.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.nekki.shadowfight3',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='shadow-fight-3-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001032',a.id,'1.35.0','Unlimited Money
Unlimited Money
Frozen Enemy
One Hit Kill
All Weapons
No Ads','Legacy catalog restore','',NULL,188743680,'published'
FROM apps a
WHERE a.slug='shadow-fight-3-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.35.0');

UPDATE versions
SET mod_info='Unlimited Money
Unlimited Money
Frozen Enemy
One Hit Kill
All Weapons
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 188743680 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='shadow-fight-3-mod' LIMIT 1)
  AND version_name='1.35.0';

UPDATE apps
SET name='Dream League Soccer MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='First Touch Games', genre='Sports', description_html='Dream League Soccer MOD APK - Unlimited coins, all players unlocked.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/dreamleague.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.firsttouchgames.dls7',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='dream-league-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001033',a.id,'11.0','Unlimited Coins
Unlimited Coins
All Players Unlocked
No Ads
Stadium Upgraded
Infinite Energy','Legacy catalog restore','',NULL,524288000,'published'
FROM apps a
WHERE a.slug='dream-league-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='11.0');

UPDATE versions
SET mod_info='Unlimited Coins
Unlimited Coins
All Players Unlocked
No Ads
Stadium Upgraded
Infinite Energy',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 524288000 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='dream-league-mod' LIMIT 1)
  AND version_name='11.0';

UPDATE apps
SET name='Hill Climb Racing MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Fingersoft', genre='Racing', description_html='Hill Climb Racing MOD APK - Unlimited coins, fuel, all vehicles.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/hillclimb.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.fingersoft.hillclimb',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='hill-climb-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001034',a.id,'1.61.0','Unlimited Coins
Unlimited Coins
Unlimited Fuel
All Vehicles Unlocked
All Stages
No Ads','Legacy catalog restore','',NULL,83886080,'published'
FROM apps a
WHERE a.slug='hill-climb-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.61.0');

UPDATE versions
SET mod_info='Unlimited Coins
Unlimited Coins
Unlimited Fuel
All Vehicles Unlocked
All Stages
No Ads',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 83886080 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='hill-climb-mod' LIMIT 1)
  AND version_name='1.61.0';

UPDATE apps
SET name='8 Ball Pool MOD', category_id=(SELECT id FROM categories WHERE slug='games' LIMIT 1),
    publisher='Miniclip', genre='Sports', description_html='8 Ball Pool MOD APK - Unlimited cash, long lines, all cues.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/8ballpool.png' ELSE icon_url END,
    play_store_url='https://play.google.com/store/apps/details?id=com.miniclip.eightballpool',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='8-ball-pool-mod';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001035',a.id,'5.14.0','Unlimited Cash
Unlimited Cash
Long Lines
All Cues Unlocked
No Ads
Level Max','Legacy catalog restore','',NULL,94371840,'published'
FROM apps a
WHERE a.slug='8-ball-pool-mod'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='5.14.0');

UPDATE versions
SET mod_info='Unlimited Cash
Unlimited Cash
Long Lines
All Cues Unlocked
No Ads
Level Max',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 94371840 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='8-ball-pool-mod' LIMIT 1)
  AND version_name='5.14.0';

UPDATE apps
SET name='Lucky Patcher Guide', category_id=(SELECT id FROM categories WHERE slug='tutorials' LIMIT 1),
    publisher='TECHIE GAMER MODS', genre='Tutorial', description_html='<strong>MASTER APP MODDING WITH LUCKY PATCHER</strong><br><br>
      Complete step-by-step guide to using Lucky Patcher on Android. Learn powerful techniques to modify apps and games safely.<br><br>

      <strong>REMOVE ADS FROM ANY APP</strong><br><br>
      Block Google ads and in-app advertisements permanently. Enjoy clean, ad-free experience in all your favorite apps.<br><br>

      <strong>BYPASS LICENSE VERIFICATION</strong><br><br>
      Remove premium license checks to unlock paid features without purchasing.<br><br>

      <strong>CUSTOM PATCHES & IN-APP PURCHASES</strong><br><br>
      Apply community patches and emulate in-app purchases for free premium content.<br><br>

      <strong>ADVANCED MODIFICATION TOOLS</strong><br><br>
      Backup apps, modify permissions, and create custom modified APKs with full control.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/luckypatcher.png' ELSE icon_url END,
    play_store_url='',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='lucky-patcher-guide';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001036',a.id,'2025','Complete Tutorial
Patch Android Apps
Remove Ads
Bypass License Verification
Custom Patches','Legacy catalog restore','',NULL,0,'published'
FROM apps a
WHERE a.slug='lucky-patcher-guide'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2025');

UPDATE versions
SET mod_info='Complete Tutorial
Patch Android Apps
Remove Ads
Bypass License Verification
Custom Patches',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 0 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='lucky-patcher-guide' LIMIT 1)
  AND version_name='2025';

UPDATE tutorials
SET title='Lucky Patcher Guide', body='<strong>MASTER APP MODDING WITH LUCKY PATCHER</strong><br><br>
      Complete step-by-step guide to using Lucky Patcher on Android. Learn powerful techniques to modify apps and games safely.<br><br>

      <strong>REMOVE ADS FROM ANY APP</strong><br><br>
      Block Google ads and in-app advertisements permanently. Enjoy clean, ad-free experience in all your favorite apps.<br><br>

      <strong>BYPASS LICENSE VERIFICATION</strong><br><br>
      Remove premium license checks to unlock paid features without purchasing.<br><br>

      <strong>CUSTOM PATCHES & IN-APP PURCHASES</strong><br><br>
      Apply community patches and emulate in-app purchases for free premium content.<br><br>

      <strong>ADVANCED MODIFICATION TOOLS</strong><br><br>
      Backup apps, modify permissions, and create custom modified APKs with full control.',
    video_url=CASE
      WHEN video_url IS NULL OR trim(video_url)='' THEN ''
      ELSE video_url
    END,
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE app_id=(SELECT id FROM apps WHERE slug='lucky-patcher-guide' LIMIT 1);

UPDATE apps
SET name='MT Manager Tutorial', category_id=(SELECT id FROM categories WHERE slug='tutorials' LIMIT 1),
    publisher='TECHIE GAMER MODS', genre='Tutorial', description_html='<strong>PROFESSIONAL APK EDITING WITH MT MANAGER</strong><br><br>
      Full tutorial on using MT Manager—the most powerful APK editor for Android. Master advanced modification techniques.<br><br>

      <strong>DEX & RESOURCE EDITING</strong><br><br>
      Decompile and edit DEX files, modify app code, and customize resources like images and XML.<br><br>

      <strong>APK SIGNING & OPTIMIZATION</strong><br><br>
      Recompile modified APKs, sign them properly, and optimize for better performance.<br><br>

      <strong>ADVANCED FILE MANAGEMENT</strong><br><br>
      Root explorer, text editor, and powerful tools for system-level file operations.<br><br>

      <strong>CREATE CUSTOM MODS</strong><br><br>
      Build your own modified apps with complete control over code, resources, and behavior.',
    icon_url=CASE WHEN icon_url IS NULL OR trim(icon_url)='' THEN 'images/mtmanager.png' ELSE icon_url END,
    play_store_url='',
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug='mt-manager-tutorial';

INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001037',a.id,'2025','Advanced APK Editing
APK Editing
DEX Editor
ARSC Editor
XML Editing','Legacy catalog restore','',NULL,0,'published'
FROM apps a
WHERE a.slug='mt-manager-tutorial'
  AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2025');

UPDATE versions
SET mod_info='Advanced APK Editing
APK Editing
DEX Editor
ARSC Editor
XML Editing',
    size_bytes=CASE WHEN EXISTS (SELECT 1 FROM files f WHERE f.version_id=versions.id) THEN size_bytes ELSE 0 END,
    status=CASE WHEN status='archived' THEN status ELSE 'published' END,
    -- Keep an existing version's ordering timestamp intact so a newer live release
    -- (for example a freshly uploaded InShot version) remains the public latest.
WHERE app_id=(SELECT id FROM apps WHERE slug='mt-manager-tutorial' LIMIT 1)
  AND version_name='2025';

UPDATE tutorials
SET title='MT Manager Tutorial', body='<strong>PROFESSIONAL APK EDITING WITH MT MANAGER</strong><br><br>
      Full tutorial on using MT Manager—the most powerful APK editor for Android. Master advanced modification techniques.<br><br>

      <strong>DEX & RESOURCE EDITING</strong><br><br>
      Decompile and edit DEX files, modify app code, and customize resources like images and XML.<br><br>

      <strong>APK SIGNING & OPTIMIZATION</strong><br><br>
      Recompile modified APKs, sign them properly, and optimize for better performance.<br><br>

      <strong>ADVANCED FILE MANAGEMENT</strong><br><br>
      Root explorer, text editor, and powerful tools for system-level file operations.<br><br>

      <strong>CREATE CUSTOM MODS</strong><br><br>
      Build your own modified apps with complete control over code, resources, and behavior.',
    video_url=CASE
      WHEN video_url IS NULL OR trim(video_url)='' THEN ''
      ELSE video_url
    END,
    status='published', updated_at=CURRENT_TIMESTAMP
WHERE app_id=(SELECT id FROM apps WHERE slug='mt-manager-tutorial' LIMIT 1);

-- Keep intentionally uploaded icon URLs intact. The UPDATE above only supplies a legacy
-- image URL when the current app has no icon URL.
