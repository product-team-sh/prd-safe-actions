/* Email Accounts: safe actions prototype (spec rows 17 to 20).
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3 (email-accounts-markup.js);
   new elements carry .nx-new.
   URL params: ?sel=0|1|6|20 &view=proposed|today &breakdown=ok|slow|fail &result=ok|fail &bd=<ms> &sd=<ms>
   &state=<screenshot state> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/';
  const EA = C + 'src/components/email-accounts/components/email-accounts-content/';
  const ACT = EA + 'components/email-accounts-actions/email-accounts-actions.tsx';
  const TBL = EA + 'components/email-accounts-table/email-accounts-table.tsx';
  const COL = EA + 'components/email-accounts-table/utils/get-email-accounts-columns.tsx';
  const CNT = EA + 'email-accounts-content.tsx';
  const BAN = EA + 'components/email-accounts-table/utils/helper.ts';
  const TAG = C + 'src/shared/components/add-remove-tag/add-remove-tag.tsx';
  const LOC = C + 'src/locales/en.ts';
  const BULKSET = EA + 'components/bulk-email-update-modal/bulk-email-update-modal.tsx';

  /* ───────── scenario ───────── */
  const S = {
    sel: ['0', '1', '6', '20'].includes(param('sel')) ? param('sel') : '6',
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    picked: new Set(),
    all: false, // "Select all N" from the banner
  };

  /* ───────── data ───────── */
  // Sequences and their senders. "Webinar follow-up" has one sender, so it stops when ravi@acme.io stops.
  const SEQ = { saas: 'SaaS founders, Oct', agency: 'Agency outreach Q4', webinar: 'Webinar follow-up', fintech: 'Fintech CFOs', health: 'Healthcare ops leaders', plg: 'Product-led growth, EU' };
  const D = (spf, dkim, dmarc, ptr, dbl, ibl, mx, custom) => ({ spf, dkim, dmarc, ptr, domainBl: dbl, ipBl: ibl, mx, custom });
  const OK = D(1, 1, 1, 1, 0, 0, 1, 1);
  // id, name, email, type, status, seqs [[key, emails scheduled today from this account]], setup score, warm-up, readiness, deliverability, sent, limit, tags, added by, dns, default
  const ROWS = [
    [1, 'Jordan Lee', 'jordan@acme.io', 'google', 'active', [['saas', 12], ['agency', 8]], 92, 'running', 96, 97, 14, 50, ['Primary'], 'Jordan Lee', OK, true],
    [2, 'Ravi Kumar', 'ravi@acme.io', 'google', 'active', [['saas', 18], ['webinar', 6], ['agency', 14]], 88, 'running', 94, 98, 12, 50, ['Q4 outreach', 'Sales team'], 'Ravi Kumar', OK],
    [3, 'Priya Nair', 'priya@acme.io', 'google', 'active', [['saas', 24]], 85, 'running', 91, 96, 9, 50, ['Q4 outreach'], 'Priya Nair', OK],
    [4, 'Tom Becker', 'tom@acme.io', 'microsoft', 'active', [['agency', 12], ['fintech', 10]], 79, 'running', 88, 95, 11, 40, ['Sales team'], 'Tom Becker', D(1, 1, 1, 1, 0, 0, 1, 0)],
    [5, 'Ravi Kumar', 'ravi@tryacme.io', 'google', 'active', [['saas', 9], ['fintech', 7]], 74, 'running', 82, 93, 8, 30, ['Q4 outreach', 'Secondary domain'], 'Ravi Kumar', OK],
    [6, 'Priya Nair', 'priya@tryacme.io', 'google', 'active', [['plg', 15]], 71, 'running', 80, 92, 6, 30, ['Secondary domain'], 'Priya Nair', D(1, 1, 0, 1, 0, 0, 1, 1)],
    [7, 'Tom Becker', 'tom@tryacme.io', 'microsoft', 'active', [['fintech', 14]], 68, 'running', 76, 90, 10, 30, ['Secondary domain'], 'Tom Becker', D(1, 1, 1, 1, 1, 0, 1, 0)],
    [8, 'Ananya Rao', 'ananya@acme.io', 'google', 'active', [['agency', 12], ['plg', 10]], 90, 'running', 95, 97, 15, 50, ['Q4 outreach'], 'Jordan Lee', OK],
    [9, 'Daniel Osei', 'daniel@acmehq.com', 'microsoft', 'active', [['fintech', 8], ['health', 9]], 64, 'running', 70, 88, 7, 30, ['Secondary domain'], 'Jordan Lee', D(1, 1, 1, 0, 0, 0, 1, 0)],
    [10, 'Sofia Marin', 'sofia@acmehq.com', 'microsoft', 'active', [['health', 16]], 82, 'running', 90, 94, 5, 30, ['Secondary domain'], 'Jordan Lee', OK],
    [11, 'Marcus Hale', 'marcus@acme.io', 'google', 'paused', [['health', 0]], 77, 'paused', 85, 91, 0, 50, ['Sales team'], 'Tom Becker', OK],
    [12, 'Elena Duarte', 'elena@acme.io', 'google', 'active', [], 86, 'running', 93, 96, 0, 50, ['Warm-up only'], 'Priya Nair', OK],
    [13, 'Kofi Mensah', 'kofi@acmehq.com', 'microsoft', 'active', [['agency', 11]], 58, 'running', 61, 84, 6, 30, ['Secondary domain'], 'Jordan Lee', D(1, 0, 1, 1, 0, 1, 1, 0)],
    [14, 'Support Team', 'support@acme-mail.co', 'smtp', 'active', [], 45, 'paused', 40, 0, 0, 100, [], 'Jordan Lee', D(1, 0, 0, 0, 2, 3, 1, 0)],
    [15, 'Sales Desk', 'sales@acme-mail.co', 'smtp', 'active', [['plg', 20]], 62, 'running', 72, 89, 22, 100, ['Q4 outreach'], 'Jordan Lee', D(1, 1, 0, 1, 0, 1, 1, 0)],
    [16, 'Ravi Kumar', 'ravi@acmehq.com', 'microsoft', 'disconnected', [['saas', 0]], 55, 'stopped', 48, 81, 0, 30, ['Secondary domain'], 'Ravi Kumar', D(1, 1, 1, 1, 0, 0, 1, 0)],
    [17, 'Lucia Ferreira', 'lucia@tryacme.io', 'google', 'active', [['saas', 8], ['health', 7]], 73, 'running', 84, 93, 9, 30, ['Secondary domain', 'Q4 outreach'], 'Priya Nair', OK],
    [18, 'Noah Brooks', 'noah@tryacme.io', 'google', 'active', [['fintech', 12]], 69, 'running', 79, 91, 10, 30, ['Secondary domain'], 'Tom Becker', OK],
    [19, 'Zara Haddad', 'zara@acme.io', 'google', 'paused', [['agency', 0]], 81, 'paused', 88, 95, 0, 50, [], 'Priya Nair', OK],
    [20, 'Owen Reilly', 'owen@acmehq.com', 'microsoft', 'active', [], 0, 'running', 55, 86, 0, 20, ['New'], 'Jordan Lee', D(1, 1, 1, 1, 0, 0, 1, 0)],
  ];
  const build = () => ROWS.map((r) => ({
    id: r[0], name: r[1], email: r[2], type: r[3], status: r[4], seqs: r[5].map(([k, n]) => ({ key: k, today: n })),
    get sequences() { return this.seqs.map((s) => SEQ[s.key]); },
    health: r[6], warmup: r[7], readiness: r[8], deliverability: r[9], sent: r[10], limit: r[11], tags: r[12].slice(), addedBy: r[13], dns: r[14], isDefault: !!r[15],
  }));
  let DATA = build();
  const gone = new Set(); // deleted rows

  const list = () => DATA.filter((a) => !gone.has(a.id));
  const byId = (id) => DATA.find((a) => a.id === id);
  const selected = () => (S.all ? list() : list().filter((a) => S.picked.has(a.id)));
  const selCount = () => selected().length;
  const clearSel = () => { S.picked.clear(); S.all = false; };
  function applySel(v) {
    clearSel();
    const ids = v === '1' ? [2] : v === '6' ? [2, 3, 4, 5, 6, 7] : v === '20' ? list().map((a) => a.id) : [];
    ids.forEach((id) => { if (byId(id) && !gone.has(id)) S.picked.add(id); });
  }

  /* Knock-on for a set of accounts that stop sending: which sequences pause (no active sender left), which keep sending */
  function impact(accts) {
    const ids = new Set(accts.map((a) => a.id));
    const sending = accts.filter((a) => a.status === 'active');
    const touched = new Map();
    sending.forEach((a) => a.seqs.forEach((s) => touched.set(s.key, true)));
    const stop = [], keep = [];
    touched.forEach((_, k) => {
      const others = list().filter((b) => !ids.has(b.id) && b.status === 'active' && b.seqs.some((s) => s.key === k));
      (others.length ? keep : stop).push(SEQ[k]);
    });
    return {
      stop, keep,
      today: sending.reduce((n, a) => n + a.seqs.reduce((m, s) => m + s.today, 0), 0),
      warm: accts.filter((a) => a.warmup === 'running').length,
    };
  }

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'more',
    headerHTML: window.EA_HEADER(list().length),
    controls: [
      { key: 'sel', label: 'Selected', value: S.sel, options: [['0', 'None'], ['1', '1'], ['6', '6'], ['20', 'All 20']], onChange: (v) => { S.sel = v; applySel(v); render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
      { key: 'reset', label: 'Data', value: '', options: [['reset', 'Reset']], onChange: () => { DATA = build(); gone.clear(); applySel(S.sel); render(); shell.setControl('reset', ''); } },
    ],
    devNotes: {
      intro: 'Spec rows 17 to 20. Counts in every dialog come from the backend when it opens (one call, also for a single account: emails scheduled today are not on the row). Delete and Disconnect have no undo because they act on Google, Microsoft or the SMTP server at once. Pause and Remove tags need the real change to start only after 10 seconds and be cancellable until then.',
      rows: [
        { n: 17, surface: 'Email accounts', action: 'Bulk Delete, bulk Disconnect (up to 25,000)', patterns: 'A B F',
          breakdown: 'Accounts named (first 3 and "and N more"). Sequences that pause because no other sender is left; sequences that keep sending from other accounts; emails scheduled today from these accounts; accounts whose warm-up stops (Delete only). Sequences that pause are named in a note. The title counts what changes: Disconnect skips accounts that are already paused or disconnected and says so. Delete of everything says "all" and adds "No email accounts will be left to send from."',
          undo: 'No', code: [{ label: 'email-accounts-actions.tsx L163-207 (icon-only bar, tooltips only)', url: ACT + '#L163-L207' }, { label: 'email-accounts-actions.tsx L684-740 (both modals, "Yes")', url: ACT + '#L684-L740' }, { label: 'en.ts L1647-1650 ("all the selected email accounts")', url: LOC + '#L1647-L1650' }, { label: 'helper.ts L52-55 ("6 Email Account(s) selected.")', url: BAN + '#L52-L55' }],
          v3: 'saleshandy-app b39fe37 has no Email Accounts page (src/features has none), so nothing to change there yet.' },
        { n: 18, surface: 'Email accounts', action: 'Single Delete, Disconnect (row menu)', patterns: 'F',
          breakdown: 'Account named in the title. Same rows as bulk for that one account; sequences that pause are named.', undo: 'No',
          code: [{ label: 'email-accounts-table.tsx L194-258 (row menu)', url: TBL + '#L194-L258' }, { label: 'delete-email-account-modal.tsx L16-41 (account not named)', url: EA + 'components/delete-email-account-modal/delete-email-account-modal.tsx#L16-L41' }, { label: 'disconnect-email-account-modal.tsx', url: EA + 'components/disconnect-email-account-modal/disconnect-email-account-modal.tsx' }] },
        { n: 19, surface: 'Email accounts', action: 'Status switch to Pause', patterns: 'F H',
          breakdown: 'Sequences that pause (no other sender left), sequences that keep sending, emails scheduled today from it.', undo: 'Yes, 10 seconds',
          code: [{ label: 'get-email-accounts-columns.tsx L250-263 (switch)', url: COL + '#L250-L263' }, { label: 'email-accounts-content.tsx L1062-1068, L800-806 (fires at once)', url: CNT + '#L1062-L1068' }, { label: 'email-accounts-content.tsx L474 ("Email account paused successfully")', url: CNT + '#L474' }] },
        { n: 20, surface: 'Email accounts', action: 'Remove tags', patterns: 'A F H',
          breakdown: 'Tags on the selected accounts, each with how many of them carry it; the picker is the breakdown. The consequence counts the accounts that lose at least one tag.', undo: 'Yes, 10 seconds',
          code: [{ label: 'add-remove-tag.tsx L102-153 (tag picker, "Apply", no count)', url: TAG + '#L102-L153' }, { label: 'email-accounts-actions.tsx L285-310', url: ACT + '#L285-L310' }] },
      ],
      notes: [
        `The bulk settings update already names the count ("for all {n} email accounts?", <a href="${BULKSET}#L832-L880" target="_blank" rel="noopener">bulk-email-update-modal.tsx L832-880</a>). It stays as it is.`,
        'Pause versus keep sending: a sequence pauses only when no other active account sends for it. This split comes from the September mailbox disconnect/delete PRD; production copy says every sequence using the account pauses. Backend confirms which is true before build.',
        'Warm-up row shows for Delete only. Whether Disconnect also stops warm-up is not verified; add the row if it does.',
        'Pause: the switch flips at once and the row shows Paused; Undo flips it back. Activate (paused to active) and Connect stay one click.',
        'Disconnect is blue (the account can be reconnected); Delete is red. Neither has undo.',
        'The default account is not guarded today when deleted; out of scope here.',
      ],
    },
  });
  shell.header.classList.remove('noBoxShadow'); // production: email accounts header has the shadow
  const root = h('<div id="ea-root" class="email-accounts-container container-fluid"><div class="email-account-container"></div></div>');
  shell.body.appendChild(root);
  const box = root.firstElementChild;

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu(); closeRowMenu(); closeTagDrop();
    const rows = list();
    const n = selCount();
    box.innerHTML = window.EA_ACTIONS({ view: S.view }) + '<div data-ea="banner"></div>' + window.EA_TABLE({
      rows, isSel: (a) => S.all || S.picked.has(a.id), total: rows.length, anySelected: n > 0,
    });
    const badge = shell.header.querySelector('[data-ea="count"]');
    if (badge) badge.textContent = rows.length;
    const host = box.querySelector('[data-ea="bulk"]');
    if (S.view === 'today') { host.innerHTML = window.EA_TODAY_ICONS(n > 0); wireToday(host); } else { const pb = proposedBar(); host.appendChild(pb); if (S.narrow) { host.style.flex = '0 0 auto'; host.style.width = '380px'; host.style.minWidth = '0'; requestAnimationFrame(() => pb.nxFit && pb.nxFit()); } }
    // banner (A)
    const bh = box.querySelector('[data-ea="banner"]');
    if (n) {
      bh.className = 'email-account-banner';
      const opts = { count: n, total: rows.length, allSelected: S.all, onSelectAll: () => { S.all = true; render(); }, onClear: () => { clearSel(); render(); } };
      bh.appendChild(S.view === 'today' ? window.EA_TODAY_BANNER(opts) : proposedBanner(opts));
    } else if (S.view === 'today') bh.remove();
    else { bh.className = 'email-account-banner'; const ph = NX.bannerPlaceholder(); ph.className = 'email-selected-row-info nx-banner-ph'; bh.appendChild(ph); } // reserved row: no layout shift
    wireTable();
    NX.settle(root);
  }

  function proposedBanner(o) {
    const el = nxSelectionBanner({ count: o.count, total: o.total, pageRows: o.total, allSelected: o.allSelected || o.count === o.total, noun: 'email account', plural: 'email accounts', scope: '', cap: 25000, onSelectAll: o.onSelectAll, onClear: o.onClear });
    el.className = 'email-selected-row-info email-selected-row-info-waring';
    const b = el.querySelector('.nx-banner-text b');
    if (b) b.textContent = b.textContent.trim();
    return el;
  }

  function wireTable() {
    const head = box.querySelector('[data-ea="check-all"]');
    const rows = list();
    if (head) {
      const on = rows.filter((a) => S.all || S.picked.has(a.id)).length;
      head.indeterminate = on > 0 && on < rows.length;
      head.addEventListener('change', () => { if (head.checked) rows.forEach((a) => S.picked.add(a.id)); else clearSel(); S.all = false; render(); });
    }
    box.querySelectorAll('[data-ea-sel]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-ea-sel'));
      if (S.all) { S.all = false; list().forEach((a) => S.picked.add(a.id)); }
      cb.checked ? S.picked.add(id) : S.picked.delete(id);
      render();
    }));
    box.querySelectorAll('[data-ea-switch]').forEach((sw) => sw.addEventListener('change', (e) => {
      const a = byId(Number(sw.getAttribute('data-ea-switch')));
      sw.checked = a.status === 'active'; // the switch only moves once the change is made
      onSwitch(a);
      e.stopPropagation();
    }));
    box.querySelectorAll('[data-ea-menu]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openRowMenu(b, byId(Number(b.getAttribute('data-ea-menu')))); }));
    box.querySelectorAll('[data-ea-noop]').forEach((b) => b.addEventListener('click', () => nxToast({ message: 'Not part of this prototype' })));
  }

  /* ───────── switch (row 19) ───────── */
  function onSwitch(a) {
    if (a.status === 'disconnected') { nxToast({ message: 'Not part of this prototype' }); return; }
    if (a.status === 'paused') { a.status = 'active'; render(); nxToast({ message: 'Email account activated' }); return; }
    if (S.view === 'today') { a.status = 'paused'; render(); nxToast({ message: 'Email account paused successfully' }); return; }
    openPause(a);
  }

  /* ───────── proposed bar (B) ───────── */
  const why = 'Select email accounts first';
  function proposedBar() {
    const n = selCount();
    const none = n === 0;
    const bar = nxBulkBar({
      actions: [
        { id: 'settings', label: 'Settings', icon: 'ea-Adjustments', disabled: none, reason: why, onClick: () => nxToast({ message: 'Bulk settings update stays as it is today' }) },
        { id: 'score', label: 'Refresh score', icon: 'ea-Refresh', disabled: none, reason: why, onClick: () => nxToast({ message: 'Setup score updated successfully' }) },
        { id: 'tags', label: 'Tags', icon: 'ea-Tag', menu: true, disabled: none, reason: why, onClick: (btn) => openTagsMenu(btn) },
      ],
      risky: [
        { id: 'disconnect', label: 'Disconnect', count: null, icon: 'ea-Unlink', disabled: none, reason: why, onClick: () => openBulk('disconnect') },
        { id: 'delete', label: 'Delete', count: null, icon: 'trash', disabled: none, reason: why, onClick: () => openBulk('delete') },
      ],
    });
    // Disconnect is risky (sits after the divider, never in "More") but deletes nothing, so it is not red (spec B, Colour)
    const dis = bar.querySelector('[data-id="disconnect"]');
    if (dis) dis.classList.add('ea-neutral');
    return bar;
  }
  // nxBulkBar and nxStatusMenu draw icons from the SalesHandy icon font; Unlink and Adjustments are not in it.
  // Any <i class="sh-ea-Name"> is swapped for the @saleshandy/icons SVG, wherever the kit renders it.
  function swapIcons(rootEl) {
    rootEl.querySelectorAll('i[class*="sh-ea-"]').forEach((i) => {
      const name = [...i.classList].find((c) => c.startsWith('sh-ea-')).slice(6);
      const s = h(window.EA_SVG(name, 20, 'ea-ico'));
      i.replaceWith(s);
    });
  }
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((nd) => { if (nd.nodeType === 1) swapIcons(nd.parentElement || nd); }))).observe(document.body, { childList: true, subtree: true });

  function openTagsMenu(anchor, opts = {}) {
    return nxStatusMenu({
      anchor, label: 'Tags', width: 200, focus: opts.focus,
      options: [{ id: 'add', label: 'Add tags', icon: 'ea-Tag' }, { id: 'remove', label: 'Remove tags', icon: 'ea-Trash', disabled: !tagCounts(selected()).length, reason: 'The selected email accounts have no tags' }],
      onPick: (id) => (id === 'add' ? nxToast({ message: 'Not part of this prototype' }) : openRemoveTags()),
    });
  }

  /* ───────── dialogs (F) ───────── */
  const nE = (n) => `${fmt(n)} ${plural(n, 'email account', 'email accounts')}`;
  const nS = (n) => `${fmt(n)} ${plural(n, 'sequence', 'sequences')}`;
  const dlg = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.EA_BD, submitDelay: window.EA_SD }, o);
  const quoteList = (names) => {
    const q = names.map((x) => `“${esc(x)}”`);
    if (q.length <= 3) return q.length === 1 ? q[0] : `${q.slice(0, -1).join(', ')} and ${q[q.length - 1]}`;
    return `${q.slice(0, 3).join(', ')} and ${q.length - 3} more`;
  };
  const namesLine = (accts) => {
    const e = accts.map((a) => esc(a.email));
    return e.length <= 3 ? `${e.slice(0, -1).join(', ')} and ${e[e.length - 1]}` : `${e.slice(0, 3).join(', ')} and ${e.length - 3} more`;
  };
  function addLead(d, html) {
    const imp = d.el.querySelector('.nx-impact');
    if (imp) imp.prepend(h(`<p class="ea-lead nx-new">${html}</p>`));
  }

  // rows shared by delete, disconnect and pause; `one` = a single account ("it") or several ("them")
  function impactRows(imp, one, withWarm) {
    return [
      { key: 'stop', label: 'Sequences that pause, no other sender left', value: imp.stop.length },
      { key: 'keep', label: 'Sequences that keep sending from other accounts', value: imp.keep.length },
      { key: 'today', label: `Emails scheduled today from ${one ? 'it' : 'these accounts'}`, value: imp.today },
      ...(withWarm ? [{ key: 'warm', label: 'Accounts whose warm-up stops', value: one ? 0 : imp.warm }] : []),
    ];
  }
  const sentenceFor = (one) => (r) => ({
    stop: `${r.value === 1 ? '1 sequence pauses' : `${fmt(r.value)} sequences pause`}; no other sender is left.`,
    keep: `${nS(r.value)} keep${r.value === 1 ? 's' : ''} sending from other accounts.`,
    today: `${fmt(r.value)} ${plural(r.value, 'email is', 'emails are')} scheduled today from ${one ? 'it' : 'these accounts'}.`,
    warm: one ? 'Its warm-up stops.' : `Warm-up stops on ${nE(r.value)}.`,
  }[r.key]);
  const hasImpact = (imp, warm) => imp.stop.length + imp.keep.length + imp.today + (warm ? imp.warm : 0) > 0;
  const stopNote = (imp) => (imp.stop.length ? `${quoteList(imp.stop)} ${imp.stop.length === 1 ? 'has' : 'have'} no other sender.` : null);

  function openBulk(kind) {
    const sel = selected();
    const isDel = kind === 'delete';
    const targets = isDel ? sel : sel.filter((a) => a.status === 'active');
    const rest = sel.length - targets.length;
    const N = targets.length;
    if (!N) { nxToast({ message: 'None of the selected email accounts are active', variant: 'error' }); return null; }
    if (N === 1) return openSingle(kind, targets[0], rest);
    const imp = impact(targets);
    const all = isDel && N === list().length;
    const warmOne = isDel && imp.warm;
    const notes = [stopNote(imp), rest ? `${nE(rest)} ${rest === 1 ? 'is' : 'are'} already paused or disconnected and ${rest === 1 ? 'stays' : 'stay'} as ${rest === 1 ? 'it is' : 'they are'}.` : null].filter(Boolean);
    const d = nxImpactDialog(dlg({
      title: isDel ? (all ? `Delete all ${nE(N)}?` : `Delete ${nE(N)}?`) : `Disconnect ${nE(N)}?`,
      tone: isDel ? 'danger' : 'primary',
      rows: hasImpact(imp, isDel) ? impactRows(imp, false, isDel && warmOne) : [],
      sentence: sentenceFor(false),
      note: notes.join(' ') || null,
      consequence: isDel
        ? `${targets.some((a) => a.seqs.length) ? "Paused sequences that have already started can't be resumed. " : ''}This can't be undone.${all ? ' No email accounts will be left to send from.' : ''}`
        : 'They stop sending until you reconnect them.',
      primaryLabel: isDel ? (all ? `Delete all ${nE(N)}` : `Delete ${nE(N)}`) : `Disconnect ${nE(N)}`,
      failMessage: isDel
        ? { title: "We couldn't delete these email accounts because a teammate changed one of them a moment ago.", body: 'Refresh the page and try again.' }
        : { title: "We couldn't disconnect these email accounts because Google and Microsoft did not respond in time.", body: 'Nothing changed. Try again in a minute.' },
      onConfirm: () => done(kind, targets),
    }));
    addLead(d, namesLine(targets));
    return d;
  }

  function openSingle(kind, a, rest = 0) {
    const isDel = kind === 'delete';
    const imp = impact([a]);
    const active = a.status === 'active';
    const rows = active && a.seqs.length ? impactRows(imp, true, false) : [];
    const warm = isDel && a.warmup === 'running';
    const d = nxImpactDialog(dlg({
      title: `${isDel ? 'Delete' : 'Disconnect'} ${esc(a.email)}?`,
      tone: isDel ? 'danger' : 'primary',
      rows,
      sentence: sentenceFor(true),
      note: [stopNote(imp), rest ? `${nE(rest)} ${rest === 1 ? 'is' : 'are'} already paused or disconnected and ${rest === 1 ? 'stays' : 'stay'} as ${rest === 1 ? 'it is' : 'they are'}.` : null].filter(Boolean).join(' ') || null,
      consequence: isDel
        ? `${a.seqs.length ? `${warm ? 'Its warm-up stops, and paused' : 'Paused'} sequences that have already started can't be resumed.` : (warm ? 'Its warm-up stops.' : '')} This can't be undone.`.trim()
        : 'It stops sending until you reconnect it.',
      primaryLabel: `${isDel ? 'Delete' : 'Disconnect'} email account`,
      failMessage: isDel
        ? { title: `We couldn't delete ${esc(a.email)} because a teammate changed it a moment ago.`, body: 'Refresh the page and try again.' }
        : { title: `We couldn't disconnect ${esc(a.email)} because ${a.type === 'microsoft' ? 'Microsoft' : a.type === 'google' ? 'Google' : 'the mail server'} did not respond in time.`, body: 'Nothing changed. Try again in a minute.' },
      onConfirm: () => done(kind, [a]),
    }));
    if (!active) addLead(d, `It is ${a.status} and sends nothing today.`);
    else if (!a.seqs.length) addLead(d, 'No active sequence uses it.');
    return d;
  }

  function done(kind, accts) {
    const N = accts.length;
    if (kind === 'delete') {
      accts.forEach((a) => gone.add(a.id));
      clearSel(); render();
      nxToast({ message: N === 1 ? `Deleted ${esc(accts[0].email)}` : `Deleted ${nE(N)}` });
    } else {
      accts.forEach((a) => { a.status = 'disconnected'; });
      clearSel(); render();
      nxToast({ message: N === 1 ? `Disconnected ${esc(accts[0].email)}` : `Disconnected ${nE(N)}` });
    }
  }

  /* Pause from the switch (row 19): blue, undo */
  function openPause(a) {
    const imp = impact([a]);
    const d = nxImpactDialog(dlg({
      title: `Pause ${esc(a.email)}?`, tone: 'primary', icon: NX.IMG('pause-circle.svg'),
      rows: a.seqs.length ? impactRows(imp, true, false) : [],
      sentence: sentenceFor(true),
      note: stopNote(imp),
      consequence: 'It stops sending until you activate it again. You can undo this for 10 seconds.',
      primaryLabel: 'Pause email account',
      failMessage: { title: `We couldn't pause ${esc(a.email)} because it was disconnected a moment ago.`, body: 'Refresh the page.' },
      onConfirm: () => {
        a.status = 'paused'; render(); flash(a.id);
        nxUndoToast({
          message: `Paused ${esc(a.email)}`,
          undoneMessage: `Undone. ${esc(a.email)} is active again`,
          onUndo: () => { a.status = 'active'; render(); flash(a.id); },
          onCommit: () => {},
        });
      },
    }));
    if (!a.seqs.length) addLead(d, 'No active sequence uses it.');
    return d;
  }
  function flash(id) {
    const tr = box.querySelector(`tr[data-ea-row="${id}"]`);
    if (tr) { tr.classList.add('ea-flash'); setTimeout(() => tr.classList.remove('ea-flash'), 1200); }
  }

  /* Remove tags (row 20): the picker is the breakdown; blue, undo */
  function tagCounts(accts) {
    const m = new Map();
    accts.forEach((a) => a.tags.forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
    return [...m.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]));
  }
  function openRemoveTags(preset) {
    const accts = selected();
    const N = accts.length;
    const counts = tagCounts(accts);
    const pick = new Set(preset || []);
    const body = h(`<div class="nx-impact nx-new">
        <div class="nx-breakdown" aria-live="polite"><dl class="nx-rows ea-tagpick" role="group" aria-label="Tags on the selected email accounts" aria-busy="true">${counts.slice(0, Math.min(4, counts.length)).map(() => '<div class="nx-row"><dt><span class="react-loading-skeleton nx-skel-l"></span></dt><dd><span class="react-loading-skeleton"></span></dd></div>').join('')}</dl></div>
        <p class="nx-consequence"></p></div>`);
    const listEl = body.querySelector('.ea-tagpick');
    const cons = body.querySelector('.nx-consequence');
    let loaded = false;
    let failed = false;
    const affected = () => accts.filter((a) => a.tags.some((t) => pick.has(t))).length;
    const ctrl = nxDialog({
      title: N === 1 ? `Remove tags from ${esc(accts[0].email)}?` : `Remove tags from ${nE(N)}?`,
      tone: 'primary', icon: NX.IMG('tag-blue.svg'), body, primaryLabel: 'Remove tags', primaryDisabled: true,
      onPrimary(c) {
        c.setError(null); c.setBusy(true);
        setTimeout(() => {
          if (!c.el.isConnected) return;
          if (S.result === 'fail') {
            c.setBusy(false);
            c.setError(`<b>We couldn't remove these tags because a teammate deleted “${esc([...pick][0])}” a moment ago.</b>Refresh the page.`);
            c.primaryBtn.focus();
            return;
          }
          c.close('done');
          const tags = [...pick];
          const before = new Map(accts.map((a) => [a.id, a.tags.slice()]));
          const M = affected();
          accts.forEach((a) => { a.tags = a.tags.filter((t) => !pick.has(t)); });
          clearSel(); render();
          const tl = `${tags.length === 1 ? `“${esc(tags[0])}”` : `${tags.length} tags`}`;
          nxUndoToast({
            message: `Removed ${tl} from ${nE(M)}`,
            undoneMessage: `Undone. ${tags.length === 1 ? 'The tag is' : 'The tags are'} back on ${nE(M)}`,
            onUndo: () => { accts.forEach((a) => { a.tags = before.get(a.id); }); clearSel(); render(); },
            onCommit: () => {},
          });
        }, window.EA_SD != null ? window.EA_SD : 900);
      },
    });
    function sync() {
      const k = pick.size;
      const M = affected();
      const who = M === 1 ? accts.find((a) => a.tags.some((t) => pick.has(t))) : null;
      ctrl.el.querySelector('h2').innerHTML = k ? `Remove ${k} ${plural(k, 'tag', 'tags')} from ${who ? esc(who.email) : nE(M)}?` : (N === 1 ? `Remove tags from ${esc(accts[0].email)}?` : `Remove tags from ${nE(N)}?`);
      ctrl.setPrimary({ label: k ? `Remove ${k} ${plural(k, 'tag', 'tags')}${M > 1 ? ` from ${nE(M)}` : ''}` : 'Remove tags', disabled: !k });
      cons.innerHTML = k
        ? `${k === 1 ? 'It comes' : 'They come'} off ${N === 1 ? 'this email account' : failed ? `the email accounts that carry ${k === 1 ? 'it' : 'them'}` : nE(M)}; sending is not affected. You can undo this for 10 seconds.`
        : 'Pick the tags to remove. Sending is not affected.';
    }
    function draw() {
      listEl.removeAttribute('aria-busy');
      listEl.innerHTML = counts.map(([t, c]) => `<label class="nx-row ea-tagrow"><dt><input type="checkbox" value="${esc(t)}"${pick.has(t) ? ' checked' : ''}><span class="bs-tag bs-tag-blue-17 ea-tagchip"><span class="regular-2">${esc(t)}</span></span></dt><dd>${failed ? '' : (N === 1 ? '' : `On ${fmt(c)} of ${fmt(N)}`)}</dd></label>`).join('');
      if (failed) listEl.insertAdjacentHTML('afterend', `<p class="nx-loadfail"><img src="${NX.IMG('info-circle-blue.svg')}" alt="">We couldn't load how many accounts carry each tag. You can still continue.</p>`);
      listEl.querySelectorAll('input').forEach((cb) => cb.addEventListener('change', () => { cb.checked ? pick.add(cb.value) : pick.delete(cb.value); sync(); }));
      loaded = true;
    }
    sync();
    const delay = window.EA_BD != null ? window.EA_BD : (S.breakdown === 'slow' ? 2000 : S.breakdown === 'fail' ? 1200 : 500);
    setTimeout(() => {
      if (!ctrl.el.isConnected) return;
      failed = S.breakdown === 'fail';
      draw(); sync();
      const first = listEl.querySelector('input');
      if (first && !pick.size) first.focus({ preventScroll: true });
    }, delay);
    return { ctrl, get loaded() { return loaded; } };
  }

  /* ───────── row menu (rows 18) ───────── */
  let rowMenu = null;
  function closeRowMenu() { if (rowMenu) { rowMenu.el.remove(); rowMenu.btn.setAttribute('aria-expanded', 'false'); rowMenu = null; } }
  document.addEventListener('mousedown', (e) => { if (rowMenu && !rowMenu.el.contains(e.target) && !rowMenu.btn.contains(e.target)) closeRowMenu(); }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && rowMenu) { const b = rowMenu.btn; closeRowMenu(); b.focus(); } });
  function openRowMenu(btn, a) {
    if (rowMenu && rowMenu.btn === btn) { closeRowMenu(); return; }
    closeRowMenu();
    // email-accounts-table.tsx getEmailAccountsActions: Connect only when disconnected, Disconnect only when active
    const items = [{ key: 'edit', label: 'Edit', icon: 'Pencil' }];
    if (a.status === 'disconnected') items.push({ key: 'connect', label: 'Connect', icon: 'Link' });
    if (a.status === 'active') items.push({ key: 'disconnect', label: 'Disconnect', icon: 'Unlink' });
    items.push({ key: 'delete', label: 'Delete', icon: 'Trash' }, { key: 'setAsDefault', label: 'Set as Default', icon: 'FileCheck' });
    const el = h(window.EA_ROW_MENU_HTML(items));
    document.body.appendChild(el);
    const r = btn.getBoundingClientRect();
    el.style.position = 'fixed'; el.style.transform = 'none'; el.style.margin = '0'; el.style.zIndex = '1100';
    el.style.left = Math.max(8, r.right - el.offsetWidth) + 'px';
    const below = r.bottom + 2;
    el.style.top = (below + el.offsetHeight > window.innerHeight - 8 ? r.top - el.offsetHeight - 2 : below) + 'px';
    btn.setAttribute('aria-expanded', 'true');
    rowMenu = { el, btn };
    el.addEventListener('click', (e) => {
      const it = e.target.closest('[data-ea-act]');
      if (!it) return;
      e.preventDefault();
      const k = it.getAttribute('data-ea-act');
      closeRowMenu();
      onRowAction(k, a);
    });
    return el;
  }
  function onRowAction(k, a) {
    if (k === 'delete') {
      if (S.view === 'today') return window.EA_TODAY_DELETE(() => { done('delete', [a]); });
      return openSingle('delete', a);
    }
    if (k === 'disconnect') {
      if (S.view === 'today') return window.EA_TODAY_DISCONNECT(() => { done('disconnect', [a]); });
      return openSingle('disconnect', a);
    }
    if (k === 'setAsDefault') { DATA.forEach((x) => { x.isDefault = x.id === a.id; }); render(); nxToast({ message: 'Email account set as default, successfully' }); return null; }
    nxToast({ message: 'Not part of this prototype' });
    return null;
  }

  /* ───────── today's bar (production as it is) ───────── */
  let tagDrop = null;
  function closeTagDrop() { if (tagDrop) { tagDrop.remove(); tagDrop = null; } box.querySelectorAll('.tag-icon.selected').forEach((t) => t.classList.remove('selected')); }
  document.addEventListener('mousedown', (e) => { if (tagDrop && !tagDrop.contains(e.target) && !e.target.closest('[data-ea-today="tags"]')) closeTagDrop(); }, true);
  function wireToday(host) {
    host.querySelectorAll('[data-ea-today]').forEach((b) => b.addEventListener('click', () => {
      if (!selCount()) return; // production ignores clicks while disabled
      const k = b.getAttribute('data-ea-today');
      const sel = selected();
      if (k === 'disconnect') window.EA_TODAY_BULK_DISCONNECT(() => todayBulk('disconnect', sel.filter((a) => a.status === 'active')));
      else if (k === 'delete') window.EA_TODAY_BULK_DELETE(() => todayBulk('delete', sel));
      else if (k === 'tags') toggleTagDrop(b);
      else if (k === 'refresh_setup_score') nxToast({ message: 'Setup score updated successfully' });
      else nxToast({ message: 'Not part of this prototype' });
    }));
  }
  function todayBulk(kind, accts) {
    if (S.result === 'fail') { clearSel(); render(); nxToast({ message: 'Something went wrong. Please try again.', variant: 'error' }); return; }
    if (kind === 'delete') accts.forEach((a) => gone.add(a.id)); else accts.forEach((a) => { a.status = 'disconnected'; });
    clearSel(); render();
    nxToast({ message: kind === 'delete' ? 'Email accounts deleted successfully' : 'Email accounts disconnected successfully' });
  }
  function toggleTagDrop(btn) {
    if (tagDrop) { closeTagDrop(); return null; }
    tagDrop = h(window.EA_TAG_DROPDOWN());
    btn.parentElement.appendChild(tagDrop);
    btn.classList.add('selected');
    tagDrop.addEventListener('click', (e) => {
      const it = e.target.closest('[data-ea-tagmenu]');
      if (!it) return;
      const k = it.getAttribute('data-ea-tagmenu');
      closeTagDrop(); btn.classList.remove('selected');
      if (k === 'remove') todayRemoveTags(); else nxToast({ message: 'Not part of this prototype' });
    });
    return tagDrop;
  }
  function todayRemoveTags() {
    const accts = selected();
    return window.EA_TODAY_REMOVE_TAGS(tagCounts(accts).map(([t]) => t), (tags) => {
      accts.forEach((a) => { a.tags = a.tags.filter((t) => !tags.includes(t)); });
      clearSel(); render();
      nxToast({ message: 'Tags removed successfully' });
    });
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const bar = (id) => box.querySelector(`.nx-act[data-id="${id}"]`);
    const today = () => { S.view = 'today'; shell.setControl('view', 'today'); render(); };
    const confirmSoon = (d, extra = 0) => setTimeout(() => d && d.confirm(), (window.EA_BD || 0) + 60 + extra);
    const ravi = () => byId(2);
    const scrollTags = () => { const th = [...box.querySelectorAll('th')].find((t) => t.textContent.trim() === 'Tags'); if (!th) return; box.querySelectorAll('.table-scroll-container, .table-list').forEach((sc) => { if (sc.scrollWidth > sc.clientWidth) sc.scrollLeft = th.offsetLeft - 420; }); };
    const steps = {
      'none': () => { clearSel(); S.sel = '0'; shell.setControl('sel', '0'); render(); },
      'sel': () => {},
      'sel-banner-all': () => { S.all = true; render(); },
      'bar-narrow': () => { S.narrow = true; render(); },
      'bulk-delete': () => openBulk('delete'),
      'bulk-delete-submitting': () => confirmSoon(openBulk('delete')),
      'bulk-delete-error': () => { S.result = 'fail'; confirmSoon(openBulk('delete')); },
      'bulk-delete-done': () => confirmSoon(openBulk('delete')),
      'bulk-disconnect': () => openBulk('disconnect'),
      'bulk-disconnect-done': () => confirmSoon(openBulk('disconnect')),
      'row-menu': () => openRowMenu(box.querySelector('[data-ea-menu="2"]'), ravi()),
      'delete': () => openSingle('delete', ravi()),
      'disconnect': () => openSingle('disconnect', ravi()),
      'delete-paused': () => openSingle('delete', byId(11)),
      'pause': () => openPause(ravi()),
      'pause-none': () => openPause(byId(12)),
      'pause-error': () => { S.result = 'fail'; confirmSoon(openPause(ravi())); },
      'pause-toast': () => confirmSoon(openPause(ravi())),
      'pause-undone': () => { confirmSoon(openPause(ravi())); setTimeout(() => { const u = document.querySelector('.message-undo'); if (u) u.click(); }, (window.EA_BD || 0) + 2000); },
      'tags-menu': () => openTagsMenu(bar('tags') || bar('more'), { focus: false }),
      'more-menu': () => { const m = bar('more'); if (m) m.click(); },
      'remove-tags': () => openRemoveTags(['Q4 outreach', 'Secondary domain']),
      'remove-tags-empty': () => openRemoveTags(),
      'remove-tags-error': () => { S.result = 'fail'; const d = openRemoveTags(['Q4 outreach']); setTimeout(() => d.ctrl.confirm(), (window.EA_BD || 0) + 120); },
      'remove-tags-toast': () => { const d = openRemoveTags(['Q4 outreach', 'Secondary domain']); setTimeout(() => { d.ctrl.confirm(); setTimeout(scrollTags, (window.EA_SD || 0) + 80); }, (window.EA_BD || 0) + 120); },
      'remove-tags-undone': () => { const d = openRemoveTags(['Q4 outreach', 'Secondary domain']); setTimeout(() => { d.ctrl.confirm(); setTimeout(() => { const u = document.querySelector('.message-undo'); if (u) u.click(); setTimeout(scrollTags, 60); }, (window.EA_SD || 0) + 600); }, (window.EA_BD || 0) + 120); },
      'today': () => today(),
      'today-bulk-delete': () => { today(); window.EA_TODAY_BULK_DELETE(() => {}); },
      'today-bulk-disconnect': () => { today(); window.EA_TODAY_BULK_DISCONNECT(() => {}); },
      'today-delete': () => { today(); window.EA_TODAY_DELETE(() => {}); },
      'today-disconnect': () => { today(); window.EA_TODAY_DISCONNECT(() => {}); },
      'today-tags': () => { today(); toggleTagDrop(box.querySelector('[data-ea-today="tags"]')); },
      'today-remove-tags': () => { today(); const m = todayRemoveTags(); m.pick('Q4 outreach'); },
      'today-pause': () => { today(); onSwitch(ravi()); },
      'today-row-menu': () => { today(); openRowMenu(box.querySelector('[data-ea-menu="2"]'), ravi()); },
    };
    if (steps[state]) steps[state]();
  }

  window.EA_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.EA_SD = param('sd') != null ? Number(param('sd')) : undefined;
  applySel(S.sel);
  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 60);
})();
