# UNBOX_GADGS V8 — Generic Buy Now

The product CTA is now a generic **Buy Now** button.

The existing database column `amazon_url` is intentionally retained for compatibility, but it is treated as a generic destination URL. You can manually put:
- Amazon affiliate link
- Flipkart affiliate link
- Brand/store affiliate link
- Direct product URL
- Any other valid product destination URL

No new SQL migration is required.

In the admin panel the field is called **Buy Now / Affiliate Link**.

If the field is filled, the public product card and product details show **Buy Now ↗** and open that exact URL in a new tab.
