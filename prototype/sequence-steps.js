/* Sequence > Steps and Sequence > Settings: safe actions prototype (spec rows 6 and 7, pattern F, no undo).
   Production markup is reproduced from webui main aeda4e3 (sequence-steps-markup.js); new elements carry .nx-new.
   URL params: ?tab=steps|settings &view=proposed|today &breakdown=ok|slow|fail &result=ok|fail &accounts=3|1
   &state=<screenshot state> &hover=<step number> &bd=<ms> &sd=<ms> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const SEQ = 'SaaS founders, Oct';
  const QSEQ = `“${SEQ}”`;
  const PROSPECTS = 2340;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/';
  const SC = C + 'components/sequence-single-content/components/';
  const SET = SC + 'sequence-single-settings/components/sequence-single-settings-content/components/';
  const EDGE = 'https://github.com/saleshandy/saleshandy-edge/blob/4617c54245290552db5483f112542b98d6901fc9/src/';

  /* ───────── scenario ───────── */
  const S = {
    tab: param('tab') === 'settings' ? 'settings' : 'steps',
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    accounts: param('accounts') === '1' ? '1' : '3',
  };

  /* ───────── data ───────── */
  // A 4-step sequence; counts add up: 160 still on step 1 + 2,180 emailed by step 1 = 2,340 prospects.
  const STEPS = () => [
    { id: 101, type: 'email', rel: 0, hashId: 'k3Vq8LmA', onStep: 160, soon: 96,
      variants: [
        { subject: 'Cutting churn without hiring more CSMs', body: 'Hi {{first_name}}, most SaaS teams we speak with lose 2 to 3% of revenue a month to churn they saw coming. We help CS teams spot it six weeks earlier.', sent: 1092, open: 541, reply: 72 },
        { subject: '{{first_name}}, a question about churn at {{company}}', body: 'Hi {{first_name}}, quick one: how does {{company}} decide which accounts your CS team calls first each week?', sent: 1088, open: 505, reply: 59 },
      ] },
    { id: 102, type: 'email', rel: 3, hashId: 'p7Rt2WxN', onStep: 412, soon: 138,
      variants: [
        { subject: 'Quick follow-up', body: 'Hi {{first_name}}, following up on my note from Thursday. Happy to share how Ledgerloop cut churn by a third in two quarters.', sent: 758, open: 352, reply: 44 },
        { subject: 'Worth 15 minutes next week?', body: 'Hi {{first_name}}, would 15 minutes next week be useful? I can walk you through the churn signals we see most in B2B SaaS.', sent: 754, open: 339, reply: 40 },
      ] },
    { id: 103, type: 'linkedin', rel: 3, hashId: 'c9Hd4QeZ', onStep: 57, soon: 21,
      variants: [{ body: 'Hi {{first_name}}, I emailed you last week about churn at {{company}}. Would be glad to connect here.' }] },
    { id: 104, type: 'email', rel: 4, hashId: 'f2Ls6YbK', onStep: 0, soon: 0,
      variants: [{ subject: 'Closing the loop', body: 'Hi {{first_name}}, I will leave it here for now. If churn becomes a priority this quarter, just reply and I will send a short plan.', sent: 0, open: 0, reply: 0 }] },
  ];
  // Three email accounts. "emailed" splits step 1's 2,180 sends: 1,140 + 1,040; the new account has sent nothing yet.
  const ACCOUNTS = (mode) => (mode === '1'
    ? [{ id: 1, name: 'Maya Chen', email: 'maya@brightpath.io', provider: 'gmail', tags: ['Primary'], signature: true, activeSequences: 4, available: 12, limit: 50, score: 92, owner: 'Maya Chen', sent: true, due: 575, soon: 122, followups: 1410, emailed: 2180 }]
    : [
      { id: 1, name: 'Maya Chen', email: 'maya@brightpath.io', provider: 'gmail', tags: ['Primary'], signature: true, activeSequences: 4, available: 12, limit: 50, score: 92, owner: 'Maya Chen', sent: true, due: 286, soon: 64, followups: 702, emailed: 1140 },
      { id: 2, name: 'Maya Chen', email: 'maya.chen@brightpath.co', provider: 'microsoft', tags: [], signature: true, activeSequences: 2, available: 19, limit: 50, score: 88, owner: 'Maya Chen', sent: true, due: 251, soon: 58, followups: 604, emailed: 1040 },
      { id: 3, name: 'Daniel Ortiz', email: 'daniel@brightpath.co', provider: 'gmail', tags: ['Warm-up'], signature: false, activeSequences: 1, available: 30, limit: 30, score: 76, owner: 'Daniel Ortiz', sent: false, due: 38, soon: 12, followups: 104, emailed: 0 },
    ]);
  let steps = STEPS();
  let accounts = ACCOUNTS(S.accounts);
  let seqActive = true;

  // Tentative dates: today is Thu 22 Oct 2026; the schedule sends on weekdays (moment 'ddd, Do MMM YYYY').
  const TODAY = new Date(2026, 9, 22);
  const ord = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  const fdate = (d) => `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${ord(d.getDate())} ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getFullYear()}`;
  function layout() {
    let day = 1; let date = new Date(TODAY); let prev = null;
    steps.forEach((s, i) => {
      s.number = i + 1;
      if (i === 0) { day = 1; date = new Date(TODAY); } else { day += s.rel; date = new Date(date); date.setDate(date.getDate() + s.rel); }
      while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1);
      s.absDay = day; s.date = fdate(date); s.prevDate = prev; prev = s.date;
    });
  }
  const stepKind = (s) => (s.type === 'email' ? 'Email' : 'LinkedIn connection request');
  const stepName = (s) => (s.type === 'email' ? `Email, “${esc(s.variants[0].subject)}”` : 'LinkedIn connection request');

  /* ───────── shell ───────── */
  const shell = nxShell({
    active: 'sequences',
    headerHTML: window.SS_HEADER(SEQ),
    controls: [
      { key: 'tab', label: 'Tab', value: S.tab, options: [['steps', 'Steps'], ['settings', 'Settings']], onChange: (v) => { S.tab = v; render(); } },
      { key: 'accounts', label: 'Email accounts', value: S.accounts, options: [['3', '3'], ['1', 'Only 1']], onChange: (v) => { S.accounts = v; accounts = ACCOUNTS(v); seqActive = true; S.tab = 'settings'; shell.setControl('tab', 'settings'); render(); } },
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
    ],
    devNotes: {
      intro: 'Spec rows 6 and 7. Pattern F only: no undo, because a deleted step and a removed sender cannot be put back exactly as they were. Breakdown counts come from the backend when the dialog opens (one call per dialog); the dialog opens at once with the step or account named in the title.',
      rows: [
        { n: 6, surface: 'Sequence > Steps', action: 'Delete step', patterns: 'F', breakdown: 'Prospects on this step now; emails scheduled from it in the next 24 hours (LinkedIn: tasks due); variants deleted with it (only when more than 1). Consequence names where those prospects go next: the next step on its delay, or out of the sequence if it was the last step. No prospects and nothing scheduled: one sentence.', undo: 'No. Typed "delete" confirmation removed (22 Oct 2026)',
          code: [{ label: 'sequence-single-step-header.tsx L174-182 (trash icon)', url: SC + 'sequence-single-step-header/sequence-single-step-header.tsx#L174-L182' }, { label: 'sequence-single-step-list.tsx L912-918 (submit handler)', url: SC + 'sequence-single-step-list/sequence-single-step-list.tsx#L912-L918' }, { label: 'sequence-single-step-list.tsx L1620-1626 (modal mount)', url: SC + 'sequence-single-step-list/sequence-single-step-list.tsx#L1620-L1626' }, { label: 'delete-step-modal.tsx L6-12 (copy)', url: C + 'shared/modals/delete-step-modal/delete-step-modal.tsx#L6-L12' }, { label: 'delete-modal.tsx (typed "delete", "Yes")', url: C + 'shared/modals/delete-modal/delete-modal.tsx' }] },
        { n: 7, surface: 'Sequence > Settings', action: 'Remove email account from sequence', patterns: 'F', breakdown: 'Account named in the title; prospects whose next email was due from it; scheduled from it in the next 24 hours; follow-up emails that move to the other accounts (or stop, when it is the only account); prospects it already emailed (reply and bounce tracking). Accounts with nothing sent yet go through the same dialog. Assumption to confirm: tracking for emails it already sent stops.', undo: 'No',
          code: [{ label: 'sequence-email-accounts-list.tsx L51-61 (dialog only if isAnySequenceMailSent)', url: SET + 'sequence-email-accounts-list/sequence-email-accounts-list.tsx#L51-L61' }, { label: 'sequence-email-account-column.tsx L25-32 (X icon, "Remove email")', url: SET + 'sequence-email-accounts-list/helper/sequence-email-account-column.tsx#L25-L32' }, { label: 'remove-email-warning-modal.tsx L16-38 (account not named)', url: SET + 'remove-email-warning-modal/remove-email-warning-modal.tsx#L16-L38' }, { label: 'edge sequence.service.ts disconnectEmailAccount (pauses the sequence when no connected account is left)', url: EDGE + 'sequence/services/sequence.service.ts#L4438-L4545' }] },
      ],
      notes: [
        'Dev to confirm with the scheduler: prospects on a deleted step move to the next step on its delay (edge deleteStep hands this to schedulerService.stepDeleted), and a removed sender\'s queued follow-ups move to the remaining senders (sequenceEmailAccountRemoved). The dialog copy states both as the required outcome.',
        'Verified in edge: removing the last connected email account pauses the sequence and its subsequences (SequencePauseReason.EmailAccountRemoved). The "Only 1" scenario shows it; the header switch turns off after removal.',
        'Today an account that has sent nothing is removed on the X click with no dialog. Proposed: every removal goes through the dialog; the X becomes a trash icon (spec B: a remove action never uses an X).',
        'The typed "delete" input and the "Yes" button are gone. Red primary carries the step number: "Delete step 2". Initial focus on Cancel.',
        'No undo toast. Success toasts name what changed. Failure keeps the dialog open with what happened and what to do.',
        'Today view does not model server failures: production closes its modal and shows the server message in an error toast.',
      ],
    },
  });
  const root = h('<div id="ss-root"></div>');
  shell.body.appendChild(root);

  /* ───────── render ───────── */
  function render() {
    NX.closeMenu();
    layout();
    root.innerHTML = window.SS_PAGE({ tab: S.tab, steps, accounts, prospects: PROSPECTS, proposed: S.view === 'proposed' });
    const sw = shell.header.querySelector('#nx-seq-active');
    if (sw) sw.checked = seqActive;
    root.querySelectorAll('[data-ss-tab]').forEach((t) => t.addEventListener('click', () => { S.tab = t.getAttribute('data-ss-tab'); shell.setControl('tab', S.tab); render(); }));
    root.querySelectorAll('[data-ss-noop]').forEach((b) => b.addEventListener('click', () => nxToast({ message: 'Not part of this prototype' })));
    root.querySelectorAll('[data-ss-delete-step]').forEach((b) => b.addEventListener('click', () => deleteStep(Number(b.getAttribute('data-ss-delete-step')))));
    root.querySelectorAll('[data-ss-remove]').forEach((b) => b.addEventListener('click', () => removeAccount(Number(b.getAttribute('data-ss-remove')))));
    const hv = param('hover');
    if (hv && S.tab === 'steps') { const li = root.querySelectorAll('.step-list-inner ul li')[Number(hv) - 1]; if (li) li.classList.add('nx-ss-hover'); }
    placeInk();
    NX.settle(root);
  }
  function placeInk() {
    const tab = root.querySelector('.bs-tabs-tab-active');
    const ink = root.querySelector('[data-ss="ink"]');
    if (!tab || !ink) return;
    ink.style.left = tab.offsetLeft + 'px';
    ink.style.width = tab.offsetWidth + 'px';
  }
  function sizeTitle() {
    const inp = shell.header.querySelector('.sequence-name--input');
    if (!inp) return;
    const cs = getComputedStyle(inp);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    inp.style.width = Math.ceil(ctx.measureText(inp.value).width + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) * 2 + 2) + 'px';
  }
  sizeTitle();
  document.fonts && document.fonts.ready.then(() => { sizeTitle(); placeInk(); });
  window.addEventListener('resize', placeInk);

  const dlgCommon = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: window.SS_BD, submitDelay: window.SS_SD }, o);

  /* ───────── row 6: delete step ───────── */
  function deleteStep(id) {
    const i = steps.findIndex((s) => s.id === id);
    const step = steps[i];
    if (!step) return null;
    const commit = () => { steps = steps.filter((s) => s.id !== id); render(); };

    if (S.view === 'today') {
      // delete-step-modal: getStepType() gives "Email" or "LinkedIn Manual Task"
      return window.SS_TODAY_DELETE_STEP({
        typeLabel: step.type === 'email' ? 'Email' : 'LinkedIn Manual Task', submitDelay: window.SS_SD,
        onSubmit: () => { commit(); nxToast({ message: 'Sequence step deleted successfully' }); },
      });
    }

    const next = steps[i + 1];
    const n = step.onStep;
    const empty = !step.onStep && !step.soon;
    const rows = empty
      ? [{ key: 'empty', label: '', value: 1 }]
      : [
        { key: 'on', label: 'Prospects on this step now', value: step.onStep },
        { key: 'soon', label: step.type === 'email' ? 'Emails scheduled from it in the next 24 hours' : 'LinkedIn tasks due from it in the next 24 hours', value: step.soon, sub: true },
        { key: 'variants', label: 'Variants deleted with it', value: step.variants.length > 1 ? step.variants.length : 0 },
      ];
    const sentence = (r) => {
      if (r.key === 'empty') return 'No prospects have reached this step yet, and nothing is scheduled from it.';
      if (r.key === 'on') return `${fmt(r.value)} ${plural(r.value, 'prospect is', 'prospects are')} on this step now.`;
      if (r.key === 'soon') return `${fmt(r.value)} ${plural(r.value, step.type === 'email' ? 'email is' : 'task is', step.type === 'email' ? 'emails are' : 'tasks are')} scheduled from it in the next 24 hours.`;
      return `Its ${r.value} variants are deleted with it.`;
    };
    const where = !n ? ''
      : next ? `Prospects on it move on to step ${next.number} (${stepKind(next)}) after its ${next.rel}-day delay. `
        : 'Prospects on it finish the sequence. ';
    return nxImpactDialog(dlgCommon({
      title: `Delete step ${step.number} (${stepName(step)})?`, tone: 'danger',
      rows, sentence,
      consequence: `${where}The step's content and stats are deleted. This can't be undone.`,
      primaryLabel: `Delete step ${step.number}`,
      failMessage: { title: `We couldn't delete step ${step.number} because this sequence's steps were changed in another tab.`, body: 'Refresh the page to see the latest steps, then try again.' },
      onConfirm: () => { const num = step.number; commit(); nxToast({ message: `Deleted step ${num} from ${QSEQ}` }); },
    }));
  }

  /* ───────── row 7: remove email account ───────── */
  function removeAccount(id) {
    const a = accounts.find((x) => x.id === id);
    if (!a) return null;
    const others = accounts.length - 1;
    const commit = () => {
      accounts = accounts.filter((x) => x.id !== id);
      if (!accounts.length) seqActive = false;
      render();
    };

    if (S.view === 'today') {
      const done = () => { commit(); nxToast({ message: 'Email account has been removed successfully' }); };
      // onAction: the warning modal only when row.isAnySequenceMailSent; otherwise the request fires on the click
      if (!a.sent) { done(); return null; }
      return window.SS_TODAY_REMOVE_EMAIL({ submitDelay: window.SS_SD, onSubmit: done });
    }

    const acc = `${others} email ${plural(others, 'account', 'accounts')}`;
    const consequence = others
      ? `Its prospects get their next emails from your other ${acc} instead.${a.emailed ? ' Replies and bounces to emails it already sent may stop being tracked.' : ''} This can't be undone.`
      : `This is the sequence's only email account, so the sequence pauses until you add another.${a.emailed ? ' Replies and bounces to emails it already sent may stop being tracked.' : ''} This can't be undone.`;
    return nxImpactDialog(dlgCommon({
      title: `Remove ${esc(a.email)} from ${QSEQ}?`, tone: 'danger',
      rows: [
        { key: 'due', label: 'Prospects whose next email was due from it', value: a.due },
        { key: 'soon', label: 'Scheduled from it in the next 24 hours', value: a.soon, sub: true },
        { key: 'fu', label: others ? `Follow-up emails that move to your other ${acc}` : 'Follow-up emails that stop', value: a.followups },
        { key: 'emailed', label: 'Prospects it already emailed', value: a.emailed },
      ],
      sentence: (r) => (r.key === 'due' ? `${fmt(r.value)} ${plural(r.value, 'prospect had its', 'prospects had their')} next email due from it.` : `${fmt(r.value)} ${r.label.toLowerCase()}.`),
      consequence,
      primaryLabel: 'Remove email account',
      failMessage: { title: `We couldn't remove ${esc(a.email)} because this sequence's settings were changed in another tab.`, body: 'Refresh the page, then try again.' },
      onConfirm: () => {
        commit();
        nxToast({ message: others ? `Removed ${esc(a.email)} from ${QSEQ}` : `Removed ${esc(a.email)}. ${QSEQ} is paused` });
      },
    }));
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const goto = (tab) => { S.tab = tab; shell.setControl('tab', tab); render(); };
    const today = () => { S.view = 'today'; shell.setControl('view', 'today'); };
    const confirmSoon = (d) => setTimeout(() => d && d.confirm(), (window.SS_BD || 0) + 50);
    const steps_ = {
      'steps': () => goto('steps'),
      'settings': () => goto('settings'),
      'today-step': () => { today(); goto('steps'); deleteStep(102); },
      'today-step-error': () => { today(); goto('steps'); const d = deleteStep(102); d.type('delet'); },
      'today-step-submitting': () => { today(); goto('steps'); const d = deleteStep(102); d.type('delete'); setTimeout(() => d.submit(), 30); },
      'today-remove': () => { today(); goto('settings'); removeAccount(1); },
      'today-remove-instant': () => { today(); goto('settings'); removeAccount(3); },
      'dlg-step': () => { goto('steps'); deleteStep(102); },
      'dlg-step-empty': () => { goto('steps'); deleteStep(104); },
      'dlg-step-linkedin': () => { goto('steps'); deleteStep(103); },
      'dlg-step-first': () => { goto('steps'); deleteStep(101); },
      'dlg-step-submitting': () => { goto('steps'); confirmSoon(deleteStep(102)); },
      'dlg-step-error': () => { S.result = 'fail'; goto('steps'); confirmSoon(deleteStep(102)); },
      'step-deleted': () => { goto('steps'); confirmSoon(deleteStep(102)); },
      'dlg-remove': () => { goto('settings'); removeAccount(1); },
      'dlg-remove-new': () => { goto('settings'); removeAccount(3); },
      'dlg-remove-only': () => { S.accounts = '1'; accounts = ACCOUNTS('1'); shell.setControl('accounts', '1'); goto('settings'); removeAccount(1); },
      'dlg-remove-submitting': () => { goto('settings'); confirmSoon(removeAccount(1)); },
      'dlg-remove-error': () => { S.result = 'fail'; goto('settings'); confirmSoon(removeAccount(1)); },
      'removed': () => { goto('settings'); confirmSoon(removeAccount(1)); },
      'removed-only': () => { S.accounts = '1'; accounts = ACCOUNTS('1'); shell.setControl('accounts', '1'); goto('settings'); confirmSoon(removeAccount(1)); },
    };
    if (steps_[state]) steps_[state]();
  }

  window.SS_BD = param('bd') != null ? Number(param('bd')) : undefined;
  window.SS_SD = param('sd') != null ? Number(param('sd')) : undefined;
  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 50);
})();
