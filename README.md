# UNBOX_GADGS Catalogue V2

A polished, mobile-first static product catalogue.

## Files
- `index.html` — website structure
- `style.css` — design
- `products.js` — product database (this is the main file you edit)
- `script.js` — search, filtering, product details, WhatsApp and sharing
- `assets/favicon.svg` — favicon

## Add a product
Open `products.js` and copy an existing product object. Change:
- `name`
- `brand`
- `category`
- `price`
- `image`
- `emoji`
- `badge`
- `rating`
- `reviews`
- `description`
- `specs`

### Product photos
Put your image inside `assets/`, for example:
`assets/ie200.jpg`

Then set:
`image:"assets/ie200.jpg"`

If `image` is blank, the site uses the emoji placeholder.

## Change WhatsApp
Open `script.js` and change:
`const WHATSAPP_NUMBER="919999999999";`
Use country code + number without `+` or spaces.

## Free hosting with GitHub Pages
1. Create a public GitHub repository.
2. Upload everything in this folder to the repository root.
3. Go to Settings → Pages.
4. Source: Deploy from a branch.
5. Branch: `main`, folder `/ (root)`.
6. Save.
7. Your free URL will look like:
`https://YOURUSERNAME.github.io/REPOSITORY/`

## Important
This is a catalogue, not a checkout/store. It does not process payments or collect customer data.
