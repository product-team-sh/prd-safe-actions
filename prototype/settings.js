/* Settings and Client Management: safe actions prototype (spec rows 26 to 32). Pattern F on each, no undo.
   Production markup is reproduced from webui main aeda4e3 in settings-markup.js; new elements carry .nx-new.
   URL params: ?page=users|custom-fields|schedules|custom-domain|integrations|clients &view=proposed|today
   &breakdown=ok|slow|fail &result=ok|fail &state=<screenshot state> &bd=<ms> &sd=<ms> &new=1 &dev=1 */
(function () {
  'use strict';
  const { fmt, plural, param, h, esc } = NX;
  const C = 'https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/';
  const SET = C + 'components/settings/components/';
  const PAGES = ['users', 'custom-fields', 'schedules', 'custom-domain', 'integrations', 'clients'];
  const q = (s) => `“${esc(s)}”`;

  /* ───────── scenario ───────── */
  const S = {
    page: PAGES.includes(param('page')) ? param('page') : 'users',
    view: param('view') === 'today' ? 'today' : 'proposed',
    breakdown: ['ok', 'slow', 'fail'].includes(param('breakdown')) ? param('breakdown') : 'ok',
    result: param('result') === 'fail' ? 'fail' : 'ok',
    fieldsTab: 'custom',
    openSchedule: null,
    liDetail: null,
    menu: null, // 'user:3' | 'domain:1' | 'crm:Hubspot'
    hoverClient: null,
  };
  const BD = param('bd') != null ? Number(param('bd')) : undefined;
  const SD = param('sd') != null ? Number(param('sd')) : undefined;
  const submitDelay = () => (SD != null ? SD : 900);

  /* ───────── data (account: Northbeam Growth, viewer Jordan Lee, owner) ───────── */
  const ME = 1;
  const MY_EMAIL = 'jordan@northbeamgrowth.com';
  let USERS = [
    { id: 1, first: 'Jordan', last: 'Lee', email: MY_EMAIL, role: 'owner', status: 'active', teams: ['Leadership'], login: '22 Oct, 2026 09:12 AM', logout: '', ip: '103.21.164.18', loc: 'Ahmedabad, Gujarat, India', own: { seq: 6, active: 3, prospects: 1420, accounts: 3 } },
    { id: 2, first: 'Marcus', last: 'Hale', email: 'marcus@northbeamgrowth.com', role: 'admin', status: 'active', teams: ['Leadership', 'SDR East'], login: '22 Oct, 2026 08:41 AM', logout: '21 Oct, 2026 07:02 PM', ip: '72.182.44.9', loc: 'Austin, Texas, United States', own: { seq: 9, active: 4, prospects: 2870, accounts: 5 } },
    { id: 3, first: 'Neha', last: 'Kapoor', email: 'neha@northbeamgrowth.com', role: 'member', status: 'active', teams: ['SDR East'], login: '22 Oct, 2026 10:05 AM', logout: '21 Oct, 2026 06:48 PM', ip: '49.36.120.77', loc: 'Mumbai, Maharashtra, India', own: { seq: 12, active: 5, prospects: 3480, accounts: 4 } },
    { id: 4, first: 'Priya', last: 'Raman', email: 'priya@northbeamgrowth.com', role: 'member', status: 'active', teams: ['SDR West'], login: '21 Oct, 2026 11:30 PM', logout: '22 Oct, 2026 02:15 AM', ip: '98.207.13.150', loc: 'San Jose, California, United States', own: { seq: 8, active: 3, prospects: 2115, accounts: 3 } },
    { id: 5, first: 'Tom', last: 'Becker', email: 'tom@northbeamgrowth.com', role: 'member', status: 'active', teams: ['SDR West'], login: '20 Oct, 2026 04:22 PM', logout: '20 Oct, 2026 07:40 PM', ip: '84.150.2.61', loc: 'Munich, Bavaria, Germany', own: { seq: 3, active: 1, prospects: 640, accounts: 2 } },
    { id: 6, first: 'Daniel', last: 'Osei', email: 'daniel@northbeamgrowth.com', role: 'member', status: 'inactive', teams: [], login: '02 Sep, 2026 09:58 AM', logout: '02 Sep, 2026 06:10 PM', ip: '41.66.198.20', loc: 'Accra, Greater Accra, Ghana', own: { seq: 6, active: 0, prospects: 1902, accounts: 2 } },
    { id: 7, first: 'Aisha', last: 'Khan', email: 'aisha@northbeamgrowth.com', role: 'member', status: 'invited', teams: [], login: '', logout: '', ip: '', loc: '', own: { seq: 0, active: 0, prospects: 0, accounts: 0 } },
    { id: 8, first: 'Sofia', last: 'Marin', email: 'sofia@northbeamgrowth.com', role: 'member', status: 'active', teams: ['SDR East'], login: '22 Oct, 2026 07:55 AM', logout: '21 Oct, 2026 05:30 PM', ip: '88.12.97.140', loc: 'Barcelona, Catalonia, Spain', own: { seq: 4, active: 2, prospects: 988, accounts: 1 } },
  ];
  let FIELDS = [
    { id: 1, label: 'Industry', hash: 'Pq7nX2a9Lk', type: 'Text', tags: ['Enrichment'], by: ['Jordan', 'Lee'], values: 1284, templates: 3, steps: 7, activeSteps: 5 },
    { id: 2, label: 'Employee Count', hash: 'bW4kR8zTq1', type: 'Number', tags: ['Enrichment'], by: ['Marcus', 'Hale'], values: 1102, templates: 0, steps: 1, activeSteps: 1 },
    { id: 3, label: 'Funding Stage', hash: 'Zt3mV9cQe6', type: 'Dropdown', tags: [], by: ['Neha', 'Kapoor'], values: 640, templates: 0, steps: 2, activeSteps: 0 },
    { id: 4, label: 'Pain Point', hash: 'Lf8sJ1wNa4', type: 'Long Text', tags: ['Personalisation', 'Q4', 'Founders'], by: ['Neha', 'Kapoor'], values: 312, templates: 2, steps: 4, activeSteps: 2 },
    { id: 5, label: 'Last Funding Date', hash: 'Hx2pD7rYm5', type: 'Date', tags: [], by: ['Marcus', 'Hale'], values: 455, templates: 0, steps: 0, activeSteps: 0 },
    { id: 6, label: 'Deal Size', hash: 'Qa9uE3kVb2', type: 'Currency', tags: ['Q4'], by: ['Priya', 'Raman'], values: 0, templates: 0, steps: 0, activeSteps: 0 },
    { id: 7, label: 'Tech Stack', hash: 'Mn6tG4hWc8', type: 'Text', tags: ['Enrichment'], by: ['Jordan', 'Lee'], values: 2031, templates: 1, steps: 3, activeSteps: 3 },
  ];
  const SYSTEM_FIELDS = [
    { id: 101, label: 'First Name', hash: 'sYs0FirstN', type: 'Text', tags: [], by: null },
    { id: 102, label: 'Last Name', hash: 'sYs0LastNm', type: 'Text', tags: [], by: null },
    { id: 103, label: 'Email', hash: 'sYs0EmailA', type: 'Text', tags: [], by: null },
    { id: 104, label: 'Company', hash: 'sYs0Compny', type: 'Text', tags: ['Enrichment'], by: null },
    { id: 105, label: 'Job Title', hash: 'sYs0JobTtl', type: 'Text', tags: [], by: null },
    { id: 106, label: 'Phone Number', hash: 'sYs0PhoneN', type: 'Text', tags: [], by: null },
    { id: 107, label: 'LinkedIn Profile', hash: 'sYs0LnkdIn', type: 'Text', tags: [], by: null },
  ];
  let SCHEDULES = [
    { id: 11, name: 'US East, weekdays', tz: 'America/New_York', tzLabel: '(GMT-04:00) Eastern Time - New York', isDefault: true, days: [1, 2, 3, 4, 5], from: ['09', '00'], to: ['17', '30'], used: 3,
      seqs: [['SaaS founders, Oct', 'Active'], ['Q4 agency outreach', 'Active'], ['Webinar follow-up, Sept', 'Paused']] },
    { id: 12, name: 'EMEA weekdays', tz: 'Europe/London', tzLabel: '(GMT+01:00) British Time - London', isDefault: false, days: [1, 2, 3, 4, 5], from: ['08', '30'], to: ['17', '00'], used: 5,
      seqs: [['UK fintech founders', 'Active'], ['DACH ops leaders', 'Active'], ['Nordics SaaS, Q4', 'Active'], ['Benelux agencies', 'Paused'], ['Event leads, Web Summit', 'Active']] },
    { id: 13, name: 'APAC mornings', tz: 'Asia/Singapore', tzLabel: '(GMT+08:00) Singapore Time', isDefault: false, days: [1, 2, 3, 4, 5], from: ['08', '00'], to: ['12', '00'], used: 0, seqs: [] },
    { id: 14, name: 'Weekend follow-ups', tz: 'America/Los_Angeles', tzLabel: '(GMT-07:00) Pacific Time - Los Angeles', isDefault: false, days: [6, 0], from: ['10', '00'], to: ['14', '00'], used: 1, seqs: [['Re-engage cold leads', 'Active']] },
  ];
  let DOMAINS = [
    { id: 21, domain: 'track.northbeamgrowth.com', valid: true, isDefault: true, accounts: ['jordan@northbeamgrowth.com', 'marcus@northbeamgrowth.com', 'tom@northbeamgrowth.com', 'sofia@northbeamgrowth.com', 'outreach@northbeamgrowth.com', 'hello@northbeamgrowth.com'], activeSeq: 9 },
    { id: 22, domain: 'links.northbeam.io', valid: true, isDefault: false, accounts: ['neha@northbeam.io', 'priya@northbeam.io'], activeSeq: 3 },
    { id: 23, domain: 'go.nbgrowth.co', valid: false, isDefault: false, accounts: [], activeSeq: 0 },
  ];
  const CRMS = [
    { key: 'Pipedrive', name: 'Pipedrive', connected: false },
    { key: 'Zoho', name: 'Zoho', connected: false },
    { key: 'Hubspot', name: 'HubSpot', connected: true, workflows: ['reply received', 'email sent', 'prospect outcome updated', 'prospect unsubscribed', 'contact import from HubSpot'] },
    { key: 'Salesforce', name: 'Salesforce', connected: false },
  ];
  const LINKEDIN = [
    { key: 'Aimfox', name: 'Aimfox', connected: false },
    { key: 'HeyReach', name: 'HeyReach', connected: true, by: 'Marcus Hale', seqs: 3, waiting: 186 },
  ];
  let CLIENTS = [
    { id: 31, company: 'Brightforge', email: 'ana.silva@brightforge.co', active: true, seq: 4, accounts: 6, prospects: 2340, sent: 18420, permission: 'Full Access', created: '12 Mar, 2026' },
    { id: 32, company: 'Ledgerloop', email: 'marc.duarte@ledgerloop.io', active: true, seq: 2, accounts: 3, prospects: 980, sent: 6115, permission: 'Limited Access', created: '04 May, 2026' },
    { id: 33, company: 'Harborly', email: 'jen.walsh@harborly.io', active: true, seq: 5, accounts: 4, prospects: 3105, sent: 22870, permission: 'Full Access', created: '19 Jun, 2026' },
    { id: 34, company: 'Quillstack', email: 'omar.saleh@quillstack.com', active: false, seq: 0, accounts: 0, prospects: 412, sent: 1980, permission: 'No Access', created: '27 Jul, 2026' },
    { id: 35, company: 'Cartwheel AI', email: 'mei.chen@cartwheel.ai', active: true, seq: 1, accounts: 2, prospects: 560, sent: 940, permission: 'Limited Access', created: '08 Sep, 2026' },
    { id: 36, company: 'Fieldnote', email: 'liam.novak@fieldnote.app', active: true, seq: 3, accounts: 3, prospects: 1275, sent: 7340, permission: 'Full Access', created: '14 Oct, 2026' },
  ];

  const roleName = (r) => r[0].toUpperCase() + r.slice(1);
  const fullName = (u) => `${u.first} ${u.last}`;

  /* ───────── shell ───────── */
  const L = (label, url) => ({ label, url });
  const shell = nxShell({
    active: 'settings',
    title: 'Settings',
    controls: [
      { key: 'breakdown', label: 'Breakdown', value: S.breakdown, options: [['ok', 'Loads'], ['slow', 'Slow 2s'], ['fail', 'Fails']], onChange: (v) => { S.breakdown = v; } },
      { key: 'result', label: 'Action', value: S.result, options: [['ok', 'Succeeds'], ['fail', 'Fails']], onChange: (v) => { S.result = v; } },
      { key: 'view', label: 'View', value: S.view, options: [['today', 'Today'], ['proposed', 'Proposed']], onChange: (v) => { S.view = v; render(); } },
      { key: 'screen', label: 'Screen', value: S.page === 'clients' ? 'clients' : 'settings', options: [['settings', 'Settings'], ['clients', 'Client Management']], onChange: (v) => { go(v === 'clients' ? 'clients' : 'users'); } },
    ],
    devNotes: {
      intro: 'Spec rows 26 to 32. Every row is a single named item, so titles name it and primaries drop the count of 1. None of these gets the 10-second undo: their effects (sessions, CRM sync, emailed passwords) happen at once. Knock-on counts in the breakdown need one backend lookup each, served before or while the dialog opens.',
      rows: [
        { n: 26, surface: 'Settings > Users & Teams', action: 'Delete user', patterns: 'F', undo: 'No',
          breakdown: 'Sequences they own (of which active), prospects they own, email accounts they connected. One lookup by user id. <b>Assumption to confirm:</b> on delete, ownership moves to the account owner and active sequences keep sending. The copy says so; if the backend does something else (deletes, pauses, leaves orphans), the consequence line must change.',
          code: [L('delete-user-modal.tsx L1-29 (no name, silent on their data)', SET + 'users-and-teams/components/users/modals/delete-user-modal.tsx#L1-L29'), L('users.tsx L238-242 (opens it)', SET + 'users-and-teams/components/users/users.tsx#L238-L242'), L('users.tsx L677-698 (failure closes the modal, error toast)', SET + 'users-and-teams/components/users/users.tsx#L677-L698')] },
        { n: 27, surface: 'Settings > Users & Teams', action: 'Change role, including Owner', patterns: 'F', undo: 'No (change it back by hand)',
          breakdown: 'No lookup. Old role, new role and what they gain or lose, from the role map. Owner transfer is red: the viewer becomes Admin and only the new owner can reverse it. <b>Blocked state:</b> demoting the only Admin is refused with the reason; "admin" here means the Admin role, not the owner. Confirm the rule is wanted: with today\'s permissions the owner always keeps full rights, so the account never truly has no admin. The gain and lose lines are written from the role names and must be checked against the permission map.',
          code: [L('change-role-modal.tsx L51-83 (no name, no old/new, no consequence)', SET + 'users-and-teams/components/users/modals/change-role-modal.tsx#L51-L83'), L('get-action-permissions.ts L13-35 (who can change whom)', SET + 'users-and-teams/components/users/utils/get-action-permissions.ts#L13-L35')] },
        { n: 28, surface: 'Settings > Prospect Fields', action: 'Delete custom field', patterns: 'F', undo: 'No',
          breakdown: 'Prospects holding a value, email templates using the merge tag, sequence steps using it (of which in active sequences). <b>Assumption:</b> a step that uses a deleted merge tag sends with it blank. If it instead fails or skips the prospect, the consequence must say that.',
          code: [L('delete-custom-field-modal.tsx L21-41', SET + 'custom-fields/components/delete-custom-field-modal/delete-custom-field-modal.tsx#L21-L41'), L('custom-field.tsx L542-552 (generic copy)', SET + 'custom-fields/custom-field.tsx#L542-L552'), L('benchmark: delete-option-modal.tsx L43-90', SET + 'custom-fields/components/generic-create-update-custom-field-modal/delete-option-modal.tsx#L43-L90')] },
        { n: 29, surface: 'Settings > Schedules', action: 'Delete schedule', patterns: 'F', undo: 'No',
          breakdown: 'Sequences using it, first 3 named plus "and N more", each with its status. The count is already on the schedule (<code>scheduleSequenceCount</code>), so the dialog knows at once whether it is blocked; only the names need a lookup. In use = blocked inside the dialog (today the server refuses with error 4001 and a second modal appears after the click). The 4001 message text in the Today view is assumed.',
          code: [L('delete-schedule.tsx L11-21 (no name, Yes / Cancel)', SET + 'schedule/components/delete-schedule/delete-schedule.tsx#L11-L21'), L('schedule.tsx L95-105 (4001 alert after the click)', SET + 'schedule/schedule.tsx#L95-L105'), L('schedule-form.tsx L423-428 (scheduleSequenceCount exists)', C + 'shared/components/schedule-form/schedule-form.tsx#L423-L428')] },
        { n: 30, surface: 'Settings > Custom Tracking Domain', action: 'Delete tracking domain', patterns: 'F', undo: 'No',
          breakdown: 'Email accounts using it (already in the list payload), active sequences sending from those accounts (lookup). Default domain: names the domain that becomes the default. <b>Assumption:</b> tracking for those accounts falls back to the default domain; dev to confirm.',
          code: [L('helper.ts L22-35 (no domain name)', SET + 'custom-domain/helper.ts#L22-L35'), L('custom-domain.tsx L330-342', SET + 'custom-domain/custom-domain.tsx#L330-L342')] },
        { n: 31, surface: 'Settings > Integrations', action: 'Disconnect CRM; disconnect HeyReach or Aimfox', patterns: 'F', undo: 'No',
          breakdown: 'CRM: the workflows that stop, named (the subscribed Cobalt events plus contact import). LinkedIn tool: sequences with a step for it, prospects waiting on that step. <b>Dev to confirm:</b> whether field mappings survive a CRM disconnect (copy says kept), and whether deleting the LinkedIn integration removes its API key and field mapping (copy says removed).',
          code: [L('integrations.tsx L340-363 (no confirmation, unsubscribes every Cobalt event)', SET + 'integrations/integrations.tsx#L340-L363'), L('crm-view.tsx L59-66', SET + 'integrations/utils/crm-view.tsx#L59-L66'), L('linkedin-settings-detail.tsx L641-678 (confirms, generic copy)', SET + 'integrations/components/linkedin-automation-card/linkedin-settings-detail.tsx#L641-L678'), L('linkedin-automation-card.tsx L174-182 (no confirm, but not mounted anywhere)', SET + 'integrations/components/linkedin-automation-card/linkedin-automation-card.tsx#L174-L182')],
          v3: 'The audit\'s "LinkedIn card Disconnect with no confirmation" is <code>LinkedInAutomationCard</code>, which nothing imports at aeda4e3 (or on main at 5f1d224). The live LinkedIn path is the HeyReach or Aimfox card, then the settings detail page, whose Disconnect already confirms with generic copy. The prototype applies F there. Delete the dead card or give it the same dialog.' },
        { n: 32, surface: 'Client Management (/clients)', action: 'Reset client password', patterns: 'F', undo: 'No',
          breakdown: 'No lookup: the client is named with their login email. <b>Code says the new password goes to the agency user, not the client:</b> today\'s success toast is "New password sent to your email successfully", so the copy says we email it to you. That they are signed out is an assumption to confirm. Today a failed reset shows nothing (the error toast is commented out); the dialog shows the failure.',
          code: [L('get-agency-client-columns.tsx L55-83 (icon-only, fires on click)', C + 'components/agency-client-management/components/agency-client-table/utils/get-agency-client-columns.tsx#L55-L83'), L('agency-client-list.tsx L230-251 (toast; errors swallowed)', C + 'components/agency-client-management/components/agency-client-list/agency-client-list.tsx#L230-L251')] },
      ],
      notes: [
        'Benchmarks matched in tone: mcp-disconnect-modal (names the thing, says what stops, says whether it comes back) and custom-fields delete-option-modal (stops you before damage instead of after).',
        'Single items: primaries are "Delete user", "Delete field", "Disconnect HubSpot", not "Delete 1 user". The title already names the item.',
        'Blocked states (only admin, schedule in use) keep the dialog open with the reason and a disabled primary; nothing is sent.',
        'Red for deletes, owner transfer, the LinkedIn tool disconnect (API key and mapping are removed) and password resets (none can be undone from Saleshandy). Blue for role changes and CRM disconnects, which can be reversed (mappings are kept).',
        'Client Management is a top-level page (/clients), not part of the Settings nav; the Screen control switches to it.',
      ],
    },
  });

  const root = h('<div id="st-root"></div>');
  shell.body.appendChild(root);
  const titleEl = shell.header.querySelector('.nx-page-title');

  function setChrome() {
    const clients = S.page === 'clients';
    titleEl.textContent = clients ? 'Client Management' : 'Settings';
    document.querySelectorAll('.app-sidebar .app-sidebar__nav-item-container').forEach((c) => {
      const lab = c.querySelector('[aria-label]')?.getAttribute('aria-label') || c.getAttribute('aria-label');
      const on = clients ? lab === 'More' : lab === 'Settings';
      c.classList.toggle('active', on);
      const it = c.querySelector('.app-sidebar__nav-item'); if (it) it.classList.toggle('active', on);
    });
    shell.setControl('screen', clients ? 'clients' : 'settings');
  }

  function go(page) {
    S.page = page; S.menu = null; S.liDetail = null; S.openSchedule = null; S.hoverClient = null;
    render();
  }

  /* ───────── render ───────── */
  function pageHTML() {
    switch (S.page) {
      case 'users': return ST_USERS({ users: USERS, me: ME, openMenu: S.menu && S.menu.startsWith('user:') ? Number(S.menu.slice(5)) : null });
      case 'custom-fields': return ST_FIELDS({ tab: S.fieldsTab, fields: S.fieldsTab === 'custom' ? FIELDS : SYSTEM_FIELDS });
      case 'schedules': return ST_SCHEDULES({ schedules: SCHEDULES, open: S.openSchedule });
      case 'custom-domain': return ST_DOMAINS({ domains: DOMAINS, openMenu: S.menu && S.menu.startsWith('domain:') ? Number(S.menu.slice(7)) : null });
      case 'integrations': return S.liDetail ? ST_LI_DETAIL(LINKEDIN.find((p) => p.key === S.liDetail)) : ST_INTEGRATIONS({ crms: CRMS, linkedin: LINKEDIN, openMenu: S.menu && S.menu.startsWith('crm:') ? S.menu.slice(4) : null });
      default: return '';
    }
  }
  function render() {
    closeMenus();
    setChrome();
    if (S.page === 'clients') {
      root.innerHTML = ST_CLIENTS({ clients: CLIENTS, hover: S.hoverClient });
    } else {
      const usersTab = S.page === 'users' ? ' settings-users-and-teams-tab' : '';
      root.innerHTML = `<div class="setting-container container-fluid"><div class="h-100 row"><div class="h-100 col"><div class="setting-content row">
        <div class="settings-navigation"><nav aria-label="Settings">${ST_NAV(S.page)}</nav></div>
        <div class="setting-components${usersTab}">${pageHTML()}</div>
      </div></div></div></div>`;
    }
    placeInk();
    openMenuOverlay();
    NX.settle(root);
  }
  function placeInk() {
    root.querySelectorAll('.bs-tabs').forEach((tabs) => {
      const tab = tabs.querySelector('.bs-tabs-tab-active');
      const ink = tabs.querySelector('[data-st="ink"]');
      if (!tab || !ink) return;
      ink.style.left = tab.offsetLeft + 'px';
      ink.style.width = tab.offsetWidth + 'px';
    });
  }
  document.fonts && document.fonts.ready.then(placeInk);
  window.addEventListener('resize', () => { placeInk(); positionMenu(); });

  /* production dropdowns: rendered at body level so the table's overflow does not clip them */
  let menuEl = null;
  let menuAnchor = null;
  function closeMenus() { if (menuEl) { menuEl.remove(); menuEl = null; menuAnchor = null; } }
  function positionMenu() {
    if (!menuEl || !menuAnchor || !menuAnchor.isConnected) return;
    const r = menuAnchor.getBoundingClientRect();
    const m = menuEl.querySelector('.dropdown-menu-custom');
    const w = m.offsetWidth;
    let left = r.left + 15; // production menus sit under the toggle with margin-left: -15px
    if (left + w > window.innerWidth - 8) left = r.right - w + 15;
    menuEl.style.left = Math.max(8, left) + 'px';
    menuEl.style.top = (r.bottom + 2) + 'px';
  }
  function openMenuOverlay() {
    if (!S.menu) return;
    const [kind, id] = [S.menu.split(':')[0], S.menu.slice(S.menu.indexOf(':') + 1)];
    let html = '';
    if (kind === 'user') { const u = USERS.find((x) => x.id === Number(id)); if (!u) return; html = ST_USER_MENU(u, u.id === ME); menuAnchor = root.querySelector(`[data-st-menu="${id}"]`); }
    if (kind === 'domain') { const d = DOMAINS.find((x) => x.id === Number(id)); if (!d) return; html = ST_DOMAIN_MENU(d); menuAnchor = root.querySelector(`[data-st-domain-menu="${id}"]`); }
    if (kind === 'crm') { html = ST_CRM_MENU(); menuAnchor = root.querySelector(`[data-st-crm-menu="${id}"]`); }
    if (!menuAnchor) return;
    menuEl = h(`<div class="st-menu-layer">${html}</div>`);
    document.body.appendChild(menuEl);
    positionMenu();
  }

  /* ───────── events ───────── */
  const noop = () => nxToast({ message: 'Not part of this prototype' });
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.nx-modal-root') || t.closest('.nx-demo') || t.closest('.nx-dev')) return;
    const a = (sel) => t.closest(sel);
    let el;
    if ((el = a('[data-st-user-action]'))) {
      e.preventDefault();
      const u = USERS.find((x) => x.id === Number(S.menu.slice(5)));
      S.menu = null; closeMenus(); render();
      const k = el.dataset.stUserAction;
      if (k === 'delete') openDeleteUser(u); else if (k === 'changeRole') openChangeRole(u); else if (k === 'copyUserId') nxToast({ message: 'User ID Successfully Copied' }); else noop();
      return;
    }
    if ((el = a('[data-st-domain-action]'))) {
      e.preventDefault();
      const d = DOMAINS.find((x) => x.id === Number(S.menu.slice(7)));
      S.menu = null; render(); openDeleteDomain(d); return;
    }
    if ((el = a('[data-st-crm-action]'))) {
      e.preventDefault();
      const app = CRMS.find((x) => x.key === S.menu.slice(4));
      S.menu = null; render(); openDisconnectCRM(app); return;
    }
    if ((el = a('[data-st-noop]'))) { e.preventDefault(); S.menu = null; closeMenus(); noop(); return; }
    if (menuEl && !menuEl.contains(t) && !a('[data-st-menu],[data-st-domain-menu],[data-st-crm-menu]')) { S.menu = null; closeMenus(); render(); }
    if (!root.contains(t)) return;
    if ((el = a('[data-st-nav]'))) {
      e.preventDefault();
      const id = el.dataset.stNav;
      if (PAGES.includes(id)) go(id); else noop();
      return;
    }
    if ((el = a('[data-st-menu]'))) { e.stopPropagation(); const k = 'user:' + el.dataset.stMenu; S.menu = S.menu === k ? null : k; render(); return; }
    if ((el = a('[data-st-domain-menu]'))) { const k = 'domain:' + el.dataset.stDomainMenu; S.menu = S.menu === k ? null : k; render(); return; }
    if ((el = a('[data-st-crm-menu]'))) { e.stopPropagation(); const k = 'crm:' + el.dataset.stCrmMenu; S.menu = S.menu === k ? null : k; render(); return; }
    if ((el = a('[data-st-tab]'))) { S.fieldsTab = el.dataset.stTab; render(); return; }
    if ((el = a('[data-st-field-delete]'))) { openDeleteField(FIELDS.find((f) => f.id === Number(el.dataset.stFieldDelete))); return; }
    if ((el = a('[data-st-schedule-delete]'))) { openDeleteSchedule(SCHEDULES.find((s) => s.id === Number(el.dataset.stScheduleDelete))); return; }
    if ((el = a('[data-st-acc]'))) { const id = Number(el.dataset.stAcc); S.openSchedule = S.openSchedule === id ? null : id; render(); return; }
    if ((el = a('[data-st-li-disconnect]'))) { openDisconnectLI(LINKEDIN.find((p) => p.key === el.dataset.stLiDisconnect)); return; }
    if ((el = a('[data-st-li-back]'))) { S.liDetail = null; render(); return; }
    if ((el = a('[data-st-li]'))) { const p = LINKEDIN.find((x) => x.key === el.dataset.stLi); if (p.connected) { S.liDetail = p.key; render(); } else noop(); return; }
    if ((el = a('[data-st-crm]'))) { if (!a('.li-int-card__more')) noop(); return; }
    if ((el = a('[data-st-client-reset]'))) { openResetPassword(CLIENTS.find((c) => c.id === Number(el.dataset.stClientReset))); return; }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuEl) { S.menu = null; closeMenus(); render(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-st-acc],[role="button"][data-st-schedule-delete],[role="button"][data-st-client-reset],[role="button"][data-st-li],[role="button"][data-st-li-back]')) { e.preventDefault(); e.target.click(); }
  });

  /* ───────── dialog helpers ───────── */
  const dlg = (o) => Object.assign({ breakdown: S.breakdown, submit: S.result, breakdownDelay: BD, submitDelay: SD }, o);
  const noLookup = (sentence) => ({ rows: [{ key: 'one', label: '', value: 1 }], sentence, breakdown: 'ok', breakdownDelay: 0 });
  const today = () => S.view === 'today';
  // Today: the modal closes after the request, success or error shows as a toast (production pattern)
  function todaySubmit(api, onOk, errMsg) {
    api.busy(true);
    setTimeout(() => {
      api.close();
      if (S.result === 'fail') { if (errMsg) nxToast({ message: errMsg, variant: 'error' }); return; }
      onOk();
    }, submitDelay());
  }
  const GENERIC_FAIL = 'Something went wrong on our side and nothing changed. Try again in a minute.';

  /* ───────── 26. Delete user ───────── */
  function openDeleteUser(u) {
    const name = fullName(u);
    const remove = () => { USERS = USERS.filter((x) => x.id !== u.id); render(); };
    if (today()) {
      return ST_TODAY.deleteUser({ onSubmit: (api) => todaySubmit(api, () => { remove(); nxToast({ message: 'User Successfully Deleted' }); }, 'Something went wrong. Please try again.') });
    }
    const o = u.own;
    const nothing = !o.seq && !o.prospects && !o.accounts;
    const phrase = { seq: (n) => `${esc(u.first)} owns ${fmt(n)} ${plural(n, 'sequence', 'sequences')}.`, prospects: (n) => `${esc(u.first)} owns ${fmt(n)} ${plural(n, 'prospect', 'prospects')}.`, accounts: (n) => `${esc(u.first)} connected ${fmt(n)} email ${plural(n, 'account', 'accounts')}.` };
    const rowsPart = nothing
      ? noLookup(`${esc(u.first)} ${u.status === 'invited' ? 'hasn\'t accepted the invite yet and ' : ''}owns no sequences, prospects or email accounts.`)
      : {
        rows: [
          { key: 'seq', label: 'Sequences they own', value: o.seq },
          { key: 'active', label: 'Active, still sending', value: o.active, sub: true },
          { key: 'prospects', label: 'Prospects they own', value: o.prospects },
          { key: 'accounts', label: 'Email accounts they connected', value: o.accounts },
        ],
        sentence: (r) => (phrase[r.key] ? phrase[r.key](r.value) : ''),
      };
    return nxImpactDialog(dlg({
      title: `Delete the user ${q(name)}?`, tone: 'danger',
      ...rowsPart,
      consequence: nothing
        ? `${u.status === 'invited' ? `${esc(u.first)}'s invite stops working.` : `${esc(u.first)} loses access at once.`} This can't be undone.`
        : `${esc(u.first)} loses access at once. Their sequences, prospects and email accounts move to you, the account owner, and active sequences keep sending. This can't be undone.`,
      primaryLabel: 'Delete user',
      failMessage: { title: `We couldn't delete ${esc(name)}.`, body: GENERIC_FAIL },
      onConfirm: () => { remove(); nxToast({ message: `Deleted ${esc(name)}` }); },
    }));
  }

  /* ───────── 27. Change role ───────── */
  const DELTA = {
    'member>admin': (f) => [`${f} can see and edit every sequence, prospect and email account, not just their own.`, `${f} can invite and remove users, change roles and edit company settings.`],
    'admin>member': (f) => [`${f} can only see and edit their own sequences, prospects and email accounts.`, `${f} can no longer manage users, roles or company settings.`],
    'member>owner': (f) => [`${f} becomes the account owner, with full control including billing.`, 'You become an Admin.'],
    'admin>owner': (f) => [`${f} becomes the account owner, with full control including billing.`, 'You become an Admin.'],
  };
  function openChangeRole(u) {
    const name = fullName(u);
    const f = esc(u.first);
    const apply = (role) => {
      if (role === 'owner') { const me = USERS.find((x) => x.id === ME); me.role = 'admin'; }
      u.role = role; render();
    };
    if (today()) {
      return ST_TODAY.changeRole({ role: u.role, onSubmit: (api, role) => todaySubmit(api, () => { apply(role); nxToast({ message: 'User Role Successfully Changed' }); }, 'Something went wrong. Please try again.') });
    }
    const admins = USERS.filter((x) => x.role === 'admin' && x.status !== 'invited');
    let pick = u.role;
    const opts = ['member', 'admin', 'owner'];
    const wrap = h(`<div class="nx-impact nx-new">
        <div class="nx-picklist st-roles" role="radiogroup" aria-label="Role for ${esc(name)}">${opts.map((r) => `<label><input type="radio" name="st-role" value="${r}"${r === u.role ? ' checked' : ''}><span class="nx-pk-name">${roleName(r)}</span>${r === u.role ? '<span class="nx-pk-meta">Current role</span>' : ''}</label>`).join('')}</div>
        <div class="st-delta" aria-live="polite"></div>
        <p class="nx-consequence" hidden></p>
      </div>`);
    const delta = wrap.querySelector('.st-delta');
    const cons = wrap.querySelector('.nx-consequence');
    let blocked = false;
    const setIcon = (danger) => { const im = ctrl.el.querySelector('.confirmation-modal-v3--title img'); if (im) im.src = NX.IMG(danger ? 'info-circle-red.svg' : 'info-circle-blue.svg'); };
    const update = () => {
      blocked = false;
      setIcon(pick === 'owner' && pick !== u.role);
      if (pick === u.role) {
        delta.innerHTML = `<p class="nx-note">${f} is ${u.role === 'admin' ? 'an' : 'a'} ${roleName(u.role)}. Pick a new role to see what changes.</p>`;
        cons.hidden = true;
        ctrl.setPrimary({ label: 'Change role', disabled: true, tone: 'primary' });
        return;
      }
      if (u.role === 'admin' && pick === 'member' && admins.length <= 1) {
        blocked = true;
        delta.innerHTML = `<div class="st-blocked" role="status"><img src="${NX.IMG('info-circle-blue.svg')}" alt=""><p>${f} is the only admin. Make someone else an admin first, so the account always has one.</p></div>`;
        cons.hidden = true;
        ctrl.setPrimary({ label: `Change ${f} to Member`, disabled: true, tone: 'primary' });
        return;
      }
      const lines = DELTA[`${u.role}>${pick}`](f);
      delta.innerHTML = `<ul class="st-delta-list">${lines.map((l) => `<li>${l}</li>`).join('')}</ul>`;
      cons.hidden = false;
      if (pick === 'owner') {
        cons.textContent = `Only ${u.first} can make you the owner again.`;
        ctrl.setPrimary({ label: `Make ${f} the owner`, disabled: false, tone: 'danger' });
      } else {
        cons.textContent = 'You can change this back at any time.';
        ctrl.setPrimary({ label: `Change ${f} to ${roleName(pick)}`, disabled: false, tone: 'primary' });
      }
    };
    const ctrl = nxDialog({
      title: `Change ${esc(name)}'s role?`, tone: 'primary', body: wrap, primaryLabel: 'Change role', primaryDisabled: true,
      onPrimary(c) {
        if (blocked) return;
        c.setError(null); c.setBusy(true);
        setTimeout(() => {
          if (!c.el.isConnected) return;
          if (S.result === 'fail') { c.setBusy(false); c.setError(`<b>We couldn't change ${f}'s role.</b>${GENERIC_FAIL}`); c.primaryBtn.focus(); return; }
          c.close('done');
          apply(pick);
          nxToast({ message: pick === 'owner' ? `${esc(name)} is now the owner. You are an Admin.` : `${esc(name)} is now ${pick === 'admin' ? 'an' : 'a'} ${roleName(pick)}` });
        }, submitDelay());
      },
    });
    ctrl.primaryBtn.classList.add('nx-new');
    wrap.querySelectorAll('input[name="st-role"]').forEach((r) => r.addEventListener('change', () => { pick = r.value; update(); }));
    update();
    wrap.querySelector('input[checked]').focus({ preventScroll: true });
    ctrl.pick = (r) => { const inp = wrap.querySelector(`input[value="${r}"]`); inp.checked = true; pick = r; update(); };
    return ctrl;
  }

  /* ───────── 28. Delete custom field ───────── */
  function openDeleteField(fl) {
    const remove = () => { FIELDS = FIELDS.filter((x) => x.id !== fl.id); render(); };
    if (today()) {
      return ST_TODAY.deleteField({ onSubmit: (api) => todaySubmit(api, () => { remove(); nxToast({ message: 'Custom field deleted successfully.' }); }, 'Something went wrong. Please try again.') });
    }
    const tag = `{{${esc(fl.label)}}}`;
    const nothing = !fl.values && !fl.templates && !fl.steps;
    const phrase = {
      values: (n) => `${fmt(n)} ${plural(n, 'prospect has', 'prospects have')} a value in this field.`,
      templates: (n) => `${fmt(n)} email ${plural(n, 'template uses', 'templates use')} ${tag}.`,
      steps: (n) => `${fmt(n)} sequence ${plural(n, 'step uses', 'steps use')} ${tag}.`,
    };
    return nxImpactDialog(dlg({
      title: `Delete the custom field ${q(fl.label)}?`, tone: 'danger',
      rows: [
        { key: 'values', label: 'Prospects with a value', value: fl.values },
        { key: 'templates', label: `Email templates that use ${tag}`, value: fl.templates },
        { key: 'steps', label: `Sequence steps that use ${tag}`, value: fl.steps },
        { key: 'active', label: 'In active sequences', value: fl.activeSteps, sub: true },
      ],
      sentence: (r) => (phrase[r.key] ? phrase[r.key](r.value) : ''),
      note: nothing ? `No prospect has a value and no email uses ${tag}.` : null,
      consequence: nothing ? 'This can\'t be undone.'
        : `${fl.values ? `${fl.values === 1 ? 'The value is' : `All ${fmt(fl.values)} values are`} deleted. ` : ''}${fl.templates || fl.steps ? `Emails that use ${tag} send with it blank. ` : ''}This can't be undone.`,
      primaryLabel: 'Delete field',
      failMessage: { title: `We couldn't delete ${q(fl.label)}.`, body: GENERIC_FAIL },
      onConfirm: () => { remove(); nxToast({ message: `Deleted the field ${q(fl.label)}` }); },
    }));
  }

  /* ───────── 29. Delete schedule ───────── */
  function openDeleteSchedule(s) {
    const remove = () => { SCHEDULES = SCHEDULES.filter((x) => x.id !== s.id); S.openSchedule = null; render(); };
    if (today()) {
      return ST_TODAY.confirmOld({
        title: 'Do you want to delete this schedule?',
        content: 'If you delete the schedule, the sequences connected with this schedule will get affected.',
        onSubmit: (api) => {
          api.busy(true);
          setTimeout(() => {
            api.close();
            if (s.used > 0) { // server error 4001, shown in a second modal after the click (schedule.tsx L95-105)
              const al = ST_TODAY.confirmOld({ hideIcon: true, showCancel: false, title: `This schedule is used in ${s.used} ${plural(s.used, 'sequence', 'sequences')}. Please change the schedule of those sequences and try again.`, onSubmit: () => al.close() });
              return;
            }
            if (S.result === 'fail') { nxToast({ message: 'Something went wrong. Please try again.', variant: 'error' }); return; }
            remove(); nxToast({ message: 'Schedule deleted successfully.' });
          }, submitDelay());
        },
      });
    }
    if (!s.used) {
      return nxImpactDialog(dlg({
        title: `Delete the schedule ${q(s.name)}?`, tone: 'danger',
        ...noLookup('No sequence uses this schedule.'),
        consequence: 'This can\'t be undone.',
        primaryLabel: 'Delete schedule',
        failMessage: { title: 'We couldn\'t delete this schedule because a sequence started using it a moment ago.', body: 'Refresh the page to see which one.' },
        onConfirm: () => { remove(); nxToast({ message: `Deleted the schedule ${q(s.name)}` }); },
      }));
    }
    // In use: blocked inside the dialog. The count is on the schedule already; the names load.
    const n = s.used;
    const wrap = h(`<div class="nx-impact nx-new">
        <p class="nx-sentence">${fmt(n)} ${plural(n, 'sequence uses', 'sequences use')} this schedule.</p>
        <div class="nx-breakdown" aria-live="polite"><dl class="nx-rows" aria-busy="true" aria-label="Loading">${Array.from({ length: Math.min(4, n) }, () => '<div class="nx-row"><dt><span class="react-loading-skeleton nx-skel-l"></span></dt><dd><span class="react-loading-skeleton"></span></dd></div>').join('')}</dl></div>
        <div class="st-blocked" role="status"><img src="${NX.IMG('info-circle-blue.svg')}" alt=""><p>You can't delete a schedule while sequences use it. Move ${n === 1 ? 'it' : 'them'} to another schedule first, then delete this one.</p></div>
      </div>`);
    const ctrl = nxDialog({ title: `Delete the schedule ${q(s.name)}?`, tone: 'danger', body: wrap, primaryLabel: 'Delete schedule', primaryDisabled: true, onPrimary() {} });
    ctrl.primaryBtn.classList.add('nx-new');
    const box = wrap.querySelector('.nx-breakdown');
    const delay = BD != null ? BD : (S.breakdown === 'slow' ? 2000 : S.breakdown === 'fail' ? 1200 : 500);
    setTimeout(() => {
      if (!ctrl.el.isConnected) return;
      if (S.breakdown === 'fail') { box.innerHTML = `<p class="nx-loadfail"><img src="${NX.IMG('info-circle-blue.svg')}" alt="">We couldn't load which sequences. Open each sequence's settings to check its schedule.</p>`; return; }
      const shown = s.seqs.slice(0, 3);
      box.innerHTML = `<dl class="nx-rows">${shown.map(([nm, st]) => `<div class="nx-row"><dt>${esc(nm)}</dt><dd class="st-status">${st}</dd></div>`).join('')}${n > 3 ? `<div class="nx-row nx-sub"><dt>And ${n - 3} more</dt><dd></dd></div>` : ''}</dl>`;
    }, delay);
    return ctrl;
  }

  /* ───────── 30. Delete tracking domain ───────── */
  function openDeleteDomain(dm) {
    const remove = () => {
      DOMAINS = DOMAINS.filter((x) => x.id !== dm.id);
      if (dm.isDefault && DOMAINS.length) { const nx = DOMAINS.find((x) => x.valid) || DOMAINS[0]; nx.isDefault = true; nx.accounts = nx.accounts.concat(dm.accounts); }
      render();
    };
    if (today()) {
      return ST_TODAY.confirmOld({
        title: 'Do you want to delete this custom domain?',
        contents: dm.isDefault ? ['You are trying to delete default custom tracking domain, upon deleting this system will set new default custom tracking domain.', 'Deleting a custom tracking domain can harm your email deliverability.'] : ['Deleting a custom tracking domain can harm your email deliverability.'],
        onSubmit: (api) => todaySubmit(api, () => { remove(); nxToast({ message: 'Custom domain deleted successfully.' }); }, 'Something went wrong. Please try again.'),
      });
    }
    const nextDefault = DOMAINS.find((x) => x.id !== dm.id && x.valid);
    const fallback = dm.isDefault ? (nextDefault ? nextDefault.domain : 'Saleshandy\'s shared tracking domain') : (DOMAINS.find((x) => x.isDefault) || {}).domain;
    const N = dm.accounts.length;
    return nxImpactDialog(dlg({
      title: `Delete the tracking domain ${q(dm.domain)}?`, tone: 'danger',
      rows: [
        { key: 'accounts', label: 'Email accounts that use it', value: N },
        { key: 'seq', label: 'Active sequences sending from them', value: dm.activeSeq, sub: true },
      ],
      sentence: (r) => (r.key === 'accounts' ? `${fmt(r.value)} email ${plural(r.value, 'account uses', 'accounts use')} it.` : ''),
      note: N ? (dm.isDefault && nextDefault ? `It's your default domain, so ${esc(nextDefault.domain)} becomes the default.` : null) : 'No email account uses it.',
      consequence: N ? `Open and click tracking in their emails moves to ${esc(fallback)}, which can hurt deliverability. This can't be undone.` : 'This can\'t be undone.',
      primaryLabel: 'Delete domain',
      failMessage: { title: `We couldn't delete ${esc(dm.domain)}.`, body: GENERIC_FAIL },
      onConfirm: () => { remove(); nxToast({ message: `Deleted ${esc(dm.domain)}` }); },
    }));
  }

  /* ───────── 31. Disconnect CRM, disconnect HeyReach ───────── */
  function openDisconnectCRM(app) {
    const label = app.label || app.name;
    const off = () => { app.connected = false; render(); };
    if (today()) { off(); return null; } // integrations.tsx L340-363: no confirmation, no message
    const wf = app.workflows;
    const list = wf.slice(0, -1).join(', ') + ' and ' + wf[wf.length - 1];
    return nxImpactDialog(dlg({
      title: `Disconnect ${label}?`, tone: 'primary',
      rows: [{ key: 'wf', label: 'Workflows that stop', value: wf.length }],
      sentence: (r) => `${fmt(r.value)} ${plural(r.value, 'workflow stops', 'workflows stop')}: ${list}.`,
      consequence: `Saleshandy stops sending activity to ${label} and stops importing contacts at once. Prospects already imported stay, and your field mappings are kept. If you reconnect, you turn each workflow on again.`,
      primaryLabel: `Disconnect ${label}`,
      failMessage: { title: `We couldn't disconnect ${label}.`, body: `${label} didn't respond and nothing changed. Try again in a minute.` },
      onConfirm: () => { off(); nxToast({ message: `Disconnected ${label}` }); },
    }));
  }
  function openDisconnectLI(p) {
    const off = () => { p.connected = false; S.liDetail = null; render(); };
    if (today()) {
      return ST_TODAY.liDisconnect({ name: p.name, onSubmit: (api) => todaySubmit(api, off, `Failed to disconnect ${p.name}.`) });
    }
    return nxImpactDialog(dlg({
      title: `Disconnect ${p.name}?`, tone: 'danger', icon: NX.IMG('info-circle-red.svg'),
      rows: [
        { key: 'seq', label: `Sequences with a ${p.name} step`, value: p.seqs },
        { key: 'waiting', label: `Prospects waiting on a ${p.name} step`, value: p.waiting },
      ],
      sentence: (r) => (r.key === 'seq' ? `${fmt(r.value)} ${plural(r.value, 'sequence has', 'sequences have')} a ${p.name} step.` : `${fmt(r.value)} ${plural(r.value, 'prospect is', 'prospects are')} waiting on a ${p.name} step.`),
      note: !p.seqs ? `No sequence has a ${p.name} step.` : null,
      consequence: `${p.seqs ? `Those steps stop sending prospects to ${p.name}, and prospects wait there until you reconnect or remove the step. ` : ''}Your API key and field mapping are removed.`,
      primaryLabel: `Disconnect ${p.name}`,
      failMessage: { title: `We couldn't disconnect ${p.name}.`, body: GENERIC_FAIL },
      onConfirm: () => { off(); nxToast({ message: `Disconnected ${p.name}` }); },
    }));
  }

  /* ───────── 32. Reset client password ───────── */
  function openResetPassword(c) {
    if (today()) { // fires on click; a failure is silent (agency-client-list.tsx L230-251)
      setTimeout(() => { if (S.result !== 'fail') nxToast({ message: 'New password sent to your email successfully' }); }, 600);
      return null;
    }
    return nxImpactDialog(dlg({
      title: `Reset the password for ${esc(c.company)}?`, tone: 'danger', icon: NX.IMG('info-circle-red.svg'),
      ...noLookup(`${esc(c.company)} signs in as ${esc(c.email)}.`),
      consequence: `Their current password stops working at once and they're signed out. We email the new password to you at ${MY_EMAIL}, for you to pass on.`,
      primaryLabel: 'Reset password',
      failMessage: { title: `We couldn't reset the password for ${esc(c.company)}.`, body: 'Something went wrong on our side and their password didn\'t change. Try again in a minute.' },
      onConfirm: () => { nxToast({ message: `New password for ${esc(c.company)} sent to your email` }); },
    }));
  }

  /* ───────── screenshot states ───────── */
  function run(state) {
    const U = (id) => USERS.find((x) => x.id === id);
    const confirmSoon = (d, extra = 0) => setTimeout(() => d && d.confirm && d.confirm(), (BD != null ? BD : 500) + 60 + extra);
    const steps = {
      'users-menu': () => { S.menu = 'user:3'; render(); },
      'user-delete': () => openDeleteUser(U(3)),
      'user-delete-invited': () => openDeleteUser(U(7)),
      'user-delete-submit': () => confirmSoon(openDeleteUser(U(3))),
      'user-delete-done': () => confirmSoon(openDeleteUser(U(3))),
      'role-pick-admin': () => openChangeRole(U(3)).pick('admin'),
      'role-open': () => openChangeRole(U(3)),
      'role-owner': () => openChangeRole(U(3)).pick('owner'),
      'role-blocked': () => openChangeRole(U(2)).pick('member'),
      'role-submit': () => { const d = openChangeRole(U(3)); d.pick('admin'); setTimeout(() => d.confirm(), 60); },
      'today-delete-user': () => openDeleteUser(U(3)),
      'today-role': () => openChangeRole(U(3)),
      'field-delete': () => openDeleteField(FIELDS[0]),
      'field-delete-one': () => openDeleteField(FIELDS[1]),
      'field-delete-zero': () => openDeleteField(FIELDS.find((x) => x.values === 0)),
      'field-delete-submit': () => confirmSoon(openDeleteField(FIELDS[0])),
      'schedule-open': () => { S.openSchedule = 11; render(); },
      'schedule-blocked': () => { S.openSchedule = 11; render(); openDeleteSchedule(SCHEDULES[0]); },
      'schedule-blocked-many': () => { S.openSchedule = 12; render(); openDeleteSchedule(SCHEDULES[1]); },
      'schedule-unused': () => { S.openSchedule = 13; render(); openDeleteSchedule(SCHEDULES[2]); },
      'schedule-unused-submit': () => { S.openSchedule = 13; render(); confirmSoon(openDeleteSchedule(SCHEDULES[2]), -500); },
      'today-schedule': () => { S.openSchedule = 11; render(); openDeleteSchedule(SCHEDULES[0]); },
      'today-schedule-4001': () => { S.openSchedule = 11; render(); const d = openDeleteSchedule(SCHEDULES[0]); setTimeout(() => d.el.querySelector('[data-st-submit]').click(), 60); },
      'domain-menu': () => { S.menu = 'domain:21'; render(); },
      'domain-delete-default': () => openDeleteDomain(DOMAINS[0]),
      'domain-delete': () => openDeleteDomain(DOMAINS[1]),
      'domain-delete-unused': () => openDeleteDomain(DOMAINS[2]),
      'today-domain': () => openDeleteDomain(DOMAINS[0]),
      'crm-menu': () => { S.menu = 'crm:Hubspot'; render(); },
      'crm-disconnect': () => openDisconnectCRM(CRMS[2]),
      'crm-disconnect-submit': () => confirmSoon(openDisconnectCRM(CRMS[2])),
      'li-detail': () => { S.liDetail = 'HeyReach'; render(); },
      'li-disconnect': () => { S.liDetail = 'HeyReach'; render(); openDisconnectLI(LINKEDIN[1]); },
      'today-li': () => { S.liDetail = 'HeyReach'; render(); openDisconnectLI(LINKEDIN[1]); },
      'clients-hover': () => { S.hoverClient = 31; render(); },
      'client-reset': () => { S.hoverClient = 31; render(); openResetPassword(CLIENTS[0]); },
      'client-reset-submit': () => { S.hoverClient = 31; render(); confirmSoon(openResetPassword(CLIENTS[0]), -500); },
      'today-client-reset': () => { S.hoverClient = 31; render(); openResetPassword(CLIENTS[0]); },
    };
    const pageOf = (k) => (/^(field-|today-field)/.test(k) ? 'custom-fields' : /^(schedule-|today-schedule)/.test(k) ? 'schedules' : /^(domain-|today-domain)/.test(k) ? 'custom-domain' : /^(crm-|li-|today-li)/.test(k) ? 'integrations' : /client/.test(k) ? 'clients' : 'users');
    if (steps[state]) { go(pageOf(state)); steps[state](); }
  }

  render();
  const st = param('state');
  if (st) setTimeout(() => run(st), 60);
})();
