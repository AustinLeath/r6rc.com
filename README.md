# r6rc.com

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## SEO Release Checklist

1. Replace placeholder GA4/Search Console/Bing tokens in `index.html`.
2. Deploy and verify `https://r6rc.com/sitemap.xml` and `https://r6rc.com/robots.txt` are reachable.
3. Submit sitemap in Google Search Console and Bing Webmaster Tools.
4. Request indexing for `/` after deploy.
5. Validate JSON-LD rich results for WebSite, WebApplication, and FAQPage.
6. Confirm canonical and Open Graph/Twitter tags in production source.

## KPI Events (GA4)

- `calculator_submit`
- `share_link_copy`
- `mode_switch`
- `faq_expand`
- `discord_click`

Recommended parameter dimensions:

- `mode`
- `direction`
- `matches`
- `question`
- `location`
