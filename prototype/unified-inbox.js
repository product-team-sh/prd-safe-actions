/* Unified Inbox: safe actions prototype (spec rows 8, 9, 10).
   Data is generated in the page. Production markup is reproduced from webui main aeda4e3 (unified-inbox-markup.js);
   new elements carry .nx-new. URL params: ?inbox=1284|12480 &sel=none|3|page|all &view=proposed|today
   &breakdown=ok|slow|fail &result=ok|fail &state=<screenshot state> &bd=<ms> &sd=<ms> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const PER = 25;
  const CAP = 10000; // SELECT_ALL_EMAIL_THREADS_LIMIT
  const VERB = { base: 'Delete', past: 'Deleted' }; // one word to change if the team prefers "Remove"
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/';
  const ROW = C + 'src/components/unified-inbox/components/unified-inbox-actions-row/unified-inbox-actions-row.tsx';
  const ITEM = C + 'src/components/unified-inbox/sub-components/mail-item.tsx';
  const OUT = window.UI_OUTCOMES;
  const oName = (k) => (OUT.find((o) => o.key === k) || OUT[0]).name;

  /* ───────── scenario ───────── */
  const S = {
    inbox: param('inbox') === '12480' ? '12480' : '1284',
    sel: ['none', '3', 'page', 'all'].includes(param('sel')) ? param('sel') : 'none',
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    feed: 'all',
    page: 1,
    picked: new Set(),
    all: false,
    desel: new Set(),
  };

  /* ───────── data ───────── */
  const SEQ = { q4: 'Q4 SaaS founders', agy: 'Agency owners, EU', cfo: 'Series A CFOs', web: 'Webinar follow-up, Oct', fin: 'Fintech ops leads', re: 'Re-engage, closed lost' };
  // name, domain, sequence, subject, preview, outcome, flags: u unread, y last reply is yours, a still in an active sequence,
  // o also in other sequences, s scheduled reply, d draft, x already unsubscribed
  const PAGE1 = [
    ['Priya Raman', 'ledgerloop.io', 'q4', 'Re: Cutting month-end close time', 'Thanks, this is timely. Can you share pricing for a 12-person finance team?', 'int', 'ua'],
    ['Marcus Hale', 'shipyardhq.com', 'agy', 'Re: White-label reporting for your clients', 'Interesting. We run 40 client accounts, does it scale to that?', 'int', 'us'],
    ['Elena Duarte', 'quillstack.com', 'cfo', 'Automatic reply: Out of office', "I'm away until 28 Oct with limited access to email. For urgent matters contact finance@quillstack.com.", 'ooo', 'ao'],
    ['Tom Becker', 'fieldnote.app', 'web', "Re: Slides from Tuesday's webinar", 'Here are the slides, Tom. The pricing section starts on slide 14.', 'unc', 'y'],
    ['Aisha Khan', 'northbeam.dev', 'q4', 'Re: Quick question about outbound', 'Not the right time for us, maybe in Q1.', 'now', 'u'],
    ['Daniel Osei', 'tallyroute.com', 'fin', 'Re: Reconciliation across 3 banks', 'Invite sent for Thursday at 3 PM. Talk then.', 'mtg', 'y'],
    ['Sofia Marin', 'brightforge.co', 'agy', 'Re: Client onboarding in a day', 'Please remove me from your list.', 'dnc', 'x'],
    ['Liam Novak', 'cartwheel.ai', 'q4', "Re: Your SDR team's reply rates", 'Who else in our space uses this?', 'int', 'uao'],
    ['Mei Chen', 'opslane.io', 'cfo', 'Re: Board-ready cash forecasts', 'We just signed with another vendor.', 'ni', ''],
    ['Arjun Mehta', 'pagefold.com', 'web', 'Re: Recording of the webinar', 'Can I get the recording link again? The old one expired.', 'unc', 'us'],
    ['Hannah Lindqvist', 'relaypoint.co', 'q4', 'Automatic reply: Parental leave', "I'm on leave until January. Please reach out to ops@relaypoint.co.", 'ooo', 'ao'],
    ['Kofi Mensah', 'stackmint.io', 'agy', 'Re: Reporting for 20+ clients', 'Works for me. Sending you two slots for Tuesday.', 'int', 'yd'],
    ['Lucia Ferreira', 'brickyard.dev', 'fin', 'Re: Payment ops at Brickyard', 'We handle this in-house for now.', 'ni', ''],
    ['Noah Brooks', 'loomstate.com', 'q4', 'Re: 15 minutes next week?', 'Sure, send over a few times.', 'mtg', 'u'],
    ['Zara Haddad', 'harborly.io', 'cfo', 'Re: Forecasting with live bank data', 'How does this compare to what we get from our bank today?', 'int', 'uao'],
    ['Ethan Walsh', 'trellisapp.com', 're', 'Re: Checking back in', "We're still on the other tool, but renewal is in March.", 'now', ''],
    ['Ines Moreau', 'gridwise.co', 'web', 'Re: Your question from the webinar', 'Glad it helped, Ines. The API docs are linked below.', 'unc', 'y'],
    ['Ravi Iyer', 'patchwork.so', 'agy', 'Re: Agency pricing', 'What does the agency plan include?', 'int', 'ua'],
    ['Chloe Dubois', 'kilnhq.com', 'q4', 'Automatic reply: Out of office', 'Out until Monday 27 Oct.', 'ooo', 'a'],
    ['Mateo Silva', 'meridianops.com', 'fin', 'Re: Treasury automation', 'Can you send a case study from a fintech our size?', 'int', 'us'],
    ['Yuki Tanaka', 'ledgerloop.io', 'cfo', 'Re: Close in 3 days, not 10', 'Not interested, thanks.', 'ni', ''],
    ['Owen Reilly', 'shipyardhq.com', 'q4', 'Re: Following up', 'Please stop emailing me.', 'dnc', ''],
    ['Leila Farah', 'quillstack.com', 'agy', 'Re: Client reporting walkthrough', 'Booked for Friday at 11. Calendar invite is on its way.', 'mtg', 'y'],
    ['Samir Aziz', 'fieldnote.app', 'web', 'Re: Webinar Q&A follow-up', 'Is there an API for the reports?', 'unc', 'uo'],
    ['Grace Park', 'northbeam.dev', 'q4', 'Re: Quick question about outbound', 'Circle back after our budget review in November.', 'now', 'a'],
  ];
  const FIRST = ['Felix', 'Nadia', 'Jonas', 'Amara', 'Diego', 'Freya', 'Hugo', 'Anika', 'Theo', 'Rosa', 'Kian', 'Maya', 'Omar', 'Clara', 'Ivan', 'Sara', 'Ben', 'Lena', 'Nikhil', 'Tara', 'Paul', 'Ayesha', 'Luca', 'Emma', 'Rahul', 'Julia', 'Viktor', 'Nora', 'Sam', 'Isla'];
  const LAST = ['Weber', 'Petrova', 'Berg', 'Okafor', 'Ruiz', 'Nilsen', 'Laurent', 'Kapoor', 'Fischer', 'Romano', 'Ahmadi', 'Cohen', 'Saleh', 'Vogel', 'Petrov', 'Grant', 'Shah', 'Morris', 'Rossi', 'Nair', 'Keller', 'Young', 'Bauer', 'Costa', 'Ward'];
  const DOM = ['ledgerloop.io', 'shipyardhq.com', 'quillstack.com', 'fieldnote.app', 'northbeam.dev', 'tallyroute.com', 'brightforge.co', 'cartwheel.ai', 'opslane.io', 'pagefold.com', 'relaypoint.co', 'stackmint.io', 'brickyard.dev', 'loomstate.com', 'harborly.io', 'trellisapp.com', 'gridwise.co', 'patchwork.so', 'kilnhq.com', 'meridianops.com'];
  const LINES = {
    int: [['Re: Quick question', 'Interesting. What would a pilot look like?'], ['Re: Following up', 'Send me the deck and I will share it with the team.'], ['Re: Worth a look?', 'How long does setup usually take?']],
    ni: [['Re: Following up', 'Not a fit for us right now.'], ['Re: Quick question', 'We already have a tool for this.'], ['Re: Worth a look?', 'No thanks.']],
    ooo: [['Automatic reply: Out of office', 'I am out of the office with limited access to email.'], ['Automatic reply: Travelling', 'Travelling this week, back on Monday.']],
    mtg: [['Re: 15 minutes next week?', 'Thursday works. Send an invite.'], ['Re: Quick call', 'Booked a slot on your calendar.']],
    now: [['Re: Following up', 'Ask me again next quarter.'], ['Re: Quick question', 'Busy with a launch, maybe in January.']],
    cls: [['Re: Order form', 'Signed and sent back. Looking forward to starting.']],
    dnc: [['Re: Following up', 'Please remove me from your list.'], ['Re: Quick question', 'Unsubscribe.']],
    unc: [['Re: Quick question', 'Who would I talk to about pricing?'], ['Re: Following up', 'Can you resend the link?'], ['Re: Worth a look?', 'Forwarding to my colleague.']],
  };
  const SEQKEYS = Object.keys(SEQ);
  const MON = ['Oct', 'Sep', 'Aug', 'Jul', 'Jun'];
  const ord = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  const dateFor = (i, n) => {
    // spread conversations from Oct 22nd back over about five months
    const back = Math.floor((i / n) * 140);
    let day = 22 - back; let m = 0;
    const len = [31, 30, 31, 31, 30];
    while (day < 1) { m++; day += len[m] || 30; }
    return `${MON[Math.min(m, MON.length - 1)]} ${ord(day)}`;
  };
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  function build(n) {
    const r = rng(n === 1284 ? 7 : 11);
    const out = [];
    PAGE1.forEach((p, i) => {
      const f = p[6];
      out.push({ id: i + 1, pid: i + 1, name: p[0], email: `${p[0].split(' ')[0].toLowerCase()}@${p[1]}`, seq: SEQ[p[2]], subject: p[3], preview: p[4], out: p[5],
        unread: f.includes('u'), you: f.includes('y'), active: f.includes('a'), other: f.includes('o'), sched: f.includes('s'), draft: f.includes('d'), unsub: f.includes('x'),
        date: i < 7 ? 'Oct 22nd' : i < 15 ? 'Oct 21st' : 'Oct 20th', schedAt: '10:30 AM' });
    });
    const W = [['unc', 46], ['int', 14], ['ni', 12], ['ooo', 12], ['mtg', 5], ['now', 6], ['cls', 2], ['dnc', 3]];
    const wsum = W.reduce((a, b) => a + b[1], 0);
    for (let i = PAGE1.length; i < n; i++) {
      let x = r() * wsum; let o = 'unc';
      for (const [k, w] of W) { if ((x -= w) < 0) { o = k; break; } }
      let pid = i + 1; let name; let dom;
      if (i > 60 && r() < 0.06) { const src = out[Math.floor(r() * (i - 30))]; pid = src.pid; name = src.name; dom = src.email.split('@')[1]; }
      else { name = `${pick(r, FIRST)} ${pick(r, LAST)}`; dom = pick(r, DOM); }
      const ln = pick(r, LINES[o]);
      const unread = r() < (i < 200 ? 0.22 : 0.12);
      const active = r() < (o === 'ooo' ? 0.85 : o === 'unc' ? 0.3 : o === 'now' ? 0.12 : 0.04);
      out.push({ id: i + 1, pid, name, email: `${name.split(' ')[0].toLowerCase()}@${dom}`, seq: SEQ[pick(r, SEQKEYS)], subject: ln[0], preview: ln[1], out: o,
        unread, you: !unread && r() < 0.3, active, other: r() < 0.22, sched: r() < 0.02, draft: r() < 0.015,
        unsub: r() < (o === 'dnc' ? 0.7 : o === 'ni' ? 0.08 : 0.01), date: dateFor(i, n), schedAt: '09:00 AM' });
    }
    return out;
  }

  let DATA = build(Number(S.inbox));
  const hidden = new Set(); // deleted, still inside the 10-second undo window

  const FEEDS = { all: () => true, unread: (t) => t.unread, scheduled: (t) => t.sched, draft: (t) => t.draft };
  const live = () => DATA.filter((t) => !hidden.has(t.id));
  const visible = () => live().filter(FEEDS[S.feed]);
  const filtered = () => S.feed !== 'all';

  function selectedList() {
    if (S.all) return visible().filter((t) => !S.desel.has(t.id)).slice(0, CAP);
    return live().filter((t) => S.picked.has(t.id));
  }
  function selCount() {
    if (S.all) return Math.min(CAP, visible().length - S.desel.size);
    return S.picked.size;
  }
  const isSel = (t) => (S.all ? !S.desel.has(t.id) : S.picked.has(t.id));
  function clearSel() { S.picked.clear(); S.all = false; S.desel.clear(); }
  function stats(list) {
    const s = { n: list.length, active: 0, unread: 0, sd: 0, unsub: 0, out: {} };
    list.forEach((t) => { if (t.active && !t.unsub) s.active++; if (t.unread) s.unread++; if (t.sched || t.draft) s.sd++; if (t.unsub) s.unsub++; s.out[t.out] = (s.out[t.out] || 0) + 1; });
    return s;
  }

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'inbox',
    title: 'Unified Inbox',
    controls: [
      { key: 'inbox', label: 'Inbox', value: S.inbox, options: [['1284', '1,284'], ['12480', '12,480 (over cap)']], onChange: (v) => { S.inbox = v; DATA = build(Number(v)); hidden.clear(); clearSel(); S.page = 1; S.feed = 'all'; applySel(S.sel); } },
      { key: 'sel', label: 'Selected', value: S.sel, options: [['none', 'None'], ['3', '3'], ['page', 'Page (25)'], ['all', 'All']], onChange: (v) => { S.sel = v; applySel(v); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec rows 8 to 10. The breakdown counts come from the backend before the dialog opens; with "Select all" the client only holds 25 rows. The real change starts after 10 seconds and can be cancelled until then.',
      rows: [
        { n: 8, surface: 'Unified Inbox', action: 'Bulk delete conversation', patterns: 'A B F H', breakdown: 'Conversations (total), of which: from prospects still in an active sequence, with unread replies, with a scheduled reply or a draft. Title says "all" and the consequence adds "This empties Unified Inbox." when everything in All is selected.', undo: 'Yes, 10 seconds. Backend already soft-deletes (unifiedEmailRepository.softDelete), so undo restores the rows.',
          code: [{ label: 'actions-row L535-542 (trash icon, last of five, no count)', url: ROW + '#L535-L542' }, { label: 'actions-row L704-717 (singular "this email thread")', url: ROW + '#L704-L717' }, { label: 'actions-row L343-365 (onDelete)', url: ROW + '#L343-L365' }] },
        { n: 9, surface: 'Unified Inbox', action: 'Bulk unsubscribe', patterns: 'A B F H', breakdown: 'Prospects (unique, not already unsubscribed), of which: still in an active sequence, which stops; also in other sequences, which stop too. A note says when conversations outnumber prospects and who is already unsubscribed.', undo: 'Yes, 10 seconds. Unsubscribe is contact-level (contactsService.changeContactStatusToUnsubscribed), so undo has to restore each contact\'s earlier status.',
          code: [{ label: 'actions-row L510-519 (Ban icon, tooltip "Mark as unsubscribe")', url: ROW + '#L510-L519' }, { label: 'actions-row L719-739 ("Do you want to unsubscribe this prospects?", "Yes")', url: ROW + '#L719-L739' }, { label: 'mail-item.tsx L208-214 (Unsubscribed pill)', url: ITEM + '#L208-L214' }] },
        { n: 10, surface: 'Unified Inbox', action: 'Bulk assign outcome', patterns: 'A F H', breakdown: 'Before a pick: no outcome yet, already have an outcome (top ones named). After a pick: no outcome yet, have a different outcome which is replaced (top ones named); those that already have the picked outcome are named in a note. One count request returns counts per current outcome; the dialog derives rows for any pick without another call.', undo: 'Yes, 10 seconds. Undo restores each conversation\'s earlier outcome, so the job must keep the previous value per thread until it commits.',
          code: [{ label: 'actions-row L524-531 (tag icon, tooltip "Assign outcome")', url: ROW + '#L524-L531' }, { label: 'actions-row L647-702 ("Assign Outcome" picker, "Done", no count)', url: ROW + '#L647-L702' }, { label: 'actions-row L317-341 (onCategoryAssign replaces silently)', url: ROW + '#L317-L341' }] },
      ],
      notes: [
        'Selection banner (A) gets its own row under the actions row. Today the same text sits in the middle of the actions row (renderSelectedEmailThreadsDetails, L387-431), which has no room once the bar carries labels.',
        'Bulk bar (B): Mark as read, Mark as unread and Assign outcome stay plain and collapse to icons, then into "More", when the row runs out of room. Unsubscribe and Delete sit after a divider, red, without a count, and never collapse.',
        'Mark as read and Mark as unread keep today\'s behaviour: no dialog, the production toast.',
        'Cap: "Select all" acts on the first 10,000 conversations (SELECT_ALL_EMAIL_THREADS_LIMIT); the banner says so.',
        'Toast copy for today\'s flows is the API\'s own: "Email threads have been deleted successfully", "Prospects unsubscribed successfully.", "Outcome updated successfully" (saleshandy-edge api-success.messages.ts L173-176).',
        'Today, a select-all action shows the "Please Wait!" modal (ActionStatesModal) while the request runs. The proposal drops it: rows leave at once and the job starts after the undo window.',
      ],
    },
  });
  const root = h('<div id="ui-root"></div>');
  shell.body.appendChild(root);

  function applySel(v) {
    clearSel();
    const rows = pageRows();
    if (v === '3') rows.slice(0, 3).forEach((t) => S.picked.add(t.id));
    if (v === 'page') rows.forEach((t) => S.picked.add(t.id));
    if (v === 'all') S.all = true;
    render();
  }
  function pageRows() {
    const list = visible();
    const pages = Math.max(1, Math.ceil(list.length / PER));
    if (S.page > pages) S.page = pages;
    return list.slice((S.page - 1) * PER, S.page * PER);
  }

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu();
    const list = visible();
    const pages = Math.max(1, Math.ceil(list.length / PER));
    const rows = pageRows();
    const n = selCount();
    const unread = live().filter((t) => t.unread).length;
    root.innerHTML = window.UI_PAGE({
      feed: S.feed, unread, rows, isSel, anySelected: n > 0, pageAll: rows.length > 0 && rows.every(isSel),
      page: S.page, pages, per: PER, total: list.length, view: S.view,
    });
    const host = root.querySelector('[data-ui="bulk"]');
    const center = root.querySelector('[data-ui="center"]');
    const bh = root.querySelector('[data-ui="banner"]');
    if (n > 0 && S.view === 'today') {
      host.outerHTML = window.UI_TODAY_ICONS();
      center.innerHTML = window.UI_TODAY_CENTER({ count: n, total: list.length, all: S.all, cap: CAP });
    } else if (n > 0) {
      host.appendChild(proposedBar());
    }
    if (S.view === 'proposed') {
      const ban = nxSelectionBanner({
        count: n, total: list.length, pageRows: rows.length, allSelected: S.all, filtered: filtered(), cap: CAP,
        noun: 'conversation', plural: 'conversations', scope: 'in Unified Inbox', filteredScope: `in ${S.feed.charAt(0).toUpperCase() + S.feed.slice(1)}`,
        onSelectAll: () => { S.all = true; S.desel.clear(); S.picked.clear(); render(); },
        onClear: () => { clearSel(); render(); },
      });
      if (ban) bh.appendChild(ban);
    }
    if (!bh.childElementCount) bh.remove();
    root.querySelector('.unified-inbox-content--row').classList.toggle('ui-proposed-row', S.view === 'proposed' && n > 0);
    wire(rows);
    NX.settle(root);
  }

  function wire(rows) {
    const q = (s) => root.querySelectorAll(s);
    const page = root.querySelector('[data-ui="this-page"]');
    if (page) {
      const on = rows.filter(isSel).length;
      page.indeterminate = false;
      page.addEventListener('change', () => {
        rows.forEach((t) => { if (S.all) { page.checked ? S.desel.delete(t.id) : S.desel.add(t.id); } else { page.checked ? S.picked.add(t.id) : S.picked.delete(t.id); } });
        if (S.all && S.desel.size >= visible().length) clearSel();
        render();
      });
      void on;
    }
    q('[data-ui-row]').forEach((cb) => cb.addEventListener('change', () => {
      const id = Number(cb.getAttribute('data-ui-row'));
      if (S.all) { cb.checked ? S.desel.delete(id) : S.desel.add(id); if (S.desel.size >= visible().length) clearSel(); }
      else cb.checked ? S.picked.add(id) : S.picked.delete(id);
      render();
    }));
    q('[data-ui-feed]').forEach((t) => t.addEventListener('click', () => { S.feed = t.getAttribute('data-ui-feed'); S.page = 1; clearSel(); render(); }));
    q('[data-ui-page]').forEach((b) => b.addEventListener('click', () => {
      if (b.classList.contains('disabled')) return;
      S.page += b.getAttribute('data-ui-page') === 'next' ? 1 : -1;
      if (!S.all) S.picked.clear();
      render();
    }));
    q('[data-ui-center]').forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('data-ui-center') === 'all') { S.all = true; S.desel.clear(); S.picked.clear(); } else clearSel();
      render();
    }));
    q('[data-ui-today]').forEach((b) => b.addEventListener('click', () => todayAction(b.getAttribute('data-ui-today'))));
    q('[data-ui-noop]').forEach((b) => b.addEventListener('click', () => nxToast({ message: 'Not part of this prototype' })));
    q('[data-ui-open]').forEach((b) => b.addEventListener('click', () => nxToast({ message: 'Opening a conversation is not part of this prototype' })));
  }

  /* ───────── read / unread: unchanged, both views ───────── */
  function markRead(read) {
    const list = selectedList();
    list.forEach((t) => { t.unread = !read; });
    nxToast({ message: S.all ? 'Read status updated successfully' : `Conversation marked as ${read ? 'read' : 'unread'}` });
    render();
  }

  /* ───────── proposed bar (B) ───────── */
  function proposedBar() {
    const n = selCount();
    return nxBulkBar({
      actions: [
        { id: 'read', label: 'Mark as read', icon: 'mail-open', onClick: () => markRead(true) },
        { id: 'unread', label: 'Mark as unread', icon: 'mail', onClick: () => markRead(false) },
        { id: 'outcome', label: 'Assign outcome', icon: 'tag', onClick: () => openOutcome() },
      ],
      risky: [
        { id: 'unsubscribe', label: 'Unsubscribe', count: null, icon: 'unavailable', onClick: () => openUnsub() },
        { id: 'delete', label: VERB.base, count: null, icon: 'trash', onClick: () => openDelete() },
      ],
    });
  }

  /* ───────── dialogs (F) ───────── */
  const nC = (n) => `${fmt(n)} ${plural(n, 'conversation', 'conversations')}`;
  const nP = (n) => `${fmt(n)} ${plural(n, 'prospect', 'prospects')}`;
  const first = (t) => esc(t.name.split(' ')[0]);
  const isEverything = () => S.feed === 'all' && S.all && S.desel.size === 0 && visible().length <= CAP;
  const scopeAll = () => (S.feed === 'all' ? '' : ` ${S.feed}`);
  const common = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.UI_BD, submitDelay: window.UI_SD }, o);
  const single = (rowsSentence) => ({ rows: [{ key: 'one', label: '', value: 1 }], sentence: rowsSentence, breakdown: 'ok', breakdownDelay: 0 });
  const join = (parts) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`);

  function openDelete() {
    const list = selectedList();
    const s = stats(list);
    const N = list.length;
    const all = isEverything();
    const title = N === 1 ? `${VERB.base} the conversation with ${esc(list[0].name)} from Unified Inbox?`
      : all || S.all ? `${VERB.base} all ${fmt(N)}${scopeAll()} conversations from Unified Inbox?` : `${VERB.base} ${nC(N)} from Unified Inbox?`;
    let one = {};
    if (N === 1) {
      const t = list[0];
      const bits = [];
      if (t.unread) bits.push('has an unread reply');
      if (t.sched) bits.push('has a scheduled reply');
      if (t.draft) bits.push('has a draft reply');
      if (t.active && !t.unsub) bits.push('is still in an active sequence');
      one = single(bits.length ? `${first(t)} ${join(bits)}.` : `${first(t)} has no unread reply, scheduled reply or draft here.`);
    }
    return nxImpactDialog(common({
      title, tone: 'danger',
      rows: [
        { key: 'n', label: 'Conversations', value: N, cls: 'nx-total' },
        { key: 'active', label: 'From prospects still in an active sequence', value: s.active, sub: true },
        { key: 'unread', label: 'With unread replies', value: s.unread, sub: true },
        { key: 'sd', label: 'With a scheduled reply or a draft', value: s.sd, sub: true },
      ],
      consequence: `The emails stay in your mailbox; they disappear from Saleshandy. You can undo this for 10 seconds.${all ? ' This empties Unified Inbox.' : ''}`,
      primaryLabel: N === 1 ? `${VERB.base} conversation` : all ? `${VERB.base} all ${nC(N)}` : `${VERB.base} ${nC(N)}`,
      failMessage: { title: `We couldn't ${VERB.base.toLowerCase()} ${N === 1 ? 'this conversation' : 'these conversations'} because the connection to Saleshandy dropped.`, body: `Nothing was ${VERB.past.toLowerCase()}. Check your connection and try again.` },
      ...one,
      onConfirm: () => {
        const ids = list.map((t) => t.id);
        ids.forEach((id) => hidden.add(id));
        clearSel(); render();
        nxUndoToast({
          message: `${VERB.past} ${nC(N)} from Unified Inbox`,
          undoneMessage: `Undone. ${nC(N)} ${N === 1 ? 'is' : 'are'} back`,
          onUndo: () => { ids.forEach((id) => hidden.delete(id)); clearSel(); render(); },
          onCommit: () => { const set = new Set(ids); DATA = DATA.filter((t) => !set.has(t.id)); ids.forEach((id) => hidden.delete(id)); render(); },
        });
      },
    }));
  }

  function openUnsub() {
    const list = selectedList();
    const byP = new Map();
    list.forEach((t) => { if (!byP.has(t.pid)) byP.set(t.pid, t); });
    const prospects = [...byP.values()];
    const targets = prospects.filter((t) => !t.unsub);
    const already = prospects.length - targets.length;
    const N = targets.length;
    if (!N) { nxToast({ message: `${list.length === 1 ? 'This prospect is' : 'These prospects are'} already unsubscribed.` }); return null; }
    const act = targets.filter((t) => t.active).length;
    const oth = targets.filter((t) => t.other).length;
    const notes = [];
    if (prospects.length < list.length) notes.push(`These ${nC(list.length)} are with ${nP(prospects.length)}.`);
    if (already) notes.push(`${fmt(already)} ${already === 1 ? 'is' : 'are'} already unsubscribed and ${already === 1 ? 'stays' : 'stay'} as ${already === 1 ? 'it is' : 'they are'}.`);
    const all = isEverything();
    const title = N === 1 ? `Unsubscribe ${esc(targets[0].name)} from every sequence?` : all ? `Unsubscribe all ${nP(N)} from every sequence?` : `Unsubscribe ${nP(N)} from every sequence?`;
    let one = {};
    if (N === 1) {
      const t = targets[0];
      const bits = [];
      if (t.active) bits.push('is still in an active sequence, which stops');
      if (t.other) bits.push(`${t.active ? 'is ' : 'is '}also in other sequences, which stop too`);
      one = single(bits.length ? `${first(t)} ${bits.join(' and ')}.` : `${first(t)} is not in any active sequence.`);
    }
    const prev = new Map();
    return nxImpactDialog(common({
      title, tone: 'danger', icon: NX.IMG('unsubscribe-ban.svg'),
      rows: [
        { key: 'n', label: 'Prospects', value: N, cls: 'nx-total' },
        { key: 'act', label: 'Still in an active sequence, which stops', value: act, sub: true },
        { key: 'oth', label: 'Also in other sequences, which stop too', value: oth, sub: true },
      ],
      note: notes.length ? notes.join(' ') : null,
      consequence: `No sequence will email ${N === 1 ? first(targets[0]) : 'them'} again. You can undo this for 10 seconds.`,
      primaryLabel: N === 1 ? 'Unsubscribe prospect' : `Unsubscribe ${nP(N)}`,
      failMessage: { title: `We couldn't unsubscribe ${N === 1 ? 'this prospect' : 'these prospects'} because the connection to Saleshandy dropped.`, body: 'No one was unsubscribed. Check your connection and try again.' },
      ...one,
      onConfirm: () => {
        const pids = new Set(targets.map((t) => t.pid));
        DATA.forEach((t) => { if (pids.has(t.pid)) { prev.set(t.id, [t.unsub, t.active]); t.unsub = true; t.active = false; } });
        clearSel(); render();
        nxUndoToast({
          message: `Unsubscribed ${nP(N)}`,
          undoneMessage: `Undone. ${nP(N)} ${N === 1 ? 'is' : 'are'} subscribed again`,
          onUndo: () => { DATA.forEach((t) => { if (prev.has(t.id)) { [t.unsub, t.active] = prev.get(t.id); } }); clearSel(); render(); },
          onCommit: () => {},
        });
      },
    }));
  }

  function outcomeRows(s, k) {
    // k: picked outcome key or null. Conversations that already have k are unchanged.
    const none = s.out.unc || 0;
    const reps = Object.entries(s.out).filter(([o]) => o !== 'unc' && o !== k).sort((a, b) => b[1] - a[1]);
    const repN = reps.reduce((a, b) => a + b[1], 0);
    const rows = [
      { key: 'none', label: 'Have no outcome yet', value: k === 'unc' ? 0 : none },
      { key: 'rep', label: k ? 'Have a different outcome, which is replaced' : 'Already have an outcome, which is replaced', value: repN },
    ];
    if (reps.length <= 2) reps.forEach(([o, v]) => rows.push({ key: o, label: esc(oName(o)), value: v, sub: true }));
    else rows.push({ key: reps[0][0], label: esc(oName(reps[0][0])), value: reps[0][1], sub: true }, { key: 'other', label: 'Other outcomes', value: repN - reps[0][1], sub: true });
    if (k === 'unc') rows[1].label = 'Have an outcome, which is removed';
    return { rows, repN, same: k ? (s.out[k] || 0) : 0 };
  }

  function openOutcome() {
    const list = selectedList();
    const s = stats(list);
    const N = list.length;
    let picked = null;
    let loaded = false;
    const title = N === 1 ? `Assign an outcome to the conversation with ${esc(list[0].name)}?` : S.all ? `Assign an outcome to all ${fmt(N)}${scopeAll()} conversations?` : `Assign an outcome to ${nC(N)}?`;
    const sentence = (r) => {
      if (N === 1) {
        const t = list[0];
        return t.out === 'unc' ? `${first(t)}'s conversation has no outcome yet.` : `${first(t)}'s conversation is ${esc(oName(t.out))} now; that is replaced.`;
      }
      return r.key === 'none' ? `All ${fmt(N)} have no outcome yet.` : `All ${fmt(N)} have an outcome now; it is replaced.`;
    };
    const base = outcomeRows(s, null);
    const extra = {
      render(el) { el.classList.add('ui-picker'); el.innerHTML = '<label class="ui-picker-l" id="ui-pick-l">Outcome</label><div class="ui-picker-sel"></div>'; extra.sel = window.UI_OUTCOME_SELECT(el.querySelector('.ui-picker-sel'), (k) => { picked = k; update(); }); },
      value() { return picked; },
    };
    const dlg = nxImpactDialog(common({
      title, tone: 'primary', icon: NX.IMG('tag-blue.svg'),
      rows: base.rows, sentence, extra,
      consequence: 'Their current outcomes are replaced. You can undo this for 10 seconds.',
      primaryLabel: `Assign outcome to ${nC(N)}`,
      failMessage: { title: 'We couldn\'t assign this outcome because it was deleted in Settings a moment ago.', body: 'Refresh the page to get the current outcomes, then try again.' },
      onConfirm: (k) => {
        const prev = list.map((t) => [t, t.out]);
        list.forEach((t) => { t.out = k; });
        clearSel(); render();
        nxUndoToast({
          message: `Assigned “${esc(oName(k))}” to ${nC(N)}`,
          undoneMessage: `Undone. ${nC(N)} ${N === 1 ? 'has its' : 'have their'} earlier outcome back`,
          onUndo: () => { prev.forEach(([t, o]) => { t.out = o; }); clearSel(); render(); },
          onCommit: () => {},
        });
      },
    }));
    const c = dlg.ctrl;
    c.el.querySelector('.nx-impact').prepend(c.el.querySelector('.nx-extra'));
    c.setPrimary({ disabled: true });
    const box = c.el.querySelector('.nx-breakdown');
    const noteEl = h('<p class="nx-note" hidden></p>');
    box.after(noteEl);
    const cons = c.el.querySelector('.nx-consequence');
    // the kit fills the breakdown after the count arrives; watch for that, then keep it in step with the pick
    new MutationObserver(() => { if (!loaded && !box.querySelector('[aria-busy]')) { loaded = true; update(); } }).observe(box, { childList: true, subtree: true });
    function update() {
      const r = outcomeRows(s, picked);
      if (loaded && !box.querySelector('.nx-loadfail')) {
        const html = NX.renderRows(r.rows, (row) => sentence(row));
        if (box.innerHTML !== html) box.innerHTML = html;
        noteEl.hidden = !(picked && r.same);
        if (picked && r.same) noteEl.textContent = `${fmt(r.same)} already ${r.same === 1 ? 'has' : 'have'} ${oName(picked)} and ${r.same === 1 ? 'stays' : 'stay'} as ${r.same === 1 ? 'it is' : 'they are'}.`;
      }
      cons.textContent = r.repN || !loaded ? `${picked === 'unc' ? 'Their current outcomes are removed.' : 'Their current outcomes are replaced.'} You can undo this for 10 seconds.` : 'You can undo this for 10 seconds.';
      if (picked) c.setPrimary({ disabled: false, label: `Assign “${esc(oName(picked))}” to ${nC(N)}` });
    }
    setTimeout(() => extra.sel && extra.sel.bar.focus({ preventScroll: true }), 0);
    dlg.extra = extra;
    return dlg;
  }

  /* ───────── today's flows (production as it is) ───────── */
  function todayAction(kind) {
    const list = selectedList();
    const pending = (fn) => { if (!S.all) { fn(); return; } const m = window.UI_ACTION_STATES(); setTimeout(() => { m.close(); fn(); }, window.UI_PENDING || 1600); };
    if (kind === 'read' || kind === 'unread') { markRead(kind === 'read'); return; }
    if (kind === 'delete') return window.UI_TODAY_DELETE(() => pending(() => { const set = new Set(list.map((t) => t.id)); DATA = DATA.filter((t) => !set.has(t.id)); clearSel(); render(); nxToast({ message: 'Email threads have been deleted successfully' }); }));
    if (kind === 'unsubscribe') return window.UI_TODAY_UNSUB(selCount(), () => pending(() => { const p = new Set(list.map((t) => t.pid)); DATA.forEach((t) => { if (p.has(t.pid)) { t.unsub = true; t.active = false; } }); clearSel(); render(); nxToast({ message: 'Prospects unsubscribed successfully.' }); }));
    if (kind === 'outcome') return window.UI_TODAY_OUTCOME((k) => pending(() => { if (k) list.forEach((t) => { t.out = k; }); clearSel(); render(); nxToast({ message: 'Outcome updated successfully' }); }));
    return null;
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const sel = (v) => { S.sel = v; shell.setControl('sel', v); applySel(v); };
    const after = (fn, extra = 0) => setTimeout(fn, (window.UI_BD || 0) + 60 + extra);
    const today = () => { S.view = 'today'; shell.setControl('view', 'today'); };
    const steps = {
      'sel-3': () => sel('3'),
      'sel-page': () => sel('page'),
      'sel-all': () => sel('all'),
      'sel-one': () => { clearSel(); S.picked.add(pageRows()[0].id); render(); },
      'sel-unread': () => { S.feed = 'unread'; sel('all'); },
      'menu-more': () => { sel('page'); },
      'dialog-delete': () => { sel(S.sel === 'none' ? 'page' : S.sel); openDelete(); },
      'dialog-delete-3': () => { sel('3'); openDelete(); },
      'dialog-delete-all': () => { sel('all'); openDelete(); },
      'dialog-delete-single': () => { clearSel(); S.picked.add(pageRows()[0].id); render(); openDelete(); },
      'dialog-delete-submitting': () => { sel('all'); const d = openDelete(); after(() => d.confirm()); },
      'dialog-delete-error': () => { S.result = 'fail'; sel('all'); const d = openDelete(); after(() => d.confirm()); },
      'dialog-unsub': () => { sel(S.sel === 'none' ? 'page' : S.sel); openUnsub(); },
      'dialog-unsub-3': () => { sel('3'); openUnsub(); },
      'dialog-unsub-all': () => { sel('all'); openUnsub(); },
      'dialog-unsub-single': () => { clearSel(); S.picked.add(pageRows()[0].id); render(); openUnsub(); },
      'dialog-unsub-error': () => { S.result = 'fail'; sel('page'); const d = openUnsub(); after(() => d.confirm()); },
      'dialog-outcome': () => { sel(S.sel === 'none' ? 'page' : S.sel); openOutcome(); },
      'dialog-outcome-open': () => { sel('page'); const d = openOutcome(); after(() => d.extra.sel.open()); },
      'dialog-outcome-picked': () => { sel('page'); const d = openOutcome(); after(() => d.extra.sel.choose('int')); },
      'dialog-outcome-all': () => { sel('all'); const d = openOutcome(); after(() => d.extra.sel.choose('int')); },
      'dialog-outcome-error': () => { S.result = 'fail'; sel('page'); const d = openOutcome(); after(() => { d.extra.sel.choose('int'); d.confirm(); }); },
      'toast-delete': () => { sel('page'); const d = openDelete(); after(() => d.confirm()); },
      'undone-delete': () => { sel('page'); const d = openDelete(); after(() => { d.confirm(); setTimeout(() => document.querySelector('.message-undo').click(), (window.UI_SD || 0) + 300); }); },
      'toast-unsub': () => { sel('page'); const d = openUnsub(); after(() => d.confirm()); },
      'toast-outcome': () => { sel('page'); const d = openOutcome(); after(() => { d.extra.sel.choose('int'); d.confirm(); }); },
      'today': () => { today(); sel(S.sel === 'none' ? 'page' : S.sel); },
      'today-all': () => { today(); sel('all'); },
      'today-delete': () => { today(); sel('page'); todayAction('delete'); },
      'today-unsub': () => { today(); sel('page'); todayAction('unsubscribe'); },
      'today-outcome': () => { today(); sel('page'); todayAction('outcome'); },
      'today-outcome-open': () => { today(); sel('page'); todayAction('outcome'); setTimeout(() => document.querySelector('.unified-inbox-filter-assign-bar').click(), 50); },
      'today-pending': () => { today(); sel('all'); window.UI_PENDING = 600000; todayAction('delete'); setTimeout(() => document.querySelector('.action-btn-delete').click(), 50); },
    };
    if (steps[state]) steps[state]();
  }

  window.UI_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.UI_SD = param('sd') != null ? Number(param('sd')) : undefined;
  applySel(S.sel);
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
