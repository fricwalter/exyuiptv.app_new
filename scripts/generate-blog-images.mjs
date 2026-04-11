import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const BLOG_DIR = path.join(DIST, "blog");
const BLOG_IMAGE_DIR = path.join(DIST, "images", "blog");
const CONTENT_DIR = path.join(ROOT, "content", "blog-import-2026-04");
const SITE_BASE = "https://exyuiptv.app";
const MODEL = "gemini-3.1-flash-image-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const RATE_LIMIT_MS = 5000;
const FORCE_REGENERATE = process.env.FORCE_REGENERATE === "1";
const BLOG_INDEX_OG_SLUG = "bosna-svjetsko-prvenstvo-2026-live-stream-iptv";
const POST_SLUGS = process.env.POST_SLUGS
  ? new Set(
      process.env.POST_SLUGS.split(",")
        .map((slug) => slug.trim())
        .filter(Boolean),
    )
  : null;
const GLOBAL_PROMPT_SUFFIX =
  "\nAdditional constraints: 16:9 composition, premium editorial realism, no readable text anywhere, no letters, no numbers, no subtitles, no channel names, no interface labels, no logos, no watermarks, no brand marks, no visible faces, and if a TV or device screen is visible it should show only abstract or blurred non-textual content.";

const POSTS = [
  {
    slug: "ex-yu-iptv-utakmice-uzivo-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora sports blog hero image\n" +
      "Primary request: EX YU diaspora watching a live football derby through IPTV in a modern European apartment\n" +
      "Scene/background: evening living room, large TV, subtle Balkan home details, friends implied through hands and remotes but no faces\n" +
      "Subject: television showing a realistic football match with no readable graphics, sports-night atmosphere, remote and snacks on table\n" +
      "Style/medium: cinematic editorial lifestyle photography\n" +
      "Composition/framing: wide 16:9, TV centered and enough negative space for hero crop\n" +
      "Lighting/mood: energetic, premium, realistic, warm evening sports mood\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no team branding",
  },
  {
    slug: "bosna-utakmice-uzivo-iptv-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports diaspora blog hero image\n" +
      "Primary request: Bosnian diaspora home watching national football through IPTV\n" +
      "Scene/background: cozy apartment abroad with tasteful blue and yellow ambient accents, modern TV setup\n" +
      "Subject: television showing a football pitch and players from distance, no readable scoreboard, family viewing atmosphere without faces\n" +
      "Style/medium: editorial sports lifestyle photography\n" +
      "Composition/framing: wide 16:9, premium living-room context balanced with TV experience\n" +
      "Lighting/mood: emotional but realistic, warm, premium, match-day feel\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no flag text",
  },
  {
    slug: "srbija-utakmice-uzivo-iptv-nemacka-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora sports blog hero image\n" +
      "Primary request: Serbian diaspora in Germany watching football via IPTV\n" +
      "Scene/background: modern German apartment at night with subtle city lights outside\n" +
      "Subject: TV showing live football action, remote and smartphone on table, organized sports favorites implied visually without readable UI\n" +
      "Style/medium: cinematic editorial home streaming photography\n" +
      "Composition/framing: wide 16:9, realistic home media setup, TV as focal point\n" +
      "Lighting/mood: premium, calm, focused, match-night atmosphere\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no team branding",
  },
  {
    slug: "hrvatska-nogomet-uzivo-iptv-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports diaspora blog hero image\n" +
      "Primary request: Croatian diaspora watching football at home through IPTV\n" +
      "Scene/background: clean modern living room with subtle red and blue accents, evening light\n" +
      "Subject: large TV with realistic football match, remote and tablet nearby, no readable broadcast interface\n" +
      "Style/medium: editorial sports lifestyle photography\n" +
      "Composition/framing: wide 16:9, polished TV viewing scene suitable for blog hero\n" +
      "Lighting/mood: energetic, warm, premium, believable sports evening\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no official symbols",
  },
  {
    slug: "liga-prvaka-arena-sport-iptv-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium football night blog hero image\n" +
      "Primary request: European football night on IPTV for Balkan diaspora\n" +
      "Scene/background: stylish apartment, dim cinematic lighting, premium TV setup\n" +
      "Subject: television showing dramatic stadium football action with abstract non-readable broadcast look, remote in foreground\n" +
      "Style/medium: cinematic editorial sports photography\n" +
      "Composition/framing: wide 16:9, strong TV focal point, clean hero crop\n" +
      "Lighting/mood: dramatic, premium, realistic, Champions League-style evening without branding\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no competition branding",
  },
  {
    slug: "formula-1-motogp-iptv-balkan-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium motorsport streaming blog hero image\n" +
      "Primary request: Formula racing and motorcycle racing watched through IPTV at home\n" +
      "Scene/background: modern media room with sleek TV, sports remote, subtle racing memorabilia without logos\n" +
      "Subject: TV showing blurred high-speed racing action, no readable graphics, premium motorsport weekend mood\n" +
      "Style/medium: editorial sports lifestyle photography\n" +
      "Composition/framing: wide 16:9, dynamic but not chaotic, TV and racing atmosphere balanced\n" +
      "Lighting/mood: fast, polished, realistic, premium\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no brand marks",
  },
  {
    slug: "euroleague-aba-liga-iptv-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium basketball streaming blog hero image\n" +
      "Primary request: Balkan diaspora watching basketball on IPTV, EuroLeague and regional league atmosphere\n" +
      "Scene/background: modern living room during a night game, warm light, comfortable sofa\n" +
      "Subject: television showing a basketball court and players from distance, remote and small tabletop snacks, no readable graphics\n" +
      "Style/medium: cinematic editorial sports lifestyle photography\n" +
      "Composition/framing: wide 16:9, TV centered, premium home viewing composition\n" +
      "Lighting/mood: focused, warm, energetic, realistic\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no team branding",
  },
  {
    slug: "iptv-vikend-raspored-utakmica-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports planning blog hero image\n" +
      "Primary request: organized IPTV match weekend planning for diaspora\n" +
      "Scene/background: tidy living room with TV, tablet, remote, calendar-like planning vibe without readable text\n" +
      "Subject: TV showing abstract sports thumbnails and blurred match action, tablet with non-readable schedule blocks\n" +
      "Style/medium: editorial lifestyle and consumer-tech photography\n" +
      "Composition/framing: wide 16:9, organized and premium, good blog hero crop\n" +
      "Lighting/mood: clear, practical, calm, sports weekend anticipation\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable UI",
  },
  {
    slug: "iptv-za-kafice-utakmice-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium shared sports viewing blog hero image\n" +
      "Primary request: small Balkan cafe-style shared football viewing setup with IPTV\n" +
      "Scene/background: tasteful modern cafe or social room, wall-mounted TV, warm evening lighting\n" +
      "Subject: TV showing football match, tables and chairs, viewers implied from behind or cropped hands only, no faces\n" +
      "Style/medium: cinematic editorial hospitality photography\n" +
      "Composition/framing: wide 16:9, TV and communal atmosphere balanced\n" +
      "Lighting/mood: social, premium, realistic, match-day energy\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no alcohol branding",
  },
  {
    slug: "najbolja-iptv-aplikacija-za-utakmice-smart-tv-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium smart TV app sports blog hero image\n" +
      "Primary request: choosing an IPTV app for live sports on Smart TV\n" +
      "Scene/background: modern living room with large smart TV, remote and smartphone nearby\n" +
      "Subject: TV interface with abstract non-readable sports tiles, football action preview blurred, no app names\n" +
      "Style/medium: editorial consumer-tech photography\n" +
      "Composition/framing: wide 16:9, smart TV screen and remote as focal points\n" +
      "Lighting/mood: polished, practical, premium, tech review mood\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable UI",
  },
  {
    slug: "apple-tv-ex-yu-iptv-2026-podesavanje",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium blog hero image\n" +
      "Primary request: sleek premium streaming box setup for Balkan IPTV in a modern living room, inspired by high-end tvOS-like simplicity but with no visible branding\n" +
      "Scene/background: elegant evening apartment interior with warm ambient lighting and subtle city glow\n" +
      "Subject: minimalist black set-top streaming box and remote on a clean entertainment console, TV displaying only abstract, non-textual colorful content blocks\n" +
      "Style/medium: editorial lifestyle photography, cinematic but realistic\n" +
      "Composition/framing: wide 16:9 frame, television centered, no empty dead space, suitable for a blog hero crop\n" +
      "Lighting/mood: premium, calm, polished, believable household scene\n" +
      "Constraints: no text, no logo, no watermark, no visible faces, no brand infringement on UI or hardware, high-end commercial quality\n" +
      "Avoid: stock photo vibe, oversaturated colors, plastic textures, clutter",
  },
  {
    slug: "arena-sport-sport-klub-iptv-4k-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium blog hero image\n" +
      "Primary request: 4K Balkan sports streaming setup at home\n" +
      "Scene/background: modern living room during a live football night with realistic stadium broadcast on TV\n" +
      "Subject: large television showing a crisp football match, remote and sofa in foreground, upscale home media atmosphere\n" +
      "Style/medium: cinematic editorial sports-lifestyle photography\n" +
      "Composition/framing: wide 16:9, dynamic but clean composition, centered on the TV experience\n" +
      "Lighting/mood: energetic, premium, realistic evening contrast\n" +
      "Constraints: no text, no watermark, no logo, no visible faces, no fake team branding, blog hero suitable\n" +
      "Avoid: cheesy sports poster look, neon effects, exaggerated motion blur",
  },
  {
    slug: "arena-sport-premier-league-ex-yu-iptv-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports diaspora blog hero image\n" +
      "Primary request: elegant home viewing setup for Arena Sport and Premier League weekends through EX YU IPTV abroad\n" +
      "Scene/background: upscale modern apartment living room during a major football evening with subtle city lights outside\n" +
      "Subject: large television showing an intense football match in abstract broadcast form, premium sofa area, remote and match-night atmosphere without identifiable teams or branding\n" +
      "Style/medium: cinematic editorial sports-lifestyle photography, realistic and polished\n" +
      "Composition/framing: wide 16:9, TV and premium living-room context balanced for a blog hero crop\n" +
      "Lighting/mood: focused, energetic, refined evening sports atmosphere for diaspora match weekends\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, no readable scoreboard, no fake channel branding\n" +
      "Avoid: sports bar look, poster composition, heavy motion blur, exaggerated neon lighting",
  },
  {
    slug: "besplatni-vs-placeni-ex-yu-iptv-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: editorial comparison hero image\n" +
      "Primary request: visual comparison of unreliable free streaming versus premium paid IPTV at home\n" +
      "Scene/background: split editorial composition inside one modern apartment setup\n" +
      "Subject: one side shows an outdated unstable streaming setup with visual noise, the other side shows a clean premium TV streaming environment with elegant hardware\n" +
      "Style/medium: realistic editorial photography with subtle contrast between poor and premium quality\n" +
      "Composition/framing: wide 16:9, balanced side-by-side storytelling, no obvious labels or text\n" +
      "Lighting/mood: credible, premium, informative, not exaggerated\n" +
      "Constraints: no text, no watermark, no logo, no faces, no gimmicky red-vs-green graphics\n" +
      "Avoid: infographic look, cartoonish split screens, heavy visual effects",
  },
  {
    slug: "bosna-svjetsko-prvenstvo-2026-live-stream-iptv",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium blog hero image\n" +
      "Primary request: diaspora family atmosphere watching Bosnia world cup football at home through IPTV\n" +
      "Scene/background: warm living room with festive tension and subtle Balkan home details\n" +
      "Subject: television showing a dramatic football match moment, family presence suggested through hands, silhouettes, snacks and room energy without clear faces\n" +
      "Style/medium: realistic editorial sports-lifestyle photography\n" +
      "Composition/framing: wide 16:9, TV and living-room excitement as focal point\n" +
      "Lighting/mood: emotional, warm, premium, realistic match-night atmosphere\n" +
      "Constraints: no text, no watermark, no logos, avoid visible faces, tasteful and credible scene\n" +
      "Avoid: stadium-only image, fan merchandise branding, artificial fireworks effects",
  },
  {
    slug: "epg-catch-up-snimanje-ex-yu-iptv-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: product-lifestyle blog hero image\n" +
      "Primary request: IPTV program guide and catch-up features shown on a modern home TV\n" +
      "Scene/background: refined media room or living room with clean Scandinavian interior details\n" +
      "Subject: television displaying an elegant EPG grid and replay interface, remote control nearby, realistic home streaming setup\n" +
      "Style/medium: premium editorial interior photography\n" +
      "Composition/framing: wide 16:9, TV screen clearly readable as a schedule concept but no literal text required\n" +
      "Lighting/mood: calm, modern, premium tech atmosphere\n" +
      "Constraints: no text overlays, no watermark, no logos, no faces, high realism\n" +
      "Avoid: fake app mockup with obvious nonsense text, messy room, low-tech aesthetics",
  },
  {
    slug: "ex-yu-iptv-australija-2026-sydney-melbourne",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora blog hero image\n" +
      "Primary request: Balkan IPTV viewing in Australia with Sydney and Melbourne mood\n" +
      "Scene/background: dusk balcony apartment overlooking a sophisticated Australian city skyline with subtle Sydney cues\n" +
      "Subject: laptop or TV showing Balkan channel content inside a cozy premium apartment setting\n" +
      "Style/medium: editorial lifestyle photography, realistic travel-home crossover\n" +
      "Composition/framing: wide 16:9, cityscape plus interior streaming setup balanced together\n" +
      "Lighting/mood: warm interior contrasted with blue dusk skyline, aspirational but believable\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, no postcard look\n" +
      "Avoid: obvious landmarks dominating the frame, oversaturated sunset, tourism brochure vibe",
  },
  {
    slug: "ex-yu-iptv-kanada-2026-toronto-vancouver",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora blog hero image\n" +
      "Primary request: Balkan IPTV channels in a cozy Canadian apartment at night\n" +
      "Scene/background: refined apartment interior with large windows and subtle Toronto skyline atmosphere\n" +
      "Subject: TV showing domestic Balkan channel content, comfortable evening setup for diaspora life\n" +
      "Style/medium: realistic editorial interior photography\n" +
      "Composition/framing: wide 16:9, emphasize warmth inside against cool urban night outside\n" +
      "Lighting/mood: premium, calm, intimate, realistic winter-city evening feeling\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: generic office skyline, hard HDR glow, cluttered furniture",
  },
  {
    slug: "ex-yu-iptv-sad-2026-new-york-chicago",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora blog hero image\n" +
      "Primary request: EX YU IPTV viewing from a stylish apartment in the United States\n" +
      "Scene/background: sophisticated apartment with large city windows and subtle New York or Chicago skyline cues\n" +
      "Subject: TV displaying Balkan programming, remote and living-room details implying everyday diaspora viewing\n" +
      "Style/medium: editorial lifestyle photography\n" +
      "Composition/framing: wide 16:9, blend urban skyline and interior TV setup naturally\n" +
      "Lighting/mood: premium evening mood, cinematic but believable\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, no patriotic props\n" +
      "Avoid: stock-photo skyline wallpaper, excessive blue tint, artificial lens flare",
  },
  {
    slug: "ex-yu-iptv-skandinavija-2026-svedska-norveska-danska",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora blog hero image\n" +
      "Primary request: warm Balkan IPTV streaming inside a Scandinavian home in winter\n" +
      "Scene/background: snowy Nordic exterior visible through windows, minimalist interior with tasteful textures\n" +
      "Subject: television showing Balkan content in a warm apartment, calm living-room setup with blanket and remote\n" +
      "Style/medium: editorial interior photography\n" +
      "Composition/framing: wide 16:9, strong contrast between cold outside and cozy inside\n" +
      "Lighting/mood: hygge, premium, realistic winter ambience\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: cabin cliché overload, artificial snow effects, over-staged decor",
  },
  {
    slug: "samsung-lg-balkan-iptv-postavke-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium tech blog hero image\n" +
      "Primary request: Smart TV IPTV settings setup in a modern European apartment\n" +
      "Scene/background: elegant contemporary living room with premium television placement\n" +
      "Subject: large smart TV showing a realistic settings interface for streaming optimization, remote in hand or on console without showing faces\n" +
      "Style/medium: editorial consumer-tech photography\n" +
      "Composition/framing: wide 16:9, settings screen and premium home environment both visible\n" +
      "Lighting/mood: modern, clean, confident, premium product atmosphere\n" +
      "Constraints: no text overlays, no watermark, no logos, no visible faces, realistic UI only\n" +
      "Avoid: showroom emptiness, exaggerated reflections, fake futuristic panels",
  },
  {
    slug: "ex-yu-iptv-njemacka-2026-bundesliga-balkan-kanali",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora sports blog hero image\n" +
      "Primary request: Balkan IPTV and Bundesliga viewing setup for diaspora in Germany\n" +
      "Scene/background: elegant modern German apartment at evening with subtle city lights outside\n" +
      "Subject: premium television showing abstract football broadcast colors, remote and cozy living-room setup suggesting home viewing of Balkan and Bundesliga content\n" +
      "Style/medium: editorial lifestyle photography, cinematic but realistic\n" +
      "Composition/framing: wide 16:9, TV and apartment environment balanced naturally\n" +
      "Lighting/mood: warm, polished, premium sports-evening atmosphere\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable screen UI\n" +
      "Avoid: fan merchandise branding, sports bar look, clutter",
  },
  {
    slug: "balkanski-sportski-kanali-iptv-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports hero image\n" +
      "Primary request: organized Balkan sports IPTV experience for diaspora during a big sports weekend\n" +
      "Scene/background: stylish home media room with premium television and subtle stadium atmosphere implied through lighting\n" +
      "Subject: large TV with abstract multicolor sports broadcast visuals, remote, sofa, snacks and upscale viewing setup\n" +
      "Style/medium: editorial sports-lifestyle photography\n" +
      "Composition/framing: wide 16:9, premium home viewing as the focus\n" +
      "Lighting/mood: energetic but refined, realistic event-night atmosphere\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable screen elements\n" +
      "Avoid: poster graphics, noisy collage, exaggerated neon effects",
  },
  {
    slug: "ex-yu-iptv-svicarska-2026-bosanski-hrvatski-srpski-kanali",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora family blog hero image\n" +
      "Primary request: EX YU IPTV for diaspora family life in Switzerland\n" +
      "Scene/background: elegant Swiss apartment interior with refined mountain-city evening ambience through large windows\n" +
      "Subject: television showing abstract warm domestic content tones, cozy family-oriented living room with premium furniture and calm atmosphere\n" +
      "Style/medium: editorial interior photography\n" +
      "Composition/framing: wide 16:9, homely but upscale composition centered on TV area\n" +
      "Lighting/mood: calm, warm, premium, welcoming\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable screen details\n" +
      "Avoid: postcard alpine dominance, tourism brochure vibe, clutter",
  },
  {
    slug: "kako-gledati-derbije-ex-yu-u-inostranstvu-iptv-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports-event blog hero image\n" +
      "Primary request: watching a major EX YU football derby abroad through IPTV in a stylish apartment\n" +
      "Scene/background: evening apartment with big-screen television, subtle tension and match-night energy\n" +
      "Subject: television with abstract football match visuals, living-room details suggesting a major derby night without showing people clearly\n" +
      "Style/medium: cinematic editorial sports photography\n" +
      "Composition/framing: wide 16:9, focused on the atmosphere of an important match night at home\n" +
      "Lighting/mood: dramatic but realistic, premium and emotional\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable scoreboard or interface\n" +
      "Avoid: stadium-only scene, cheap sports poster look, oversaturated effects",
  },
  {
    slug: "porodicni-ex-yu-iptv-paket-dijaspora-2026",
    type: "new",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium family lifestyle blog hero image\n" +
      "Primary request: family-friendly EX YU IPTV setup for diaspora at home\n" +
      "Scene/background: warm modern family living room with elegant interior design and evening atmosphere\n" +
      "Subject: television showing abstract colorful family-safe content, tidy seating area, blankets and premium home details suggesting shared viewing\n" +
      "Style/medium: editorial lifestyle and interior photography\n" +
      "Composition/framing: wide 16:9, balanced family-room composition centered on the TV experience\n" +
      "Lighting/mood: warm, safe, premium, welcoming\n" +
      "Constraints: no text, no logos, no watermark, no visible faces, no readable on-screen content\n" +
      "Avoid: cheesy family stock photo, cluttered toys, cartoonish visuals",
  },
  {
    slug: "android-box-iptv-instalacija",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium installation guide hero image\n" +
      "Primary request: Android TV box setup for IPTV at home\n" +
      "Scene/background: modern entertainment center in a clean living room\n" +
      "Subject: Android TV box connected to a television, hands configuring the device, cables tidy and realistic\n" +
      "Style/medium: editorial consumer-tech photography\n" +
      "Composition/framing: wide 16:9, setup process centered clearly for a blog hero\n" +
      "Lighting/mood: practical, premium, realistic household tech scene\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: messy cables, workshop vibe, low-end product render look",
  },
  {
    slug: "fire-tv-stick-iptv-instalacija",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium installation guide hero image\n" +
      "Primary request: streaming stick setup in progress on a modern television\n" +
      "Scene/background: stylish living room media setup\n" +
      "Subject: streaming stick inserted into TV HDMI port, remote in hand, setup progress implied with on-screen interface\n" +
      "Style/medium: editorial product-lifestyle photography\n" +
      "Composition/framing: wide 16:9, clear emphasis on the device installation process\n" +
      "Lighting/mood: clean, premium, approachable tech mood\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, avoid brand marks\n" +
      "Avoid: macro-only product shot, sterile studio isolation, plastic render look",
  },
  {
    slug: "iptv-besplatno-testirati-24h",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium blog hero image\n" +
      "Primary request: person trying an IPTV service during a relaxed evening trial at home\n" +
      "Scene/background: comfortable couch setup in a modern apartment at dusk\n" +
      "Subject: television and remote with trial-use atmosphere, human presence implied without showing a face\n" +
      "Style/medium: editorial lifestyle photography\n" +
      "Composition/framing: wide 16:9, casual but polished home streaming scene\n" +
      "Lighting/mood: relaxed, trustworthy, premium everyday use\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: salesy promotional imagery, cheap stock poses, overacted excitement",
  },
  {
    slug: "iptv-osterreich-bosanski-srpski-kanali",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora blog hero image\n" +
      "Primary request: Balkan IPTV channels for diaspora life in Austria\n" +
      "Scene/background: elegant apartment interior with subtle Vienna architecture visible outside\n" +
      "Subject: television showing Balkan channels in a warm home setting, tasteful Austrian urban context\n" +
      "Style/medium: editorial interior photography\n" +
      "Composition/framing: wide 16:9, balance city context with streaming-at-home focus\n" +
      "Lighting/mood: warm, premium, realistic European evening ambience\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: tourism postcard look, heavy landmark focus, staged luxury excess",
  },
  {
    slug: "iptv-vs-kabelska-televizija",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: editorial comparison hero image\n" +
      "Primary request: visual comparison between classic cable television and modern streaming hardware\n" +
      "Scene/background: minimalist tabletop or media console in a modern home\n" +
      "Subject: coax cable and traditional TV element contrasted with sleek streaming device and remote\n" +
      "Style/medium: premium editorial still-life photography\n" +
      "Composition/framing: wide 16:9, clean side-by-side composition without labels\n" +
      "Lighting/mood: informative, modern, restrained, premium\n" +
      "Constraints: no text, no watermark, no logos, no faces\n" +
      "Avoid: infographic arrows, garish split color palettes, gimmicky tech effects",
  },
  {
    slug: "kako-gledati-exyu-kanale-u-inostranstvu",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium diaspora guide hero image\n" +
      "Primary request: watching EX YU channels abroad through IPTV\n" +
      "Scene/background: tasteful global-travel and home-viewing concept in one realistic interior scene\n" +
      "Subject: television in an apartment abroad, subtle map or travel cues, diaspora connection to the Balkans implied visually\n" +
      "Style/medium: editorial lifestyle photography\n" +
      "Composition/framing: wide 16:9, readable storytelling without text elements\n" +
      "Lighting/mood: warm, aspirational, realistic, premium\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: literal globe infographic, airport clichés, generic business-travel stock imagery",
  },
  {
    slug: "kako-instalirati-iptv-na-samsung-tv",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium installation guide hero image\n" +
      "Primary request: smart TV app installation for IPTV at home\n" +
      "Scene/background: modern living room with close but wide enough view of a television setup\n" +
      "Subject: smart TV showing an app installation or setup screen, hands using a remote, no visible faces\n" +
      "Style/medium: editorial consumer-tech photography\n" +
      "Composition/framing: wide 16:9, clear setup narrative for a technical guide\n" +
      "Lighting/mood: clean, realistic, premium home-tech look\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, realistic interface only\n" +
      "Avoid: fake futuristic UI, over-zoomed macro crop, showroom vibe",
  },
  {
    slug: "kako-poboljsati-kvalitetu-iptv-streama",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium tech advice hero image\n" +
      "Primary request: improving IPTV stream quality at home\n" +
      "Scene/background: modern media room with router and television setup\n" +
      "Subject: high-quality router in foreground with sharp stable television playback in background, premium networking concept\n" +
      "Style/medium: editorial consumer-tech photography\n" +
      "Composition/framing: wide 16:9, focus on connection quality and stable streaming\n" +
      "Lighting/mood: modern, precise, premium, realistic tech atmosphere\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: speed-test graphics, neon network lines, unrealistic sci-fi effects",
  },
  {
    slug: "legalnost-iptv-u-njemackoj",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: serious editorial blog hero image\n" +
      "Primary request: legal discussion around IPTV in Germany and the DACH region\n" +
      "Scene/background: sophisticated Berlin cityscape or governmental architecture with editorial neutrality\n" +
      "Subject: balanced legal concept in a modern setting, subtle scales of justice or documents near a television setup, tasteful and realistic\n" +
      "Style/medium: editorial reportage photography\n" +
      "Composition/framing: wide 16:9, sober and premium, suitable for a legal explainer article\n" +
      "Lighting/mood: balanced, calm, serious, professional\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, no political propaganda\n" +
      "Avoid: courtroom clichés, dramatic crime-show look, sensationalism",
  },
  {
    slug: "najbolji-iptv-box-2026",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium product comparison hero image\n" +
      "Primary request: editorial lineup of the best IPTV streaming boxes for 2026\n" +
      "Scene/background: refined media shelf or modern tabletop in a living room\n" +
      "Subject: three or four different streaming boxes arranged elegantly with a television in the background\n" +
      "Style/medium: editorial product photography with realistic materials\n" +
      "Composition/framing: wide 16:9, clean comparison lineup without labels\n" +
      "Lighting/mood: premium, modern, trustworthy tech review atmosphere\n" +
      "Constraints: no text, no watermark, no logos, no faces, neutral styling\n" +
      "Avoid: ecommerce catalog look, isolated white background, exaggerated reflections",
  },
  {
    slug: "najbolji-sportski-kanali-exyu-iptv",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium sports blog hero image\n" +
      "Primary request: best sports channels on Balkan IPTV shown through a premium home viewing setup\n" +
      "Scene/background: modern TV room with energetic live sports atmosphere\n" +
      "Subject: television showing football, tennis and basketball moments in a tasteful collage-like on-screen mix, stadium energy without logos\n" +
      "Style/medium: editorial sports-lifestyle photography\n" +
      "Composition/framing: wide 16:9, television as focal point with premium sports mood\n" +
      "Lighting/mood: dynamic, premium, realistic event-night atmosphere\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: poster design, oversaturated arena lights, fake broadcast branding",
  },
  {
    slug: "sta-je-iptv-i-kako-radi",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium explainer blog hero image\n" +
      "Primary request: realistic concept for how IPTV works at home\n" +
      "Scene/background: modern home networking and television setup\n" +
      "Subject: data cables, router and television with subtle digital signal visualization integrated naturally into the scene\n" +
      "Style/medium: editorial consumer-tech photography\n" +
      "Composition/framing: wide 16:9, educational but premium and realistic\n" +
      "Lighting/mood: clear, modern, confident, believable tech ambience\n" +
      "Constraints: no text, no watermark, no logos, no visible faces\n" +
      "Avoid: abstract neon tech tunnel, cheesy holograms, cluttered wiring",
  },
  {
    slug: "tivimate-vs-iptv-smarters-pro-2026",
    type: "old",
    prompt:
      "Use case: photorealistic-natural\n" +
      "Asset type: premium app comparison hero image\n" +
      "Primary request: comparison of two IPTV app experiences on mobile devices\n" +
      "Scene/background: elegant desk or living-room environment with neutral premium textures\n" +
      "Subject: two smartphones or tablets side by side showing contrasting IPTV app interfaces, editorial comparison without branding\n" +
      "Style/medium: editorial tech photography\n" +
      "Composition/framing: wide 16:9, balanced side-by-side app comparison composition\n" +
      "Lighting/mood: polished, modern, premium software-review atmosphere\n" +
      "Constraints: no text, no watermark, no logos, no visible faces, realistic screens only\n" +
      "Avoid: app store mockup style, fluorescent UI glow, floating devices in space",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readUtf8(filePath) {
  return readFile(filePath, "utf8");
}

function getApiKey() {
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    return process.env.GOOGLE_GEMINI_API_KEY.trim();
  }

  const envLocalPath = path.join(ROOT, "env.local");
  return readFile(envLocalPath, "utf8")
    .then((contents) => {
      const match = contents.match(/^GOOGLE_GEMINI_API_KEY=(.+)$/m);
      if (!match) {
        throw new Error("GOOGLE_GEMINI_API_KEY not found in env.local");
      }
      return match[1].trim();
    })
    .catch((error) => {
      throw new Error(`Failed to load GOOGLE_GEMINI_API_KEY: ${error.message}`);
    });
}

function extractPostTitle(html, slug) {
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    return decodeHtmlEntities(stripTags(h1Match[1]).trim());
  }

  const titleMatch = html.match(/<title>(.*?) \| EXYU IPTV Blog<\/title>/i);
  if (titleMatch) {
    return decodeHtmlEntities(titleMatch[1].trim());
  }

  throw new Error(`Could not determine title for ${slug}`);
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "");
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&#38;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function loadPostMetadata() {
  const result = [];

  const selectedPosts = POST_SLUGS
    ? POSTS.filter((post) => POST_SLUGS.has(post.slug))
    : POSTS;

  for (const post of selectedPosts) {
    const htmlPath = path.join(BLOG_DIR, post.slug, "index.html");
    const html = await readUtf8(htmlPath);
    result.push({
      ...post,
      htmlPath,
      title: extractPostTitle(html, post.slug),
    });
  }

  return result;
}

async function generateImageBuffer(apiKey, prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const imagePart = data?.candidates?.[0]?.content?.parts?.find((part) =>
    part.inlineData?.mimeType?.startsWith("image/"),
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini response did not include image data");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function saveWebP(inputBuffer, outputPath) {
  await sharp(inputBuffer)
    .resize(1600, 900, {
      fit: "cover",
      position: "center",
    })
    .webp({
      quality: 88,
      effort: 6,
    })
    .toFile(outputPath);
}

function patchPostHtml(html, post) {
  const imagePath = `/images/blog/${post.slug}.webp`;
  const imageUrl = `${SITE_BASE}${imagePath}`;
  let nextHtml = html;

  nextHtml = nextHtml.replace(
    new RegExp(
      `src="/images/hero-bg-compressed\\.webp" alt="${escapeRegex(post.title)}"`,
      "g",
    ),
    `src="${imagePath}" alt="${post.title}"`,
  );

  nextHtml = nextHtml.replaceAll(`/images/blog/${post.slug}.jpg`, imagePath);

  nextHtml = nextHtml.replace(
    /(<meta property="og:image" content=")[^"]*(")/i,
    `$1${imageUrl}$2`,
  );
  nextHtml = nextHtml.replace(
    /(<meta property="twitter:image" content=")[^"]*(")/i,
    `$1${imageUrl}$2`,
  );

  return nextHtml;
}

function patchBlogIndexHtml(html, posts) {
  let nextHtml = html;

  for (const post of posts) {
    const imagePath = `/images/blog/${post.slug}.webp`;

    nextHtml = nextHtml.replace(
      new RegExp(
        `src="/images/hero-bg-compressed\\.webp" alt="${escapeRegex(post.title)}"`,
        "g",
      ),
      `src="${imagePath}" alt="${post.title}"`,
    );

    nextHtml = nextHtml.replaceAll(`/images/blog/${post.slug}.jpg`, imagePath);
  }

  const blogIndexOgUrl = `${SITE_BASE}/images/blog/${BLOG_INDEX_OG_SLUG}.webp`;
  nextHtml = nextHtml.replace(
    /(<meta property="og:image" content=")[^"]*(")/i,
    `$1${blogIndexOgUrl}$2`,
  );
  nextHtml = nextHtml.replace(
    /(<meta property="twitter:image" content=")[^"]*(")/i,
    `$1${blogIndexOgUrl}$2`,
  );

  return nextHtml;
}

async function patchMarkdownFrontmatter(post) {
  if (post.type !== "new") {
    return "skipped";
  }

  const markdownPath = path.join(CONTENT_DIR, `${post.slug}.md`);
  let markdown = await readUtf8(markdownPath);

  if (/^coverImage:/m.test(markdown)) {
    return "already-present";
  }

  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    throw new Error(`Frontmatter not found in ${markdownPath}`);
  }

  const insertion =
    `coverImage: "/images/blog/${post.slug}.webp"\n` +
    `coverImageAlt: "${post.title.replaceAll('"', '\\"')}"`;

  markdown = markdown.replace(
    /^---\r?\n([\s\S]*?)\r?\n---/,
    (match, frontmatter) => `---\n${frontmatter}\n${insertion}\n---`,
  );

  await writeFile(markdownPath, markdown, "utf8");
  return "updated";
}

async function main() {
  const apiKey = await getApiKey();
  const posts = await loadPostMetadata();
  const results = [];

  await mkdir(BLOG_IMAGE_DIR, { recursive: true });

  let blogIndexHtml = await readUtf8(path.join(BLOG_DIR, "index.html"));

  for (const [index, post] of posts.entries()) {
    const outputPath = path.join(BLOG_IMAGE_DIR, `${post.slug}.webp`);
    const imageExists = await fileExists(outputPath);

    try {
      if (!imageExists || FORCE_REGENERATE) {
        console.log(
          `[${index + 1}/${posts.length}] Generating image for ${post.slug}...`,
        );
        const imageBuffer = await generateImageBuffer(
          apiKey,
          `${post.prompt}${GLOBAL_PROMPT_SUFFIX}`,
        );
        await saveWebP(imageBuffer, outputPath);
        await sleep(RATE_LIMIT_MS);
      } else {
        console.log(
          `[${index + 1}/${posts.length}] Reusing existing image for ${post.slug}`,
        );
      }

      const currentHtml = await readUtf8(post.htmlPath);
      await writeFile(post.htmlPath, patchPostHtml(currentHtml, post), "utf8");

      blogIndexHtml = patchBlogIndexHtml(blogIndexHtml, [post]);
      const frontmatterStatus = await patchMarkdownFrontmatter(post);

      results.push({
        slug: post.slug,
        status: imageExists && !FORCE_REGENERATE ? "reused" : "generated",
        frontmatter: frontmatterStatus,
      });
    } catch (error) {
      console.error(`Failed for ${post.slug}: ${error.message}`);
      results.push({
        slug: post.slug,
        status: "failed",
        frontmatter: "unchanged",
      });
    }
  }

  await writeFile(path.join(BLOG_DIR, "index.html"), blogIndexHtml, "utf8");

  console.log("\nSummary:");
  for (const item of results) {
    console.log(
      `- ${item.slug}: image=${item.status}, frontmatter=${item.frontmatter}`,
    );
  }

  const failed = results.filter((item) => item.status === "failed");
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

await main();
