# Kodsnickerboa landing page

This is a dependency-free static site. The deployable files are served
directly from the repository root; there is no framework, package manager, or
build command.

## Cloudflare Pages

Connect this repository to Cloudflare Pages and use these settings:

- Framework preset: **None**
- Build command: `exit 0`
- Build output directory: `/`
- Root directory: `/`

The main page is `index.html`, and the Patchlands privacy policy is at
`patchlands/privacy/`.

## Local preview

Serve the repository root with any static server. For example:

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Updating app store links

Each app card currently contains empty store links with a `coming soon` state.
Replace the empty `href` value in `index.html` with the real App Store or
Google Play URL when an app is published.

The artwork lives in `assets/images/`.
