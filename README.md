# Kaahu Shopify Theme Workspace

This workspace is configured for the unpublished Shopify theme:

- Store: `d68c2f-18.myshopify.com`
- Theme: `June 3`
- Theme ID: `162157330651`
- Live theme ID at setup time: `161407008987`

Use the wrapper script so commands always target the `June 3` draft theme.

```sh
./shopify-theme dev
./shopify-theme pull
./shopify-theme push
./shopify-theme open
```

Preview:

```text
https://d68c2f-18.myshopify.com?preview_theme_id=162157330651
```

Theme editor:

```text
https://d68c2f-18.myshopify.com/admin/themes/162157330651/editor
```

Avoid running raw `shopify theme push` without `--theme 162157330651`.
