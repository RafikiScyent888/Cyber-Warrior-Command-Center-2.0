/* =====================================================================
   COMMAND CENTER — the hub, checked the way a student sees it

   1. TILES     every tile and sub-tile carries a "Full Tile" button
   2. UNDER THE HOOD
                the tile sits right after Interactive Labs; three links
                in the owner's order; Full Tile goes to its own page;
                safety orange (#ff6a00) with DARK lettering
   3. SEARCH    the search bar finds the new labs, and a nonsense query
                shows the "no resources" message
   4. CONTRAST  WCAG AAA on painted pixels (7:1 body, 4.5:1 large) over
                the whole page, on a desk and a phone, and with the
                orange tile's Full Tile pill hovered
   5. PHONE     nothing scrolls sideways at 360px
   6. PLANNER   Shane's Retake Planner button sits directly under the search
                bar, goes to the planner in a new tab, is silver-white with
                dark lettering, stays visible while a search hides tiles, and
                keeps AAA when hovered

   Run:        node verify/page.mjs
   Calibrate:  node verify/page.mjs --plant   (every plant must be caught)
   Needs Playwright and Chromium (paths below, or PW / CHROME env vars).
   ===================================================================== */
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { createServer } from "http";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PW = process.env.PW || "/opt/node22/lib/node_modules/playwright/index.mjs";
const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const UTH = [
  ["A+ Core 1 Under the Hood Labs", "https://rafikiscyent888.github.io/A-Core-1-under-the-hood-labs/"],
  ["Security Start-up Firewall", "https://rafikiscyent888.github.io/Security-Start-up-Firewall/"],
  ["Veterans Overcoming the Odds SOC", "https://rafikiscyent888.github.io/Veterans-Overcoming-Odds-SOC/"],
];
const UTH_FULL = "https://rafikiscyent888.github.io/Under-the-Hood-labs/";
const PLANNER = "https://rafikiscyent888.github.io/Shane-s-Retake-Planner-2.0/";

const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

function serve(dir, port) {
  return createServer((q, s) => {
    const p = q.url.split("?")[0];
    if (p !== "/" && p !== "/index.html") { s.writeHead(404); s.end(); return; }
    s.writeHead(200, { "content-type": "text/html" }); s.end(readFileSync(join(dir, "index.html")));
  }).listen(port);
}

/* Paint-sample every run of text: hide the glyphs, screenshot, compare each
   run's colour with the pixels actually under it. The opacity of an
   ancestor (the footer is at 0.8) is folded into the text colour, because
   that is what reaches the eye. */
async function contrast(page) {
  const runs = await page.evaluate(() => {
    const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement, cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[style*='display: none']")) continue;
      let op = 1; for (let a = el; a; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity);
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) if (r.width > 2 && r.height > 2)
        out.push({ t: n.textContent.trim().slice(0, 40), c: cs.color, op, s: parseFloat(cs.fontSize), b: parseInt(cs.fontWeight) >= 700, x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height });
    }
    return out;
  });
  await page.addStyleTag({ content: "*{color:transparent!important;text-shadow:none!important} ::placeholder{color:transparent!important}" });
  const png = (await page.screenshot({ fullPage: true })).toString("base64");
  await page.evaluate(() => [...document.querySelectorAll("style")].pop().remove());
  const grounds = await page.evaluate(async ({ png, runs }) => {
    const im = new Image(); im.src = "data:image/png;base64," + png; await im.decode();
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
    const g = c.getContext("2d"); g.drawImage(im, 0, 0);
    return runs.map(r => {
      const x0 = Math.max(0, Math.floor(r.x)), y0 = Math.max(0, Math.floor(r.y));
      const d = g.getImageData(x0, y0, Math.max(1, Math.min(Math.floor(r.w), im.width - x0)), Math.max(1, Math.min(Math.floor(r.h), im.height - y0))).data;
      const px = []; for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
      return px;
    });
  }, { png, runs });
  const bad = [];
  runs.forEach((r, i) => {
    const m = r.c.match(/\d+(\.\d+)?/g).map(Number); const a = (m.length > 3 ? m[3] : 1) * r.op;
    const need = (r.s >= 24 || (r.b && r.s >= 18.66)) ? 4.5 : 7;
    let worst = 99;
    for (const bg of grounds[i]) { const fg = [0, 1, 2].map(k => m[k] * a + bg[k] * (1 - a)); worst = Math.min(worst, ratio(fg, bg)); }
    if (worst < need) bad.push(`${worst.toFixed(2)}:1 < ${need} "${r.t}"`);
  });
  return { n: runs.length, bad };
}

async function run(dir, port) {
  const srv = serve(dir, port);
  const pw = await import(PW); const { chromium } = pw.default || pw;
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--headless=new", "--no-sandbox"] });
  const fails = []; const fail = (rule, msg) => fails.push(`${rule} — ${msg}`);
  try {
    for (const vp of [{ name: "desk", width: 1280, height: 900 }, { name: "phone", width: 360, height: 800 }]) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const errs = []; page.on("pageerror", e => errs.push(e.message));
      await page.goto(`http://127.0.0.1:${port}/`); await page.waitForTimeout(200);
      if (errs.length) fail("page", `${vp.name}: script errors: ${errs.join(" | ")}`);

      if (vp.name === "desk") {
        /* 1. every tile and sub-tile has its Full Tile button */
        const missing = await page.$$eval(".tile-header, .subtile-header", hs => hs.filter(h => !h.querySelector("a.full-tile") && !h.closest(".tile.wide") ? true : false).map(h => h.textContent.trim().slice(0, 30)));
        const wideSubs = await page.$$eval(".tile.wide .subtile-header", hs => hs.filter(h => !h.querySelector("a.full-tile")).map(h => h.textContent.trim()));
        [...missing, ...wideSubs].forEach(t => fail("tiles", `"${t}" has no Full Tile button`));

        /* 2. the Under the Hood tile */
        const order = await page.$$eval("#tile-grid > .tile .tile-header", hs => hs.map(h => (h.querySelector("span") || h).textContent.trim()));
        const i = order.indexOf("Under the Hood Labs");
        if (i < 0) fail("under the hood", "there is no Under the Hood Labs tile");
        else if (order[i - 1] !== "Interactive Labs") fail("under the hood", `the tile sits after "${order[i - 1]}", not Interactive Labs`);
        if (i >= 0) {
          const t = await page.evaluate(n => {
            const tile = document.querySelectorAll("#tile-grid > .tile")[n];
            const h = tile.querySelector(".tile-header"), cs = getComputedStyle(h);
            return { bg: cs.backgroundColor, fg: cs.color, full: tile.querySelector("a.full-tile")?.href,
              links: [...tile.querySelectorAll(".links a")].map(a => [a.textContent.trim(), a.href, a.target]) };
          }, i);
          if (t.bg !== "rgb(255, 106, 0)") fail("under the hood", `tile is ${t.bg}, expected safety orange rgb(255, 106, 0)`);
          if (lum(t.fg.match(/\d+/g).map(Number)) > 0.2) fail("under the hood", `lettering is light (${t.fg}); orange needs dark lettering`);
          if (t.full !== UTH_FULL) fail("under the hood", `Full Tile goes to ${t.full}, expected ${UTH_FULL}`);
          if (t.links.length !== 3) fail("under the hood", `${t.links.length} links, expected 3`);
          UTH.forEach(([name, href], k) => {
            const l = t.links[k]; if (!l) return;
            if (l[0] !== name) fail("under the hood", `link ${k + 1} should be "${name}", reads "${l[0]}"`);
            if (l[1] !== href) fail("under the hood", `link ${k + 1} goes to ${l[1]}, expected ${href}`);
            if (l[2] !== "_blank") fail("under the hood", `link ${k + 1} doesn't open in a new tab`);
          });
        }

        /* 3. search */
        const shown = async q => { await page.fill("#search", q); await page.waitForTimeout(80);
          return page.$$eval("#tile-grid li[data-search]:not(.hidden) a", as => as.map(a => a.textContent.trim())); };
        for (const [q, want] of [["fuser", "A+ Core 1 Under the Hood Labs"], ["firewall", "Security Start-up Firewall"], ["mttr", "Veterans Overcoming the Odds SOC"], ["under the hood", "Veterans Overcoming the Odds SOC"]]) {
          const got = await shown(q);
          if (!got.includes(want)) fail("search", `searching "${q}" doesn't find ${want}`);
        }
        await shown("zzqxv");
        if (!(await page.$eval("#empty-msg", e => e.classList.contains("show")))) fail("search", `a query that matches nothing doesn't say so`);
        const hidden = await page.evaluate(() => { const a = document.querySelector("a.planner-cta"); return !a || a.offsetParent === null; });
        if (hidden) fail("planner", "a search hides the Retake Planner button");
        await shown("");

        /* 6. Shane's Retake Planner, right under the search bar */
        const cta = await page.evaluate(() => {
          const a = document.querySelector("a.planner-cta"); if (!a) return null;
          const cs = getComputedStyle(a), prev = a.previousElementSibling;
          return { after: prev && prev.classList.contains("search-wrap") && !!prev.querySelector("#search"), href: a.href, target: a.target,
            text: a.textContent.replace(/\s+/g, " ").trim(), bg: cs.backgroundColor, fg: cs.color };
        });
        if (!cta) fail("planner", "there is no Retake Planner button");
        else {
          if (!cta.after) fail("planner", "the button is not directly under the search bar");
          if (cta.href !== PLANNER) fail("planner", `the button goes to ${cta.href}, expected ${PLANNER}`);
          if (cta.target !== "_blank") fail("planner", "the button doesn't open in a new tab");
          if (!cta.text.includes("Shane\u2019s Retake Planner")) fail("planner", `the button reads "${cta.text.slice(0, 60)}"`);
          if (cta.bg !== "rgb(245, 247, 255)") fail("planner", `the button is ${cta.bg}, expected silver-white rgb(245, 247, 255)`);
          if (lum(cta.fg.match(/\d+/g).map(Number)) > 0.2) fail("planner", `lettering is light (${cta.fg}); silver-white needs dark lettering`);
        }
      }

      /* the search hint is text a student reads, so it is held to 7:1 too.
         The sweep above hides placeholders, so this measures it on its own. */
      if (vp.name === "desk") {
        const ph = await page.$eval("#search", e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e, "::placeholder").color; return { x: r.x + 20, y: Math.round(r.y + r.height / 2), c }; });
        await page.addStyleTag({ content: "#search::placeholder{color:transparent!important}" });
        const shot = (await page.screenshot()).toString("base64");
        await page.evaluate(() => [...document.querySelectorAll("style")].pop().remove());
        const bg = await page.evaluate(async ({ shot, ph }) => { const im = new Image(); im.src = "data:image/png;base64," + shot; await im.decode(); const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d"); g.drawImage(im, 0, 0); return [...g.getImageData(ph.x, ph.y, 1, 1).data].slice(0, 3); }, { shot, ph });
        const m = ph.c.match(/\d+(\.\d+)?/g).map(Number); const al = m.length > 3 ? m[3] : 1;
        const fg = [0, 1, 2].map(k => m[k] * al + bg[k] * (1 - al)); const r = ratio(fg, bg);
        if (r < 7) fail("contrast", `the search box hint is ${r.toFixed(2)}:1, under 7:1`);
      }

      /* 5. phone: no sideways scroll */
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail("phone", `${vp.name}: the page scrolls sideways`);

      /* 4. contrast at rest, then with the orange tile's pill hovered */
      const rest = await contrast(page);
      rest.bad.forEach(b => fail("contrast", `${vp.name}, at rest: ${b}`));
      if (rest.n < 60) fail("contrast", `${vp.name}: only ${rest.n} text runs measured — the sweep is not seeing the page`);
      const pill = await page.$(`a.full-tile[href="${UTH_FULL}"]`);
      if (pill) { await pill.hover(); await page.waitForTimeout(150);
        const hov = await contrast(page); hov.bad.forEach(b => fail("contrast", `${vp.name}, Under the Hood pill hovered: ${b}`)); }
      const ctaEl = await page.$("a.planner-cta");
      if (ctaEl) { await ctaEl.hover(); await page.waitForTimeout(250);
        const hov = await contrast(page); hov.bad.forEach(b => fail("contrast", `${vp.name}, Retake Planner button hovered: ${b}`)); }
      await page.close();
    }
  } catch (e) { fail("run", "stopped early: " + String(e.message).split("\n")[0]); }
  finally { await browser.close(); srv.close(); }
  return fails;
}

const ORANGE_TILE = '<section class="tile" style="--tile-color: var(--royal-orange); --tile-text: var(--text-dark); --full-tile-scrim: rgba(255,255,255,0.45); --full-tile-scrim-hover: rgba(255,255,255,0.6);">';
const PLANTS = {
  whiteonorange: { catches: "under the hood", fn: s => s.replace(ORANGE_TILE, '<section class="tile" style="--tile-color: var(--royal-orange);">') },
  darkscrim: { catches: "contrast", fn: s => s.replace(ORANGE_TILE, '<section class="tile" style="--tile-color: var(--royal-orange); --tile-text: var(--text-dark); --full-tile-scrim: rgba(6,12,34,0.45); --full-tile-scrim-hover: rgba(6,12,34,0.6);">') },
  swapped: { catches: "under the hood", fn: s => s.replace(">Security Start-up Firewall</a>", ">TMP</a>").replace(">Veterans Overcoming the Odds SOC</a>", ">Security Start-up Firewall</a>").replace(">TMP</a>", ">Veterans Overcoming the Odds SOC</a>") },
  nofulltile: { catches: "tiles", fn: s => s.replace('<a class="full-tile" href="https://rafikiscyent888.github.io/Face-Off-Games/" target="_blank" rel="noopener">Full Tile ↗</a>', "") },
  nosearchwords: { catches: "search", fn: s => s.replace("printer laser inkjet thermal impact fuser", "printer laser inkjet thermal impact") },
  dimlinks: { catches: "contrast", fn: s => s.replace("    background: rgba(10,20,52,0.35);\n    color: var(--text-light);", "    background: rgba(10,20,52,0.35);\n    color: #9aa3c7;") },
  dimhint: { catches: "contrast", fn: s => s.replace("#search::placeholder { color: rgba(245,247,255,0.88); }", "#search::placeholder { color: rgba(245,247,255,0.6); }") },
  noplanner: { catches: "planner", fn: s => s.replace(/  <a class="planner-cta"[\s\S]*?<\/a>\n/, "") },
  plannermoved: { catches: "planner", fn: s => s.replace('  <div class="search-wrap">', '  <p class="tagline">Start here.</p>\n  <div class="search-wrap">').replace(/(  <\/div>\n)(  <a class="planner-cta")/, "$1  <p>Or pick a tile.</p>\n$2") },
  plannerurl: { catches: "planner", fn: s => s.replace('href="https://rafikiscyent888.github.io/Shane-s-Retake-Planner-2.0/"', 'href="https://rafikiscyent888.github.io/Retake-Planner/"') },
  plannerdim: { catches: "contrast", fn: s => s.replace("    background: var(--text-light);\n    color: var(--royal-blue-deep);", "    background: var(--text-light);\n    color: #7b86b8;") },
  plannergold: { catches: "planner", fn: s => s.replace("    background: var(--text-light);\n    color: var(--royal-blue-deep);", "    background: var(--royal-yellow);\n    color: var(--royal-blue-deep);") },
  sideways: { catches: "phone", fn: s => s.replace("  .tile.wide { grid-column: 1 / -1; }", "  .tile.wide { grid-column: 1 / -1; min-width: 700px; }") },
};

if (process.argv.includes("--plant")) {
  let all = true, port = 8961;
  for (const [name, p] of Object.entries(PLANTS)) {
    const dir = mkdtempSync(join(tmpdir(), "cwcc-")); cpSync(join(ROOT, "index.html"), join(dir, "index.html"));
    const src = readFileSync(join(dir, "index.html"), "utf8"); const out = p.fn(src);
    if (out === src) { console.log(`  MISSED  ${name.padEnd(14)} (the plant did not apply — it tests nothing)`); all = false; continue; }
    writeFileSync(join(dir, "index.html"), out);
    const fails = await run(dir, port++);
    const caught = fails.some(f => f.startsWith(p.catches + " —"));
    console.log(`  ${caught ? "caught " : "MISSED "} ${name.padEnd(14)} (expected a "${p.catches}" failure)`);
    if (!caught) { all = false; console.log("      got: " + (fails.slice(0, 2).join(" | ") || "nothing")); }
  }
  console.log(all ? `\nall ${Object.keys(PLANTS).length} plants caught.` : "\nA PLANT WAS MISSED.");
  process.exit(all ? 0 : 1);
} else {
  const fails = await run(ROOT, 8960);
  if (fails.length) { console.log("FAILURES:\n  " + fails.join("\n  ")); process.exit(1); }
  console.log("Command Center: every tile has its Full Tile button; Under the Hood Labs sits after Interactive Labs, safety orange with dark lettering, three links in order; search finds them; AAA on painted pixels on a desk and a phone, at rest and with the orange pill hovered; no sideways scroll; Shane's Retake Planner button right under the search bar, silver-white, visible during a search, AAA when hovered.");
}
