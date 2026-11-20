/* Lead Finder (People) and Email Verifier: safe actions prototype (spec rows 21 to 25).
   Production markup is reproduced from webui main aeda4e3 in lead-finder-markup.js; new elements carry .nx-new.
   URL params: ?screen=lf|verifier &tab=new|saved &sel=10|page|all &credits=ok|low &result=ok|fail
   &breakdown=ok|slow|fail &view=proposed|today &state=<screenshot state> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, esc } = NX;
  const ICON = window.LF_ICON;
  const PAGE = 25;
  const LIST = 'Fintech CFOs';
  const QLIST = `“${LIST}”`;
  const LIST2 = 'Q4 London outreach';
  const SEQ = 'UK fintech CFOs, Q4';
  const COST = { email: 1, phone: 6, personal: 2 }; // useBulkReveal.ts L134-142: Email 1, Phone 6, EmailPhone 7
  const CRED = { lf: { ok: 4820, low: 190 }, ev: { ok: 5000, low: 950 } };
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/';
  const V2 = C + 'v2-lead/components/';

  /* ───────── scenario ───────── */
  const S = {
    screen: param('screen') === 'verifier' ? 'verifier' : 'lf',
    tab: param('tab') === 'saved' ? 'saved' : 'new',
    sel: ['10', 'page', 'all'].includes(param('sel')) ? param('sel') : 'none',
    credits: param('credits') === 'low' ? 'low' : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    view: param('view') === 'today' ? 'today' : 'proposed',
    page: 0,
    ids: new Set(),
    all: false,
    listFilter: LIST,
  };

  /* ───────── data ───────── */
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const FIRST = ['Priya', 'James', 'Sophie', 'Daniel', 'Aisha', 'Oliver', 'Hannah', 'Rahul', 'Emma', 'Tom', 'Chloe', 'Marcus', 'Fatima', 'George', 'Lucy', 'Arjun', 'Isla', 'Ben', 'Grace', 'Kwame', 'Amelia', 'Samuel', 'Zara', 'Harry', 'Ella', 'Nikhil', 'Freya', 'Leo', 'Maya', 'Callum', 'Ruth', 'Omar', 'Charlotte', 'Ethan', 'Leah', 'Adam', 'Rosie', 'Imran', 'Megan', 'Alex'];
  const LAST = ['Shah', 'Whitfield', 'Okafor', 'Turner', 'Rahman', 'Bennett', 'Clarke', 'Mehta', 'Hughes', 'Fraser', 'Lewis', 'Adeyemi', 'Patel', 'Morrison', 'Kerr', 'Doyle', 'Ahmed', 'Walsh', 'Reid', 'Mensah', 'Price', 'Cole', 'Iqbal', 'Hart', 'Barnes', 'Kapoor', 'Gray', 'Murphy', 'Lowe', 'Sinclair', 'Hale', 'Nair', 'Fleming', 'Cross', 'Varma', 'Byrne', 'Ellis', 'Chowdhury', 'Payne', 'Russo'];
  const TITLES = ['Chief Financial Officer', 'VP Finance', 'Head of Finance', 'Finance Director', 'CFO', 'VP Finance & Operations', 'Head of FP&A', 'Group Finance Director'];
  const COMPANIES = [['Northpay', 'northpay.co.uk'], ['Tallymoor', 'tallymoor.com'], ['Finch Ledger', 'finchledger.io'], ['Brightvault', 'brightvault.com'], ['Corvus Pay', 'corvuspay.com'], ['Quaycard', 'quaycard.co'], ['Mintlane', 'mintlane.io'], ['Fernwood Capital', 'fernwoodcapital.co.uk'], ['Kestrel Lending', 'kestrellending.com'], ['Paygrid', 'paygrid.io'], ['Harbourline', 'harbourline.com'], ['Ledgerwise', 'ledgerwise.co.uk'], ['Copperleaf FX', 'copperleaffx.com'], ['Nimbus Treasury', 'nimbustreasury.io'], ['Sterling Arc', 'sterlingarc.co.uk'], ['Orbit Payroll', 'orbitpayroll.com']];
  const CITIES = ['London, United Kingdom', 'London, United Kingdom', 'Manchester, United Kingdom', 'Edinburgh, United Kingdom', 'Leeds, United Kingdom', 'Bristol, United Kingdom', 'Cambridge, United Kingdom'];

  function person(i, r, saved) {
    const first = FIRST[(i * 7 + (saved ? 11 : 3)) % FIRST.length];
    const last = LAST[(i * 13 + (saved ? 5 : 1)) % LAST.length];
    const [company, dom] = COMPANIES[(i * 5 + (saved ? 2 : 0)) % COMPANIES.length];
    return {
      id: (saved ? 10000 : 1) + i, first, last, title: TITLES[(i * 3) % TITLES.length], company, dom,
      dept: 'Finance', city: CITIES[(i * 11) % CITIES.length],
      email: null, phone: null, personal: null, revealing: false, revealingPhone: false,
      hasPhone: r() < 0.62, hasEmail: r() < 0.93, lists: [],
    };
  }
  const emailOf = (l) => `${l.first.toLowerCase()}.${l.last.toLowerCase()}@${l.dom}`;
  const phoneOf = (l) => `+44 7${String(700 + (l.id * 37) % 299)} ${String(100000 + (l.id * 7919) % 899999)}`;

  const r1 = rng(7);
  const NEW = Array.from({ length: 250 }, (_, i) => person(i, r1, false));
  const r2 = rng(11);
  const SAVED = Array.from({ length: 1284 }, (_, i) => {
    const l = person(i, r2, true);
    l.email = emailOf(l);
    if (i % 3 !== 2) l.phone = phoneOf(l); else l.phoneNotFound = i % 2 === 0;
    l.lists = i < 40 ? (i % 10 < 3 ? [LIST, LIST2] : [LIST]) : (i % 9 === 0 ? [LIST2] : []);
    return l;
  });
  const hidden = new Set(); // removed from the list, inside the 10-second undo window
  const SAVED_FILTERS = [
    { id: 1, name: 'UK fintech finance leaders' },
    { id: 2, name: 'Series B CFOs, US' },
    { id: 3, name: 'DACH VP Finance, 200+ staff' },
    { id: 4, name: 'Nordic payments founders' },
  ];
  const LISTS = { pub: [{ id: 1, name: LIST }, { id: 2, name: LIST2 }, { id: 3, name: 'Payments ops leaders' }], priv: [{ id: 4, name: 'My warm intros' }] };

  const EV_EMAILS = (() => {
    const out = []; const r = rng(3);
    const doms = ['acmeworks.com', 'brightforge.co', 'northbeam.dev', 'quillstack.com', 'harborly.io', 'gridwise.co', 'kilnhq.com', 'loomstate.com', 'tallyroute.com', 'opslane.io'];
    for (let i = 0; i < 1200; i++) out.push(`${FIRST[(i * 7) % FIRST.length].toLowerCase()}${r() < 0.5 ? '.' : ''}${LAST[(i * 3 + 1) % LAST.length].toLowerCase()}${i > 39 ? i : ''}@${doms[(i * 11) % doms.length]}`);
    return out;
  })();
  const EV = { emails: EV_EMAILS.slice(), busy: false, jobs: [] };

  /* ───────── selection ───────── */
  const tabRows = () => (S.tab === 'saved' ? SAVED.filter((l) => !hidden.has(l.id) && (!S.listFilter || l.lists.includes(S.listFilter))) : NEW);
  const pageRows = () => tabRows().slice(S.page * PAGE, S.page * PAGE + PAGE);
  const isSel = (l) => (S.all ? true : S.ids.has(l.id));
  const selList = () => (S.all ? tabRows() : tabRows().filter((l) => S.ids.has(l.id)));
  const selCount = () => (S.all ? tabRows().length : S.ids.size);
  function clearSel() { S.ids.clear(); S.all = false; }
  function applyPreset(p) {
    clearSel(); S.page = 0;
    if (p === '10') tabRows().slice(0, 10).forEach((l) => S.ids.add(l.id));
    else if (p === 'page') pageRows().forEach((l) => S.ids.add(l.id));
    else if (p === 'all') S.all = true;
  }

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'leads',
    headerHTML: window.LF_TITLE(S.screen),
    controls: [
      { key: 'screen', label: 'Screen', value: S.screen, options: [['lf', 'Lead Finder'], ['verifier', 'Verifier']], onChange: (v) => { S.screen = v; shell.header.firstElementChild.outerHTML = window.LF_TITLE(v); render(); } },
      { key: 'sel', label: 'Selection', value: S.sel, options: [['10', '10'], ['page', 'Page'], ['all', 'All']], onChange: (v) => { S.sel = v; applyPreset(v); render(); } },
      { key: 'credits', label: 'Credits', value: S.credits, options: [['ok', 'Enough'], ['low', 'Short']], onChange: (v) => { S.credits = v; render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec rows 21 to 25. Credit totals are count x per-lead rate, known before the dialog opens, so L dialogs have no counting state. Remove from list is the only action here with undo; spends never get undo.',
      rows: [
        { n: 21, surface: 'Lead Finder > People (Total, New)', action: 'Bulk View Work Email, View Phone', patterns: 'A L', breakdown: 'A receipt: work emails 250 × 1, phone numbers 250 × 6 (View Phone reveals email + phone, 7 per lead), total last. One cost alone is a sentence. Under it one balance line: "You have 4,820 credits. 3,070 left after this.", or "60 short." in red. Partial run spends what is there. Today\'s tag picker is kept inside the dialog.', undo: 'No (spend)',
          code: [{ label: 'v2-lead-header.tsx L636-666 (View Work Email, View Phone)', url: V2 + 'header/v2-lead-header.tsx#L636-L666' }, { label: 'useBulkReveal.ts L134-184 (per-lead costs, check only)', url: V2 + 'hooks/useBulkReveal.ts#L134-L184' }, { label: 'bulk-reveal-tag-modal.tsx L52-58 (count, no credit total)', url: V2 + 'modal/bulk-reveal-tag-modal/bulk-reveal-tag-modal.tsx#L52-L58' }, { label: 'credit-not-available-modal.tsx (per-lead price only)', url: V2 + 'modal/credit-not-available-modal/credit-not-available-modal.tsx' }] },
        { n: 22, surface: 'Lead Finder > People (Total, New)', action: 'Save to List, Add to Sequence with reveal', patterns: 'L', breakdown: 'Same receipt and balance line as row 21 (one row per type when Email + Phone is on). Saved tab spends nothing and skips the cost step.', undo: 'No (spend)',
          code: [{ label: 'add-to-list-dropdown.tsx L527-616 (per-unit chip, no total)', url: V2 + 'add-to-list-dropdown/add-to-list-dropdown.tsx#L527-L616' }, { label: 'add-to-sequence-reveal-modal.tsx L41-74 (per-unit chip)', url: V2 + 'modal/add-to-sequence-reveal-modal/add-to-sequence-reveal-modal.tsx#L41-L74' }] },
        { n: 23, surface: 'Lead Finder > People > Saved', action: 'Remove From List', patterns: 'A F H', breakdown: 'List named in the title. Rows: also in other lists, only in this list. Several lists picked: one row per list. "This empties the list." when every lead in it is selected.', undo: 'Yes, 10 seconds',
          code: [{ label: 'v2-lead-header.tsx L618-633 (button)', url: V2 + 'header/v2-lead-header.tsx#L618-L633' }, { label: 'remove-from-list-modal.tsx L49-70 (no count, "Apply")', url: V2 + 'remove-from-list-modal/remove-from-list-modal.tsx#L49-L70' }] },
        { n: 24, surface: 'Lead Finder > filters', action: 'Delete saved filter', patterns: 'F', breakdown: 'Single item: the filter is named in the title. No lookup, no counting state.', undo: 'No',
          code: [{ label: 'save-filter-modal.tsx L72-78, L189-195 ("Are you sure, you want to continue?")', url: V2 + 'modal/save-filter-modal/save-filter-modal.tsx#L72-L78' }, { label: 'saved-filter.tsx (trash per row in the popover)', url: V2 + 'filter/saved-filter/saved-filter.tsx' }] },
        { n: 25, surface: 'Email Verifier', action: 'Verify', patterns: 'L', breakdown: 'Emails, credits this uses, you have, left after. Not enough: Buy credits, or verify the first N.', undo: 'No (spend)',
          code: [{ label: 'email-input-and-file-upload.tsx L87-101 (spends and clears the input at once)', url: C + 'email-verifier/email-verifier-input-and-file-upload/email-input-and-file-upload.tsx#L87-L101' }, { label: 'emails-and-domains-input.tsx (credit message)', url: C + 'settings/components/do-not-contact/components/do-not-contact-list-details/components/do-not-contact-list-details-input/emails-and-domains-input.tsx' }] },
      ],
      notes: [
        'Credits are counted for every selected lead not yet revealed for that type. Today the client checks every selected lead (useBulkReveal comment); whether the backend charges again for a lead already revealed is for dev to confirm.',
        'The tag picker from today\'s "Add Tag" modal moves into the cost dialog as an optional field, so a bulk reveal is one dialog, not two.',
        'Not enough credits: "Buy credits" is the primary; the secondary spends only what is there ("Reveal 190 emails"). Partial runs need the backend to accept a count.',
        'Remove from list goes straight to the dialog when the Saved view is filtered to one list; otherwise today\'s list picker comes first and its button reads "Continue".',
        'Email Verifier keeps the pasted emails until the request succeeds. Today they are cleared on click, before the result is known, and a failure loses them.',
        'To confirm with dev: whether Email Verifier charges for every email whatever the result, and whether Add to Sequence with reveal skips leads with no email found. Both would earn a line in the dialog; neither is stated until confirmed. Also confirm that leads removed from a list stay in Saved with their details: the Remove dialog says so.',
        'The "Pasted emails, 1,200" row after Verify is a stand-in for production\'s results table (pagination-accordion-table), which this prototype does not rebuild.',
        'Email Verifier today disables Verify when credits are short while the input says "Only 950 emails will be verify", which promises a partial run the button does not allow.',
      ],
    },
  });
  const root = NX.h('<div id="lf-root"></div>');
  shell.body.appendChild(root);

  /* ───────── render ───────── */
  const creditsLF = () => CRED.lf[S.credits];
  const creditsEV = () => CRED.ev[S.credits];

  function render() {
    NX.closeMenu();
    closePop();
    if (S.screen === 'verifier') {
      root.innerHTML = window.LF_VERIFIER({ emails: EV.emails, credits: creditsEV(), view: S.view, busy: EV.busy, jobs: EV.jobs });
      root.querySelector('[data-lf-verify]').addEventListener('click', onVerify);
      root.querySelectorAll('[data-lf-noop]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); nxToast({ message: 'Not part of this prototype' }); }));
      NX.settle(root);
      return;
    }
    const rows = tabRows();
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    if (S.page >= pages) S.page = pages - 1;
    const pr = pageRows();
    root.innerHTML = window.LF_PAGE({
      view: S.view, tab: S.tab, selected: selCount(), listFilter: S.listFilter,
      counts: { total: 262, new: 250, saved: S.listFilter ? tabRows().length : fmt(SAVED.length - hidden.size) },
      cols: S.tab === 'saved' ? ['name', 'title', 'company', 'email', 'phone', 'lists', 'dept'] : ['name', 'title', 'company', 'email', 'personal', 'phone', 'dept', 'location'],
      rows: pr, isSel, total: rows.length, page: S.page, pages, pageSize: PAGE,
      count: selCount(), all: S.all, pageRows: pr.length, scope: S.tab === 'saved' && S.listFilter ? `in ${QLIST}` : 'matching your filters',
    });
    wire(pr);
    placeInk();
    NX.settle(root);
  }

  function wire(pr) {
    const head = root.querySelector('[data-lf="check-all"]');
    if (head) {
      const on = pr.filter(isSel).length;
      head.indeterminate = on > 0 && on < pr.length;
      head.addEventListener('change', () => {
        if (S.all) { clearSel(); render(); return; }
        pr.forEach((l) => (head.checked ? S.ids.add(l.id) : S.ids.delete(l.id)));
        render();
      });
    }
    root.querySelectorAll('[data-lf-row]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-lf-row'));
      if (S.all) { S.all = false; tabRows().forEach((l) => S.ids.add(l.id)); }
      cb.checked ? S.ids.add(id) : S.ids.delete(id);
      render();
    }));
    root.querySelectorAll('[data-lf-tab]').forEach((b) => b.addEventListener('click', () => {
      const t = b.getAttribute('data-lf-tab');
      if (t === 'total') { nxToast({ message: 'Not part of this prototype' }); return; }
      S.tab = t; S.page = 0; clearSel(); render();
    }));
    root.querySelectorAll('[data-lf-page]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const v = a.getAttribute('data-lf-page');
      S.page = v === 'prev' ? S.page - 1 : v === 'next' ? S.page + 1 : Number(v);
      render();
    }));
    const on = (sel, fn) => root.querySelectorAll(sel).forEach((el) => el.addEventListener('click', fn));
    on('[data-lf-selall]', () => { S.all = true; S.ids.clear(); render(); });
    on('[data-lf-clear]', () => { clearSel(); render(); });
    on('[data-lf-pill]', () => nxToast({ message: 'Not part of this prototype' }));
    on('[data-lf-clear-all]', (e) => { e.stopPropagation(); if (S.tab === 'saved') { S.listFilter = null; S.page = 0; clearSel(); render(); } else nxToast({ message: 'Not part of this prototype' }); });
    on('[data-lf-row-reveal]', (e) => { const id = Number(e.currentTarget.getAttribute('data-lf-row-reveal')); revealRows(NEW.filter((l) => l.id === id), false); nxToast({ message: '1 Lead will be revealed' }); });
    on('[data-lf-act]', (e) => onAction(e.currentTarget.getAttribute('data-lf-act'), e.currentTarget));
  }

  function placeInk() {
    const tab = root.querySelector('.v2-lead-header .bs-tabs-tab-active');
    const ink = root.querySelector('[data-lf="ink"]');
    if (!tab || !ink) return;
    ink.style.left = tab.offsetLeft + 'px';
    ink.style.width = tab.offsetWidth + 'px';
  }
  document.fonts && document.fonts.ready.then(placeInk);
  window.addEventListener('resize', placeInk);

  function onAction(id, el) {
    if (el.disabled) return;
    if (id === 'noop') return nxToast({ message: 'Not part of this prototype' });
    if (id === 'reveal-email') return S.view === 'today' ? todayReveal('email') : openReveal('email');
    if (id === 'reveal-phone') return S.view === 'today' ? todayReveal('phone') : openReveal('phone');
    if (id === 'save-list') return openSaveToList();
    if (id === 'add-seq') return openAddToSeq();
    if (id === 'remove-list') return S.view === 'today' ? todayRemove() : openRemove();
    if (id === 'saved-filters') return openSavedFilters(el);
    return null;
  }

  /* ───────── helpers ───────── */
  const nL = (n) => `${fmt(n)} ${plural(n, 'lead', 'leads')}`;
  const common = (o) => Object.assign({ submit: S.result, submitDelay: window.LF_SD }, o);
  function mountModal(html, wireFn) {
    const m = NX.h(html);
    document.body.appendChild(m);
    const close = () => { m.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey, true);
    m.querySelectorAll('[data-lf-cancel], [data-lf-x]').forEach((b) => b.addEventListener('click', close));
    if (wireFn) wireFn(m, close);
    return { el: m, close };
  }
  // the kit's cost dialog with page extras placed before the consequence (tag picker, note)
  function costDialog(o) {
    const d = nxCostDialog(common(o));
    const imp = d.ctrl.body.querySelector('.nx-impact');
    const cons = imp.querySelector('.nx-consequence');
    if (o.note) imp.insertBefore(NX.h(`<p class="nx-note">${o.note}</p>`), cons);
    if (o.tagField) {
      const f = NX.h('<div class="nx-field"><label for="lf-tag">Tag these leads to find them later (optional)</label><input type="text" id="lf-tag" placeholder="Enter a tag" autocomplete="off"></div>');
      imp.insertBefore(f, cons);
    }
    return d;
  }

  /* ───────── 21: bulk reveal ───────── */
  function revealPlan(kind) {
    const list = selList();
    const needEmail = list.filter((l) => !l.email && !l.emailNotFound).length;
    const needPhone = kind === 'phone' ? list.filter((l) => !l.phone && !l.phoneNotFound).length : 0;
    const items = [{ name: 'Work emails', qty: needEmail, rate: COST.email, credits: needEmail * COST.email }];
    if (kind === 'phone') items.push({ name: 'Phone numbers', qty: needPhone, rate: COST.phone, credits: needPhone * COST.phone });
    return { list, needEmail, needPhone, items: kind === 'phone' ? items : [{ label: 'Credits this uses', credits: needEmail * COST.email }], already: list.length - (kind === 'phone' ? Math.max(needEmail, needPhone) : needEmail) };
  }
  function openReveal(kind) {
    const p = revealPlan(kind);
    const N = p.list.length;
    const have = creditsLF();
    const per = kind === 'phone' ? COST.email + COST.phone : COST.email;
    const fit = Math.floor(have / per);
    const what = kind === 'phone' ? 'emails and phones' : 'emails';
    const doReveal = (count) => () => {
      const target = p.list.filter((l) => !l.email || (kind === 'phone' && !l.phone)).slice(0, count);
      clearSel();
      revealRows(target, kind === 'phone');
      nxToast({ message: `Revealing ${what} for ${nL(target.length)}. We will let you know when it is done.`, delay: 4000 });
    };
    return costDialog({
      title: kind === 'phone' ? `Reveal work emails and phones for ${nL(N)}?` : `Reveal work emails for ${nL(N)}?`,
      items: p.items, have,
      note: p.already > 0 ? `${nL(p.already)} already ${p.already === 1 ? 'has' : 'have'} ${kind === 'phone' ? 'these details' : 'a work email'} and cost nothing.` : null,
      tagField: true,
      primaryLabel: `Reveal ${fmt(Math.max(p.needEmail, p.needPhone))} ${what}`,
      partial: fit > 0 ? { label: `Reveal ${fmt(fit)} ${what}`, onConfirm: doReveal(fit) } : null,
      onBuy: () => nxToast({ message: 'Opens Billing > Lead Finder credits. Not part of this prototype' }),
      failMessage: { title: 'No credits were used.', body: 'The reveal did not start because we could not reach the server. Try again.' },
      onConfirm: doReveal(Infinity),
    });
  }
  function revealRows(rows, phone) {
    rows.forEach((l) => { l.revealing = true; l.revealingPhone = phone; });
    render();
    setTimeout(() => {
      rows.forEach((l) => {
        l.revealing = false; l.revealingPhone = false;
        if (l.hasEmail) l.email = emailOf(l); else l.emailNotFound = true;
        if (phone) { if (l.hasPhone) l.phone = phoneOf(l); else l.phoneNotFound = true; }
      });
      if (S.screen === 'lf') render();
    }, window.LF_REVEAL_MS != null ? window.LF_REVEAL_MS : 2500);
  }
  function todayReveal(kind) {
    const N = selCount();
    const per = kind === 'phone' ? 7 : 1;
    if (creditsLF() < N * per) return mountModal(window.LF_TODAY_NO_CREDIT(kind === 'phone' ? '7 credits' : '1 credit'), (m, close) => m.querySelector('[data-lf-submit]').addEventListener('click', () => { close(); nxToast({ message: 'Opens Billing > Lead Finder credits. Not part of this prototype' }); }));
    return mountModal(window.LF_TODAY_TAG_MODAL(N), (m, close) => m.querySelector('[data-lf-submit]').addEventListener('click', () => {
      close();
      const list = selList(); clearSel(); revealRows(list, kind === 'phone');
      nxToast({ message: 'Bulk reveal for leads are started. This can take few moments, You will be notified once the process is completed.', delay: 4000 });
    }));
  }

  /* ───────── 22: Save to List, Add to Sequence with reveal ───────── */
  const spends = () => S.tab !== 'saved';
  function openSaveToList() {
    const N = selCount();
    const st = { picked: [], phone: false };
    if (S.view === 'today' && spends() && creditsLF() < N) return mountModal(window.LF_TODAY_NO_CREDIT('1 credit'));
    const draw = () => window.LF_SAVE_TO_LIST({
      picked: st.picked, phone: st.phone, proposed: S.view !== 'today' && spends(), alreadyIn: S.tab === 'saved' && N === 1 ? [LISTS.pub[0]] : [],
      publicLists: LISTS.pub, privateLists: LISTS.priv, showSwitch: spends(),
      chip: spends() ? `${st.phone ? 7 : 1}/ Lead` : '', saveLabel: S.view !== 'today' && spends() ? 'Continue' : 'Save',
    });
    let modal = null;
    const mount = () => {
      modal = mountModal(draw(), (m, close) => {
        m.querySelectorAll('[data-lf-list]').forEach((it) => it.addEventListener('click', () => {
          const id = Number(it.getAttribute('data-lf-list'));
          st.picked = st.picked.includes(id) ? st.picked.filter((x) => x !== id) : [...st.picked, id];
          close(); mount();
        }));
        const sw = m.querySelector('[data-lf-switch]');
        if (sw) sw.addEventListener('change', () => { st.phone = sw.checked; close(); mount(); });
        m.querySelector('[data-lf-submit]').addEventListener('click', () => {
          const names = [...LISTS.pub, ...LISTS.priv].filter((l) => st.picked.includes(l.id)).map((l) => l.name);
          close();
          if (S.view === 'today' || !spends()) { clearSel(); render(); nxToast({ message: 'Leads added to list(s) successfully' }); return; }
          saveCost(names, st.phone);
        });
      });
    };
    mount();
    return modal;
  }
  function saveCost(names, phone) {
    const list = selList(); const N = list.length;
    const needE = list.filter((l) => !l.email).length;
    const needP = phone ? list.filter((l) => !l.phone).length : 0;
    const where = names.length === 1 ? `“${esc(names[0])}”` : `${names.length} lists`;
    const have = creditsLF();
    const fit = Math.floor(have / (phone ? 7 : 1));
    const go = (count) => () => { const t = list.slice(0, count); clearSel(); revealRows(t.filter((l) => !l.email), phone); nxToast({ message: `Saving ${nL(t.length)} to ${where}. Their ${phone ? 'emails and phones are' : 'emails are'} being revealed.`, delay: 4000 }); };
    return costDialog({
      title: `Reveal ${phone ? 'emails and phones' : 'work emails'} for ${nL(N)} and save them to ${where}?`,
      items: phone ? [{ name: 'Work emails', qty: needE, rate: 1, credits: needE }, { name: 'Phone numbers', qty: needP, rate: 6, credits: needP * 6 }] : [{ label: 'Credits this uses', credits: needE }],
      have, primaryLabel: `Save ${nL(N)}`,
      partial: fit > 0 ? { label: `Save ${nL(fit)}`, onConfirm: go(fit) } : null,
      onBuy: () => nxToast({ message: 'Opens Billing > Lead Finder credits. Not part of this prototype' }),
      failMessage: { title: 'No credits were used and nothing was saved.', body: 'We could not reach the server. Try again.' },
      onConfirm: go(Infinity),
    });
  }
  function openAddToSeq() {
    const N = selCount();
    const st = { phone: false };
    if (!spends()) return mountModal(window.LF_ADD_TO_SEQ({ seq: SEQ, showSwitch: false }), (m, close) => m.querySelector('[data-lf-submit]').addEventListener('click', () => { close(); clearSel(); render(); nxToast({ message: `${nL(N)} added to the sequence` }); }));
    let modal;
    const mount = () => {
      modal = mountModal(window.LF_ADD_TO_SEQ({ seq: SEQ, showSwitch: true, phone: st.phone, chip: `${st.phone ? 7 : 1}/ Lead`, proposed: S.view !== 'today', submit: S.view === 'today' ? 'Add' : 'Continue' }), (m, close) => {
        const sw = m.querySelector('[data-lf-switch]');
        sw.addEventListener('change', () => { st.phone = sw.checked; close(); mount(); });
        m.querySelector('[data-lf-submit]').addEventListener('click', () => {
          close();
          if (S.view === 'today') {
            if (creditsLF() < N * (st.phone ? 7 : 1)) { mountModal(window.LF_TODAY_NO_CREDIT(st.phone ? '7 credits' : '1 credit')); return; }
            const list = selList(); clearSel(); revealRows(list, st.phone); nxToast({ message: 'Bulk reveal for leads are started. This can take few moments, You will be notified once the process is completed.', delay: 4000 }); return;
          }
          seqCost(st.phone);
        });
      });
    };
    mount();
    return modal;
  }
  function seqCost(phone) {
    const list = selList(); const N = list.length;
    const needE = list.filter((l) => !l.email).length;
    const needP = phone ? list.filter((l) => !l.phone).length : 0;
    const have = creditsLF();
    const fit = Math.floor(have / (phone ? 7 : 1));
    const go = (count) => () => { const t = list.slice(0, count); clearSel(); revealRows(t, phone); nxToast({ message: `Adding ${nL(t.length)} to “${SEQ}” as their emails are revealed.`, delay: 4000 }); };
    return costDialog({
      title: `Reveal ${phone ? 'emails and phones' : 'work emails'} for ${nL(N)} and add them to “${SEQ}”?`,
      items: phone ? [{ name: 'Work emails', qty: needE, rate: 1, credits: needE }, { name: 'Phone numbers', qty: needP, rate: 6, credits: needP * 6 }] : [{ label: 'Credits this uses', credits: needE }],
      have, primaryLabel: `Add ${nL(N)}`,
      consequence: 'They start at Step 1 of the sequence.',
      partial: fit > 0 ? { label: `Add ${nL(fit)}`, onConfirm: go(fit) } : null,
      onBuy: () => nxToast({ message: 'Opens Billing > Lead Finder credits. Not part of this prototype' }),
      failMessage: { title: 'No credits were used and no one was added.', body: 'We could not reach the server. Try again.' },
      onConfirm: go(Infinity),
    });
  }

  /* ───────── 23: Remove from list (A F H) ───────── */
  function listsOfSelection() {
    const sel = selList();
    const names = [...new Set(sel.flatMap((l) => l.lists))];
    return names.map((n, i) => ({ id: i + 1, name: n, count: sel.filter((l) => l.lists.includes(n)).length }));
  }
  function todayRemove() {
    const lists = listsOfSelection();
    const picked = new Set();
    return mountModal(window.LF_REMOVE_PICKER(lists), (m, close) => {
      const sub = m.querySelector('[data-lf-submit]');
      m.querySelectorAll('[data-lf-pick]').forEach((cb) => cb.addEventListener('change', () => { const id = Number(cb.getAttribute('data-lf-pick')); cb.checked ? picked.add(id) : picked.delete(id); sub.disabled = picked.size === 0; }));
      sub.addEventListener('click', () => {
        const names = lists.filter((l) => picked.has(l.id)).map((l) => l.name);
        const sel = selList();
        close();
        sel.forEach((l) => { l.lists = l.lists.filter((n) => !names.includes(n)); });
        clearSel(); render();
        nxToast({ message: 'Leads removed from list(s) successfully' });
      });
    });
  }
  function openRemove(names) {
    if (!names) {
      if (S.listFilter) names = [S.listFilter];
      else {
        const lists = listsOfSelection();
        const picked = new Set();
        return mountModal(window.LF_REMOVE_PICKER(lists.map((l) => ({ ...l, meta: nL(l.count) })), { proposed: true, submit: 'Continue' }), (m, close) => {
          const sub = m.querySelector('[data-lf-submit]');
          m.querySelectorAll('[data-lf-pick]').forEach((cb) => cb.addEventListener('change', () => { const id = Number(cb.getAttribute('data-lf-pick')); cb.checked ? picked.add(id) : picked.delete(id); sub.disabled = picked.size === 0; }));
          sub.addEventListener('click', () => { close(); openRemove(lists.filter((l) => picked.has(l.id)).map((l) => l.name)); });
          if (window.LF_PICK_ALL) m.querySelectorAll('[data-lf-pick]').forEach((cb) => { cb.checked = true; cb.dispatchEvent(new Event('change')); });
        });
      }
    }
    const sel = selList().filter((l) => l.lists.some((n) => names.includes(n)));
    const N = sel.length;
    const one = names.length === 1;
    const listSize = (n) => SAVED.filter((l) => !hidden.has(l.id) && l.lists.includes(n)).length;
    const empties = one && N === listSize(names[0]);
    const single = N === 1 ? `${sel[0].first} ${sel[0].last}` : null;
    const where = one ? `“${esc(names[0])}”` : `${names.length} lists`;
    const title = single ? `Remove ${esc(single)} from ${where}?` : empties && N > 1 ? `Remove all ${nL(N)} from ${where}?` : `Remove ${nL(N)} from ${where}?`;
    const others = sel.filter((l) => l.lists.some((n) => !names.includes(n))).length;
    const rows = one
      ? [{ label: 'Also in other lists, where they stay', value: others }, { label: 'Only in this list', value: N - others }]
      : names.map((n) => ({ label: `In “${esc(n)}”`, value: sel.filter((l) => l.lists.includes(n)).length }));
    return nxImpactDialog({
      title, tone: 'primary', icon: NX.IMG('info-circle-blue.svg'), rows,
      sentence: (r) => (N === 1 ? `${esc(sel[0].first)} is ${others ? 'also in other lists, where they stay' : 'only in this list'}.` : r.value === N ? (others ? `All ${fmt(N)} are also in other lists, where they stay.` : `None of them are in any other list.`) : ''),
      consequence: `They leave ${one ? 'this list' : 'these lists'} and stay in Saved with their contact details. You can undo this for 10 seconds.${empties ? ' This empties the list.' : ''}`,
      primaryLabel: single ? 'Remove lead' : empties && N > 1 ? `Remove all ${nL(N)}` : `Remove ${nL(N)}`,
      breakdown: S.breakdown, submit: S.result, breakdownDelay: window.LF_BD, submitDelay: window.LF_SD,
      failMessage: { title: `We couldn't remove ${N === 1 ? 'this lead' : 'these leads'} because ${one ? 'the list was' : 'a list was'} deleted by a teammate.`, body: 'Refresh the page to see your current lists.' },
      onConfirm: () => {
        const before = sel.map((l) => [l, l.lists.slice()]);
        sel.forEach((l) => { l.lists = l.lists.filter((n) => !names.includes(n)); });
        clearSel(); render();
        nxUndoToast({
          message: `Removed ${nL(N)} from ${where}`,
          undoneMessage: `Undone. ${nL(N)} ${N === 1 ? 'is' : 'are'} back in ${where}`,
          onUndo: () => { before.forEach(([l, ls]) => { l.lists = ls; }); clearSel(); render(); },
          onCommit: () => {},
        });
      },
    });
  }

  /* ───────── 24: Delete saved filter ───────── */
  let pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('mousedown', (e) => { if (pop && !pop.contains(e.target) && !e.target.closest('[data-lf-act="saved-filters"]')) closePop(); }, true);
  function openSavedFilters(anchor) {
    if (pop) { closePop(); return; }
    pop = NX.h(window.LF_SAVED_FILTERS_POPOVER(SAVED_FILTERS));
    document.body.appendChild(pop);
    const r = anchor.getBoundingClientRect();
    pop.style.position = 'fixed';
    pop.style.left = Math.max(8, r.left - 8) + 'px';
    pop.style.top = (r.top - pop.offsetHeight - 8) + 'px';
    pop.querySelectorAll('[data-lf-del-filter]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const f = SAVED_FILTERS.find((x) => x.id === Number(b.getAttribute('data-lf-del-filter')));
      closePop();
      openDeleteFilter(f);
    }));
  }
  function openDeleteFilter(f) {
    if (S.view === 'today') {
      return mountModal(window.LF_TODAY_DELETE_FILTER(), (m, close) => m.querySelector('[data-lf-submit]').addEventListener('click', () => {
        close(); SAVED_FILTERS.splice(SAVED_FILTERS.indexOf(f), 1); nxToast({ message: 'Filter deleted' });
      }));
    }
    return nxImpactDialog({
      title: `Delete the saved filter “${esc(f.name)}”?`, tone: 'danger',
      consequence: 'Your leads, lists and current search are not affected. This can\'t be undone.',
      primaryLabel: 'Delete filter', submit: S.result, submitDelay: window.LF_SD,
      failMessage: { title: `We couldn't delete “${esc(f.name)}” because the server did not respond.`, body: 'Try again in a minute.' },
      onConfirm: () => { SAVED_FILTERS.splice(SAVED_FILTERS.indexOf(f), 1); nxToast({ message: `Deleted the saved filter “${esc(f.name)}”` }); },
    });
  }

  /* ───────── 25: Email Verifier ───────── */
  function onVerify() {
    const n = EV.emails.length;
    if (!n) return;
    if (S.view === 'today') {
      // today: spends at once and clears the box before the result is known (L87-101)
      EV.emails = []; EV.busy = true; render();
      setTimeout(() => {
        EV.busy = false;
        if (S.result === 'fail') { render(); nxToast({ message: 'Something went wrong. Please try again.', variant: 'error' }); return; }
        EV.jobs = [{ name: `Pasted emails, ${fmt(n)}`, status: 'Verifying' }]; render(); nxToast({ message: 'Email verification has started.' });
      }, window.LF_SD != null ? window.LF_SD : 900);
      return;
    }
    const have = creditsEV();
    const done = (count) => () => {
      EV.emails = EV.emails.slice(count);
      EV.jobs = [{ name: `Pasted emails, ${fmt(count)}`, status: 'Verifying' }, ...EV.jobs];
      render();
      nxToast({ message: `Verifying ${fmt(count)} ${plural(count, 'email', 'emails')}. Results appear below as each one is checked.`, delay: 4000 });
    };
    costDialog({
      title: `Verify ${fmt(n)} ${plural(n, 'email', 'emails')}?`,
      items: [{ label: 'Credits this uses', credits: n }], have,
      primaryLabel: `Verify ${fmt(n)} ${plural(n, 'email', 'emails')}`,
      partial: have > 0 ? { label: `Verify ${fmt(have)} emails`, onConfirm: done(have) } : null,
      onBuy: () => nxToast({ message: 'Opens Billing > Email Verifier credits. Not part of this prototype' }),
      failMessage: { title: 'No credits were used.', body: 'We could not start the check. Your emails are still in the box; try again.' },
      onConfirm: done(n),
    });
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const sel = (p) => { applyPreset(p); render(); };
    const sub = (d) => setTimeout(() => d.confirm(), 60);
    const steps = {
      'today': () => { sel('page'); },
      'sel-10': () => sel('10'),
      'sel-page': () => sel('page'),
      'sel-all': () => sel('all'),
      'reveal-email': () => { sel('all'); openReveal('email'); },
      'reveal-phone': () => { sel('all'); openReveal('phone'); },
      'reveal-submitting': () => { sel('all'); sub(openReveal('email')); },
      'reveal-fail': () => { S.result = 'fail'; sel('all'); sub(openReveal('email')); },
      'reveal-done': () => { sel('page'); const d = openReveal('email'); sub(d); },
      'today-reveal': () => { sel('all'); todayReveal('email'); },
      'save-list': () => { sel('all'); openSaveToList(); setTimeout(() => document.querySelector('[data-lf-list="1"]').click(), 30); },
      'save-cost': () => { sel('all'); saveCost([LIST], false); },
      'save-cost-phone': () => { sel('all'); saveCost([LIST], true); },
      'today-save-list': () => { sel('all'); openSaveToList(); },
      'add-seq': () => { sel('page'); openAddToSeq(); },
      'seq-cost': () => { sel('page'); seqCost(false); },
      'remove': () => { S.tab = 'saved'; sel('all'); openRemove(); },
      'remove-part': () => { S.tab = 'saved'; sel('10'); openRemove(); },
      'remove-submitting': () => { S.tab = 'saved'; sel('all'); sub(openRemove()); },
      'remove-fail': () => { S.result = 'fail'; S.tab = 'saved'; sel('all'); sub(openRemove()); },
      'remove-picker': () => { S.tab = 'saved'; S.listFilter = null; sel('10'); openRemove(); },
      'remove-multi': () => { S.tab = 'saved'; S.listFilter = null; sel('10'); window.LF_PICK_ALL = true; openRemove(); setTimeout(() => document.querySelector('[data-lf-submit]').click(), 60); },
      'remove-toast': () => { S.tab = 'saved'; sel('10'); sub(openRemove()); },
      'remove-undone': () => { S.tab = 'saved'; sel('10'); const d = openRemove(); setTimeout(() => { d.confirm(); setTimeout(() => document.querySelector('.message-undo').click(), (window.LF_SD || 0) + 400); }, 60); },
      'today-remove': () => { S.tab = 'saved'; sel('10'); todayRemove(); },
      'filters': () => { render(); openSavedFilters(root.querySelector('[data-lf-act="saved-filters"]')); },
      'delete-filter': () => { render(); openDeleteFilter(SAVED_FILTERS[0]); },
      'delete-filter-fail': () => { S.result = 'fail'; render(); sub(openDeleteFilter(SAVED_FILTERS[0])); },
      'today-delete-filter': () => { render(); openDeleteFilter(SAVED_FILTERS[0]); },
      'ev': () => { S.screen = 'verifier'; render(); },
      'ev-cost': () => { S.screen = 'verifier'; render(); onVerify(); },
      'ev-fail': () => { S.screen = 'verifier'; S.result = 'fail'; render(); onVerify(); setTimeout(() => document.querySelector('.nx-dialog .shd-button--primary').click(), 60); },
      'ev-done': () => { S.screen = 'verifier'; render(); onVerify(); setTimeout(() => document.querySelector('.nx-dialog .shd-button--primary').click(), 60); },
      'today-ev': () => { S.screen = 'verifier'; render(); },
      'today-ev-after': () => { S.screen = 'verifier'; render(); onVerify(); },
    };
    if (state.startsWith('today')) { S.view = 'today'; shell.setControl('view', 'today'); }
    if (S.screen === 'verifier' || state.startsWith('ev') || state.startsWith('today-ev')) { shell.header.firstElementChild.outerHTML = window.LF_TITLE('verifier'); shell.setControl('screen', 'verifier'); }
    if (steps[state]) steps[state]();
  }

  window.LF_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.LF_SD = param('sd') != null ? Number(param('sd')) : undefined;
  window.LF_REVEAL_MS = param('rv') != null ? Number(param('rv')) : undefined;
  if (S.sel !== 'none') applyPreset(S.sel);
  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
