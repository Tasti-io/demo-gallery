#!/usr/bin/env node
/**
 * Build the gallery from demos.json.
 *
 * A generator rather than a hand-written page, because the point of this is that
 * adding the next demo is one object in a JSON file and a thumbnail, not an
 * afternoon of HTML. The list will grow; the page should not get harder to grow.
 */
import { readFileSync, writeFileSync } from "node:fs";

const demos = JSON.parse(readFileSync("demos.json", "utf8"));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const card = (d) => `
      <a class="card" href="${esc(d.url)}" target="_blank" rel="noopener">
        <div class="frame">
          <div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="addr">${esc(d.host)}</span></div>
          <div class="shot"><img src="${esc(d.shot)}" alt="" loading="lazy" width="1600" height="900"></div>
        </div>
        <div class="body">
          <div class="head">
            <h2>${esc(d.title)}</h2>
            ${d.live ? '<span class="live">live</span>' : ""}
          </div>
          <p class="blurb">${esc(d.blurb)}</p>
          <dl class="facts">
            <dt>Replaces</dt><dd>${esc(d.replaces)}</dd>
            <dt>Time</dt><dd>${esc(d.time)}</dd>
            <dt>The point</dt><dd>${esc(d.point)}</dd>
          </dl>
          <span class="go">Open the demo &rarr;</span>
        </div>
      </a>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Working demos &middot; Tasti.io</title>
<meta name="description" content="Things that run, not slides. Each one takes a job a multi-location operator does by hand and does it properly.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--ink:#1B1A18;--mid:#57534E;--faint:#8A857D;--rule:#E5E1D8;--paper:#FFF;--canvas:#F3F1EC;--teal:#0F8A7A}
  body{font-family:'DM Sans',system-ui,sans-serif;background:var(--canvas);color:var(--ink);
       padding:34px 16px 72px;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto}
  .eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;
           color:var(--teal);margin-bottom:9px}
  h1{font-family:'DM Serif Display',Georgia,serif;font-size:clamp(28px,3.8vw,42px);line-height:1.1;margin-bottom:10px}
  .sub{font-size:15.5px;line-height:24px;color:var(--mid);max-width:64ch}

  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:20px;margin-top:30px}
  .card{display:block;background:var(--paper);border:1px solid var(--rule);border-radius:12px;overflow:hidden;
        text-decoration:none;color:inherit;transition:transform .14s ease,box-shadow .14s ease,border-color .14s ease}
  .card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(27,26,24,.10);border-color:#D4CFC4}
  .card:hover .head h2{color:var(--teal)}
  .card:hover .go{text-decoration:underline;text-underline-offset:3px}
  .head h2{transition:color .14s ease}
  .card:focus-visible{outline:2px solid var(--teal);outline-offset:3px}
  /* A browser frame around a real screenshot. The alternative was generated
     artwork, which would have been prettier and would have quietly undercut the
     one claim the page makes, which is that these things actually run. */
  .frame{background:#EDEAE3;border-bottom:1px solid var(--rule);padding:0 0 0}
  .chrome{display:flex;align-items:center;gap:6px;padding:9px 12px;background:#E4E0D8}
  .chrome .dot{width:9px;height:9px;border-radius:50%;background:#CFC9BE;flex:none}
  .chrome .addr{flex:1;margin-left:6px;background:#F6F4EF;border-radius:5px;padding:3px 9px;
                font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--faint);
                white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .shot{aspect-ratio:16/9;overflow:hidden;background:var(--paper)}
  /* The pages were captured at 1920 and hold their content in a centre column,
     so a straight fit leaves the card mostly margin and the text unreadable at
     card size. Zooming into the top centre crops the empty gutters and shows the
     thing itself, which is the only reason the picture is there. */
  .shot img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block;
            transform:scale(1.42) translateY(-4%);transform-origin:top center;
            transition:transform .5s cubic-bezier(.2,.7,.3,1)}
  .card:hover .shot img{transform:scale(1.47) translateY(-4%)}
  .body{padding:17px 19px 19px}
  .head{display:flex;align-items:baseline;gap:9px;margin-bottom:7px}
  .head h2{font-family:'DM Serif Display',Georgia,serif;font-size:21px;font-weight:400}
  .live{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;
        color:var(--teal);background:#E6F4F1;padding:2px 7px;border-radius:999px}
  .blurb{font-size:14.5px;line-height:22px;color:var(--mid);margin-bottom:13px}

  .facts{display:grid;grid-template-columns:auto 1fr;gap:5px 12px;font-size:13px;line-height:19px;
         border-top:1px solid var(--rule);padding-top:12px}
  .facts dt{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.07em;text-transform:uppercase;
            color:var(--faint);padding-top:3px;white-space:nowrap}
  .facts dd{color:var(--ink)}
  .go{display:inline-block;margin-top:14px;font-size:13.5px;font-weight:500;color:var(--teal)}

  .note{margin-top:26px;background:#FAF8F3;border:1px solid var(--rule);border-radius:9px;padding:15px 18px;
        font-size:13.5px;line-height:21px;color:var(--mid)}
  .note b{color:var(--ink)}
  footer{margin-top:24px;font-size:13px;color:var(--faint);display:flex;flex-wrap:wrap;gap:6px 18px}
  footer a{color:var(--teal);text-decoration:none;font-weight:500}
  @media(max-width:620px){ .facts{grid-template-columns:1fr;gap:2px} .facts dt{padding-top:8px} }
</style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">Tasti.io</div>
  <h1>Things that run</h1>
  <p class="sub">
    Not slides. Each one takes a job that a multi-location operator currently does by hand and does it
    properly, end to end. Open any of them and use it. Nothing asks you to sign in.
  </p>

  <div class="grid">${demos.map(card).join("")}
  </div>

  <div class="note">
    <b>About the numbers.</b> They are arithmetic on stated assumptions, not results measured at a client.
    A four site group, half an hour of somebody's morning, seventy thousand dollars of purchasing a month.
    Your numbers are different, and working out which of these is actually expensive for you is the first
    thing a conversation is for.
  </div>

  <footer>
    <span>Built by Yuriy Romanyuk, Vancouver</span>
    <a href="https://www.tasti.io">tasti.io</a>
    <a href="mailto:yuriy@tasti.io">yuriy@tasti.io</a>
  </footer>
</div>
</body>
</html>`;

writeFileSync("public/index.html", html);
console.log(`built public/index.html with ${demos.length} demo(s)`);
