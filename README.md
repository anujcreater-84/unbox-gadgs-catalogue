# UNBOX_GADGS Catalogue V4

Connected to the existing Supabase project.

## What is fixed
- Supabase URL and publishable key are already configured.
- Public catalogue reads `published = true` products from Supabase.
- Cache-busting query strings are added so GitHub Pages picks up V4.
- Product cards support MRP/discount fields.
- Product detail can show a Buy on Amazon button when `amazon_url` exists.
- V3 direct image upload/admin features are retained.

## Upload
Upload/replace the V4 files in the GitHub repository and commit them.

## Database
Do NOT run the original `supabase_setup.sql` again.
If V2/V3 migrations were already run, no new SQL is required for this V4 package.

## Important
The key in config.js is a Supabase PUBLISHABLE key intended for browser use. Never replace it with an `sb_secret_...` or service-role key.
