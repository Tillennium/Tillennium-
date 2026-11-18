# Tillenium Network landing page

Static site: HTML5, Tailwind CSS (CDN) and vanilla JavaScript. No build step needed. Open `index.html` in a browser, or upload the folder to any static host (Netlify, Vercel, S3, Cloudflare Pages, nginx).

The page loads Tailwind and the Inter and JetBrains Mono fonts from CDNs, so it needs an internet connection the first time it is opened.

## Structure

```
index.html                    Page markup and sections
styles.css         Theme tokens (pure-black dark, light), components, hero backdrop
config.js           The one file to edit: Streamlit URLs, form delivery, hero, gallery
theme.js            Dark / light toggle (also swaps favicon and theme-color)
hero.js             Hero image, optional video, illustrative signal tape
gallery.js          Curated report showcase and lightbox (no visitor uploads)
form.js             Access-request validation and delivery (Formspree or EmailJS)
main.js             Menu, hero terminal feed, Explore Terminal / Launch App routing
logo-dark.svg      Logo for light mode (dark blue)   <- placeholder lockup, replace with official file
logo-white.svg     Logo for dark mode (white)        <- placeholder lockup, replace with official file
favicon.svg        Favicon for dark mode;  favicon-light.svg for light mode
dossier-01.png ...  Report PNGs (see README-reports.md)
hero-bg.jpg         Optional hero image / video (see README-hero.md)
```

## Go-live checklist (config.js)

1. **Streamlit URL.** Set `terminalUrl` and `appUrl` to the dashboard address. Until then both buttons scroll to the Reports section.
2. **Access requests to your inbox.** Formspree: create a form for admin@tillenium.network, then set `formspreeId`. EmailJS: set `provider: 'emailjs'` and fill `emailjs` (create a template that sends to `{{to_email}}` and optionally a second auto-reply template). Until configured the form only simulates success and sends no email.
3. **Demo link.** After submitting, visitors see an "Open demo terminal" button that goes to `appUrl`. To email that link automatically, enable your provider's auto-reply and include the URL.
4. **Logos.** Replace `logo-dark.svg` and `logo-white.svg` with the official files, keeping the names.

## Common edits

**Report images.** Add PNGs to the root folder using the names in `README-reports.md`, or edit the `gallery` list. Drawn placeholders show until a file exists.

**Hero.** Add `hero-bg.jpg`, or set `heroVideo`. The signal tape values are in `backdrop` and are illustrative.

**Colours.** Edit the `--c-*` variables at the top of `styles.css`. Dark mode background is pure black `#000000`.

## Production note

The Tailwind CDN script is convenient but is not recommended for high-traffic production. To compile CSS instead:

```
npm install -D tailwindcss@3
npx tailwindcss -i ./tailwind.css -o tailwind.build.css --minify
```

Then replace the two Tailwind `<script>` tags in `index.html` with a link to `tailwind.build.css`. A matching `tailwind.config.js` and `tailwind.css` are included.

## Legal text

The footer disclosures are a general template. Have counsel review them before launch.
