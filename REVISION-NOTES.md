# Website revision notes

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
