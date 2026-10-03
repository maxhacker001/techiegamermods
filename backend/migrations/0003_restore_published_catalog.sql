-- Restore the legacy catalog into the live D1 database as published catalog entries.
-- This migration is additive and leaves any existing rows/files untouched.
PRAGMA foreign_keys = ON;

-- Idempotent legacy catalog restore.
-- Adds missing catalog records without changing or deleting existing apps/releases.
PRAGMA foreign_keys = ON;

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000001','capcut-mod','CapCut MOD',c.id,'com.lemon.lvoverseas','ByteDance Pte. Ltd.','Video Players & Editors','
    <strong>UNLIMITED CREATIVITY FOR VIDEO EDITING</strong><br><br>
    CapCut MOD APK is the ultimate all-in-one video editing app that empowers you to create stunning content.<br><br>

    <strong>ADVANCED KEYFRAME ANIMATION</strong><br><br>
    Add precise control to your edits with keyframe animation. Animate any element smoothly.<br><br>

    <strong>THOUSANDS OF PREMIUM EFFECTS & TEMPLATES</strong><br><br>
    Access a massive library of pro templates, trending effects, transitions, and filters.<br><br>

    <strong>PROFESSIONAL TOOLS WITHOUT LIMITS</strong><br><br>
    Multi-layer editing, voice-over recording, speed control, chroma key, and more.<br><br>

    <strong>PERFECT FOR CONTENT CREATORS</strong><br><br>
    Whether you''re making TikTok videos, YouTube shorts, or Instagram Reels — CapCut MOD gives you everything unlocked.
  ','https://maxhacker001.github.io/techiegamermods/images/capcut.png','https://play.google.com/store/apps/details?id=com.lemon.lvoverseas','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='capcut-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001002',a.id,'12.3.0','Pro Unlocked','Legacy catalog import','',NULL,81788928,'published'
FROM apps a
WHERE a.slug='capcut-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='12.3.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000002','spotify-mod','Spotify MOD',c.id,'com.spotify.music','Spotify AB','Music & Audio','
    <strong>PREMIUM EXPERIENCE WITHOUT SUBSCRIPTION</strong><br><br>
    Spotify MOD APK gives you full Premium experience for free. Listen to millions of songs and podcasts without restrictions.<br><br>

    <strong>AD-FREE LISTENING FOREVER</strong><br><br>
    No interruptions from audio or banner ads. Stream smoothly.<br><br>

    <strong>UNLIMITED SKIPS & ON-DEMAND PLAYBACK</strong><br><br>
    Skip as many tracks as you want. Choose any song instantly — no shuffle required.<br><br>

    <strong>OFFLINE DOWNLOADS</strong><br><br>
    Download playlists, albums, and podcasts for offline listening.<br><br>

    <strong>VERY HIGH AUDIO QUALITY</strong><br><br>
    Stream at 320kbps — hear every detail as the artist intended.
  ','https://maxhacker001.github.io/techiegamermods/images/spotify.png','https://play.google.com/store/apps/details?id=com.spotify.music','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='spotify-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001003',a.id,'8.9.18','Premium Unlocked','Legacy catalog import','',NULL,47185920,'published'
FROM apps a
WHERE a.slug='spotify-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='8.9.18');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000003','remini-mod','Remini MOD',c.id,'com.remini.app','Bending Spoons','Photo Editing','
    <strong>AI PHOTO ENHANCER</strong><br><br>
    Remini MOD APK - Unlimited AI credits, HD enhancement, no ads.<br><br>

    <strong>RESTORE OLD PHOTOS</strong><br><br>
    Bring blurry or old photos back to life with AI.<br><br>

    <strong>ENHANCE QUALITY</strong><br><br>
    Turn low-resolution photos into HD.<br><br>

    <strong>BATCH PROCESSING</strong><br><br>
    Enhance multiple photos at once.<br><br>

    <strong>NO LIMITS</strong><br><br>
    Unlimited processing without waiting.
  ','https://maxhacker001.github.io/techiegamermods/images/remini.png','https://play.google.com/store/apps/details?id=com.remini.app','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='remini-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001004',a.id,'3.8.5','Pro Unlocked','Legacy catalog import','',NULL,68157440,'published'
FROM apps a
WHERE a.slug='remini-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.8.5');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000004','alight-motion-mod','Alight Motion MOD',c.id,'com.alightcreative.motion','Alight Creative, Inc.','Video Editing','
    <strong>PROFESSIONAL MOTION DESIGN</strong><br><br>
    Alight Motion MOD APK - Full Pro unlocked, no watermark, all premium effects.<br><br>

    <strong>KEYFRAME ANIMATION</strong><br><br>
    Precise control over every element.<br><br>

    <strong>PREMIUM EFFECTS & PRESETS</strong><br><br>
    Blur, glow, distortion, vector graphics.<br><br>

    <strong>XML PROJECT SUPPORT</strong><br><br>
    Import and export projects easily.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Export clean videos.
  ','https://maxhacker001.github.io/techiegamermods/images/alightmotion.png','https://play.google.com/store/apps/details?id=com.alightcreative.motion','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='alight-motion-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001005',a.id,'5.0.0','Pro Unlocked','Legacy catalog import','',NULL,104857600,'published'
FROM apps a
WHERE a.slug='alight-motion-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='5.0.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000005','kinemaster-mod','KineMaster MOD',c.id,'com.nexstreaming.app.kinemasterfree','KineMaster Corporation','Video Editing','
    <strong>POWERFUL VIDEO EDITOR</strong><br><br>
    KineMaster MOD APK - No watermark, premium assets, chroma key.<br><br>

    <strong>CHROMA KEY</strong><br><br>
    Professional green screen effects.<br><br>

    <strong>PREMIUM ASSET STORE</strong><br><br>
    All transitions, effects, music unlocked.<br><br>

    <strong>4K EXPORT</strong><br><br>
    High quality video output.<br><br>

    <strong>MULTI-LAYER EDITING</strong><br><br>
    Add multiple video, image, text layers.
  ','https://maxhacker001.github.io/techiegamermods/images/kinemaster.png','https://play.google.com/store/apps/details?id=com.nexstreaming.app.kinemasterfree','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='kinemaster-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001006',a.id,'7.4.0','Diamond Unlocked','Legacy catalog import','',NULL,99614720,'published'
FROM apps a
WHERE a.slug='kinemaster-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='7.4.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000006','inshot-mod','InShot MOD',c.id,'com.camerasideas.instashot','InShot Inc.','Video Editing','
    <strong>EASY & POWERFUL VIDEO EDITOR</strong><br><br>
    InShot MOD APK - Pro unlocked, no ads, all filters.<br><br>

    <strong>ALL FILTERS & EFFECTS</strong><br><br>
    Premium transitions and effects.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Clean export.<br><br>

    <strong>MUSIC LIBRARY</strong><br><br>
    Add trending music.<br><br>

    <strong>TEXT & STICKERS</strong><br><br>
    Animated text and stickers.
  ','https://maxhacker001.github.io/techiegamermods/images/inshot.png','https://play.google.com/store/apps/details?id=com.camerasideas.instashot','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='inshot-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001007',a.id,'2.0.0','Pro Unlocked','Legacy catalog import','',NULL,73400320,'published'
FROM apps a
WHERE a.slug='inshot-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.0.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000007','vn-video-editor-mod','VN Video Editor MOD',c.id,'com.frontrow.vlog','Ubiquiti Labs','Video Editing','
    <strong>PROFESSIONAL VIDEO EDITOR</strong><br><br>
    VN MOD APK - Pro templates, multi-layer editing, no watermark.<br><br>

    <strong>MULTI-LAYER TIMELINE</strong><br><br>
    Professional editing control.<br><br>

    <strong>PRO TEMPLATES</strong><br><br>
    Ready-to-use professional templates.<br><br>

    <strong>KEYFRAME & MASK</strong><br><br>
    Advanced animation and masking tools.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Export clean videos.
  ','https://maxhacker001.github.io/techiegamermods/images/vn.png','https://play.google.com/store/apps/details?id=com.frontrow.vlog','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='vn-video-editor-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001008',a.id,'2.2.0','Pro Unlocked','Legacy catalog import','',NULL,167772160,'published'
FROM apps a
WHERE a.slug='vn-video-editor-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.2.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000008','powerdirector-mod','PowerDirector MOD',c.id,'com.cyberlink.powerdirector.DRA140225_01','CyberLink','Video Editing','
    <strong>PROFESSIONAL VIDEO EDITOR</strong><br><br>
    PowerDirector MOD - Premium effects, chroma key, 4K support.<br><br>

    <strong>CHROMA KEY</strong><br><br>
    Professional green screen effects.<br><br>

    <strong>4K SUPPORT</strong><br><br>
    Export in ultra high definition.<br><br>

    <strong>PREMIUM EFFECTS</strong><br><br>
    All pro effects and transitions unlocked.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean editing experience.
  ','https://maxhacker001.github.io/techiegamermods/images/powerdirector.png','https://play.google.com/store/apps/details?id=com.cyberlink.powerdirector.DRA140225_01','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='powerdirector-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001009',a.id,'13.0.0','Premium Unlocked','Legacy catalog import','',NULL,125829120,'published'
FROM apps a
WHERE a.slug='powerdirector-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='13.0.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000009','canva-mod','Canva MOD',c.id,'com.canva.editor','Canva','Graphic Design','
    <strong>GRAPHIC DESIGN MADE EASY</strong><br><br>
    Canva MOD - Pro templates, elements, background remover unlocked.<br><br>

    <strong>PRO TEMPLATES</strong><br><br>
    Thousands of premium templates.<br><br>

    <strong>ALL ELEMENTS</strong><br><br>
    Premium photos, icons, fonts.<br><br>

    <strong>BACKGROUND REMOVER</strong><br><br>
    Remove backgrounds with one tap.<br><br>

    <strong>NO WATERMARK</strong><br><br>
    Export clean designs.
  ','https://maxhacker001.github.io/techiegamermods/images/canva.png','https://play.google.com/store/apps/details?id=com.canva.editor','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='canva-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001010',a.id,'2.250.0','Pro Unlocked','Legacy catalog import','',NULL,41943040,'published'
FROM apps a
WHERE a.slug='canva-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.250.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000010','gbwhatsapp-mod','GBWhatsApp MOD',c.id,NULL,NULL,'Communication','
    <strong>ENHANCED WHATSAPP EXPERIENCE</strong><br><br>
    GBWhatsApp MOD - Privacy options, custom themes, dual account.<br><br>

    <strong>PRIVACY OPTIONS</strong><br><br>
    Hide online status, blue ticks, typing.<br><br>

    <strong>CUSTOM THEMES</strong><br><br>
    Thousands of themes available.<br><br>

    <strong>DUAL ACCOUNT</strong><br><br>
    Run two WhatsApp on one phone.<br><br>

    <strong>MESSAGE SCHEDULER</strong><br><br>
    Schedule messages to send later.
  ','https://maxhacker001.github.io/techiegamermods/images/gbwhatsapp.png',NULL,'published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='gbwhatsapp-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001011',a.id,'17.85','Pro Unlocked','Legacy catalog import','',NULL,62914560,'published'
FROM apps a
WHERE a.slug='gbwhatsapp-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='17.85');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000011','picsart-mod','PicsArt MOD',c.id,'com.picsart.studio','PicsArt Inc.','Photo & Video Editor','
    <strong>ALL-IN-ONE PHOTO & VIDEO EDITOR</strong><br><br>
    PicsArt Gold MOD - All stickers, effects, AI tools unlocked.<br><br>

    <strong>AI TOOLS</strong><br><br>
    Background remover, AI replace, object removal.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean editing experience without interruptions.<br><br>

    <strong>PROFESSIONAL FEATURES</strong><br><br>
    Layers, masks, dispersion, clone tool.<br><br>

    <strong>THOUSANDS OF STICKERS & FONTS</strong><br><br>
    Full access to premium content.
  ','https://maxhacker001.github.io/techiegamermods/images/picsart.png','https://play.google.com/store/apps/details?id=com.picsart.studio','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='picsart-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001012',a.id,'25.0.0','Gold Unlocked','Legacy catalog import','',NULL,83886080,'published'
FROM apps a
WHERE a.slug='picsart-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='25.0.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000012','photoroom-mod','PhotoRoom MOD',c.id,'com.photoroom.app','PhotoRoom','Photo Editing','
    <strong>INSTANT BACKGROUND REMOVE</strong><br><br>
    PhotoRoom MOD - Unlimited background remove, pro templates.<br><br>

    <strong>BATCH EDITING</strong><br><br>
    Edit multiple photos at once.<br><br>

    <strong>HD EXPORT</strong><br><br>
    High quality output every time.<br><br>

    <strong>PROFESSIONAL TEMPLATES</strong><br><br>
    Product photos, portraits, Instagram posts.<br><br>

    <strong>NO LIMITS</strong><br><br>
    Full pro access without restrictions.
  ','https://maxhacker001.github.io/techiegamermods/images/photoroom.png','https://play.google.com/store/apps/details?id=com.photoroom.app','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='photoroom-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001013',a.id,'4.8.0','Pro Unlocked','Legacy catalog import','',NULL,57671680,'published'
FROM apps a
WHERE a.slug='photoroom-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='4.8.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000013','truecaller-premium-mod','Truecaller Premium MOD',c.id,'com.truecaller','Truecaller','Communication','
    <strong>ADVANCED CALLER ID & SPAM PROTECTION</strong><br><br>
    Truecaller Premium MOD - No ads, ghost call, who viewed profile.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean interface without interruptions.<br><br>

    <strong>GHOST CALL</strong><br><br>
    Schedule fake calls to escape situations.<br><br>

    <strong>WHO VIEWED MY PROFILE</strong><br><br>
    See who checked your profile.<br><br>

    <strong>ADVANCED SPAM BLOCKING</strong><br><br>
    Block by name, series, or country.
  ','https://maxhacker001.github.io/techiegamermods/images/truecaller.png','https://play.google.com/store/apps/details?id=com.truecaller','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='truecaller-premium-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001014',a.id,'13.5.0','Premium Unlocked','Legacy catalog import','',NULL,94371840,'published'
FROM apps a
WHERE a.slug='truecaller-premium-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='13.5.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000014','snaptube-mod','SnapTube MOD',c.id,NULL,NULL,'Video Downloader','
    <strong>DOWNLOAD FROM ANY PLATFORM</strong><br><br>
    SnapTube MOD - Download videos from YouTube, Facebook, Instagram, TikTok.<br><br>

    <strong>4K & 8K SUPPORT</strong><br><br>
    Download in highest quality available.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean experience without interruptions.<br><br>

    <strong>BATCH DOWNLOAD</strong><br><br>
    Download multiple videos at once.<br><br>

    <strong>AUDIO EXTRACT</strong><br><br>
    Convert videos to MP3.
  ','https://maxhacker001.github.io/techiegamermods/images/snaptube.png',NULL,'published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='snaptube-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001015',a.id,'7.0.0','VIP Unlocked','Legacy catalog import','',NULL,26214400,'published'
FROM apps a
WHERE a.slug='snaptube-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='7.0.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000015','telegram-premium-mod','Telegram Premium MOD',c.id,'org.telegram.messenger','Telegram FZ-LLC','Communication','
    <strong>FASTER & MORE FEATURES</strong><br><br>
    Telegram Premium MOD - Unlimited cloud, faster download, premium stickers.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean chat experience.<br><br>

    <strong>FASTER DOWNLOADS</strong><br><br>
    2x faster speed.<br><br>

    <strong>UNLIMITED CLOUD</strong><br><br>
    Store unlimited files.<br><br>

    <strong>PREMIUM STICKERS & REACTIONS</strong><br><br>
    Exclusive animated stickers.
  ','https://maxhacker001.github.io/techiegamermods/images/telegram.png','https://play.google.com/store/apps/details?id=org.telegram.messenger','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='telegram-premium-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001016',a.id,'10.5.0','Premium Unlocked','Legacy catalog import','',NULL,57671680,'published'
FROM apps a
WHERE a.slug='telegram-premium-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='10.5.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000016','instagram-pro-insta-thunder','Instagram Pro (Insta Thunder)',c.id,NULL,NULL,'Social','
    <strong>ADVANCED INSTAGRAM EXPERIENCE</strong><br><br>
    Insta Thunder MOD - Download media, no ads, privacy options.<br><br>

    <strong>DOWNLOAD ANYTHING</strong><br><br>
    Photos, videos, stories, reels.<br><br>

    <strong>PRIVACY FEATURES</strong><br><br>
    Hide view stories, typing status, online status.<br><br>

    <strong>DARK MODE & CUSTOM THEMES</strong><br><br>
    Full customization.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean feed and stories.
  ','https://maxhacker001.github.io/techiegamermods/images/instathunder.png',NULL,'published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='instagram-pro-insta-thunder');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001017',a.id,'300.0','Pro Unlocked','Legacy catalog import','',NULL,73400320,'published'
FROM apps a
WHERE a.slug='instagram-pro-insta-thunder' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='300.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000017','twitter-x-gold-mod','Twitter X Gold MOD',c.id,NULL,NULL,'Social','
    <strong>ENHANCED TWITTER EXPERIENCE</strong><br><br>
    Twitter Gold MOD - No ads, download videos, premium features.<br><br>

    <strong>NO ADS</strong><br><br>
    Clean timeline and replies.<br><br>

    <strong>DOWNLOAD VIDEOS</strong><br><br>
    Save any video or GIF.<br><br>

    <strong>BLUE TICK HIDE</strong><br><br>
    Read messages without showing seen.<br><br>

    <strong>LONGER POSTS</strong><br><br>
    Write longer tweets.
  ','https://maxhacker001.github.io/techiegamermods/images/twittergold.png',NULL,'published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='twitter-x-gold-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001018',a.id,'10.5.0','Premium Unlocked','Legacy catalog import','',NULL,104857600,'published'
FROM apps a
WHERE a.slug='twitter-x-gold-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='10.5.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000018','netflix-mod','Netflix MOD',c.id,'com.netflix.mediaclient','Netflix Inc.','Entertainment','
    <strong>WATCH EVERYTHING FREE</strong><br><br>
    Netflix MOD - 4K streaming, no ads, download all content.<br><br>

    <strong>ALL CONTENT UNLOCKED</strong><br><br>
    Watch any movie or series from any region.<br><br>

    <strong>NO ADS</strong><br><br>
    Uninterrupted viewing experience.<br><br>

    <strong>OFFLINE DOWNLOAD</strong><br><br>
    Download for offline watching.<br><br>

    <strong>4K & HDR</strong><br><br>
    Highest quality streaming.
  ','https://maxhacker001.github.io/techiegamermods/images/netflix.png','https://play.google.com/store/apps/details?id=com.netflix.mediaclient','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='netflix-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001019',a.id,'8.12.0','Premium Unlocked','Legacy catalog import','',NULL,62914560,'published'
FROM apps a
WHERE a.slug='netflix-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='8.12.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000019','crunchyroll-mod','Crunchyroll MOD',c.id,'com.crunchyroll.crunchyroid','Crunchyroll','Entertainment','
    <strong>ULTIMATE ANIME STREAMING</strong><br><br>
    Crunchyroll MOD - Ad-free anime, offline download, simulcasts.<br><br>

    <strong>NO ADS</strong><br><br>
    Watch without interruptions.<br><br>

    <strong>OFFLINE DOWNLOAD</strong><br><br>
    Download episodes for offline.<br><br>

    <strong>SIMULCASTS</strong><br><br>
    New episodes 1 hour after Japan.<br><br>

    <strong>HD & FULL LIBRARY</strong><br><br>
    Access everything in high quality.
  ','https://maxhacker001.github.io/techiegamermods/images/crunchyroll.png','https://play.google.com/store/apps/details?id=com.crunchyroll.crunchyroid','published'
FROM categories c
WHERE c.slug='apps' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='crunchyroll-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001020',a.id,'3.5.0','Premium Unlocked','Legacy catalog import','',NULL,73400320,'published'
FROM apps a
WHERE a.slug='crunchyroll-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.5.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000020','free-fire-mod','Free Fire MOD',c.id,'com.dts.freefireth','Garena International','Action','
      <strong>DOMINATE EVERY MATCH</strong><br><br>
      Free Fire MOD APK with unlimited diamonds, aimbot, ESP wallhack, and anti-ban protection. Get instant access to premium items and dominate the battlefield.<br><br>

      <strong>UNLIMITED DIAMONDS & RESOURCES</strong><br><br>
      Buy any skin, character, weapon, or bundle without grinding. Everything is available from the start.<br><br>

      <strong>AIMBOT & AUTO HEADSHOT</strong><br><br>
      Lock onto enemies automatically with perfect accuracy. Land headshots consistently for quick eliminations.<br><br>

      <strong>ESP WALLHACK & NO RECOIL</strong><br><br>
      See enemies through walls, track their movement, and fire with zero recoil for unmatched control.<br><br>

      <strong>SAFE WITH ANTI-BAN</strong><br><br>
      Advanced protection keeps your account secure while enjoying all premium advantages.
    ','https://maxhacker001.github.io/techiegamermods/images/freefire.png','https://play.google.com/store/apps/details?id=com.dts.freefireth','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='free-fire-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001021',a.id,'1.104.1','Unlimited Diamonds','Legacy catalog import','',NULL,681574400,'published'
FROM apps a
WHERE a.slug='free-fire-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.104.1');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000021','pubg-mobile-mod','PUBG Mobile MOD',c.id,'com.tencent.ig','Level Infinite','Action','
      <strong>ULTIMATE BATTLE ROYALE DOMINATION</strong><br><br>
      PUBG Mobile MOD APK with unlimited UC, wallhack, aimbot, and magic bullet. Unlock every premium item and dominate every match.<br><br>

      <strong>UNLIMITED UC & RESOURCES</strong><br><br>
      Purchase any outfit, vehicle skin, weapon upgrade, or Royale Pass tier instantly.<br><br>

      <strong>AIMBOT & MAGIC BULLET</strong><br><br>
      Automatic targeting with perfect accuracy—even through obstacles for guaranteed hits.<br><br>

      <strong>WALLHACK & NO GRASS</strong><br><br>
      See enemies through walls and remove grass for clear visibility in every environment.<br><br>

      <strong>ZERO RECOIL & HIGH DAMAGE</strong><br><br>
      Fire with perfect stability and increased damage output for faster eliminations.
    ','https://maxhacker001.github.io/techiegamermods/images/pubg.png','https://play.google.com/store/apps/details?id=com.tencent.ig','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='pubg-mobile-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001022',a.id,'3.5.0','Global Unlimited UC','Legacy catalog import','',NULL,0,'published'
FROM apps a
WHERE a.slug='pubg-mobile-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.5.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000022','mobile-legends-mod','Mobile Legends MOD',c.id,'com.mobile.legends','Moonton','MOBA','
      <strong>EPIC MOBA DOMINATION</strong><br><br>
      Mobile Legends MOD APK with map hack, drone view, unlimited diamonds, and all skins unlocked. Gain complete battlefield awareness and premium cosmetics.<br><br>

      <strong>UNLOCK ALL SKINS & HEROES</strong><br><br>
      Access every epic, legend, and special skin instantly. Customize your heroes with the rarest cosmetics.<br><br>

      <strong>MAP HACK & DRONE VIEW</strong><br><br>
      See the entire map and enemy positions. Expand your camera view for perfect strategic planning.<br><br>

      <strong>UNLIMITED DIAMONDS</strong><br><br>
      Purchase anything in the shop without limits. Upgrade emblems and acquire battle effects freely.<br><br>

      <strong>RADAR HACK & NO COOLDOWN</strong><br><br>
      Track enemies precisely and spam skills without waiting—turn matches in your favor.
    ','https://maxhacker001.github.io/techiegamermods/images/mlbb.png','https://play.google.com/store/apps/details?id=com.mobile.legends','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='mobile-legends-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001023',a.id,'1.8.66','Unlock All Skins','Legacy catalog import','',NULL,146800640,'published'
FROM apps a
WHERE a.slug='mobile-legends-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.8.66');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000023','subway-surfers-mod','Subway Surfers MOD',c.id,'com.kiloo.subwaysurf','SYBO Games','Endless Runner','Subway Surfers MOD APK - Unlimited coins & keys, all characters unlocked.','https://maxhacker001.github.io/techiegamermods/images/subwaysurfers.png','https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='subway-surfers-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001024',a.id,'3.25.0','Unlimited Coins','Legacy catalog import','',NULL,178257920,'published'
FROM apps a
WHERE a.slug='subway-surfers-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='3.25.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000024','candy-crush-saga-mod','Candy Crush Saga MOD',c.id,'com.king.candycrushsaga','King','Puzzle','Candy Crush Saga MOD APK - Unlimited lives, boosters, all levels unlocked.','https://maxhacker001.github.io/techiegamermods/images/candycrush.png','https://play.google.com/store/apps/details?id=com.king.candycrushsaga','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='candy-crush-saga-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001025',a.id,'1.290.0','Unlimited Lives','Legacy catalog import','',NULL,94371840,'published'
FROM apps a
WHERE a.slug='candy-crush-saga-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.290.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000025','clash-of-clans-mod','Clash of Clans MOD',c.id,'com.supercell.clashofclans','Supercell','Strategy','Clash of Clans MOD APK - Unlimited gems, gold, elixir, private server.','https://maxhacker001.github.io/techiegamermods/images/clashclans.png','https://play.google.com/store/apps/details?id=com.supercell.clashofclans','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='clash-of-clans-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001026',a.id,'16.0.0','Unlimited Gems','Legacy catalog import','',NULL,314572800,'published'
FROM apps a
WHERE a.slug='clash-of-clans-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='16.0.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000026','roblox-mod','Roblox MOD',c.id,'com.roblox.client','Roblox Corporation','Adventure','Roblox MOD APK - Menu mod, fly, speed, god mode.','https://maxhacker001.github.io/techiegamermods/images/roblox.png','https://play.google.com/store/apps/details?id=com.roblox.client','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='roblox-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001027',a.id,'2.644.704','Menu MOD','Legacy catalog import','',NULL,157286400,'published'
FROM apps a
WHERE a.slug='roblox-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2.644.704');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000027','call-of-duty-mobile-mod','Call of Duty Mobile MOD',c.id,'com.activision.callofduty.shooter','Activision','FPS','Call of Duty Mobile MOD APK - Unlimited CP, aimbot, no recoil.','https://maxhacker001.github.io/techiegamermods/images/codmobile.png','https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='call-of-duty-mobile-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001028',a.id,'1.0.45','Unlimited CP','Legacy catalog import','',NULL,0,'published'
FROM apps a
WHERE a.slug='call-of-duty-mobile-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.0.45');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000028','among-us-mod','Among Us MOD',c.id,'com.innersloth.spacemafia','Innersloth','Social Deduction','Among Us MOD APK - Always impostor, no kill cooldown, speed hack.','https://maxhacker001.github.io/techiegamermods/images/amongus.png','https://play.google.com/store/apps/details?id=com.innersloth.spacemafia','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='among-us-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001029',a.id,'2024.12.9','Always Impostor','Legacy catalog import','',NULL,209715200,'published'
FROM apps a
WHERE a.slug='among-us-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2024.12.9');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000029','stumble-guys-mod','Stumble Guys MOD',c.id,'com.kitkagames.fallguysmobile','Kitka Games','Party','Stumble Guys MOD APK - Unlimited gems, all skins unlocked.','https://maxhacker001.github.io/techiegamermods/images/stumbleguys.png','https://play.google.com/store/apps/details?id=com.kitkagames.fallguysmobile','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='stumble-guys-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001030',a.id,'0.63','Unlimited Gems','Legacy catalog import','',NULL,188743680,'published'
FROM apps a
WHERE a.slug='stumble-guys-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='0.63');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000030','brawl-stars-mod','Brawl Stars MOD',c.id,'com.supercell.brawlstars','Supercell','MOBA','Brawl Stars MOD APK - Unlimited gems, all brawlers unlocked.','https://maxhacker001.github.io/techiegamermods/images/brawlstars.png','https://play.google.com/store/apps/details?id=com.supercell.brawlstars','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='brawl-stars-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001031',a.id,'53.176','Unlimited Gems','Legacy catalog import','',NULL,471859200,'published'
FROM apps a
WHERE a.slug='brawl-stars-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='53.176');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000031','shadow-fight-3-mod','Shadow Fight 3 MOD',c.id,'com.nekki.shadowfight3','Nekki','Fighting','Shadow Fight 3 MOD APK - Unlimited money, frozen enemy.','https://maxhacker001.github.io/techiegamermods/images/shadowfight3.png','https://play.google.com/store/apps/details?id=com.nekki.shadowfight3','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='shadow-fight-3-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001032',a.id,'1.35.0','Unlimited Money','Legacy catalog import','',NULL,188743680,'published'
FROM apps a
WHERE a.slug='shadow-fight-3-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.35.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000032','dream-league-soccer-mod','Dream League Soccer MOD',c.id,'com.firsttouchgames.dls7','First Touch Games','Sports','Dream League Soccer MOD APK - Unlimited coins, all players unlocked.','https://maxhacker001.github.io/techiegamermods/images/dreamleague.png','https://play.google.com/store/apps/details?id=com.firsttouchgames.dls7','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='dream-league-soccer-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001033',a.id,'11.0','Unlimited Coins','Legacy catalog import','',NULL,524288000,'published'
FROM apps a
WHERE a.slug='dream-league-soccer-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='11.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000033','hill-climb-racing-mod','Hill Climb Racing MOD',c.id,'com.fingersoft.hillclimb','Fingersoft','Racing','Hill Climb Racing MOD APK - Unlimited coins, fuel, all vehicles.','https://maxhacker001.github.io/techiegamermods/images/hillclimb.png','https://play.google.com/store/apps/details?id=com.fingersoft.hillclimb','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='hill-climb-racing-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001034',a.id,'1.61.0','Unlimited Coins','Legacy catalog import','',NULL,83886080,'published'
FROM apps a
WHERE a.slug='hill-climb-racing-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='1.61.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000034','8-ball-pool-mod','8 Ball Pool MOD',c.id,'com.miniclip.eightballpool','Miniclip','Sports','8 Ball Pool MOD APK - Unlimited cash, long lines, all cues.','https://maxhacker001.github.io/techiegamermods/images/8ballpool.png','https://play.google.com/store/apps/details?id=com.miniclip.eightballpool','published'
FROM categories c
WHERE c.slug='games' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='8-ball-pool-mod');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001035',a.id,'5.14.0','Unlimited Cash','Legacy catalog import','',NULL,94371840,'published'
FROM apps a
WHERE a.slug='8-ball-pool-mod' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='5.14.0');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000035','lucky-patcher-guide','Lucky Patcher Guide',c.id,NULL,'TECHIE GAMER MODS','Tutorial','
      <strong>MASTER APP MODDING WITH LUCKY PATCHER</strong><br><br>
      Complete step-by-step guide to using Lucky Patcher on Android. Learn powerful techniques to modify apps and games safely.<br><br>

      <strong>REMOVE ADS FROM ANY APP</strong><br><br>
      Block Google ads and in-app advertisements permanently. Enjoy clean, ad-free experience in all your favorite apps.<br><br>

      <strong>BYPASS LICENSE VERIFICATION</strong><br><br>
      Remove premium license checks to unlock paid features without purchasing.<br><br>

      <strong>CUSTOM PATCHES & IN-APP PURCHASES</strong><br><br>
      Apply community patches and emulate in-app purchases for free premium content.<br><br>

      <strong>ADVANCED MODIFICATION TOOLS</strong><br><br>
      Backup apps, modify permissions, and create custom modified APKs with full control.
    ','https://maxhacker001.github.io/techiegamermods/images/luckypatcher.png',NULL,'published'
FROM categories c
WHERE c.slug='tutorials' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='lucky-patcher-guide');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001036',a.id,'2025','Complete Tutorial','Legacy catalog import','',NULL,0,'published'
FROM apps a
WHERE a.slug='lucky-patcher-guide' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2025');
INSERT INTO tutorials (id,app_id,title,video_url,body,status)
SELECT '00000000-0000-4000-8000-000000002036',a.id,'Lucky Patcher Guide',NULL,'
      <strong>MASTER APP MODDING WITH LUCKY PATCHER</strong><br><br>
      Complete step-by-step guide to using Lucky Patcher on Android. Learn powerful techniques to modify apps and games safely.<br><br>

      <strong>REMOVE ADS FROM ANY APP</strong><br><br>
      Block Google ads and in-app advertisements permanently. Enjoy clean, ad-free experience in all your favorite apps.<br><br>

      <strong>BYPASS LICENSE VERIFICATION</strong><br><br>
      Remove premium license checks to unlock paid features without purchasing.<br><br>

      <strong>CUSTOM PATCHES & IN-APP PURCHASES</strong><br><br>
      Apply community patches and emulate in-app purchases for free premium content.<br><br>

      <strong>ADVANCED MODIFICATION TOOLS</strong><br><br>
      Backup apps, modify permissions, and create custom modified APKs with full control.
    ','published'
FROM apps a
WHERE a.slug='lucky-patcher-guide' AND NOT EXISTS (SELECT 1 FROM tutorials t WHERE t.app_id=a.id AND t.title='Lucky Patcher Guide');

INSERT INTO apps (id,slug,name,category_id,package_name,publisher,genre,description_html,icon_url,play_store_url,status)
SELECT '00000000-0000-4000-8000-000000000036','mt-manager-tutorial','MT Manager Tutorial',c.id,NULL,'TECHIE GAMER MODS','Tutorial','
      <strong>PROFESSIONAL APK EDITING WITH MT MANAGER</strong><br><br>
      Full tutorial on using MT Manager—the most powerful APK editor for Android. Master advanced modification techniques.<br><br>

      <strong>DEX & RESOURCE EDITING</strong><br><br>
      Decompile and edit DEX files, modify app code, and customize resources like images and XML.<br><br>

      <strong>APK SIGNING & OPTIMIZATION</strong><br><br>
      Recompile modified APKs, sign them properly, and optimize for better performance.<br><br>

      <strong>ADVANCED FILE MANAGEMENT</strong><br><br>
      Root explorer, text editor, and powerful tools for system-level file operations.<br><br>

      <strong>CREATE CUSTOM MODS</strong><br><br>
      Build your own modified apps with complete control over code, resources, and behavior.
    ','https://maxhacker001.github.io/techiegamermods/images/mtmanager.png',NULL,'published'
FROM categories c
WHERE c.slug='tutorials' AND NOT EXISTS (SELECT 1 FROM apps a WHERE a.slug='mt-manager-tutorial');
INSERT INTO versions (id,app_id,version_name,mod_info,changelog,android_min,architecture,size_bytes,status)
SELECT '00000000-0000-4000-8000-000000001037',a.id,'2025','Advanced APK Editing','Legacy catalog import','',NULL,0,'published'
FROM apps a
WHERE a.slug='mt-manager-tutorial' AND NOT EXISTS (SELECT 1 FROM versions v WHERE v.app_id=a.id AND v.version_name='2025');
INSERT INTO tutorials (id,app_id,title,video_url,body,status)
SELECT '00000000-0000-4000-8000-000000002037',a.id,'MT Manager Tutorial',NULL,'
      <strong>PROFESSIONAL APK EDITING WITH MT MANAGER</strong><br><br>
      Full tutorial on using MT Manager—the most powerful APK editor for Android. Master advanced modification techniques.<br><br>

      <strong>DEX & RESOURCE EDITING</strong><br><br>
      Decompile and edit DEX files, modify app code, and customize resources like images and XML.<br><br>

      <strong>APK SIGNING & OPTIMIZATION</strong><br><br>
      Recompile modified APKs, sign them properly, and optimize for better performance.<br><br>

      <strong>ADVANCED FILE MANAGEMENT</strong><br><br>
      Root explorer, text editor, and powerful tools for system-level file operations.<br><br>

      <strong>CREATE CUSTOM MODS</strong><br><br>
      Build your own modified apps with complete control over code, resources, and behavior.
    ','published'
FROM apps a
WHERE a.slug='mt-manager-tutorial' AND NOT EXISTS (SELECT 1 FROM tutorials t WHERE t.app_id=a.id AND t.title='MT Manager Tutorial');



-- Existing rows are kept by the seed's NOT EXISTS guards; make sure all
-- legacy catalog records that already existed are also published.
UPDATE apps SET status='published', updated_at=CURRENT_TIMESTAMP
WHERE slug IN (
  'capcut-mod',
  'spotify-mod',
  'remini-mod',
  'alight-motion-mod',
  'kinemaster-mod',
  'inshot-mod',
  'vn-video-editor-mod',
  'powerdirector-mod',
  'canva-mod',
  'gbwhatsapp-mod',
  'picsart-mod',
  'photoroom-mod',
  'truecaller-premium-mod',
  'snaptube-mod',
  'telegram-premium-mod',
  'instagram-pro-insta-thunder',
  'twitter-x-gold-mod',
  'netflix-mod',
  'crunchyroll-mod',
  'free-fire-mod',
  'pubg-mobile-mod',
  'mobile-legends-mod',
  'subway-surfers-mod',
  'candy-crush-saga-mod',
  'clash-of-clans-mod',
  'roblox-mod',
  'call-of-duty-mobile-mod',
  'among-us-mod',
  'stumble-guys-mod',
  'brawl-stars-mod',
  'shadow-fight-3-mod',
  'dream-league-soccer-mod',
  'hill-climb-racing-mod',
  '8-ball-pool-mod',
  'lucky-patcher-guide',
  'mt-manager-tutorial'
);

UPDATE versions
SET status='published', updated_at=CURRENT_TIMESTAMP
WHERE app_id IN (
  SELECT id FROM apps WHERE slug IN (
    'capcut-mod',
    'spotify-mod',
    'remini-mod',
    'alight-motion-mod',
    'kinemaster-mod',
    'inshot-mod',
    'vn-video-editor-mod',
    'powerdirector-mod',
    'canva-mod',
    'gbwhatsapp-mod',
    'picsart-mod',
    'photoroom-mod',
    'truecaller-premium-mod',
    'snaptube-mod',
    'telegram-premium-mod',
    'instagram-pro-insta-thunder',
    'twitter-x-gold-mod',
    'netflix-mod',
    'crunchyroll-mod',
    'free-fire-mod',
    'pubg-mobile-mod',
    'mobile-legends-mod',
    'subway-surfers-mod',
    'candy-crush-saga-mod',
    'clash-of-clans-mod',
    'roblox-mod',
    'call-of-duty-mobile-mod',
    'among-us-mod',
    'stumble-guys-mod',
    'brawl-stars-mod',
    'shadow-fight-3-mod',
    'dream-league-soccer-mod',
    'hill-climb-racing-mod',
    '8-ball-pool-mod',
    'lucky-patcher-guide',
    'mt-manager-tutorial'
  )
);

-- Populate sensible Related Apps links from the restored catalog. Exact genre
-- matches come first; related media categories such as video/photo/music are
-- linked by keyword as well.
INSERT OR IGNORE INTO app_relations(app_id, related_app_id, sort_order)
SELECT a.id, b.id,
       ROW_NUMBER() OVER (
         PARTITION BY a.id
         ORDER BY
           CASE WHEN lower(COALESCE(a.genre,''))=lower(COALESCE(b.genre,'')) THEN 0 ELSE 1 END,
           b.name
       ) - 1
FROM apps a
JOIN apps b ON a.id <> b.id AND a.category_id = b.category_id
WHERE a.status='published'
  AND b.status='published'
  AND (
    lower(COALESCE(a.genre,'')) = lower(COALESCE(b.genre,''))
    OR (lower(COALESCE(a.genre,'')) LIKE '%video%' AND lower(COALESCE(b.genre,'')) LIKE '%video%')
    OR (lower(COALESCE(a.genre,'')) LIKE '%photo%' AND lower(COALESCE(b.genre,'')) LIKE '%photo%')
    OR (lower(COALESCE(a.genre,'')) LIKE '%music%' AND lower(COALESCE(b.genre,'')) LIKE '%music%')
    OR (lower(COALESCE(a.genre,'')) LIKE '%graphic%' AND lower(COALESCE(b.genre,'')) LIKE '%graphic%')
    OR (lower(COALESCE(a.genre,'')) LIKE '%communication%' AND lower(COALESCE(b.genre,'')) LIKE '%communication%')
  );
