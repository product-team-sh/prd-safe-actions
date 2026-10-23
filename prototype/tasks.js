/* Tasks: safe actions prototype (spec row 11, bulk Skip up to 25,000; plus bulk Retry on the Failed tab).
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3 (tasks-markup.js);
   new elements carry .nx-new. URL params: ?tab=dueToday|failed &view=proposed|today &breakdown=ok|slow|fail
   &result=ok|fail &state=<screenshot state> &bd=<ms> &sd=<ms> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const PAGE = 25;
  const CAP = 25000;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/tasks/components/tasks-content/';
  const V3 = 'https://github.com/saleshandy/saleshandy-app/blob/b39fe379e855573b193ad996f44ecd8eceb8c595/src/features/tasks/components/TasksToolbar/TasksToolbar.tsx';

  /* ───────── scenario ───────── */
  const S = {
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    tab: param('tab') === 'failed' ? 'failed' : 'dueToday',
    page: 0,
    sel: new Set(),
    all: false,
    desel: new Set(),
  };

  /* ───────── data ───────── */
  const FIRST = ['Priya', 'Marcus', 'Elena', 'Tom', 'Aisha', 'Daniel', 'Sofia', 'Liam', 'Mei', 'Arjun', 'Hannah', 'Kofi', 'Lucia', 'Noah', 'Zara', 'Ethan', 'Ines', 'Ravi', 'Chloe', 'Mateo', 'Yuki', 'Owen', 'Leila', 'Samir', 'Grace', 'Felix', 'Nadia', 'Jonas', 'Amara', 'Diego', 'Freya', 'Hugo', 'Anika', 'Theo', 'Rosa', 'Kian', 'Maya', 'Omar', 'Clara', 'Ivan'];
  const LAST = ['Raman', 'Hale', 'Duarte', 'Becker', 'Khan', 'Osei', 'Marin', 'Novak', 'Chen', 'Mehta', 'Lindqvist', 'Mensah', 'Ferreira', 'Brooks', 'Haddad', 'Walsh', 'Moreau', 'Iyer', 'Dubois', 'Silva', 'Tanaka', 'Reilly', 'Farah', 'Aziz', 'Park', 'Weber', 'Petrova', 'Berg', 'Okafor', 'Ruiz', 'Nilsen', 'Laurent', 'Kapoor', 'Fischer', 'Romano', 'Ahmadi', 'Cohen', 'Saleh', 'Vogel', 'Petrov'];
  const COMP = ['ledgerloop.io', 'shipyardhq.com', 'quillstack.com', 'fieldnote.app', 'northbeam.dev', 'tallyroute.com', 'brightforge.co', 'cartwheel.ai', 'opslane.io', 'pagefold.com', 'relaypoint.co', 'stackmint.io', 'brickyard.dev', 'loomstate.com', 'harborly.io', 'trellisapp.com', 'gridwise.co', 'patchwork.so', 'kilnhq.com', 'meridianops.com'];
  const SEQS = ['SaaS founders, Oct', 'Agency owners, UK', 'Series A CTOs', 'Webinar follow-up, Oct', 'Inbound demo requests', 'Ecommerce VPs, Q4'];
  const OWNERS = ['Aarav Patel', 'Meera Joshi', 'Kabir Sethi'];
  const TITLES = { call: ['Introduction Call', 'Follow-up Call', 'Demo Call'], linkedin: ['Connection Request', 'Message', 'View Profile'], email: ['Manual Email'] };
  const PRI = ['Normal', 'Normal', 'High', 'Normal', 'Urgent', 'Low', 'Normal', 'High'];
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const person = (i, plain) => {
    const first = FIRST[(i * 7 + 3) % FIRST.length], last = LAST[(i * 11 + 5) % LAST.length], dom = COMP[(i * 13) % COMP.length];
    return { first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}${i > 39 && !plain ? i : ''}@${dom}` };
  };

  // Due today: 1,120 tasks (412 call, 386 LinkedIn, 322 manual email)
  function buildDue() {
    const types = [].concat(Array(412).fill('call'), Array(386).fill('linkedin'), Array(322).fill('email'));
    const r = rng(7);
    for (let i = types.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [types[i], types[j]] = [types[j], types[i]]; }
    return types.map((type, i) => {
      const steps = 3 + (i % 4); // sequence length 3 to 6
      const step = 2 + ((i * 5) % (steps - 1)); // 2..steps
      return Object.assign(person(i), {
        id: i + 1, type, title: TITLES[type][i % TITLES[type].length], seq: SEQS[(i * 5) % SEQS.length], step, isLast: step === steps,
        priority: PRI[i % PRI.length], owner: OWNERS[i % OWNERS.length], outcome: i % 9 === 4 ? 'Interested' : null,
      });
    });
  }
  // Failed: 23 automated LinkedIn tasks (HeyReach / Aimfox campaign push). Reasons from FAILED_REASON_LABELS.
  const REASONS = [['External Service Error', false], ['Profile Not Ready', false], ['External Service Error', false], ['Missing Required Field', true], ['Profile Not Ready', false], ['External Service Error', false], ['Invalid LinkedIn URL', true], ['External Service Error', false]];
  function buildFailed() {
    return Array.from({ length: 23 }, (_, i) => Object.assign(person(i + 17, true), {
      id: 5000 + i, type: 'linkedin', auto: true, title: i % 3 === 2 ? 'Push Prospect to Aimfox' : 'Push Prospect to HeyReach',
      seq: SEQS[(i * 5 + 1) % SEQS.length], step: 1 + (i % 3), isLast: false, reason: REASONS[i % REASONS.length][0], needsFix: REASONS[i % REASONS.length][1],
      failedAt: ['2 hours ago', '5 hours ago', '1 day ago', '2 days ago'][i % 4], owner: OWNERS[(i + 1) % OWNERS.length], priority: 'Normal',
    }));
  }
  const DATA = { dueToday: buildDue(), failed: buildFailed() };
  const hidden = new Map(); // id -> action, rows that left the table and are inside the undo window
  const BASE = { upcoming: 3480, overdue: 214, completed: 96, skipped: 18 };
  const done = { completed: 0, skipped: 0 };
  const pending = (a) => [...hidden.values()].filter((v) => v === a).length;

  const listFor = (tab) => (DATA[tab] || []).filter((t) => !hidden.has(t.id));
  const visible = () => listFor(S.tab);
  function selectedList() {
    if (S.all) return visible().filter((t) => !S.desel.has(t.id)).slice(0, CAP);
    return visible().filter((t) => S.sel.has(t.id));
  }
  function selCount() {
    if (S.all) return Math.min(CAP, visible().length) - S.desel.size;
    return S.sel.size;
  }
  function clearSel() { S.sel.clear(); S.all = false; S.desel.clear(); }
  const tabs = () => [
    { key: 'dueToday', label: 'Due Today', count: listFor('dueToday').length },
    { key: 'upcoming', label: 'Upcoming', count: BASE.upcoming },
    { key: 'overdue', label: 'Overdue', count: BASE.overdue },
    { key: 'completed', label: 'Completed', count: BASE.completed + done.completed + pending('complete') },
    { key: 'skipped', label: 'Skipped', count: BASE.skipped + done.skipped + pending('skip') },
    { key: 'failed', label: 'Failed', count: listFor('failed').length },
  ];

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'tasks',
    headerHTML: window.TK_HEADER,
    controls: [
      { key: 'tab', label: 'Tab', value: S.tab, options: [['dueToday', 'Due Today (1,120)'], ['failed', 'Failed (23)']], onChange: (v) => { S.tab = v; S.page = 0; clearSel(); render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec row 11, plus bulk Retry on the Failed tab. Breakdown counts come from the backend before the dialog opens; the client cannot count them for "Select all". Undo needs the skip to start only after 10 seconds and be cancellable until then. Today the single-task skip already calls an undo endpoint (sendGetUndoTasksRequest); bulk has none.',
      rows: [
        { n: 11, surface: 'Tasks (Due Today, Upcoming, Overdue, Failed)', action: 'Bulk skip, up to 25,000', patterns: 'A B F H', undo: 'Yes, 10 seconds',
          breakdown: 'Tasks by type (Call, LinkedIn, Manual email; zero rows hidden), and "Prospects who move to their next step". A note under the rows counts tasks that are the last step of their sequence (those prospects finish the sequence instead). Title names the tab: "Skip 36 tasks due today?", "Skip all 1,120 tasks due today?", "Skip 8 failed tasks?".',
          code: [
            { label: 'tasks-content.tsx L2303-2345 (fixed title "Skip task", "No" / "Skip Anyway")', url: C + 'tasks-content.tsx#L2303-L2345' },
            { label: 'tasks-content.tsx L2058-2066 (copy, no count)', url: C + 'tasks-content.tsx#L2058-L2066' },
            { label: 'tasks-bulk-actions.tsx L28-86 (icon-only bar)', url: C + 'components/tasks-bulk-actions/tasks-bulk-actions.tsx#L28-L86' },
            { label: 'tasks-selected-info-banner.tsx ("Task(s) selected.")', url: C + 'components/tasks-selected-info-banner.tsx' },
          ],
          v3: `saleshandy-app b39fe37 has icon-only toolbar buttons with no handlers yet, and the skip icon is labelled "snooze": <a href="${V3}#L50-L52" target="_blank" rel="noopener">TasksToolbar.tsx L50-52</a>. Build B, F and H in from the start.` },
        { n: '11b', surface: 'Tasks > Failed', action: 'Bulk retry (failed LinkedIn automation)', patterns: 'F', undo: 'No (re-runs an external automation)',
          breakdown: 'Tasks that will run again now, and tasks that need a fix first (Missing Required Field, Invalid LinkedIn URL) and will fail again. Blue: nothing is lost.',
          code: [{ label: 'bulk-retry-modal.tsx (no count, "Retry")', url: C + 'components/bulk-retry-modal/bulk-retry-modal.tsx' }, { label: 'tasks-content.tsx L932-960 (handleBulkRetry)', url: C + 'tasks-content.tsx#L932-L960' }] },
        { n: '11c', surface: 'Tasks, row hover', action: 'Single Skip / Complete', patterns: 'H', undo: 'Yes, 10 seconds (was 5)',
          breakdown: 'None: no dialog, as today. (One task selected and Skip on the bar opens the F dialog naming the task: F always from the bar.)',
          code: [{ label: 'tasks-content.tsx L548-589 (single skip, no modal)', url: C + 'tasks-content.tsx#L548-L589' }, { label: 'tasks-content.tsx L1528-1562 (undo toast, delay 5000)', url: C + 'tasks-content.tsx#L1528-L1562' }] },
      ],
      notes: [
        'Skip is not red, on the bar or in the dialog. Nothing is deleted or removed: the task moves to Skipped and the prospect carries on with their sequence, the same class of change as "Mark as finished", which is blue. It keeps B\'s distance (after the divider).',
        'The single-task undo moves from 5 to 10 seconds so every undo in the app has one length. Its toast gains the timer ring.',
        'Rows leave the table at once and the Due Today and Skipped counts move at once; Undo puts the rows back in place with the selection cleared. A second action commits the first.',
        'Leaving the page does not cancel: the skip still completes after 10 seconds.',
        '"Select all" over 25,000 selects the first 25,000 and the banner says so (same rule as every table; production already caps at 25,000 with "First").',
        'Complete on the bar stays disabled for more than one task, as today, now with the reason in a tooltip.',
      ],
    },
  });
  const root = h('<div id="tk-root"></div>');
  shell.body.appendChild(root);
  root.addEventListener('click', (e) => { const n = e.target.closest('[data-tk-noop]'); if (n) { e.preventDefault(); nxToast({ message: 'Not part of this prototype' }); } });

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu();
    const list = visible();
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    if (S.page >= pages) S.page = pages - 1;
    const pageRows = list.slice(S.page * PAGE, S.page * PAGE + PAGE);
    const isSel = (t) => (S.all ? !S.desel.has(t.id) : S.sel.has(t.id));
    const n = selCount();
    root.innerHTML = window.TK_PAGE({
      tab: S.tab, view: S.view, tabs: tabs(), rows: pageRows, isSel, total: list.length, page: S.page, pages, pageSize: PAGE,
      anySelected: n > 0, multiSelected: n > 1,
    });
    const barHost = root.querySelector('[data-tk="bulk"]');
    if (barHost) {
      if (S.view === 'today') barHost.innerHTML = window.TK_TODAY_BULK(S.tab, n > 0, n);
      else barHost.appendChild(proposedBar());
    }
    const bh = root.querySelector('[data-tk="banner"]');
    if (n > 0) {
      if (S.view === 'today') bh.innerHTML = window.TK_TODAY_BANNER(n, list.length, S.all, S.sel.size);
      else {
        const ban = nxSelectionBanner({
          count: n, total: list.length, pageRows: pageRows.length, allSelected: S.all && S.desel.size === 0, filtered: false, cap: CAP,
          noun: 'task', plural: 'tasks', scope: S.tab === 'failed' ? 'that failed' : 'due today', mode: 'proposed',
          onSelectAll: () => { S.all = true; S.desel.clear(); S.sel.clear(); render(); },
          onClear: () => { clearSel(); render(); },
        });
        if (ban) { ban.classList.replace('prospect-selected-row-info', 'email-selected-row-info'); ban.classList.replace('prospect-selected-row-info-waring', 'email-selected-row-info-waring'); bh.appendChild(ban); }
      }
    } else bh.remove();
    wire(pageRows);
    NX.settle(root);
  }

  function wire(pageRows) {
    const head = root.querySelector('[data-tk="check-all"]');
    if (head) {
      head.addEventListener('change', () => {
        const on = head.checked;
        pageRows.forEach((t) => {
          if (S.all) { on ? S.desel.delete(t.id) : S.desel.add(t.id); } else { on ? S.sel.add(t.id) : S.sel.delete(t.id); }
        });
        if (S.all && S.desel.size >= visible().length) clearSel();
        render();
      });
    }
    root.querySelectorAll('[data-tk-row]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-tk-row'));
      if (S.all) { cb.checked ? S.desel.delete(id) : S.desel.add(id); if (S.desel.size >= visible().length) clearSel(); } else cb.checked ? S.sel.add(id) : S.sel.delete(id);
      render();
    }));
    root.querySelectorAll('[data-tk-tab]').forEach((t) => t.addEventListener('click', () => {
      const k = t.getAttribute('data-tk-tab');
      if (k === S.tab) return;
      if (!DATA[k]) { nxToast({ message: 'Not part of this prototype' }); return; }
      S.tab = k; S.page = 0; clearSel(); shell.setControl('tab', k); render();
    }));
    root.querySelectorAll('[data-tk-page]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      const v = b.getAttribute('data-tk-page');
      S.page = v === 'prev' ? S.page - 1 : v === 'next' ? S.page + 1 : Number(v);
      render();
    }));
    // row hover shows the production action icons (tasks-columns.tsx: hoveredRowId)
    root.querySelectorAll('tr[data-tk-tr]').forEach((tr) => {
      const box = tr.querySelector('[data-tk-actions]');
      if (!box) return;
      tr.addEventListener('mouseenter', () => box.classList.add('show-actions'));
      tr.addEventListener('mouseleave', () => box.classList.remove('show-actions'));
    });
    root.querySelectorAll('[data-tk-act]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      rowAction(b.getAttribute('data-tk-act'), Number(b.getAttribute('data-id')));
    }));
    // today's bar and banner
    root.querySelectorAll('[data-tk-bulk]').forEach((b) => b.addEventListener('click', () => { if (b.getAttribute('aria-disabled') !== 'true') todayBulk(b.getAttribute('data-tk-bulk')); }));
    root.querySelectorAll('[data-tk-today]').forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('data-tk-today') === 'all') { S.all = true; S.sel.clear(); S.desel.clear(); } else clearSel();
      render();
    }));
  }

  /* ───────── proposed bar (B) ───────── */
  function proposedBar() {
    const n = selCount();
    const none = n === 0;
    const why = 'Select tasks first';
    const soon = () => nxToast({ message: 'Not part of this prototype' });
    const bar = nxBulkBar(S.tab === 'failed' ? {
      actions: [{ id: 'retry', label: 'Retry', icon: 'refresh', disabled: none, reason: why, onClick: () => openRetry() }],
      risky: [{ id: 'skip', label: 'Skip', count: null, icon: 'play-track-next', disabled: none, reason: why, onClick: () => bulkSkip() }],
    } : {
      actions: [
        { id: 'snooze', label: 'Snooze', icon: 'alarm', disabled: none, reason: why, onClick: soon },
        { id: 'complete', label: 'Complete', icon: 'circle-check', disabled: n !== 1, reason: none ? why : 'Complete tasks one at a time', onClick: () => { const t = selectedList()[0]; rowAction('complete', t.id); } },
      ],
      risky: [{ id: 'skip', label: 'Skip', count: null, icon: 'play-track-next', disabled: none, reason: why, onClick: () => bulkSkip() }],
    });
    bar.classList.add('tk-bar');
    return bar;
  }

  /* ───────── F: skip ───────── */
  const nT = (n) => `${fmt(n)} ${plural(n, 'task', 'tasks')}`;
  const where = () => (S.tab === 'failed' ? 'failed' : 'due today');
  const dlg = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.TK_BD, submitDelay: window.TK_SD }, o);
  const isEverything = () => selCount() === visible().length && visible().length > 1;
  function stats(list) {
    const s = { n: list.length, call: 0, linkedin: 0, email: 0, move: 0, last: 0, ok: 0, fix: 0 };
    list.forEach((t) => { s[t.type]++; if (t.isLast) s.last++; else s.move++; if (t.needsFix) s.fix++; else s.ok++; });
    return s;
  }

  function bulkSkip() {
    const list = selectedList();
    return openSkip(list); // F always from the bar, including a selection of one
  }
  function openSkip(list) {
    const N = list.length;
    const s = stats(list);
    const all = isEverything();
    const failed = S.tab === 'failed';
    const title = failed ? `Skip ${all ? 'all ' : ''}${fmt(N)} failed tasks?` : `Skip ${all ? 'all ' : ''}${nT(N)} due today?`;
    const kind = { call: ['call task', 'call tasks'], linkedin: ['LinkedIn task', 'LinkedIn tasks'], email: ['manual email task', 'manual email tasks'] };
    return nxImpactDialog(dlg({
      title, tone: 'primary',
      rows: [
        { key: 'call', label: 'Call tasks', value: s.call },
        { key: 'linkedin', label: 'LinkedIn tasks', value: s.linkedin },
        { key: 'email', label: 'Manual email tasks', value: s.email },
        { key: 'move', label: 'Prospects who move to their next step', value: s.move },
      ],
      sentence: (r) => (r.key === 'move' ? `All ${fmt(N)} prospects move to their next step.` : `All ${fmt(N)} are ${kind[r.key][1]}.`),
      note: s.last ? `${fmt(s.last)} of these ${s.last === 1 ? 'is the last step in its sequence, so that prospect finishes it' : 'are the last step in their sequence, so those prospects finish it'} instead.` : null,
      consequence: `Each prospect moves on and their next step is scheduled. You can undo this for 10 seconds.${all ? (failed ? ' This clears the Failed list.' : ' This clears your Due Today list.') : ''}`,
      primaryLabel: all ? `Skip all ${nT(N)}` : `Skip ${nT(N)}`,
      failMessage: { title: "We couldn't skip these tasks because some were completed or reassigned while this was open.", body: 'Refresh the page and select them again.' },
      onConfirm: () => leave(list, 'skip', { message: failed ? `Skipped ${fmt(N)} failed tasks` : `Skipped ${nT(N)} due today`, undone: `Undone. ${nT(N)} are back` }),
      ...(N === 1 ? oneTask(list[0], failed) : {}),
    }));
  }
  // One task: named in the title, no lookup (no counting state), breakdown as one sentence
  function oneTask(t, failed) {
    const who = esc(`${t.first} ${t.last}`);
    return {
      title: `Skip “${esc(t.title)}” for ${who}?`,
      rows: [{ key: 'one', label: '', value: 1 }],
      sentence: t.isLast ? `This is the last step in “${esc(t.seq)}”, so ${esc(t.first)} finishes the sequence.` : `${esc(t.first)} moves to the next step in “${esc(t.seq)}”.`,
      note: null, breakdown: 'ok', breakdownDelay: 0,
      consequence: `${t.isLast ? 'The sequence ends for them.' : 'That step is scheduled.'} You can undo this for 10 seconds.`,
      primaryLabel: 'Skip task',
      onConfirm: () => leave([t], 'skip', { message: `Skipped “${esc(t.title)}” for ${who}`, undone: 'Undone. The task is back' }),
    };
  }

  /* ───────── F: retry (Failed tab) ───────── */
  function openRetry() {
    const list = selectedList();
    const N = list.length;
    const s = stats(list);
    return nxImpactDialog(dlg({
      title: N === 1 ? `Retry “${esc(list[0].title)}” for ${esc(list[0].first + ' ' + list[0].last)}?` : `Retry ${fmt(N)} failed LinkedIn tasks?`, tone: 'primary',
      rows: [
        { key: 'ok', label: 'Run again now', value: s.ok },
        { key: 'fix', label: 'Need a fix first, so they fail again', value: s.fix },
      ],
      sentence: (r) => (r.key === 'ok' ? (N === 1 ? 'It runs again now.' : `All ${fmt(N)} run again now.`) : (N === 1 ? 'It needs a fix first, so it fails again.' : `All ${fmt(N)} need a fix first, so they fail again.`)),
      consequence: 'We run the LinkedIn automation again for each task. A task with a missing field or an invalid LinkedIn URL fails again until you correct it.',
      primaryLabel: N === 1 ? 'Retry task' : `Retry ${nT(N)}`,
      failMessage: { title: "We couldn't retry these tasks because HeyReach did not respond.", body: 'Check the connection in Settings > Integrations, then try again.' },
      ...(N === 1 ? { breakdown: 'ok', breakdownDelay: 0 } : {}),
      onConfirm: () => {
        const ids = list.map((t) => t.id);
        DATA.failed = DATA.failed.filter((t) => !ids.includes(t.id));
        clearSel(); render();
        nxToast({ message: `Retrying ${nT(N)}. Any that fail again come back here.` });
      },
    }));
  }

  /* ───────── H: rows leave at once, 10-second undo ───────── */
  function leave(list, action, toast, seconds = 10) {
    const ids = list.map((t) => t.id);
    ids.forEach((id) => hidden.set(id, action));
    clearSel(); render();
    return nxUndoToast({
      message: toast.message, undoneMessage: toast.undone, seconds,
      onUndo: () => { ids.forEach((id) => hidden.delete(id)); clearSel(); render(); },
      onCommit: () => {
        const set = new Set(ids);
        Object.keys(DATA).forEach((k) => { DATA[k] = DATA[k].filter((t) => !set.has(t.id)); });
        ids.forEach((id) => hidden.delete(id));
        done[action === 'skip' ? 'skipped' : 'completed'] += ids.length;
        render();
      },
    });
  }
  // remove for good, as production does today (no undo window)
  function commitNow(list, action) {
    const set = new Set(list.map((t) => t.id));
    Object.keys(DATA).forEach((k) => { DATA[k] = DATA[k].filter((t) => !set.has(t.id)); });
    done[action === 'skip' ? 'skipped' : 'completed'] += set.size;
    clearSel(); render();
  }
  const isCall = (t) => t.type === 'call';

  function rowAction(act, id) {
    const t = visible().find((x) => x.id === id);
    if (!t) return;
    const who = esc(`${t.first} ${t.last}`);
    if (act === 'snooze' || act === 'copy') { nxToast({ message: 'Not part of this prototype' }); return; }
    if (act === 'complete' && isCall(t)) { nxToast({ message: 'Completing a call asks for its outcome first. Not part of this prototype.' }); return; }
    if (act === 'retry') {
      DATA.failed = DATA.failed.filter((x) => x.id !== id); clearSel(); render();
      nxToast({ message: 'LinkedIn tasks retried successfully' });
      return;
    }
    if (S.view === 'today') {
      // production: single action at once, toaster with Undo for 5 seconds (tasks-content.tsx L1528-1562)
      const was = DATA[S.tab].indexOf(t);
      commitNow([t], act);
      window.TK_TODAY_UNDO_TOAST(act === 'skip' ? 'Task skipped successfully.' : 'Task marked completed successfully.', () => {
        DATA[S.tab].splice(was, 0, t); done[act === 'skip' ? 'skipped' : 'completed']--; render();
      }, window.TK_UNDO_MS || 5000);
      return;
    }
    leave([t], act, act === 'skip'
      ? { message: `Skipped “${esc(t.title)}” for ${who}`, undone: 'Undone. The task is back' }
      : { message: `Completed “${esc(t.title)}” for ${who}`, undone: 'Undone. The task is back' });
  }

  /* ───────── today's bulk actions (production as it is) ───────── */
  function todayBulk(k) {
    const list = selectedList();
    if (k === 'snooze' || k === 'complete') { nxToast({ message: 'Not part of this prototype' }); return null; }
    if (k === 'retry') {
      return window.TK_TODAY_MODAL({
        className: 'bulk-retry-modal', icon: window.TK_REFRESH_ICON20, title: 'Retry selected failed tasks?', cancel: 'Cancel', submit: 'Retry',
        content: '<p class="regular-2 popover-arrow-color-txt">This will re-attempt the automation for each selected task. Tasks that require a manual fix (e.g. missing fields or invalid URLs) must be corrected before retrying.</p>',
        onSubmit: () => { const ids = list.map((t) => t.id); DATA.failed = DATA.failed.filter((t) => !ids.includes(t.id)); clearSel(); render(); nxToast({ message: 'LinkedIn tasks retried successfully' }); },
      });
    }
    if (list.length === 1) { rowAction('skip', list[0].id); return null; }
    return window.TK_TODAY_MODAL({
      className: 'task-confirmation-modal task-confirmation-modal-second', icon: window.TK_SKIP_ICON24, title: 'Skip task', cancel: 'No', submit: 'Skip Anyway',
      content: '<p>You are about to skip multiple tasks. Skipping these tasks will automatically move the selected prospects to the next step.</p>',
      onSubmit: () => { commitNow(list, 'skip'); nxToast({ message: 'Task skipped successfully.' }); },
    });
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const firstN = (k) => { visible().slice(0, k).forEach((t) => S.sel.add(t.id)); render(); };
    const sel36 = () => { visible().slice(0, 36).forEach((t) => S.sel.add(t.id)); S.page = 1; render(); };
    const today = () => { S.view = 'today'; shell.setControl('view', 'today'); };
    const failed = () => { S.tab = 'failed'; shell.setControl('tab', 'failed'); };
    const hover = (i) => { const tr = root.querySelectorAll('tr[data-tk-tr]')[i]; tr && tr.dispatchEvent(new MouseEvent('mouseenter')); return tr; };
    const confirmLater = (d) => setTimeout(() => d && d.confirm(), (window.TK_BD || 0) + 50);
    const steps = {
      'sel-none': () => render(),
      'sel-5': () => firstN(5),
      'sel-page': () => firstN(PAGE),
      'sel-36': () => sel36(),
      'sel-all': () => { S.all = true; render(); },
      'hover': () => { render(); hover(2); },
      'dialog-skip': () => { sel36(); bulkSkip(); },
      'dialog-skip-one': () => { firstN(1); bulkSkip(); },
      'dialog-skip-page': () => { firstN(PAGE); bulkSkip(); },
      'dialog-skip-all': () => { S.all = true; render(); bulkSkip(); },
      'dialog-submitting': () => { sel36(); confirmLater(bulkSkip()); },
      'dialog-error': () => { S.result = 'fail'; sel36(); confirmLater(bulkSkip()); },
      'toast': () => { sel36(); confirmLater(bulkSkip()); },
      'undone': () => { sel36(); const d = bulkSkip(); setTimeout(() => { d.confirm(); setTimeout(() => document.querySelector('.message-undo').click(), 1000); }, (window.TK_BD || 0) + 50); },
      'single-undo': () => { render(); hover(1); rowAction('skip', visible()[1].id); hover(1); },
      'failed': () => { failed(); firstN(8); },
      'failed-all': () => { failed(); firstN(23); },
      'dialog-retry': () => { failed(); firstN(8); openRetry(); },
      'dialog-skip-failed': () => { failed(); firstN(8); bulkSkip(); },
      'today': () => { today(); firstN(5); },
      'today-all': () => { today(); S.all = true; render(); },
      'today-dialog': () => { today(); sel36(); todayBulk('skip'); },
      'today-single-undo': () => { today(); render(); rowAction('skip', visible()[1].id); hover(1); },
      'today-failed': () => { today(); failed(); firstN(8); },
      'today-retry': () => { today(); failed(); firstN(8); todayBulk('retry'); },
    };
    if (steps[state]) steps[state]();
  }

  window.TK_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.TK_SD = param('sd') != null ? Number(param('sd')) : undefined;
  window.TK_UNDO_MS = param('undo') != null ? Number(param('undo')) : undefined;
  render();
  document.fonts && document.fonts.ready.then(() => { const b = root.querySelector('.nx-bulk'); b && b.nxFit && b.nxFit(); });
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
