# Include Technologies — website

Static website for **www.includetechnologies.com**, built with HTML5, CSS3 and vanilla JavaScript (no frameworks).

## Files

```
include-technologies/
├── index.html          Home page (all sections)
├── privacy.html        Privacy Policy
├── terms.html          Terms & Conditions
├── style.css           All styles
├── script.js           Menu, scroll effects, service details, form
├── robots.txt           Search engine rules
├── sitemap.xml          Sitemap for Google Search Console
└── Root-level image assets (logos, icons, preview, and illustrations)
```

## Preview locally

Double-click `index.html`, or run a small server in this folder:

```
python -m http.server 8000
```

then open http://localhost:8000.

## Put it live on www.includetechnologies.com

1. Upload **everything in this folder** (keep the folder structure) to your hosting's web root — usually `public_html/` on cPanel hosting.
2. Make sure `index.html` sits directly inside `public_html/`.
3. Turn on SSL (HTTPS) in your hosting panel — most hosts offer free Let's Encrypt certificates.
4. Submit `https://www.includetechnologies.com/sitemap.xml` in Google Search Console.
5. Create a Google Business Profile so you appear on Google Maps.

Free alternatives: Netlify or Cloudflare Pages (drag and drop this folder, then point your domain's DNS to them).

## Contact form

There is no server behind the form, so it does **not** store messages. After the visitor fills it in correctly,
it offers two buttons — **Send on WhatsApp** and **Send by email** — with all their details already written in.

To receive form submissions straight in your inbox instead:

1. Create a free form at https://formspree.io (or a similar service) using `Info@includetechnologies.com`.
2. Copy the endpoint URL it gives you (looks like `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, find `data-endpoint=""` on the form and paste the URL between the quotes.

If sending ever fails, the WhatsApp/email buttons are shown automatically as a backup.

## Things to update

- **Address:** add your street address / city to the structured data in `index.html` (`"address"` block) and to the contact section once you want it public. It helps local Google search.
- **Real photos:** when you have photos of your own installations, replace the root-level SVG illustrations and update the `src` in the Solutions section. Keep file sizes under ~200 KB (use https://squoosh.app).
- **Services:** service card text is in `index.html`; the "Learn more" details are in the `SERVICES` object near the middle of `script.js`.
- **Colours:** change the variables at the top of `style.css`.

## Contact details used

- Phone / WhatsApp: (+233) 0 201 46 67 17 → `tel:+233201466717`, `https://wa.me/233201466717`
- Email: Info@includetechnologies.com
- Instagram: @include_it_solutions
- Website: www.includetechnologies.com
