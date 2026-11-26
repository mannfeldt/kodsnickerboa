# Kodsnickerboa

The portfolio page at <https://kodsnickerboa.com>, plus the pages the apps link
to (privacy policies, download and invite links) and the web versions of Slotcars
at `/slotcars/`, Widas Mattekasse at `/widasmattekasse/`, Fikakassan at
`/fikakassan/`, and Tinggal at `/tinggal/`.
Emil's CV is at `/cv/`.

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

## Fikakassan

The Swedish landing page is at <https://kodsnickerboa.com/fikakassan/>. It is
written by hand in `fikakassan/index.html` and `fikakassan/styles.css`, with no
JavaScript, and makes no requests to other sites. Its colours, fonts and radii
follow the app's design tokens (`lib/app/theme.dart` in the Fikakassan project).
The web app is at <https://kodsnickerboa.com/fikakassan/app/>.

To update the app, run this from the repository root. The default source is
`../fikakassen2`; pass its path as an argument for a different checkout.

```sh
scripts/build-fikakassan.sh
```

The script runs the project's own `tool/build_web.sh` with
`--base-href /fikakassan/app/` and replaces the generated files under
`fikakassan/app/`. Commit the output for Cloudflare Pages.

- The app works offline. `offline_worker.js` caches every file listed in
  `offline_files.json` on the first visit, and the install fails if a listed
  file is missing. The script therefore leaves out exactly what
  `tool/build_web.sh` leaves out of that list (debug symbols and the `skwasm`
  renderer). Change the two together.
- The worker's scope is `/fikakassan/app/`, so it never touches the landing page.
- The app uses hash routes (`/fikakassan/app/#/admin/historik`), so no
  `_redirects` rules are needed.

The landing page's assets in `fikakassan/assets/` are copied from the
Fikakassan project and are not regenerated by the script:

- `screens/` are screenshots of the real app (Kiosk list, Björkens IF), taken at
  2× in Chromium and saved as WebP. The Swish QR code in `pay-phone.webp` has had
  its data modules scrambled so it cannot be scanned; keep it that way if the
  screenshots are retaken.
- `emoji/` and `icons/` are copies of the app's Fluent Emoji and Phosphor SVGs,
  tinted with CSS masks the way the app tints them. Their licences are in
  `licenses/`.
- `fonts/` holds Bricolage Grotesque and Figtree, subset to Latin and converted
  to WOFF2, with their OFL licences.
- `og.png` is the 1200 × 630 link preview, a capture of the hero.

The app was first published as Fikakassen at `/fikakassen/`. The old pages
redirect to the new ones (see `_redirects`), except
`fikakassen/app/offline_worker.js`, which is a small worker that retires the old
app's offline copy in browsers that opened it and sends them to the new
address. Lists and sales carry over because the app still names its browser
database `fikakassen`. Remove the `fikakassen/` folder and its redirects once
nobody can still have the old worker; a few months is plenty.


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

## CV

Emil's CV is at <https://kodsnickerboa.com/cv/>, in English and Swedish, with a
light and a dark mode. It is written by hand in `cv/index.html`, `cv/styles.css`
and `cv/script.js`. The page is not linked from the portfolio.

- Both languages are in the markup. Every translated text appears twice, once with
  `lang="en"` and once with `lang="sv"`, and CSS hides the one that is not chosen.
  A new text needs both.
- The language is taken from `?lang=sv` or `?lang=en` in the address, then from the
  visitor's last choice, then from the browser's language. To send someone the
  Swedish CV, link to `/cv/?lang=sv`.
- Each role is an `<article class="entry">`. Its `data-start` and `data-end`
  (`YYYY-MM`; leave `data-end` empty for the current role) place it on the ruler
  at the top and give its length. `data-short-en` and `data-short-sv` are its
  labels on the ruler.
- `data-tech` on an entry lists the technologies used there, as keys separated by
  spaces. They must match the `data-tech` of the buttons in the entry's own tag
  list and in the Skills column, which is what makes picking a technology
  highlight the roles it was used in. A new technology needs a button in both
  places.
- The PDF button opens the browser's print dialog. The print styles give a plain,
  light CV in the chosen language, without the ruler.
- Without JavaScript the page shows the English text and no ruler.

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
- Slotcars is on the App Store and Google Play, and links to the web game at
  `slotcars/`.
- my friend from sits under "On the workbench" and is shown on the shelf as an
  uncut block of wood (`.wood-block`). When it has an icon and screenshots,
  move it up as a normal `piece`.
- Nutrimons sits under "On the workbench" as an early build and is shown on
  the shelf as an uncut block of wood (`.wood-block`).
- Widas Mattekasse and Fikakassan also sit under "On the workbench", with their
  own icons, and link to their landing pages at `widasmattekasse/` and
  `fikakassan/`.
- The shelf is sized for seven icons (`.shelf` width and `grid-template-columns`
  in `styles.css`). An eighth needs both changed, and a check at 320 px wide,
  where the labels are condensed to fit.

The screenshots and icons in `assets/images/` are resized copies of each
project's store artwork. `assets/images/og.png` is the link preview image, a
1200 × 630 capture of the header.
