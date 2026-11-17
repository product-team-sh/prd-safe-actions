/* Admin settings, My profile, Billing: safe actions prototype (spec rows 33 to 36).
   Production markup lives in admin-billing-markup.js (webui main aeda4e3); new elements carry .nx-new.
   URL params: ?page=admin|profile|billing &view=proposed|today &method=password|google
   &breakdown=ok|slow|fail &result=ok|fail &over=email|team &state=<screenshot state> &new=1 &dev=1 &bd= &sd= */
(function () {
  'use strict';
  const { fmt, param, h, esc, IMG } = NX;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/';
  const ADM = C + 'admin-settings/admin-settings.tsx';
  const PRO = C + 'my-profile/components/my-profile-content/my-profle-content.tsx';
  const DEL = C + 'my-profile/components/delete-account-modal/delete-email-modal-flow/delete-account.tsx';
  const BIL = C + 'billing-subscription/components/';
  const UPD = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/shared/design-system/components/molecules/upgrade-plans-details/upgrade-plan-details.tsx';
  const UPB = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/billing-subscription/components/upgrade-plan/upgrade-plan.tsx';

  /* ───────── scenario ───────── */
  const pick = (v, list, d) => (list.includes(v) ? v : d);
  const S = {
    page: pick(param('page'), ['admin', 'profile', 'billing'], 'admin'),
    sub: 'overview', // billing: overview | plans | slots
    view: param('view') === 'today' ? 'today' : 'proposed',
    method: param('method') === 'google' ? 'google' : 'password',
    breakdown: pick(param('breakdown'), ['ok', 'slow', 'fail'], 'ok'),
    result: param('result') === 'fail' ? 'fail' : 'ok',
    over: param('over') === 'team' ? 'team' : 'email',
    deleted: false,
    menu: false,
    summaryOpen: false,
    slotPlan: 'outreach',
    slotValue: 12,
  };
  const BD = () => (param('bd') != null ? Number(param('bd')) : undefined);
  const SD = () => (param('sd') != null ? Number(param('sd')) : undefined);

  /* ───────── data ───────── */
  // Admin page: an Outreach Scale account (SSO is offered only on Scale plans, admin-settings.tsx L204-206)
  const TEAM = { users: 12, admins: 2, members: 10 };
  const A = { mfa: true, sso: param('sso') === 'on', exportOn: false, exportAdmin: false, events: false };
  const EVENTS = { members: 10, webhooks: 3, integrations: 2 };
  // Profile: free plan owner (Delete Account is enabled only on the free plan, my-profle-content.tsx L857-866)
  const PROFILE = { first: 'Jordan', last: 'Lee', tz: '(GMT+05:30) Asia/Kolkata', emailPw: 'jordan@northbeam.dev', emailOauth: 'jordan@northbeam.dev' };
  const ERASED = { sequences: 18, prospects: 24310, mailboxes: 6, members: 4 };
  // Billing: a per-slot plan (Add or Remove Slots is hidden on value-based plans, plan-details.tsx L216-220)
  const PLAN = { outreach: { name: 'Outreach (Monthly)', price: 33 }, starter: { name: 'Starter (Monthly)', price: 9 } };
  const BILL = { slots: 12, start: '19 Aug, 2026', next: '19 Nov, 2026' };
  const MAILBOXES = [
    ['aisha@tryledgerloop.com', 0], ['sofia@ledgerloophq.com', 0], ['tom@getledgerloop.com', 1], ['hello@ledgerloophq.com', 1],
    ['elena@getledgerloop.com', 2], ['daniel@tryledgerloop.com', 2], ['marcus.hale@ledgerloop.io', 3], ['priya@ledgerloop.io', 4],
    ['sales@ledgerloophq.com', 5], ['outreach@ledgerloop.io', 6],
  ];
  // the 14 sequences that pause on Starter; prospects add up to the 3,482 in the dialog
  const PAUSING = [['SaaS founders, Oct', 640], ['Agency owners, EU', 512], ['Webinar no-shows', 430], ['Churned trials', 388], ['Series A CFOs', 301], ['Ledger demo follow-up', 260],
    ['Partner referrals', 244], ['Conference leads, Berlin', 198], ['Reactivation Q3', 150], ['Podcast guests', 120], ['Product Hunt upvoters', 96], ['Pricing page visitors', 72], ['Intro to RevOps', 42], ['Holiday check-in', 29]]
    .map(([name, n]) => ({ name, meta: `${fmt(n)} prospects` }));
  const MEMBERS = [
    ['Kofi Mensah', 0, 0], ['Lucia Ferreira', 1, 0], ['Noah Brooks', 1, 1], ['Zara Haddad', 2, 1], ['Ravi Iyer', 3, 1],
    ['Chloe Dubois', 3, 2], ['Mateo Silva', 4, 1], ['Priya Raman', 6, 2], ['Marcus Hale', 8, 3],
  ];
  const usage = () => (S.over === 'team' ? { mailboxes: 6, members: 10 } : { mailboxes: 10, members: 6 });
  const minSlots = () => { const u = usage(); return Math.max(u.mailboxes, u.members); };
  const money = (n) => `$${fmt(n)}`;

  /* ───────── shell ───────── */
  const TITLES = { admin: 'Settings', profile: 'Settings', billing: 'Billing & Subscription' };
  const shell = nxShell({
    active: 'settings',
    title: TITLES[S.page],
    controls: [
      { key: 'page', label: 'Page', value: S.page, options: [['admin', 'Admin'], ['profile', 'Profile'], ['billing', 'Billing']], onChange: (v) => { go(v); } },
      { key: 'sso', label: 'Login with SSO', value: param('sso') === 'on' ? 'on' : 'off', options: [['off', 'Off'], ['on', 'On']], onChange: (v) => { A.sso = v === 'on'; render(); } },
      { key: 'method', label: 'Login', value: S.method, options: [['password', 'Password'], ['google', 'Google']], onChange: (v) => { S.method = v; render(); } },
      { key: 'over', label: 'Over the new slot count', value: S.over, options: [['email', 'Email accounts'], ['team', 'Team members']], onChange: (v) => { S.over = v; S.slotValue = Math.max(S.slotValue, 1); render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec rows 33 to 36. Admin settings runs on an Outreach Scale account (SSO is offered on Scale only). Billing runs on a per-slot plan, Outreach (Monthly) at $33 a slot, because Add or Remove Slots is hidden on value-based plans. The two are separate demo accounts.',
      rows: [
        { n: 33, surface: 'Admin settings', action: 'Turn off "Require email OTP", turn off "Login with SSO", turn on "Allow team members to export"', patterns: 'K', breakdown: 'Users affected: admins and members (all users for OTP and SSO, members for export). Then current password, or re-validation with Google or Microsoft for users who sign in that way. The reverse direction (turning OTP or SSO on, export off) stays one click.', undo: 'No. Toast after: "Email codes are off for all 12 users".',
          code: [{ label: 'admin-settings.tsx L1404-1411 (OTP switch, no confirmation)', url: ADM + '#L1404-L1411' }, { label: 'admin-settings.tsx L915-924 (SSO off goes straight to save)', url: ADM + '#L915-L924' }, { label: 'admin-settings.tsx L1546-1562 (SSO on: the benchmark, already states impact)', url: ADM + '#L1546-L1562' }, { label: 'admin-settings.tsx L1328-1352 (export switch)', url: ADM + '#L1328-L1352' }] },
        { n: 34, surface: 'Admin settings', action: 'Turn on "Send Integration/Webhook events for entire account"', patterns: 'F', breakdown: 'Members whose events start sending, webhooks and integrations that receive them. The duplication warning moves from the info tooltip into the consequence. No password.', undo: 'No',
          code: [{ label: 'admin-settings.tsx L1355-1366 (switch + tooltip)', url: ADM + '#L1355-L1366' }, { label: 'admin-settings.tsx L384-386 (fires on toggle)', url: ADM + '#L384-L386' }] },
        { n: 35, surface: 'My profile', action: 'Delete account, Google or Microsoft users', patterns: 'F K', breakdown: 'What is erased: sequences, prospects, email accounts, team members who lose access. Then provider re-validation inside the same dialog; Delete account stays disabled until the provider confirms.', undo: 'No',
          code: [{ label: 'my-profle-content.tsx L948-971 (OAuth modal: "Please validate your Google/Microsoft account to delete your account")', url: PRO + '#L948-L971' }, { label: 'delete-account.tsx L101-190 (password users: the benchmark, unchanged here)', url: DEL + '#L101-L190' }] },
        { n: 36, surface: 'Billing', action: 'Remove email slots, remove seats, downgrade plan', patterns: 'M', breakdown: 'Slots: in use vs after, pick which email accounts disconnect ("In N sequences") or which team members lose access (what they own), the renewal date, the bill before and after. Downgrade: what stops on the date, starting from DowngradeWarningModal copy.', undo: 'No',
          code: [{ label: 'plan-details.tsx L162-248 (Manage Billing menu)', url: BIL + 'subscription-info/components/subscription-plan-details-components/plan-details.tsx#L162-L248' }, { label: 'upgrade-plan-details.tsx L135-196 (slot input floors at max(users, email accounts))', url: UPD + '#L135-L196' }, { label: 'upgrade-plan.tsx L119-137 (that floor)', url: UPB + '#L119-L137' }, { label: 'downgrade-warning-modal.tsx L8-47 (exists, never shown)', url: BIL + 'upgrade-plan/components/downgrade-warning-modal.tsx#L8-L47' }, { label: 'update-plan-modal.tsx L12-60 (value-based plan change: when, not what stops)', url: BIL + 'outreach-plans/components/update-plan-modal/update-plan-modal.tsx#L12-L60' }, { label: 'cancel-add-on-modal.tsx (benchmark: names the date)', url: BIL + 'cancel-add-on-modal/cancel-add-on-modal.tsx' }] },
      ],
      notes: [
        'K dialogs are blue: each switch can be turned back the other way, and the spec keeps red for deletes and removals. Delete account and the M dialogs are red.',
        'While SSO is on, the owner signs in through the identity provider. The prototype re-authenticates with the password or Google control; dev to confirm whether the SSO-off check should go through the identity provider instead.',
        'Today the slot input will not go below max(team members, email accounts), with the tooltip "You can\'t reduce the user slots below...". So today a reduction cannot cut anything silently; it dead-ends and sends the user away to disconnect accounts first. Proposed lets the user go lower and pick what goes in the dialog.',
        'In production one slot covers one email account and one team member, so "remove seats" is the same slot reduction when team members are what exceeds the new count. Switch "Over new slot count" in the demo bar. When both exceed it, dev decides whether the dialog shows two pick lists.',
        'What happens to a removed member\'s sequences and email accounts at renewal is not stated anywhere in the client code. The dialog lists what they own; backend to confirm the outcome before copy is final.',
        'Downgrade lives in the legacy per-slot flow (Modify Subscription > Starter > Downgrade). On value-based plans the comparison table disables "Downgrade", so that path is out of reach today.',
        'Password users keep today\'s Delete Account dialog (delete-account.tsx), which already re-authenticates and says everything is erased. It does not list counts; adding the F breakdown there is optional and not in this spec row.',
      ],
    },
  });
  const root = h('<div id="ab-root"></div>');
  shell.body.classList.add('ab-body');
  shell.body.appendChild(root);

  function go(page) {
    S.page = page; S.sub = 'overview'; S.menu = false;
    shell.setControl('page', page);
    render();
  }

  function setHeader() {
    const left = shell.header.firstElementChild;
    if (S.page === 'billing' && S.sub !== 'overview') {
      // header.tsx swaps the title for UpgradePlanHeader on /billing/upgrade-plan routes
      left.innerHTML = `<div class="d-flex header-with-notification"><div class="upgrade-plan-header ab-back" role="button" tabindex="0" data-ab="back"><i class="sh-chevron-left"></i><span>Back</span></div></div>`;
      left.querySelector('[data-ab="back"]').addEventListener('click', () => { S.sub = S.sub === 'slots' && S.slotPlan === 'starter' ? 'plans' : 'overview'; render(); });
    } else {
      left.innerHTML = `<div class="d-flex header-with-notification"><span class="nx-page-title">${TITLES[S.page]}</span></div>`;
    }
  }

  /* ───────── render ───────── */
  // demo bar shows only the controls that change something on the current page
  const CTL_PAGES = { sso: ['admin'], method: ['admin', 'profile'], breakdown: ['admin', 'profile'], over: ['billing'] };
  function syncControls() {
    Object.entries(CTL_PAGES).forEach(([k, pages]) => {
      const t = shell.demo.querySelector('#nxc-' + k);
      if (!t) return;
      const ctl = t.closest('.nx-demo-ctl');
      const on = pages.includes(S.page);
      ctl.hidden = !on;
      if (ctl.previousElementSibling && ctl.previousElementSibling.classList.contains('nx-demo-sep')) ctl.previousElementSibling.hidden = !on;
    });
  }

  function render() {
    NX.closeMenu();
    setHeader();
    syncControls();
    if (S.deleted) {
      root.innerHTML = `<div class="ab-end"><img src="${IMG('checks-green.svg')}" alt=""><p><b>Account deleted.</b> You are signed out.</p><button type="button" class="nx-banner-link" data-ab="restart">Restart the demo</button></div>`;
      root.querySelector('[data-ab="restart"]').addEventListener('click', () => { S.deleted = false; render(); });
      return;
    }
    const prev = root.querySelector('.admin-settings');
    const keep = prev && S.page === 'admin' ? prev.scrollTop : 0;
    if (S.page === 'admin') root.innerHTML = window.AB_SETTINGS('admin', 'pr-0', window.AB_ADMIN(A));
    else if (S.page === 'profile') root.innerHTML = window.AB_SETTINGS('profile', '', window.AB_PROFILE({ ...PROFILE, email: S.method === 'google' ? PROFILE.emailOauth : PROFILE.emailPw, method: S.method }));
    else if (S.sub === 'plans') root.innerHTML = window.AB_PLANS(PLANS);
    else if (S.sub === 'slots') root.innerHTML = window.AB_SLOTS(slotModel());
    else root.innerHTML = window.AB_BILLING({ planName: PLAN.outreach.name, price: PLAN.outreach.price, slots: BILL.slots, start: BILL.start, next: BILL.next, amount: BILL.scheduled ? BILL.scheduled.amount : BILL.slots * PLAN.outreach.price, scheduled: BILL.scheduled && BILL.scheduled.text, menu: S.menu, summaryOpen: S.summaryOpen });
    wire();
    const sc = root.querySelector('.admin-settings');
    if (sc && keep) sc.scrollTop = keep; // saving a switch keeps your place, as production does
    NX.settle(root);
  }

  const PLANS = [
    { key: 'starter', img: 'ellips-3.svg', name: 'Starter (Monthly)', price: 9, desc: 'Get email tracking and email warm up to kickstart your journey in cold email space.', features: ['Unlimited email tracking', 'Fully automated email warm-up', 'Customized warm-up settings', 'SMTP/IMAP Supported'], cta: 'Downgrade' },
    { key: 'outreach', img: 'ellips-2.svg', name: 'Outreach (Monthly)', price: 33, best: true, desc: 'Accelerate your cold email outreach journey with fully automated sequences.', features: ['Everything in Starter', 'Unlimited prospects', 'Unlimited Email Sequences', 'A/B Test'], cta: 'Current' },
  ];

  function slotModel() {
    const p = PLAN[S.slotPlan];
    const today = S.view === 'today';
    const min = today ? minSlots() : 1;
    if (S.slotValue < min) S.slotValue = min;
    const n = S.slotValue;
    const u = usage();
    const over = Math.max(0, (S.over === 'team' ? u.members : u.mailboxes) - n);
    const changed = n !== BILL.slots || S.slotPlan !== 'outreach';
    const paying = n > BILL.slots && S.slotPlan === 'outreach';
    let reduce = '';
    if (!today && over > 0) reduce = S.over === 'team' ? `${over} team ${NX.plural(over, 'member is', 'members are')} over this count. You pick who loses access in the next step.` : `${over} connected email ${NX.plural(over, 'account is', 'accounts are')} over this count. You pick which disconnect in the next step.`;
    return {
      planName: p.name, price: p.price, value: n, min, atMin: n <= min,
      minTip: today ? "You can't reduce the user slots below the number of existing team members and email accounts. Please remove the equivalent number of slots from your account to decrease your slots." : '',
      warn: false, reduce,
      saveLabel: paying ? 'Pay Now' : 'Save', saveDisabled: !changed,
    };
  }

  function wire() {
    root.querySelectorAll('[data-ab-nav]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('data-ab-nav');
      if (id === 'admin' || id === 'profile' || id === 'billing') go(id);
    }));
    // admin switches
    root.querySelectorAll('[data-ab-toggle]').forEach((inp) => inp.addEventListener('change', (e) => {
      const key = inp.getAttribute('data-ab-toggle');
      const wanted = inp.checked;
      inp.checked = !wanted; // production re-renders from saved state; the switch moves only after save
      onToggle(key, wanted);
    }));
    root.querySelectorAll('[data-ab-check]').forEach((inp) => inp.addEventListener('change', () => { inp.closest('.bs-checkbox').classList.toggle('bs-checkbox-checked', inp.checked); }));
    const on = (sel, fn) => { const el = root.querySelector(sel); if (el) el.addEventListener('click', fn); };
    on('[data-ab="delete-account"]', () => openDeleteAccount());
    on('[data-ab="manage"]', () => { S.menu = !S.menu; render(); });
    on('[data-ab="slots"]', () => { S.menu = false; S.sub = 'slots'; S.slotPlan = 'outreach'; S.slotValue = BILL.slots; render(); });
    on('[data-ab="cancel-sub"]', () => { S.menu = false; render(); nxToast({ message: 'Cancel Subscription opens the cancellation flow. Not part of this prototype.' }); });
    on('[data-ab="modify"]', () => { S.menu = false; S.sub = 'plans'; render(); });
    on('[data-ab="summary"]', () => { S.summaryOpen = !S.summaryOpen; render(); });
    root.querySelectorAll('[data-ab-plan]').forEach((b) => b.addEventListener('click', () => { S.sub = 'slots'; S.slotPlan = b.getAttribute('data-ab-plan'); S.slotValue = BILL.slots; render(); }));
    root.querySelectorAll('[data-ab-step]').forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('data-ab-min') === 'true' && Number(b.getAttribute('data-ab-step')) < 0) return; // production clamps at min
      S.slotValue = Math.max(1, S.slotValue + Number(b.getAttribute('data-ab-step'))); render();
    }));
    const si = root.querySelector('[data-ab="slot-input"]');
    if (si) si.addEventListener('change', () => { const v = Math.max(1, Math.round(Number(si.value) || 1)); S.slotValue = v; render(); });
    on('[data-ab="slot-save"]', () => saveSlots());
    if (S.menu) {
      const close = (e) => {
        if (!S.menu) { document.removeEventListener('mousedown', close, true); return; }
        if (!e.target.closest('.plan-price-container')) { S.menu = false; document.removeEventListener('mousedown', close, true); render(); }
      };
      document.addEventListener('mousedown', close, true);
    }
  }

  /* ───────── admin switches ───────── */
  const isToday = () => S.view === 'today';
  const savedToast = () => nxToast({ message: 'Admin settings updated successfully' });
  const reauthFail = () => ({ title: 'The setting did not change.', body: 'We could not save it. Try again in a minute.' });

  function onToggle(key, wanted) {
    const apply = (fn, msg) => { fn(); render(); msg ? nxToast({ message: msg }) : savedToast(); };
    if (key === 'mfa') {
      if (wanted || isToday()) return apply(() => { A.mfa = wanted; });
      return reauth({
        title: `Turn off email codes for all ${TEAM.users} users?`,
        rows: [{ label: 'Admins', value: TEAM.admins }, { label: 'Members', value: TEAM.members }],
        consequence: 'They sign in with just their password, with no code sent to their inbox. You can turn this back on at any time.',
        primaryLabel: `Turn off for ${TEAM.users} users`,
        onConfirm: () => apply(() => { A.mfa = false; }, `Email codes are off for all ${TEAM.users} users`),
      });
    }
    if (key === 'sso') {
      if (wanted && !isToday()) {
        // K: the legacy "Are you Sure ... Proceed" dialog is replaced; its warning (no passwords, everyone signed out) is the consequence line
        return reauth({
          title: `Turn on Login with SSO for all ${TEAM.users} users?`,
          rows: [{ label: 'Admins', value: TEAM.admins }, { label: 'Members', value: TEAM.members }, { label: 'Sessions signed out', value: TEAM.users }],
          consequence: 'Passwords stop working. Everyone signs in through your identity provider from now on, and every active session is signed out.',
          primaryLabel: `Turn on SSO for ${TEAM.users} users`,
          onConfirm: () => apply(() => { A.sso = true; }, `Login with SSO is on for all ${TEAM.users} users`),
        });
      }
      if (wanted) {
        // today: production benchmark (admin-settings.tsx L1546-1562)
        return window.AB_V3_MODAL({
          title: 'Are you Sure you want to enable login with SSO', icon: window.AB_ICON.AlertCircle.replace('width="16" height="16"', 'width="24" height="24" class="ab-v3-icon"'),
          contents: ['By enabling SSO Login, all users in your organisation will no longer be able to login using passwords and all active session will be logged out. Everyone will be required to use Login with SSO method.', '', 'Please proceed with caution.'],
          submit: 'Proceed', onSubmit: () => apply(() => { A.sso = true; }),
        });
      }
      if (isToday()) return apply(() => { A.sso = false; });
      return reauth({
        title: `Turn off Login with SSO for all ${TEAM.users} users?`,
        rows: [{ label: 'Admins', value: TEAM.admins }, { label: 'Members', value: TEAM.members }],
        consequence: 'From their next sign-in, they use a password, Google or Microsoft instead of your identity provider. You can turn this back on at any time.',
        primaryLabel: `Turn off SSO for ${TEAM.users} users`,
        onConfirm: () => apply(() => { A.sso = false; }, `Login with SSO is off for all ${TEAM.users} users`),
      });
    }
    if (key === 'export') {
      if (!wanted || isToday()) return apply(() => { A.exportOn = wanted; if (!wanted) A.exportAdmin = false; });
      return reauth({
        title: `Let ${TEAM.members} team members export data?`,
        sentence: `${TEAM.members} members can download prospects, reports, leads and engagement data as files.`,
        consequence: 'Files that leave Saleshandy can\'t be called back. You can turn this off at any time.',
        primaryLabel: `Allow ${TEAM.members} members to export`,
        onConfirm: () => apply(() => { A.exportOn = true; }, `${TEAM.members} members can now export data`),
      });
    }
    if (key === 'export-admin') return apply(() => { A.exportAdmin = wanted; });
    if (key === 'events') {
      if (!wanted || isToday()) return apply(() => { A.events = wanted; });
      return nxImpactDialog({
        title: `Send integration and webhook events for all ${TEAM.users} users?`,
        rows: [
          { label: 'Members whose events start sending', value: EVENTS.members },
          { label: 'Webhooks that receive them', value: EVENTS.webhooks },
          { label: 'Integrations that receive them', value: EVENTS.integrations },
        ],
        note: `Events from the ${TEAM.admins} admins, including you, are already sent.`,
        consequence: 'If a member has connected the same app, their events can arrive twice and duplicate data. You can turn this off at any time.',
        primaryLabel: `Send events for ${TEAM.users} users`,
        tone: 'primary', breakdown: S.breakdown, submit: S.result,
        failMessage: { title: 'Events were not turned on.', body: 'We could not save the setting. Try again in a minute.' },
        breakdownDelay: BD(), submitDelay: SD(),
        onConfirm: () => apply(() => { A.events = true; }, `Events from all ${TEAM.users} users will be sent`),
      });
    }
    // other switches: production behaviour, one click
    const el = root.querySelector(`[data-ab-toggle="${key}"]`);
    if (el) el.checked = wanted;
    savedToast();
    return null;
  }

  function reauth(o) {
    const d = nxReauthDialog(Object.assign({
      method: S.method, tone: 'primary', submit: S.result, failMessage: reauthFail(), submitDelay: SD(),
      icon: IMG('info-circle-blue.svg'),
    }, o));
    return d;
  }

  /* ───────── delete account ───────── */
  function openDeleteAccount() {
    if (S.method === 'password') {
      // production benchmark, both views
      return window.AB_DELETE_PW_MODAL({ email: PROFILE.emailPw, result: S.result, onDone: accountDeleted });
    }
    if (isToday()) {
      // my-profle-content.tsx L948-971
      return window.AB_V3_MODAL({
        className: 'delete-oauth-modal',
        title: `<span class="oauth-modal-title">Your current email is <span class="oauth-modal-title--bold">${esc(PROFILE.emailOauth)}</span></span>`,
        content: 'Please validate your Google/Microsoft account to delete your account',
        submit: 'Delete',
        onSubmit: () => setTimeout(accountDeleted, 600),
      });
    }
    let validated = false;
    let btn = null;
    const d = nxImpactDialog({
      title: `Delete your account “${esc(PROFILE.emailOauth)}”?`,
      rows: [
        { label: 'Sequences', value: ERASED.sequences },
        { label: 'Prospects', value: ERASED.prospects },
        { label: 'Email accounts', value: ERASED.mailboxes },
        { label: 'Team members who lose access', value: ERASED.members },
      ],
      consequence: 'Everything in this account is erased for good, for you and your team. This can\'t be undone.',
      extra: {
        render(el) {
          el.innerHTML = `<div class="nx-field"><span class="nx-label">Confirm it is you with Google</span><button type="button" class="nx-provider-btn"><i class="sh-google" aria-hidden="true"></i><span>Continue with Google</span></button></div>`;
          btn = el.querySelector('.nx-provider-btn');
          btn.addEventListener('click', () => {
            if (validated) return;
            validated = true;
            btn.classList.add('nx-done'); btn.innerHTML = '<i class="sh-check" aria-hidden="true"></i><span>Confirmed</span>';
            d.ctrl.setPrimary({ disabled: false });
            d.ctrl.primaryBtn.focus();
          });
        },
        value: () => validated,
      },
      primaryLabel: 'Delete account',
      tone: 'danger', icon: IMG('trash-danger.svg'),
      breakdown: S.breakdown, submit: S.result,
      failMessage: { title: 'Your account was not deleted.', body: 'Google confirmed it is you, but we could not finish. Try again, or contact support if this keeps happening.' },
      breakdownDelay: BD(), submitDelay: SD(),
      onConfirm: accountDeleted,
    });
    d.ctrl.setPrimary({ disabled: true });
    // F reads top to bottom (what is erased, then the consequence), and the K step sits last, next to the button
    const ex = d.el.querySelector('.nx-extra'); const cq = d.el.querySelector('.nx-consequence');
    if (ex && cq) cq.after(ex);
    d.provider = () => btn && btn.click();
    return d;
  }
  function accountDeleted() { S.deleted = true; render(); }

  /* ───────── billing: slots, seats, downgrade ───────── */
  function saveSlots() {
    const n = S.slotValue;
    const p = PLAN[S.slotPlan];
    const before = BILL.slots * PLAN.outreach.price;
    const after = n * p.price;
    const done = (msg) => { S.sub = 'overview'; render(); nxToast({ message: msg }); };
    if (isToday() || (n >= BILL.slots && S.slotPlan === 'outreach')) {
      if (n > BILL.slots && S.slotPlan === 'outreach') return done('Payment opens Stripe checkout. Not part of this prototype.');
      return done('Subscription updated successfully');
    }
    if (S.slotPlan === 'starter') {
      return nxPlanChangeDialog({
        title: `Downgrade to ${p.name} on ${BILL.next}?`,
        kind: 'downgrade', date: BILL.next,
        stops: [
          { label: 'Active sequences that pause', value: 14 },
          { label: 'Prospects whose next email will not send', value: 3482 },
          { label: 'A/B tests that stop', value: 5 },
        ],
        list: { title: 'Sequences that pause', items: PAUSING },
        consequence: `Sequences pause and A/B tests stop; email tracking and warm-up keep working. Nothing changes until ${BILL.next}. Your bill goes from ${money(before)} to ${money(after)} a month.`,
        primaryLabel: `Downgrade to ${p.name.replace(' (Monthly)', '')}`,
        tone: 'primary', submit: S.result, submitDelay: SD(),
        failMessage: { title: 'Your plan did not change.', body: 'The billing service did not respond. Try again in a minute.' },
        onConfirm: () => { BILL.scheduled = { text: `Moves to ${p.name} on ${BILL.next}`, amount: after }; done(`Your plan moves to ${p.name} on ${BILL.next}`); },
      });
    }
    const u = usage();
    const team = S.over === 'team';
    const inUse = team ? u.members : u.mailboxes;
    const removing = BILL.slots - n;
    const items = team
      ? MEMBERS.map(([name, seqs, boxes], i) => ({ id: 'm' + i, name, meta: owns(seqs, boxes) }))
      : MAILBOXES.map(([email, seqs], i) => ({ id: 'e' + i, name: email, meta: seqs ? `In ${seqs} ${NX.plural(seqs, 'sequence', 'sequences')}` : 'Not in any sequence' }));
    const dlg = nxPlanChangeDialog({
      title: `Remove ${removing} ${NX.plural(removing, 'slot', 'slots')} on ${BILL.next}?`,
      kind: team ? 'seats' : 'slots', inUse, after: n, items, date: BILL.next,
      noun: team ? 'team member' : 'email account',
      consequence: (team
        ? `The team members you pick lose access on ${BILL.next}.`
        : `The email accounts you pick disconnect on ${BILL.next} and stop sending from their sequences.`) + ` Your bill goes from ${money(before)} to ${money(after)} a month.`,
      primaryLabel: `Remove ${removing} ${NX.plural(removing, 'slot', 'slots')}`,
      tone: 'danger', submit: S.result, submitDelay: SD(),
      failMessage: { title: 'Your slots did not change.', body: 'The billing service did not respond. Try again in a minute.' },
      onConfirm: () => { BILL.scheduled = { text: `Changes to ${n} ${NX.plural(n, 'slot', 'slots')} on ${BILL.next}`, amount: after }; done(`${removing} ${NX.plural(removing, 'slot', 'slots')} will be removed on ${BILL.next}`); },
    });
    // production plans sell slots, not seats: one slot covers one team member and one email account
    const dt = dlg.el.querySelector('.nx-rows .nx-row dt');
    if (dt) dt.textContent = 'Slots in use';
    // the title counts slots removed from the plan, so show the plan size too or "10 to 7" reads as 3
    const firstRow = dlg.el.querySelector('.nx-rows .nx-row');
    if (firstRow) {
      const planRow = firstRow.cloneNode(true);
      planRow.querySelector('dt').textContent = 'Slots on your plan';
      planRow.querySelector('dd').textContent = NX.fmt(BILL.slots);
      planRow.classList.add('nx-new');
      firstRow.before(planRow);
    }
    return dlg;
  }
  function owns(seqs, boxes) {
    const parts = [];
    if (seqs) parts.push(`${seqs} ${NX.plural(seqs, 'sequence', 'sequences')}`);
    if (boxes) parts.push(`${boxes} email ${NX.plural(boxes, 'account', 'accounts')}`);
    return parts.length ? `Owns ${parts.join(', ')}` : 'Owns nothing yet';
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const scrollTo = (id) => { const el = root.querySelector('#' + id); const sc = root.querySelector('.admin-settings'); if (el && sc) sc.scrollTop += el.getBoundingClientRect().top - sc.getBoundingClientRect().top; }; // card's top edge sits on the scroller's top edge
    const toggleClick = (key) => { const i = root.querySelector(`[data-ab-toggle="${key}"]`); i.click(); };
    const typePw = (v) => setTimeout(() => { const i = document.querySelector('.nx-dialog input[type="password"]'); if (i) { i.value = v; i.dispatchEvent(new Event('input')); } }, 30);
    const confirmTop = (delay) => setTimeout(() => { const dl = [...document.querySelectorAll('.nx-dialog')].pop(); const t = dl && dl.querySelector('.nx-typed input'); if (t) { t.value = t.getAttribute('aria-label').replace('Confirm by typing ', ''); t.dispatchEvent(new Event('input')); } const b = [...document.querySelectorAll('.nx-dialog .shd-button')].pop(); if (b) b.click(); }, delay || 60);
    const provider = (delay) => setTimeout(() => { const b = document.querySelector('.nx-dialog .nx-provider-btn'); if (b) b.click(); }, delay || 40);
    const steps = {
      'admin': () => scrollTo('team-management'),
      'mfa': () => { scrollTo('team-management'); toggleClick('mfa'); },
      'mfa-typed': () => { scrollTo('team-management'); toggleClick('mfa'); typePw('correct-horse'); },
      'mfa-submitting': () => { scrollTo('team-management'); toggleClick('mfa'); typePw('correct-horse'); confirmTop(120); },
      'mfa-fail': () => { S.result = 'fail'; scrollTo('team-management'); toggleClick('mfa'); typePw('wrong-pass'); confirmTop(120); },
      'mfa-google-done': () => { scrollTo('team-management'); toggleClick('mfa'); provider(); },
      'mfa-google-fail': () => { S.result = 'fail'; scrollTo('team-management'); toggleClick('mfa'); provider(); confirmTop(120); },
      'mfa-toast': () => { scrollTo('team-management'); toggleClick('mfa'); typePw('correct-horse'); confirmTop(120); },
      'sso-on': () => { scrollTo('team-management'); toggleClick('sso'); },
      'sso-off': () => { A.sso = true; A.mfa = true; render(); scrollTo('team-management'); toggleClick('sso'); },
      'export': () => { scrollTo('team-management'); toggleClick('export'); },
      'events': () => { scrollTo('team-management'); toggleClick('events'); },
      'events-fail': () => { S.result = 'fail'; scrollTo('team-management'); toggleClick('events'); confirmTop((BD() || 0) + 80); },
      'events-toast': () => { scrollTo('team-management'); toggleClick('events'); confirmTop((BD() || 0) + 80); },
      'delete': () => openDeleteAccount(),
      'delete-validated': () => { openDeleteAccount(); provider((BD() || 0) + 60); },
      'delete-fail': () => { S.result = 'fail'; openDeleteAccount(); provider((BD() || 0) + 60); confirmTop((BD() || 0) + 120); },
      'deleted': () => { S.deleted = true; render(); },
      'billing-menu': () => { S.menu = true; S.summaryOpen = true; render(); },
      'plans': () => { S.sub = 'plans'; render(); },
      'slots': () => { S.sub = 'slots'; S.slotValue = isToday() ? minSlots() : 7; render(); },
      'slots-today-tip': () => { S.view = 'today'; shell.setControl('view', 'today'); S.sub = 'slots'; S.slotValue = minSlots(); render(); root.classList.add('ab-force-hover'); const d = root.querySelector('.bs-input-number-handler-down'); d.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); },
      'slots-dialog': () => { S.sub = 'slots'; S.slotValue = 7; render(); saveSlots(); },
      'slots-picked': () => { S.sub = 'slots'; S.slotValue = 7; render(); saveSlots(); setTimeout(() => { [...document.querySelectorAll('.nx-picklist input')].slice(0, 3).forEach((i) => i.click()); }, 40); },
      'slots-overpicked': () => { S.sub = 'slots'; S.slotValue = 7; render(); saveSlots(); setTimeout(() => { [...document.querySelectorAll('.nx-picklist input')].slice(0, 4).forEach((i) => i.click()); }, 40); },
      'slots-fail': () => { S.result = 'fail'; S.sub = 'slots'; S.slotValue = 7; render(); saveSlots(); setTimeout(() => { [...document.querySelectorAll('.nx-picklist input')].slice(0, 3).forEach((i) => i.click()); confirmTop(20); }, 40); },
      'slots-toast': () => { S.sub = 'slots'; S.slotValue = 7; render(); saveSlots(); setTimeout(() => { [...document.querySelectorAll('.nx-picklist input')].slice(0, 3).forEach((i) => i.click()); confirmTop(20); }, 40); },
      'slots-fit': () => { S.sub = 'slots'; S.slotValue = 10; render(); saveSlots(); },
      'downgrade': () => { S.sub = 'slots'; S.slotPlan = 'starter'; S.slotValue = 12; render(); saveSlots(); },
    };
    const pg = /^(delete|deleted)/.test(state) ? 'profile' : /^(billing|plans|slots|downgrade)/.test(state) ? 'billing' : 'admin';
    if (pg === 'profile') { S.method = 'google'; shell.setControl('method', 'google'); }
    go(pg);
    if (steps[state]) steps[state]();
  }

  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
