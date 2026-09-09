# Kodsnickerboa landing page

This is a dependency-free static landing page for Kodsnickerboa. It is built to work directly on GitHub Pages: there is no build step, package manager, or framework involved.

## Run locally

From this directory, serve the files with any static server. For example:

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. After pushing the `main` branch:

1. Open the repository's **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Future pushes to `main` will rebuild the Pages artifact and deploy the latest static files automatically.

No publishing or external hosting setup is performed from this workspace.

## Updating app store links

Each app card currently contains empty `href=""` store links with a `coming soon` state. Replace the empty `href` value in `index.html` with the real App Store or Google Play URL when an app is published.

The generated artwork lives in `assets/images/`. The `.webp` files are the versions used by the page; the original `.png` files are kept alongside them as higher-resolution source assets.
