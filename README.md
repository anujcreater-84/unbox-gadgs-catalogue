# UNBOX_GADGS V10 — Buttons Fixed

This version fixes the public catalogue button handlers.

- View details now calls the actual `showProduct()` function.
- Buy Now is a real anchor and opens the manually supplied destination URL in a new tab.
- Amazon/affiliate is no longer assumed; any valid `http://` or `https://` URL works.
- Product detail Buy Now works too.
- Mobile menu, search, category filters, sort, refresh and modal close are wired safely.
- Image display remains supported.
- No database changes are required.

Upload/replace the V10 files in the GitHub Pages repository root.
After deployment, hard refresh with Ctrl+Shift+R.
