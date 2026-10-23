/* Production markup for CRM > Prospects (my.saleshandy.com/crm/list), reproduced from webui main aeda4e3:
   prospect.tsx, prospect-header.tsx (saved views, Enrich Prospects, Add Prospects, view switch, search, BulkActions,
   Filter, Export), prospect-list-content.tsx, prospect-table.tsx + shared/design-system/ui/table (TanStack table:
   thead, column-header, column-cell, table-pagination), get-columns-definitions.tsx (cell renderers),
   delete-prospect-modal.tsx, no-need-to-delete-modal.tsx, unsubscribe-prospect-modal.tsx, shared add-remove-tag,
   ai-col-enrichment-modal (template-header, template-footer, override-generated-existing-column).
   Anything new is marked .nx-new. Loaded before crm-prospects.js. */
(function () {
  'use strict';
  const { fmt, h, esc, IMG } = NX;

  /* ───────── icons (@saleshandy/icons and shared/svg, inline) ───────── */
  const svg = (w, vb, d, cls = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" fill="none" viewBox="${vb}" role="img" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${d}</svg>`;
  const p = (d) => `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="${d}"/>`;
  const ICON = {
    listView: svg(16, '0 0 16 16', p('M4 3.33822C3.63181 3.33822 3.33333 3.63669 3.33333 4.00488V12.0049C3.33333 12.3731 3.63181 12.6715 4 12.6715H12C12.3682 12.6715 12.6667 12.3731 12.6667 12.0049V4.00488C12.6667 3.63669 12.3682 3.33822 12 3.33822H4ZM2 4.00488C2 2.90031 2.89543 2.00488 4 2.00488H12C13.1046 2.00488 14 2.90031 14 4.00488V12.0049C14 13.1095 13.1046 14.0049 12 14.0049H4C2.89543 14.0049 2 13.1095 2 12.0049V4.00488Z') + p('M6 2.00488C6.36819 2.00488 6.66667 2.30336 6.66667 2.67155V13.3382C6.66667 13.7064 6.36819 14.0049 6 14.0049C5.63181 14.0049 5.33333 13.7064 5.33333 13.3382V2.67155C5.33333 2.30336 5.63181 2.00488 6 2.00488Z') + p('M14 5.99989C14 6.36808 13.7015 6.66656 13.3333 6.66656L2.66667 6.66656C2.29848 6.66656 2 6.36808 2 5.99989C2 5.6317 2.29848 5.33322 2.66667 5.33322L13.3333 5.33323C13.7015 5.33323 14 5.6317 14 5.99989Z'), 'prospect-list-view-icon'),
    kanbanView: svg(16, '0 0 16 16', p('M4 3.33822C3.63181 3.33822 3.33333 3.63669 3.33333 4.00488V12.0049C3.33333 12.3731 3.63181 12.6715 4 12.6715H5.33333C5.70152 12.6715 6 12.3731 6 12.0049V4.00488C6 3.63669 5.70152 3.33822 5.33333 3.33822H4ZM2 4.00488C2 2.90031 2.89543 2.00488 4 2.00488H5.33333C6.4379 2.00488 7.33333 2.90031 7.33333 4.00488V12.0049C7.33333 13.1095 6.4379 14.0049 5.33333 14.0049H4C2.89543 14.0049 2 13.1095 2 12.0049V4.00488Z') + p('M10.6667 3.33822C10.2985 3.33822 10 3.63669 10 4.00488V8.00488C10 8.37307 10.2985 8.67155 10.6667 8.67155H12C12.3682 8.67155 12.6667 8.37307 12.6667 8.00488V4.00488C12.6667 3.63669 12.3682 3.33822 12 3.33822H10.6667ZM8.66667 4.00488C8.66667 2.90031 9.5621 2.00488 10.6667 2.00488H12C13.1046 2.00488 14 2.90031 14 4.00488V8.00488C14 9.10945 13.1046 10.0049 12 10.0049H10.6667C9.5621 10.0049 8.66667 9.10945 8.66667 8.00488V4.00488Z'), 'prospect-kanban-view-icon'),
    // AdvancedFilter (@saleshandy/icons), tabler "adjustments-horizontal" shape
    filter: svg(20, '0 0 24 24', p('M14 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm-1.874-1a4.002 4.002 0 0 1 7.748 0H20a1 1 0 1 1 0 2h-.126a4.002 4.002 0 0 1-7.748 0H4a1 1 0 0 1 0-2h8.126ZM6 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm-1.874-1a4.002 4.002 0 0 1 7.748 0H20a1 1 0 1 1 0 2h-8.126a4.002 4.002 0 0 1-7.748 0H4a1 1 0 1 1 0-2h.126ZM15 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm-1.874-1a4.002 4.002 0 0 1 7.748 0H20a1 1 0 1 1 0 2h-.126a4.002 4.002 0 0 1-7.748 0H4a1 1 0 1 1 0-2h9.126Z')),
    tag20: svg(20, '0 0 24 24', p('M7 4a3 3 0 0 0-3 3v3.586l8.682 8.682a.5.5 0 0 0 .636 0l5.95-5.95a.5.5 0 0 0 0-.636L10.586 4H7Zm-3.536-.536A5 5 0 0 1 7 2h4a1 1 0 0 1 .707.293l9 9 .038.04a2.5 2.5 0 0 1-.038 3.374l-6 6a2.5 2.5 0 0 1-3.414 0l-9-9A1 1 0 0 1 2 11V7a5 5 0 0 1 1.464-3.536Z') + p('M9 8.007a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z')),
    chevUp: svg(16, '0 0 24 24', p('M11.293 8.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L12 10.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l6-6Z')),
    chevDown: (cls = '') => svg(16, '0 0 24 24', p('M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z'), cls),
    info: svg(16, '0 0 24 24', p('M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z') + p('M11 8a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1ZM10 12a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1-1-1Z')),
    plus16: svg(16, '0 0 24 24', p('M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z'), 'plus-icon'),
    layoutColumns: svg(20, '0 0 24 24', p('M6 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6ZM3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Z') + p('M12 3a1 1 0 0 1 1 1v16a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Z')),
    alertCircle: svg(24, '0 0 24 24', p('M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z') + p('M12 7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1ZM11 16a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z')),
    cross16: svg(16, '0 0 24 24', p('M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414Z')),
    help: svg(20, '0 0 24 24', p('M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z') + p('M12 16a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V17a1 1 0 0 1 1-1ZM10.17 7.25a3.5 3.5 0 0 1 4.75 4.875 3.47 3.47 0 0 1-1.92 1.508V14a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.5-1.5 1 1 0 1 1-2 0 3.5 3.5 0 0 1 1.67-3.25Z'), 'help-logo'),
    plus14: svg(16, '0 0 24 24', p('M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z'), 'template-plus-icon'),
    preview: svg(16, '0 0 24 24', p('M12 7c-3.37 0-6.18 1.93-7.83 5 1.65 3.07 4.46 5 7.83 5s6.18-1.93 7.83-5C18.18 8.93 15.37 7 12 7Zm-9.86 4.49C4.06 7.5 7.66 5 12 5s7.94 2.5 9.86 6.49a1 1 0 0 1 0 1.02C19.94 16.5 16.34 19 12 19s-7.94-2.5-9.86-6.49a1 1 0 0 1 0-1.02Z') + p('M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z'), 'preview-icon'),
    arrowLeft: svg(16, '0 0 24 24', p('M10.707 5.293a1 1 0 0 1 0 1.414L6.414 11H19a1 1 0 1 1 0 2H6.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0Z'), 'left-arrow'),
    // UpgradePlanBanner feature icons (Users, Wallet, Checkbox, Cash, Confetti) as tabler outlines
    users: svg(16, '0 0 24 24', p('M9 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM4 7a5 5 0 1 1 10 0A5 5 0 0 1 4 7Zm3 9a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0v-2a3 3 0 0 0-3-3H7Z')),
    wallet: svg(16, '0 0 24 24', p('M6 5a1 1 0 0 0 0 2h11V5H6Zm13 2V4a1 1 0 0 0-1-1H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a2 2 0 0 0 2-2v-3h.5a1.5 1.5 0 0 0 0-3H20V9a2 2 0 0 0-1-1.73V7ZM5 8.83V18a1 1 0 0 0 1 1h12v-3h-2a3 3 0 1 1 0-6h2V9H6a3 3 0 0 1-1-.17ZM18 12h-2a1 1 0 1 0 0 2h2v-2Z')),
    check: svg(16, '0 0 24 24', p('M20.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L12 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z') + p('M6 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h9a1 1 0 1 1 0 2H6Z')),
    cash: svg(16, '0 0 24 24', p('M9 9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H9Zm-3 1a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8Z') + p('M14 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM5 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1 1 1 0 1 1 0 2 3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3 1 1 0 1 1-2 0 1 1 0 0 0-1-1H5Z')),
    confetti: svg(20, '0 0 24 24', p('M4.1 19.9 8.6 7.6a1 1 0 0 1 1.65-.36l6.5 6.5a1 1 0 0 1-.36 1.65L4.1 19.9Zm4.9-10L6.2 17.8l7.9-2.8L9 9.9ZM14 3a1 1 0 0 1 1 1 2 2 0 0 1-2 2 1 1 0 1 1 0-2 1 1 0 0 1 1-1Zm5 5a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm-4 7.97a1 1 0 0 1 1.03-.97A4 4 0 0 1 20 19a1 1 0 1 1-2 0 2 2 0 0 0-1.97-2 1 1 0 0 1-1.03-1.03ZM20 3a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Z')),
  };
  window.CRM_ICON = ICON;

  /* ───────── page header: production h2 (header.tsx renderTitle) ───────── */
  window.CRM_HEADER = `<div class="p-0"><div class="d-flex header-with-notification"><div class="d-flex align-items-center"><h2 class="semibold-3 mb-0 popover-arrow-color-txt">CRM</h2></div></div></div>`;

  const checkbox = (attrs, state) => `<label class="bs-checkbox-wrapper"><span class="bs-checkbox${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}><span class="bs-checkbox-inner"></span></span></label>`;

  /* ContactStatusTag with isSequenceProspectTag (prospect status column) */
  const STATUS = { active: ['bs-tag-blue-2', 'Active'], paused: ['bs-tag-orange-4', 'Paused'], replied: ['bs-tag-green-2', 'Replied'], finished: ['bs-tag-blue-2', 'Finished'], unsubscribed: ['bs-tag-red-2', 'Unsubscribed'], bounced: ['bs-tag-red-2', 'Bounced'] };
  /* get-email-verification-icon.ts */
  const VER = { valid: ['circle-check', 'verification-status-valid green-txt-14', 'Valid'], risky: ['danger', 'verification-status-risky orange-txt-6', 'Risky'], bad: ['warning', 'verification-status-bad red-txt-6', 'Bad'], skip: ['circle-check', 'verification-status-skip gray-txt-23', 'Unverified'] };

  const tag = (name) => `<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2 d-flex"><span class="">${esc(name)}</span></span></div></div>`;
  function tagsCell(tags) { // ProspectTagsRow: maxTags = tags > 2 ? 1 : 2, then "+N"
    if (!tags.length) return '<div class="prospect-tag-row">-</div>';
    const max = tags.length > 2 ? 1 : 2;
    const shown = tags.slice(0, max).map((t) => tag(t.name)).join('');
    const more = tags.length > max ? `<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2">+${tags.length - max}</span></div></div>` : '';
    return `<div class="prospect-tag-row">${shown}${more}</div>`;
  }
  function seqCell(seqs) { // ProspectSequenceName: one name, or "N Sequences"
    if (!seqs.length) return '<div class="sequence-name-wrap">-</div>';
    if (seqs.length > 1) return `<div class="sequence-name-wrap"><span role="button" tabindex="0" class="regular-2 sequence-name font-medium blue-txt-11">${seqs.length} Sequences</span></div>`;
    return `<div class="sequence-name-wrap"><span role="button" tabindex="0" class="regular-2 sequence-name font-medium text-decoration-none blue-txt-11">${esc(seqs[0])}</span></div>`;
  }
  const verIcon = (v) => { const c = VER[v] || VER.skip; return `<i class="sh-${c[0]} ${c[1]}" data-nx-tip="${c[2]}"></i>`; };

  /* Column set: the default list columns (get-prospect-system-attributes, isDefault) the scenario needs, plus the AI column */
  window.CRM_COLUMNS = (aiCol) => [
    { id: 'name', label: 'Name', size: 208, pinned: true, sort: true, fixed: true },
    { id: 'email', label: 'Email', size: 250, sort: true, fixed: true },
    { id: 'jobTitle', label: 'Job Title', size: 150, sort: true },
    { id: 'company', label: 'Company', size: 150, sort: true },
    { id: 'prospectStatus', label: 'Latest Status', size: 150 },
    { id: 'sequenceAssociated', label: 'Sequence Associated', size: 170 },
    { id: 'prospectTags', label: 'Prospect Tags', size: 170 },
    { id: 'verificationStatus', label: 'Email Verification Status', size: 200 },
  ].concat(aiCol ? [{ id: 'opener', label: aiCol, size: 260, ai: true }] : []);

  function cellValue(col, p, loading) {
    if (loading) return '<span class="react-loading-skeleton" style="width:100px;height:18px;display:block"></span>';
    switch (col.id) {
      case 'name': return `<span class="">${esc(p.first + ' ' + p.last)}</span>`;
      case 'email': return `<div class="d-flex align-items-center" style="gap: 4px;"><div style="width: 1rem; height: 1rem;">${verIcon(p.ver)}</div><div style="flex: 1 1 0%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${esc(p.email)}</div></div>`;
      case 'jobTitle': return esc(p.title);
      case 'company': return esc(p.company);
      case 'prospectStatus': { if (!p.status) return '-'; const [c, t] = STATUS[p.status]; return `<span class="bs-tag ${c} regular-2 bs-mr-6">${t}</span>`; }
      case 'sequenceAssociated': return seqCell(p.seqs);
      case 'prospectTags': return tagsCell(p.tags);
      case 'verificationStatus': { const c = VER[p.ver] || VER.skip; return `<div class="d-flex align-items-center gap-4 verification-status-icon"><span class="d-flex">${verIcon(p.ver)}</span><span>${c[2]}</span></div>`; }
      case 'opener': return p.opener ? esc(p.opener) : '';
      default: return '';
    }
  }

  /* TanStack table (shared/design-system/ui/table) */
  function headerCell(col, i, head) {
    const pinned = col.pinned ? ' th--pinned th--pinned__left' : '';
    const sort = col.sort ? `<div class="column-header-content--sorting-icons"><div class="sorting-icon asc" role="button" tabindex="0" aria-label="Sort ascending">${ICON.chevUp}</div><div class="sorting-icon desc" role="button" tabindex="0" aria-label="Sort descending">${ICON.chevDown()}</div></div>` : '';
    const aiIcon = col.ai ? `<img src="${IMG('no-result-gradient.svg')}" alt="ai-icon" class="column-header-ai-icon">` : '';
    const info = col.id === 'prospectStatus' ? `<div><div class="info-circle-icon-main" role="button" tabindex="0" aria-label="About statuses">${ICON.info}</div></div>` : '';
    const aiEdit = col.ai ? `<span class="column-header-ai-icon-wrapper"><div><img src="${IMG('edit-star.svg')}" alt="edit-star" class="column-header-ai-icon default"><img src="${IMG('edit-star-gradient.svg')}" alt="edit-star-gradient" class="column-header-ai-icon hover" data-nx-tip="Modify column details"></div></span>` : '';
    const content = `<div class="column-header-content">${i === 0 ? `<div class="column-header-content--checkbox">${checkbox('data-crm="check-all" aria-label="Select all on this page"', head)}</div>` : ''}
      <div class="column-header-content--name${col.id === 'prospectStatus' ? ' latest-status' : ''}"><div class="column-header-content--headText">${aiIcon}<div class="column-header-content--colHeadText">${esc(col.label)}</div>${info}</div>${aiEdit}</div>${sort}</div>`;
    return `<div class="shd-table--th${pinned}" style="width: calc(var(--header-${col.id}-size) * 1px);${col.pinned ? ' left: 0px;' : ''}">${col.fixed ? content : `<div class="hide-content-header-btn w-100 cursor-pointer">${content}</div>`}<div class="column-header-resizer ltr"><div class="column-header-resizer--handle"></div></div></div>`;
  }

  function bodyRow(p, cols, isSel, loadingIds) {
    return `<div class="shd-table--tr" data-crm-id="${p.id}">${cols.map((col, i) => {
      const pinned = col.pinned ? ' td--pinned td--pinned__left' : '';
      const loading = col.ai && loadingIds && loadingIds.has(p.id);
      return `<div class="shd-table--td${pinned}" style="width: calc(var(--col-${col.id}-size) * 1px);${col.pinned ? ' left: 0px;' : ''}"><div class="column-cell-content${loading ? ' loading' : ''}">${i === 0 ? `<div class="column-cell-content--checkbox">${checkbox(`data-crm-row="${p.id}" aria-label="Select ${esc(p.first + ' ' + p.last)}"`, isSel(p))}</div>` : ''}<div class="column-cell-content--value${col.ai ? ' ai-icon-editable-cell' : ''}">${cellValue(col, p, loading)}</div><div class="column-cell-content--resizer"></div></div></div>`;
    }).join('')}</div>`;
  }

  function pageModel(cur, last) { // react-ultimate-pagination
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '…', last];
    if (cur >= last - 3) return [1, '…', last - 4, last - 3, last - 2, last - 1, last];
    return [1, '…', cur - 1, cur, cur + 1, '…', last];
  }
  function pagination(page, pages, total, pageSize) {
    const cur = page + 1;
    const li = (n) => n === '…'
      ? '<li class="custom-ellipsis page-item"><a class="page-link" role="button" href="#" tabindex="-1"><span aria-hidden="true">…</span><span class="sr-only">More</span></a></li>'
      : n === cur ? `<li class="page-item active"><span class="page-link">${n}<span class="sr-only">(current)</span></span></li>`
        : `<li class="page-item"><a class="page-link" role="button" href="#" data-crm-page="${n - 1}">${n}</a></li>`;
    const arrow = (dir, dis) => dis ? `<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-${dir === 'prev' ? 'left' : 'right'}"></i></span><span class="sr-only">${dir === 'prev' ? 'Previous' : 'Next'}</span></span></li>`
      : `<li class="page-item"><a class="page-link" role="button" href="#" data-crm-page="${dir}"><span aria-hidden="true"><i class="sh-chevron-${dir === 'prev' ? 'left' : 'right'}"></i></span><span class="sr-only">${dir === 'prev' ? 'Previous' : 'Next'}</span></a></li>`;
    return `<div class="shd-table--pagination">
      <div class="shd-table--pagination__container"><p class="shd-table--pagination__text">Showing</p>
        <div class="transfer-select-box shd-table--pagination__select"><div class="bs-select-box crm-select-box" role="button" tabindex="0" aria-label="Rows per page"><span>${Math.min(pageSize, total)}</span>${ICON.chevDown('crm-select-chev')}</div></div>
        <p class="shd-table--pagination__text">out of ${total}</p></div>
      <div class="shd-table--pagination__separator"></div>
      <div class="shd-table--pagination__container"><p class="shd-table--pagination__text">Go to page:</p>
        <div class="shd-table--pagination__input"><form onsubmit="return false"><div class="bs-input-container"><input type="number" class="bs-input" value="${cur}" min="1" max="${pages}" aria-label="Go to page"></div></form></div>
        <p class="shd-table--pagination__text">/${pages}</p></div>
      <ul class="pagination">${arrow('prev', cur === 1)}${pageModel(cur, pages).map(li).join('')}${arrow('next', cur === pages)}</ul>
    </div>`;
  }

  /* Whole page body under the 50px header (prospect.tsx > ProspectHeader + ProspectListContent) */
  window.CRM_PAGE = (d) => {
    const selOnPage = d.rows.filter(d.isSel).length;
    const head = d.rows.length && selOnPage === d.rows.length ? true : selOnPage ? 'mixed' : false;
    const table = !d.rows.length
      ? `<div class="prospect-table-container"><div class="prospect-table-empty-ui-no-result"><h1>No results found</h1><p>Results matching this query could not be displayed. </p><p>Please try refining your search.</p></div></div>`
      : `<div class="prospect-table-container"><div class="shd-table">
          <div class="shd-table--wrapper" data-crm="wrapper"><div class="shd-table--table" data-crm="table">
            <div class="shd-table--thead"><div class="shd-table--tr">${d.cols.map((c, i) => headerCell(c, i, head)).join('')}</div></div>
            <div class="shd-table--tbody">${d.rows.map((r) => bodyRow(r, d.cols, d.isSel, d.loadingIds)).join('')}</div>
          </div></div>
          ${pagination(d.page, d.pages, d.total, d.pageSize)}
        </div><div class="layout-columns-button" role="button" tabindex="0" aria-label="Edit columns" data-nx-tip="Edit columns">${ICON.layoutColumns}</div></div>`;
    return `<div class="prospect-container p-0 container-fluid">
      <div class="prospect-list-content--header--container">
        <div class="prospect-list-content--header">
          <div class="prospect-list-content--header__left"><div class="prospect-list-content--header__saved-filter">
            <div class="d-flex saved-filters__items"><div class="saved-filters__items">
              <div class="bs-tabs bs-tabs-top bs-tabs-small saved-filters__tabs"><div role="tablist" class="bs-tabs-nav"><div class="bs-tabs-nav-wrap"><div class="bs-tabs-nav-list">
                <div class="bs-tabs-tab bs-tabs-tab-active"><div role="tab" aria-selected="true" class="bs-tabs-tab-btn" tabindex="0"><div class="saved-filters__item d-flex align-items-center pointer regular-1 font-medium gray-txt-15 line-height-20 saved-filters__item-active">All Prospects<div class="d-flex align-items-center gap-4 ml-1"><div class="saved-filters__item-count regular-1 font-medium line-height-16 blue-txt-17">${fmt(d.totalAll)}</div></div></div></div></div>
                <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div class="saved-filters__item d-flex align-items-center pointer regular-1 font-medium gray-txt-15 line-height-20">Q4 webinar leads</div></div></div>
                <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div class="saved-filters__item d-flex align-items-center pointer regular-1 font-medium gray-txt-15 line-height-20">Replied, no meeting</div></div></div>
                <div class="bs-tabs-ink-bar bs-tabs-ink-bar-animated" data-crm="ink"></div>
              </div></div></div></div>
              <div class="saved-filters__item d-flex align-items-center pointer regular-1 font-medium gray-txt-15 line-height-20 p-0"><div class="d-flex align-items-center pointer" role="button" tabindex="0">All Views${ICON.chevDown('ml-1')}</div></div>
              <div class="plus-icon-container" role="button" tabindex="0" aria-label="Add View" data-nx-tip="Add View"><div class="plus-icon-container-tooltip">${ICON.plus16}</div></div>
            </div></div>
          </div></div>
          <div class="prospect-list-content--header__right">
            <div class="d-flex align-items-center enrich-prospect-button cr-prospect" role="button" tabindex="0" data-crm="enrich"><img src="${IMG('stars.svg')}" width="16" height="16" alt="stars"><span>Enrich Prospects</span></div>
            <div class="add-prospect-button"><div class="dropdown-custom"><button aria-haspopup="true" aria-expanded="false" type="button" class="dropdown-toggle-custom btn-solid btn-solid-primary" data-crm-noop><span class="m-2">Add Prospects</span>${ICON.chevDown()}</button></div></div>
          </div>
        </div>
        <div class="prospect-list-content--header__bottom">
          <div class="prospect-list-content--header__bottom--left${d.view === 'proposed' ? ' crm-left-proposed' : ''}">
            <div class="prospect-view-switch">
              <span class="prospect-list-view active-tab" role="button" tabindex="0">${ICON.listView}<span class="prospect-list-view-text">List</span></span>
              <span class="prospect-view-switch-divider active-divider"></span>
              <span class="prospect-kanban-view" role="button" tabindex="0" data-crm-noop>${ICON.kanbanView}<span class="prospect-kanban-view-text">Kanban</span><div class="prospect-kanban-new-tag"><span class="prospect-kanban-new-text">New</span></div></span>
            </div>
            <span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default prospect-list-content--header__bottom__search"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search Name or Email" class="bs-input-md bs-input" value="" aria-label="Search Name or Email"></span>
            <div class="crm-bulk-host${d.view === 'today' ? ' crm-bulk-today' : ''}" data-crm="bulk"></div>
          </div>
          <div class="prospect-list-content--header__bottom--right">
            <div class="prospect-list-content--header__filter-btn" role="button" tabindex="0" data-crm-noop><div class="filter-icon">${ICON.filter}</div><p>Filter</p></div>
            <button type="button" class="d-flex justify-content-center action-btn--export icon-only btn-ghost btn-ghost-default btn-ghost-md" aria-label="Export" data-nx-tip="Export" data-crm-noop><span class="icon-left"><i class="font-20 sh-download"></i></span></button>
          </div>
        </div>
      </div>
      <div class="prospect-component">
        <div class="prospect-banner" data-crm="banner"></div>
        ${table}
      </div>
    </div>`;
  };

  /* ───────── today's modals (shared Modal atom = react-bootstrap Modal) ───────── */
  function bsModal({ cls, title, body, cancel = 'Cancel', cancelCls = 'btn-ghost btn-ghost-outlined btn-ghost-md', submit, submitCls = 'btn-solid btn-solid-primary btn-solid-md', close = true, onSubmit, footer }) {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" class="fade bs-modal-container ${cls} modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-header modal-header"><div class="modal-title h4">${title}</div>${close ? '<button type="button" class="close" aria-label="Close"><i class="sh-close"></i></button>' : ''}</div>
          <div class="bs-modal-body modal-body"></div>
          ${footer === false ? '' : `<div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;"><button type="button" class="${cancelCls}">${cancel}</button><button type="button" class="${submitCls}">${submit}</button></div></div>`}
        </div></div></div></div></div>`);
    const b = root.querySelector('.modal-body');
    typeof body === 'string' ? (b.innerHTML = body) : b.appendChild(body);
    const close_ = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape') close_(); }
    document.addEventListener('keydown', onKey, true);
    const btns = root.querySelectorAll('.bs-modal-footer-action-buttons button');
    if (btns.length) {
      btns[0].addEventListener('click', close_);
      btns[1].addEventListener('click', () => onSubmit && onSubmit(close_, btns[1]));
    }
    const x = root.querySelector('.modal-header .close'); if (x) x.addEventListener('click', close_);
    root.querySelector('.modal').addEventListener('mousedown', (e) => { if (e.target.classList.contains('modal') || e.target.classList.contains('modal-dialog')) close_(); });
    document.body.appendChild(root);
    return { root, close: close_, submitBtn: btns[1] };
  }
  window.CRM_BSMODAL = bsModal;

  // delete-prospect-modal.tsx with en.ts copy
  window.CRM_TODAY_DELETE = (onDelete) => bsModal({
    cls: 'delete-modal', title: `<div class="d-flex"><img src="${IMG('trash-danger.svg')}" alt=""><div class="pl-2"> Delete Prospect</div></div>`,
    body: '<div class="mt-2"><span class="regular-2">Are you sure you want to delete the selected prospects.</span></div><div class="mt-2"><span class="regular-2">If you delete the prospects, you will permanently lose your prospects.</span></div>',
    submit: 'Delete', onSubmit: (close) => { close(); onDelete(); },
  });
  // unsubscribe-prospect-modal.tsx
  window.CRM_TODAY_UNSUB = (onUnsub) => bsModal({
    cls: 'unsubscribe-prospect-modal', title: `<div class="d-flex"><img src="${IMG('ban-blue-xl.svg')}" alt=""><div class="pl-2"> Unsubscribe Prospects</div></div>`,
    body: '<div class="mt-2"><span class="regular-2">Are you sure you want to unsubscribe the selected prospects.</span></div><div class="mt-2"><span class="regular-2">If you unsubscribe the prospects, you will not be able to send emails to the prospects.</span></div>',
    submit: 'Unsubscribe', onSubmit: (close) => { close(); onUnsub(); },
  });

  // UpgradePlanBanner (reorder: features 1, 3, 2, 4)
  const UPGRADE_BANNER = `<div class="upgrade-plan-banner modal-banner rounded"><div class="upgrade-plan-banner__left">
      <div class="upgrade-plan-banner__title"><div class="title-icon-container">${ICON.confetti}</div><h1>Upgrade Your Plan To Upload Unlimited Prospects</h1></div>
      <p class="upgrade-plan-banner__desc">With this plan upgrade, you will be able to upload unlimited prospects and only pay for the ones that are used in sequences.</p>
      <div class="upgrade-plan-banner__features">
        <div class="upgrade-plan-banner__features--feature"><div class="feature-icon-container">${ICON.users}</div><h3>Unlimited Prospect Uploads</h3></div>
        <div class="upgrade-plan-banner__features--feature"><div class="feature-icon-container">${ICON.check}</div><h3>Instant Activation</h3></div>
        <div class="upgrade-plan-banner__features--feature"><div class="feature-icon-container">${ICON.wallet}</div><h3>Pay for active prospects only</h3><div class="feature-popover-icon-container  ">${ICON.info}</div></div>
        <div class="upgrade-plan-banner__features--feature"><div class="feature-icon-container">${ICON.cash}</div><h3>No Extra Charges</h3></div>
      </div></div> </div>`;
  // no-need-to-delete-modal.tsx: hideFooter, its own action row inside the body
  window.CRM_TODAY_NONEED = (count, onDelete) => {
    const body = h(`<div><div class="content">${UPGRADE_BANNER}</div>
      <div class="action-btns"><button type="button" class="shd-button shd-button--tertiary" data-a="cancel"><span>Cancel</span></button>
        <div class="d-flex align-items-center"><button type="button" class="shd-button shd-button--secondary cancel-btn" data-a="delete" data-nx-tip="This action will delete ${count} selected prospects."><span>Delete anyway</span></button><button type="button" class="shd-button shd-button--primary" data-a="upgrade"><span>Upgrade Now</span></button></div></div></div>`);
    const m = bsModal({ cls: 'no-need-to-delete-prospect-modal', title: `<div class="title-content">${ICON.alertCircle}<h2>Wait! No Need to Delete Prospects</h2></div>`, body, footer: false, close: false });
    // react-bootstrap renders body children directly; unwrap the helper div
    const b = m.root.querySelector('.modal-body'); b.innerHTML = ''; b.append(...body.childNodes);
    b.querySelector('[data-a="cancel"]').addEventListener('click', m.close);
    b.querySelector('[data-a="upgrade"]').addEventListener('click', () => { m.close(); nxToast({ message: 'Opens Billing > Upgrade plan (not part of this prototype)' }); });
    b.querySelector('[data-a="delete"]').addEventListener('click', () => { m.close(); onDelete(); });
    return m;
  };

  /* add-remove-tag.tsx: tag icon, its Add/Remove dropdown, and the Add Tags / Remove Tags modal (TagAutosuggest2 inline) */
  window.CRM_TAG_TRIGGER = (disabled) => `<div class="tag-button-container" data-crm="tag-trigger"><div class="tag-icon d-flex align-items-center justify-content-center ${disabled ? 'disabled' : ''}" role="button" tabindex="0" aria-label="Add or remove tags" data-nx-tip="Add or remove tags">${ICON.tag20}</div></div>`;
  window.CRM_TAG_DROPDOWN = () => h(`<div class="add-btn-container"><ul class="dropdown-container">
      <li class="menu-item" role="button" tabindex="0" data-a="add"><div class="add-tag-btn dropdown"><div class="p-text-tag"><p class="tag-list-font menu-text">Add Tags</p></div></div></li>
      <li class="menu-item" role="button" tabindex="0" data-a="remove"><div class="add-tag-btn dropdown"><div class="p-text-tag remove-tag-modal"><p class="tag-list-font menu-text">Remove Tags</p></div></div></li></ul></div>`);

  /* Remove Tags picker. onApply(pickedTags, ctrl). preset: tag names picked at once (screenshots). */
  window.CRM_TAG_PICKER = (removable, onApply, preset) => {
    const picked = [];
    const body = h(`<div class="email-tab-tags remove-tag-modal modal-input remove-tag-modal-color"><div class="tags-autosuggest-container">
        <div class="fixed-height-input-container"><div class="tags-wrapper"><div class="d-inline-block w-100"><div><input class="selected-tags-inline-input" placeholder="Search and select tags to remove" aria-label="Tags to remove"></div></div></div></div>
        <ul class="crm-tag-suggest" role="listbox" aria-label="Tags on the selected prospects"></ul></div></div>`);
    const wrap = body.querySelector('.tags-wrapper');
    const list = body.querySelector('.crm-tag-suggest');
    const input = body.querySelector('input');
    const m = bsModal({ cls: 'add-remove-tag-email-modal', title: `<div class="modal-header-title">${ICON.tag20}<div class="pl-2">Remove Tags</div></div>`, body, cancelCls: 'btn-ghost btn-ghost-primary btn-ghost-md cancel-btn', submit: 'Apply', submitCls: 'btn-solid btn-solid-primary btn-solid-md submit-btn', close: false,
      onSubmit: (close) => { if (!picked.length) return; onApply(picked.slice(), close); } });
    const sync = () => {
      wrap.querySelectorAll('.crm-chip').forEach((c) => c.remove());
      picked.forEach((t) => {
        const c = h(`<div class="crm-chip"><div class="bs-tag bs-tag-blue-17 d-flex flex-row align-items-center"><span class="regular-2 d-flex">${esc(t.name)}</span><span class="crm-chip-x" role="button" tabindex="0" aria-label="Remove ${esc(t.name)} from the list"><i class="sh-close"></i></span></div></div>`);
        c.querySelector('.crm-chip-x').addEventListener('click', () => { picked.splice(picked.indexOf(t), 1); sync(); });
        wrap.insertBefore(c, wrap.lastElementChild);
      });
      const q = input.value.trim().toLowerCase();
      const opts = removable.filter((t) => !picked.includes(t) && t.name.toLowerCase().includes(q));
      list.innerHTML = opts.length ? opts.map((t) => `<li role="option" tabindex="0" data-id="${t.id}"><div class="bs-py-6 bs-px-12 pointer">${esc(t.name)}</div></li>`).join('') : '<li aria-disabled="true"><div class="bs-py-6 bs-px-12 bg-white gray-txt-11 regular-2 cursor-default user-select-none">No tags found</div></li>';
      list.querySelectorAll('[data-id]').forEach((li) => li.addEventListener('click', () => { picked.push(removable.find((t) => String(t.id) === li.dataset.id)); input.value = ''; sync(); }));
      m.submitBtn.disabled = !picked.length;
    };
    input.addEventListener('input', sync);
    (preset || []).forEach((n) => { const t = removable.find((x) => x.name === n); if (t) picked.push(t); });
    sync();
    return m;
  };

  /* ───────── AI column drawer (ai-col-enrichment-modal), template detail step, simplified ───────── */
  window.CRM_AI_DRAWER = (o) => {
    const root = h(`<div class="nx-modal-root crm-ai-root"><div role="dialog" aria-modal="false" aria-label="${esc(o.title)}" class="fade bs-modal-container ai-column-drawer-modal modal show" tabindex="-1" style="display: block;">
      <div class="modal-dialog"><div class="modal-content"><div class="modal-content-container"><div class="bs-modal-body modal-body">
        <div class="template-header-container"><div class="template-header">
            <button type="button" class="template-header-back-btn btn btn-primary" aria-label="Back">${ICON.arrowLeft}</button>
            <div class="ai-title"><img src="${IMG('no-result-gradient.svg')}" alt="ai-icon" width="16" height="16"><div class="use-template"><span class="use-template-title">${esc(o.title)}</span></div></div></div>
          <div class="template-header-right">
            <div class="ai-credit-capsule show-border clickable template-header-credit-capsule" role="button" tabindex="0" data-nx-tip="Your AI credits: ${fmt(o.have)}. Click to buy more credits."><img src="${IMG('ai-credits.svg')}" alt="Ai Credits"><span class="ai-credit-capsule-text ">${fmt(o.have)} </span></div>
            <div class="help-logo-container">${ICON.help}</div>
            <div class="cross-icon-container" role="button" tabindex="0" aria-label="Close" data-a="close">${ICON.cross16.replace('<svg', '<svg class="cross-icon-header"')}</div>
          </div></div>
        <div class="enrich-own-prompt-container">
          <div class="enrich-own-prompt-content-container">
            <div class="enrich-own-prompt-label-container"><label class="enrich-own-prompt-label form-label">Update or Create Target Column</label></div>
            <div class="bs-input-container"><input type="text" class="bs-input select-column-name-input" value="${esc(o.column)}" readonly aria-label="Target column"></div>
          </div>
          <div class="enrich-own-prompt-content-container">
            <div class="enrich-own-prompt-label-container ai-model"><label class="enrich-own-prompt-label form-label">AI Model</label></div>
            <div class="crm-ai-field"><span>GPT-4o mini</span><span class="ai-credit-capsule"><img src="${IMG('ai-credits.svg')}" alt=""><span class="ai-credit-capsule-text ">~1 / Row</span></span></div>
          </div>
          <div class="enrich-own-prompt-content-container">
            <div class="enrich-own-prompt-label-container prompt-merge-tag-editor"><div class="enrich-own-prompt-label d-flex align-items-center gap-1"><label class="form-label">Enter Instructions</label></div></div>
            <div class="crm-ai-editor">Write one friendly opening line for <span class="crm-mt">{{First Name}}</span>, who works as <span class="crm-mt">{{Job Title}}</span> at <span class="crm-mt">{{Company}}</span>. Mention something specific about <span class="crm-mt">{{Company}}</span>. Keep it under 25 words and do not use the word "synergy".</div>
          </div>
          <div class="enrich-own-prompt-content-container custom-output-format">
            <div class="enrich-own-prompt-label-container"><label class="enrich-own-prompt-label form-label">Output Format</label></div>
            <div class="crm-ai-field"><span>Text</span>${ICON.chevDown()}</div>
          </div>
        </div>
        <div class="template-footer-container" data-crm="ai-footer">
          <button type="button" class="save-as-template shd-button shd-button--secondary"><span>${ICON.plus14}<span>Save as Template</span></span></button>
          <div class="template-preview-container">
            <button type="button" class="template-preview shd-button shd-button--secondary"><span>${ICON.preview}<span>Preview</span></span></button>
            <button type="button" class="save-dropdown-btn shd-button shd-button--primary" aria-haspopup="menu" aria-expanded="false" data-a="save"><span>Save<div class="pl-1">${ICON.chevDown()}</div></span></button>
          </div>
        </div>
      </div></div></div></div></div></div>`);
    document.body.appendChild(root);
    const close = () => root.remove();
    root.querySelector('[data-a="close"]').addEventListener('click', close);
    root.querySelector('.template-header-back-btn').addEventListener('click', close);
    const saveBtn = root.querySelector('[data-a="save"]');
    let pop = null;
    const closePop = () => { if (pop) { pop.remove(); pop = null; saveBtn.setAttribute('aria-expanded', 'false'); } };
    const openPop = () => {
      closePop();
      // save-dropdown popover (OverlayPopover placement Top)
      const credits = (n) => `<div class="credits"><img src="${IMG('ai-credits.svg')}" alt="credits"><span class="credits-amount">${n > 10 ? '~' : ''}${fmt(n)}</span></div>`;
      pop = h(`<div class="popover bs-popover-top show save-dropdown crm-save-pop" role="menu"><div class="arrow"></div><div class="popover-body"><div class="save-dropdown-content">${o.options.map((op) => `<div class="save-dropdown-item" role="menuitem" tabindex="0" data-k="${op.key}"><div class="save-credits"><span class="save-option">${op.label}</span>${op.rows != null && op.key !== '10-rows' ? `<span class="total-prospects">${fmt(op.rows)}</span>` : ''}</div>${op.credits != null ? credits(op.credits) : ''}</div>`).join('')}</div></div></div>`);
      document.body.appendChild(pop);
      const r = saveBtn.getBoundingClientRect();
      pop.style.position = 'fixed';
      pop.style.left = Math.max(8, r.right - pop.offsetWidth) + 'px';
      pop.style.top = (r.top - pop.offsetHeight - 8) + 'px';
      const ar = pop.querySelector('.arrow'); ar.style.left = (r.left + r.width / 2 - parseFloat(pop.style.left) - 8) + 'px';
      saveBtn.setAttribute('aria-expanded', 'true');
      pop.querySelectorAll('[data-k]').forEach((it) => it.addEventListener('click', () => { const op = o.options.find((x) => x.key === it.dataset.k); closePop(); o.onPick(op, { close }); }));
    };
    saveBtn.addEventListener('click', () => (pop ? closePop() : openPop()));
    document.addEventListener('mousedown', (e) => { if (pop && !pop.contains(e.target) && !saveBtn.contains(e.target)) closePop(); }, true);
    return { root, close: () => { closePop(); close(); }, openSave: openPop };
  };

  // override-generated-existing-column.tsx (react-bootstrap Modal, static backdrop)
  window.CRM_TODAY_OVERRIDE = (onProceed) => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" class="fade override-generated-existing-column-modal modal show" tabindex="-1" style="display: block;"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
        <div class="override-generated-existing-column-modal-container"><div class="override-generated-existing-column-modal-content">
          <div class="override-generated-existing-column-modal-header"><div class="header-title"><span style="color:#D97706;display:flex">${ICON.alertCircle}</span><span class="line-height-1">Override Generated Existing Column</span></div></div>
          <div class="override-generated-existing-column-modal-body"><span class="override-generated-existing-column-modal-text">All existing values previously existed/generated in this column will be permanently replaced with new ones based on the latest prompt.</span><span class="override-generated-existing-column-modal-text">Are you sure you want to continue?</span></div>
        </div><div class="divider-line"></div></div>
        <div class="override-generated-existing-column-modal-footer"><div class="cancel-btn" role="button" tabindex="0">Cancel</div><div class="proceed-btn"><button type="button" class="btn-solid btn-solid-primary btn-solid-md">Proceed Anyway</button></div></div>
      </div></div></div></div>`);
    document.body.appendChild(root);
    const close = () => root.remove();
    root.querySelector('.cancel-btn').addEventListener('click', close);
    root.querySelector('.proceed-btn button').addEventListener('click', () => { close(); onProceed(); });
    return { root, close };
  };
})();
