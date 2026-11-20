/* Sequence list: safe actions prototype (spec row 5: bulk Pause / Resume, up to 100 sequences; patterns A, F, H).
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3 (sequence-list-markup.js);
   new elements carry .nx-new.
   URL params: ?sel=0|3|12|all &view=proposed|today &breakdown=ok|slow|fail &result=ok|fail &state=<screenshot state>
   &bd=<ms breakdown delay> &sd=<ms submit delay> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const PAGE = 25;
  const CAP = 100; // constants.SELECTED_SEQUENCE_LIMIT
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/';
  const FB = C + 'components/sequence-list-content/components/sequence-list-filter-bar/sequence-list-filter-bar.tsx';
  const CT = C + 'components/sequence-list-content/sequence-list-content.tsx';
  const TB = C + 'components/sequence-list-content/components/sequence-list-table/sequence-list-table.tsx';
  const MD = C + 'shared/modals/pause-resume-sequence-modal/pause-resume-sequence-modal.tsx';
  const RP = C + 'components/sequence-list-content/components/sequence-action-report-modal.tsx';

  /* ───────── scenario ───────── */
  const S = {
    sel0: ['0', '3', '12', 'all'].includes(param('sel')) ? param('sel') : '0',
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    page: 0,
    sel: new Set(),
    all: false, // "Select all 30" across pages (proposed only)
  };

  /* ───────── data: 30 sequences of an agency account, newest first ───────── */
  const CLIENTS = { L: 'Ledgerloop', B: 'Brightforge', Q: 'Quillstack', N: 'Northbeam', S: 'Shipyard HQ', H: 'Harborly' };
  const OWNERS = ['Riya Mehta', 'Karan Desai', 'Ana Silva'];
  // title, client, paused?, subsequences, steps, total prospects, pause reason
  const ROWS = [
    ['Q4 SaaS founders, US', 'L', 0, ['Replied, not interested', 'Opened 3+, no reply'], 6, 640],
    ['CFO outreach, mid-market', 'L', 0, [], 5, 412],
    ['Agency owners, UK', 'B', 0, ['No reply after step 4'], 4, 286],
    ['Webinar follow-up, Oct 15', 'Q', 0, [], 3, 158],
    ['Series A founders, fintech', 'N', 0, [], 5, 534],
    ['Shopify brands, 1M to 10M GMV', 'S', 0, [], 6, 1180],
    ['Heads of RevOps, EU', 'Q', 0, ['Clicked pricing link'], 5, 322],
    ['Re-engage closed-lost, Q3', 'B', 0, [], 3, 96],
    ['Dental clinics, Texas', 'H', 0, [], 4, 710],
    ['Product-led growth leaders', 'N', 0, ['Booked, no show'], 5, 268],
    ['HR tech buyers, DACH', 'S', 0, [], 4, 455],
    ['Event attendees, SaaStr', 'L', 0, [], 3, 214],
    ['Logistics managers, Midwest', 'H', 0, [], 5, 388],
    ['Partner webinar, EMEA', 'Q', 1, [], 4, 176, 'Paused because the email account linked to this sequence was disconnected.'],
    ['VP Sales, 50 to 200 employees', 'B', 0, [], 6, 940],
    ['Recruiters, staffing agencies', 'S', 1, ['Out of office'], 4, 302],
    ['Cold list, Apollo import', 'N', 0, [], 3, 1620],
    ['Real estate brokers, Florida', 'H', 1, [], 5, 488],
    ['Founders, YC W24', 'L', 0, [], 4, 132],
    ['Marketing directors, healthcare', 'Q', 1, [], 5, 366],
    ['Free trial nudges, Sep', 'B', 0, [], 3, 84],
    ['IT managers, public sector', 'S', 1, [], 6, 512],
    ['Accounting firms, Canada', 'H', 0, [], 4, 276],
    ['Ecommerce ops, APAC', 'N', 1, ['Replied, positive'], 5, 690],
    ['Conference follow-up, Dreamforce', 'L', 0, [], 3, 248],
    ['Law firms, New York', 'H', 1, [], 4, 342],
    ['Churned customers, win-back', 'B', 1, [], 3, 118],
    ['Construction suppliers, Ohio', 'S', 0, [], 5, 604],
    ['Insurance agents, Q2', 'N', 0, [], 4, 830],
    ['Podcast guests outreach', 'Q', 0, [], 2, 46],
  ];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const stamp = (daysAgo, hh, mm) => {
    const d = new Date(2026, 9, 22 - daysAgo);
    const h12 = ((hh + 11) % 12) + 1;
    return `${String(d.getDate()).padStart(2, '0')} ${MON[d.getMonth()]} ${d.getFullYear()}, ${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`;
  };
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function build() {
    const r = rng(7);
    return ROWS.map(([title, c, paused, subs, steps, total, reason], i) => {
      const contacted = Math.round(total * (0.55 + r() * 0.4));
      const progressed = Math.round(contacted * (0.2 + r() * 0.5));
      const opened = Math.round(contacted * (0.35 + r() * 0.3));
      const replied = Math.round(contacted * (0.03 + r() * 0.07));
      const positive = Math.round(replied * (0.25 + r() * 0.35));
      const inProgress = total - progressed - replied;
      return {
        id: i + 1, title, client: CLIENTS[c], owner: OWNERS[i % 3], progress: paused ? 'paused' : 'active', reason: reason || (paused ? 'Paused manually.' : ''),
        subs: subs.map((t) => ({ title: t, progress: paused ? 'paused' : 'active' })), steps, total, contacted, progressed,
        pct: total ? Math.round((progressed / total) * 100) : 0,
        opened, openedPct: contacted ? Math.round((opened / contacted) * 100) : 0,
        replied, repliedPct: contacted ? Math.round((replied / contacted) * 100) : 0,
        positive, positivePct: replied ? Math.round((positive / replied) * 100) : 0,
        accounts: 1 + ((i * 7) % 5), score: 38 + ((i * 17) % 58),
        inProgress, nextHour: paused ? 0 : Math.round(inProgress * (0.04 + r() * 0.06)), sendToday: paused ? Math.round(inProgress * (0.1 + r() * 0.1)) : 0,
        canResume: !reason,
        createdAt: stamp(2 + i * 2, 9 + (i % 8), (i * 13) % 60), pausedAt: paused ? stamp(1 + (i % 5), 10 + (i % 7), (i * 7) % 60) : null,
      };
    });
  }
  let DATA = build();
  const hidden = new Set(); // deleted

  const list = () => DATA.filter((s) => !hidden.has(s.id));
  const selectedList = () => (S.all ? list().slice(0, CAP) : list().filter((s) => S.sel.has(s.id)));
  const selCount = () => selectedList().length;
  const clearSel = () => { S.sel.clear(); S.all = false; if (typeof shell !== 'undefined') shell.setControl('sel', '0'); };
  function applySel0(v) {
    clearSel(); S.page = 0; S.sel0 = v;
    if (typeof shell !== 'undefined') shell.setControl('sel', v);
    if (v === 'all') { if (S.view === 'proposed') S.all = true; else list().forEach((s) => S.sel.add(s.id)); }
    else list().slice(0, Number(v)).forEach((s) => S.sel.add(s.id));
  }

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'sequences',
    title: 'Sequences',
    controls: [
      { key: 'sel', label: 'Selected', value: S.sel0, options: [['0', 'None'], ['3', '3'], ['12', '12'], ['all', 'All 30']], onChange: (v) => { S.sel0 = v; applySel0(v); render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; if (v === 'today' && S.all) { S.all = false; list().slice(0, CAP).forEach((s) => S.sel.add(s.id)); } render(); } },
    ],
    devNotes: {
      intro: 'Spec row 5. The bulk bar acts on up to 100 sequences (constants.SELECTED_SEQUENCE_LIMIT). The breakdown counts (prospects in progress, subsequences) come from the backend before the dialog opens. Undo needs the bulk pause or resume to start only after 10 seconds and be cancellable until then; the bulk endpoints already return per-sequence success and failure counts.',
      rows: [
        { n: 5, surface: 'Sequence list', action: 'Bulk Pause, bulk Resume, row switch', patterns: 'A B F H', breakdown: 'No names list: the selected rows stay visible behind the dialog. Pause: prospects in progress who stop getting emails, subsequences (keep sending, or pause too when the checkbox is on). Resume: prospects in progress who start getting emails again. Sequences the action does not apply to are named in a note, including any that cannot resume because their email account is disconnected.', undo: 'Yes, 10 seconds',
          code: [
            { label: 'sequence-list-filter-bar.tsx L180-218 (icon-only Pause and Resume, red "Delete N Sequences")', url: FB + '#L180-L218' },
            { label: 'pause-resume-sequence-modal.tsx L38-67 ("Are you sure you want to pause the Sequence?", Yes / No)', url: MD + '#L38-L67' },
            { label: 'sequence-list-content.tsx L409-436 (bulk handler) and L723-736 (checkbox always shown, no count)', url: CT + '#L409-L436' },
            { label: 'sequence-list-content.tsx L238-286 then sequence-action-report-modal.tsx (stats after the fact)', url: CT + '#L238-L286' },
            { label: 'sequence-list-table.tsx L349-392, L1301-1324 (row switch opens the same modal)', url: TB + '#L1301-L1324' },
            { label: 'sequence-list-table.tsx L1252-1263, L1476-1497 (banner "3 Sequences selected.")', url: TB + '#L1252-L1263' },
            { label: 'sequence-action-report-modal.tsx', url: RP },
          ] },
      ],
      notes: [
        'Selection banner (A): header checkbox selects the page (25); "Select all 30" selects every sequence matching the list, up to 100. Over 100: "First 100 of N sequences are selected. You can act on up to 100 at a time."',
        'Bulk bar (B): Pause and Resume are labelled and blue on hover; "Delete" (no count) is the only red action, after a divider. In the proposed view it opens the impact dialog (F), with no undo: "This can\'t be undone." Today\'s typed "delete" stays inside F (product decision 23 Oct 2026), under the breakdown: the red primary stays disabled until it matches, and initial focus goes to the field. The Today view keeps its own typed modal unchanged.',
        'Counts in titles are what the action changes: "Pause 22 sequences?" when 8 of the 30 selected are already paused. The note under the breakdown names the rest.',
        'Resume never offers a sequence whose email account is disconnected: it is named in the note and stays paused, instead of failing afterwards in the "Action Stats" modal.',
        'The row switch goes through the same dialog, naming the one sequence. One sequence needs no lookup if the list payload carries its in-progress and next-hour counts; otherwise it shows the same counting state.',
        'After confirm the switches flip at once and the toast offers Undo for 10 seconds; Undo puts every sequence (and any subsequence paused with it) back. The "Action Stats" modal is no longer needed; if some sequences still fail at commit, a toast names how many and why.',
      ],
    },
  });
  const root = h('<div id="sl-root"></div>');
  shell.body.appendChild(root);

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu();
    const all = list();
    const pages = Math.max(1, Math.ceil(all.length / PAGE));
    if (S.page >= pages) S.page = pages - 1;
    const pageRows = all.slice(S.page * PAGE, S.page * PAGE + PAGE);
    const sel = new Set(selectedList().map((s) => s.id));
    const isSel = (s) => sel.has(s.id);
    root.innerHTML = window.SL_PAGE({ rows: pageRows, isSel, total: all.length, page: S.page, pages, pageSize: PAGE, anySelected: sel.size > 0 });
    root.classList.toggle('sl-today', S.view === 'today');
    const host = root.querySelector('[data-sl="bulk"]');
    if (S.view === 'today') { host.innerHTML = window.SL_TODAY_BULK(sel.size); wireTodayBulk(); } else host.appendChild(proposedBar());
    // banner
    const bh = root.querySelector('[data-sl="banner"]');
    if (sel.size) {
      if (S.view === 'today') bh.innerHTML = window.SL_BANNER(window.SL_TODAY_BANNER_INNER(sel.size));
      else {
        const ban = nxSelectionBanner({
          count: sel.size, total: all.length, pageRows: pageRows.length, allSelected: S.all, cap: CAP,
          noun: 'sequence', plural: 'sequences', scope: 'in this list', mode: 'proposed',
          onSelectAll: () => { S.all = true; S.sel.clear(); render(); },
          onClear: () => { clearSel(); render(); },
        });
        if (ban) {
          // production keeps its yellow ui/Alert here; only the copy and links are new
          const row = ban.querySelector('.nx-banner-row');
          row.querySelectorAll('.divider-vertical').forEach((d) => d.replaceWith(h('<div class="sequence-selection-info--separator"></div>')));
          bh.innerHTML = window.SL_BANNER('<div class="sequence-selection-info--wrapper"></div>');
          bh.querySelector('.sequence-selection-info--wrapper').appendChild(row);
        }
      }
    }
    else if (S.view !== 'today') { bh.innerHTML = window.SL_BANNER('<div class="sequence-selection-info--wrapper"></div>'); bh.querySelector('.sequence-selection-info--wrapper').appendChild(NX.bannerPlaceholder().firstElementChild); bh.firstElementChild.classList.add('nx-banner-ph'); bh.firstElementChild.setAttribute('aria-hidden', 'true'); } // reserved row: no layout shift
    wireTable(pageRows, isSel);
    NX.settle(root);
  }

  function wireTable(pageRows, isSel) {
    const head = root.querySelector('[data-sl="check-all"]');
    if (head) {
      const n = pageRows.filter(isSel).length;
      head.indeterminate = n > 0 && n < pageRows.length;
      head.addEventListener('change', () => {
        if (S.all) { // leaving "all": keep everything except this page's rows
          const keep = list().slice(0, CAP).map((s) => s.id);
          S.all = false; keep.forEach((id) => S.sel.add(id));
        }
        pageRows.forEach((s) => { if (head.checked) { if (S.sel.size < CAP) S.sel.add(s.id); } else S.sel.delete(s.id); });
        render();
      });
    }
    root.querySelectorAll('[data-sl-row]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-sl-row'));
      if (S.all) { S.all = false; list().slice(0, CAP).forEach((s) => S.sel.add(s.id)); }
      if (cb.checked) S.sel.add(id); else S.sel.delete(id);
      render();
    }));
    root.querySelectorAll('[data-sl-switch]').forEach((sw) => sw.addEventListener('click', (e) => {
      e.preventDefault(); // the switch only flips once the action is confirmed
      const s = DATA.find((x) => x.id === Number(sw.getAttribute('data-sl-switch')));
      if (S.view === 'today') todaySingle(s); else openSingle(s);
    }));
    root.querySelectorAll('[data-sl-page]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      const v = b.getAttribute('data-sl-page');
      S.page = v === 'prev' ? S.page - 1 : v === 'next' ? S.page + 1 : Number(v);
      render();
    }));
    const clr = root.querySelector('[data-sl="clear"]');
    if (clr) clr.addEventListener('click', () => { clearSel(); render(); });
    root.querySelectorAll('[data-sl-noop]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); nxToast({ message: 'Not part of this prototype' }); }));
  }

  /* ───────── proposed bar (B) ───────── */
  function proposedBar() {
    const sel = selectedList();
    const n = sel.length;
    const act = sel.filter((s) => s.progress === 'active').length;
    const pau = sel.filter((s) => s.progress === 'paused').length;
    const none = 'Select sequences first';
    const bar = nxBulkBar({
      actions: [
        { id: 'pause', label: 'Pause', icon: 'pause-circle', disabled: !act, reason: n ? 'All selected sequences are already paused' : none, onClick: () => openPause(sel) },
        { id: 'resume', label: 'Resume', icon: 'right-arrow', disabled: !pau, reason: n ? 'None of the selected sequences are paused' : none, onClick: () => openResume(sel) },
      ],
      risky: [{ id: 'delete', label: 'Delete', count: null, icon: 'trash', disabled: !n, reason: none, onClick: () => openDelete(sel) }],
    });
    return bar;
  }

  /* ───────── F dialogs ───────── */
  const q = (s) => `“${esc(s.title)}”`;
  const nS = (n) => `${fmt(n)} ${plural(n, 'sequence', 'sequences')}`;
  const sum = (arr, k) => arr.reduce((a, s) => a + s[k], 0);
  const isEverything = (arr) => arr.length === list().length;
  const dlgCommon = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.SL_BD, submitDelay: window.SL_SD }, o);
  /* Today's "Pause the subsequences as well" checkbox, kept; it now carries the count and updates the breakdown row */
  function subExtra(count, row) {
    let on = false;
    return {
      render(el) {
        el.innerHTML = window.SL_CHECKBOX('', false, 'sl-subcheck');
        el.querySelector('.bs-checkbox-wrapper').insertAdjacentHTML('beforeend', `<span class="checkbox-label-text">Pause the ${count === 1 ? 'subsequence' : `${fmt(count)} subsequences`} as well</span>`);
        el.querySelector('input').addEventListener('change', (e) => {
          on = e.target.checked;
          if (row) {
            row.label = on ? 'Subsequences' : 'Subsequences, which keep sending';
            const dt = document.querySelector('.nx-dialog .sl-subrow dt');
            if (dt) dt.textContent = row.label;
          }
        });
      },
      value() { return on; },
    };
  }

  function commitStatus(arr, to, withSubs, toast) {
    const prev = arr.map((s) => [s, Object.assign({}, s, { subs: s.subs.map((x) => Object.assign({}, x)) })]);
    arr.forEach((s) => {
      s.progress = to;
      s.pausedAt = to === 'paused' ? stamp(0, 15, 42) : null;
      if (to === 'paused') { s.reason = 'Paused manually.'; s.nextHour = 0; }
      if (withSubs) s.subs.forEach((x) => { x.progress = 'paused'; });
    });
    clearSel(); render();
    nxUndoToast({
      message: toast.message, undoneMessage: toast.undone,
      onUndo: () => { prev.forEach(([s, snap]) => Object.assign(s, snap)); clearSel(); render(); },
      onCommit: () => {},
    });
  }

  function openPause(sel, single) {
    const arr = sel.filter((s) => s.progress === 'active');
    const N = arr.length;
    const skipped = sel.length - N;
    const subs = arr.reduce((a, s) => a + s.subs.filter((x) => x.progress === 'active').length, 0);
    const all = !single && isEverything(sel) && skipped === 0;
    const allActive = !single && N === list().filter((s) => s.progress === 'active').length && N > 1;
    const subRow = { key: 'subs', label: 'Subsequences, which keep sending', value: subs, cls: 'sl-subrow' };
    const one = N === 1;
    const o = dlgCommon({
      title: one ? `Pause ${q(arr[0])}?` : all ? `Pause all ${nS(N)}?` : `Pause ${nS(N)}?`,
      tone: 'primary', icon: NX.IMG('pause-circle.svg'),
      rows: [
        { key: 'active', label: 'Prospects in progress who stop getting emails', value: sum(arr, 'inProgress') },
        subRow,
      ],
      sentence: (r) => (r.key === 'active' ? `${fmt(r.value)} ${plural(r.value, 'prospect is', 'prospects are')} in progress and ${r.value === 1 ? 'stops' : 'stop'} getting emails.` : `${fmt(r.value)} ${plural(r.value, 'subsequence keeps', 'subsequences keep')} sending.`),
      note: skipped ? `${nS(skipped)} ${skipped === 1 ? 'is' : 'are'} already paused and ${skipped === 1 ? 'stays' : 'stay'} as ${skipped === 1 ? 'it is' : 'they are'}.` : null,
      extra: subs ? subExtra(subs, subRow) : null,
      consequence: `They stop sending until you resume them.${allActive ? ' Nothing sends from this account until then.' : ''} You can undo this for 10 seconds.`,
      primaryLabel: one ? 'Pause sequence' : `Pause ${nS(N)}`,
      failMessage: { title: `We couldn't pause ${one ? 'this sequence' : 'these sequences'} because ${one ? 'it was' : 'one of them was'} deleted by a teammate.`, body: 'Refresh the page and try again.' },
      onConfirm: (withSubs) => commitStatus(arr, 'paused', withSubs, {
        message: one ? `Paused ${q(arr[0])}` : `Paused ${nS(N)}`,
        undone: one ? `Undone. ${q(arr[0])} is active again` : `Undone. ${nS(N)} are active again`,
      }),
    });
    if (one) {
      const s = arr[0];
      // one sequence: no lookup; the breakdown becomes one sentence from the row's own counts
      o.rows = [{ key: 'one', label: '', value: 1 }];
      o.breakdown = 'ok'; o.breakdownDelay = 0;
      o.sentence = `${fmt(s.inProgress)} ${plural(s.inProgress, 'prospect is', 'prospects are')} in progress. ${s.subs.length ? `Its ${s.subs.length === 1 ? 'subsequence keeps' : `${s.subs.length} subsequences keep`} sending unless you pause ${s.subs.length === 1 ? 'it' : 'them'} too.` : ''}`;
      o.consequence = `It stops sending until you resume it. You can undo this for 10 seconds.`;
      o.onConfirm = (withSubs) => commitStatus(arr, 'paused', withSubs, { message: `Paused ${q(s)}`, undone: `Undone. ${q(s)} is active again` });
    }
    const dlg = nxImpactDialog(o);
    return dlg;
  }

  function openResume(sel, single) {
    const paused = sel.filter((s) => s.progress === 'paused');
    const arr = paused.filter((s) => s.canResume);
    const blocked = paused.filter((s) => !s.canResume);
    const N = arr.length;
    const skipped = sel.length - paused.length;
    const one = N === 1;
    const all = !single && isEverything(sel) && skipped === 0 && !blocked.length;
    const notes = [];
    if (blocked.length) notes.push(`${blocked.length === 1 ? q(blocked[0]) : nS(blocked.length)} ${blocked.length === 1 ? 'stays' : 'stay'} paused until ${blocked.length === 1 ? 'its email account is' : 'their email accounts are'} reconnected.`);
    if (skipped) notes.push(`${nS(skipped)} ${skipped === 1 ? 'is' : 'are'} already active and ${skipped === 1 ? 'stays' : 'stay'} as ${skipped === 1 ? 'it is' : 'they are'}.`);
    const o = dlgCommon({
      title: one ? `Resume ${q(arr[0])}?` : all ? `Resume all ${nS(N)}?` : `Resume ${nS(N)}?`,
      tone: 'primary', icon: NX.IMG('play-circle.svg'),
      rows: [
        { key: 'inprog', label: 'Prospects in progress who start getting emails again', value: sum(arr, 'inProgress') },
      ],
      sentence: (r) => `${fmt(r.value)} ${plural(r.value, 'prospect is', 'prospects are')} in progress and ${r.value === 1 ? 'starts' : 'start'} getting emails again.`,
      note: notes.join(' ') || null,
      consequence: `They pick up where they stopped. You can undo this for 10 seconds.`,
      primaryLabel: one ? 'Resume sequence' : `Resume ${nS(N)}`,
      failMessage: { title: `We couldn't resume ${one ? 'this sequence' : 'these sequences'} because ${one ? 'it was' : 'one of them was'} deleted by a teammate.`, body: 'Refresh the page and try again.' },
      onConfirm: () => commitStatus(arr, 'active', false, {
        message: one ? `Resumed ${q(arr[0])}` : `Resumed ${nS(N)}`,
        undone: one ? `Undone. ${q(arr[0])} is paused again` : `Undone. ${nS(N)} are paused again`,
      }),
    });
    if (one) {
      const s = arr[0];
      o.rows = [{ key: 'one', label: '', value: 1 }];
      o.breakdown = 'ok'; o.breakdownDelay = 0;
      o.sentence = `${fmt(s.inProgress)} ${plural(s.inProgress, 'prospect is', 'prospects are')} still in progress.`;
      o.consequence = 'It picks up where it stopped. You can undo this for 10 seconds.';
    }
    const dlg = nxImpactDialog(o);
    return dlg;
  }

  // the row switch: same dialog, one sequence named. A sequence that cannot resume explains itself instead.
  function openSingle(s) {
    if (s.progress === 'active') return openPause([s], true);
    if (!s.canResume) {
      return nxDialog({ title: `${q(s)} can't resume yet`, tone: 'primary', icon: NX.IMG('info-circle-blue.svg'),
        body: '<div class="nx-impact nx-new"><p>The email account linked to this sequence is disconnected. Reconnect it in Email Accounts, then resume the sequence.</p></div>',
        primaryLabel: 'Go to Email Accounts', onPrimary: (c) => { c.close('done'); nxToast({ message: 'Not part of this prototype' }); } });
    }
    return openResume([s], true);
  }

  function openDelete(sel, today) {
    if (!today) {
      const N = sel.length; const one = N === 1;
      const subs = sel.reduce((a, x) => a + x.subs.length, 0);
      const o = dlgCommon({
        title: one ? `Delete the sequence ${q(sel[0])}?` : `Delete ${nS(N)}?`,
        tone: 'danger',
        rows: [
          { key: 'active', label: 'Prospects in progress', value: sum(sel, 'inProgress') },
          { key: 'subs', label: 'Subsequences deleted with them', value: subs },
        ],
        sentence: (r) => (r.key === 'active' ? `${fmt(r.value)} ${plural(r.value, 'prospect is', 'prospects are')} in progress.` : `${fmt(r.value)} ${plural(r.value, 'subsequence is', 'subsequences are')} deleted with them.`),
        consequence: `${one ? 'Its' : 'Their'} steps, prospects' progress and stats are deleted. This can't be undone.`,
        primaryLabel: one ? 'Delete sequence' : `Delete ${nS(N)}`, typeToConfirm: 'delete',
        failMessage: { title: `We couldn't delete ${one ? 'this sequence' : 'these sequences'} because ${one ? 'it was' : 'one of them was'} already deleted by a teammate.`, body: 'Refresh the page and try again.' },
        onConfirm: () => {
          sel.forEach((x) => hidden.add(x.id));
          clearSel(); render();
          nxToast({ message: `${N} ${plural(N, 'sequence', 'sequences')} deleted.` });
        },
      });
      if (one) {
        const x = sel[0];
        o.rows = [{ key: 'one', label: '', value: 1 }];
        o.breakdown = 'ok'; o.breakdownDelay = 0;
        o.sentence = `${fmt(x.inProgress)} ${plural(x.inProgress, 'prospect is', 'prospects are')} in progress.${x.subs.length ? ` Its ${x.subs.length === 1 ? 'subsequence is' : `${fmt(x.subs.length)} subsequences are`} deleted with it.` : ''}`;
      }
      const dlg = nxImpactDialog(o);
      return dlg;
    }
    return window.SL_DELETE(sel.length, () => {
      sel.forEach((s) => hidden.add(s.id));
      clearSel(); render();
      nxToast({ message: `${sel.length} ${plural(sel.length, 'sequence', 'sequences')} deleted.` });
    });
  }

  /* ───────── today (production as it is) ───────── */
  function wireTodayBulk() {
    root.querySelectorAll('[data-sl-today]').forEach((b) => b.addEventListener('click', () => {
      const sel = selectedList();
      const k = b.getAttribute('data-sl-today');
      if (k === 'delete') return openDelete(sel, true);
      if (!sel.length) return; // handleOnPauseResumeAction ignores the click
      todayBulk(k, sel);
    }));
  }
  function todayBulk(action, sel) {
    return window.SL_TODAY_CONFIRM({
      action, showCheckbox: true, subCount: 0, result: S.result,
      onYes: (res, withSubs) => {
        if (res === 'fail') { clearSel(); render(); nxToast({ message: 'Sequence not found.', variant: 'error' }); return; }
        let ok = 0; let failed = 0;
        sel.forEach((s) => {
          if (action === 'pause') { if (s.progress === 'active') { s.progress = 'paused'; s.pausedAt = stamp(0, 15, 42); if (withSubs) s.subs.forEach((x) => { x.progress = 'paused'; }); } ok++; }
          else if (s.progress === 'paused' && !s.canResume) failed++;
          else { s.progress = 'active'; s.pausedAt = null; ok++; }
        });
        clearSel(); render();
        window.SL_TODAY_REPORT(action, ok, failed);
      },
    });
  }
  function todaySingle(s) {
    const isPause = s.progress === 'active';
    return window.SL_TODAY_CONFIRM({
      action: isPause ? 'pause' : 'resume', showCheckbox: s.subs.length > 0, subCount: s.subs.length, result: S.result,
      onYes: (res) => {
        if (res === 'fail' || (!isPause && !s.canResume)) { nxToast({ message: 'Email accounts are disconnected', variant: 'error' }); return; }
        s.progress = isPause ? 'paused' : 'active'; s.pausedAt = isPause ? stamp(0, 15, 42) : null;
        render();
        nxToast({ message: isPause ? 'Sequence paused successfully' : 'Sequence resumed successfully' });
      },
    });
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const pick = (ids) => { clearSel(); shell.setControl('sel', ''); ids.forEach((id) => S.sel.add(id)); render(); };
    const after = (fn, ms) => setTimeout(fn, ms);
    const bd = (window.SL_BD != null ? window.SL_BD : 500) + 60;
    const pausedIds = DATA.filter((s) => s.progress === 'paused').map((s) => s.id);
    const steps = {
      'sel-3': () => { applySel0('3'); render(); },
      'sel-12': () => { applySel0('12'); render(); },
      'sel-page': () => { list().slice(0, PAGE).forEach((s) => S.sel.add(s.id)); render(); },
      'sel-all': () => { applySel0('all'); render(); },
      'dialog-pause': () => { applySel0('12'); render(); openPause(selectedList()); },
      'dialog-pause-subs': () => { applySel0('12'); render(); openPause(selectedList()); after(() => { const i = document.querySelector('.sl-subcheck input'); i.click(); }, bd + 20); },
      'dialog-pause-all': () => { applySel0('all'); render(); openPause(selectedList()); },
      'dialog-pause-3': () => { applySel0('3'); render(); openPause(selectedList()); },
      'dialog-submitting': () => { applySel0('12'); render(); const d = openPause(selectedList()); after(() => d.confirm(), bd); },
      'dialog-error': () => { S.result = 'fail'; shell.setControl('result', 'fail'); applySel0('12'); render(); const d = openPause(selectedList()); after(() => d.confirm(), bd); },
      'dialog-resume': () => { pick(pausedIds); openResume(selectedList()); },
      'dialog-resume-all': () => { applySel0('all'); render(); openResume(selectedList()); },
      'single-pause': () => { openSingle(DATA[0]); },
      'single-resume': () => { openSingle(DATA.find((s) => s.progress === 'paused' && s.canResume)); },
      'single-blocked': () => { openSingle(DATA.find((s) => !s.canResume)); },
      'toast': () => { applySel0('12'); render(); const d = openPause(selectedList()); after(() => d.confirm(), bd); },
      'undone': () => { applySel0('12'); render(); const d = openPause(selectedList()); after(() => { d.confirm(); after(() => document.querySelector('.message-undo').click(), (window.SL_SD != null ? window.SL_SD : 900) + 600); }, bd); },
      'delete': () => { applySel0('3'); render(); openDelete(selectedList()); },
      'delete-typed': () => { applySel0('3'); render(); const d = openDelete(selectedList()); after(() => d.type('delete'), (window.SL_BD != null ? window.SL_BD : 500) + 100); },
      'today': () => { S.view = 'today'; shell.setControl('view', 'today'); applySel0('12'); render(); },
      'today-modal': () => { S.view = 'today'; shell.setControl('view', 'today'); applySel0('12'); render(); todayBulk('pause', selectedList()); },
      'today-resume': () => { S.view = 'today'; shell.setControl('view', 'today'); pick(pausedIds); todayBulk('resume', selectedList()); },
      'today-report': () => { S.view = 'today'; shell.setControl('view', 'today'); pick(pausedIds); const m = todayBulk('resume', selectedList()); m.yes.click(); },
      'today-single': () => { S.view = 'today'; shell.setControl('view', 'today'); render(); todaySingle(DATA[0]); },
    };
    if (steps[state]) steps[state]();
  }

  window.SL_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.SL_SD = param('sd') != null ? Number(param('sd')) : undefined;
  applySel0(S.sel0);
  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
