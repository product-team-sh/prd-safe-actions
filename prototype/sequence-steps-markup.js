/* Production markup for Sequence > Steps and Sequence > Settings, reproduced from webui main aeda4e3:
   sequence-single-header, sequence-single-content (rc-tabs, header actions), sequence-single-steps,
   sequence-single-step-list, single-sequence-step-item, sequence-single-step-header, step variant list/item/
   details/status/statistics/options, sequence-single-step-footer, add-step-button, Banner (smart ideas),
   settings-content, settings-sidebar, sequence-settings (Email Accounts card), sequence-email-accounts-list +
   sequence-email-account-column, esp-component, sequence-schedule-settings, delete-modal (typed "delete"),
   remove-email-warning-modal. Icons are @saleshandy/icons paths. Anything new is marked .nx-new.
   Loaded before sequence-steps.js. */
(function () {
  'use strict';
  const { esc, IMG, h } = NX;
  const svg = (w, paths, cls = '', extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true"${cls ? ` class="${cls}"` : ''}${extra}>${paths}</svg>`;
  const p = (d, rule = true) => `<path fill="currentColor"${rule ? ' fill-rule="evenodd" clip-rule="evenodd"' : ''} d="${d}"/>`;
  const PATH = {
    mail: [p('M5 5.993a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1H5Zm-3 1a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-10Z'), p('M2.168 6.453a1 1 0 0 1 1.387-.278L12 11.805l8.445-5.63a1 1 0 0 1 1.11 1.665l-9 6a1 1 0 0 1-1.11 0l-9-6a1 1 0 0 1-.277-1.387Z')].join(''),
    linkedin: p('M6.824 4.417A2.415 2.415 0 0 1 4.41 6.834 2.415 2.415 0 0 1 2 4.417a2.415 2.415 0 0 1 2.412-2.418 2.415 2.415 0 0 1 2.413 2.418ZM2.329 8.61h4.124V22H2.329V8.61ZM13.092 8.61H8.968V22h4.124v-6.85c0-1.583.504-3.171 2.515-3.171 2.273 0 2.26 2.07 2.25 3.673-.015 2.097.018 4.236.018 6.347H22v-7.066c-.035-4.512-1.132-6.59-4.742-6.59-2.144 0-3.473 1.042-4.165 1.986V8.61Z', false),
    copy: [p('M10 8.992a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-8Zm-3 1a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-8Z'), p('M3.879 3.886A3 3 0 0 1 6 3.008h8a3 3 0 0 1 3 3v2a1 1 0 1 1-2 0v-2a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3v-8a3 3 0 0 1 .879-2.122Z')].join(''),
    trash: [p('M3 7.007a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM10 9.993a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1ZM14 9.993a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1Z'), p('M4.917 6.011a1 1 0 0 1 1.08.913l1 12a1 1 0 0 1 .003.084 1 1 0 0 0 1 1h8a1 1 0 0 0 1-1 1 1 0 0 1 .003-.084l1-12a1 1 0 0 1 1.994.167L19 19.053a3 3 0 0 1-3 2.954H8a3 3 0 0 1-3-2.954L4.004 7.091a1 1 0 0 1 .913-1.08Z'), p('M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v3a1 1 0 1 1-2 0V4h-4v3a1 1 0 0 1-2 0V4a2 2 0 0 1 .586-1.414Z')].join(''),
    pencil: [p('M13.793 4.785a3.828 3.828 0 1 1 5.414 5.415l-10.5 10.5a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.708l10.5-10.5Zm2.707.88c-.485 0-.95.192-1.293.535L5 16.407v2.585h2.586L17.793 8.785a1.828 1.828 0 0 0-1.293-3.12Z'), p('M12.793 5.785a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.415l-4-4a1 1 0 0 1 0-1.415Z')].join(''),
    cross: [p('M18.707 5.293a1 1 0 0 1 0 1.414l-12 12a1 1 0 0 1-1.414-1.414l12-12a1 1 0 0 1 1.414 0Z'), p('M5.293 5.293a1 1 0 0 1 1.414 0l12 12a1 1 0 0 1-1.414 1.414l-12-12a1 1 0 0 1 0-1.414Z')].join(''),
    info: [p('M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z'), p('M11 7.993a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1ZM10 12a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1-1-1Z')].join(''),
    chevronDown: p('M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z'),
    chevronRight: p('M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414Z'),
    gitMerge: [p('M7 17.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM7 5.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM17 11.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z'), p('M7 6.992a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1Z'), p('M7 6.992a1 1 0 0 1 1 1 3 3 0 0 0 3 3h4a1 1 0 1 1 0 2h-4a5 5 0 0 1-5-5 1 1 0 0 1 1-1Z')].join(''),
  };
  const ICON = {
    mail18: (cls) => svg(18, PATH.mail, cls),
    linkedin18: (cls) => svg(18, PATH.linkedin, cls),
    copy20: (cls = '') => svg(20, PATH.copy, cls),
    trash20: (cls) => svg(20, PATH.trash, cls),
    trash16: (cls) => svg(16, PATH.trash, cls),
    pencil16: svg(16, PATH.pencil),
    cross16: svg(16, PATH.cross),
    info: (cls) => svg(16, PATH.info, cls),
    chevronDown16: svg(16, PATH.chevronDown),
    chevronRight16: svg(16, PATH.chevronRight),
    gitMerge18: svg(18, PATH.gitMerge),
    gitMerge20: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" color="#6B7280">${PATH.gitMerge}</svg>`,
  };
  window.SS_ICON = ICON;

  /* 50px page header, left side (sequence-single-header.tsx, sequence-single-title.tsx, switch.tsx) */
  window.SS_HEADER = (seq) => `<div class="p-0"><div class="d-flex header-with-notification"><div class="d-flex justify-content-between align-items-center">
    <div class="single-sequence-header d-flex align-items-center">
      <a class="single-sequence-header--title" href="#">Sequence</a>
      <div class="single-sequence-header--icon">${ICON.chevronRight16}</div>
      <div class="sequence-name"><input class="sequence-name--input" value="${esc(seq)}" maxlength="100" readonly aria-label="Sequence name"><span class="hidden-span">${esc(seq)}</span></div>
      <div id="p-t__active-sequence"><div class="switchToggle switch-small"><input type="checkbox" name="Switch" id="nx-seq-active" checked><label for="nx-seq-active" role="button" tabindex="0" aria-label="Sequence is active"><span></span></label></div></div>
    </div></div></div></div>`;

  /* ───────── Steps ───────── */
  const STEP_BG = { email: '#3B82F6', linkedin: '#178ACF' };
  const letter = (n) => String.fromCharCode(64 + n);
  // formatNumber (sequence-single-content/utils/helper.ts)
  const kfmt = (num) => (num >= 1000 ? `${(num / 1000).toFixed(1)}K`.replace(/\.0K$/, 'K') : String(num));
  function statValue(v, withPct, sent) {
    if (!v) return '<span class="font-14 font-bold gray-txt-15">-</span>';
    const inner = withPct
      ? `<span class="d-flex align-items-center justify-content-center"><span class="font-14 font-bold blue-txt-15">${kfmt(v)}</span><span class="font-12 font-medium gray-txt-15 ml-1">(${sent ? ((v * 100) / sent).toFixed(0) : 0}%)</span></span>`
      : kfmt(v);
    return `<span class="font-14 font-bold blue-txt-15"${v >= 1000 ? ` data-nx-tip="${v.toLocaleString('en-US')}"` : ''}>${inner}</span>`;
  }
  function variantRow(step, v, i, n) {
    const isEmail = step.type === 'email';
    const cls = ['step-sub-list', i === 0 ? 'border-radius-top' : '', i === n - 1 ? 'border-radius-bottom' : ''].filter(Boolean).join(' ');
    const status = n > 1 ? `<div class="step-action" data-nx-tip="Disable variant"><div class="switchToggle switch-small d-flex"><input type="checkbox" name="Switch" checked aria-label="Variant ${letter(i + 1)} is enabled"><label for="Switch" role="button" tabindex="0"><span></span></label></div></div>` : '';
    const subject = isEmail ? (v.subject || '&lt;sending as a same thread&gt;') : 'LinkedIn Connection Request';
    const emailType = step.number !== 1 && isEmail
      ? `<div class="step-email-type"><div class="step-email-type-icon"><i class="sh-${v.subject ? 'send' : 'corner-down-right'} gray-txt-11"></i></div><span class="gray-txt-11 step-email-type-text">${v.subject ? 'New thread' : 'Reply'}</span></div>` : '';
    const stats = isEmail ? `<div class="state-row">
        <div class="state-block">${statValue(v.sent, false)}<small class="gray-txt-15">Sent</small></div>
        <div class="state-block">${statValue(v.open, true, v.sent)}<small class="gray-txt-15">Opened</small></div>
        <div class="state-block">${statValue(v.reply, true, v.sent)}<small class="gray-txt-15">Replied</small></div></div>` : '';
    const ai = isEmail ? `<div class="option" role="button" tabindex="0" data-nx-tip="Generate AI optimized email using variant ${letter(i + 1)}"><img src="${IMG('stars.svg')}" alt="stars" width="20" height="20" class="shd-image-icon "></div>` : '';
    return `<div class="${cls}">
      <div class="step-sub-list-left">${status}<span class="step-sub-icon">${letter(i + 1)}</span>
        <div class="step-sub-desc" role="button" tabindex="0"><p>${subject}</p><p class="m-0 d-flex align-items-center"><span>${esc(v.body)}</span></p></div></div>
      <div class="step-sub-list-right">${emailType}${stats}
        <div class="grid-action">${ai}
          <div class="option" role="button" tabindex="0" data-nx-tip="Clone variant">${ICON.copy20('false')}</div>
          <div class="option" role="button" tabindex="0" data-nx-tip="Delete variant">${ICON.trash20('gray-txt-11')}</div>
        </div></div></div>`;
  }
  function stepHeader(step, proposed) {
    const isEmail = step.type === 'email';
    const icon = isEmail ? ICON.mail18('gray-txt-1') : ICON.linkedin18('gray-txt-1');
    const priority = isEmail ? '' : '<div class="ml-3"><div class="priority undefined" style="background-color: rgb(239, 246, 255); color: rgb(59, 130, 246);"><p class="font-12 font-medium">Normal</p></div></div>';
    const sendingAs = !isEmail ? 'Scheduling Linkedin Connection task on'
      : step.number === 1 && step.variants[0].subject ? 'Sending as a new email on'
        : step.variants[0].subject ? 'Sending as a new thread on' : 'Sending as the same thread on';
    const msgIcon = isEmail && !step.variants[0].subject ? IMG('arrow-forward.svg') : IMG('send-grey.svg');
    const message = step.number === 1 ? 'if activated today' : `if step ${step.number - 1} is sent on ${step.prevDate}`;
    return `<div class="step-list"><div class="d-flex justify-content-between align-items-center mt-3 step-wrap">
      <div class="d-flex align-items-center">
        <div class="step-type-icon" style="background-color: ${STEP_BG[step.type]};">${icon}</div>
        <div class="step-title"><span class="semibold-1 popover-arrow-color-txt">Step ${step.number}</span></div>
        ${priority}
        <div class="step-tentative-date d-flex align-items-center ml-2"><img src="${msgIcon}" class="mr-1" alt=""><p class="m-0 font-12 font-medium gray-txt-12">${sendingAs} <span class="blue-txt-15 font-semibold">${step.date}</span>, ${message}.</p>
          <img src="${IMG('info-circle.svg')}" class="ml-1" alt="" data-nx-tip="This is a tentative date for scheduling tasks or emails in this step, assuming you add prospects today. The actual date may change as per the attached schedule, sending quota &amp; other ongoing sequences."></div>
      </div>
      <div class="step-actions-wrapper">
        <div class="step-id" role="button" tabindex="0" data-nx-tip="Click to Copy Step Id"><code>${step.hashId}</code></div>
        <div class="step-action-icon" role="button" tabindex="0" aria-label="Delete step ${step.number}" data-nx-tip="Delete step" data-ss-delete-step="${step.id}"><i class="sh-trash"></i></div>
      </div></div></div>`;
  }
  function stepItem(step, proposed) {
    const n = step.variants.length;
    const footer = `<div class="add-variation d-flex align-items-center ">
      ${step.type === 'email' ? `<div class="d-flex align-items-center ai-variant cr-variant false" role="button" tabindex="0" data-nx-tip="Generate AI optimized email using variant A"><img src="${IMG('stars.svg')}" width="16" height="16" alt="stars" class="shd-image-icon"><span class="ml-1 btn-text">Generate AI variant</span></div>` : ''}
      <div class="d-flex align-items-center popover-arrow-color-txt cr-variant false" role="button" tabindex="0" data-nx-tip="Create variant manually">${ICON.pencil16}<span class="ml-1 regular-2 font-medium mr-2 btn-text">Create variant</span></div></div>`;
    return `<li><div class="st"><div class="drag" style="user-select: none;">
      <div class="d-flex align-items-center position-relative"><div class="dnd-icon-wrapper"><img src="${IMG('grip-vertical.svg')}" alt="grip-vertical"></div>${stepHeader(step, proposed)}</div>
      <div class="step-sub-list-inner">${step.variants.map((v, i) => variantRow(step, v, i, n)).join('')}</div>
      ${footer}
    </div></div></li>`;
  }
  const NUDGE = { 1: "Add a follow-up step to increase your sequence's reply rate by 40%.", 2: 'Often it’s the follow-up that makes prospects reply. Let\'s add one more step.', 3: 'Add one more follow-up step to further increase the reply rates.' };
  function stepsPane(d) {
    if (!d.steps.length) {
      return '<div class="steps-list-container container-fluid"><div class="nx-ss-empty"><span class="semibold-2 popover-arrow-color-txt">No steps left</span><span class="regular-2 gray-txt-15 mt-2">Not part of this prototype: production shows its empty steps screen here.</span></div></div>';
    }
    const days = [];
    d.steps.forEach((s) => { let g = days.find((x) => x.day === s.absDay); if (!g) { g = { day: s.absDay, steps: [] }; days.push(g); } g.steps.push(s); });
    const list = days.map((g) => `<div class="step-day-wrap d-flex justify-content-center mt-3"><span class="semibold-1 popover-arrow-color-txt">Day ${g.day}</span></div>
      <div style="position: relative;">${g.steps.map((s) => stepItem(s, d.proposed)).join('')}</div>`).join('');
    const nudge = d.steps.length <= 3 ? `<div><div role="alert" class="fade danger-alert alert show smart-ideas alert-warning-2" data-banner="true"><div class="d-flex align-items-center undefined"><img src="${IMG('smart-ideas.svg')}" alt="sh-smart-ideas-icon/"><span class="alert-message-text">${NUDGE[d.steps.length]}</span></div></div></div>` : '<div></div>';
    return `<div class="steps-list-container container-fluid"><div class="step-list-inner"><ul>${list}</ul>
      <div class="pl-4 z-idx-1 position-relative py-3"><div class="d-flex align-items-center">
        <div class="add-steps position-relative"><div class="d-flex start-sequence-modal-btn"><button type="button" class="shd-button shd-button--primary" data-ss-noop><span><span class="regular-2 font-medium">Add Step</span></span></button></div></div>
        <button type="button" class="shd-button shd-button--primary create-subsequence-btn" aria-label="Add Conditional Followup Step" data-nx-tip="Add Conditional Followup Step" data-ss-noop><span>${ICON.gitMerge20}</span></button>
      </div>${nudge}</div></div></div>`;
  }

  /* ───────── Settings ───────── */
  const SIDEBAR = ['Email Account', 'ESP Matching', 'Sending Schedule', 'Safety Settings', 'Sending Priority', 'Deal Value', 'Email Verification', 'Cc & Bcc', 'Unsubscribe'];
  const PROVIDER = { gmail: `<img src="${IMG('google-icon.svg')}" alt="google" class="shd-image-icon">`, microsoft: `<img src="${IMG('microsoft-logo-small.svg')}" alt="microsoft" class="shd-image-icon">` };
  function accountRow(a, d) {
    const tags = a.tags.length
      ? `<div class="prospect-tag-row">${a.tags.map((t) => `<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2 d-flex"><span class="">${esc(t)}</span></span></div></div>`).join('')}</div>`
      : '<div class="prospect-tag-row">-</div>';
    const [fn, ln] = a.owner.split(' ');
    // Today: Cross icon, tooltip "Remove email". Proposed: trash (spec B: a remove action never uses an X).
    const action = d.proposed
      ? `<div class="gray-txt-15 regular-3 pointer nx-ss-remove nx-new" role="button" tabindex="0" aria-label="Remove ${esc(a.email)} from this sequence" data-nx-tip="Remove from sequence" data-ss-remove="${a.id}">${ICON.trash16('')}</div>`
      : `<div class="gray-txt-15 regular-3 pointer" role="button" tabindex="0" aria-label="Remove email" data-nx-tip="Remove email" data-ss-remove="${a.id}">${ICON.cross16}</div>`;
    return `<tr>
      <td class="sequence-settings--email-address"><div class="d-flex flex-column"><div class="d-flex"><span class="regular-2 font-medium popover-arrow-color-txt mr-2">${esc(a.name)}</span>${PROVIDER[a.provider]}</div>
        <div class="d-flex align-items-center"><span class="regular-1 gray-txt-15 mr-1">${esc(a.email)}</span><div data-nx-tip="Email account is connected"><div class="sequence-status d-flex align-items-center"><div class="sequence-status-badge"><span class="badge-dot-success badge"></span></div><p class="text-capitalize sequence-progress mb-0"></p></div></div></div></div></td>
      <td class="tag-detail">${tags}</td>
      <td class="sequence-settings--email-address" style="text-align: left;"><span class="hover-underline blue-txt-11 regular-2 font-medium pointer" role="button" tabindex="0">${a.signature ? 'View' : 'Add'}</span></td>
      <td class="sequence-settings--email-address"><span>${a.activeSequences}</span></td>
      <td class="sequence-settings--email-limit"><span class="hover-underline blue-txt-11 regular-2 font-medium pointer" role="button" tabindex="0" data-nx-tip="Daily sending limit: ${a.limit}&#10;Used today: ${a.limit - a.available}&#10;Remaining: ${a.available}">${a.available}/${a.limit}</span></td>
      <td class="sequence-settings--email-address"><span class="hover-underline blue-txt-11 regular-2 font-medium pointer" role="button" tabindex="0">${a.score}/100</span></td>
      <td class="sequence-settings--owner"><div data-nx-tip="${esc(a.owner)}"><div class="shd-avatar shd-avatar--sm pointer"><span>${fn[0]}${ln[0]}</span></div></div></td>
      <td class="sequence-settings--action">${action}</td>
    </tr>`;
  }
  function settingsPane(d) {
    const active = d.accounts.length;
    const on = active > 1;
    const th = (t, style = '') => `<th tabindex="0"${style ? ` style="${style}"` : ''}><div class="d-flex"><span class="semibold-1 gray-txt-12">${t}</span></div></th>`;
    const table = d.accounts.length
      ? `<div class="mt-4"><div class="table-list sequence-email-account-table-list"><div class="bs-table bs-table-small"><div class="bs-table-container"><div class="bs-table-content"><div class="react-bootstrap-table"><table class="table table-organism">
          <thead class="table-organism-header "><tr>${th('Sender Email')}${th('Tags', 'text-align: left;')}${th('Signature')}${th('Active Sequence')}${th('Daily Limit')}${th('Setup Score')}${th('Owner')}${th('')}</tr></thead>
          <tbody class="table-organism-body sequence-email-account-table-body ">${d.accounts.map((a) => accountRow(a, d)).join('')}</tbody>
        </table></div></div></div></div></div></div>`
      : `<div class="mt-4"></div><div class="d-flex flex-column align-items-center"><span class="semibold-2 popover-arrow-color-txt">No email account added</span><span class="regular-2 gray-txt-15 mt-2">Add email account to activate this sequence and send emails.</span><button type="button" class="shd-button shd-button--secondary bs-mt-20" data-ss-noop><span>Add email account</span></button></div>`;
    return `<div class="settings-content d-flex h-100">
      <div class="settings-content__left-container"><div class="sequence-settings-sidebar">${SIDEBAR.map((l, i) => `<div role="button" class="sequence-settings-sidebar__item ${i === 0 ? 'active' : 'false'}" tabindex="0"><span class="regular-1 font-medium ${i === 0 ? 'semibold-1 blue-txt-11' : 'gray-txt-15'}">${esc(l)}</span></div>`).join('')}</div></div>
      <div id="scrollDiv" class="settings-content__right-container w-100 ml-4"><div>
        <div class="card mt-4" id="email-accounts"><div class="card-body">
          <div class="d-flex justify-content-between"><div class="d-flex flex-column">
            <span class="sequence-setting-title d-flex align-items-center">Email Accounts
              <span class="sender_rotation_heading modal-text d-flex justify-content-center align-items-center font-semibold ${on ? 'green-txt-13' : 'gray-txt-11 '}" data-nx-tip="${on ? 'Sender Rotation is Active! Your outreach is scaled up. Well done! ' : 'Sender Rotation is Inactive. Add two email accounts to a sequence to enable it. It&#39;s your move!'}"><span class="sender_rotation_heading_dot d-inline-block ${on ? 'green-13' : 'gray-11'}"></span>Sender Rotation</span></span>
            <span class="sequence-setting-description">${on ? 'Add more email accounts to make most of sender rotation' : 'Add two or more active email accounts to enable sender rotation'}</span>
          </div>${d.accounts.length ? '<button type="button" class="shd-button shd-button--link" data-ss-noop><span>+ Add more email accounts</span></button>' : ''}</div>
          ${table}
        </div></div>
        <div class="mt-4" id="esp-matching"><div class="card"><div class="card-body">
          <div class="d-flex flex-row align-items-center"><span class="sequence-setting-title">Email Service Provider (ESP) Matching</span><span data-nx-tip="Improves email deliverability for Google &amp; Microsoft accounts.">${ICON.info('esp-matching-tooltip-icon')}</span></div>
          <div class="esp-matching-switch-wrapper disabled"><div class="switchToggle switch-small sequence-settings-switch sequence-setting-tab-switch"><input type="checkbox" name="Switch" aria-label="Automatically match sender ESP with prospect's ESP"><label for="Switch" role="button" tabindex="0"><span>Automatically match sender ESP with prospect's ESP</span></label></div></div>
        </div></div></div>
        <div class="mt-4" id="schedule-settings"><div class="card"><div class="card-body d-flex justify-content-between">
          <div class="d-flex flex-column"><span class="sequence-setting-title">Sending Schedule</span><span class="sequence-setting-description">Choose the schedule for sending emails from this sequence.</span></div>
          <div class="d-flex align-items-center"><div class="bs-select-box" tabindex="0"><div class="bs-select-box-text"><span>Weekdays, 9 AM to 5 PM IST</span></div><div class="bs-select-box-icon-wrapper">${ICON.chevronDown16}</div></div>
            <div class="info-icon ml-1">${ICON.info('info-circle-schedule')}</div></div>
        </div></div></div>
      </div></div>
    </div>`;
  }

  /* Whole tab area: rc-tabs with Steps and Settings panes (sequence-single-content.tsx) */
  window.SS_PAGE = (d) => {
    const tab = (key, label, count, extraId) => {
      const on = d.tab === key;
      const inner = `<div class="sequence-single-tab--label"><span class="label-text">${label}</span>${count ? `<div class="tab-count"><span class="regular-1 font-medium gray-txt-15">${count}</span></div>` : ''}</div>`;
      return `<div class="bs-tabs-tab${on ? ' bs-tabs-tab-active' : ''}"><div role="tab" aria-selected="${on}" class="bs-tabs-tab-btn" tabindex="0"${key ? ` data-ss-tab="${key}"` : ' data-ss-noop'}>${extraId ? `<div id="${extraId}">${inner}</div>` : inner}</div></div>`;
    };
    const extra = d.tab === 'steps'
      ? '<div class="steps-top-action"><div class="add-steps position-relative"><div class="d-flex start-sequence-modal-btn"><button type="button" class="shd-button shd-button--primary" data-ss-noop><span><span class="regular-2 font-medium">+ Add Step</span></span></button></div></div></div>'
      : '<div class="steps-top-action"></div>';
    return `<div class="sequence-container p-0 container-fluid"><div class="sequence-components"><div class="single-sequence-tab-container"><div class="custom-tab-container custom-tab-container-lg onboardingCompleted">
      <div id="sequence-single-tabs" class="bs-tabs bs-tabs-top bs-tabs-small">
        <div role="tablist" class="bs-tabs-nav"><div class="bs-tabs-nav-wrap"><div class="bs-tabs-nav-list" style="transform: translate(0px, 0px);">
          ${tab('steps', 'Steps', d.steps.length)}
          ${tab('', 'Prospects', d.prospects, 'p-t__sequence-prospects-tab')}
          ${tab('', 'Emails', 0)}
          ${tab('settings', 'Settings', 0, 'p-t__sequence-settings-tab')}
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0" data-ss-noop><div class="sequence-single-tab--label"><div class="tab-separator"></div><span class="label-container "><span class="label-icon d-flex">${ICON.gitMerge18}</span><span class="label-text">Subsequence</span></span></div></div></div>
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0" data-ss-noop><div class="sequence-score-header__hover-container"><div class="d-flex align-items-center pointer sequence-score-header__hover-txt false"><div class="mr-2 hover-text">
            <svg class="circular-progressbar" viewBox="0 0 100 100" width="1.75rem" height="1.75rem" aria-hidden="true"><path class="circular-progressbar-trail" d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke-width="8" fill-opacity="0" style="stroke: #D1FAE5;"></path><path class="circular-progressbar-path" d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke-width="8" fill-opacity="0" style="stroke: #2DB482; stroke-linecap: round; stroke-dasharray: 289.027px, 289.027px; stroke-dashoffset: 80.927px;"></path><text class="circular-progressbar-text" x="50" y="50" style="fill: #2DB482; font-size: 2.5rem; font-weight: 600; dominant-baseline: central; text-anchor: middle;">72</text></svg>
            </div><span class="regular-2 font-medium line-height-20 gray-txt-15 sequence-score__text">Sequence Score</span></div></div></div></div>
          <div class="bs-tabs-ink-bar bs-tabs-ink-bar-animated" data-ss="ink"></div>
        </div></div>
        <div class="bs-tabs-extra-content"><div class="sequence-single-header-action">${extra}</div></div>
        </div>
        <div class="bs-tabs-content-holder"><div class="bs-tabs-content bs-tabs-content-top"><div role="tabpanel" tabindex="0" aria-hidden="false" class="bs-tabs-tabpane bs-tabs-tabpane-active">
          ${d.tab === 'steps' ? stepsPane(d) : settingsPane(d)}
        </div></div></div>
      </div></div></div></div></div>`;
  };

  /* ───────── Today's dialogs, production markup and copy ───────── */
  function mount(root, onEsc) {
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape' && onEsc) { e.preventDefault(); onEsc(); } }
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(root);
    return close;
  }
  const loader = '<div class="shd-loader" aria-hidden="true"><div></div><div></div><div></div><div></div></div>';

  /* delete-modal.tsx via delete-step-modal.tsx: header "Do you want to delete this {type}  step?", typed "delete",
     buttons Cancel (outlined) + Yes (primary). Backdrop static and no onHide, so Esc and outside clicks do nothing. */
  window.SS_TODAY_DELETE_STEP = ({ typeLabel, onSubmit, submitDelay = 900, fail }) => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="contained-modal-title-vcenter" class="fade bs-modal-container confirm-modal-width modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container"><div class="bs-modal-body modal-body">
          <form novalidate>
            <div class="bs-modal-content"><div class="bs-modal-icon icon-error"><i class="sh-info"></i></div>
              <div class="bs-modal-inner-content"><h3 id="contained-modal-title-vcenter">Do you want to delete this ${typeLabel}  step?</h3>
                <p class="bs-mt-15">If you delete the step, you will permanently lose your step data.</p>
                <p class="bs-mt-20 bs-mb-10">Confirm by typing <span class="red-txt-5">delete</span> below.</p>
                <div data-ss="field"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default bs-mb-20"><input name="confirm" autocomplete="off" class="bs-input-md bs-input" value="" aria-label="Type delete to confirm"></span></div>
              </div></div>
            <div class="d-flex justify-content-end"><button type="button" class="bs-mr-5 cancel-btn btn-solid btn-solid-outlined btn-solid-md">Cancel</button><button type="submit" class="font-medium submit-btn btn-solid btn-solid-primary btn-solid-md">Yes</button></div>
          </form></div></div></div></div></div></div>`);
    const field = root.querySelector('[data-ss="field"]');
    let input = root.querySelector('input');
    let error = '';
    // Input atom: with a caption it is wrapped in .bs-input-container.input-error-container and the caption is a label
    const paint = () => {
      const v = input.value;
      field.innerHTML = error
        ? `<div class="bs-input-container input-error-container bs-mb-20"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-error"><input name="confirm" autocomplete="off" class="bs-input-md bs-input" aria-label="Type delete to confirm" aria-invalid="true"></span><label class="bs-input-label-suffix">${error}</label></div>`
        : '<span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default bs-mb-20"><input name="confirm" autocomplete="off" class="bs-input-md bs-input" aria-label="Type delete to confirm"></span>';
      input = field.querySelector('input'); input.value = v; wire();
    };
    let dirty = false;
    function wire() {
      input.addEventListener('input', () => { dirty = true; });
      input.addEventListener('blur', (e) => { if (e.relatedTarget && e.relatedTarget.classList.contains('cancel-btn')) return; if (dirty) { const nv = input.value !== 'delete' ? 'Invalid confirmation input' : ''; if (nv !== error) { error = nv; paint(); } } });
    }
    wire();
    const close = mount(root, null);
    const [cancel, yes] = root.querySelectorAll('.d-flex.justify-content-end button');
    cancel.addEventListener('click', close);
    root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const nv = input.value !== 'delete' ? 'Invalid confirmation input' : '';
      if (nv !== error) { error = nv; paint(); }
      if (error) return;
      yes.disabled = true; yes.innerHTML = `${loader}<span>Yes</span>`;
      setTimeout(() => { close(); onSubmit(!fail); }, submitDelay);
    });
    setTimeout(() => input.focus(), 0);
    return { close, root, type: (txt) => { input.value = txt; dirty = true; input.dispatchEvent(new Event('blur')); }, submit: () => root.querySelector('form').requestSubmit() };
  };

  /* remove-email-warning-modal.tsx: shown only when row.isAnySequenceMailSent. Account not named. */
  window.SS_TODAY_REMOVE_EMAIL = ({ onSubmit, submitDelay = 900 }) => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="contained-modal-title-vcenter" class="fade bs-modal-container link-track-nudge-user-modal modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-header modal-header"><div class="modal-title h4" id="contained-modal-title-vcenter"><div class="d-flex"><img src="${IMG('info-circle-yellow.svg')}" alt="icon" class="shd-image-icon"><span class="pl-2">Are you sure you want to remove this email account?</span></div></div>
            <button type="button" class="close btn-solid btn-solid-default btn-solid-md" aria-label="Close"><i class="sh-close"></i></button></div>
          <div class="bs-modal-body modal-body"><div class="mt-3">
            <p class="regular-2 popover-arrow-color-txt">Removing this email account from the sequence may affect reply and bounce tracking for the emails sent from this email account. Any follow-up email scheduled from this email account in this sequence will also be interrupted.</p>
            <p class="regular-2 popover-arrow-color-txt">Are you sure you want to proceed?</p></div></div>
          <div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;"><button type="button" class="btn-ghost btn-ghost-primary btn-ghost-md">Cancel</button><button type="button" class="btn-solid btn-solid-primary btn-solid-md">Remove Email Account</button></div></div>
        </div></div></div></div></div>`);
    const close = mount(root, () => close());
    const modal = root.querySelector('.modal');
    modal.addEventListener('mousedown', (e) => { if (e.target === modal || e.target.classList.contains('modal-dialog')) close(); });
    root.querySelector('.close').addEventListener('click', close);
    const [cancel, ok] = root.querySelectorAll('.bs-modal-footer-action-buttons button');
    cancel.addEventListener('click', close);
    ok.addEventListener('click', () => {
      ok.disabled = true; ok.innerHTML = `${loader}<span>Remove Email Account</span>`;
      setTimeout(() => { close(); onSubmit(); }, submitDelay);
    });
    return { close, root, submit: () => ok.click() };
  };
})();
