# UNBOX_GADGS — Supabase Admin Edition

This version keeps GitHub Pages as the public host and uses Supabase for the live product database and admin login.

## Setup
1. Create a Supabase project.
2. In Authentication -> Users, create your admin user.
3. Copy that user's UUID.
4. Open `supabase_setup.sql`, replace `YOUR_ADMIN_USER_UUID`, and run it in Supabase SQL Editor.
5. In Supabase Project Settings -> API, copy the Project URL and Publishable key.
6. Put those into `config.js`. Only the publishable/anon key belongs in browser code. Never use the service_role/secret key.
7. Upload all files to GitHub Pages, replacing the old website files.

## Admin
Open `https://YOURUSERNAME.github.io/YOUR-REPOSITORY/admin.html` and sign in with the Supabase user.

## Product images
V1 uses image URLs. The admin form lets you paste an image URL. A later version can add direct Supabase Storage uploads.
