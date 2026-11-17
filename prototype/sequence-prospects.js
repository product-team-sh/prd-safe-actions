/* Sequence > Prospects: safe actions prototype (spec rows 1 to 4).
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3;
   new elements carry .nx-new. URL params: ?size=7|2340|31200 &view=proposed|today &breakdown=ok|slow|fail
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
    active: 'sequences', rule: true,
    headerHTML: window.SP_HEADER(SEQ),
    controls: [
      { key: 'size', label: 'Prospects', value: S.size, options: [['7', '7'], ['2340', '2,340'], ['31200', '31,200 (over cap)']], onChange: (v) => { S.size = v; DATA = build(v); hidden.clear(); clearSel(); S.page = 0; S.tab = 'total'; render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec rows 1 to 4. Breakdown counts must come from the backend before the dialog opens; the client cannot count them for "Select all". Undo needs the real change to start only after 10 seconds and be cancellable until then.',
      rows: [
        { n: 1, surface: 'Sequence > Prospects', action: 'Remove from sequence', patterns: 'A B F H', breakdown: 'By status: in progress, email scheduled within the hour (subset of in progress), replied, paused. "All" title and "This empties the sequence." when the selection is everyone.', undo: 'Yes, 10 seconds',
          code: [{ label: 'contact-list-header.tsx L119-130 (X icon, no confirmation)', url: HDR + '#L119-L130' }, { label: 'contact-list-content.tsx L542-558 (fires at once)', url: CNT + '#L542-L558' }, { label: 'banner L77-113 (hides "Select all" when one page holds everyone)', url: BAN + '#L77-L113' }],
          v3: `saleshandy-app b39fe37 already labels it "Remove" with a trash icon, but it still fires on click with no dialog and sits 4th of 9 actions: <a href="${V3}ProspectsBulkActionBar.tsx#L143-L151" target="_blank" rel="noopener">ProspectsBulkActionBar.tsx L143-151</a>, <a href="${V3}constants.ts" target="_blank" rel="noopener">constants.ts</a>. Apply B, F and H there too.` },
        { n: 2, surface: 'Sequence > Prospects', action: 'Unsubscribe', patterns: 'A C F H', breakdown: 'By status (in progress, replied, paused) plus "Also in other sequences" (prospects whose other sequences stop too).', undo: 'Yes, 10 seconds',
          code: [{ label: 'contact-list-header.tsx L142-152 (icon, no confirmation)', url: HDR + '#L142-L152' }, { label: 'contact-list-content.tsx L598-608', url: CNT + '#L598-L608' }],
          v3: `Fires on click: <a href="${V3}ProspectsBulkActionBar.tsx#L187-L190" target="_blank" rel="noopener">ProspectsBulkActionBar.tsx L187-190</a>.` },
        { n: 3, surface: 'Sequence > Prospects', action: 'Mark as replied, Mark as finished', patterns: 'A C F H', breakdown: 'By status of the prospects that change (in progress, scheduled within the hour, paused); those already in the target status are named in a note and left alone.', undo: 'Yes, 10 seconds',
          code: [{ label: 'contact-list-header.tsx L131-141, L153-163', url: HDR + '#L131-L163' }, { label: 'contact-list-content.tsx L586-619', url: CNT + '#L586-L619' }],
          v3: `Fire on click: <a href="${V3}ProspectsBulkActionBar.tsx#L183-L194" target="_blank" rel="noopener">ProspectsBulkActionBar.tsx L183-194</a>.` },
        { n: 4, surface: 'Sequence > Prospects', action: 'Pause, Resume', patterns: 'A C F H', breakdown: 'Pause: in progress, scheduled within the hour. Resume: paused, will send today. Prospects the action does not apply to are named in a note.', undo: 'Yes, 10 seconds',
          code: [{ label: 'contact-list-header.tsx L164-185', url: HDR + '#L164-L185' }, { label: 'contact-list-content.tsx L621-647 (pause modal keeps its duration picker)', url: CNT + '#L621-L647' }],
          v3: `Pause opens a duration dialog, Resume fires on click: <a href="${V3}ProspectsBulkActionBar.tsx#L195-L199" target="_blank" rel="noopener">ProspectsBulkActionBar.tsx L195-199</a>.` },
      ],
      notes: [
        'The "Change status" menu replaces the five status icons. Options that do not apply are disabled with the reason, never hidden.',
        'Counts in titles are what the action changes: "Pause 4 prospects" when 3 of 7 selected are not in progress. The note under the breakdown names the rest.',
        'Rows leave the table at once; Undo puts them back in the same position with the selection cleared. A second action commits the first at once.',
        'Leaving the page does not cancel: the change still completes after 10 seconds.',
        'Over 25,000: "Select all" selects the first 25,000 and the banner says so.',
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

  /* ───────── proposed bar (B, C) ───────── */
  function proposedBar() {
    const n = selCount();
    const none = n === 0;
    const why = 'Select prospects first';
    const bar = nxBulkBar({
      actions: [
        { id: 'add', label: 'Add to sequence', icon: 'send', disabled: none, reason: why, onClick: () => nxToast({ message: 'Not part of this prototype' }) },
        { id: 'tags', label: 'Tags', icon: 'tag', disabled: none, reason: why, onClick: () => nxToast({ message: 'Not part of this prototype' }) },
        { id: 'status', label: 'Change status', icon: 'arrows-exchange', menu: true, disabled: none, reason: why, onClick: (btn) => openStatusMenu(btn) },
      ],
      risky: [{ id: 'remove', label: 'Remove', count: null, icon: 'trash', disabled: none, reason: why, onClick: () => openRemove() }],
    });
    return bar;
  }

  function statusOptions() {
    const s = stats(selectedList());
    const all = (k) => s[k] === s.n;
    return [
      { id: 'pause', label: 'Pause', icon: 'pause-circle', desc: 'Stops sending until you resume', disabled: s.active === 0, reason: all('paused') ? 'All selected prospects are already paused' : 'None of the selected prospects are in progress' },
      { id: 'resume', label: 'Resume', icon: 'right-arrow', desc: 'Picks up from their current step', disabled: s.paused === 0, reason: 'None of the selected prospects are paused' },
      { id: 'replied', label: 'Mark as replied', icon: 'round-corner-arrow-back', desc: 'They replied, so emails to them stop', divider: true, disabled: all('replied'), reason: 'All selected prospects are already marked as replied' },
      { id: 'finished', label: 'Mark as finished', icon: 'flag', desc: 'They have no more steps to send', disabled: all('finished'), reason: 'All selected prospects are already finished' },
      { id: 'unsubscribe', label: 'Unsubscribe', icon: 'unavailable', desc: 'Never email them again, from any sequence', danger: true, disabled: all('unsubscribed'), reason: 'All selected prospects are already unsubscribed' },
    ];
  }
  function openStatusMenu(anchor, opts = {}) {
    return nxStatusMenu({ anchor, label: 'Change status', options: statusOptions(), onPick: (id) => openStatus(id), focus: opts.focus });
  }

  /* ───────── dialogs (F) ───────── */
  const nP = (n) => `${fmt(n)} ${plural(n, 'prospect', 'prospects')}`;
  const isEverything = () => S.tab === 'total' && selCount() === inSeq().length;
  const phrase = { active: ['is still in progress', 'are still in progress'], replied: ['has replied', 'have replied'], paused: ['is paused', 'are paused'] };
  const sentenceFor = (N) => (r) => {
    const ph = phrase[r.key] || ['', ''];
    if (r.value === N) return N === 1 ? `This prospect ${ph[0]}.` : `All ${fmt(N)} ${ph[1]}.`;
    return `${fmt(r.value)} of them ${r.value === 1 ? ph[0] : ph[1]}.`;
  };
  const dlgCommon = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.SP_BD, submitDelay: window.SP_SD }, o);
  // One prospect: no lookup is needed, so no counting state; the breakdown becomes one sentence about them
  function oneProspect(p, extra = '') {
    const st = { active: `is still in progress${p.soon ? ', with an email scheduled in the next hour' : ''}`, replied: 'has replied', paused: `is paused${p.sendToday ? ' and will send today once resumed' : ''}`, finished: 'has finished', unsubscribed: 'is unsubscribed' }[p.status];
    return { rows: [{ key: 'one', label: '', value: 1 }], sentence: `${esc(p.first)} ${st}${extra}.`, breakdown: 'ok', breakdownDelay: 0 };
  }

  function openRemove() {
    const list = selectedList();
    const s = stats(list);
    const N = list.length;
    const all = isEverything();
    const single = N === 1 ? `${list[0].first} ${list[0].last}` : null;
    const title = single ? `Remove ${esc(single)} from ${QSEQ}?` : all ? `Remove all ${nP(N)} from ${QSEQ}?` : `Remove ${nP(N)} from ${QSEQ}?`;
    return nxImpactDialog(dlgCommon({
      title, tone: 'danger', undoable: { n: N, all },
      rows: [
        { key: 'active', label: 'Still in progress', value: s.active },
        { key: 'soon', label: 'Email scheduled in the next hour', value: s.soon, sub: true },
        { key: 'replied', label: 'Replied', value: s.replied },
        { key: 'paused', label: 'Paused', value: s.paused },
      ],
      sentence: sentenceFor(N),
      consequence: `${N === 1 ? `${esc(list[0].first)} stops` : 'They stop'} getting emails from this sequence. You can undo this for 10 seconds; after that their progress here is gone.${all ? ' This empties the sequence.' : ''}`,
      primaryLabel: N === 1 ? 'Remove prospect' : all ? `Remove all ${nP(N)}` : `Remove ${nP(N)}`,
      failMessage: { title: `We couldn't remove ${N === 1 ? 'this prospect' : 'these prospects'} because the sequence was deleted.`, body: 'Refresh the page.' },
      ...(N === 1 ? oneProspect(list[0]) : {}),
      onConfirm: () => {
        const ids = list.map((p) => p.id);
        ids.forEach((id) => hidden.add(id));
        clearSel(); render();
        nxUndoToast({
          message: `Removed ${nP(N)} from ${QSEQ}`,
          undoneMessage: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} back`,
          onUndo: () => { ids.forEach((id) => hidden.delete(id)); clearSel(); render(); },
          onCommit: () => { const set = new Set(ids); DATA = DATA.filter((p) => !set.has(p.id)); ids.forEach((id) => hidden.delete(id)); render(); },
        });
      },
    }));
  }

  function changeStatus(list, to, toast) {
    const prev = list.map((p) => [p, p.status]);
    list.forEach((p) => { p.status = to; });
    clearSel(); render();
    nxUndoToast({
      message: toast.message, undoneMessage: toast.undone,
      onUndo: () => { prev.forEach(([p, st]) => { p.status = st; }); clearSel(); render(); },
      onCommit: () => {},
    });
  }

  function pauseExtra() {
    // Today's PauseProspectModal duration picker, kept inside the dialog (window.SP_PAUSE_PICKER renders production markup)
    let days = 14;
    const ex = {
      ctrl: null,
      render(el) { window.SP_PAUSE_PICKER(el, (d, ok) => { days = d; if (ex.ctrl) ex.ctrl.setPrimary({ disabled: !ok }); }, days); },
      value() { return days; },
    };
    return ex;
  }

  function openStatus(id) {
    const sel = selectedList();
    const who = (list) => (list.length === 1 ? esc(`${list[0].first} ${list[0].last}`) : nP(list.length));
    const s = stats(sel);
    const others = (k, what) => (sel.length - k > 0 ? `${nP(sel.length - k)} ${sel.length - k === 1 ? 'is' : 'are'} ${what} and ${sel.length - k === 1 ? 'stays' : 'stay'} as ${sel.length - k === 1 ? 'it is' : 'they are'}.` : null);
    if (id === 'pause') {
      const list = sel.filter((p) => p.status === 'active'); const N = list.length;
      const ex = pauseExtra();
      const dlg = nxImpactDialog(dlgCommon({
        title: `Pause ${who(list)} in ${QSEQ}?`, tone: 'primary', icon: NX.IMG('pause-circle.svg'),
        rows: [{ key: 'active', label: 'Still in progress', value: N }, { key: 'soon', label: 'Email scheduled in the next hour', value: s.soon, sub: true }],
        sentence: sentenceFor(N), note: others(N, 'not in progress'), extra: ex,
        consequence: 'Sending to them stops until the pause ends or you resume them. You can undo this for 10 seconds.',
        primaryLabel: N === 1 ? 'Pause prospect' : `Pause ${nP(N)}`,
        failMessage: { title: 'We couldn\'t pause these prospects because the sequence was deleted.', body: 'Refresh the page.' },
        ...(N === 1 ? oneProspect(list[0]) : {}),
        onConfirm: (days) => changeStatus(list, 'paused', { message: days ? `Paused ${nP(N)} for ${days} ${plural(days, 'day', 'days')}` : `Paused ${nP(N)} until you resume them`, undone: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} in progress again` }),
      }));
      ex.ctrl = dlg.ctrl;
      return dlg;
    }
    if (id === 'resume') {
      const list = sel.filter((p) => p.status === 'paused'); const N = list.length;
      return nxImpactDialog(dlgCommon({
        title: `Resume ${who(list)} in ${QSEQ}?`, tone: 'primary', icon: NX.IMG('play-circle.svg'),
        rows: [{ key: 'paused', label: 'Paused', value: N }, { key: 'today', label: 'Will send today', value: s.today, sub: true }],
        sentence: sentenceFor(N), note: others(N, 'not paused'),
        consequence: 'They pick up from their current step. You can undo this for 10 seconds.',
        primaryLabel: N === 1 ? 'Resume prospect' : `Resume ${nP(N)}`,
        failMessage: { title: 'We couldn\'t resume these prospects because the sequence was deleted.', body: 'Refresh the page.' },
        ...(N === 1 ? oneProspect(list[0]) : {}),
        onConfirm: () => changeStatus(list, 'active', { message: `Resumed ${nP(N)}`, undone: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} paused again` }),
      }));
    }
    if (id === 'replied' || id === 'finished') {
      const list = sel.filter((p) => p.status !== id); const N = list.length;
      const word = id === 'replied' ? 'replied' : 'finished';
      const ss = stats(list);
      return nxImpactDialog(dlgCommon({
        title: `Mark ${who(list)} as ${word} in ${QSEQ}?`, tone: 'primary',
        rows: [{ key: 'active', label: 'Still in progress', value: ss.active }, { key: 'soon', label: 'Email scheduled in the next hour', value: ss.soon, sub: true }, { key: 'replied', label: 'Replied', value: ss.replied }, { key: 'paused', label: 'Paused', value: ss.paused }],
        sentence: sentenceFor(N), note: others(N, id === 'replied' ? 'already marked as replied' : 'already finished'),
        consequence: 'The sequence stops for them. You can undo this for 10 seconds.',
        primaryLabel: N === 1 ? `Mark prospect as ${word}` : `Mark ${nP(N)} as ${word}`,
        failMessage: { title: `We couldn't mark these prospects as ${word} because the sequence was deleted.`, body: 'Refresh the page.' },
        ...(N === 1 ? oneProspect(list[0]) : {}),
        onConfirm: () => changeStatus(list, id, { message: `Marked ${nP(N)} as ${word}`, undone: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} back to ${N === 1 ? 'its' : 'their'} earlier status` }),
      }));
    }
    if (id === 'unsubscribe') {
      const list = sel.filter((p) => p.status !== 'unsubscribed'); const N = list.length;
      const ss = stats(list);
      return nxImpactDialog(dlgCommon({
        title: `Unsubscribe ${who(list)} from every sequence?`, tone: 'danger', undoable: { n: N, all: isEverything() }, icon: NX.IMG('unsubscribe-ban.svg'),
        rows: [{ key: 'active', label: 'Still in progress', value: ss.active }, { key: 'replied', label: 'Replied', value: ss.replied }, { key: 'paused', label: 'Paused', value: ss.paused }, { key: 'other', label: 'Also in other sequences, which stop too', value: ss.other }],
        sentence: sentenceFor(N), note: others(N, 'already unsubscribed'),
        consequence: 'No sequence will email them again. You can undo this for 10 seconds.',
        primaryLabel: N === 1 ? 'Unsubscribe prospect' : `Unsubscribe ${nP(N)}`,
        failMessage: { title: 'We couldn\'t unsubscribe these prospects because the sequence was deleted.', body: 'Refresh the page.' },
        ...(N === 1 ? oneProspect(list[0], list[0].other ? ' and is in other sequences, which stop too' : '') : {}),
        onConfirm: () => changeStatus(list, 'unsubscribed', { message: `Unsubscribed ${nP(N)}`, undone: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} subscribed again` }),
      }));
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
    const bar = (id) => root.querySelector(`.nx-act[data-id="${id}"]`);
    const statusMenu = () => openStatusMenu(bar('status') || bar('more'), { focus: false });
    const steps = {
      'sel-part': () => firstN(3),
      'sel-page': () => firstN(PAGE),
      'sel-all': () => { S.all = true; render(); },
      'sel-tab': () => { S.tab = 'replied'; S.all = true; render(); },
      'sel-cap': () => { S.all = true; render(); },
      'menu': () => { firstN(S.size === '7' ? 4 : 3); statusMenu(); },
      'menu-paused': () => { const ps = visible().filter((p) => p.status === 'paused').slice(0, 1); ps.forEach((p) => S.sel.add(p.id)); render(); statusMenu(); },
      'dialog-remove': () => { S.all = S.size !== '7' ? false : true; if (!S.all) firstN(PAGE); else render(); openRemove(); },
      'dialog-remove-all': () => { S.all = true; render(); openRemove(); },
      'dialog-remove-submitting': () => { S.all = true; render(); const d = openRemove(); setTimeout(() => d.confirm(), window.SP_BD + 50); },
      'dialog-remove-error': () => { S.result = 'fail'; S.all = true; render(); const d = openRemove(); setTimeout(() => d.confirm(), (window.SP_BD || 0) + 50); },
      'dialog-pause': () => { firstN(S.size === '7' ? 7 : 25); openStatus('pause'); },
      'dialog-resume': () => { firstN(S.size === '7' ? 7 : 25); openStatus('resume'); },
      'dialog-replied': () => { firstN(S.size === '7' ? 7 : 25); openStatus('replied'); },
      'dialog-unsubscribe': () => { firstN(S.size === '7' ? 7 : 25); openStatus('unsubscribe'); },
      'dialog-single': () => { firstN(1); openRemove(); },
      'toast': () => { S.all = true; render(); const d = openRemove(); setTimeout(() => d.confirm(), (window.SP_BD || 0) + 50); },
      'undone': () => { S.all = true; render(); const d = openRemove(); setTimeout(() => { d.confirm(); setTimeout(() => document.querySelector('.message-undo').click(), 1000); }, (window.SP_BD || 0) + 50); },
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
