# Kodsnickerboa

The portfolio page at <https://kodsnickerboa.com>, plus the pages the apps link
to (privacy policies, download and invite links) and the web versions of Slotcars
at `/slotcars/`, Widas Mattekasse at `/widasmattekasse/`, and Tinggal at `/tinggal/`.

This is a dependency-free static site. The deployable files are served
directly from the repository root; there is no framework, package manager, or
build command. The Flutter apps are built in their own repositories and their build output
is committed here.

## Cloudflare Pages

Connect this repository to Cloudflare Pages and use these settings:

- Framework preset: **None**
- Build command: `exit 0`
- Build output directory: `/`
- Root directory: `/`

The main page is `index.html`. The app privacy policies are at
`patchlands/privacy/`, `patchwise/privacy/` and `slotcars/privacy/`. Patchwise
reuses the Patchlands policy with its own app name and URL, and the same privacy
contact. Slotcars has its own policy (the game is offline and sends nothing) and
the contact hello.slotcars@kodsnickerboa.com.

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

Patchwise has the same download and invite behavior at `/patchwise/download`
and `/patchwise/invite?tag=asdf%231234`. Its invite page opens
`patchwise://invite` with the original query string and provides an **Open
Patchwise** fallback link. Its files are in `patchwise/download/index.html`
and `patchwise/invite/index.html`.

## Slotcars web game

`slotcars/` holds the Flutter web build of Slotcars, served at
<https://kodsnickerboa.com/slotcars/>. To update it, run this from the
repository root, with the Slotcars project checked out next to this one (or
pass its path as an argument):

```sh
scripts/build-slotcars.sh
```

The script runs `flutter build web --release --base-href /slotcars/
--no-web-resources-cdn` in the Slotcars project and copies `build/web/` into
`slotcars/`. Commit the result; Cloudflare Pages serves it as is.

- `--base-href /slotcars/` is required. Without it the game looks for its
  files at the site root and shows a blank page.
- `--no-web-resources-cdn` makes the game load its renderer (CanvasKit) from
  this site instead of Google's CDN.
- `slotcars/privacy/` is written by hand and is not part of the build. The
  script leaves it alone.
- Everything else in `slotcars/` is generated and is replaced on every run:
  `index.html`, `flutter_bootstrap.js`, `flutter.js`, `main.dart.js`,
  `flutter_service_worker.js`, `manifest.json`, `version.json`, `favicon.png`,
  `icons/`, `assets/` and `canvaskit/`.
- The script leaves out debug symbols and the `skwasm` and `wimp` renderers.
  Those renderers are only loaded by a `--wasm` build; if you switch to one,
  remove the two `--exclude '/canvaskit/...'` lines from the script.

## Widas Mattekasse

The Swedish landing page is at <https://kodsnickerboa.com/widasmattekasse/>.
It was copied from `../mattekassen/landing-page` and is maintained here.
The Flutter app is at <https://kodsnickerboa.com/widasmattekasse/app/>, with
the admin area at `/widasmattekasse/app/admin`.

To update the app, run this from the repository root. The default source is
`../mattekassen4`; pass its path as an argument for a different checkout.

```sh
scripts/build-widasmattekasse.sh
```

The script builds with `--base-href /widasmattekasse/app/`, bundles CanvasKit
locally and replaces the generated files under `widasmattekasse/app/`.
Commit the output for Cloudflare Pages. The root `_redirects` file rewrites
direct requests for Flutter routes to the app shell. Update those rules
when the Flutter routes change. The app uses the existing Widas Mattekasse
Firebase project for Auth and Firestore.


## Tinggal

The English landing page is at <https://kodsnickerboa.com/tinggal/>. The static
web demo is at <https://kodsnickerboa.com/tinggal/app/>.

To update them, run this from the repository root. It uses the sibling `../tinggal4`
checkout by default; pass another Tinggal checkout path as an argument if needed:

```sh
scripts/build-tinggal.sh
```

The script builds Flutter with `--base-href /tinggal/app/`, bundles CanvasKit
locally, enables `STATIC_DEMO=true`, copies the landing page and generated app
files into `tinggal/`, and omits the Firebase Messaging service worker. The demo
uses bundled mock data and makes no Firebase calls. Its hash-based routes work on
Cloudflare Pages without extra `_redirects` entries. Commit the output for Pages
to serve it.

## Local preview

Serve the repository root with any static server. For example:

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Updating the projects

Each project is an `<article class="piece">` in `index.html`, with its status
line, description, facts and links. The same projects are listed as icons on
the shelf in the header (`<nav class="shelf">`).

- Patchlands and Patchwise link straight to their App Store and Google Play pages.
- Slotcars links to the web game at `slotcars/`. When it is in the stores, add
  store buttons like the ones on Patchlands and update its "Runs on" line.
- my friend from sits under "On the workbench" and is shown on the shelf as an
  uncut block of wood (`.wood-block`). When it has an icon and screenshots,
  move it up as a normal `piece`.

The screenshots and icons in `assets/images/` are resized copies of each
project's store artwork. `assets/images/og.png` is the link preview image, a
1200 × 630 capture of the header.
