# Wolfgramm Holdings design system

## Brand tokens

The shared tokens live in [`style.css`](./style.css).

| Token | Value | Use |
| --- | --- | --- |
| Gold | `#D8AA6A` | Brand accents, links and icon colour |
| Gold hover | `#E4C497` | Hover and active states on gold surfaces |
| Black | `#090909` | Page background and text on gold |
| Surface | `#141310` | Cards, panels and navigation |
| White | `#F5F2EC` | Headings and primary text |
| Muted | `#BCB9B1` | Secondary text |
| Border | `rgb(216 170 106 / 17%)` | Subtle outlines and dividers |
| Hero gradient | `#E4C497` to `#B8905A` | Hero and primary button accents |

## Typography

Headings use Manrope with Arial as a fallback. Body and UI copy use DM Sans with Arial as a fallback. The scale uses `clamp()` for responsive headings:

- H1: `clamp(54px, 7.5vw, 104px)` (44px minimum on mobile)
- H2: `clamp(38px, 5.2vw, 68px)`
- H3: `23px`
- Body: `16px / 1.65`
- Eyebrow labels: `10px`, uppercase, wide tracking
- Captions and controls: `11px–13px`

## Layout

The maximum content width is 1120px. Desktop sections use 110px vertical spacing, cards use 28px padding and 28px radius, and gallery frames and service images use a 4:3 ratio. The responsive breakpoints are 1100px for navigation/grid changes and 600px for compact mobile layouts.

## Buttons and links

Primary buttons use solid brand gold and always retain black text on hover and focus. Gold text links remain gold on hover. Every link and button has a visible gold focus ring. Touch targets use at least 42px dimensions for icon controls.

## Icons

Brand marks are SVG assets in `assets/`. Interface, service and social icons are inline SVGs with consistent dimensions and restrained stroke weights. Icon-only controls have accessible labels.

## Motion

Motion is limited to 180–700ms transitions, subtle SVG orbit trails, scroll reveal and slideshow movement. The orbit paths remain fixed while their short highlighted strokes travel with 12-second and 16-second linear cycles. Essential content is visible without animation. `prefers-reduced-motion: reduce` disables nonessential animation and smooth scrolling, except the explicitly requested slow orbit trails.

## WH SMS configuration

`site-config.js` is the single place to add the official WhatsApp URL. The supplied number 0226064444 is configured as https://wa.me/64226064444. If the setting is cleared, WH SMS links fall back to the existing contact page. Resource-specific messages are stored on each WH SMS element and are used automatically once WhatsApp is configured.

## Gallery presentation

All supplied photographs use equal 4:3 frames. Foreground photographs use contain to preserve the complete image, over a dimmed blurred duplicate. Captions sit below the images. Per-photo CSS brightness, contrast and saturation values live on each gallery card and are recorded in assets/gallery/supplied/sources.json; original image files remain unchanged.
