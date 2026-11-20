/* CRM > Prospects (my.saleshandy.com/crm/list): safe actions prototype, spec rows 12, 13, 14, 16.
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3 (crm-prospects-markup.js);
   new elements carry .nx-new. URL params: ?view=proposed|today &sel=4|page|all &breakdown=ok|slow|fail
   &result=ok|fail &credits=enough|short &aicol=new|existing &upsell=1 &state=<screenshot state> &new=1 &dev=1 &bd= &sd= */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const PAGE = 25;
  const CAP = 25000;
  const PER_ROW = 1; // GPT-4o mini, ~1 credit per row
  const AI = 'Personalised opener';
  const QAI = `“${AI}”`;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/';
  const PLC = C + 'src/components/prospect/components/prospect-list-content/prospect-list-content.tsx';
  const BULK = C + 'src/components/prospect/components/prospect-list/components/bulk-actions/bulk-actions.tsx';
  const MOD = C + 'src/components/prospect/components/prospect-list/components/modals/';
  const TAGC = C + 'src/shared/components/add-remove-tag/add-remove-tag.tsx';
  const AIM = C + 'src/components/prospect/components/ai-col-enrichment-modal/components/';

  /* ───────── scenario ───────── */
  const pick = (k, list, d) => (list.includes(param(k)) ? param(k) : d);
  const S = {
    view: pick('view', ['today', 'proposed'], 'proposed'),
    sel: pick('sel', ['4', 'page', 'all'], '4'),
    breakdown: pick('breakdown', ['ok', 'slow', 'fail'], 'ok'),
    result: pick('result', ['ok', 'fail'], 'ok'),
    credits: pick('credits', ['enough', 'short'], 'enough'),
    aicol: pick('aicol', ['new', 'existing'], 'new'),
    upsell: param('upsell') === '1',
    page: 0,
    picked: new Set(),
    all: false,
    desel: new Set(),
  };
  const HAVE = () => (S.credits === 'short' ? 190 : 5000);

  /* ───────── data: 2,340 prospects whose counts add up ───────── */
  const FIRST = ['Priya', 'Marcus', 'Elena', 'Tom', 'Aisha', 'Daniel', 'Sofia', 'Liam', 'Mei', 'Arjun', 'Hannah', 'Kofi', 'Lucia', 'Noah', 'Zara', 'Ethan', 'Ines', 'Ravi', 'Chloe', 'Mateo', 'Yuki', 'Owen', 'Leila', 'Samir', 'Grace', 'Felix', 'Nadia', 'Jonas', 'Amara', 'Diego', 'Freya', 'Hugo', 'Anika', 'Theo', 'Rosa', 'Kian', 'Maya', 'Omar', 'Clara', 'Ivan'];
  const LAST = ['Raman', 'Hale', 'Duarte', 'Becker', 'Khan', 'Osei', 'Marin', 'Novak', 'Chen', 'Mehta', 'Lindqvist', 'Mensah', 'Ferreira', 'Brooks', 'Haddad', 'Walsh', 'Moreau', 'Iyer', 'Dubois', 'Silva', 'Tanaka', 'Reilly', 'Farah', 'Aziz', 'Park', 'Weber', 'Petrova', 'Berg', 'Okafor', 'Ruiz', 'Nilsen', 'Laurent', 'Kapoor', 'Fischer', 'Romano', 'Ahmadi', 'Cohen', 'Saleh', 'Vogel', 'Petrov'];
  const CO = [['Ledgerloop', 'ledgerloop.io'], ['Shipyard HQ', 'shipyardhq.com'], ['Quillstack', 'quillstack.com'], ['Fieldnote', 'fieldnote.app'], ['Northbeam', 'northbeam.dev'], ['Tallyroute', 'tallyroute.com'], ['Brightforge', 'brightforge.co'], ['Cartwheel AI', 'cartwheel.ai'], ['Opslane', 'opslane.io'], ['Pagefold', 'pagefold.com'], ['Relaypoint', 'relaypoint.co'], ['Stackmint', 'stackmint.io'], ['Brickyard', 'brickyard.dev'], ['Loomstate', 'loomstate.com'], ['Harborly', 'harborly.io'], ['Trellis', 'trellisapp.com'], ['Gridwise', 'gridwise.co'], ['Patchwork', 'patchwork.so'], ['Kiln', 'kilnhq.com'], ['Meridian Ops', 'meridianops.com']];
  const TITLES = ['Head of Growth', 'VP Sales', 'Founder & CEO', 'Marketing Manager', 'RevOps Lead', 'Director of Sales', 'Account Executive', 'CTO', 'Demand Gen Manager', 'SDR Manager', 'COO', 'Head of Partnerships'];
  const SEQS = ['SaaS founders, Oct', 'Q4 webinar follow-up', 'RevOps leaders EU', 'Re-engage cold leads'];
  const TAG = { founder: { id: 1, name: 'Founder' }, saas: { id: 2, name: 'SaaS' }, q4: { id: 3, name: 'Q4 webinar' }, eu: { id: 4, name: 'EU' }, dnc: { id: 5, name: 'Do not call' } };
  const ALL_TAGS = Object.values(TAG);
  const OPENERS = ['Saw {c} just opened a second office, congrats on the growth.', 'Loved the {c} post on cutting onboarding time in half.', 'Noticed {c} is hiring three SDRs this quarter, busy times.', 'Your talk on pipeline hygiene at SaaStr stuck with me.', 'Congrats on the {c} Series A, that is a big step.', '{c} keeps showing up in RevOps threads I follow.'];
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function build() {
    const N = 2340;
    // status mix: active 1,268 + paused 144 = 1,412 in active sequences; replied 386; finished 210; unsubscribed 54; bounced 38; no sequence 240
    const st = [].concat(Array(1268).fill('active'), Array(144).fill('paused'), Array(386).fill('replied'), Array(210).fill('finished'), Array(54).fill('unsubscribed'), Array(38).fill('bounced'), Array(240).fill(null));
    const r = rng(7);
    for (let i = st.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [st[i], st[j]] = [st[j], st[i]]; }
    // first page reads well: a mix in the first 25 rows
    const head = ['active', 'replied', 'active', 'paused', null, 'active', 'finished', 'active', 'replied', 'unsubscribed', 'active', 'active', 'bounced', 'replied', 'active', null, 'paused', 'active', 'finished', 'active', 'replied', 'active', null, 'active', 'active'];
    head.forEach((want, i) => { const j = st.indexOf(want, i); if (j >= 0) [st[i], st[j]] = [st[j], st[i]]; });
    const ver = (i) => (i % 40 === 13 ? 'bad' : i % 7 === 3 ? 'risky' : i % 7 === 5 ? 'skip' : 'valid');
    return st.map((s, i) => {
      const first = FIRST[(i * 7 + 3) % FIRST.length], last = LAST[(i * 11 + 5) % LAST.length];
      const [company, dom] = CO[(i * 13) % CO.length];
      const tags = [];
      if (i % 5 === 0) tags.push(TAG.q4);
      if (i % 9 === 2) tags.push(TAG.dnc);
      if (i % 4 === 1) tags.push(TAG.saas);
      if (i % 6 === 3) tags.push(TAG.founder);
      if (i % 11 === 4) tags.push(TAG.eu);
      const inSeq = s !== null;
      const seqs = inSeq ? (i % 6 === 0 ? [SEQS[i % 4], SEQS[(i + 1) % 4]] : [SEQS[i % 4]]) : [];
      return {
        id: i + 1, first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}${i > 39 ? i : ''}@${dom}`,
        company, title: TITLES[(i * 5) % TITLES.length], ver: ver(i), status: s, seqs, tags,
        notes: i % 18 === 7, replies: s === 'replied',
        opener: i % 27 === 5 || i % 13 === 8 ? '' : OPENERS[i % OPENERS.length].replace('{c}', company),
      };
    });
  }

  let DATA = build();
  const hidden = new Set(); // deleted, still inside the 10-second undo window
  let aiCol = S.aicol === 'existing' ? AI : null;
  let loadingIds = null;

  const list = () => DATA.filter((p) => !hidden.has(p.id));
  function selectedList() {
    if (S.all) return list().filter((p) => !S.desel.has(p.id)).slice(0, CAP);
    return list().filter((p) => S.picked.has(p.id));
  }
  function selCount() { return S.all ? Math.min(CAP, list().length - S.desel.size) : S.picked.size; }
  function clearSel() { S.picked.clear(); S.all = false; S.desel.clear(); }
  const isActiveSeq = (p) => p.status === 'active' || p.status === 'paused';
  const nP = (n) => `${fmt(n)} ${plural(n, 'prospect', 'prospects')}`;
  const nR = (n) => `${fmt(n)} ${plural(n, 'row', 'rows')}`;
  const everything = () => selCount() >= list().length;
  const dlg = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.CRM_BD, submitDelay: window.CRM_SD }, o);

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'crm', rule: true,
    headerHTML: window.CRM_HEADER,
    controls: [
      { key: 'sel', label: 'Select', value: S.sel, options: [['4', '4'], ['page', 'This page'], ['all', 'All 2,340']], onChange: (v) => { S.sel = v; applySel(); render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'credits', label: 'AI credits', value: S.credits, options: [['enough', '5,000'], ['short', '190']], onChange: (v) => { S.credits = v; } },
      { key: 'aicol', label: 'AI column', value: S.aicol, options: [['new', 'New'], ['existing', 'Exists']], onChange: (v) => { S.aicol = v; aiCol = v === 'existing' ? AI : null; render(); } },
      { key: 'upsell', label: 'Older plan (upsell)', toggle: true, value: S.upsell, onChange: (v) => { S.upsell = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec rows 12, 13, 14 and 16. Breakdown counts come from the backend before the dialog rows fill in; with "Select all" the client cannot count them. Undo needs the real delete, unsubscribe or tag removal to start only after 10 seconds and be cancellable until then. AI runs spend credits, so they get the total-cost dialog (L) and no undo.',
      rows: [
        { n: 12, surface: 'CRM prospects', action: 'Bulk delete', patterns: 'A B F H', breakdown: 'In active sequences (they are removed from them), with replies, with notes. "All" title and "This empties your prospect list." when everyone is selected. On an older plan with 10+ selected, today\'s upsell becomes one muted line under the consequence; the count, breakdown and red button stay first.', undo: 'Yes, 10 seconds',
          code: [{ label: 'bulk-actions.tsx L16-73 (icon-only bar, Delete last, no label)', url: BULK + '#L16-L73' }, { label: 'delete-prospect-modal.tsx L39-48 (no count)', url: MOD + 'delect-prospect-modal/delete-prospect-modal.tsx#L39-L48' }, { label: 'no-need-to-delete-modal.tsx (upsell first, count only in a tooltip)', url: MOD + 'delect-prospect-modal/no-need-to-delete-modal.tsx' }, { label: 'prospect-list-content.tsx L650-676 (upsell modal when 10+ selected on an older plan)', url: PLC + '#L650-L676' }] },
        { n: 13, surface: 'CRM prospects', action: 'Bulk unsubscribe', patterns: 'A B F H', breakdown: 'In active sequences (these stop), not in an active sequence. Prospects already unsubscribed are named in a note and left alone.', undo: 'Yes, 10 seconds',
          code: [{ label: 'unsubscribe-prospect-modal.tsx L34-43 (no count)', url: MOD + 'unsubscribe-prospect-modal/unsubscribe-prospect-modal.tsx#L34-L43' }, { label: 'prospect-list-content.tsx L1029-1050 (fires the bulk request)', url: PLC + '#L1029-L1050' }] },
        { n: 14, surface: 'CRM prospects', action: 'Remove tags', patterns: 'A F H', breakdown: 'One row per tag picked: selected prospects that have it. Prospects with none of the picked tags are named in a note.', undo: 'Yes, 10 seconds',
          code: [{ label: 'add-remove-tag.tsx L151-153 ("Apply" fires at once)', url: TAGC + '#L151-L153' }, { label: 'add-remove-tag.tsx L165-187 (removable tags)', url: TAGC + '#L165-L187' }, { label: 'prospect-list-content.tsx L1685-1711 (handleRemoveTag)', url: PLC + '#L1685-L1711' }] },
        { n: 16, surface: 'CRM > AI column', action: 'Run (new column), run on existing column', patterns: 'L F', breakdown: 'New column: credits this uses, you have, left after (not enough: shortfall, "Buy credits", partial run). Existing column: values that will be replaced and empty rows that get a value, then the same credit rows, red because replaced values cannot come back.', undo: 'No (spends credits)',
          code: [{ label: 'template-footer.tsx L77-91 (Save menu option runs at once)', url: AIM + 'template-footer.tsx#L77-L91' }, { label: 'template-footer.tsx L170-480 (menu: estimated credits per option, no balance)', url: AIM + 'template-footer.tsx#L170-L480' }, { label: 'override-generated-existing-column.tsx L12-50 (no row count, no credits)', url: AIM + 'override-generated-existing-column.tsx#L12-L50' }] },
      ],
      notes: [
        'Bulk bar (B): Add to sequence, Tags and Verify emails keep their place; Unsubscribe and Delete move right of a divider. Only Delete and Unsubscribe are red (data is lost, or it cannot be undone); neither carries a count.',
        'Tags stay one control with an Add tags / Remove tags menu, as today. The remove picker is unchanged; "Apply" now opens the impact dialog instead of firing.',
        'Blue per spec F: removing tags loses nothing, and Undo brings them back.',
        'AI column: the Save menu labels stay as production. Picking any run option opens the cost dialog; "Save & Don\'t Run" stays instant. The drawer here starts at the template detail step; the intro and template list steps are unchanged and not reproduced.',
        'The 10-second undo needs delete, unsubscribe and tag removal to be delayed, cancellable jobs. Today they run as bulk background requests.',
        'Over 25,000: "Select all" selects the first 25,000 and the banner says so (same rule as Sequence > Prospects).',
      ],
    },
  });
  const root = h('<div id="crm-root"></div>');
  shell.body.appendChild(root);

  function applySel() {
    clearSel();
    if (S.sel === 'all') S.all = true;
    else if (S.sel === 'page') pageRows().forEach((p) => S.picked.add(p.id));
    else pageRows().slice(0, 4).forEach((p) => S.picked.add(p.id));
  }
  function pageRows() { const l = list(); return l.slice(S.page * PAGE, S.page * PAGE + PAGE); }

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu();
    const l = list();
    const pages = Math.max(1, Math.ceil(l.length / PAGE));
    if (S.page >= pages) S.page = pages - 1;
    const rows = pageRows();
    const isSel = (p) => (S.all ? !S.desel.has(p.id) : S.picked.has(p.id));
    const cols = window.CRM_COLUMNS(aiCol);
    const prevW = root.querySelector('[data-crm="wrapper"]');
    const keep = prevW ? [prevW.scrollLeft, prevW.scrollTop] : [0, 0];
    root.innerHTML = window.CRM_PAGE({ view: S.view, rows, cols, isSel, total: l.length, totalAll: l.length, page: S.page, pages, pageSize: PAGE, loadingIds });
    const host = root.querySelector('[data-crm="bulk"]');
    host.appendChild(S.view === 'today' ? todayBar() : proposedBar());
    const n = selCount();
    const ban = nxSelectionBanner({
      count: n, total: l.length, pageRows: rows.length, allSelected: S.all, cap: CAP, scope: 'in your CRM',
      mode: S.view === 'today' ? 'today' : 'proposed',
      onSelectAll: () => { S.all = true; S.desel.clear(); S.picked.clear(); render(); },
      onClear: () => { clearSel(); render(); },
    });
    const bh = root.querySelector('[data-crm="banner"]');
    if (ban) bh.appendChild(ban); else if (S.view === 'today') bh.remove(); else bh.appendChild(NX.bannerPlaceholder()); // reserved row: no layout shift
    sizeTable(cols);
    const w = root.querySelector('[data-crm="wrapper"]');
    if (w) { if (loadingIds) w.scrollLeft = w.scrollWidth; else { w.scrollLeft = keep[0]; w.scrollTop = keep[1]; } } // keep the scroll; show the AI column while it fills
    wire(rows, isSel);
    placeInk();
    NX.settle(root);
  }

  // TanStack: --header-<id>-size / --col-<id>-size; extra space is shared out when the columns are narrower than the wrapper
  function sizeTable(cols) {
    const wrap = root.querySelector('[data-crm="wrapper"]');
    const tbl = root.querySelector('[data-crm="table"]');
    if (!wrap || !tbl) return;
    const total = cols.reduce((s, c) => s + c.size, 0);
    const avail = wrap.clientWidth;
    const extra = total < avail ? (avail - total) / cols.length : 0;
    cols.forEach((c) => { tbl.style.setProperty(`--header-${c.id}-size`, c.size + extra); tbl.style.setProperty(`--col-${c.id}-size`, c.size + extra); });
    tbl.style.width = total < avail ? '100%' : total + 'px';
  }
  window.addEventListener('resize', () => sizeTable(window.CRM_COLUMNS(aiCol)));

  function placeInk() {
    const tab = root.querySelector('.saved-filters__tabs .bs-tabs-tab-active');
    const ink = root.querySelector('[data-crm="ink"]');
    if (!tab || !ink) return;
    ink.style.left = tab.offsetLeft + 'px';
    ink.style.width = tab.offsetWidth + 'px';
  }
  document.fonts && document.fonts.ready.then(placeInk);

  function wire(rows, isSel) {
    const head = root.querySelector('[data-crm="check-all"]');
    if (head) {
      const on = rows.filter(isSel).length;
      head.indeterminate = on > 0 && on < rows.length;
      head.addEventListener('change', () => {
        rows.forEach((p) => { if (S.all) { head.checked ? S.desel.delete(p.id) : S.desel.add(p.id); } else { head.checked ? S.picked.add(p.id) : S.picked.delete(p.id); } });
        if (S.all && S.desel.size >= list().length) clearSel();
        render();
      });
    }
    root.querySelectorAll('[data-crm-row]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-crm-row'));
      if (S.all) { cb.checked ? S.desel.delete(id) : S.desel.add(id); if (S.desel.size >= list().length) clearSel(); }
      else cb.checked ? S.picked.add(id) : S.picked.delete(id);
      render();
    }));
    root.querySelectorAll('[data-crm-page]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      const v = b.getAttribute('data-crm-page');
      S.page = v === 'prev' ? S.page - 1 : v === 'next' ? S.page + 1 : Number(v);
      render();
    }));
    root.querySelectorAll('[data-crm-noop]').forEach((b) => b.addEventListener('click', () => nxToast({ message: 'Not part of this prototype' })));
    root.querySelector('[data-crm="enrich"]').addEventListener('click', () => openAiDrawer());
  }

  /* ───────── today's bar: bulk-actions.tsx, icon-only, in production order ───────── */
  function todayBar() {
    const frag = document.createDocumentFragment();
    const none = selCount() === 0;
    const btn = (ic, tip, fn) => {
      const b = h(`<button icon="${ic}" type="button" class="btn-icon-md bulk-action-icon-button  ${none ? 'disabled' : ''} btn-ghost btn-ghost-default btn-ghost-md" aria-label="${tip}" data-nx-tip="${tip}" ${none ? 'disabled' : ''}><span><i class="sh-${ic}"></i></span></button>`);
      if (none) { const w = h(`<span style="display:inline-flex" data-nx-tip="${tip}"></span>`); w.appendChild(b); return w; }
      b.addEventListener('click', fn); return b;
    };
    frag.appendChild(btn('send', 'Add to Sequence', () => nxToast({ message: 'Not part of this prototype' })));
    const tagT = h(window.CRM_TAG_TRIGGER(none));
    if (!none) tagT.querySelector('.tag-icon').addEventListener('click', () => toggleTagDropdown(tagT));
    frag.appendChild(tagT);
    frag.appendChild(btn('shield-check', 'Verify Email(s)', () => nxToast({ message: 'Not part of this prototype' })));
    frag.appendChild(btn('unavailable', 'Unsubscribe', () => window.CRM_TODAY_UNSUB(() => todayApply('unsub'))));
    frag.appendChild(btn('trash', 'Delete', () => {
      const n = selCount();
      if (S.upsell && n >= 10) window.CRM_TODAY_NONEED(n, () => todayApply('delete'));
      else window.CRM_TODAY_DELETE(() => todayApply('delete'));
    }));
    return frag;
  }
  function toggleTagDropdown(trigger) {
    const open = trigger.querySelector('.add-btn-container');
    if (open) { open.remove(); trigger.querySelector('.tag-icon').classList.remove('selected'); return; }
    const dd = window.CRM_TAG_DROPDOWN();
    trigger.appendChild(dd);
    trigger.querySelector('.tag-icon').classList.add('selected');
    dd.querySelector('[data-a="add"]').addEventListener('click', () => { dd.remove(); nxToast({ message: 'Not part of this prototype' }); });
    dd.querySelector('[data-a="remove"]').addEventListener('click', () => { dd.remove(); openTagPicker(); });
    setTimeout(() => document.addEventListener('mousedown', function off(e) { if (!dd.contains(e.target)) { dd.remove(); const ti = trigger.querySelector('.tag-icon'); ti && ti.classList.remove('selected'); document.removeEventListener('mousedown', off, true); } }, true), 0);
  }
  // Today: changes happen at once, production success toast (server message), no undo
  function todayApply(kind, tags) {
    const l = selectedList();
    if (kind === 'delete') { const ids = new Set(l.map((p) => p.id)); DATA = DATA.filter((p) => !ids.has(p.id)); nxToast({ message: 'Prospects deleted successfully.' }); }
    if (kind === 'unsub') { l.forEach((p) => { p.status = 'unsubscribed'; }); nxToast({ message: 'Prospects unsubscribed successfully.' }); }
    if (kind === 'tags') { const ids = new Set(tags.map((t) => t.id)); l.forEach((p) => { p.tags = p.tags.filter((t) => !ids.has(t.id)); }); nxToast({ message: 'Tags removed successfully.' }); }
    clearSel(); render();
  }

  /* ───────── proposed bar (B) ───────── */
  function proposedBar() {
    const n = selCount();
    const none = n === 0;
    const why = 'Select prospects first';
    const bar = nxBulkBar({
      actions: [
        { id: 'add', label: 'Add to sequence', icon: 'send', disabled: none, reason: why, onClick: () => nxToast({ message: 'Not part of this prototype' }) },
        { id: 'tags', label: 'Tags', icon: 'tag', menu: true, disabled: none, reason: why, onClick: (btn) => openTagsMenu(btn) },
        { id: 'verify', label: 'Verify emails', icon: 'shield-check', disabled: none, reason: why, onClick: () => openVerify() },
      ],
      risky: [
        { id: 'unsub', label: 'Unsubscribe', icon: 'unavailable', disabled: none, reason: why, onClick: () => openUnsub() },
        { id: 'delete', label: 'Delete', count: null, icon: 'trash', disabled: none, reason: why, onClick: () => openDelete() },
      ],
    });
    return bar;
  }
  function openTagsMenu(anchor, opts = {}) {
    return nxStatusMenu({ anchor, label: 'Tags', width: 200, focus: opts.focus, options: [
      { id: 'add', label: 'Add tags', icon: 'math-plus' },
      { id: 'remove', label: 'Remove tags', icon: 'math-minus' },
    ], onPick: (id) => (id === 'remove' ? openTagPicker() : nxToast({ message: 'Not part of this prototype' })) });
  }

  /* ───────── F dialogs ───────── */
  function upsellLine(ctrl) {
    // today's "Wait! No Need to Delete Prospects" upsell, kept as one muted line after the consequence
    const box = ctrl.el.querySelector('.nx-impact');
    box.appendChild(h('<p class="nx-note crm-upsell nx-new">No need to delete to make room: on an upgraded plan you can keep unlimited prospects and pay only for the ones in sequences. <a href="#" data-crm-upgrade>See plans</a></p>'));
    box.querySelector('[data-crm-upgrade]').addEventListener('click', (e) => { e.preventDefault(); nxToast({ message: 'Opens Billing > Upgrade plan (not part of this prototype)' }); });
  }

  function openDelete() {
    const l = selectedList();
    const N = l.length;
    const all = everything() && N > 1;
    const one = N === 1 ? l[0] : null;
    const s = { seq: l.filter(isActiveSeq).length, rep: l.filter((p) => p.replies).length, notes: l.filter((p) => p.notes).length };
    const title = one ? `Delete ${esc(one.first + ' ' + one.last)} from your account?` : all ? `Delete all ${nP(N)} from your account?` : `Delete ${nP(N)} from your account?`;
    const oneSentence = one ? (() => {
      const bits = [];
      if (isActiveSeq(one)) bits.push(`is in ${one.seqs.length === 1 ? `“${esc(one.seqs[0])}”` : `${one.seqs.length} active sequences`}, which they leave`);
      if (one.replies) bits.push('has replied');
      if (one.notes) bits.push('has notes');
      return bits.length ? `${esc(one.first)} ${bits.join(', ').replace(/, ([^,]*)$/, ' and $1')}.` : `${esc(one.first)} is not in an active sequence and has no replies or notes.`;
    })() : null;
    const d = nxImpactDialog(dlg({
      title, tone: 'danger', undoable: { n: N, all },
      rows: one ? [{ label: '', value: 1 }] : [
        { key: 'seq', label: 'In active sequences, removed from them', value: s.seq },
        { key: 'rep', label: 'With replies', value: s.rep },
        { key: 'notes', label: 'With notes', value: s.notes },
      ],
      sentence: one ? oneSentence : (r) => `${r.value === N ? `All ${fmt(N)}` : `${fmt(r.value)} of them`} ${({ seq: 'are in active sequences and are removed from them', rep: 'have replies', notes: 'have notes' })[r.key]}.`,
      consequence: `${one ? `${esc(one.first)} is` : 'They are'} deleted with their activity, replies and notes. You can undo this for 10 seconds; after that they are gone for good.${all ? ' This empties your prospect list.' : ''}`,
      primaryLabel: one ? 'Delete prospect' : all ? `Delete all ${nP(N)}` : `Delete ${nP(N)}`,
      failMessage: { title: `We couldn't delete ${N === 1 ? 'this prospect' : 'these prospects'} because the request timed out.`, body: 'Nothing was deleted. Try again in a minute.' },
      ...(one ? { breakdown: 'ok', breakdownDelay: 0 } : {}),
      onConfirm: () => {
        const ids = l.map((p) => p.id);
        ids.forEach((id) => hidden.add(id));
        clearSel(); render();
        nxUndoToast({
          message: `Deleted ${nP(N)}`,
          undoneMessage: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} back`,
          onUndo: () => { ids.forEach((id) => hidden.delete(id)); clearSel(); render(); },
          onCommit: () => { const set = new Set(ids); DATA = DATA.filter((p) => !set.has(p.id)); ids.forEach((id) => hidden.delete(id)); render(); },
        });
      },
    }));
    if (S.upsell && N >= 10) upsellLine(d.ctrl);
    return d;
  }

  function openUnsub() {
    const sel = selectedList();
    const l = sel.filter((p) => p.status !== 'unsubscribed');
    const already = sel.length - l.length;
    const N = l.length;
    const one = N === 1 ? l[0] : null;
    const inSeq = l.filter(isActiveSeq).length;
    return nxImpactDialog(dlg({
      title: one ? `Unsubscribe ${esc(one.first + ' ' + one.last)} from every sequence?` : `Unsubscribe ${nP(N)} from every sequence?`,
      tone: 'danger', undoable: { n: N, all: everything() && N > 1 }, icon: NX.IMG('unsubscribe-ban.svg'),
      rows: [
        { key: 'seq', label: 'In active sequences, which stop', value: inSeq },
        { key: 'none', label: 'Not in an active sequence', value: N - inSeq },
      ],
      sentence: (r) => (one ? (r.key === 'seq' ? `${esc(one.first)} is in an active sequence, which stops.` : `${esc(one.first)} is not in an active sequence.`)
        : r.key === 'seq' ? `All ${fmt(N)} are in active sequences, which stop.` : `None of them are in an active sequence.`),
      note: already ? `${nP(already)} ${already === 1 ? 'is' : 'are'} already unsubscribed and ${already === 1 ? 'stays' : 'stay'} as ${already === 1 ? 'it is' : 'they are'}.` : null,
      consequence: 'No sequence will email them again. You can undo this for 10 seconds.',
      primaryLabel: one ? 'Unsubscribe prospect' : `Unsubscribe ${nP(N)}`,
      failMessage: { title: `We couldn't unsubscribe ${N === 1 ? 'this prospect' : 'these prospects'} because the request timed out.`, body: 'Nobody was unsubscribed. Try again in a minute.' },
      ...(one ? { breakdown: 'ok', breakdownDelay: 0 } : {}),
      onConfirm: () => {
        const prev = l.map((p) => [p, p.status]);
        l.forEach((p) => { p.status = 'unsubscribed'; });
        clearSel(); render();
        nxUndoToast({
          message: `Unsubscribed ${nP(N)}`,
          undoneMessage: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} subscribed again`,
          onUndo: () => { prev.forEach(([p, st]) => { p.status = st; }); clearSel(); render(); },
          onCommit: () => {},
        });
      },
    }));
  }

  function openTagPicker(preset) {
    const sel = selectedList();
    // add-remove-tag.tsx removableTags: every tag when "select all", else tags present on the selected rows
    const removable = S.all ? ALL_TAGS : ALL_TAGS.filter((t) => sel.some((p) => p.tags.some((x) => x.id === t.id)));
    return window.CRM_TAG_PICKER(removable, (tags, close) => {
      if (S.view === 'today') { close(); todayApply('tags', tags); return; }
      close();
      openRemoveTags(tags);
    }, preset);
  }

  function openRemoveTags(tags) {
    const l = selectedList();
    const N = l.length;
    const ids = new Set(tags.map((t) => t.id));
    const has = (p, t) => p.tags.some((x) => x.id === t.id);
    const neither = l.filter((p) => !p.tags.some((x) => ids.has(x.id))).length;
    // count only what changes: tags at least one selected prospect has, prospects that have at least one picked tag
    const hit = tags.filter((t) => l.some((p) => has(p, t)));
    const eff = hit.length ? hit : tags;
    const K = eff.length;
    const M = N - neither;
    const who = M === 1 ? l.find((p) => p.tags.some((x) => ids.has(x.id))) || l[0] : null;
    const tagWord = K === 1 ? `the tag “${esc(eff[0].name)}”` : `${K} tags`;
    const toWord = who ? esc(who.first + ' ' + who.last) : nP(M);
    return nxImpactDialog(dlg({
      title: `Remove ${tagWord} from ${toWord}?`,
      tone: 'primary',
      rows: eff.slice(0, 4).map((t) => ({ key: t.id, label: `Have “${esc(t.name)}”`, value: l.filter((p) => has(p, t)).length })),
      sentence: (r) => (r.value === M ? `All ${fmt(M)} have it.` : `${fmt(r.value)} of them ${r.value === 1 ? 'has' : 'have'} it.`),
      note: neither ? `${nP(neither)} ${neither === 1 ? 'has' : 'have'} none of these tags and ${neither === 1 ? 'stays' : 'stay'} as ${neither === 1 ? 'it is' : 'they are'}.` : null,
      consequence: 'The tags come off these prospects only; the tags themselves stay. You can undo this for 10 seconds.',
      primaryLabel: `Remove ${K === 1 ? 'tag' : `${K} tags`}${M > 1 ? ` from ${nP(M)}` : ''}`,
      failMessage: { title: 'We couldn\'t remove these tags because the request timed out.', body: 'No tags were removed. Try again in a minute.' },
      onConfirm: () => {
        const prev = l.map((p) => [p, p.tags.slice()]);
        l.forEach((p) => { p.tags = p.tags.filter((x) => !ids.has(x.id)); });
        clearSel(); render();
        nxUndoToast({
          message: `Removed ${K === 1 ? `“${esc(eff[0].name)}”` : `${K} tags`} from ${toWord}`,
          undoneMessage: K === 1 ? `Undone. The tag is back on ${toWord}` : `Undone. The tags are back on ${toWord}`,
          onUndo: () => { prev.forEach(([p, t]) => { p.tags = t; }); clearSel(); render(); },
          onCommit: () => {},
        });
      },
    }));
  }

  /* ───────── AI column (row 16) ───────── */
  function aiOptions() {
    const n = selCount();
    const total = list().length;
    const existing = !!aiCol;
    const empty = list().filter((p) => !p.opener).length;
    const o = [
      { key: '10-rows', label: existing ? 'Override &amp; Update 10 Rows' : 'Save &amp; Run For 10 Rows', rows: 10, credits: 10 * PER_ROW, target: () => list().slice(0, 10) },
      { key: 'all-prospects', label: existing ? 'Override &amp; Update All Rows' : 'Save &amp; Run For All Rows', rows: total, credits: total * PER_ROW, target: () => list() },
    ];
    if (n > 0) o.push({ key: 'selected-row', label: existing ? 'Override &amp; Update Selected Rows' : 'Save &amp; Run For Selected Rows', rows: n, credits: n * PER_ROW, target: () => selectedList() });
    if (existing) o.push({ key: 'empty-rows', label: 'Update Empty Rows', rows: null, emptyRows: empty, target: () => list().filter((p) => !p.opener) });
    o.push({ key: 'dont-run', label: 'Save &amp; Don’t Run' });
    return o;
  }

  let drawer = null;
  function openAiDrawer() {
    if (drawer) drawer.close();
    drawer = window.CRM_AI_DRAWER({
      title: AI, column: AI, existing: !!aiCol, have: HAVE(), options: aiOptions(),
      onPick: (op, d) => onAiPick(op),
    });
    return drawer;
  }

  function startRun(rowsList, opts = {}) {
    if (drawer) { drawer.close(); drawer = null; }
    if (!aiCol) { aiCol = AI; DATA.forEach((p) => { p.opener = ''; }); } // a new column starts empty
    const target = new Set(rowsList.map((p) => p.id));
    loadingIds = target;
    clearSel(); render();
    setTimeout(() => {
      // values fill in as they are ready
      DATA.forEach((p, i) => { if (target.has(p.id)) p.opener = OPENERS[(i + 2) % OPENERS.length].replace('{c}', p.company); });
      loadingIds = null; render();
    }, opts.delay || 2600);
  }

  function onAiPick(op) {
    if (op.key === 'dont-run') { if (drawer) { drawer.close(); drawer = null; } if (!aiCol) { aiCol = AI; DATA.forEach((p) => { p.opener = ''; }); } render(); nxToast({ message: 'Column saved. Nothing was run.' }); return null; }
    const rowsList = op.target();
    if (S.view === 'today') {
      // Today: runs on click; on an existing column the override warning comes first (no row count)
      if (aiCol && op.key !== 'empty-rows') return window.CRM_TODAY_OVERRIDE(() => startRun(rowsList));
      startRun(rowsList); return null;
    }
    if (aiCol && op.key !== 'empty-rows') return openOverwrite(op, rowsList);
    return openCost(rowsList);
  }

  // L: verifying emails spends verifier credits, so the total comes first (1 credit per email, as in Email Verifier)
  function openVerify() {
    const N = selCount();
    const have = HAVE();
    return nxCostDialog({
      title: `Verify emails for ${nP(N)}?`,
      items: [{ label: 'Credits this uses', credits: N }],
      have,
      primaryLabel: `Verify ${fmt(N)} ${plural(N, 'email', 'emails')}`,
      partial: have > 0 ? { label: `Verify ${fmt(have)} emails`, onConfirm: () => { clearSel(); render(); nxToast({ message: `Verifying ${fmt(have)} emails. This is a prototype: nothing is checked.`, variant: 'info', delay: 4000 }); } } : null,
      onBuy: () => nxToast({ message: 'Opens Billing > Email Verifier credits (not part of this prototype)' }),
      submit: S.result, submitDelay: window.CRM_SD,
      failMessage: { title: 'No credits were used.', body: 'The check did not start because the request timed out. Try again.' },
      onConfirm: () => { clearSel(); render(); nxToast({ message: `Verifying ${fmt(N)} ${plural(N, 'email', 'emails')}. This is a prototype: nothing is checked.`, variant: 'info', delay: 4000 }); },
    });
  }

  // L: total cost before any spend
  function openCost(rowsList) {
    const N = rowsList.length;
    const have = HAVE();
    return nxCostDialog({
      title: `Run ${QAI} on ${nR(N)}?`,
      items: [{ label: 'Credits this uses', credits: N * PER_ROW }],
      have,
      consequence: 'Credits are an estimate; the final count depends on how long each answer is.',
      primaryLabel: `Run on ${nR(N)}`,
      partial: { label: `Run on ${nR(Math.floor(have / PER_ROW))}`, onConfirm: () => startRun(rowsList.slice(0, Math.floor(have / PER_ROW))) },
      onBuy: () => nxToast({ message: 'Opens Billing > AI credits (not part of this prototype)' }),
      submit: S.result, submitDelay: window.CRM_SD,
      failMessage: { title: 'No credits were used.', body: 'The run did not start because the request timed out. Try again.' },
      onConfirm: () => startRun(rowsList),
    });
  }

  // F + L: overwrite an existing column. Page-local: nxCostDialog has no breakdown rows, so this composes nxDialog.
  function openOverwrite(op, rowsList) {
    const N = rowsList.length;
    const have = HAVE();
    const uses = N * PER_ROW;
    const short = Math.max(0, uses - have);
    const replaced = rowsList.filter((p) => p.opener).length;
    const body = h('<div class="nx-impact nx-new"><div class="nx-breakdown" aria-live="polite"></div><dl class="nx-rows crm-credit-rows"></dl><p class="nx-consequence"></p></div>');
    const bd = body.querySelector('.nx-breakdown');
    bd.innerHTML = '<dl class="nx-rows" aria-busy="true" aria-label="Counting"><div class="nx-row"><dt><span class="react-loading-skeleton nx-skel-l"></span></dt><dd><span class="react-loading-skeleton"></span></dd></div><div class="nx-row"><dt><span class="react-loading-skeleton nx-skel-l"></span></dt><dd><span class="react-loading-skeleton"></span></dd></div></dl>';
    // same spend lines as nxCostDialog: one sentence for the cost, one for the balance
    body.querySelector('.crm-credit-rows').outerHTML = `<div class="nx-cost" style="display: contents;"><p class="nx-cost-line">This uses <b>${fmt(uses)} ${plural(uses, 'credit', 'credits')}</b>.</p><p class="nx-balance">You have ${fmt(have)} ${plural(have, 'credit', 'credits')}. ${short ? `<b class="nx-cost-short">${fmt(short)} short.</b>` : `<b>${fmt(have - uses)}</b> left after this.`}</p></div>`;
    body.querySelector('.nx-consequence').textContent = 'Current values in this column are replaced with new ones from the latest prompt. This can\'t be undone.';
    const run = (rows) => (c) => {
      c.setError(null); c.setBusy(true);
      setTimeout(() => {
        if (!c.el.isConnected) return;
        if (S.result === 'fail') { c.setBusy(false); c.setError('<b>No values were replaced and no credits were used.</b>The run did not start because the request timed out. Try again.'); return; }
        c.close('done'); startRun(rows);
      }, window.CRM_SD != null ? window.CRM_SD : 900);
    };
    const partialN = Math.floor(have / PER_ROW);
    const ctrl = nxDialog({
      title: `Replace ${QAI} on ${nR(N)}?`, tone: short ? 'primary' : 'danger', icon: NX.IMG('info-circle-red.svg'),
      body, primaryLabel: short ? 'Buy credits' : `Replace ${nR(N)}`,
      secondary: short ? { label: `Replace ${nR(partialN)}`, onClick: run(rowsList.slice(0, partialN)) } : null,
      onPrimary: short ? (c) => { c.close('done'); nxToast({ message: 'Opens Billing > AI credits (not part of this prototype)' }); } : run(rowsList),
    });
    if (short) { ctrl.secondaryBtn.classList.add('crm-danger-secondary'); }
    const delay = window.CRM_BD != null ? window.CRM_BD : S.breakdown === 'slow' ? 2000 : S.breakdown === 'fail' ? 1200 : 500;
    setTimeout(() => {
      if (!ctrl.el.isConnected) return;
      if (S.breakdown === 'fail') bd.innerHTML = `<p class="nx-loadfail"><img src="${NX.IMG('info-circle-blue.svg')}" alt="">We couldn't load the details. You can still continue.</p>`;
      else bd.innerHTML = NX.renderRows([{ label: 'Values that will be replaced', value: replaced }, { label: 'Empty rows that get a value', value: N - replaced }],
        (r) => (r.label.startsWith('Values') ? `All ${fmt(N)} rows have a value, which is replaced.` : `All ${fmt(N)} rows are empty and get a value.`));
    }, delay);
    return { el: ctrl.el, ctrl, confirm: () => ctrl.confirm(), close: () => ctrl.close('cancel') };
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const sel = (k) => { S.sel = k; shell.setControl('sel', k); applySel(); render(); };
    const bar = (id) => root.querySelector(`.nx-act[data-id="${id}"]`);
    const today = () => { S.view = 'today'; shell.setControl('view', 'today'); };
    const after = (fn, ms) => setTimeout(fn, ms);
    const bdw = () => (window.CRM_BD || 0) + 60;
    const steps = {
      'none': () => {},
      'sel-part': () => sel('4'),
      'sel-page': () => sel('page'),
      'sel-all': () => sel('all'),
      'tags-menu': () => { sel('4'); openTagsMenu(bar('tags') || bar('more'), { focus: false }); },
      'delete': () => { sel(S.sel); openDelete(); },
      'delete-one': () => { S.picked.clear(); S.picked.add(list()[1].id); render(); openDelete(); },
      'delete-submitting': () => { sel(S.sel); const d = openDelete(); after(() => d.confirm(), bdw()); },
      'delete-error': () => { S.result = 'fail'; sel(S.sel); const d = openDelete(); after(() => d.confirm(), bdw()); },
      'unsub': () => { sel(S.sel); openUnsub(); },
      'tags-picker': () => { sel(S.sel); openTagPicker(['Q4 webinar', 'Do not call']); },
      'tags-dialog': () => { sel(S.sel); openRemoveTags([ALL_TAGS[2], ALL_TAGS[4]]); },
      'toast': () => { sel(S.sel); const d = openDelete(); after(() => d.confirm(), bdw()); },
      'undone': () => { sel(S.sel); const d = openDelete(); after(() => { d.confirm(); after(() => document.querySelector('.message-undo').click(), (window.CRM_SD || 0) + 400); }, bdw()); },
      'tags-toast': () => { sel(S.sel); const d = openRemoveTags([ALL_TAGS[2], ALL_TAGS[4]]); after(() => d.confirm(), bdw()); },
      'ai-drawer': () => { sel(S.sel); openAiDrawer(); },
      'ai-menu': () => { sel(S.sel); openAiDrawer().openSave(); },
      'ai-cost': () => { sel(S.sel); openAiDrawer(); onAiPick(aiOptions().find((o) => o.key === (S.sel === 'all' ? 'all-prospects' : 'selected-row'))); },
      'ai-cost-all': () => { sel(S.sel); openAiDrawer(); onAiPick(aiOptions().find((o) => o.key === 'all-prospects')); },
      'ai-running': () => { sel(S.sel); openAiDrawer(); const d = onAiPick(aiOptions().find((o) => o.key === 'all-prospects')); after(() => d.confirm(), 80); },
      'today': () => { today(); sel(S.sel); },
      'today-delete': () => { today(); sel(S.sel); root.querySelector('[aria-label="Delete"]').click(); },
      'today-unsub': () => { today(); sel(S.sel); root.querySelector('[aria-label="Unsubscribe"]').click(); },
      'today-tags': () => { today(); sel(S.sel); root.querySelector('.tag-button-container .tag-icon').click(); },
      'today-tags-picker': () => { today(); sel(S.sel); openTagPicker(['Q4 webinar', 'Do not call']); },
      'today-ai-menu': () => { today(); sel(S.sel); openAiDrawer().openSave(); },
      'today-ai-override': () => { today(); sel(S.sel); openAiDrawer(); onAiPick(aiOptions().find((o) => o.key === 'all-prospects')); },
    };
    if (steps[state]) steps[state]();
  }

  window.CRM_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.CRM_SD = param('sd') != null ? Number(param('sd')) : undefined;
  applySel();
  if (!param('sel') && !param('state')) clearSel();
  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 60);
})();
