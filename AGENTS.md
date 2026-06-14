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

## Known External/App Noise

Theme Check may still report app/vendor issues unrelated to current work, especially:

- Avada SEO snippets/templates
- Visually SDK snippets
- Remote app assets
- Google Fonts / remote font preconnect warnings
- Existing orphaned or unused app/theme helper snippets

Treat those as separate cleanup work unless the user asks to fix them. Do not repeatedly list these known unrelated warnings in routine completion notes; say Theme Check passed with known unrelated warnings only when needed.
