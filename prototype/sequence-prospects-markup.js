/* Production markup for Sequence > Prospects, reproduced from webui main aeda4e3:
   sequence-single-header, sequence-single-content (rc-tabs), contact-list-content, contact-list-header,
   FilterGadget, organisms/table (react-bootstrap-table-next), ContactNameField, ContactStatusTag,
   activity-column, prospect-tags-row, custom-outcome-dropdown, pause/resume-prospect-modal.
   Anything new is marked .nx-new. Loaded before sequence-prospects.js. */
(function () {
  'use strict';
  const { fmt, h, esc, IMG } = NX;
  const ICON = {
    chevronRight16: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"/></svg>',
    chevronDown16: (cls = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true"${cls ? ` class="${cls}"` : ''}><path fill="currentColor" fill-rule="evenodd" d="M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"/></svg>`,
    gitMerge18: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M7 17.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM7 5.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM17 11.008a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M7 6.992a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M7 6.992a1 1 0 0 1 1 1 3 3 0 0 0 3 3h4a1 1 0 1 1 0 2h-4a5 5 0 0 1-5-5 1 1 0 0 1 1-1Z" clip-rule="evenodd"/></svg>',
    tag20: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M7 4a3 3 0 0 0-3 3v3.586l8.682 8.682a.5.5 0 0 0 .636 0l5.95-5.95a.5.5 0 0 0 0-.636L10.586 4H7Zm-3.536-.536A5 5 0 0 1 7 2h4a1 1 0 0 1 .707.293l9 9 .038.04a2.5 2.5 0 0 1-.038 3.374l-6 6a2.5 2.5 0 0 1-3.414 0l-9-9A1 1 0 0 1 2 11V7a5 5 0 0 1 1.464-3.536Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9 8.007a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/></svg>',
    refresh20: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="refresh-icon-header"><path fill="currentColor" fill-rule="evenodd" d="M4 3.008a1 1 0 0 1 1 1V6.28a9.1 9.1 0 0 1 15.99 4.59 1 1 0 0 1-1.98.275A7.1 7.1 0 0 0 6.19 8.008H9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1ZM3.862 12.017a1 1 0 0 1 1.129.853 7.1 7.1 0 0 0 12.818 3.138H15a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.273a9.1 9.1 0 0 1-15.99-4.59 1 1 0 0 1 .852-1.128Z" clip-rule="evenodd"/></svg>',
    mail18: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="blue-txt-24"><path fill="currentColor" fill-rule="evenodd" d="M5 5.993a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1H5Zm-3 1a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-10Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M2.168 6.453a1 1 0 0 1 1.387-.278L12 11.805l8.445-5.63a1 1 0 0 1 1.11 1.665l-9 6a1 1 0 0 1-1.11 0l-9-6a1 1 0 0 1-.277-1.387Z" clip-rule="evenodd"/></svg>',
    like18: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="gray-txt-15"><path fill="currentColor" fill-rule="evenodd" d="M13 5.007a1 1 0 0 0-1 1v1a5 5 0 0 1-4 4.9v5.1a2 2 0 0 0 2 2h7a1 1 0 0 1 .085.004c.087.007.238-.017.43-.21.2-.199.396-.54.508-1.007l.974-4.869a1 1 0 0 0-.997-.918h-3a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1Zm-5.4 15.2a2.007 2.007 0 0 1-1.6.8H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3a3 3 0 0 0 3-3v-1a3 3 0 0 1 6 0v4h2a3 3 0 0 1 3 3c0 .066-.006.132-.02.197l-1 5-.006.032c-.177.752-.524 1.46-1.044 1.98-.518.517-1.207.84-1.967.791H10a4 4 0 0 1-2.4-.8Zm-1.6-8.2H4v7h2v-7Z" clip-rule="evenodd"/></svg>',
    calendar18: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="gray-txt-15"><path fill="currentColor" fill-rule="evenodd" d="M6 6.004a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1H6Zm-3 1a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-12Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M16 2a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1ZM8 2a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1ZM3 11.004a1 1 0 0 1 1-1h16a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1ZM10 15a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12 14a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/></svg>',
  };

  /* Status filter gadgets (step-filter-mapper.tsx): label, how the prototype counts it, and the banner scope */
  window.SP_TABS = [
    { key: 'total', label: 'Total', match: () => true },
    { key: 'not-contacted', label: 'Not Contacted', dropdown: true, match: (p) => p.status === 'active' && p.step === 1 && !p.opened },
    { key: 'contacted', label: 'Contacted', match: (p) => !(p.status === 'active' && p.step === 1 && !p.opened) },
    { key: 'opened', label: 'Opened', match: (p) => p.opened },
    { key: 'replied', label: 'Replied', match: (p) => p.status === 'replied' },
    { key: 'clicked', label: 'Clicked', dropdown: true, match: (p) => p.clicked },
    { key: 'interested', label: 'Interested', outcome: 'like', deal: '$0', divider: true, match: (p) => p.outcome === 'Interested' },
    { key: 'meeting', label: 'Meeting Booked', outcome: 'calendar', deal: '$0', match: (p) => p.outcome === 'Meeting booked' },
  ];

  /* 50px page header, left side (sequence-single-header.tsx, sequence-single-title.tsx, switch.tsx) */
  window.SP_HEADER = (seq) => `<div class="p-0"><div class="d-flex header-with-notification"><div class="d-flex justify-content-between align-items-center">
    <div class="single-sequence-header d-flex align-items-center">
      <a class="single-sequence-header--title" href="#">Sequence</a>
      <div class="single-sequence-header--icon">${ICON.chevronRight16}</div>
      <div class="sequence-name"><input class="sequence-name--input" value="${esc(seq)}" maxlength="100" readonly aria-label="Sequence name"><span class="hidden-span">${esc(seq)}</span></div>
      <div id="p-t__active-sequence"><div class="switchToggle switch-small"><input type="checkbox" name="Switch" id="nx-seq-active" checked><label for="nx-seq-active" role="button" tabindex="0" aria-label="Sequence is active"><span></span></label></div></div>
    </div></div></div></div>`;

  const checkbox = (attrs, state) => `<label class="bs-checkbox-wrapper"><span class="bs-checkbox${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}><span class="bs-checkbox-inner"></span></span></label>`;
  const STATUS = { active: ['bs-tag-blue-2', 'Active'], paused: ['bs-tag-orange-4', 'Paused'], replied: ['bs-tag-green-2', 'Replied'], finished: ['bs-tag-blue-2', 'Finished'], unsubscribed: ['bs-tag-red-2', 'Unsubscribed'], bounced: ['bs-tag-red-2', 'Bounced'] };
  const DATES = ['Oct 22', 'Oct 21', 'Oct 21', 'Oct 20', 'Oct 18', 'Oct 17', 'Oct 15', 'Oct 14', 'Oct 10', 'Oct 8'];

  function nameCell(p) {
    const [cls, text] = STATUS[p.status] || STATUS.active;
    return `<div class="contact-field-name-container" role="button" tabindex="0"><div class="name-field w-100"><div class="d-flex"><span class="mr-2 "><span class="">${esc(p.first + ' ' + p.last)}</span></span><div><span class="bs-tag ${cls} regular-2 bs-mr-6">${text}</span></div></div></div>
      <div class="email-field bs-mt-2 "><div class="d-flex align-items-center"><div class=""><span class="">${esc(p.email.length > 25 ? p.email.slice(0, 25) + '...' : p.email)} </span></div></div></div></div>`;
  }
  function activityCell(p) {
    const sent = p.status !== 'active' || p.step > 1 || p.opened;
    const w = (on, cls, src) => `<div class="mr-2"><span class="span-wrapper${on ? ' ' + cls : ''}"><img src="${IMG(src)}" alt=""></span></div>`;
    return `<div class="d-flex">${w(sent, 'blue-13', sent ? 'sent-email-blue.svg' : 'send.svg')}${w(p.opened, 'cyan-11', p.opened ? 'seen-email-cyan.svg' : 'activeseen.svg')}${w(p.clicked, 'purple-14', p.clicked ? 'link-enable-2.svg' : 'link-disable-2.svg')}
      <div class="mr-2"><span class="span-wrapper${p.status === 'replied' ? ' green-11' : ''}"><i class="sh-corner-down-left ${p.status === 'replied' ? 'green-txt-14' : 'gray-txt-11'}"></i></span></div></div>`;
  }
  function outcomeCell(p) {
    if (!p.outcome) return `<div class="prospect-custom-outcome-select default-sentiment"><div class="selected-outcome-main"><div><span class="ml-2">Add Outcome</span></div><div class="bs-select-box-icon-wrapper">${ICON.chevronDown16()}</div></div></div>`;
    return `<div class="prospect-custom-outcome-select positive-sentiment"><div class="selected-outcome-main"><div>${p.outcome === 'Interested' ? ICON.like18 : ICON.calendar18}<span class="">${p.outcome === 'Interested' ? 'Interested' : 'Meeting Booked'}</span></div><div class="bs-select-box-icon-wrapper outcome-content-wrapper">${ICON.chevronDown16()}</div></div></div>`;
  }
  function tagsCell(tags) {
    if (!tags.length) return '<div class="prospect-tag-row">-</div>';
    const tag = (t) => `<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2 d-flex"><span class="">${esc(t)}</span></span></div></div>`;
    if (tags.length >= 3) return `<div class="prospect-tag-row">${tag(tags[0])}<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2">+${tags.length - 1}</span></div></div></div>`;
    return `<div class="prospect-tag-row">${tags.map(tag).join('')}</div>`;
  }
  function pageModel(cur, last) { // react-ultimate-pagination, hideFirstAndLastPageLinks
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '…', last];
    if (cur >= last - 3) return [1, '…', last - 4, last - 3, last - 2, last - 1, last];
    return [1, '…', cur - 1, cur, cur + 1, '…', last];
  }
  function pagination(page, pages, total, pageSize, shown) {
    const from = total ? page * pageSize + 1 : 0;
    const to = page * pageSize + shown;
    const cur = page + 1;
    const li = (n) => n === '…'
      ? '<li class="custom-ellipsis page-item"><a class="page-link" role="button" href="#" tabindex="-1"><span aria-hidden="true">…</span><span class="sr-only">More</span></a></li>'
      : n === cur ? `<li class="page-item active"><span class="page-link">${n}<span class="sr-only">(current)</span></span></li>`
        : `<li class="page-item"><a class="page-link" role="button" href="#" data-sp-page="${n - 1}">${n}</a></li>`;
    const prev = cur === 1 ? '<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-left"></i></span><span class="sr-only">Previous</span></span></li>'
      : '<li class="page-item"><a class="page-link" role="button" href="#" data-sp-page="prev"><span aria-hidden="true"><i class="sh-chevron-left"></i></span><span class="sr-only">Previous</span></a></li>';
    const next = cur === pages ? '<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-right"></i></span><span class="sr-only">Next</span></span></li>'
      : '<li class="page-item"><a class="page-link" role="button" href="#" data-sp-page="next"><span aria-hidden="true"><i class="sh-chevron-right"></i></span><span class="sr-only">Next</span></a></li>';
    return `<div class="pagination-container d-flex"><div class="pagination-row d-flex"><span class="regular-2">${from}-${to} of ${total}</span><ul class="pagination">${prev}${pageModel(cur, pages).map(li).join('')}${next}</ul></div></div>`;
  }
  function gadget(t) {
    const cls = t.on ? 'active-status-filter' : 'inactive-status-filter';
    const icon = t.outcome === 'like' ? ICON.like18 : t.outcome === 'calendar' ? ICON.calendar18 : '';
    const num = `<span class="semibold-4 popover-arrow-color-txt">${t.count}</span>${t.deal ? `<span class="ml-1 gray-txt-15">${t.deal}</span>` : ''}`;
    if (t.dropdown) {
      return `<div class="position-relative"><div class="${cls} filter-item md" data-sp-tab="${t.key}"><div><div class="d-flex flex-column justify-content-center align-items-center">
        <div class="text-center number w-100" role="button" tabindex="0">${num}</div>
        <div class="d-flex align-items-center segments"><div class="regular-1 popover-arrow-color-txt text-center text d-flex align-items-center" role="button" tabindex="0"><span class="regular-1 font-medium popover-arrow-color-txt ml-1">${t.label}</span>${ICON.chevronDown16('gray-txt-15 ml-1')}</div></div>
      </div></div></div></div>`;
    }
    return `${t.divider ? '<div class="divider-vertical"></div>' : ''}<div class="${cls} filter-item md" role="button" tabindex="0" data-sp-tab="${t.key}"><div class="d-flex flex-column justify-content-center align-items-center">
      <div class="text-center number">${num}</div>
      <div class="d-flex align-items-center"><div class="regular-1 font-medium popover-arrow-color-txt text-center text d-flex align-items-center position-relative">${icon}<span class="ml-1">${t.label}</span></div></div></div></div>`;
  }

  /* Empty sequence (contact-list-content.tsx, the isEmptyList branch: .empty-screen > .prospect-empty-screen; buttons from
     add-contact-button.tsx with isDropDown=false). The video thumbnail is an S3 URL in production, so a neutral block of the
     same size (21.25rem x 12.5rem, radius 1rem) stands in for it; the play icon is production's VideoPlay svg. */
  const EMPTY = `<div class="empty-screen"><div class="d-flex justify-content-center prospect-empty-screen">
    <div class="d-flex flex-column justify-content-center left-container">
      <span class="semibold-4 line-height-20 popover-arrow-color-txt">Add prospects to sequence</span>
      <span class="regular-2 line-height-20 gray-txt-15 bs-mt-12 mb-3">After adding your contacts, each one will appear here with their own step progress and status.</span>
      <div><div class="d-flex gap-12">
        <button type="button" class="shd-button shd-button--primary add-prospect-sequence-btn" data-sp-noop><span><i class="sh-software-download"></i><span class=" ml-2">Import via CSV</span></span></button>
        <button type="button" class="shd-button shd-button--secondary add-prospect-sequence-btn" data-sp-noop><span><i class="sh-search"></i><span class=" ml-2">Find New Leads</span></span></button>
        <button type="button" class="shd-button shd-button--tertiary add-prospect-sequence-btn" data-sp-noop><span><i class="sh-math-plus"></i><span class=" ml-2">Search &amp; Add</span></span></button>
      </div></div>
    </div>
    <div class="right-container pointer d-flex justify-content-center align-items-center position-relative" role="button" tabindex="0" data-sp-noop>
      <img src="kit/img/video-thumbnail-2.jpg" alt="img">
      <div class="position-absolute play-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7.03032 2.63389C5.6973 1.83267 4 2.7928 4 4.34808V21.2769C4 22.8322 5.6973 23.7923 7.03032 22.9911L21.1129 14.5267C22.4058 13.7496 22.4058 11.8754 21.1129 11.0983L7.03032 2.63389Z" fill="url(#sp-vp)"/><defs><linearGradient id="sp-vp" x1="7.74341" y1="20.9125" x2="26.7542" y2="5.82789" gradientUnits="userSpaceOnUse"><stop stop-color="#2563EB"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs></svg></div>
    </div>
  </div></div>`;

  /* Whole tab area: rc-tabs + Prospects pane (contact-list-content) */
  window.SP_PAGE = (d) => {
    const selOnPage = d.rows.filter(d.isSel).length;
    const head = d.rows.length && selOnPage === d.rows.length ? true : selOnPage ? 'mixed' : false;
    const rows = d.rows.map((p, i) => `<tr>
        <td class="selection-cell">${checkbox(`data-sp-row="${p.id}" aria-label="Select ${esc(p.first + ' ' + p.last)}"`, d.isSel(p))}</td>
        <td style="text-align: left;">${nameCell(p)}</td>
        <td class="text-nowrap" style="text-align: left;"><div class="d-flex align-items-center">${ICON.mail18}<span class="ml-1">Step ${p.step}</span></div></td>
        <td style="text-align: left;">${activityCell(p)}</td>
        <td style="width: 7rem; text-align: left;">${outcomeCell(p)}</td>
        <td>${tagsCell(p.tags)}</td>
        <td style="text-align: left;"><span style="color: rgb(140, 140, 140);">${DATES[(p.id * 3) % DATES.length]}</span></td>
      </tr>`).join('');
    const th = (t, w) => `<th tabindex="0" style="width: ${w}px; text-align: left;"><div class="d-flex"><span class="semibold-1 gray-txt-12">${t}</span></div></th>`;
    const table = d.total === 0
      ? `<div class="empty-list-prospect"><div class="empty-list"><div class="empty-list__inner"><div class="empty-list__photo"><img src="${IMG('empty-data-1.svg')}" alt="empty-data/"></div><div class="empty-list__content"><div class="empty-list__title">Nothing here</div><p class="empty-list__body">No Result</p><div class="empty-list__buttons"><span></span></div></div></div></div></div>`
      : `<div class="contact-list-table h-100"><div class="table-list "><div class="bs-table bs-table-small"><div class="bs-table-container">
        <div class="bs-table-content"><div class="react-bootstrap-table"><table class="table table-organism">
          <thead class="table-organism-header "><tr>
            <th class="selection-cell-header" data-row-selection="true" style="width: 20px;">${checkbox('data-sp="check-all" aria-label="Select all on this page"', head)}</th>
            ${th('Name', 50)}${th('Current Step', 20)}${th('Current step stats', 50)}${th('Outcome', 20)}${th('Tags', 20)}${th('Last activity', 20)}
          </tr></thead>
          <tbody class="table-organism-body sequence-contacts-table ">${rows}</tbody>
        </table></div></div>
        ${pagination(d.page, d.pages, d.total, d.pageSize, d.rows.length)}
      </div></div></div></div>`;
    return `<div class="sequence-container p-0 container-fluid"><div class="sequence-components"><div class="single-sequence-tab-container"><div class="custom-tab-container custom-tab-container-lg onboardingCompleted">
      <div id="sequence-single-tabs" class="bs-tabs bs-tabs-top bs-tabs-small">
        <div role="tablist" class="bs-tabs-nav"><div class="bs-tabs-nav-wrap"><div class="bs-tabs-nav-list" style="transform: translate(0px, 0px);">
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div class="sequence-single-tab--label"><span class="label-text">Steps</span><div class="tab-count"><span class="regular-1 font-medium gray-txt-15">4</span></div></div></div></div>
          <div class="bs-tabs-tab bs-tabs-tab-active"><div role="tab" aria-selected="true" class="bs-tabs-tab-btn" tabindex="0"><div id="p-t__sequence-prospects-tab"><div class="sequence-single-tab--label"><span class="label-text">Prospects</span><div class="tab-count"><span class="regular-1 font-medium gray-txt-15">${d.totalInSeq}</span></div></div></div></div></div>
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div class="sequence-single-tab--label"><span class="label-text">Emails</span></div></div></div>
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div id="p-t__sequence-settings-tab"><div class="sequence-single-tab--label"><span class="label-text">Settings</span></div></div></div></div>
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div class="sequence-single-tab--label"><div class="tab-separator"></div><span class="label-container "><span class="label-icon d-flex">${ICON.gitMerge18}</span><span class="label-text">Subsequence</span></span></div></div></div>
          <div class="bs-tabs-tab"><div role="tab" aria-selected="false" class="bs-tabs-tab-btn" tabindex="0"><div class="sequence-score-header__hover-container"><div class="d-flex align-items-center pointer sequence-score-header__hover-txt false"><div class="mr-2 hover-text">
            <svg class="circular-progressbar" viewBox="0 0 100 100" width="1.75rem" height="1.75rem" aria-hidden="true"><path class="circular-progressbar-trail" d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke-width="8" fill-opacity="0" style="stroke: #D1FAE5;"></path><path class="circular-progressbar-path" d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke-width="8" fill-opacity="0" style="stroke: #2DB482; stroke-linecap: round; stroke-dasharray: 289.027px, 289.027px; stroke-dashoffset: 80.927px;"></path><text class="circular-progressbar-text" x="50" y="50" style="fill: #2DB482; font-size: 2.5rem; font-weight: 600; dominant-baseline: central; text-anchor: middle;">72</text></svg>
            </div><span class="regular-2 font-medium line-height-20 gray-txt-15 sequence-score__text">Sequence Score</span></div></div></div></div>
          <div class="bs-tabs-ink-bar bs-tabs-ink-bar-animated" data-sp="ink"></div>
        </div></div>
        <div class="bs-tabs-extra-content"><div class="sequence-single-header-action"><div class="steps-top-action"><div><div class="dropdown-custom">
          <button aria-haspopup="true" aria-expanded="false" type="button" class="dropdown-toggle-custom btn-solid btn-solid-primary"><span class="m-2">Add Prospects</span>${ICON.chevronDown16()}</button>
        </div></div></div></div></div>
        </div>
        <div class="bs-tabs-content-holder"><div class="bs-tabs-content bs-tabs-content-top"><div role="tabpanel" tabindex="0" aria-hidden="false" class="bs-tabs-tabpane bs-tabs-tabpane-active">
          ${d.totalInSeq === 0 ? EMPTY : `<div class="h-100 w-100 contact-list-container container-fluid">
            <div class="sequence-prospect-actions">
              <div class="sequence-prospect-search-bar-and-filter">
                <form onsubmit="return false"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default search-input"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search" class="bs-input-md bs-input" value="" aria-label="Search prospects"></span></form>
                <div class="prospect-filter-icon-container" role="button" tabindex="0" aria-label="Apply Filters" data-nx-tip="Apply Filters"><i class="sh-filter icon"></i></div>
                <div class="sequence-prospect-separator"></div>
                <div class="${d.view === 'today' ? 'sp-bulk-today' : 'sp-bulk-host'}" data-sp="bulk"></div>
              </div>
              <div class="sequence-prospect-right-actions">${d.anySelected ? '' : `<div><button type="button" class="d-flex justify-content-center action-btn--refresh btn-ghost btn-ghost-default btn-ghost-md" aria-label="Refresh" data-nx-tip="Refresh"><span class="icon-left">${ICON.refresh20}</span></button></div>`}</div>
            </div>
            <div class="d-flex justify-content-between status-filter">${d.tabs.map(gadget).join('')}</div>
            <div class="prospect-banner" data-sp="banner"></div>
            <div class="row prospects-main"><div class="prospect-list-table col"><div class="h-100 row"><div class="h-100 col">${table}</div></div></div></div>
          </div>`}
        </div></div></div>
      </div></div></div></div></div>`;
  };
  window.SP_TAG_ICON = ICON.tag20;

  /* Today's pause duration picker (pause-prospect-modal.tsx): radios + 1 to 45 day number input.
     Inside the proposed F dialog the same control is kept, with plain sentence-case labels. */
  window.SP_PAUSE_PICKER = (el, onChange, initial) => {
    let days = initial || 14;
    let mode = 'days';
    const id = 'nx-pp-' + Math.random().toString(36).slice(2, 7);
    el.innerHTML = `<div class="nx-pause" role="radiogroup" aria-label="How long to pause">
      <div class="form-check"><input name="${id}" type="radio" id="${id}-1" class="form-check-input" checked><label for="${id}-1" class="form-check-label">Resume automatically after
        <span class="bs-input-number-container"><span class="bs-input-number-inner"><span class="bs-input-number bs-input-number-md"><span class="bs-input-number-input-wrap"><input type="number" class="bs-input-number-input" min="1" max="45" value="${days}" aria-label="Days"></span></span></span></span> days</label></div>
      <div class="form-check"><input name="${id}" type="radio" id="${id}-2" class="form-check-input"><label for="${id}-2" class="form-check-label">Keep paused until I resume them</label></div>
      <p class="nx-field-err" hidden>Enter a number of days from 1 to 45.</p></div>`;
    const num = el.querySelector('input[type=number]');
    const err = el.querySelector('.nx-field-err');
    const cont = el.querySelector('.bs-input-number-container');
    const emit = () => {
      const v = Number(num.value);
      const ok = mode === 'keep' || (Number.isInteger(v) && v >= 1 && v <= 45);
      cont.classList.toggle('bs-input-number-error', !ok);
      err.hidden = ok;
      onChange(mode === 'keep' ? null : v, ok);
    };
    num.addEventListener('input', () => { mode = 'days'; el.querySelector(`#${id}-1`).checked = true; emit(); });
    num.addEventListener('focus', () => { mode = 'days'; el.querySelector(`#${id}-1`).checked = true; });
    el.querySelector(`#${id}-1`).addEventListener('change', () => { mode = 'days'; emit(); });
    el.querySelector(`#${id}-2`).addEventListener('change', () => { mode = 'keep'; emit(); });
  };

  /* Today's PauseProspectModal and ResumeProspectModal, production markup and copy, for the "Today" view */
  function todayModal(kind, onApply) {
    const isPause = kind === 'pause';
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" class="fade bs-modal-container pause-prospect-modal modal show" tabindex="-1" aria-label="${isPause ? 'Pause Prospects' : 'Resume Prospects'}" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-header modal-header"><div class="modal-title h4"><div class="pause-title"><img src="${IMG(isPause ? 'pause-circle.svg' : 'play-circle.svg')}" alt="${isPause ? 'Pause' : 'Resume'}"><span>${isPause ? 'Pause Prospects' : 'Resume Prospects'}</span></div></div></div>
          <div class="bs-modal-body modal-body"></div>
          <div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;"><button type="button" class="btn-ghost btn-ghost-default btn-ghost-md">Cancel</button><button type="button" class="header-btn btn-solid btn-solid-primary btn-solid-md">Apply changes</button></div></div>
        </div></div></div></div></div>`);
    const body = root.querySelector('.modal-body');
    if (isPause) {
      body.innerHTML = `<div class="form-check"><input name="pause-prospect-options" type="radio" id="pause-prospect-options-1" class="form-check-input" checked><label title="" for="pause-prospect-options-1" class="form-check-label">Pause Prospects and send next email after
          <div class="bs-input-number-container"><div class="bs-input-number-inner"><div class="bs-input-number bs-input-number-md"><div class="bs-input-number-handler-wrap"><span class="bs-input-number-handler bs-input-number-handler-up" role="button" tabindex="0"><span class="bs-input-number-handler-up-inner"><i class="sh-chevron-up"></i></span></span><span class="bs-input-number-handler bs-input-number-handler-down" role="button" tabindex="0"><span class="bs-input-number-handler-down-inner"><i class="sh-chevron-down"></i></span></span></div><div class="bs-input-number-input-wrap"><input type="number" class="bs-input-number-input" min="1" value="14"></div></div></div></div>
          days.</label></div>
        <div class="form-check"><input name="pause-prospect-options" type="radio" id="pause-prospect-options-2" class="form-check-input"><label title="" for="pause-prospect-options-2" class="form-check-label">Keep Prospects as Paused only.</label></div>`;
    } else {
      body.innerHTML = '<p class="resume-text">Are you sure you want to resume the selected Prospects?</p>';
    }
    // <p><i><div> cannot be parsed from HTML text; build it with DOM calls like React does
    const alertWrap = document.createElement('div'); alertWrap.className = 'alert-component'; alertWrap.setAttribute('data-banner', 'true');
    const alert = document.createElement('div'); alert.setAttribute('role', 'alert'); alert.className = 'fade info-alert old-theme pause-prospect-modal--alert alert alert-primary show';
    const p = document.createElement('p'); const i = document.createElement('i'); i.className = 'sh-alert-circle'; const dv = document.createElement('div');
    dv.innerHTML = isPause
      ? '<span>This change applies to the selected prospects in this sequence only. Same prospects in other sequence will not be Paused. </span><span><a href="#" rel="noreferrer">Click here</a> to learn more about pause status.</span>'
      : '<span>The selected prospects will be marked active and start receiving emails that are scheduled or yet to be scheduled.</span>';
    p.append(i, dv); alert.appendChild(p); alertWrap.appendChild(alert); body.appendChild(alertWrap);
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey, true);
    const [cancel, apply] = root.querySelectorAll('.bs-modal-footer-action-buttons button');
    cancel.addEventListener('click', close);
    apply.addEventListener('click', () => { close(); onApply(); });
    document.body.appendChild(root);
    return { close };
  }
  window.SP_TODAY_PAUSE = (fn) => todayModal('pause', fn);
  window.SP_TODAY_RESUME = (fn) => todayModal('resume', fn);
})();
