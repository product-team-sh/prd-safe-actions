/* Production markup for CRM > Import via CSV, reproduced from webui main aeda4e3 (unchanged on main 5f1d224):
   import-contacts-modal.tsx (shared/design-system/ui/modal, variant "border"), import-flow.tsx, import-stage-tabs.tsx,
   select-file.tsx + post-select.tsx, map-fields.tsx + map-list.tsx, design-system Select (select-bar.tsx + transfer),
   email-verification.tsx + tag-prospects-content.tsx (admin email verification off).
   The CRM list behind the modal is a light stand-in: it is dimmed by the backdrop and is not the surface under review.
   Anything new is marked .nx-new. Loaded before csv-import.js. */
(function () {
  'use strict';
  const { esc, IMG, fmt } = NX;
  const SVGP = (d) => `<path fill="currentColor" fill-rule="evenodd" d="${d}" clip-rule="evenodd"/>`;
  const svg = (paths, size = 16, cls = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${paths}</svg>`;
  const ICON = {
    // @saleshandy/icons
    cross: svg(SVGP('M18.707 5.293a1 1 0 0 1 0 1.414l-12 12a1 1 0 0 1-1.414-1.414l12-12a1 1 0 0 1 1.414 0Z') + SVGP('M5.293 5.293a1 1 0 0 1 1.414 0l12 12a1 1 0 0 1-1.414 1.414l-12-12a1 1 0 0 1 0-1.414Z')),
    chevronRight: svg(SVGP('M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414Z')),
    chevronDown: svg(SVGP('M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z')),
    chevronUp: svg(SVGP('M11.293 8.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L12 10.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l6-6Z')),
    download: svg(SVGP('M4 15.992a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1Z') + SVGP('M6.293 10.285a1 1 0 0 1 1.414 0L12 14.578l4.293-4.293a1 1 0 1 1 1.414 1.415l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.415Z') + SVGP('M12 3.008a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0v-12a1 1 0 0 1 1-1Z')),
  };
  window.CI_ICON = ICON;

  const btn = (label, cls = '', attrs = '') => `<button type="button" class="shd-button ${cls}"${attrs ? ' ' + attrs : ''}><span>${label}</span></button>`;
  const truncated = (text) => `<span class="" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; display: inline-block; min-width: 0px; max-width: 100%;">${esc(text)}</span>`;

  /* design-system Select bar (select-bar.tsx) */
  window.CI_SELECT_BAR = (content, { placeholder = '', open = false, attrs = '' } = {}) =>
    `<div class="bs-select-box bs-select-box" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="${open}"${attrs ? ' ' + attrs : ''}><div class="bs-select-box-text${!content && placeholder ? ' placeholder' : ''}">${content || placeholder}</div><div class="bs-select-box-icon-wrapper">${open ? ICON.chevronUp : ICON.chevronDown}</div></div>`;

  /* Transfer overlay (transfer-overlay.tsx > transfer.tsx > option-list.tsx), rendered by the page at the bar's position */
  window.CI_TRANSFER = ({ cls, width, items, selectedKey }) => `<div class="transfer-overlay transfer-select-box ${cls}" style="width: ${width}px;" role="listbox">
      <div class="transfer-container "><div class="transfer-body disabled"><div class="transfer-content"><ul class="transfer-list"><div>
        ${items.map((it) => `<li class="${it.key === selectedKey ? 'active' : ''}" role="option" tabindex="0" aria-selected="${it.key === selectedKey}" data-ci-opt="${it.key}">${it.html}</li>`).join('')}
      </div></ul></div></div></div></div>`;

  /* ── Modal frame (ui/modal/modal.tsx with variant="border", className="import-contacts-csv-modal", hideFooter) ── */
  window.CI_MODAL = (inner) => `<div class="ci-modal-root">
    <div class="fade modal-backdrop show"></div>
    <div role="dialog" aria-modal="true" aria-labelledby="ci-modal-title" class="fade shd-modal border import-contacts-csv-modal modal show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
        <div class="shd-modal--header d-flex justify-content-between align-items-center modal-header"><div class="shd-modal--title modal-title h4" id="ci-modal-title">Import Prospects</div>
          <button type="button" class="shd-modal--close-btn" aria-label="Close" data-ci="close">${ICON.cross}</button></div>
        <div class="shd-modal--body modal-body"><div class="import-contacts-content import-contacts-csv-modal--content">${inner}</div></div>
      </div></div>
    </div></div>`;

  /* import-flow.tsx + import-stage-tabs.tsx (all tabs but the current one are disabled) */
  const STAGES = [['upload', 'Upload file'], ['map', 'Map Fields'], ['review', 'Review and Import']];
  window.CI_FLOW = (stage, stageHTML) => `<div class="import-flow import-contacts-csv-modal--flow">
      <div class="import-stage-tabs--container">${STAGES.map(([k, l], i) => `<div class="import-stage-tabs--tab ${k === stage ? 'selected' : 'disabled'}"${k === stage ? ' aria-current="step"' : ''}><p>${l}</p></div>${i < STAGES.length - 1 ? `<div class="import-stage-tabs--icon">${ICON.chevronRight}</div>` : ''}`).join('')}</div>
      <div class="import-flow-stage-wrapper import-contacts-csv-modal--stages">${stageHTML}</div>
    </div>`;

  /* Stage 1: select-file.tsx with a file chosen (post-select.tsx) */
  window.CI_UPLOAD = (file) => `<div class="select-file import-contact-stage post-select-stage">
      <div class="select-file-content import-contact-stage-content"><div class="post-select">
        <div class="post-select-icon-wrapper"><img src="${IMG('sheets.svg')}" alt=""></div>
        <div class="post-select-filename">${esc(file)}</div>
        <div class="post-select-success"><img src="${IMG('check.svg')}" alt="">Successfully uploaded.</div>
        <div class="post-select-delete" role="button" tabindex="0" data-ci-noop><i class="sh-trash"></i><span>Remove file</span></div>
      </div></div>
      <div class="import-contact-stage-footer">
        <div class="import-contact-stage-footer--left"><a class="download-import-contacts-sample-file" href="#" data-ci-noop><span>${ICON.download}</span><span>Try sample file</span></a></div>
        <div class="import-contact-stage-footer--right">${btn('Cancel', 'shd-button--secondary gray-secondary-btn', 'data-ci="close"')}${btn('Next', 'shd-button--primary', 'data-ci="next"')}</div>
      </div>
    </div>`;

  /* Stage 2: map-fields.tsx + map-list.tsx. CRM import (fromModule Prospect) has no step select.
     d: { headers, sample, keys, fields, conflictLabel, conflictOpen, ff (feedforward html or ''), openRow } */
  window.CI_MAP = (d) => {
    const fieldLabel = (k) => (d.fields.find((f) => f.key === k) || {}).label;
    const rows = d.headers.map((hd, i) => {
      const k = d.keys[i];
      const mapped = k != null;
      return `<div class="map-list-item">
        <div class="map-list-item-child-left">
          <div class="csv-header-label semibold-2" title="${esc(hd)}">${esc(hd)}</div>
          <div class="csv-row-value regular-2" title="${esc(d.sample[i])}">${esc(d.sample[i])}${mapped ? '<i class="sh-check-o lime-txt-8" style="margin: 0.5rem;"></i>' : ''}</div>
        </div>
        <div class="map-list-item-child-right">
          ${mapped ? `<div class="map-list-item-remove-icon-wrapper" role="button" tabindex="0" aria-label="Remove mapping for ${esc(hd)}" data-ci-unmap="${i}"><i class="sh-trash"></i></div>` : ''}
          <div>${window.CI_SELECT_BAR(mapped ? truncated(fieldLabel(k)) : '', { placeholder: 'Select Field', open: d.openRow === i, attrs: `data-ci-field="${i}" aria-label="Field for ${esc(hd)}"` })}</div>
        </div>
      </div>`;
    }).join('');
    return `<div class="map-fields import-contact-stage overflow-hidden">
      <div class="map-fields-content import-contact-stage-content overflow-hidden map-list-scroll">
        <div class="map-list overflow-hidden">
          <div class="map-list-header semibold-2"><div class="row"><div class="ml-3">Fields from file</div><div class="sample-map-field">Sample</div></div><div class="mr-5">Fields</div></div>
          <div class="map-list-content">${rows}</div>
          <div class="map-list-footer${d.ff ? ' ci-footer-ff' : ''}"><div class="container">
            <div class="map-fields-config-wrapper map-list-footer-row row">
              <div class="d-flex align-items-center">
                <div class="map-fields-conflict-action map-fields-config ">
                  <div class="regular-2 conflict-action-label map-fields-config-label  semibold">After Import</div>
                  <div class="info-circle" data-ci-tip="Please select the action to perform on your prospect details after importing" data-ci-tip-place="bottom"><img src="${IMG('info-circle.svg')}" alt="sh-logo-icon/"></div>
                  ${window.CI_SELECT_BAR(`<span class="semibold-10">${esc(d.conflictLabel)}</span>`, { open: d.conflictOpen, attrs: 'data-ci="conflict" aria-label="After Import"' })}
                </div>
              </div>
              <div>${btn('+ Create Custom Field', 'shd-button--primary create-custom-field-button', 'data-ci-noop')}</div>
            </div>
            ${d.ff || ''}
          </div></div>
        </div>
      </div>
      <div class="import-contact-stage-footer">
        <div class="import-contact-stage-footer--left"></div>
        <div class="import-contact-stage-footer--right">${btn('Cancel', 'shd-button--secondary gray-secondary-btn', 'data-ci="close"')}${btn('Next', 'shd-button--primary', 'id="map-fields-next-step" data-ci="next"')}</div>
      </div>
    </div>`;
  };

  /* Stage 3: email-verification.tsx with admin email verification off: Tag prospects + Import */
  window.CI_REVIEW = (busy) => `<div class="import-contact-stage">
      <div class="email-verification overflow-auto import-contact-stage-content">
        <div class="review-section-container mt-2">
          <div class="review-section-title-container"><img src="${IMG('tag.svg')}" alt="Tag"><span class="review-section-title">Tag prospects</span></div>
          <div class="review-section-tags-container mt-n2"><div class="tags-autosuggest-container ">
            <div role="combobox" aria-haspopup="listbox" aria-expanded="false" style="margin-top: 1.25rem;">
              <div class="bs-input d-flex flex-row flex-wrap p-2"><div class="d-flex flex-row align-items-center flex-flow-wrap tags-row-gap tags-autosuggest-width"><div class="d-inline-block mw-100 tag-input-container"><div>
                <input type="text" autocomplete="off" aria-autocomplete="list" class="selected-tags-inline-input" placeholder="Add tags to categorize your prospects..." aria-label="Tag prospects" value="">
              </div></div></div></div>
            </div>
            <div class="tags-container tags-row-gap  tags-container--inline"></div>
          </div></div>
        </div>
      </div>
      <div class="import-contact-stage-footer">
        <div class="import-contact-stage-footer--left"></div>
        <div class="import-contact-stage-footer--right">${busy
          ? '<button type="button" class="shd-button shd-button--primary shd-button--disabled shd-button--loading" id="review-and-import" disabled><div class="shd-loader"><div></div><div></div><div></div><div></div></div><span>Importing...</span></button>'
          : btn('Import', 'shd-button--primary', 'id="review-and-import" data-ci="import"')}</div>
      </div>
    </div>`;

  /* CRM > Prospects list behind the modal (stand-in; real page is crm-prospects.html) */
  const PEOPLE = [
    ['Maya Cohen', 'maya.cohen@ledgerloop.io', 'VP Sales', 'Ledgerloop', ['Q4']],
    ['Arjun Mehta', 'arjun@shipyardhq.com', 'Head of Growth', 'Shipyard', ['Q4', 'SaaS']],
    ['Elena Duarte', 'elena.duarte@quillstack.com', 'Founder', 'Quillstack', ['Founder']],
    ['Tom Becker', 'tom@fieldnote.app', 'Sales Director', 'Fieldnote', []],
    ['Aisha Khan', 'aisha.khan@northbeam.dev', 'CRO', 'Northbeam', ['Webinar']],
    ['Daniel Osei', 'daniel@tallyroute.com', 'Head of Sales', 'Tallyroute', ['Q4']],
    ['Sofia Marin', 'sofia.marin@brightforge.co', 'RevOps Lead', 'Brightforge', ['SaaS']],
    ['Liam Novak', 'liam@cartwheel.ai', 'Co-founder', 'Cartwheel', ['Founder', 'Q4']],
    ['Mei Chen', 'mei.chen@opslane.io', 'VP Marketing', 'Opslane', []],
    ['Hannah Lindqvist', 'hannah@pagefold.com', 'Account Executive', 'Pagefold', ['Webinar']],
    ['Kofi Mensah', 'kofi.mensah@relaypoint.co', 'Sales Manager', 'Relaypoint', ['Q4']],
    ['Lucia Ferreira', 'lucia@stackmint.io', 'CEO', 'Stackmint', ['SaaS', 'Founder']],
    ['Noah Brooks', 'noah.brooks@brickyard.dev', 'SDR Lead', 'Brickyard', []],
    ['Zara Haddad', 'zara@loomstate.com', 'Head of Partnerships', 'Loomstate', ['Q4']],
  ];
  const DATES = ['Oct 22', 'Oct 21', 'Oct 21', 'Oct 20', 'Oct 18', 'Oct 17', 'Oct 15', 'Oct 14', 'Oct 10', 'Oct 8', 'Oct 6', 'Oct 3', 'Sep 30', 'Sep 28'];
  window.CI_CRM = (total) => {
    const th = (t) => `<th style="text-align: left;"><div class="d-flex"><span class="semibold-1 gray-txt-12">${t}</span></div></th>`;
    const tag = (t) => `<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row"><span class="regular-2 d-flex"><span class="">${esc(t)}</span></span></div></div>`;
    const rows = PEOPLE.map((p, i) => `<tr>
        <td class="selection-cell"><label class="bs-checkbox-wrapper"><span class="bs-checkbox"><input type="checkbox" class="bs-checkbox-input" aria-label="Select ${esc(p[0])}"><span class="bs-checkbox-inner"></span></span></label></td>
        <td style="text-align: left;"><div class="contact-field-name-container"><div class="name-field w-100"><span class="">${esc(p[0])}</span></div><div class="email-field bs-mt-2 "><span class="">${esc(p[1])}</span></div></div></td>
        <td style="text-align: left;">${esc(p[2])}</td>
        <td style="text-align: left;">${esc(p[3])}</td>
        <td><div class="prospect-tag-row">${p[4].length ? p[4].map(tag).join('') : '-'}</div></td>
        <td style="text-align: left;"><span style="color: rgb(140, 140, 140);">${DATES[i]}</span></td>
      </tr>`).join('');
    return `<div class="ci-crm">
      <div class="ci-crm-actions">
        <form onsubmit="return false"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default search-input"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search" class="bs-input-md bs-input" value="" aria-label="Search prospects"></span></form>
        <div class="ci-crm-right"><span class="regular-2 gray-txt-15">${fmt(total)} prospects</span>
          <div class="add-prospect-inner"><button type="button" class="shd-button shd-button--primary add-prospect-btn" data-ci="open"><span>Add Prospects</span></button></div></div>
      </div>
      <div class="ci-crm-table"><div class="bs-table bs-table-small"><div class="bs-table-container"><div class="bs-table-content"><div class="react-bootstrap-table"><table class="table table-organism">
        <thead class="table-organism-header "><tr><th class="selection-cell-header" style="width: 20px;"><label class="bs-checkbox-wrapper"><span class="bs-checkbox"><input type="checkbox" class="bs-checkbox-input" aria-label="Select all"><span class="bs-checkbox-inner"></span></span></label></th>${th('Name')}${th('Job Title')}${th('Company')}${th('Tags')}${th('Created on')}</tr></thead>
        <tbody class="table-organism-body">${rows}</tbody>
      </table></div></div></div></div></div>
    </div>`;
  };
})();
