/* Production markup for the Sequence list, reproduced from webui main aeda4e3:
   sequence.tsx, sequence-list.tsx, sequence-list-content.tsx, sequence-list-filter-bar.tsx (search, client filter,
   TeamsFilter, status Select, Pause/Resume icons, "Delete N sequences"), sequence-list-table.tsx (shd Alert selection
   banner, organisms/table columns), SequenceNameField, Switch, CircularProgressBar, initials Avatar,
   shared/modals/pause-resume-sequence-modal, sequence-action-report-modal, delete-modal.
   Anything new is marked .nx-new. Loaded before sequence-list.js. */
(function () {
  'use strict';
  const { fmt, h, esc, IMG } = NX;
  const sv = (size, body, cls = '', vb = '0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="${vb}" role="img" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${body}</svg>`;
  const P = (d) => `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="${d}"/>`;
  /* @saleshandy/icons (tabler based), as filled paths */
  const ICON = {
    chevronDown: (s = 16, cls = '') => sv(s, P('M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z'), cls),
    user: sv(16, P('M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM7 7a5 5 0 1 1 10 0A5 5 0 0 1 7 7Zm3 8a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0v-2a3 3 0 0 0-3-3h-4Z')),
    briefcase: sv(16, P('M5 8a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5ZM2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9Z') + P('M10 4a1 1 0 0 0-1 1v2a1 1 0 0 1-2 0V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2a1 1 0 1 1-2 0V5a1 1 0 0 0-1-1h-4ZM12 11a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1Z') + P('M2.106 12.553a1 1 0 0 1 1.341-.447 19 19 0 0 0 17.106 0 1 1 0 0 1 .894 1.788 21 21 0 0 1-18.894 0 1 1 0 0 1-.447-1.341Z')),
    users: sv(16, P('M9 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM4 7a5 5 0 1 1 10 0A5 5 0 0 1 4 7Zm3 8a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0v-2a3 3 0 0 0-3-3H7ZM15.031 3.178a1 1 0 0 1 1.217-.72 5 5 0 0 1 0 9.687 1 1 0 0 1-.496-1.938 3 3 0 0 0 0-5.812 1 1 0 0 1-.72-1.217ZM17.032 15.25a1 1 0 0 1 1.218-.718A5 5 0 0 1 22 19.358V21a1 1 0 1 1-2 0v-1.64a3 3 0 0 0-2.25-2.893 1 1 0 0 1-.718-1.218Z')),
    mail: sv(16, P('M5 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5ZM2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7Z') + P('M2.168 6.445a1 1 0 0 1 1.387-.277L12 11.798l8.445-5.63a1 1 0 1 1 1.11 1.664l-9 6a1 1 0 0 1-1.11 0l-9-6a1 1 0 0 1-.277-1.387Z')),
    mailOpened: sv(16, P('M11.445 2.168a1 1 0 0 1 1.11 0l9 6A1 1 0 0 1 22 9v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a1 1 0 0 1 .445-.832l9-6ZM4 9.535V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.535l-8-5.333-8 5.333Z') + P('M2.168 8.445a1 1 0 0 1 1.387-.277L12 13.798l8.445-5.63a1 1 0 1 1 1.11 1.664l-9 6a1 1 0 0 1-1.11 0l-9-6a1 1 0 0 1-.277-1.387Z')),
    arrowBackUp: sv(16, P('M9.707 3.293a1 1 0 0 1 0 1.414L6.414 8H15a6 6 0 0 1 0 12h-1a1 1 0 1 1 0-2h1a4 4 0 0 0 0-8H6.414l3.293 3.293a1 1 0 1 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z')),
    like: sv(16, P('M13 5a1 1 0 0 0-1 1v1a5 5 0 0 1-4 4.9V17a2 2 0 0 0 2 2h7c.087.007.238-.017.43-.21.2-.199.396-.54.508-1.007l.974-4.869A1 1 0 0 0 18 12h-3a1 1 0 0 1-1-1V6a1 1 0 0 0-1-1Zm-5.4 15.2A2 2 0 0 1 6 21H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3a3 3 0 0 0 3-3V6a3 3 0 0 1 6 0v4h2a3 3 0 0 1 3 3l-.02.197-1 5c-.177.752-.524 1.46-1.044 1.98-.518.517-1.207.84-1.967.791H10a4 4 0 0 1-2.4-.8ZM6 12H4v7h2v-7Z')),
    arrowUpRight: sv(16, P('M6.293 17.707a1 1 0 0 1 0-1.414l10-10a1 1 0 1 1 1.414 1.414l-10 10a1 1 0 0 1-1.414 0Z') + P('M7 7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0V8H8a1 1 0 0 1-1-1Z'), 'arrow-up-right-icon'),
    dotsVertical: sv(20, P('M12 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM12 18a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z')),
    gitMerge: sv(16, P('M7 17.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM7 5.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM17 11.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z') + P('M7 6.992a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1Z') + P('M7 6.992a1 1 0 0 1 1 1 3 3 0 0 0 3 3h4a1 1 0 1 1 0 2h-4a5 5 0 0 1-5-5 1 1 0 0 1 1-1Z')).replace('<svg ', '<svg style="color:#6B7280" '),
    infoCircle: sv(16, P('M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z') + P('M11 8a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1ZM10 12a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1-1-1Z'), 'info-circle-icon'),
    alertTriangle: sv(16, P('M10.24 3.957a2 2 0 0 1 3.52 0l7.003 12.13A2 2 0 0 1 19.003 19H4.997a2 2 0 0 1-1.76-2.913l7.003-12.13ZM12 5l-7.003 12h14.006L12 5Z') + P('M12 8a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1ZM11 15a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z')),
    alertCircle20: sv(20, P('M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z') + P('M12 7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1ZM11 16a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z')).replace('<svg ', '<svg style="color:#faad14" '),
  };
  window.SL_ICON = ICON;

  const checkbox = (attrs, state, extraCls = '') => `<label class="bs-checkbox-wrapper${extraCls ? ' ' + extraCls : ''}"><span class="bs-checkbox${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}><span class="bs-checkbox-inner"></span></span></label>`;
  window.SL_CHECKBOX = checkbox;

  /* SequenceNameField: name link, subsequence count, status badge, steps and dates (shown on row hover) */
  function nameCell(s) {
    const paused = s.progress === 'paused';
    const status = paused
      ? `<div class="sequence-status"><div class="sequence-status-badge"><span class="bs-badge"><sup data-show="true" class="badge-dot-danger"></sup></span></div><p class="sequence-progress"${s.reason ? ` data-nx-tip="${esc(s.reason)}"` : ''}>Paused</p></div>`
      : '<div class="sequence-status d-flex align-items-center"><div class="sequence-status-badge"><span class="bs-badge"><sup data-show="true" class="badge-dot-success"></sup></span></div><p class="text-capitalize sequence-progress mb-0">Active</p></div>';
    const subs = s.subs.length ? `<div class="sequence-subsequence-count" role="button" tabindex="0" data-nx-tip="Subsequences"><span class="d-flex">${ICON.gitMerge}<span class="count">${s.subs.length}</span></span></div>` : '';
    return `<a class="sequence-name-link" href="#" data-sl-noop><div>
      <div class="sequence-name-wrapper"><span class="text-container">${esc(s.title)}</span>${subs}</div>
      <div class="d-flex">${status}<div class="sequence-steps-created-on"><span class="sequence-divider-vertical steps-divider">|</span>${s.steps} Steps ${paused && s.pausedAt ? `<span class="sequence-divider-vertical">|</span>Paused at ${s.pausedAt}` : ''}${!paused ? `<span class="sequence-divider-vertical">|</span>Created on ${s.createdAt}` : ''}</div></div>
    </div></a>`;
  }
  function progressCell(s) {
    const pct = s.pct;
    const on = pct > 0;
    const r = 46; const C = 2 * Math.PI * r;
    const d = `M 50,50 m 0,-${r} a ${r},${r} 0 1 1 0,${2 * r} a ${r},${r} 0 1 1 0,-${2 * r}`;
    return `<div class="d-flex"><div><div class="sequence-progress-col-cell ${on ? '' : 'sequence-disabled-cell'} progress-popover-trigger" role="button" tabindex="0"${on ? ' data-nx-tip="Click to see breakdown"' : ''}>
      <svg class="circular-progressbar" viewBox="0 0 100 100" width="42px" height="42px" aria-hidden="true"><path class="circular-progressbar-trail" d="${d}" stroke-width="8" fill-opacity="0" style="stroke: ${on ? '#bfdbfe' : '#e5e7eb'};"></path><path class="circular-progressbar-path" d="${d}" stroke-width="8" fill-opacity="0" style="stroke: #3b82f6; stroke-linecap: round; stroke-dasharray: ${C}px, ${C}px; stroke-dashoffset: ${((100 - pct) / 100) * C}px;"></path><text class="circular-progressbar-text" x="50" y="50" style="fill: ${on ? '#3b82f6' : '#e5e7eb'}; font-size: 26px; font-weight: 600; dominant-baseline: central; text-anchor: middle;">${Math.round(pct)}%</text></svg>
      <div class="d-flex align-items-center progress-bar-count"><span class="contacted-value">${s.progressed}</span><span class="total-value">/${s.total}</span></div>
    </div></div></div>`;
  }
  const km = (n) => (n > 0 ? (n >= 1000 ? (Math.round(n / 100) / 10).toString().replace(/\.0$/, '') + 'K' : String(n)) : '-');
  const pctS = (n) => (n > 0 ? `(${n}%)` : '');
  function scoreCell(s) {
    if (s.score == null) return '<button type="button" class="shd-button shd-button--link check-score" data-sl-noop><span>Check Score</span></button>';
    const st = s.score <= 30 ? 'poor' : s.score <= 60 ? 'average' : 'excellent';
    return `<div class="sequence-score-badge ${st}" role="button" tabindex="0" data-nx-tip="Your sequence score is ${st[0].toUpperCase() + st.slice(1)}. Click to know more."><span>${s.score}</span></div>`;
  }
  function countLink(v, p, tip) {
    if (!(v > 0)) return '<div>-</div>';
    return `<div role="button" tabindex="0"><span class="count-percentage" data-nx-tip="${tip}"><span class="total-replied-positive-count"><span>${km(v)}</span></span><span><span>${pctS(p)}</span></span></span></div>`;
  }
  function ownerCell(name) {
    const [f, l] = name.split(' ');
    return `<div class="created-by-wrap"><div class="sequence-created-by"><span class="bs-avatar bs-avatar-md bs-avatar-circle light-blue-color sequence-avatar"><span class="bs-avatar-string text-primary">${f[0]}${l[0]}</span></span><span class="owner-name popover-arrow-color-txt ml-2">${esc(name)}</span></div></div>`;
  }
  const switchCell = (s) => `<div class="switchToggle switch-small table-switch sequence-switch" data-nx-tip="${s.progress === 'active' ? 'Pause' : 'Resume'}"><input type="checkbox" name="Switch" id="sl-sw-${s.id}" data-sl-switch="${s.id}"${s.progress === 'active' ? ' checked' : ''}><label for="sl-sw-${s.id}" role="button" tabindex="0" aria-label="${s.progress === 'active' ? 'Pause' : 'Resume'} ${esc(s.title)}"><span></span></label></div>`;

  function pageModel(cur, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '…', last];
    if (cur >= last - 3) return [1, '…', last - 4, last - 3, last - 2, last - 1, last];
    return [1, '…', cur - 1, cur, cur + 1, '…', last];
  }
  function pagination(d) {
    const cur = d.page + 1;
    const li = (n) => (n === cur ? `<li class="page-item active"><span class="page-link">${n}<span class="sr-only">(current)</span></span></li>`
      : `<li class="page-item"><a class="page-link" role="button" href="#" data-sl-page="${n - 1}">${n}</a></li>`);
    const prev = cur === 1 ? '<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-left"></i></span><span class="sr-only">Previous</span></span></li>'
      : '<li class="page-item"><a class="page-link" role="button" href="#" data-sl-page="prev"><span aria-hidden="true"><i class="sh-chevron-left"></i></span><span class="sr-only">Previous</span></a></li>';
    const next = cur === d.pages ? '<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-right"></i></span><span class="sr-only">Next</span></span></li>'
      : '<li class="page-item"><a class="page-link" role="button" href="#" data-sl-page="next"><span aria-hidden="true"><i class="sh-chevron-right"></i></span><span class="sr-only">Next</span></a></li>';
    return `<div class="pagination-container d-flex pagination-container-new"><div class="pagination-row d-flex">
      <div class="pagination-select-count d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt mr-2">Showing</span>
        <div class="bs-select-box" tabindex="0"><div class="bs-select-box-text"><span class="blue-txt-15">${d.pageSize}</span></div><div class="bs-select-box-icon-wrapper">${ICON.chevronDown(16)}</div></div>
        <span class="regular-2 popover-arrow-color-txt ml-2 total-pagination-count">out of ${d.total}</span></div>
      <div class="divider"></div>
      <div class="pagination-page-input d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt mr-2 go-to-page">Go to page:</span><div class="mt-1"><form onsubmit="return false"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default page-number-input"><input type="number" min="1" max="${d.pages}" class="bs-input-md bs-input" value="${cur}" aria-label="Go to page"></span></form></div><span class="regular-2 popover-arrow-color-txt ml-2">/${d.pages}</span></div>
      <ul class="pagination">${prev}${pageModel(cur, d.pages).map(li).join('')}${next}</ul>
    </div></div>`;
  }

  const th = (text, cls = '', icon = '', iconCls = '') => `<th tabindex="0" class="${cls}" style="text-align: left;">${icon ? `<div class="d-flex ${iconCls}">${icon}<span>${text}</span></div>` : `<div><span>${text}</span></div>`}</th>`;

  /* Whole page: .sequence-components > .sequence-list-container (filter bar + table) */
  window.SL_PAGE = (d) => {
    const selOnPage = d.rows.filter(d.isSel).length;
    const head = d.rows.length && selOnPage === d.rows.length ? true : selOnPage ? 'mixed' : false;
    const rows = d.rows.map((s) => `<tr class="${d.isSel(s) ? 'selected-row' : ''}">
        <td class="selection-cell">${checkbox(`data-sl-row="${s.id}" aria-label="Select ${esc(s.title)}"`, d.isSel(s))}</td>
        <td class="sequence-switch-col">${switchCell(s)}</td>
        <td class="sequence-name">${nameCell(s)}</td>
        <td class="sequence-progress-cell">${progressCell(s)}</td>
        <td class="sequence-score-cell">${scoreCell(s)}</td>
        <td class="prospect-col-cell"><div class="d-flex justify-content-between"><div class="prospect-popover-trigger" role="button" tabindex="0"><span class="count" data-nx-tip="Click to see breakdown">${km(s.total)}</span></div><div role="button" tabindex="0" aria-label="Open prospects">${ICON.arrowUpRight}</div></div></td>
        <td class="contacted-col-cell"><span>${km(s.contacted)}</span></td>
        <td class="opened-col-cell"><span class="total-opened-count"><span>${km(s.opened)}</span></span> <span>${pctS(s.openedPct)}</span></td>
        <td class="replied-positive-col-cell">${countLink(s.replied, s.repliedPct, 'Click to see replies in Unified Inbox')}</td>
        <td class="replied-positive-col-cell">${countLink(s.positive, s.positivePct, 'Click to see positive replies in Unified Inbox')}</td>
        <td class="email-accounts-col-cell"><div class="d-flex"><div class="email-accounts-states-overlay-trigger" role="button" tabindex="0"><div data-nx-tip="Click to see breakdown"><span>${s.accounts}</span></div></div></div></td>
        <td><div class="sequence-client-associated-name"><p data-nx-tip="${esc(s.client)}">${esc(s.client)}</p></div></td>
        <td class="sequence-owner">${ownerCell(s.owner)}</td>
        <td style="text-align: right;"><div class="sequence-action"><div class="dropdown-custom dropdown"><button aria-haspopup="true" aria-expanded="false" type="button" class="dropdown-toggle-custom btn btn-dropdown-custom" aria-label="More actions" data-sl-noop>${ICON.dotsVertical}</button></div></div></td>
      </tr>`).join('');

    const filterLeft = `
      <div class="sequence-search-input-wrap"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search here..." class="bs-input-md bs-input" value="" aria-label="Search sequences"></span></div>
      <button type="button" class="shd-button shd-button--tertiary transfer-select-btn btn-white w-1" data-sl-noop><span><div class="transfer-select-btn-content"><div class="select-icon">${ICON.briefcase}</div><span>All clients</span></div><div class="bs-select-box-icon-wrapper">${ICON.chevronDown(16)}</div></span></button>
      <button type="button" class="shd-button shd-button--tertiary transfer-select-btn btn-white w-1" data-sl-noop><span><div class="transfer-select-btn-content"><div class="select-icon">${ICON.user}</div><span>Sequence Owner</span></div><div class="bs-select-box-icon-wrapper">${ICON.chevronDown(16)}</div></span></button>
      <div class="bs-select-box" tabindex="0" role="button" data-sl-noop><div class="bs-select-box-text"><span>Status (All)</span></div><div class="bs-select-box-icon-wrapper">${ICON.chevronDown(16)}</div></div>
      <div class="sl-bulk-host" data-sl="bulk"></div>`;

    const table = `<div class="table-list "><div class="bs-table bs-table-small"><div class="bs-table-container"><div class="bs-table-content"><div class="react-bootstrap-table"><table class="table table-organism">
        <thead class="table-organism-header sequence-table-header"><tr>
          <th class="selection-cell-header" data-row-selection="true" style="width: 20px;">${checkbox('data-sl="check-all" aria-label="Select all on this page"', head)}</th>
          <th tabindex="0" class="sequence-switch-header-col" style="text-align: left;"></th>
          ${th('Sequence Name', 'client-sequence-name-header')}
          <th tabindex="0" class="client-sequence-progress-header" style="text-align: start;"><div class="d-flex sequence-progress-col"><span>Sequence Progress</span>${ICON.infoCircle}</div></th>
          ${th('Score')}
          ${th('Prospect', 'client-prospect-col-header', ICON.users, 'prospect-col-header-icon')}
          ${th('Contacted', 'client-contacted-col-header', ICON.mail, 'contacted-col-header-icon')}
          ${th('Opened', '', ICON.mailOpened, 'opened-col-header-icon')}
          ${th('Replied', '', ICON.arrowBackUp, 'replied-col-header-icon')}
          ${th('Positive', '', ICON.like, 'positive-col-header-icon')}
          ${th('Email Accounts')}
          ${th('Client Associated')}
          <th tabindex="0" class="created-by-header" style="min-width: 10.5rem; width: 10.5rem; text-align: left;"><span>Created By</span></th>
          <th tabindex="0" class="client-sequence-action-header" style="text-align: left;"></th>
        </tr></thead>
        <tbody class="table-organism-body sequence-body-wrapper ">${rows}</tbody>
      </table></div></div>
      ${pagination(d)}
    </div></div></div>`;

    return `<div class="sequence-container p-0 container-fluid"><div class="m-0 h-100 row"><div class="p-0 h-100 col"><div class="sequence-components"><div class="sequence-list-container">
      <div class="sequence-filter-bar">
        <div class="sequence-filter-bar-left">${filterLeft}</div>
        <div class="row"><div class="col-md-12"><div class="d-flex align-items-center gap-16"><button type="button" id="p-t__create-sequence" class="shd-button shd-button--primary" data-sl-noop><span>Create Sequence</span></button></div></div></div>
      </div>
      <div class="sequence-list${d.anySelected ? ' sequences-selected' : ''}">
        <div data-sl="banner"></div>
        ${table}
      </div>
    </div></div></div></div></div>`;
  };

  /* Today's bulk controls (sequence-list-filter-bar.tsx L180-218): two icon buttons and a red "Delete N sequences" link */
  window.SL_TODAY_BULK = (n) => `<div class="sequence-action-btn-wrapper ${n === 0 ? 'disabled' : ''}">
      <div class="sequence-action-btn" role="button" tabindex="0" data-sl-today="pause" data-nx-tip="Pause Sequence" aria-label="Pause Sequence"><i class="sh-pause-circle"></i></div>
      <div class="sequence-action-btn" role="button" tabindex="0" data-sl-today="resume" data-nx-tip="Resume Sequence" aria-label="Resume Sequence"><i class="sh-right-arrow"></i></div>
    </div>${n > 0 ? `<span class="action-delete semibold-1 pointer" role="button" tabindex="0" data-sl-today="delete"><i class="sh-trash"></i>Delete ${n} Sequence${n > 1 ? 's' : ''}</span>` : ''}`;

  /* Today's selection banner (sequence-list-table.tsx L1476-1497): ui/Alert variant "alert" */
  window.SL_BANNER = (inner) => `<div data-banner="true"><div class="shd-alert shd-alert--alert shd-alert--lg alert-width table-header w-100" role="alert"><div class="shd-alert--icon">${ICON.alertTriangle}</div><div class="shd-alert--text"><div class="shd-alert--description">${inner}</div></div></div></div>`;
  window.SL_TODAY_BANNER_INNER = (n) => `<div class="sequence-selection-info--wrapper"><p>${n === 100 ? 'Maximum 100 sequences can be selected at once.' : `${n} ${n > 1 ? 'Sequences' : 'Sequence'} selected.`}</p><div class="sequence-selection-info--separator"></div><div class="sequence-selection-info--cta" role="button" tabindex="0" data-sl="clear">Clear selection</div></div>`;

  /* ───────── today's modals ───────── */
  function mount(root, onKey) {
    document.body.appendChild(root);
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    document.addEventListener('keydown', onKey, true);
    return close;
  }
  const loader = '<div class="shd-loader" aria-hidden="true"><div></div><div></div><div></div><div></div></div>';

  /* shared/modals/pause-resume-sequence-modal: "Pause Sequence" / "Activate Sequence", Yes / No.
     Bulk always shows the checkbox (shouldShowPauseSubsequenceCheckbox={true}, no count); the row switch shows it
     only when the sequence has subsequences, with the singular or plural noun. */
  window.SL_TODAY_CONFIRM = ({ action, showCheckbox, subCount, result, onYes }) => {
    const isPause = action === 'pause';
    const word = isPause ? 'pause' : 'activate';
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="sl-today-t" class="fade shd-modal with-divider show-conditions-modal modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
          <div class="shd-modal--header modal-header"><div class="shd-modal--title modal-title h4" id="sl-today-t"><div class="d-flex align-items-center gap-10">${ICON.alertCircle20}<span class="line-height-1">${isPause ? 'Pause' : 'Activate'} Sequence</span></div></div></div>
          <div class="shd-modal--body modal-body"><p>Are you sure you want to ${word} the Sequence?</p>${isPause && showCheckbox ? `<p>${checkbox('', false)}</p>` : ''}</div>
          <div class="shd-modal--divider"></div>
          <div class="shd-modal--footer modal-footer"><div class="shd-modal--footer__right"><button type="button" class="shd-button shd-button--secondary cancel-btn"><span>No</span></button><button type="button" class="shd-button shd-button--primary"><span>Yes</span></button></div></div>
        </div></div></div></div>`);
    const cb = root.querySelector('.bs-checkbox-wrapper');
    if (cb) cb.insertAdjacentHTML('beforeend', `<span class="checkbox-label-text">Pause the ${subCount === 1 ? 'subsequence' : 'subsequences'} as well</span>`);
    const [no, yes] = root.querySelectorAll('.shd-modal--footer__right button');
    const close = mount(root, (e) => { if (e.key === 'Escape') close(); });
    no.addEventListener('click', close);
    yes.addEventListener('click', () => {
      if (yes.disabled) return;
      yes.disabled = true; no.disabled = true;
      yes.innerHTML = `${loader}<span>Yes...</span>`;
      setTimeout(() => { close(); onYes(result, cb ? cb.querySelector('input').checked : false); }, window.SL_SD != null ? window.SL_SD : 900);
    });
    yes.focus({ preventScroll: true });
    return { el: root, close, yes };
  };

  /* sequence-action-report-modal.tsx: shown after every bulk pause / resume */
  window.SL_TODAY_REPORT = (action, ok, failed) => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="contained-modal-title-vcenter" class="fade bs-modal-container confirm-modal-width pause-resume-report-modal modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container"><div class="bs-modal-body modal-body">
          <div class="pause-resume-report-modal--header"><img src="${IMG('sent-email-blue.svg')}" alt=""><span id="contained-modal-title-vcenter">Action Stats</span></div>
          <div class="pause-resume-report-modal--content">
            <div class="pause-resume-stat"><p>Sequences ${action}d successfully</p><p>${ok}<i class="sh-check-o green-txt-14"></i></p></div>
            <div class="pause-resume-stat"><p>Sequences failed to ${action}</p><p>${failed}<i class="sh-danger gold-txt-6"></i></p></div>
          </div>
          <div class="pause-resume-report-modal--footer"><button type="button" class="shd-button shd-button--primary"><span>Done</span></button></div>
        </div></div></div></div></div></div>`);
    const close = mount(root, () => {});
    root.querySelector('.pause-resume-report-modal--footer button').addEventListener('click', close);
    return { el: root, close };
  };

  /* delete-multiple-sequences-modal -> delete-sequence-modal -> delete-modal: typed "delete" confirmation.
     Kept as it is in the proposal (it already confirms). */
  window.SL_DELETE = (n, onDelete) => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="sl-del-t" class="fade bs-modal-container confirm-modal-width modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container"><div class="bs-modal-body modal-body">
          <form novalidate><div class="bs-modal-content"><div class="bs-modal-icon icon-error"><i class="sh-info"></i></div><div class="bs-modal-inner-content">
            <h3 id="sl-del-t">Do you want to delete these sequences?</h3>
            <p class="bs-mt-15">If you delete the sequence, you will permanently lose your sequence data.</p>
            <p class="bs-mt-20 bs-mb-10">Confirm by typing <span class="red-txt-5">delete</span> below.</p>
            <div class="sl-del-input"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default bs-mb-20"><input name="confirm" autocomplete="off" class="bs-input-md bs-input" aria-label="Type delete to confirm"></span></div>
          </div></div>
          <div class="d-flex justify-content-end"><button type="button" class="bs-mr-5 cancel-btn btn-solid btn-solid-outlined btn-solid-md">Cancel</button><button type="submit" class="font-medium submit-btn btn-solid btn-solid-primary btn-solid-md">Yes</button></div></form>
        </div></div></div></div></div></div>`);
    const close = mount(root, (e) => { if (e.key === 'Escape') close(); });
    const input = root.querySelector('input');
    const wrap = root.querySelector('.sl-del-input');
    const showErr = (on) => {
      wrap.innerHTML = on
        ? `<div class="bs-input-container input-error-container bs-mb-20"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-error"></span><label class="bs-input-label-suffix">Invalid confirmation input</label></div>`
        : '<span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default bs-mb-20"></span>';
      wrap.querySelector('.bs-input-affix-wrapper').appendChild(input);
      input.focus();
    };
    root.querySelector('.cancel-btn').addEventListener('click', close);
    root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value !== 'delete') { showErr(true); return; }
      close(); onDelete();
    });
    input.focus();
    return { el: root, close, input };
  };
})();
