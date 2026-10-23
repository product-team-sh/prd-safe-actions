/* CRM > Import via CSV: safe actions prototype (spec row 15, pattern F, no undo).
   Production markup is reproduced from webui main aeda4e3; new elements carry .nx-new.
   URL params: ?action=add|upsert|overwrite|skip &stage=upload|map|review &view=proposed|today
   &breakdown=ok|slow|fail &result=ok|fail &state=<screenshot state> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, param, h, esc } = NX;
  const FILE = 'q4-leads.csv';
  const ROWS = 3000; // data rows in the file (select-file.tsx: importedContactsCount = lines - 1)
  const MATCH = 1204; // rows whose email matches an existing prospect
  const NEW = ROWS - MATCH; // 1,796 new prospects
  // per action: existing prospects whose values change, values a blank cell clears, matched prospects left as they are
  const BD = { upsert: { change: 1118, cleared: 342 }, overwrite: { change: 1032, cleared: 298 } };
  const W = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/';
  const E = 'https://github.com/saleshandy/saleshandy-edge/blob/4617c54245290552db5483f112542b98d6901fc9/src/contacts/';
  const V3 = 'https://github.com/saleshandy/saleshandy-app/blob/b39fe379e855573b193ad996f44ecd8eceb8c595/src/features/sequences/components/ImportContactsModal/';
  const SUCCESS = 'Prospect import has started successfully. Please wait while we import your prospects. You will receive an email notification once the import is completed.';
  const BUSY_MSG = "Prospect Import already in progress, try after it's completed.";

  /* conflict-action.ts L10-39, in production order */
  const ACTIONS = [
    { id: 'add', key: 1, label: 'Add Missing Fields', text: 'Fills in fields that are currently empty using data from the CSV. Existing field data is not changed.' },
    { id: 'upsert', key: 4, label: 'Update All Fields', text: 'Updates existing fields using data from the CSV and adds any that are missing. A blank cell clears the existing value.' },
    { id: 'overwrite', key: 2, label: 'Overwrite', text: 'Updates existing fields using data from the CSV. Fields that are currently empty will not be filled in.' },
    { id: 'skip', key: 3, label: 'Skip Existing Prospects', text: 'Keeps existing prospect field details unchanged and does not apply any updates.' },
  ];
  const actionById = (id) => ACTIONS.find((a) => a.id === id);
  const risky = (id) => id === 'upsert' || id === 'overwrite';

  /* Prospect fields offered in the map list (CRM import drops Company Domain, import-flow.tsx L100-106) */
  const FIELDS = ['Email', 'First Name', 'Last Name', 'Job Title', 'Company', 'Phone Number', 'LinkedIn URL', 'City', 'State', 'Country', 'Website', 'Industry']
    .map((label, i) => ({ key: i + 1, label }));
  const HEADERS = ['Email', 'First Name', 'Last Name', 'Job Title', 'Company', 'Phone Number', 'LinkedIn URL', 'City'];
  const SAMPLE = ['maya.cohen@ledgerloop.io', 'Maya', 'Cohen', 'VP Sales', 'Ledgerloop', '', 'linkedin.com/in/mayacohen', 'Austin'];
  // map-list.tsx auto-maps a header to the field whose label matches it
  const autoKeys = () => HEADERS.map((hd) => (FIELDS.find((f) => f.label.toLowerCase() === hd.toLowerCase()) || {}).key ?? null);

  const S = {
    view: param('view') === 'today' ? 'today' : 'proposed',
    action: ACTIONS.some((a) => a.id === param('action')) ? param('action') : 'upsert',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    stage: ['upload', 'map', 'review'].includes(param('stage')) ? param('stage') : 'map',
    open: true,
    match: 'pending', // feedforward lookup: pending | ok | fail
    keys: autoKeys(),
    busy: false, // Import button loading (no-dialog path)
    nextLocked: false,
  };
  let matchTimer = null;
  const emailMapped = () => S.keys.includes(FIELDS[0].key);
  function lookup() {
    // The match count needs the mapped Email column, so it runs when Map Fields opens and again when Email is re-mapped.
    clearTimeout(matchTimer);
    S.match = 'pending';
    const ms = window.CI_LD != null ? window.CI_LD : S.breakdown === 'slow' ? 2000 : S.breakdown === 'fail' ? 1200 : 500;
    matchTimer = setTimeout(() => { S.match = S.breakdown === 'fail' ? 'fail' : 'ok'; render(); }, ms);
  }

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'crm',
    title: 'Prospects',
    controls: [
      { key: 'action', label: 'After Import', value: S.action, options: [['add', 'Add missing'], ['upsert', 'Update all'], ['overwrite', 'Overwrite'], ['skip', 'Skip']], onChange: (v) => { S.action = v; render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; lookup(); render(); } },
      { key: 'result', label: 'Import', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec row 15. The dialog fires only for "Update All Fields" and "Overwrite", the two actions that replace values on existing prospects. "Add Missing Fields" and "Skip Existing Prospects" change no existing value, so Import works as today. The import runs as a background job and has no undo.',
      rows: [
        { n: 15, surface: 'CRM > Import CSV (same modal on Sequence > Prospects > Import via CSV)', action: 'Import with "Update All Fields" or "Overwrite"', patterns: 'F',
          breakdown: 'Existing prospects that change; values cleared by blank cells (its own row); new prospects added. Matched prospects whose values already equal the file are named in a note. The title count (existing prospects that change) comes from the same lookup as the feedforward line under the dropdown.',
          undo: 'No. The import is a background job ("Prospect import has started successfully…") and changed values are not kept.',
          code: [
            { label: 'conflict-action.ts L10-39 (options; the warning lives only in a hover tooltip)', url: W + 'map-fields/conflict-action.ts#L10-L39' },
            { label: 'map-fields.tsx L287-306 (select, tooltip per option)', url: W + 'map-fields/map-fields.tsx#L287-L306' },
            { label: 'email-verification.tsx L133-193 (Import fires at once)', url: W + 'email-verification/email-verification.tsx#L133-L193' },
            { label: 'edge contacts-import.service.ts L2890-2903 (Overwrite and Update All both write a blank cell over an existing value)', url: E + 'services/contacts-import.service.ts#L2890-L2903' },
            { label: 'edge contacts-import.service.ts L3199-3210 (custom fields: replaced when the value differs, blank included)', url: E + 'services/contacts-import.service.ts#L3199-L3210' },
            { label: 'edge import-contact-helpers.ts L111 (a blank cell becomes "")', url: E + 'helpers/import-contact-helpers.ts#L111' },
          ],
          v3: `saleshandy-app b39fe37 rebuilds the same flow: the action is picked in <a href="${V3}MapFieldsStage/MapFieldsStage.tsx#L84-L103" target="_blank" rel="noopener">MapFieldsStage.tsx L84-103</a> (tooltip only) and Import fires on click in <a href="${V3}ReviewImportStage/ReviewImportStage.tsx#L37-L40" target="_blank" rel="noopener">ReviewImportStage.tsx L37-40</a>. Apply F there too.` },
      ],
      notes: [
        '<b>Overwrite clears values too.</b> The option text says only "Update All Fields" clears on a blank cell, but the backend writes a blank cell over an existing value for Overwrite as well (links above). The dialog shows "Values cleared by blank cells" for both. Fixing the option text is a separate bug.',
        'Feedforward under the dropdown: "1,204 of 3,000 rows match existing prospects." Needs a new backend lookup: the browser has the file but not the account\'s prospects. It needs the mapped Email column, so it runs when Map Fields opens and again if Email is re-mapped; it is hidden while Email is unmapped and when the lookup fails.',
        'The breakdown needs the full mapping and the chosen action (which values differ, which cells are blank), so it is counted when Import is clicked. Dev confirms the lookup can serve 25,000 rows within a few seconds; the dialog opens at once and shows placeholders meanwhile.',
        'If the match lookup failed, the title drops the count ("Import … and update existing prospects?") and the breakdown shows the load-failure line. Import is still allowed.',
        'Import failure keeps the dialog open with the reason. Today the same failure shows an error notification and the modal stays on Review and Import.',
        'The CRM list behind the modal is a stand-in. "Add Prospects" reopens the modal at Upload file with the file chosen, a prototype shortcut for Add Prospects > Import via CSV.',
      ],
    },
  });
  const root = h('<div id="ci-root"></div>');
  shell.body.appendChild(root);

  /* ───────── render ───────── */
  function feedforward() {
    if (S.view === 'today' || !emailMapped()) return '';
    if (S.match === 'pending') return `<p class="ci-ff nx-new" aria-live="polite"><span class="ci-ff-spin" aria-hidden="true"></span>Checking ${fmt(ROWS)} rows against your prospects…</p>`;
    if (S.match === 'ok') return `<p class="ci-ff nx-new" aria-live="polite">${fmt(MATCH)} of ${fmt(ROWS)} rows match existing prospects.</p>`;
    return '';
  }
  function stageHTML() {
    if (S.stage === 'upload') return window.CI_UPLOAD(FILE);
    if (S.stage === 'review') return window.CI_REVIEW(S.busy);
    return window.CI_MAP({ headers: HEADERS, sample: SAMPLE, keys: S.keys, fields: FIELDS, conflictLabel: actionById(S.action).label, conflictOpen: openMenu === 'conflict', openRow: typeof openMenu === 'number' ? openMenu : -1, ff: feedforward() });
  }
  function render() {
    closeTip();
    root.innerHTML = window.CI_CRM(14820) + (S.open ? window.CI_MODAL(window.CI_FLOW(S.stage, stageHTML())) : '');
    wire();
    if (openMenu != null) placeMenu();
    NX.settle(root);
  }

  function goStage(st) {
    S.stage = st;
    closeMenu();
    if (st === 'map' && S.match !== 'ok') lookup();
    if (st === 'review' && S.match === 'pending') lookup();
    render();
  }

  function closeModal() { closeMenu(); S.open = false; S.busy = false; render(); }

  function wire() {
    const q = (sel) => root.querySelector(sel);
    root.querySelectorAll('[data-ci="close"]').forEach((b) => b.addEventListener('click', closeModal));
    const open = q('[data-ci="open"]');
    if (open) open.addEventListener('click', () => { S.open = true; goStage('upload'); });
    root.querySelectorAll('[data-ci-noop]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); nxToast({ message: 'Not part of this prototype' }); }));
    const next = q('[data-ci="next"]');
    if (next) {
      next.disabled = S.nextLocked;
      if (S.nextLocked) next.classList.add('shd-button--disabled');
      next.addEventListener('click', () => {
        if (S.stage === 'upload') { goStage('map'); return; }
        // map-fields.tsx L104-115: Email must be mapped
        if (!emailMapped()) {
          nxToast({ message: 'Email field must be mapped', variant: 'error' });
          S.nextLocked = true; render();
          setTimeout(() => { S.nextLocked = false; render(); }, 2000);
          return;
        }
        goStage('review');
      });
    }
    const imp = q('[data-ci="import"]');
    if (imp) imp.addEventListener('click', onImport);
    const conflict = q('[data-ci="conflict"]');
    if (conflict) {
      conflict.addEventListener('click', () => toggleMenu('conflict'));
      conflict.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); toggleMenu('conflict', true); } });
    }
    root.querySelectorAll('[data-ci-field]').forEach((b) => {
      const i = Number(b.getAttribute('data-ci-field'));
      b.addEventListener('click', () => toggleMenu(i));
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); toggleMenu(i, true); } });
    });
    root.querySelectorAll('[data-ci-unmap]').forEach((b) => {
      const go = () => { const i = Number(b.getAttribute('data-ci-unmap')); const wasEmail = S.keys[i] === FIELDS[0].key; S.keys[i] = null; if (wasEmail) clearTimeout(matchTimer); render(); };
      b.addEventListener('click', go);
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    // backdrop="static" in production (ui/modal.tsx): clicking outside the import modal does nothing
  }

  /* ───────── dropdowns (design-system Select + Transfer) ───────── */
  let openMenu = null; // 'conflict' | row index
  let menuEl = null;
  function toggleMenu(which, focus) {
    if (openMenu === which) { closeMenu(); render(); return; }
    openMenu = which; render();
    if (focus && menuEl) { const a = menuEl.querySelector('li.active') || menuEl.querySelector('li'); a && a.focus(); }
  }
  function closeMenu() { openMenu = null; if (menuEl) { menuEl.remove(); menuEl = null; } closeTip(); }
  function placeMenu() {
    if (menuEl) menuEl.remove();
    const bar = openMenu === 'conflict' ? root.querySelector('[data-ci="conflict"]') : root.querySelector(`[data-ci-field="${openMenu}"]`);
    if (!bar) { openMenu = null; return; }
    const r = bar.getBoundingClientRect();
    let html;
    if (openMenu === 'conflict') {
      html = window.CI_TRANSFER({ cls: 'conflict-action-select', width: r.width, selectedKey: actionById(S.action).key,
        items: ACTIONS.map((a) => ({ key: a.key, html: `<div class="conflict-action-option semibold-10" data-ci-tip="${esc(a.text)}" data-ci-tip-place="right">${a.label}</div>` })) });
    } else {
      const cur = S.keys[openMenu];
      html = window.CI_TRANSFER({ cls: 'map-field-select', width: r.width, selectedKey: cur,
        items: FIELDS.filter((f) => !S.keys.includes(f.key) || f.key === cur).map((f) => ({ key: f.key, html: `<span class="" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; display: inline-block; min-width: 0px; max-width: 100%;">${esc(f.label)}</span>` })) });
    }
    menuEl = h(html);
    menuEl.classList.add('ci-pop');
    document.body.appendChild(menuEl);
    const mh = menuEl.offsetHeight;
    const below = r.bottom + mh <= window.innerHeight - 8;
    menuEl.style.left = r.left + 'px';
    menuEl.style.top = (below ? r.bottom : r.top - mh) + 'px';
    menuEl.querySelectorAll('[data-ci-opt]').forEach((li) => {
      const pick = () => {
        const key = Number(li.getAttribute('data-ci-opt'));
        if (openMenu === 'conflict') { S.action = ACTIONS.find((a) => a.key === key).id; shell.setControl('action', S.action); }
        else { const wasEmail = key === FIELDS[0].key || S.keys[openMenu] === FIELDS[0].key; S.keys[openMenu] = key; if (wasEmail && emailMapped()) lookup(); }
        const which = openMenu;
        closeMenu(); render();
        const back = which === 'conflict' ? root.querySelector('[data-ci="conflict"]') : root.querySelector(`[data-ci-field="${which}"]`);
        if (back) back.focus({ preventScroll: true });
      };
      li.addEventListener('click', pick);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const all = [...menuEl.querySelectorAll('li')]; const i = all.indexOf(li); const n = all[(i + (e.key === 'ArrowDown' ? 1 : all.length - 1)) % all.length]; n.focus(); }
      });
      li.addEventListener('focus', () => { const t = li.querySelector('[data-ci-tip]'); if (t) showTip(t); });
    });
  }
  document.addEventListener('mousedown', (e) => {
    if (openMenu == null) return;
    if (menuEl && menuEl.contains(e.target)) return;
    if (e.target.closest && e.target.closest('[data-ci="conflict"], [data-ci-field]')) return;
    closeMenu(); render();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openMenu != null) { e.stopPropagation(); closeMenu(); render(); return; }
    // react-bootstrap Modal keyboard default: Esc closes the import modal (impact dialogs catch Esc first)
    if (S.open && !S.busy && !document.querySelector('.nx-modal-root')) closeModal();
  });
  window.addEventListener('resize', () => { if (openMenu != null) placeMenu(); });

  /* ───────── production tooltip (OverlayTooltip), right or bottom ───────── */
  let tipEl = null;
  function showTip(t) {
    closeTip();
    const place = t.getAttribute('data-ci-tip-place') || 'bottom';
    tipEl = h(`<div role="tooltip" class="fade tooltip-md tooltip bs-tooltip-${place} show ci-tip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`);
    tipEl.querySelector('.tooltip-inner').textContent = t.getAttribute('data-ci-tip');
    document.body.appendChild(tipEl);
    const anchor = place === 'right' ? (t.closest('li') || t) : t;
    const r = anchor.getBoundingClientRect();
    const w = tipEl.offsetWidth, ht = tipEl.offsetHeight;
    const arrow = tipEl.querySelector('.arrow');
    if (place === 'right') {
      tipEl.style.left = r.right + 'px';
      const top = Math.max(8, r.top + r.height / 2 - ht / 2);
      tipEl.style.top = top + 'px';
      arrow.style.top = (r.top + r.height / 2 - top - 6) + 'px';
    } else {
      const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8));
      tipEl.style.left = left + 'px';
      tipEl.style.top = r.bottom + 'px';
      arrow.style.left = (r.left + r.width / 2 - left - 6) + 'px';
    }
  }
  function closeTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
  document.addEventListener('mouseover', (e) => { const t = e.target.closest && e.target.closest('[data-ci-tip]'); if (t) showTip(t); });
  document.addEventListener('mouseout', (e) => { const t = e.target.closest && e.target.closest('[data-ci-tip]'); if (t && !t.contains(e.relatedTarget)) closeTip(); });

  /* ───────── Import ───────── */
  function onImport() {
    if (S.view === 'proposed' && risky(S.action)) { openDialog(); return; }
    // Today, and the safe actions in Proposed: no dialog. Button shows "Importing..." until the request returns.
    S.busy = true; render();
    setTimeout(() => {
      if (!S.open) return;
      if (S.result === 'fail') { S.busy = false; render(); nxToast({ message: BUSY_MSG, variant: 'error', delay: 8000 }); return; }
      closeModal();
      nxToast({ message: SUCCESS, delay: 6000 });
    }, window.CI_SD != null ? window.CI_SD : 900);
  }

  function openDialog() {
    const a = S.action;
    const b = BD[a];
    const known = S.match === 'ok';
    const verb = a === 'overwrite' ? 'overwrite' : 'update';
    const qf = `<span class="ci-nowrap">“${FILE}”</span>`;
    const title = known ? `Import ${qf} and ${verb} ${fmt(b.change)} existing prospects?` : `Import ${qf} and ${verb} existing prospects?`;
    const same = MATCH - b.change;
    return nxImpactDialog({
      title, tone: 'danger', icon: NX.IMG('info-circle-red.svg'),
      rows: [
        { key: 'change', label: 'Existing prospects that change', value: b.change },
        { key: 'cleared', label: 'Values cleared by blank cells', value: b.cleared },
        { key: 'new', label: 'New prospects added', value: NEW },
      ],
      note: same > 0 ? `${fmt(same)} existing ${same === 1 ? 'prospect already matches the file and stays as it is' : 'prospects already match the file and stay as they are'}.` : null,
      consequence: 'Values in the file replace what these prospects have now, and blank cells clear them. This can\'t be undone.',
      primaryLabel: known ? `Import and ${verb} ${fmt(b.change)} prospects` : `Import and ${verb} existing prospects`,
      breakdown: S.breakdown, submit: S.result,
      breakdownDelay: window.CI_BD, submitDelay: window.CI_SD,
      failMessage: { title: 'We couldn\'t start the import because another import is still running.', body: 'Try again once it finishes. Nothing has changed yet.' },
      onConfirm: () => { closeModal(); nxToast({ message: SUCCESS, delay: 6000 }); },
    });
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const later = (fn, ms) => setTimeout(fn, ms);
    const bd = () => (window.CI_BD || 0) + 60;
    const steps = {
      'map': () => {},
      'menu': () => { toggleMenu('conflict'); },
      'menu-tip': () => { toggleMenu('conflict'); later(() => { const t = menuEl && menuEl.querySelector('[data-ci-opt="4"] [data-ci-tip]'); if (t) showTip(t); }, 30); },
      'field-menu': () => { toggleMenu(5); },
      'unmapped': () => { S.keys[0] = null; render(); },
      'review': () => goStage('review'),
      'upload': () => goStage('upload'),
      'dialog': () => { goStage('review'); openDialog(); },
      'dialog-submitting': () => { goStage('review'); const d = openDialog(); later(() => d.confirm(), bd()); },
      'dialog-error': () => { S.result = 'fail'; goStage('review'); const d = openDialog(); later(() => d.confirm(), bd()); },
      'done': () => { goStage('review'); const d = openDialog(); later(() => d.confirm(), bd()); },
      'importing': () => { goStage('review'); onImport(); },
      'imported': () => { goStage('review'); onImport(); },
      'import-error': () => { S.result = 'fail'; goStage('review'); onImport(); },
      'closed': () => closeModal(),
    };
    // states run once the match lookup has settled, as they would after a user has passed through Map Fields
    const go = () => (S.match === 'pending' ? setTimeout(go, 50) : steps[state] && steps[state]());
    go();
  }

  window.CI_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.CI_SD = param('sd') != null ? Number(param('sd')) : undefined;
  window.CI_LD = param('ld') != null ? Number(param('ld')) : undefined;
  if (S.stage === 'map' || S.stage === 'review') lookup();
  render();
  document.fonts && document.fonts.ready.then(() => { if (openMenu != null) placeMenu(); });
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
