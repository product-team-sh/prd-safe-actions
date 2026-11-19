"""Build canvas/index.html: every PRD screenshot on one pannable, zoomable board, one row per surface.
Run from the repo root:  python3 tools/build-canvas.py"""
import html, re

PAGES = {'6.1': 'sequence-prospects', '6.2': 'sequence-list', '6.3': 'sequence-steps', '6.4': 'unified-inbox',
         '6.5': 'tasks', '6.6': 'crm-prospects', '6.7': 'csv-import', '6.8': 'email-accounts',
         '6.9': 'lead-finder', '6.10': 'settings', '6.11': 'admin-billing'}
src = open('PRD.md', encoding='utf-8').read()
title = re.search(r'^# (.+)$', src, re.M).group(1)
rows, cur = [], None
for line in src.splitlines():
    m = re.match(r'### (\d+\.\d+) (.+?)(?: \((rows? [^)]+)\))?$', line)
    if m:
        cur = {'num': m.group(1), 'name': m.group(2), 'rows': m.group(3) or '', 'shots': []}
        rows.append(cur); continue
    m = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', line)
    if m and cur is not None:
        cur['shots'].append((m.group(1), m.group(2)))
rows = [r for r in rows if r['shots']]
e = html.escape
out = []
for r in rows:
    page = PAGES.get(r['num'])
    link = f'<a class="cv-proto" href="../prototype/{page}.html" target="_blank" rel="noopener">Open in prototype</a>' if page else ''
    frames = ''.join(f'<figure class="cv-frame"><figcaption>{e(a)}</figcaption><a class="zoom" href="../{e(s)}" aria-label="View larger: {e(r["name"])}, {e(a)}"><img src="../{e(s)}" alt="{e(r["name"])}: {e(a)}" width="480" height="300" loading="lazy" draggable="false"></a></figure>' for a, s in r['shots'])
    anchor = 'surface-' + r['num'].replace('.', '-')
    out.append(f'<section class="cv-row" id="{anchor}"><header class="cv-label"><span class="cv-num">{r["num"]}</span><h2>{e(r["name"])}</h2><p>{e(r["rows"].capitalize())}</p>{link}</header><div class="cv-frames">{frames}</div></section>')
total = sum(len(r['shots']) for r in rows)
lightbox = open('tools/lightbox.html', encoding='utf-8').read()
page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Safe actions canvas</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>
:root{{--bg:#ffffff;--bg-secondary:#F9FAFB;--bg-tertiary:#F3F4F6;--border:#E5E7EB;--border-strong:#D1D5DB;
  --ink:#111827;--ink-secondary:#374151;--ink-tertiary:#6B7280;--ink-quiet:#9CA3AF;--primary:#1D4ED8;--primary-hover:#1E40AF;
  --radius-md:8px;--radius-lg:12px}}
*{{box-sizing:border-box}}
html{{color-scheme:light}}
html,body{{margin:0;height:100%;overflow:hidden}}
body{{background:var(--bg-tertiary);color:var(--ink);font:14px/20px Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}}
::selection{{background:#BFDBFE}}
a{{color:var(--primary);text-decoration:none}} a:hover{{text-decoration:underline;text-underline-offset:2px}}
.cv-top{{position:fixed;top:0;left:0;right:0;height:56px;display:flex;align-items:center;gap:16px;padding:0 16px 0 24px;background:var(--bg);border-bottom:1px solid var(--border);z-index:2}}
.cv-top h1{{margin:0;font-size:15px;line-height:20px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}}
.cv-meta{{color:var(--ink-tertiary);font-size:13px;white-space:nowrap}}
.cv-back{{font-size:13px;font-weight:500;white-space:nowrap}}
.cv-sp{{flex:1}}
.cv-tools{{display:flex;align-items:center;gap:4px;flex-shrink:0}}
.cv-btn{{height:32px;min-width:32px;padding:0 8px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg);color:var(--ink-secondary);font:500 13px/1 Inter,system-ui,sans-serif;cursor:pointer}}
.cv-btn:hover{{background:var(--bg-secondary);border-color:var(--border-strong);color:var(--ink)}}
.cv-btn:focus-visible,.zoom:focus-visible,.cv-proto:focus-visible{{outline:2px solid var(--primary);outline-offset:2px}}
.cv-btn svg{{width:16px;height:16px}}
.cv-pct{{min-width:52px;text-align:center;font-size:13px;color:var(--ink-secondary);font-variant-numeric:tabular-nums}}
.cv-vp{{position:fixed;top:56px;left:0;right:0;bottom:0;overflow:hidden;cursor:grab;touch-action:none;
  background-image:radial-gradient(circle,#D1D5DB 1px,transparent 1px);background-size:24px 24px}}
.cv-vp.drag{{cursor:grabbing}}
.cv-board{{position:absolute;top:0;left:0;transform-origin:0 0;padding:64px;display:flex;flex-direction:column;gap:56px;width:max-content}}
.cv-row{{display:flex;gap:40px;align-items:flex-start}}
.cv-label{{width:220px;flex-shrink:0;padding-top:28px}}
.cv-num{{display:block;font-size:13px;line-height:16px;font-weight:600;color:var(--ink-quiet);font-variant-numeric:tabular-nums}}
.cv-label h2{{margin:6px 0 4px;font-size:20px;line-height:26px;font-weight:600;letter-spacing:-.01em;color:var(--ink);text-wrap:balance}}
.cv-label p{{margin:0 0 12px;font-size:13px;line-height:18px;color:var(--ink-tertiary)}}
.cv-proto{{font-size:13px;font-weight:500}}
.cv-frames{{display:flex;gap:24px;align-items:flex-start}}
.cv-frame{{margin:0;width:480px}}
.cv-frame figcaption{{margin:0 0 8px;font-size:13px;line-height:18px;font-weight:500;color:var(--ink-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.cv-frame .zoom{{display:block;border-radius:var(--radius-md);cursor:zoom-in}}
.cv-frame img{{display:block;width:480px;height:300px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg);box-shadow:0 1px 2px rgba(17,24,39,.06);transition:border-color .15s ease-out,box-shadow .15s ease-out}}
.cv-frame .zoom:hover img{{border-color:#93C5FD;box-shadow:0 6px 20px rgba(17,24,39,.10)}}
.cv-vp.drag .zoom{{cursor:grabbing}}
@media (max-width:700px){{.cv-meta,.cv-back-long{{display:none}} .cv-top{{padding:0 8px 0 16px;gap:8px}} .cv-pct{{min-width:44px}}}}
@media (prefers-reduced-motion:reduce){{.cv-frame img{{transition:none}}}}
</style>
</head>
<body>
<header class="cv-top">
  <a class="cv-back" href="../index.html">&larr; <span class="cv-back-long">Back to </span>PRD</a>
  <h1>{e(title)}</h1>
  <span class="cv-meta">{total} screens, {len(rows)} surfaces</span>
  <span class="cv-sp"></span>
  <div class="cv-tools">
    <button class="cv-btn" data-z="out" aria-label="Zoom out" title="Zoom out"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
    <span class="cv-pct" aria-live="polite">100%</span>
    <button class="cv-btn" data-z="in" aria-label="Zoom in" title="Zoom in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5v14"/></svg></button>
    <button class="cv-btn" data-z="fit" title="Fit every screen in view">Fit all</button>
  </div>
</header>
<main class="cv-vp" aria-label="Canvas of every screen. Drag to move, Ctrl or Cmd and scroll to zoom, click a screen to open it">
  <div class="cv-board">
{chr(10).join(out)}
  </div>
</main>
<script>
(function () {{
  var vp = document.querySelector('.cv-vp'), board = document.querySelector('.cv-board'), pct = document.querySelector('.cv-pct');
  var s = 1, x = 0, y = 0, MIN = 0.1, MAX = 2;
  function apply() {{ board.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')'; pct.textContent = Math.round(s * 100) + '%'; }}
  function zoomAt(ns, cx, cy) {{ ns = Math.max(MIN, Math.min(MAX, ns)); x = cx - (cx - x) * ns / s; y = cy - (cy - y) * ns / s; s = ns; apply(); }}
  function fit() {{ var w = board.offsetWidth, h = board.offsetHeight, W = vp.clientWidth, H = vp.clientHeight;
    s = Math.max(MIN, Math.min(1, W / w, H / h)); x = (W - w * s) / 2; y = Math.max(0, (H - h * s) / 2); apply(); }}
  document.querySelector('.cv-tools').addEventListener('click', function (ev) {{
    var b = ev.target.closest('[data-z]'); if (!b) return; var W = vp.clientWidth / 2, H = vp.clientHeight / 2;
    if (b.dataset.z === 'fit') fit(); else zoomAt(s * (b.dataset.z === 'in' ? 1.25 : 0.8), W, H); }});
  vp.addEventListener('wheel', function (ev) {{
    ev.preventDefault(); var r = vp.getBoundingClientRect();
    if (ev.ctrlKey || ev.metaKey) zoomAt(s * Math.exp(-ev.deltaY * 0.0015), ev.clientX - r.left, ev.clientY - r.top);
    else {{ x -= ev.shiftKey ? ev.deltaY : ev.deltaX; y -= ev.shiftKey ? 0 : ev.deltaY; apply(); }}
  }}, {{ passive: false }});
  var d = null, moved = false;
  vp.addEventListener('pointerdown', function (ev) {{ if (ev.button !== 0) return; d = {{ px: ev.clientX, py: ev.clientY, x: x, y: y, id: ev.pointerId }}; moved = false; }});
  window.addEventListener('pointermove', function (ev) {{ if (!d) return; var dx = ev.clientX - d.px, dy = ev.clientY - d.py;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 4) {{ moved = true; vp.classList.add('drag'); try {{ vp.setPointerCapture(d.id); }} catch (_) {{}} }}
    if (moved) {{ x = d.x + dx; y = d.y + dy; apply(); }} }});
  window.addEventListener('pointerup', function () {{ d = null; vp.classList.remove('drag'); }});
  vp.addEventListener('click', function (ev) {{ if (moved) {{ ev.preventDefault(); ev.stopImmediatePropagation(); moved = false; }} }}, true);
  document.addEventListener('keydown', function (ev) {{ if (document.querySelector('.lb[open]')) return;
    var W = vp.clientWidth / 2, H = vp.clientHeight / 2;
    if (ev.key === '+' || ev.key === '=') zoomAt(s * 1.25, W, H); else if (ev.key === '-') zoomAt(s * 0.8, W, H); else if (ev.key === '0') fit(); }});
  function fitWidth() {{ var w = board.offsetWidth, W = vp.clientWidth; s = Math.max(MIN, Math.min(1, W / w)); x = Math.max(0, (W - w * s) / 2); y = 0; apply(); }}
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWidth); fitWidth();
}})();
</script>
{lightbox}
</body>
</html>
'''
open('canvas/index.html', 'w', encoding='utf-8').write(page)
print(f'wrote canvas/index.html: {len(rows)} surfaces, {total} screens')
