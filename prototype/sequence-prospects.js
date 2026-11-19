/* Sequence > Prospects: safe actions prototype (spec rows 1 to 4).
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3;
   new elements carry .nx-new. URL params: ?size=7|2340|31200 &view=proposed|today &fin=circle-check|play-track-next|check-r
   &result=ok|fail &state=<screenshot state> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, icon, esc } = NX;
  const SEQ = 'SaaS founders, Oct';
  const QSEQ = `“${SEQ}”`;
  const PAGE = 25;
  const CAP = 25000;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/';
  const HDR = C + 'src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/contact-list-content/components/contact-list-header/contact-list-header.tsx';
  const CNT = C + 'src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/contact-list-content/contact-list-content.tsx';
  const BAN = C + 'src/components/prospect/helpers/prospect-selected-row-info-banner.tsx';
  const V3 = 'https://github.com/saleshandy/saleshandy-app/blob/b39fe379e855573b193ad996f44ecd8eceb8c595/src/features/sequences/components/ProspectsBulkActionBar/';

  /* ───────── scenario ───────── */
  const S = {
    size: ['7', '2340', '31200'].includes(param('size')) ? param('size') : '7',
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    tab: 'total',
    page: 0,
    sel: new Set(),
    all: false,
    desel: new Set(),
  };

  /* ───────── data ───────── */
  const FIRST = ['Priya', 'Marcus', 'Elena', 'Tom', 'Aisha', 'Daniel', 'Sofia', 'Liam', 'Mei', 'Arjun', 'Hannah', 'Kofi', 'Lucia', 'Noah', 'Zara', 'Ethan', 'Ines', 'Ravi', 'Chloe', 'Mateo', 'Yuki', 'Owen', 'Leila', 'Samir', 'Grace', 'Felix', 'Nadia', 'Jonas', 'Amara', 'Diego', 'Freya', 'Hugo', 'Anika', 'Theo', 'Rosa', 'Kian', 'Maya', 'Omar', 'Clara', 'Ivan'];
  const LAST = ['Raman', 'Hale', 'Duarte', 'Becker', 'Khan', 'Osei', 'Marin', 'Novak', 'Chen', 'Mehta', 'Lindqvist', 'Mensah', 'Ferreira', 'Brooks', 'Haddad', 'Walsh', 'Moreau', 'Iyer', 'Dubois', 'Silva', 'Tanaka', 'Reilly', 'Farah', 'Aziz', 'Park', 'Weber', 'Petrova', 'Berg', 'Okafor', 'Ruiz', 'Nilsen', 'Laurent', 'Kapoor', 'Fischer', 'Romano', 'Ahmadi', 'Cohen', 'Saleh', 'Vogel', 'Petrov'];
  const COMP = ['ledgerloop.io', 'shipyardhq.com', 'quillstack.com', 'fieldnote.app', 'northbeam.dev', 'tallyroute.com', 'brightforge.co', 'cartwheel.ai', 'opslane.io', 'pagefold.com', 'relaypoint.co', 'stackmint.io', 'brickyard.dev', 'loomstate.com', 'harborly.io', 'trellisapp.com', 'gridwise.co', 'patchwork.so', 'kilnhq.com', 'meridianops.com'];
  const TAGS = [[], ['Q4'], ['SaaS'], ['Q4', 'Founder'], ['Webinar'], [], ['Founder', 'Q4', 'Webinar']];
  const AGO = ['12 minutes ago', '38 minutes ago', '1 hour ago', '3 hours ago', '5 hours ago', 'Yesterday', '2 days ago', '3 days ago', '5 days ago', '1 week ago'];

  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }

  const SEVEN = [
    ['Priya', 'Raman', 'ledgerloop.io', 'active', 3, { soon: true }],
    ['Marcus', 'Hale', 'shipyardhq.com', 'active', 2, { other: true }],
    ['Elena', 'Duarte', 'quillstack.com', 'replied', 3, {}],
    ['Tom', 'Becker', 'fieldnote.app', 'active', 1, {}],
    ['Aisha', 'Khan', 'northbeam.dev', 'paused', 2, { today: true, other: true }],
    ['Daniel', 'Osei', 'tallyroute.com', 'replied', 4, { other: true }],
    ['Sofia', 'Marin', 'brightforge.co', 'active', 2, {}],
  ];

  function build(size) {
    const mk = (i, first, last, dom, status, step, f) => ({
      id: i + 1, first, last, email: `${first.toLowerCase()}@${dom}`, status, step,
      soon: !!f.soon, sendToday: !!f.today, other: !!f.other,
      tags: TAGS[i % TAGS.length], ago: AGO[(i * 7) % AGO.length],
      outcome: status === 'replied' ? (i % 2 === 0 ? 'Interested' : 'Meeting booked') : null,
      opened: status !== 'active' || step > 1 || i % 2 === 0, clicked: i % 5 === 0,
    });
    if (size === '7') return SEVEN.map((r, i) => mk(i, r[0], r[1], r[2], r[3], r[4], r[5]));
    const n = Number(size);
    const mix = n === 2340 ? { active: 1906, replied: 312, paused: 122, soon: 214, today: 48, other: 486 }
      : { active: 25410, replied: 4160, paused: 1630, soon: 2850, today: 640, other: 6510 };
    const st = [].concat(Array(mix.active).fill('active'), Array(mix.replied).fill('replied'), Array(mix.paused).fill('paused'));
    const r = rng(42);
    for (let i = st.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [st[i], st[j]] = [st[j], st[i]]; }
    let soon = mix.soon, today = mix.today, other = mix.other;
    const out = st.map((s, i) => {
      const first = FIRST[(i * 7 + 3) % FIRST.length], last = LAST[(i * 11 + 5) % LAST.length];
      const dom = COMP[(i * 13) % COMP.length];
      const f = {};
      if (s === 'active' && soon > 0 && i % 9 === 0) { f.soon = true; soon--; }
      if (s === 'paused' && today > 0 && i % 2 === 0) { f.today = true; today--; }
      if (other > 0 && i % 5 === 1) { f.other = true; other--; }
      const p = mk(i, first, last, dom, s, 1 + (i % 4), f);
      p.opened = s !== 'active' ? i % 4 !== 0 : (p.step > 1 && i % 5 < 3);
      p.clicked = p.opened && i % 7 === 0;
      p.email = `${first.toLowerCase()}.${last.toLowerCase()}${i > 40 ? i : ''}@${dom}`;
      return p;
    });
    // top up exact counts the modulo pass missed
    for (const p of out) { if (soon <= 0) break; if (p.status === 'active' && !p.soon) { p.soon = true; soon--; } }
    for (const p of out) { if (today <= 0) break; if (p.status === 'paused' && !p.sendToday) { p.sendToday = true; today--; } }
    for (const p of out) { if (other <= 0) break; if (!p.other) { p.other = true; other--; } }
    return out;
  }

  let DATA = build(S.size);
  const hidden = new Set(); // removed, still inside the 10-second undo window

  const inSeq = () => DATA.filter((p) => !hidden.has(p.id));
  const TABS = window.SP_TABS; // defined in markup section below
  const tabFilter = (p) => (TABS.find((t) => t.key === S.tab) || TABS[0]).match(p);
  const visible = () => inSeq().filter(tabFilter);
  const filtered = () => S.tab !== 'total';

  function selectedList() {
    if (S.all) return visible().filter((p) => !S.desel.has(p.id)).slice(0, CAP);
    return inSeq().filter((p) => S.sel.has(p.id));
  }
  function selCount() {
    if (S.all) return Math.min(CAP, visible().length - S.desel.size);
    return S.sel.size;
  }
  function stats(list) {
    const s = { n: list.length, active: 0, soon: 0, replied: 0, paused: 0, finished: 0, unsubscribed: 0, today: 0, other: 0 };
    list.forEach((p) => { s[p.status]++; if (p.status === 'active' && p.soon) s.soon++; if (p.status === 'paused' && p.sendToday) s.today++; if (p.other) s.other++; });
    return s;
  }
  function clearSel() { S.sel.clear(); S.all = false; S.desel.clear(); }

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'sequences',
    headerHTML: window.SP_HEADER(SEQ),
    controls: [
      { key: 'size', label: 'Prospects', value: S.size, options: [['7', '7'], ['2340', '2,340'], ['31200', '31,200 (over cap)']], onChange: (v) => { S.size = v; DATA = build(v); hidden.clear(); clearSel(); S.page = 0; S.tab = 'total'; render(); } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Bulk bar is icon-only with tooltips; each confirmation is short: action name, one sentence, a skipped-prospects line only when some selected prospects will be skipped, and a grey "This can\'t be undone" note row only for Unsubscribe and Mark as finished. No counts, no typing. Direction D, 19 Nov 2026.',
      rows: [
        { n: 1, surface: 'Sequence > Prospects', action: 'Remove from sequence, Unsubscribe', patterns: 'Red icon and button', breakdown: 'None. Remove: "Selected prospects stop getting emails from this sequence and their progress is deleted.", plus "This leaves the sequence empty." when every prospect is selected. Unsubscribe: "Selected prospects will not get emails from any sequence again.", "Prospects who are already unsubscribed will be skipped." (only when it applies), note: "This can\'t be undone. To email them again, remove them from the sequence and add them again."', undo: 'Remove: 10 seconds. Unsubscribe: none, it cannot be reversed',
          code: [{ label: 'contact-list-header.tsx L119-152', url: HDR + '#L119-L152' }, { label: 'contact-list-content.tsx L542-608', url: CNT + '#L542-L608' }], v3: '' },
        { n: 2, surface: 'Sequence > Prospects', action: 'Mark as replied, Mark as finished, Resume, Pause', patterns: 'Blue icon and button', breakdown: 'None. Replied: "The sequence stops for selected prospects.", skipped line "Prospects who are already marked as replied will be skipped." Finished: same body, "Prospects who are already finished will be skipped.", note: "This can\'t be undone. To bring them back, remove them from the sequence and add them again." Resume: "Selected prospects continue from their current step.", skip "not paused". Pause: "Emails to selected prospects stop until the pause ends or you resume them.", skip "not in progress".', undo: 'Replied: 10 seconds. Finished, Resume, Pause: none',
          code: [{ label: 'contact-list-header.tsx L131-185', url: HDR + '#L131-L185' }, { label: 'contact-list-content.tsx L586-647 (pause keeps its duration picker)', url: CNT + '#L586-L647' }], v3: '' },
      ],
      notes: [
        'Add to sequence and Tags have no confirmation.',
        'Disabled icons keep their reason in the tooltip.',
      ],
    },
  });
  const root = h('<div id="sp-root"></div>');
  shell.body.appendChild(root);

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu();
    const list = visible();
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    if (S.page >= pages) S.page = pages - 1;
    const pageRows = list.slice(S.page * PAGE, S.page * PAGE + PAGE);
    const isSel = (p) => (S.all ? !S.desel.has(p.id) : S.sel.has(p.id));
    root.innerHTML = window.SP_PAGE({
      seq: SEQ, view: S.view, tabs: TABS.map((t) => ({ ...t, count: inSeq().filter(t.match).length, on: t.key === S.tab })),
      rows: pageRows, isSel, total: list.length, page: S.page, pages, pageSize: PAGE, totalInSeq: inSeq().length, anySelected: selCount() > 0,
    });
    // bulk bar
    const barHost = root.querySelector('[data-sp="bulk"]');
    if (barHost) barHost.appendChild(S.view === 'today' ? todayBar() : proposedBar());
    // banner
    const n = selCount();
    const ban = nxSelectionBanner({
      count: n, total: list.length, pageRows: pageRows.length, allSelected: S.all, filtered: filtered(), cap: CAP,
      mode: S.view === 'today' ? 'today' : 'proposed',
      filteredScope: TABS.find((t) => t.key === S.tab).scope || 'matching your filters',
      onSelectAll: () => { S.all = true; S.desel.clear(); S.sel.clear(); render(); },
      onClear: () => { clearSel(); render(); },
    });
    const bh = root.querySelector('[data-sp="banner"]');
    if (bh) { if (ban) bh.appendChild(ban); else if (S.view === 'today') bh.remove(); else bh.appendChild(NX.bannerPlaceholder()); }
    wireTable(pageRows, isSel);
    placeInk();
    NX.settle(root);
  }

  function wireTable(pageRows, isSel) {
    const head = root.querySelector('[data-sp="check-all"]');
    if (head) {
      const selOnPage = pageRows.filter(isSel).length;
      head.indeterminate = selOnPage > 0 && selOnPage < pageRows.length;
      head.addEventListener('change', () => {
        const on = head.checked;
        pageRows.forEach((p) => {
          if (S.all) { on ? S.desel.delete(p.id) : S.desel.add(p.id); }
          else { on ? S.sel.add(p.id) : S.sel.delete(p.id); }
        });
        if (S.all && S.desel.size >= visible().length) clearSel();
        render();
      });
    }
    root.querySelectorAll('[data-sp-row]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-sp-row'));
      if (S.all) { cb.checked ? S.desel.delete(id) : S.desel.add(id); if (S.desel.size >= visible().length) clearSel(); }
      else cb.checked ? S.sel.add(id) : S.sel.delete(id);
      render();
    }));
    root.querySelectorAll('[data-sp-tab]').forEach((t) => t.addEventListener('click', () => { S.tab = t.getAttribute('data-sp-tab'); S.page = 0; clearSel(); render(); }));
    root.querySelectorAll('[data-sp-page]').forEach((b) => b.addEventListener('click', () => {
      if (b.disabled || b.classList.contains('disabled')) return;
      const v = b.getAttribute('data-sp-page');
      S.page = v === 'prev' ? S.page - 1 : v === 'next' ? S.page + 1 : Number(v);
      render();
    }));
    root.querySelectorAll('[data-sp-noop]').forEach((b) => b.addEventListener('click', () => nxToast({ message: 'Not part of this prototype' })));
  }

  function placeInk() {
    const tab = root.querySelector('.bs-tabs-tab-active');
    const ink = root.querySelector('[data-sp="ink"]');
    if (!tab || !ink) return;
    ink.style.left = tab.offsetLeft + 'px';
    ink.style.width = tab.offsetWidth + 'px';
  }
  // production sizes the title input to its text (sequence-single-title.tsx)
  function sizeTitle() {
    const span = shell.header.querySelector('.hidden-span');
    const inp = shell.header.querySelector('.sequence-name--input');
    if (!span || !inp) return;
    const cs = getComputedStyle(inp);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    inp.style.width = Math.ceil(ctx.measureText(inp.value).width + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) * 2 + 2) + 'px';
  }
  sizeTitle();
  document.fonts && document.fonts.ready.then(() => { sizeTitle(); placeInk(); });
  window.addEventListener('resize', placeInk);

  /* ───────── proposed bar: icon-only (meeting 19 Nov 2026) ───────── */
  // Production's BulkAction IconButton (contact-list-header.tsx): ghost 32px, 20px glyph. Danger red only on the last two.
  const FIN = ['circle-check', 'play-track-next', 'check-r'].includes(param('fin')) ? param('fin') : 'circle-check';
  const GLYPH = { add: 'send', tags: 'tag', pause: 'pause-circle', resume: 'right-arrow', replied: 'round-corner-arrow-back', finished: FIN, unsubscribe: 'unavailable', remove: 'trash' };
  function barModel() {
    const sel = selectedList();
    const s = stats(sel);
    const all = (k) => s[k] === s.n;
    const none = sel.length === 0;
    const why = 'Select prospects first';
    const off = (cond, reason) => (none ? why : cond ? reason : null);
    return [
      { id: 'tags', name: 'Tags', off: off(false), on: () => nxToast({ message: 'Not part of this prototype' }) },
      { div: true },
      { id: 'add', name: 'Add to sequence', off: off(false), on: () => nxToast({ message: 'Not part of this prototype' }) },
      { id: 'pause', name: 'Pause', off: off(s.active === 0, 'None of the selected prospects are in progress'), on: () => openAction('pause') },
      { id: 'resume', name: 'Resume', off: off(s.paused === 0, 'None of the selected prospects are paused'), on: () => openAction('resume') },
      { div: true },
      { id: 'replied', name: 'Mark as replied', off: off(all('replied'), 'All selected prospects already replied'), on: () => openAction('replied') },
      { id: 'finished', name: 'Mark as finished', off: off(all('finished'), 'All selected prospects are already finished'), on: () => openAction('finished') },
      { div: true },
      { id: 'unsubscribe', name: 'Unsubscribe', danger: true, off: off(all('unsubscribed'), 'All selected prospects are already unsubscribed'), on: () => openAction('unsubscribe') },
      { id: 'remove', name: 'Remove from sequence', danger: true, off: off(false), on: () => openAction('remove') },
    ];
  }
  function proposedBar() {
    const bar = h('<div class="sp-bar nx-new" role="toolbar" aria-label="Bulk actions"></div>');
    barModel().forEach((a) => {
      if (a.div) { bar.appendChild(h('<span class="divider-vertical sp-div" aria-hidden="true"></span>')); return; }
      const tip = a.off ? `${a.name}: ${a.off}` : a.name;
      const b = h(`<button type="button" data-id="${a.id}" class="btn-icon-md bulk-action-icon-button btn-ghost btn-ghost-default btn-ghost-md${a.danger ? ' sp-danger' : ''}${a.off ? ' disabled' : ''}" aria-label="${esc(a.name)}" aria-disabled="${a.off ? 'true' : 'false'}" data-nx-tip="${esc(tip)}"><span><i class="sh-${GLYPH[a.id]}"></i></span></button>`);
      b.addEventListener('click', () => { if (!a.off) a.on(); });
      bar.appendChild(b);
    });
    return bar;
  }

  /* ───────── dialogs: short, like Tasks' bulk Snooze ───────── */
  const nP = (n) => `${fmt(n)} ${plural(n, 'prospect', 'prospects')}`;
  // One shell for every action: own icon, name as title, one or two sentences, optional exclusions line.
  function shortDialog(o) {
    const wrap = h('<div class="nx-impact nx-new"></div>');
    wrap.appendChild(h(`<p class="nx-consequence">${o.body}</p>`));
    if (o.excl) wrap.appendChild(h(`<p class="nx-note">${o.excl}</p>`));
    let extraEl = null;
    if (o.extra) { extraEl = h('<div class="nx-extra"></div>'); o.extra.render(extraEl); wrap.appendChild(extraEl); }
    if (o.cant) wrap.appendChild(h(`<div class="nx-qnote nx-new"><i class="sh-info" aria-hidden="true"></i><span><b>This can't be undone.</b> ${o.cant}</span></div>`));
    const ctrl = nxDialog({
      title: o.name, tone: o.danger ? 'danger' : 'primary', icon: NX.IMG('info-circle-blue.svg'), body: wrap, primaryLabel: o.primaryLabel,
      typeToConfirm: false,
      onPrimary(c) {
        c.setError(null); c.setBusy(true);
        setTimeout(() => {
          if (!c.el.isConnected) return;
          if (S.result === 'fail') {
            c.setBusy(false);
            c.setError(`<b>${o.failTitle}</b>Refresh the page.`);
            c.primaryBtn.focus();
            return;
          }
          c.close('done');
          o.onConfirm && o.onConfirm(o.extra ? o.extra.value() : undefined);
        }, window.SP_SD != null ? window.SP_SD : 900);
      },
    });
    const img = ctrl.el.querySelector('.confirmation-modal-v3--title img');
    ctrl.el.querySelector('.modal').classList.add('nx-dD');
    if (img) img.replaceWith(h(`<i class="sh-${o.glyph} sp-title-glyph${o.danger ? ' sp-red' : ''}" aria-hidden="true"></i>`));
    return ctrl;
  }

  function changeStatus(list, to, toast, undo) {
    const prev = list.map((p) => [p, p.status]);
    list.forEach((p) => { p.status = to; });
    clearSel(); render();
    if (!undo) { nxToast({ message: toast.message }); return; }
    nxUndoToast({
      message: toast.message, undoneMessage: toast.undone,
      onUndo: () => { prev.forEach(([p, st]) => { p.status = st; }); clearSel(); render(); },
      onCommit: () => {},
    });
  }

  function pauseExtra() {
    // Today's PauseProspectModal duration picker, kept (window.SP_PAUSE_PICKER renders production markup)
    let days = 14;
    const ex = {
      ctrl: null,
      render(el) { window.SP_PAUSE_PICKER(el, (d, ok) => { days = d; if (ex.ctrl) ex.ctrl.setPrimary({ disabled: !ok }); }, days); },
      value() { return days; },
    };
    return ex;
  }

  function openAction(id) {
    const sel = selectedList();
    const skip = (n, who) => (n > 0 ? `Prospects who are ${who} will be skipped.` : null);
    const fail = (verb) => `We couldn't ${verb} these prospects because the sequence was deleted.`;
    if (id === 'remove') {
      const list = sel; const N = list.length;
      const every = N >= inSeq().length;
      return shortDialog({
        name: 'Remove from sequence', glyph: GLYPH.remove, danger: true, primaryLabel: 'Remove',
        body: 'Selected prospects stop getting emails from this sequence and their progress is deleted.' + (every ? ' This leaves the sequence empty.' : ''),
        failTitle: fail('remove'),
        onConfirm: () => {
          const ids = list.map((p) => p.id);
          ids.forEach((i) => hidden.add(i));
          clearSel(); render();
          nxUndoToast({
            message: `Removed ${nP(N)} from ${QSEQ}`, undoneMessage: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} back`,
            onUndo: () => { ids.forEach((i) => hidden.delete(i)); clearSel(); render(); },
            onCommit: () => { const set = new Set(ids); DATA = DATA.filter((p) => !set.has(p.id)); ids.forEach((i) => hidden.delete(i)); render(); },
          });
        },
      });
    }
    if (id === 'unsubscribe') {
      const list = sel.filter((p) => p.status !== 'unsubscribed'); const N = list.length;
      return shortDialog({
        name: 'Unsubscribe', glyph: GLYPH.unsubscribe, danger: true, primaryLabel: 'Unsubscribe',
        body: 'Selected prospects will not get emails from any sequence again.',
        excl: skip(sel.length - N, 'already unsubscribed'), cant: 'To email them again, remove them from the sequence and add them again.', failTitle: fail('unsubscribe'),
        onConfirm: () => changeStatus(list, 'unsubscribed', { message: `Unsubscribed ${nP(N)}` }, false),
      });
    }
    if (id === 'replied') {
      const list = sel.filter((p) => p.status !== 'replied'); const N = list.length;
      return shortDialog({
        name: 'Mark as replied', glyph: GLYPH.replied, primaryLabel: 'Mark as replied',
        body: 'The sequence stops for selected prospects.',
        excl: skip(sel.length - N, 'already marked as replied'), failTitle: fail('mark as replied'),
        onConfirm: () => changeStatus(list, 'replied', { message: `Marked ${nP(N)} as replied`, undone: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} back to ${N === 1 ? 'its' : 'their'} earlier status` }, true),
      });
    }
    if (id === 'finished') {
      const list = sel.filter((p) => p.status !== 'finished'); const N = list.length;
      return shortDialog({
        name: 'Mark as finished', glyph: GLYPH.finished, primaryLabel: 'Mark as finished',
        body: 'The sequence stops for selected prospects.',
        excl: skip(sel.length - N, 'already finished'), cant: 'To bring them back, remove them from the sequence and add them again.', failTitle: fail('mark as finished'),
        onConfirm: () => changeStatus(list, 'finished', { message: `Marked ${nP(N)} as finished` }, false),
      });
    }
    if (id === 'resume') {
      const list = sel.filter((p) => p.status === 'paused'); const N = list.length;
      return shortDialog({
        name: 'Resume', glyph: GLYPH.resume, primaryLabel: 'Resume',
        body: 'Selected prospects continue from their current step.',
        excl: skip(sel.length - N, 'not paused'), failTitle: fail('resume'),
        onConfirm: () => changeStatus(list, 'active', { message: `Resumed ${nP(N)}` }, false),
      });
    }
    if (id === 'pause') {
      const list = sel.filter((p) => p.status === 'active'); const N = list.length;
      const ex = pauseExtra();
      const dlg = shortDialog({
        name: 'Pause', glyph: GLYPH.pause, primaryLabel: 'Pause', extra: ex,
        body: 'Emails to selected prospects stop until the pause ends or you resume them.',
        excl: skip(sel.length - N, 'not in progress'), failTitle: fail('pause'),
        onConfirm: (days) => changeStatus(list, 'paused', { message: days ? `Paused ${nP(N)} for ${days} ${plural(days, 'day', 'days')}` : `Paused ${nP(N)} until you resume them` }, false),
      });
      ex.ctrl = dlg;
      return dlg;
    }
    return null;
  }

  /* ───────── today's bar (production as it is) ───────── */
  function todayBar() {
    const wrap = document.createDocumentFragment();
    const n = selCount();
    const need = (fn) => () => { if (!n) { nxToast({ message: 'Please select at least one prospect.', variant: 'error' }); return; } fn(); };
    const list = () => selectedList();
    const today = (to, msg) => () => { const l = list(); l.forEach((p) => { p.status = to; }); clearSel(); render(); nxToast({ message: msg }); };
    const items = [
      ['send', 'Add to Sequence', () => nxToast({ message: 'Not part of this prototype' })],
      ['tag', 'Tags', () => nxToast({ message: 'Not part of this prototype' })],
      ['close', 'Remove From Sequence', () => { const l = list(); l.forEach((p) => hidden.add(p.id)); const ids = l.map((p) => p.id); DATA = DATA.filter((p) => !ids.includes(p.id)); ids.forEach((id) => hidden.delete(id)); clearSel(); render(); nxToast({ message: 'Prospects removed from the sequence.' }); }],
      ['round-corner-arrow-back', 'Mark as Replied', today('replied', 'Prospects marked as replied.')],
      ['unavailable', 'Mark as Unsubscribe', today('unsubscribed', 'Prospects marked as unsubscribed.')],
      ['flag', 'Mark as finished', today('finished', 'Prospects marked as finished.')],
      ['pause-circle', 'Mark as Paused', () => window.SP_TODAY_PAUSE((days) => { list().filter((p) => p.status === 'active').forEach((p) => { p.status = 'paused'; }); clearSel(); render(); nxToast({ message: 'Prospects paused.' }); })],
      ['right-arrow', 'Mark as Resume', () => window.SP_TODAY_RESUME(() => { list().filter((p) => p.status === 'paused').forEach((p) => { p.status = 'active'; }); clearSel(); render(); nxToast({ message: 'Prospects resumed.' }); })],
    ];
    items.forEach(([ic, tip, fn]) => {
      // contact-list-header.tsx BulkAction IconButton; the tag control is renderTagIcon's .tag-button-container
      const b = ic === 'tag'
        ? h(`<div class="tag-button-container" role="button" tabindex="0" aria-label="Tags" data-nx-tip="Tags"><div class="tag-icon d-flex align-items-center justify-content-center ">${window.SP_TAG_ICON}</div></div>`)
        : h(`<button icon="${ic}" type="button" class="btn-icon-md bulk-action-icon-button btn-ghost btn-ghost-default btn-ghost-md" aria-label="${tip}" data-nx-tip="${tip}"><span><i class="sh-${ic}"></i></span></button>`);
      b.addEventListener('click', ic === 'tag' || ic === 'send' ? fn : need(fn));
      wrap.appendChild(b);
    });
    return wrap;
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const firstN = (k) => { visible().slice(0, k).forEach((p) => S.sel.add(p.id)); render(); };
    const fin = (fn) => () => { firstN(S.size === '7' ? 7 : 25); fn(); };
    const steps = {
      'bar': () => firstN(S.size === '7' ? 4 : 3),
      'dlg-remove': fin(() => openAction('remove')),
      'dlg-remove-all': () => { S.all = true; render(); openAction('remove'); },
      'dlg-unsub': () => { firstN(7); selectedList().slice(0, 2).forEach((p) => { p.status = 'unsubscribed'; }); render(); selectedList(); openAction('unsubscribe'); },
      'dlg-replied': fin(() => openAction('replied')),
      'dlg-finished': fin(() => openAction('finished')),
      'dlg-resume': fin(() => openAction('resume')),
      'dlg-pause': fin(() => openAction('pause')),
      'sel-part': () => firstN(3),
      'sel-page': () => firstN(PAGE),
      'sel-all': () => { S.all = true; render(); },
      'sel-tab': () => { S.tab = 'replied'; S.all = true; render(); },
      'sel-cap': () => { S.all = true; render(); },
      'dialog-remove': () => { S.all = S.size !== '7' ? false : true; if (!S.all) firstN(PAGE); else render(); openAction('remove'); },
      'dialog-remove-all': () => { S.all = true; render(); openAction('remove'); },
      'dialog-remove-submitting': () => { S.all = true; render(); const d = openAction('remove'); setTimeout(() => d.confirm(), window.SP_BD + 50); },
      'dialog-remove-error': () => { S.result = 'fail'; S.all = true; render(); const d = openAction('remove'); setTimeout(() => d.confirm(), (window.SP_BD || 0) + 50); },
      'dialog-pause': () => { firstN(S.size === '7' ? 7 : 25); openAction('pause'); },
      'dialog-resume': () => { firstN(S.size === '7' ? 7 : 25); openAction('resume'); },
      'dialog-replied': () => { firstN(S.size === '7' ? 7 : 25); openAction('replied'); },
      'dialog-unsubscribe': () => { firstN(S.size === '7' ? 7 : 25); openAction('unsubscribe'); },
      'dialog-single': () => { firstN(1); openAction('remove'); },
      'toast': () => { S.all = true; render(); const d = openAction('remove'); setTimeout(() => d.confirm(), (window.SP_BD || 0) + 50); },
      'undone': () => { S.all = true; render(); const d = openAction('remove'); setTimeout(() => { d.confirm(); setTimeout(() => document.querySelector('.message-undo').click(), 1000); }, (window.SP_BD || 0) + 50); },
      'today': () => { S.view = 'today'; shell.setControl('view', 'today'); firstN(S.size === '7' ? 7 : 3); },
      'today-pause': () => { S.view = 'today'; shell.setControl('view', 'today'); firstN(7); window.SP_TODAY_PAUSE(() => {}); },
    };
    if (steps[state]) steps[state]();
  }

  window.SP_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.SP_SD = param('sd') != null ? Number(param('sd')) : undefined;
  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
