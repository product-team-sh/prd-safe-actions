/* Production markup for Lead Finder (People) and Email Verifier, reproduced from webui main aeda4e3:
   v2-lead.tsx, components/header/v2-lead-header.tsx, sidebar/v2-lead-sidebar.tsx, filter/v2-lead-filter.tsx,
   filter/saved-filter/saved-filter.tsx, table/v2-lead-table.tsx on shared tanstack-table (lead-selection-banner,
   table-pagination), table/cell-renderers, add-to-list-dropdown, remove-from-list-modal, modal/bulk-reveal-tag-modal,
   modal/credit-not-available-modal, modal/save-filter-modal, modal/add-to-sequence-reveal-modal;
   email-verifier/email-verifier-input-and-file-upload and file-select-module.
   Icons are @saleshandy/icons (Tabler based), drawn here as Tabler outlines at the same sizes.
   Anything new is marked .nx-new. Loaded before lead-finder.js. */
(function () {
  'use strict';
  const { fmt, esc, IMG } = NX;

  /* ───────── icons (Tabler outlines, 24 viewBox, the shapes @saleshandy/icons ships) ───────── */
  const T = (d, size = 16, cls = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${d}</svg>`;
  const P = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6l9 -6"/>',
    phone: '<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/>',
    send: '<path d="M10 14l11 -11"/><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/>',
    userList: '<circle cx="9" cy="8" r="3"/><path d="M4 19v-1a4 4 0 0 1 4 -4h2a4 4 0 0 1 4 4v1"/><path d="M16 7h5M16 11h5M18 15h3"/>',
    download: '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/>',
    addList: '<path d="M19 8h-14M5 12h9M11 16h-6M15 16h6M18 13v6"/>',
    removeList: '<path d="M19 8h-14M5 12h7M12 16h-7M16 14l4 4M20 14l-4 4"/>',
    diamond: '<path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5"/><path d="M10 12l-2 -2.2l.6 -1"/>',
    bookmark: '<path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>',
    pencil: '<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/><path d="M13.5 6.5l4 4"/>',
    tag: '<circle cx="7.5" cy="7.5" r="1"/><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"/>',
    filter: '<path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"/>',
    filterSearch: '<path d="M11.5 18.5l-2.5 1.5v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-2.914 2.914"/><circle cx="18" cy="17" r="3"/><path d="M20.2 19.2l1.8 1.8"/>',
    chevronDown: '<path d="M6 9l6 6l6 -6"/>',
    chevronUp: '<path d="M6 15l6 -6l6 6"/>',
    chevronLeft: '<path d="M15 6l-6 6l6 6"/>',
    world: '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M8 11v-4a4 4 0 0 1 8 0v4"/>',
    users: '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0 -3 -3.85"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    checks: '<path d="M7 12l5 5l10 -10M2 12l5 5m5 -5l5 -5"/>',
    arrowsDiagonal: '<path d="M16 4h4v4M14 10l6 -6M8 20h-4v-4M4 20l6 -6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="M21 21l-6 -6"/>',
    circleCheck: '<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2l4 -4"/>',
    sparkle: '<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/>',
    x: '<path d="M18 6l-12 12M6 6l12 12"/>',
    linkedin: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0 -4 0"/>',
  };
  const ICON = Object.fromEntries(Object.entries(P).map(([k, d]) => [k, (size, cls) => T(d, size, cls)]));
  const LOGO_FALLBACK = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect width="20" height="20" rx="2" fill="#D1D5DB"/><path d="M10.8 3a1.2 1.2 0 0 1 1 1.16V16h.7V6.67h2.17a1.17 1.17 0 0 1 1.16 1.17V16h.84a.5.5 0 0 1 0 1H3.33a.5.5 0 0 1 0-1h.84V6.3c0-.48.29-.9.73-1.08l5.33-2.14c.18-.07.38-.1.57-.08ZM6.67 14a.5.5 0 0 0 0 1h2.66a.5.5 0 0 0 0-1H6.67Zm0-2.33a.5.5 0 0 0 0 1h2.66a.5.5 0 0 0 0-1H6.67Zm0-2.33a.5.5 0 0 0 0 1h2.66a.5.5 0 0 0 0-1H6.67Zm0-2.33a.5.5 0 0 0 0 1h2.66a.5.5 0 0 0 0-1H6.67Z" fill="#fff"/></svg>';

  const checkbox = (attrs, state, disabled) => `<label class="bs-checkbox-wrapper${disabled ? ' bs-checkbox-wrapper-disabled' : ''}"><span class="bs-checkbox${state === true ? ' bs-checkbox-checked' : ''}${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}${disabled ? ' disabled' : ''}><span class="bs-checkbox-inner"></span></span></label>`;
  const shBtn = (label, icon, attrs = '', extra = '') => `<button type="button" class="shd-button shd-button--secondary btn-custom-secondary${extra}" ${attrs}><span>${icon}<span>${label}</span></span></button>`;
  window.LF_ICON = ICON;

  /* ───────── page header title (header.tsx getHeaderContent) ───────── */
  window.LF_TITLE = (screen) => `<div class="p-0"><div class="d-flex header-with-notification"><div class="d-flex align-items-center"><h2 class="semibold-3 mb-0 popover-arrow-color-txt">${screen === 'verifier' ? 'Email Verifier' : 'Lead Finder'}</h2></div></div></div>`;

  /* ───────── Lead Finder header: rc-tabs + bulk action buttons (v2-lead-header.tsx L539-886) ───────── */
  function leadHeader(d) {
    const dis = (b) => (b ? ' disabled' : '');
    const none = !d.selected;
    const btns = [];
    btns.push(shBtn('Save to List', ICON.addList(16), `data-lf-act="save-list"${dis(none)}`, ' add-to-list-dropdown__toggle'));
    if (d.tab === 'saved') btns.push(shBtn('Remove From List', ICON.removeList(16), `data-lf-act="remove-list"${dis(none)}`));
    if (d.tab !== 'saved') {
      btns.push(shBtn('View Work Email', ICON.mail(16), `data-lf-act="reveal-email"${dis(none)}`));
      btns.push(shBtn('View Phone', ICON.phone(16), `data-lf-act="reveal-phone"${dis(none)}`));
    }
    if (d.tab === 'saved') btns.push(shBtn('Save as Prospect', ICON.userList(16), `data-lf-act="noop"${dis(none)}`));
    btns.push(shBtn('Add to Sequence', ICON.send(16), `data-lf-act="add-seq"${dis(none)}`));
    if (d.tab === 'saved') {
      btns.push(shBtn('Tags', ICON.tag(16), `data-lf-act="noop"${dis(none)}`));
      btns.push(shBtn('Export', ICON.download(16), 'data-lf-act="noop"'));
    }
    return `<header class="v2-lead-header" data-testid="v2-lead-header">
      <div class="bs-tabs bs-tabs-top bs-tabs-small v2-lead-header__tabs"><div role="tablist" class="bs-tabs-nav"><div class="bs-tabs-nav-wrap"><div class="bs-tabs-nav-list" style="transform: translate(0px, 0px);">
        <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0">Companies</div></div>
        <div class="bs-tabs-tab bs-tabs-tab-active"><div role="tab" aria-selected="true" class="bs-tabs-tab-btn" tabindex="0">People</div></div>
        <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><span class="v2-lead-header__tab-with-badge">Data Enrichment<span class="new-badge v2-lead-header__companies-new-badge">New</span></span></div></div>
        <div class="bs-tabs-ink-bar bs-tabs-ink-bar-animated" data-lf="ink"></div>
      </div></div></div></div>
      <div class="v2-lead-header__actions"><div class="v2-lead-header__action-group">${btns.join('')}</div></div>
    </header>`;
  }

  /* ───────── filter sidebar (v2-lead-sidebar.tsx + v2-lead-filter.tsx + saved-filter.tsx) ───────── */
  const chip = (v) => `<span><div class="bs-tag filter-tag filter-tag-include"><span>${esc(v)}</span><span class="bs-tag-close-icon"><i class="sh-close"></i></span></div></span>`;
  function appliedFilter(label, icon, tags) {
    const shown = tags.slice(0, 3).map(chip).join('');
    const more = tags.length > 3 ? `<div class="bs-tag filter-tag more-tag"><span>+${tags.length - 3}</span></div>` : '';
    return `<div class="accordion__item first-in-group" data-filter-id="${label}"><div class="accordion-item-heading-tag accordion-item-selected-tag" role="heading" aria-level="3"><div class="::before:none w-100" role="button" tabindex="0" aria-expanded="false">
      <div class="w-100 accordian-label"><div class="icon">${icon}</div><div class="label"><span>${label}</span></div><div class="d-flex align-items-center accordian-label-end"><span class="accordion-plus-icon">${ICON.plus(16)}</span></div></div>
      <div class="filter-applied-collapse"><div class="filter-section filter-section-includes"><span class="filter-section-label">Include</span><div class="filter-section-chips">${shown}${more}</div></div></div>
    </div></div></div>`;
  }
  function plainFilter(label, icon, locked) {
    return `<div class="accordion__item"><div class="accordion-item-heading" role="heading" aria-level="3"><div class="::before:none w-100" role="button" tabindex="0" aria-expanded="false">
      <div class="w-100 accordian-label"><div class="icon">${icon}</div><div class="label"><span>${label}</span></div><div class="d-flex align-items-center accordian-label-end"><span class="accordion-plus-icon">${ICON.plus(16)}</span></div></div>
    </div></div></div>`;
  }
  function group(name, count, inner, applied, expanded = true) {
    return `<div class="filter-group-accordion${applied ? ' filter-group-accordion--applied' : ''}${expanded ? '' : ' filter-group-collapsed'}">
      <div class="accordion__heading" role="heading" aria-level="3"><div class="::before:none w-100" role="button" tabindex="0" aria-expanded="${expanded}">
        <div class="filter-group-header w-100"><span class="filter-group-title">${name}${count ? `<span class="filter-group-count">${applied ? count : `(${count})`}</span>` : ''}</span>
          <div class="d-flex align-items-center gap-8">${applied ? '<button type="button" class="clear-all-button btn btn-link" data-lf-clear-all>Clear All</button>' : ''}${(expanded ? ICON.chevronUp : ICON.chevronDown)(16, 'accordion-chevron-icon')}</div></div>
      </div></div>
      ${expanded ? `<div class="accordion__panel">${inner}</div>` : ''}
    </div>`;
  }
  function sidebar(d) {
    const tabs = [['total', 'Total', d.counts.total], ['new', 'New', d.counts.new], ['saved', 'Saved', d.counts.saved]].map(([k, l, c]) => `<button type="button" class="v2-lead-sidebar-tabs__tab${d.tab === k ? ' is-active' : ''}" data-lf-tab="${k}"><span class="v2-lead-sidebar-tabs__tab-label">${l}</span>${c ? `<span class="v2-lead-sidebar-tabs__tab-count">${c}</span>` : ''}</button>`).join('');
    let groups;
    if (d.tab === 'saved') {
      const applied = d.listFilter ? group('Applied Filters', 1, appliedFilter('People List', ICON.userList(16), [d.listFilter]), true) : '';
      groups = applied
        + group('List Inclusion / Exclusion', 0, (d.listFilter ? '' : plainFilter('People List', ICON.userList(16))) + plainFilter('Company List', ICON.addList(16)), false)
        + group('Personal', 0, plainFilter('Name', ICON.userList(16)) + plainFilter('Location', ICON.world(16)), false)
        + group('Company', 0, '', false, false) + group('Current Role', 0, '', false, false);
    } else {
      groups = group('Applied Filters', 4,
        appliedFilter('Job Title', ICON.userList(16), ['CFO', 'VP Finance', 'Head of Finance', 'Finance Director'])
        + appliedFilter('Location', ICON.world(16), ['United Kingdom'])
        + appliedFilter('Industry', ICON.addList(16), ['Financial Services'])
        + appliedFilter('Employee Count', ICON.users(16), ['51 - 100', '101 - 500']), true)
        + group('List Inclusion / Exclusion', 0, '', false, false) + group('Personal', 0, '', false, false) + group('Company', 0, '', false, false)
        + group('Current Role', 0, '', false, false) + group('Experience', 0, '', false, false);
    }
    return `<aside class="v2-leads-navigation v2-leads-sidebar v2-leadsSideNav col-lg-3" aria-expanded="true"><div class="v2-lead-sidebar-content">
      <div class="v2-expand-btn" role="button" tabindex="0" aria-label="Collapse filters">${ICON.chevronLeft(17, 'gray-txt-15')}</div>
      <div class="v2-lead-sidebar-body">
        <div class="v2-lead-sidebar-tabs-container"><div class="v2-lead-sidebar-tabs">${tabs}</div></div>
        <div class="v2-lead-filter-wrapper"><div class="v2-lead-filter-root v2-people-filter">
          <div class="v2-lead-filter-header">
            <div class="v2-leads-search"><div class="w-100"><div class="auto-search-container"><span class="search-icon">${ICON.search(16)}</span><input type="text" class="auto-search-input-saved" placeholder="${d.tab === 'saved' ? 'Search a name or keyword' : 'Ask Sage anything...'}" aria-label="Search a name or keyword" maxlength="200"></div></div></div>
            <h3 class="v2-leads-filter"><div class="d-flex align-items-center gap-8"><div>${ICON.filter(16, 'sh-filter')}Filters</div></div>
              <div class="v2-leads-filter-actions">${d.tab !== 'saved' ? `<div class="v2-leads-filter-search-icon" role="button" tabindex="0" aria-label="Search filter name">${ICON.filterSearch(16)}</div>` : ''}</div></h3>
          </div>
          <div class="v2-lead-filters-accordion-container"><div class="v2-lead-filters-accordion"><div class="shd-accordion" data-accordion-component="Accordion">${groups}</div></div></div>
          <div class="v2-lead-filter-footer"><div class="v2-saved-filters-container">
            <div class="v2-saved-filters-button"><button type="button" class="btn-solid btn-solid-primary btn-solid-md" disabled><i class="sh-search search-icon"></i><span class="search-txt">Search</span></button></div>
            <div class="v2-saved-filters-details">
              <div class="v2-saved-filters"><div class="d-flex align-items-center" role="button" tabindex="0" data-lf-act="saved-filters" aria-haspopup="dialog"><div class="icon">${ICON.bookmark(16)}</div><span>Saved Filters</span></div></div>
              <div class="v2-save-filter"><span class="v2-save-filter-txt">Save Filter</span></div>
            </div>
          </div></div>
        </div></div>
      </div>
    </div></aside>`;
  }

  /* ───────── saved filters popover (saved-filter.tsx: OverlayPopover + Transfer, pencil and trash per row) ───────── */
  window.LF_SAVED_FILTERS_POPOVER = (filters) => `<div class="popover bs-popover-top prospect-tag-popover lf-saved-pop show" role="dialog" aria-label="Saved filters"><div class="popover-body"><div class="bs-popover-content">
    <div class="transfer-container"><div class="transfer-body">
      <div class="transfer-search"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search" class="bs-input-md bs-input" value="" aria-label="Search saved filters"></span></div>
      <div class="transfer-content"><ul class="transfer-list">${filters.map((f) => `<div><li><div class="d-flex align-items-center"><p class="v2-search-seved-filter">${esc(f.name)}</p><div class="d-flex">${ICON.pencil(16, 'edit-icon')}<span role="button" tabindex="0" class="lf-trash" data-lf-del-filter="${f.id}" aria-label="Delete ${esc(f.name)}">${ICON.trash(16)}</span></div></div></li></div>`).join('')}</ul></div>
    </div></div>
  </div></div></div>`;

  /* ───────── table cells (cell-renderers) ───────── */
  const initials = (l) => (l.first[0] + l.last[0]).toUpperCase();
  function nameCell(l) {
    return `<div class="v2-lead-name-cell"><div class="v2-lead-avatar"><span class="bs-avatar bs-avatar-sm bs-avatar-circle v2-lead-avatar-placeholder lf-av-${l.id % 5}"><span class="bs-avatar-string">${initials(l)}</span></span></div>
      <div class="v2-lead-name-text"><button type="button" class="v2-lead-name-text--clickable d-flex align-items-center gap-4"><span class="text-truncate">${esc(l.first + ' ' + l.last)}</span><span class="v2-lead-modal-open-indicator" aria-hidden="true">${ICON.arrowsDiagonal(14)}</span></button></div></div>`;
  }
  const textCell = (v) => `<div class="v2-lead-text-cell"><span class="text-truncate">${esc(v || '-')}</span></div>`;
  function companyCell(l) {
    return `<div class="v2-lead-company-cell"><div class="v2-lead-company-logo">${LOGO_FALLBACK}</div><div class="v2-lead-name-text"><div class="v2-lead-name-text--clickable d-flex align-items-center gap-4"><span class="text-truncate">${esc(l.company)}</span><span class="v2-lead-modal-open-indicator" aria-hidden="true">${ICON.arrowsDiagonal(14)}</span></div></div></div>`;
  }
  const enriching = (cls, icon) => `<div class="${cls}"><button type="button" class="shd-button shd-button--secondary v2-lead-reveal-btn" disabled><span>${icon}<span class="revealing-text">Enriching<div class="loader"></div></span></span></button></div>`;
  function emailCell(l) {
    if (l.email) return `<div class="v2-lead-email-cell"><i class="sh-circle-check verification-status-valid green-txt-14" aria-label="Valid"></i><span class="v2-lead-email-text">${esc(l.email)}</span><div class="v2-lead-email-copy-icon">${ICON.copy(16)}</div></div>`;
    if (l.revealing) return enriching('v2-lead-email-cell', ICON.mail(16));
    if (l.emailNotFound) return '<div class="v2-lead-email-cell">-</div>';
    return `<div class="v2-lead-email-cell"><button type="button" class="shd-button shd-button--secondary v2-lead-reveal-btn" data-nx-tip="1 Credit Required" data-lf-row-reveal="${l.id}"><span>${ICON.mail(16)}View Email</span></button></div>`;
  }
  function personalCell(l) {
    if (l.personal) return `<div class="v2-lead-email-cell"><span class="v2-lead-email-text">${esc(l.personal)}</span></div>`;
    return `<div class="v2-lead-email-cell"><button type="button" class="shd-button shd-button--secondary v2-lead-reveal-btn" data-nx-tip="2 Credits Required"${l.revealing ? ' disabled' : ''}><span>${ICON.mail(16)}View Email</span></button></div>`;
  }
  function phoneCell(l) {
    if (l.phone) return `<div class="v2-lead-phone-cell v2-lead-email-cell"><span class="v2-lead-phone-text">${esc(l.phone)}</span><div class="v2-lead-phone-copy-icon">${ICON.copy(16)}</div></div>`;
    if (l.revealing && l.revealingPhone) return enriching('v2-lead-phone-cell', ICON.phone(16));
    if (l.phoneNotFound) return '<div class="v2-lead-phone-cell">-</div>';
    return `<div class="v2-lead-phone-cell"><button type="button" class="shd-button shd-button--secondary v2-lead-reveal-btn" data-nx-tip="View Email + Phone: 7 credits required"${l.revealing ? ' disabled' : ''}><span>${ICON.phone(16)}View Phone</span></button></div>`;
  }
  const listCell = (lists) => (lists && lists.length
    ? `<div class="v2-lead-text-cell lf-pills">${lists.map((n) => `<span class="bs-tag bs-tag-blue-17 regular-2">${esc(n)}</span>`).join('')}</div>` : textCell('-'));

  const COLS = {
    name: ['Name', 240, nameCell],
    title: ['Job Title', 160, (l) => textCell(l.title)],
    company: ['Company Name', 220, companyCell],
    email: ['Work Email', 200, emailCell],
    personal: ['Personal Email', 210, personalCell],
    phone: ['Phone Number', 200, phoneCell],
    dept: ['Department', 160, (l) => textCell(l.dept)],
    location: ['Location', 220, (l) => textCell(l.city)],
    lists: ['List', 220, (l) => listCell(l.lists)],
  };

  /* Selection banner: shared tanstack-table lead-selection-banner.tsx. Today copy verbatim; Proposed changes the words (A). */
  function banner(d) {
    if (!d.count) return '';
    const caret = ICON.chevronDown(12);
    const link = (label, attr, isNew) => `<button type="button" class="shd-button shd-button--link bs-lead-selection-banner__link-btn p-0${isNew ? ' nx-new' : ''}" ${attr}><span>${label}</span></button>`;
    const div = '<span class="alert-divider-vertical"></span>';
    if (d.view === 'today') {
      return `<div class="bs-lead-selection-banner"><div class="bs-lead-selection-banner__pill-wrapper"><span class="bs-lead-selection-banner__pill" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false" data-lf-pill><span class="bs-lead-selection-banner__pill-count">${fmt(d.count)} ${d.count === 1 ? 'lead' : 'leads'}</span>${caret}</span></div>
        <span class="bs-lead-selection-banner__selected-text">selected.</span>
        <div class="bs-lead-selection-banner__links">${div}${d.all ? '' : `${link('Select all leads', 'data-lf-selall')}${div}`}${link('Clear Selection', 'data-lf-clear')}</div></div>`;
    }
    let pill, tail;
    if (d.all) { pill = `All ${fmt(d.total)} ${d.total === 1 ? 'lead' : 'leads'} ${d.scope}`; tail = d.total === 1 ? 'is selected.' : 'are selected.'; }
    else if (d.count === d.pageRows && d.total > d.pageRows) { pill = `All ${fmt(d.count)} on this page`; tail = 'are selected.'; }
    else { pill = `${fmt(d.count)} of ${fmt(d.total)} leads`; tail = 'selected.'; }
    const selAll = d.all ? '' : `${link(d.count === d.pageRows && d.total > d.pageRows ? `Select all ${fmt(d.total)} leads` : `Select all ${fmt(d.total)}`, 'data-lf-selall', true)}${div}`;
    return `<div class="bs-lead-selection-banner"><div class="bs-lead-selection-banner__pill-wrapper"><span class="bs-lead-selection-banner__pill" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false" data-lf-pill><span class="bs-lead-selection-banner__pill-count nx-new">${pill}</span>${caret}</span></div>
      <span class="bs-lead-selection-banner__selected-text nx-new">${tail}</span>
      <div class="bs-lead-selection-banner__links">${div}${selAll}${link('Clear selection', 'data-lf-clear')}</div></div>`;
  }

  function pageModel(cur, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '…', last];
    if (cur >= last - 3) return [1, '…', last - 4, last - 3, last - 2, last - 1, last];
    return [1, '…', cur - 1, cur, cur + 1, '…', last];
  }
  function pagination(d) {
    const cur = d.page + 1;
    const li = (n) => (n === '…'
      ? '<li class="custom-ellipsis page-item"><a class="page-link" role="button" href="#" tabindex="-1"><span aria-hidden="true">…</span><span class="sr-only">More</span></a></li>'
      : n === cur ? `<li class="page-item active"><span class="page-link">${n}<span class="sr-only">(current)</span></span></li>`
        : `<li class="page-item"><a class="page-link" role="button" href="#" data-lf-page="${n - 1}">${n}</a></li>`);
    const arrow = (dir, on) => (on
      ? `<li class="page-item"><a class="page-link" role="button" href="#" data-lf-page="${dir}"><span aria-hidden="true"><i class="sh-chevron-${dir === 'prev' ? 'left' : 'right'}"></i></span><span class="sr-only">${dir === 'prev' ? 'Previous' : 'Next'}</span></a></li>`
      : `<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-${dir === 'prev' ? 'left' : 'right'}"></i></span><span class="sr-only">${dir === 'prev' ? 'Previous' : 'Next'}</span></span></li>`);
    const from = d.page * d.pageSize + 1;
    const to = Math.min(d.total, from + d.pageSize - 1);
    return `<div class="tanstack-table--pagination">
      <div class="tanstack-table--pagination__container"><p class="tanstack-table--pagination__text">Showing</p><p class="tanstack-table--pagination__text">${fmt(from)}-${fmt(to)} of ${fmt(d.total)}</p></div>
      <div class="tanstack-table--pagination__separator"></div>
      <ul class="pagination">${arrow('prev', cur > 1)}${pageModel(cur, d.pages).map(li).join('')}${arrow('next', cur < d.pages)}</ul>
    </div>`;
  }

  function table(d) {
    const cols = d.cols.map((k) => COLS[k]);
    let left = 0;
    const cell = (k, i, inner, isHead) => {
      const [, w] = COLS[k];
      const pinned = i === 0;
      const style = `width: ${w}px; min-width: ${w}px;${pinned ? ' left: 0px;' : ''}`;
      return `<div class="${isHead ? 'tanstack-table--th' : 'tanstack-table--td'}${pinned ? (isHead ? ' th--pinned th--pinned__left' : ' td--pinned td--pinned__left') : ''}" style="${style}">${inner}</div>`;
    };
    const selOnPage = d.rows.filter(d.isSel).length;
    const headState = d.rows.length && selOnPage === d.rows.length ? true : selOnPage ? 'mixed' : false;
    const head = `<div class="tanstack-table--thead"><div class="tanstack-table--tr">${d.cols.map((k, i) => cell(k, i, i === 0
      ? `<div class="column-header-content"><div class="column-header-content--name"><div class="column-header-content--checkbox">${checkbox('data-lf="check-all" aria-label="Select all on this page"', headState)}</div><span class="column-header-content--headText"><span class="column-header-content--colHeadText">${COLS[k][0]}</span></span></div></div>`
      : `<div class="column-header-content"><div class="column-header-content--name"><div class="column-header-content--headText"><span class="column-header-content--colHeadText">${COLS[k][0]}</span></div></div></div><div class="column-header-resizer ltr"><div class="column-header-resizer--handle"></div></div>`, true)).join('')}</div></div>`;
    const body = d.rows.map((l) => `<div class="tanstack-table--tr${d.isSel(l) ? ' lf-row-sel' : ''}">${d.cols.map((k, i) => cell(k, i, `<div class="column-cell-content">${i === 0 ? `<div class="column-cell-content--checkbox">${checkbox(`data-lf-row="${l.id}" aria-label="Select ${esc(l.first + ' ' + l.last)}"`, d.isSel(l))}</div>` : ''}<div class="column-cell-content--value">${COLS[k][2](l)}</div><div class="column-cell-content--resizer"></div></div>`)).join('')}</div>`).join('');
    left = d.cols.reduce((s, k) => s + COLS[k][1], 0);
    return `<div class="tanstack-table${d.count ? ' has-selection-alert' : ''} v2-lead-tanstack-table">
      <div data-lf="banner">${banner(d)}</div>
      <div class="tanstack-table--wrapper"><div class="tanstack-table--table" style="width: ${left}px;">${head}<div class="tanstack-table--tbody">${body}</div></div></div>
      ${pagination(d)}
    </div>`;
  }

  window.LF_PAGE = (d) => `<div class="v2-lead-container px-0 container-fluid">
    ${leadHeader(d)}
    <div class="m-0 row lf-row">${sidebar(d)}
      <div class="v2-lead-content col">${d.total ? `<div class="v2-lead-table-wrapper">${table(d)}</div>`
        : `<div class="v2-no-search-lead"><div class="no-search-result"><img src="${IMG('no-search-result-icon.svg')}" alt=""><h3 class="semibold-4 mt-3">${d.tab === 'saved' ? 'No saved leads' : 'No results found'}</h3></div></div>`}</div>
    </div>
  </div>`;
  window.LF_BANNER = banner;

  /* ───────── today's modals, production markup and copy ───────── */
  function modalShell({ cls, title, body, footer, close = false, footerContent = '' }) {
    return `<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" tabindex="-1" class="fade bs-modal-container ${cls} modal show" style="display: block;" aria-label="${esc(title.replace(/<[^>]+>/g, ''))}">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-header modal-header"><div class="modal-title h4">${title}</div>${close ? '<button type="button" class="close btn btn-solid btn-solid-default btn-solid-md" data-lf-x aria-label="Close"><i class="sh-close"></i></button>' : ''}</div>
          <div class="bs-modal-body modal-body">${body}</div>
          <div class="bs-modal-footer modal-footer">${footerContent ? `<div class="bs-modal-footer-content">${footerContent}</div>` : ''}${footer ? `<div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;">${footer}</div>` : ''}</div>
        </div></div></div>
      </div></div>`;
  }
  const btnCancel = (cls = 'btn-solid btn-solid-outlined btn-solid-md') => `<button type="button" class="${cls}" data-lf-cancel>Cancel</button>`;
  const btnSubmit = (label, cls = 'btn-solid btn-solid-primary btn-solid-md', dis) => `<button type="button" class="${cls}" data-lf-submit${dis ? ' disabled' : ''}>${label}</button>`;

  /* BulkRevealTagModal (bulk-reveal-tag-modal.tsx L39-75): ConfirmationModalV3 "Add Tag", no title icon, no close */
  window.LF_TODAY_TAG_MODAL = (n) => modalShell({
    cls: 'confirmation-modal-v3 bulk-select-tag-modal', title: `<div class="confirmation-modal-v3--title d-flex align-items-center icon-"><div class="orange-txt-14 d-flex align-items-center" style="color: #1f2937;">${ICON.tag(20)}</div><h2>Add Tag</h2></div>`,
    body: `<div class="confirmation-modal-v3--body"><div class="confirmation-modal-v3--body__content"><div class=""><div><span class="bulk-select-tag-modal-text">${n} leads are selected. Applying tag will help you find them later.</span></div>
      <div class="tags-autosuggest-container lf-tag-input"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default"><input placeholder="Enter a tag" class="bs-input-md bs-input" aria-label="Enter a tag"></span></div></div></div></div>`,
    footer: btnCancel() + btnSubmit('Continue'),
  });

  /* CreditNotAvailableModal (credit-not-available-modal.tsx) via GetContactDetail */
  window.LF_TODAY_NO_CREDIT = (perLead) => modalShell({
    cls: 'get-contact-info-modal', title: `<div class="d-flex align-items-center"><div class="orange-txt-14">${ICON.userList(18, 'orange-txt-14')}</div><div>Add credits to see contact information</div></div>`,
    body: `<div class="mt-2"><div class="mt-2"><span class="regular-2 blue-txt-15">You don't have enough lead finder credits to view all the selected leads, as it requires ${perLead} per lead.</span></div><div class="second-line-get-contact-modal"><span class="regular-2">Please add more credits or upgrade your plan to continue.</span></div></div>`,
    footer: btnCancel() + btnSubmit('Add Credits'),
  });

  /* RemoveFromListModal (remove-from-list-modal.tsx L72-131): list picker with checkboxes, "Apply" */
  window.LF_REMOVE_PICKER = (lists, opts = {}) => modalShell({
    cls: `remove-from-list-modal${opts.proposed ? ' lf-proposed-picker' : ''}`, title: `<div class="d-flex modal-header-title">${ICON.removeList(24)}<div class="pl-2">${opts.title || 'Remove From List'}</div></div>`,
    body: `<div class="overflow-hidden saved-tab-tags remove-tag-modal remove-from-list-modal__input"><div class="tags-autosuggest-container"><div class="fixed-height-input-container lf-picker-input"><input placeholder="Enter list" aria-label="Enter list"></div>
      <div class="react-autosuggest__suggestions-container react-autosuggest__suggestions-container--open lf-suggest"><ul class="react-autosuggest__suggestions-list">${lists.map((l) => `<li class="react-autosuggest__suggestion"><label class="lf-suggest-row">${checkbox(`data-lf-pick="${l.id}"`, !!l.checked)}<span>${esc(l.name)}</span>${l.meta ? `<span class="lf-suggest-meta nx-new">${l.meta}</span>` : ''}</label></li>`).join('')}</ul></div></div></div>`,
    footer: `<button type="button" class="btn-ghost btn-ghost-primary btn-ghost-md" data-lf-cancel>Cancel</button>${btnSubmit(opts.submit || 'Apply', 'btn-solid btn-solid-primary btn-solid-md', true)}`,
  });

  /* SaveFilterModal, Delete variant (save-filter-modal.tsx L101-199) */
  window.LF_TODAY_DELETE_FILTER = () => modalShell({
    cls: 'save-filter-modal', title: `<div class="d-flex align-items-center">${ICON.trash(24, 'delete-icon')}<div>Delete this saved filter</div></div>`,
    body: '<p>This action can\'t be reversed.</p><p>Are you sure, you want to continue?</p>',
    footer: btnCancel() + btnSubmit('Delete', 'btn-solid btn-solid-danger btn-solid-md'),
  });

  /* Save to List modal (add-to-list-dropdown.tsx L620-735): search, sections, enrichment switch, footer with per-lead chip */
  window.LF_SAVE_TO_LIST = (o) => {
    const sec = (key, title, icon, lists, alreadyIn) => `<div class="add-to-list-dropdown__section"><div class="add-to-list-dropdown__section-header add-to-list-dropdown__section-header--expanded">
        <div class="add-to-list-dropdown__section-header-left"><span class="add-to-list-dropdown__section-icon">${icon}</span><span class="add-to-list-dropdown__section-title">${title}</span></div>
        <div class="add-to-list-dropdown__section-chevron">${ICON.chevronUp(16)}</div></div>
      <div class="add-to-list-dropdown__section-content"><div class="add-to-list-dropdown__section-divider"></div><div class="add-to-list-dropdown__list">
        ${lists.map((l) => `<div class="add-to-list-dropdown__list-item${alreadyIn ? ' add-to-list-dropdown__list-item--disabled add-to-list-dropdown__list-item--already-in' : ''}" role="button" tabindex="0" data-lf-list="${l.id}">${checkbox('tabindex="-1"', alreadyIn || o.picked.includes(l.id), alreadyIn)}<div class="add-to-list-dropdown__list-item-content"><div class="d-flex justify-content-between align-items-center w-100"><span class="add-to-list-dropdown__list-item-label">${esc(l.name)}</span></div></div></div>`).join('')}
      </div></div></div>`;
    const chipText = o.chip;
    const footer = `<div class="add-to-list-dropdown__modal-footer"><div class="add-to-list-dropdown__create-new" role="button" tabindex="0">${ICON.plus(16)}<span class="add-to-list-dropdown__create-new-text">Create New List</span></div>
      <div class="d-flex align-items-center gap-12 cursor-pointer">${chipText ? `<div class="lead-credit-chip" data-nx-tip="${o.phone ? 'Saving to a list will enrich email and phone details for the selected lead(s).' : 'Saving to a list will enrich email details for the selected lead(s).'}">${ICON.diamond(14)}<span class="lead-credit-chip__text">${chipText}</span></div>` : ''}
      <button type="button" class="shd-button shd-button--primary add-to-list-dropdown__add-btn${o.proposed ? ' nx-new' : ''}" data-lf-submit${o.picked.length ? '' : ' disabled'}><span>${o.saveLabel}</span></button></div></div>`;
    return modalShell({
      cls: 'add-to-list-dropdown add-to-list-dropdown--modal', close: true, title: '<div class="d-flex modal-header-title"><div class="">Save to List</div></div>',
      body: `<div class="add-to-list-dropdown__modal-body"><div class="transfer-container"><div class="transfer-body">
        <div class="transfer-search"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default transfer-search-input"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search" class="bs-input-md bs-input" aria-label="Search lists"></span></div>
        <div class="transfer-content">${o.alreadyIn.length ? sec('alreadyIn', 'Already In Lists', ICON.checks(16), o.alreadyIn, true) : ''}${sec('public', 'Public', ICON.world(16), o.publicLists)}${sec('private', 'Private', ICON.lock(16), o.privateLists)}</div>
        ${o.showSwitch ? `<div class="add-to-list-dropdown__enrichment add-to-list-dropdown__enrichment--people"><div class="add-to-list-dropdown__enrichment-people"><div class="people-enrichment-switch"><div class="switchToggle"><input type="checkbox" id="lf-enrich" ${o.phone ? 'checked' : ''} data-lf-switch><label for="lf-enrich"></label></div><span class="people-enrichment-switch__label">Save Lead with Email + Phone Enrichment</span></div></div></div>` : ''}
      </div></div></div>`,
      footerContent: footer, footer: '',
    });
  };

  /* Add to Sequence with reveal (add-to-sequence-reveal-modal.tsx on shared add-to-sequence-modal.tsx) */
  window.LF_ADD_TO_SEQ = (o) => modalShell({
    cls: 'add-to-sequence-container add-sequence-prospect-modal add-to-sequence-reveal-modal', close: true,
    title: `<div class="d-flex align-items-center"><div>${ICON.send(20)}</div><h2 class="ml-0">Add To Sequence</h2></div>`,
    body: `<div class="modal-text pb-1">Sequence</div>
      <div class="bs-select-box sequence-select-dropdown lf-select"><span>${esc(o.seq)}</span>${ICON.chevronDown(16)}</div>
      <div class="modal-text pb-1 mt-3">Sequence Steps</div>
      <div class="bs-select-box lf-select"><span>Step 1: Email</span>${ICON.chevronDown(16)}</div>
      ${o.showSwitch ? `<div class="add-to-sequence-reveal-modal__enrichment"><div class="people-enrichment-switch"><div class="switchToggle"><input type="checkbox" id="lf-enrich2" ${o.phone ? 'checked' : ''} data-lf-switch><label for="lf-enrich2"></label></div><span class="people-enrichment-switch__label">Save Lead with Email + Phone Enrichment</span></div></div>` : ''}`,
    footer: `${o.chip ? `<div class="add-to-sequence-reveal-modal__credit"><div class="lead-credit-chip" data-nx-tip="${o.phone ? 'Adding to a sequence will enrich email and phone details for unenriched selected lead(s).' : 'Adding to a sequence will enrich email details for unenriched selected lead(s).'}">${ICON.diamond(14)}<span class="lead-credit-chip__text">${o.chip}</span></div></div>` : ''}${btnSubmit(o.submit || 'Add', `btn-solid btn-solid-primary btn-solid-md${o.proposed ? ' nx-new' : ''}`)}`,
  });

  /* ───────── Email Verifier (email-input-and-file-upload.tsx L131-211, file-select-and-drop-file.tsx) ───────── */
  window.LF_VERIFIER = (d) => {
    const shown = d.emails.slice(0, 80);
    const pills = shown.map((e) => `<div class="shd-pills shd-pills--outline shd-pills--md"><span class="pills-label">${esc(e)}</span><span class="pills-close" role="button" aria-label="Remove ${esc(e)}"><i class="sh-close"></i></span></div>`).join('');
    const more = d.emails.length > shown.length ? `<div class="shd-pills shd-pills--outline shd-pills--md lf-more-pill"><span class="pills-label">+${fmt(d.emails.length - shown.length)} more</span></div>` : '';
    const over = d.emails.length > 0 && d.credits < d.emails.length;
    const creditsMsg = d.view === 'today' && over ? (d.credits === 0 ? 'You don\'t have enough credits. To verify all buy more credits' : `Only ${d.credits} email${d.credits > 1 ? 's' : ''} will be verify. To verify all buy more credits`) : '';
    const disabled = d.view === 'today' ? (d.emails.length === 0 || over) : d.emails.length === 0;
    return `<div class="email-verifier-container"><div class="email-input-and-file-upload-container">
      <div class="email-input-and-file-upload">
        <div class="email-account-input"><div class="email-account-input-container">
          <span class="email-account-input-title">Enter an email or upload a file to verify</span>
          <div class="emails-and-domains-input--container${d.view === 'today' && over ? ' error' : ''}" data-lf-ev-input>
            <div class="emails-and-domains-input--pills">${pills}${more}<input class="emails-and-domains-input--input" value="" placeholder="${d.emails.length ? '' : 'Add entries with comma, semicolon, space or line breaks'}" aria-label="Emails to verify"></div>
            <span class="emails-and-domains-input--count">${fmt(d.emails.length).replace(/,/g, '')}/5000</span>
          </div>
          <div class="emails-and-domains-input--helper-wrapper"><span class="emails-and-domains-input--error-msg">${creditsMsg}</span></div>
          <button type="button" class="shd-button shd-button--primary email-input-btn" data-lf-verify${disabled ? ' disabled' : ''}><span>${d.busy ? '<div class="spinner-border email-input-btn-loader" role="status"></div>Verifying' : 'Verify'}</span></button>
        </div></div>
        <div class="drag-drop-file-container">
          <div class="drag-drop-title"><div class="email-credits"><span role="button" tabindex="0">${ICON.diamond(16, 'email-diamond-icon')}${fmt(d.credits).replace(/,/g, '')} Credits</span></div></div>
          <div class="drag-drop-module drag-drop-module-pre-select"><div class="shd-drag-and-drop shd-drag-and-drop--solid"><div class="pre-select"><div class="empty-data-icon-wrapper"><img src="${IMG('upload-cloud.svg')}" alt="sh-logo-icon/"></div>
            <div class="pre-select-container drag-drop-module-pre-select"><span class="pre-select-tagline">or Drag &amp; Drop your CSV with Prospect Details</span><div class="pre-select-file-uploader file-uploader"><div class="choose-file">Choose a file</div></div></div></div></div></div>
          <div class="file-upload-footer"><span class="file-upload-sample-file-container"><a href="#" data-lf-noop>${ICON.download(20)}<span class="file-upload-sample-file-download">Try sample file</span></a></span><div class="file-upload-btn"><button type="button" class="shd-button shd-button--primary next-btn" disabled><span>Next</span></button></div></div>
        </div>
      </div>
      ${d.jobs.length ? `<div class="lf-ev-jobs" data-standin="pagination-accordion-table">${d.jobs.map((j) => `<div class="lf-ev-job"><span class="semibold-2">${j.name}</span><span class="regular-2 gray-txt-15">${j.status}</span></div>`).join('')}</div>`
        : `<div class="email-verified-icon-content"><img src="${IMG('email-verified.svg')}" alt="email-verified"><span class="email-verified-title">Verify emails for better deliverability, fast, accurate, and reliable.</span><span class="email-verified-content">Instantly clean your email list to reduce bounce rates, stay out of spam folders, and<br> reach real inboxes.</span></div>`}
    </div></div>`;
  };
})();
