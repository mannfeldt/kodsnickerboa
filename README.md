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

The Patchlands download link is `/patchlands/download`. It redirects Android
devices to Google Play and all other devices (including iOS, desktop, and
unidentified devices) to the App Store. With JavaScript disabled, it defaults
to the App Store. The store URLs are configured in
`patchlands/download/index.html`.

Patchlands invite links use `/patchlands/invite?tag=asdf%231234`. The page
attempts to open `patchlands://invite` with the original query string and
immediately offers an **Open Patchlands** link if the browser blocks the
automatic attempt. There are no timed retries or automatic store redirects.
Missing or blank tags show an invalid-invite message. JavaScript is required
to construct the invite link; a message explains this when it is disabled.
The page is served from `patchlands/invite/index.html`.

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
