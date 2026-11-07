# Website revision notes

## Showcase navigation — 8 November 2026

- Replaced the two-row header with a rounded floating navigation bar: division pills on the left, centred Arrow Accent branding, and WH SMS plus a social disclosure on the right.
- Added a native details/summary social dropdown with named Facebook, LinkedIn, Instagram and YouTube links. Escape and outside clicks close it; opening either mobile navigation or the social dropdown closes the other.
- Applied the header to all three pages, retained active division styling, and checked dropdown bounds at desktop, tablet and small mobile sizes.

## Arrow Accent editorial redesign — 8 November 2026

- Used the supplied 03 — Arrow Accent exploration as the basis for scalable WH marks and retained its original PNG in assets.
- Reworked the homepage around large typography, prominent KidsCan photography, clearer audience and service copy, a three-step introduction to working with WH, and one primary conversation action.
- Added shared `editorial.css` styling across the homepage and both division pages: black/ivory section contrast, amber accents, flat editorial cards, and a gold contact section.
- Retained the existing static implementation and all edited gallery images, resource destinations and division routes.
- Browser validation passed at 1440px, 390px and 320px across all three pages: no horizontal overflow or broken loaded images. Local references resolve, section tags balance, and whitespace checks pass. No deployment performed.

## Photography finish — 8 November 2026

- Edited all 40 photographs used by the website with the built-in imagegen tool: 38 gallery images and both division-card images. Saved separate edited files; supplied originals are unchanged.
- Applied a shared editorial brief for natural colour, balanced exposure, controlled highlights, cleaner shadows and restrained detail enhancement. Removed an embedded screenshot zoom-control overlay from the Les Hokianga photo.
- Connected quality-90 JPEG web copies, approximately 13.4 MB total, instead of the approximately 102.7 MB PNG outputs. Generated PNG outputs remain available in the image-generation library; workspace duplicates were removed following explicit approval.
- Removed old per-photo CSS colour filters and hidden duplicate backdrop images. Updated HTML image dimensions and shared-asset version identifiers.
- The full edit brief and original-to-edit inventory are in `assets/gallery/edited/README.md` and `edits.json`. These are AI edits: fine facial details, lettering and backgrounds can differ from the source photographs.
- Validation: all 40 JPEGs decode, all 40 edited assets load in the browser, 38 original gallery cards remain, and no source-gallery files were modified.

## PDF feedback — 8 November 2026

- Applied the actionable layout and wording recommendations in `Wolfgramm Holdings website - 07_11.pdf` to the homepage and both division pages.
- Added a two-level header with the parent mark centred above consistent WH Relational and WH Digital links, distinct people/chip icons, active-page underlines, and a shorter WH SMS button.
- Replaced the uppercase artwork with a consistent provisional lowercase `wh.` mark and matching full wordmark; the original approved artwork requested in the PDF is still needed from Breviss.
- Removed the orbital loops, centred the full brand inside a circular hero panel with a subtle glow animation, enlarged sector labels and the people/relationships/technology line, and added simple division links beside the introduction.
- Made gallery cards smaller (four across on desktop), applied consistent cover crops, and condensed captions. This is the PDF's presentation workaround for soft source photos; no AI restoration or new image detail is claimed.
- Aligned the service offering dividers and buttons, including tablet layouts; separated calendar/contact actions into their own spacious section and gave the contact action secondary styling.
- Updated footer labels, capitalisation, full-logo sizing, and social-icon spacing. Existing Workshops and Contact destinations remain in place because replacement pages/URLs were not supplied.
- The optional rotating brand-background concept and a site-search feature are not included in this revision.
- Validation: browser checks at desktop, tablet and mobile widths, mobile-menu expansion, local asset/link resolution, balanced section tags, and Git whitespace checks. No deployment performed.

Applied the supplied document to all three pages, with the latest image-placement requests from chat.

- Consistent black-and-gold styling, larger typography and simplified navigation.
- Official Facebook, LinkedIn, Instagram, TikTok and YouTube links connected.
- WH Relational precedes WH Digital in shared content.
- Approved WH animation and final contact sections retained.
- Updated service copy and six gold SVG icons based on the document references.
- Repeated sections and unnecessary buttons removed.
- Exactly two reference photographs displayed, only in the WH Relational and WH Digital cards.
- Rolling gallery removed at the user's request.

The dedicated WH Short Message Service URL is still outstanding. Header buttons currently lead to the existing contact section; email contact links are preserved.

Validation: HTML structure, local assets, internal links and JavaScript syntax checked. Desktop presentation reviewed; all three pages checked at 390px with no horizontal overflow or broken images.

## Second draft revisions — 23 October 2026

- Replaced the three homepage principles with all 43 original homepage gallery photos, downloaded from https://wgholdings.co.nz/ into assets/gallery/. Source inventory: assets/gallery/sources.json.
- Added carousel navigation, keyboard scrolling, pause/play, focus/hover pauses and reduced-motion support.
- Updated the WH Relational section heading and explanation using the supplied wording.
- Added the requested line break in WH Digital and updated AI & AGI resilience copy.
- Recreated the supplied gold chip motif as a scalable SVG reading A.I, consistent with the existing SVG service icons.
- Placed all six confirmed offerings in their specified service categories. Free-resource links open an email request; no downloadable guides or assessment backend were supplied.
- Checked HTML nesting, local image references, required copy, offering counts and JavaScript syntax. Browser visual verification was unavailable. Changes are local and have not been deployed.

## Third draft revisions — 2 November 2026

- Consolidated the design system around the supplied gold, black, surface, white, muted, line and hero-gradient tokens.
- Added designed SVG WH and Wolfgramm Holdings marks, consistent SVG controls/icons, official social links and visible keyboard focus states.
- Added WhatsApp WH Short Message Service flows, resource request buttons, and workshops/contact links to both outcome pages.
- Added clean `/relational/` and `/digital/` routes while retaining root redirects for existing links.
- Normalised gallery crops to 4:3 and corrected supplied captions and copy.
- Removed unreferenced legacy gallery images from `assets/gallery/`.


## Supplied-photo corrections ? 24 October 2026

- Replaced the homepage gallery with all 37 named images from pics1.zip, Pics 2.eml and Pics 3.eml, plus the supplied graduation image captioned ?Yogeash and the boys?. Old-site gallery images are no longer displayed.
- Added permanently visible captions from supplied filenames, preserving name spellings while normalising whitespace and trailing punctuation. Full images are displayed without cropping; captions wrap on small screens.
- Prepared web-sized copies in assets/gallery/supplied/; sources.json maps each copy to its original filename and attachment source. Original supplied files remain untouched.
- Updated carousel cloning and navigation to move complete photo/caption cards. Added hover/focus pauses and initial reduced-motion support.
- Free documents were not supplied. Existing email-request links remain until those documents are received; meeting and delivery times are correspondence, not website content.
- Validation passed: all 38 unique images decode, all captions match the source inventory, local references on all three pages resolve, and JavaScript syntax passes. Browser visual verification was unavailable. Changes are local and have not been deployed.

Slideshow follow-up: added a homepage jump link and removed hover/focus pauses so movement continues until explicitly paused (or while dragging). Reduced-motion users can start it with Play. The gallery no longer depends on a reveal animation to become visible. JavaScript syntax checked; browser verification unavailable.

Autoplay preference: slideshow now starts playing on every page load, including when the device requests reduced motion, as explicitly requested. Manual Pause remains available.


## Feedback completion — 3 November 2026

- Connected all conversation and resource buttons to the supplied WhatsApp number +64 22 606 4444, including pre-filled resource-specific messages and working HTML fallback links.
- Replaced remaining text arrows with consistent SVGs, named all six resource buttons, restored shared social links in headers and footers, and drew the AI lettering as paths.
- Used solid brand gold buttons with black text, consolidated icon sizing, added gallery keyboard focus styling, and retained consistent 4:3 crops.
- Enabled reduced-motion-aware scroll response for the orbit artwork and a short chat entrance animation. Removed scroll snapping that interfered with continuous carousel movement.
- Removed obsolete gallery inventory; retained supplied photographs and existing working-tree edits.
- Master logo artwork, approved client logos and final caption context are still pending. Current SVG logo remains provisional.
- JavaScript syntax and local asset/link checks passed for all three pages. Changes are local; no deployment performed.
- Verified Ceillhe Sperath against https://www.timeunlimited.co.nz/our-team and corrected Brett O'Riley against https://www.abacnz.co.nz/.
- Browser checks: homepage and both Outcomes routes loaded; navigation menu expanded correctly; resource labels and WhatsApp targets were verified in the rendered pages.
- Orbit fix: the browser reports reduced motion enabled, which disabled both trails. Added a targeted exception for the requested orbit animation and bumped shared asset versions. Browser verification confirmed both dash offsets advance with reduced motion enabled.

## Complete supplied gallery — 3 November 2026
- Matched all 37 photographs in pics1.zip, Pics 2.eml and Pics 3.eml to existing web copies; restored them alongside the graduation photograph (38 total).
- Added uniform 4:3 frames with full-photo containment and softly blurred backgrounds, preserving people at the edges of portraits and group pictures. Captions now sit below photographs with consistent aligned card heights.
- Applied restrained per-photo CSS brightness and contrast based on image luminance, plus mild colour adjustment. Source photo pixels are unchanged; presentation settings are recorded in supplied/sources.json.
- Verified all images decode, 38 cards render with matching dimensions, navigation works, and the preview has no horizontal page overflow. JavaScript syntax passed.

## WH SMS terminology — 3 November 2026
- Updated all three pages, navigation, footers, contact descriptions and documentation to WH Short Message Service (WH SMS). Resource request buttons retain their descriptive names and use the shared data-wh-sms integration.
- Preserved the supplied WhatsApp destination and resource-specific messages. No new SMS transport or backend automation is implied.
- Campaign #2 content alignment awaits the signed proposal; backend workflow changes require the actual integration requirements.
