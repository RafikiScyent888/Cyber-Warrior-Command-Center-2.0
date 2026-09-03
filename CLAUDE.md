# Cyber Warrior Command Center 2.0 — project context

Read this file first in any new session touching this repo. It exists so work on
this project doesn't have to be re-explained from scratch each time.

## How to deliver work — applies to EVERY repo, not just this one

**Never push to GitHub. Deliver finished work as a zip file.**

The owner uploads everything themselves and does not grant push access to
assistant sessions. This holds across the whole Cyber Warrior Program — this
hub, the tile repos, the quiz/sim/acronym repos, and the Face Off games.

The workflow:

1. Work locally and commit locally, so the history and commit messages are
   there for the owner.
2. Zip the repo (excluding `.git`) and hand over the zip.
3. Say **which files actually changed**, separating what the site needs to run
   from documentation and tooling — the owner uploads by hand and shouldn't
   have to diff a zip to work out what matters.
4. Never run `git push`, and don't offer to or ask for credentials.

Work spanning several repos means **one zip per repo**, kept separate so each
can be uploaded on its own.

## What this is

The master hub (`index.html`, plain HTML/CSS/vanilla JS, no build step, no
framework) for the **Cyber Warrior Program** — a family of independent
CompTIA study-resource sites the owner has built for their students. This is
the **successor to `Cyber-Warrior-Command-Center`** (the "1.0" repo), which
now redirects here (see "Redirect" section below). Don't confuse the two —
all future work happens in this repo.

Brand name already in use across the ecosystem: **"Cyber Warrior Program"**
(found in Port-Quiz's footer).

## Two-layer architecture (new in 2.0)

1. **This hub** — one page, all five subject areas, direct links to every
   quiz/sim/acronym site, with a search bar filtering across all of them.
2. **Standalone tile pages** — separate single-purpose repos, each a Royal
   Blue page with one colored tile matching this hub's tile colors, listing
   that subject's links only. Built so a teacher can hand a student exactly
   one tile's worth of links without pointing them at the whole hub.

| Subject | Standalone tile repo | Live URL |
|---|---|---|
| A+ Core 1 | A-Core-1-tile | https://rafikiscyent888.github.io/A-Core-1-tile/ |
| A+ Core 2 | A-Core-2-tile | https://rafikiscyent888.github.io/A-Core-2-tile/ |
| Network+ | Network-Tile | https://rafikiscyent888.github.io/Network-Tile/ |
| Security+ | Security-Tile | https://rafikiscyent888.github.io/Security-Tile/ |
| CySA+ | CySA-Tile | https://rafikiscyent888.github.io/CySA-Tile/ |
| Universal | Universal-tile | https://rafikiscyent888.github.io/Universal-tile/ |
| Face Off Games | Face-Off-Games | https://rafikiscyent888.github.io/Face-Off-Games/ |
| Interactive Labs | Interactive-labs | https://rafikiscyent888.github.io/Interactive-labs/ |

Every tile/sub-tile in this hub's `index.html` has a "Full Tile ↗" button in
its header linking to the matching standalone repo above. This is the
established convention — if a new subject area or standalone tile gets
built, add both the direct links here **and** the "Full Tile ↗" button, and
add a matching table row above.

Design spec (owner-specified, do not change without asking):
- Page background: royal blue
- A+ tile: royal red, with two sub-tiles — Core 1 (royal green), Core 2 (royal purple)
- Network+ tile: royal green
- Security+ tile: royal yellow
- CySA+ tile: blood red (`--royal-blood: #8b0000`) — was royal orange until
  the owner asked for blood red
- Universal tile: royal purple
- Face Off Games tile: royal green — was royal teal (`--royal-teal: #0f766e`)
  until the owner asked for green. This is deliberately a REUSE: Network+ and
  the A+ Core 1 sub-tile are green too, so the grid now carries green in three
  places. The owner was told and chose it; do not "fix" it back.
- Interactive Labs tile: royal gold (`--royal-gold: #6d4c00`) — a deep gold
  rather than a bright one, because the header and the small "Full Tile" link
  both sit on it and the link is 11.5px body text needing 7:1. A bright gold
  would need dark text and would read as Security+ yellow.
- Mobile-friendly, single search bar filtering all links, footer disclaimer:
  "For educational purposes only. Not affiliated with, endorsed by, or
  sponsored by CompTIA®."

## The 15 original source repos (all under github.com/RafikiScyent888)

| Repo | Covers | Format | Item count |
|---|---|---|---|
| Core-1-Sims | A+ 220-1201 PBQ sims | 14 standalone HTML files, no data file | 14 sims |
| Core-1-quizzes | A+ 220-1201 quiz bank | Consolidated JSON in `index.html`, 23 sub-objectives | 403 questions |
| Core-2-Sims | A+ 220-1202 PBQ sims | 11 standalone HTML files, no data file | 11 sims |
| Core-2-quizzes | A+ 220-1202 quiz bank | Single 511KB `index.html`, JSON embedded | 619 questions |
| A-acronym-games. | A+ 1201 **and** 1202 acronyms (combined) | `data/acronyms.json` + duplicate `js/acronyms-data.js` | 202 acronyms |
| Network-Sims | Network+ N10-009 PBQ sims | 14 standalone HTML files, no data file | 14 sims |
| Network-Acronyms | Network+ acronyms | `data/acronyms.json`, 18 free-form categories | 135 acronyms |
| Network-quizzes | Network+ N10-009 quiz bank | `assets/questions.js`, 23-objective taxonomy, built via `tools/build-questions.mjs` | 507 questions |
| Security-Sims | Security+ SY0-701 PBQ sims | ~10 standalone HTML files, no data file | 10 sims |
| Security-Acronyms | Security+ acronyms | `data/acronyms.json`, intentional duplicate acronyms (MAC x3, PAM x2, etc.) | 334 acronyms |
| Security-Questions | Security+ SY0-701 quiz bank | `assets/questions.js`, full 28-objective SY0-701 blueprint | 773 questions (README says 514 — stale, see Known Issues) |
| CySA-Sims | CySA+ CS0-003 PBQ sims | 19 standalone HTML files, no data file | 19 sims |
| CySA-Acronyms | CySA+ acronyms | `data/acronyms.json` | 175 acronyms |
| CySA-questions | CySA+ CS0-003 quiz bank | `assets/data.js`, 4 domains / 19 sub-objectives / 362 free-text topic tags | 500 questions (master pool) + 13 legacy "Day" files in a different, likely-superseded format |
| Port-Quiz | Ports/protocols (all certs) | `data.js`, flat array | 26 ports, 6 secure-swap pairs |
| Windows-Linux-Commands | Windows/Linux/PowerShell commands | `data/acronyms.json` + duplicate `js/acronyms-data.js`, 8 categories | 82 commands |

All of these: plain static HTML/CSS/vanilla JS, no framework, no build
tooling required to serve (a couple have an *optional* Node script to
regenerate a data file offline — never required for the site to run).
GitHub Pages served from repo root on `main` in every case — no `/docs`, no
`gh-pages` branch, no GitHub Actions.

## Repos added after the initial survey

| Repo | Covers | Format | Item count |
|---|---|---|---|
| Cloud-aaS-Learning-Hub | Cloud service/deployment models (IaaS/PaaS/SaaS/On-Prem, Public/Private/Hybrid/Community, CASB/SASE/FaaS/DaaS/XaaS) — all certs | Hub + 7 standalone game pages, shared `js/data.js` + `js/common.js`, military "mission/drill" framing, elemental tile badge colors (Sun/Blue/Green/Lightning/Earth/Purple/Fire) | 13 glossary terms, 20 quiz questions, 24 blitz T/F items, 8 scenarios |
| A-Core-1-tile | Standalone Core 1 tile (see table above) | Single `index.html`, Royal Green tile, no JS | 3 links |
| A-Core-2-tile | Standalone Core 2 tile (see table above) | Single `index.html`, Royal Purple tile, no JS | 3 links |
| Network-Tile | Standalone Network+ tile (see table above) | Single `index.html`, Royal Green tile, no JS | 3 links |
| Security-Tile | Standalone Security+ tile (see table above) | Single `index.html`, Royal Yellow tile (dark text), no JS | 3 links |
| CySA-Tile | Standalone CySA+ tile (see table above) | Single `index.html`, Blood Red tile (`#8b0000`), no JS | 3 links |
| Universal-tile | Standalone Universal tile (see table above) | Single `index.html`, Royal Purple tile, no JS | 8 links (Port Quiz, Windows & Linux Commands, Patch Bay, Subnet Calculator, OSI Model Lab, IPv6 & EUI-64 Drills, CySA CVSS Center, Cloud Ops: Basic Training) |
| Subnet-Calculator-for-Network | IPv4 subnetting — calculator, reference and Class A/B/C practice drills | Single self-contained `index.html`, lifted verbatim from Patch Bay's `module--calc` | 1 module |
| OSI-Model | OSI model — encapsulation-journey diagram, seven-layer stack, searchable port table | Single self-contained `index.html`, lifted verbatim from Patch Bay's `module--ref` | 1 module |
| Face-Off-Games | Standalone Face Off Games tile (see table above) | Single `index.html`, Royal Green tile, no JS | 5 links (one live game per exam track) |
| Patch-Bay | Universal practice toolkit across A+, Network+ and Security+ — confirmed live and worked on directly in 2026-08 | Single self-contained `index.html` (~730KB), fonts and connector photos embedded as base64, no build step | 8 modules: Command Tester (dual shell + network sim), Subnet Calculator, OSI Model Lab, IPv6 & EUI-64 Drills, VLSM, IPv6 Reference & Compression, Binary/Hex, Cabling |
| CySA-CVSS-Center | CVSS vector reading plus firewall/SIEM/SOAR/EDR log correlation, kill chain and diamond model — CySA+ | Single `index.html` + three ES modules; one seeded generator builds a ground-truth incident per scenario and each tile renders a lens onto it, so every graded answer is computed from the rows actually shown | 15 generated incidents × 31 questions |
| IPv6-Drills | IPv6 addressing and EUI-64 conversion — all certs | Single self-contained `index.html`, no question bank: every problem generated at render time | 16 drills |

`Subnet-Calculator-for-Network`, `OSI-Model` and `IPv6-Drills` are Patch Bay
modules pulled out onto their own pages, for handing a class one topic without
the other seven modules around it. A change to one of these modules in Patch Bay
should be copied across, and vice versa, or the two will drift.

**They are not all byte-identical to their Patch Bay counterparts, despite an
earlier version of this file saying so.** `IPv6-Drills` is verified different:
inside Patch Bay the drill styles derive every surface from `currentColor` via
`color-mix()` so the module picks up whichever circuit tile it sits in, while
the standalone page carries explicit `--v6-*` colour tokens of its own. The
drill logic and markup match; the palette layer does not. `Subnet-Calculator-
for-Network` and `OSI-Model` have not been checked either way — verify before
assuming a copy-paste will work.

Drift already bit once: the standalone `Universal-tile` sat at 5 links while
this hub's Universal tile had 6, because `Cloud Ops: Basic Training` was added
here and not there. Both are at 8 as of 2026-08. **A link added to a tile in
this hub has to be added to that tile's standalone repo in the same sitting**,
or the "Full Tile ↗" button sends students to a shorter list than the one they
just came from.

`Cloud-aaS-Learning-Hub`'s working name during development was
"Cloud-Ops-Basic-Training" — the owner renamed it at repo-creation time; use
the GitHub name in links.

## Redirect from Cyber-Warrior-Command-Center (1.0)

The owner chose to redirect the old repo rather than leave it live
independently. `Cyber-Warrior-Command-Center`'s `index.html` should contain
only a meta-refresh + JS redirect to this repo's live URL, with a visible
fallback link (for accessibility / if JS/meta-refresh is blocked). Do not
add real content back to the 1.0 repo — if the owner wants changes, they
belong here in 2.0.

## Known content issues (found during the 2026-07 survey, not yet fixed)

- **Security-Questions**: README claims 514 questions, actual bank has 773.
  Also `100 questions Sec + v3.html` (one of its legacy source files) is an
  unfinished stub — only 6 of the claimed 100 questions were ever written; the
  rest is a code comment saying they'd be added later. Only the real 6 made it
  into the live bank, so the bank itself is fine, but the legacy file is dead
  weight / misleading if anyone edits it expecting 100 real questions.
- **CySA-Acronyms**: entry `SNI` is defined as "SMS Notification Indicator"
  with a definition describing SOAP — likely should be "Server Name
  Indication" (TLS). Needs a manual fix.
- **Network-Acronyms**: `STP` appears twice with legitimately different
  meanings (Spanning Tree Protocol vs. Shielded Twisted Pair) under different
  categories — not a bug, but any concept-map merge must disambiguate by
  category, not acronym string alone.
- **Core-1-Sims** README lists 4 sims as "not yet uploaded" that are actually
  live and linked from `index.html` — stale doc, not a missing feature.
- **CySA-questions** carries two incompatible question schemas in one repo:
  the polished `assets/data.js` pool (500 Qs) and 13 older standalone "Day"
  HTML files that appear to be superseded duplicates (proven by a `source`
  field on data.js entries naming the day files they came from). The day
  files aren't linked from the site nav and may be safe to archive.
- **A-acronym-games.** has a few unpolished placeholder-style definitions
  (e.g. `DDOS`, `VNC`) that read like unfinished template text.
- Every acronym repo (Network, Security, CySA, Windows-Linux-Commands,
  A-acronym-games.) duplicates its data in two files (`data/*.json` and
  `js/*-data.js`) that must be hand-kept in sync — a real drift risk if
  either is edited alone.
- No repo has a shared progress/account system — each site's `localStorage`
  key is independent. A hub-level "you've completed X" tracker would need its
  own storage, not a read of each site's data.

## Cross-repo taxonomy mismatch (matters for any future concept map)

Each subject area's three repos (sims / acronyms / quizzes) use **different**
topic taxonomies today:
- Quizzes repos mostly have the most rigorous taxonomy (formal exam objective
  IDs: N10-009 has 23, 220-1201 has 23, SY0-701 has 28, CS0-003 has 19 —
  Core-2-quizzes and CySA-questions also carry a finer free-text `topic`/`sub`
  tag on top of the objective ID).
- Acronym repos use free-form `category` strings (or no category at all yet —
  Security-Acronyms and A-acronym-games. explicitly have no category field,
  per their own READMEs' "future enhancements" lists).
- Sims repos generally have **no taxonomy at all** — just a title and one-line
  subtitle per simulation, hardcoded in each dashboard's `index.html`.

Building a real cross-repo concept index means reconciling these three
schemes per subject, not assuming they already line up. See `CONCEPTS.md` in
this repo for what's been started so far.
 
## Working conventions for this repo

- This repo has no assigned feature branch from the owner — work directly on
  `main` unless told otherwise.
- Commit on `main`, then hand over a zip — see "How to deliver work" at the top
  of this file. This line used to read "push changes with `git push -u origin
  main`"; that is no longer how work reaches the site, and pushing is not
  something assistant sessions have access to do.
- Don't invent new tiles or reorder the color scheme without asking — the
  owner specified it exactly (see Design spec above).
- When adding a new subject area or standalone tile, update: this hub's
  `index.html` (direct links + "Full Tile ↗" button), the standalone-tile
  table above, and `README.md`'s linked-resources list — all three, every
  time, so they never drift apart.
- When adding new cross-repo synthesis work, extend `CONCEPTS.md` rather than
  creating new top-level docs — keep this the single source of truth so a
  future session doesn't have to rediscover it.
