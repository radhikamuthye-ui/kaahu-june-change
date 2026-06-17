# Kaahu Shopify Theme Instructions

This repository is the working copy for the Kaahu Shopify theme draft. All routine work is on the unpublished `June 3` draft theme only.

## Project Identity

- Store: `d68c2f-18.myshopify.com`
- Draft theme: `June 3`
- Draft theme ID: `162157330651`
- Preferred working copy: `/Users/ashutoshchaudhary/Shopify June 3`
- Older external copy: `/Volumes/ashu-ssd1/Shopify June 3`

Use the home-folder copy unless the user explicitly says otherwise.

## Default Workflow

- Use `./shopify-theme` instead of raw Shopify CLI commands when possible.
- `./shopify-theme pull` pulls from the June 3 draft with `--nodelete`.
- `./shopify-theme push` pushes to the June 3 draft only.
- `./shopify-theme check` runs Theme Check with this repo's ignore config.
- For push requests, push only changed theme files when possible.
- Treat draft pull/push as low-risk sync operations. Do not add slow pre/post checks unless the user asks, the command fails, or the change is risky.
- Do not run `git diff` or `git diff --stat` unless the user asks for a diff, asks what changed, or the task requires inspecting a specific change.
- Prefer `git status --short` for quick state checks.
- Commit frequently after meaningful changes, especially after successful pulls from Shopify, successful pushes, and completed fixes.
- Keep commit messages short and specific.

## Performance Notes

- This theme has many Liquid/CSS/JSON files, and full `shopify theme check` can be slow.
- `.theme-check.yml` intentionally ignores noisy app/vendor files from Avada and Visually.
- Avoid full theme pulls/pushes/checks for small tasks unless needed.
- Do not run full Theme Check as part of every trivial push/pull. Reserve it for Liquid/schema changes, broad CSS changes, or when the user asks.
- Local tooling folders are intentionally ignored: `.claude/`, `.agents/`, `.codex/`.

## Safety Rules

- Never push to the live theme unless the user explicitly asks.
- Never run destructive Git commands such as `git reset --hard` or `git checkout --` without explicit approval.
- Preserve user/admin changes pulled from Shopify theme editor.
- If there are uncommitted changes, work with them instead of reverting them.

## Current Theme Context

- Homepage template: `templates/index.json`.
- Brand story section: `sections/brand-story.liquid` and `assets/section-brand-story.css`.
- Homepage Judge.me reviews section: `sections/kaahu-judgeme-reviews-carousel.liquid` and `assets/section-kaahu-judgeme-reviews-carousel.css`.
- Global font logic lives in `snippets/global-theme-styles.liquid` and native Shopify typography settings.

## Standalone HTML Page Integration

When the user provides a standalone HTML page for this Shopify theme, treat the HTML as content and layout direction, not as final theme code. Do not paste it as raw Shopify page content, and do not commit the supplied HTML file as the implementation unless the user explicitly asks.

- Convert standalone HTML pages into a proper theme section plus JSON template.
- Keep pages editable through the Shopify theme editor.
- Expose practical content controls in the section schema: main headings, eyebrows/kickers, body copy, CTA/link text and URLs, chips/badges, spacing controls when useful, and all content images.
- Use `image_picker` settings for replaceable images, with the supplied/current image URLs as fallbacks.
- Make uploaded photographic images fill their frames with `object-fit: cover` by default. Use `contain` only for logos, icons, SVG illustrations, or artwork where cropping would be wrong.
- Use the existing theme design system: `page-width`, `page-width-narrow`, `--page-margin-*`, `--font-body-family`, `--font-heading-family`, heading size variables, body size variables, line-height variables, and existing color variables where appropriate.
- Do not import page-specific Google Fonts or create a separate typography system unless the user explicitly asks.
- Do not use ad hoc fixed gutters such as `20px` or `28px` for the main content rhythm. Full-bleed color bands are fine, but their inner content should use the same consistent theme width/margin primitive.
- Scope all custom CSS under a unique section class. Never style `body`, `html`, or global element selectors for a page section.
- Use one consistent wrapper pattern throughout a page. Avoid mixing custom wrappers with theme page-width wrappers unless there is a clear reason.
- Check vertical spacing between adjacent sections, especially after hero images. Avoid stacking two large section paddings back-to-back.
- If a new page must be reachable from navigation, prefer Shopify Admin navigation. If Admin menu access is unavailable and the user asks to ensure the header link works, add only a guarded theme fallback that checks existing nested menu links and avoids duplicate links.
- Before editing a page template that may have been customized in Shopify, pull from the June 3 draft and preserve Shopify editor-generated template settings.

## Known External/App Noise

Theme Check may still report app/vendor issues unrelated to current work, especially:

- Avada SEO snippets/templates
- Visually SDK snippets
- Remote app assets
- Google Fonts / remote font preconnect warnings
- Existing orphaned or unused app/theme helper snippets

Treat those as separate cleanup work unless the user asks to fix them. Do not repeatedly list these known unrelated warnings in routine completion notes; say Theme Check passed with known unrelated warnings only when needed.
