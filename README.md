# UNBOX_GADGS V5

This version fixes the public catalogue JavaScript error caused by binding events to HTML IDs that do not exist (`closeModal`, `contactWhatsapp`). The public page now uses safe event bindings, calls `loadProducts()` successfully, and includes a Refresh button.

No new SQL is required. Upload the V5 files over the existing GitHub Pages files.

Keep the existing Supabase configuration in config.js.
