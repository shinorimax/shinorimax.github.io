# Shinnosuke Yagi — Portfolio

A static GitHub Pages portfolio with a Persona 5 Royal inspired visual direction: angular red accents, black and neutral surfaces, bold condensed headings, and high-contrast reading surfaces.

## Local preview

From this folder, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000). No build or package installation is required. Stop the preview with Ctrl+C.

## Editing

- `index.html` contains the profile, selected work, and contact links.
- `pages/projects.html` lists all research, projects, and work experience.
- `style.css` owns shared colors, typography, navigation, and responsive layouts. Case studies retain only their page-specific layout styles; all pages, including Contact and Memorandum, use the shared theme. The shared stylesheet loads last. Its content-version query is identical across pages and should be refreshed when changing styles to avoid stale browser caches.
- `assets/memorandum-data.js` contains the bilingual notes; `assets/memorandum.js` provides search, topic filters, and the constellation interactions.
- Internal HTML links use a matching page-version query (`v=portfolio-6`) so navigation bypasses cached pages from before the redesign. When refreshing that version, update internal links across all pages together; canonical URLs and sitemap entries remain unversioned.
- Update `sitemap.xml` when adding or removing a page. Page descriptions and canonical URLs live in each HTML head.

The site uses existing local photos and project assets, with Google Fonts and system-font fallbacks. Reduced-motion preferences and keyboard focus styles are supported.

Changes can be reviewed locally without committing, pushing, or publishing the site.
