/* Production markup for Email Accounts, reproduced from webui main aeda4e3 (no change on origin/main 5f1d224):
   email-accounts-header, email-accounts-actions, email-selected-info-banner, organisms/table (react-bootstrap-table-next,
   new pagination), get-email-accounts-columns and its fields, the row actions dropdown, ConfirmationModalV3, Modal,
   ConfirmationModal, add-remove-tag. Icons are @saleshandy/icons 2.0.0 paths, inline.
   Anything new is marked .nx-new. Loaded before email-accounts.js. */
(function () {
  'use strict';
  const { h, esc, IMG, fmt } = NX;

  /* @saleshandy/icons 2.0.0 */
  const ICONS = {
    Unlink: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M13.293 4.29a4.536 4.536 0 0 1 6.414 6.413L15.71 14.7a4.5 4.5 0 0 1-6.424-.004 1 1 0 0 1 1.428-1.4 2.5 2.5 0 0 0 3.572 0l.007-.007 4-4a2.536 2.536 0 0 0-3.586-3.586l-.5.5a1 1 0 1 1-1.414-1.414l.5-.5Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9.757 8.305a4.5 4.5 0 0 1 4.957.999 1 1 0 0 1-1.428 1.4 2.5 2.5 0 0 0-3.572 0l-.007.007-4 4a2.535 2.535 0 1 0 3.586 3.586l.5-.5a1 1 0 1 1 1.414 1.414l-.5.5a4.536 4.536 0 0 1-6.414-6.414L8.289 9.3a4.5 4.5 0 0 1 1.468-.995ZM16 18.007a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM18 16.007a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1ZM2 7.993a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1ZM8 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>'],
    Adjustments: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M6 9.004a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M6 2.996a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1ZM6 11a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1ZM12 15.004a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12 2.996a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0v-10a1 1 0 0 1 1-1ZM12 17a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM18 6.004a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M18 2.996a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM18 8a1 1 0 0 1 1 1v11a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>'],
    Trash: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M3 7.007a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM10 9.993a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1ZM14 9.993a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M4.917 6.011a1 1 0 0 1 1.08.913l1 12a1 1 0 0 1 .003.084 1 1 0 0 0 1 1h8a1 1 0 0 0 1-1 1 1 0 0 1 .003-.084l1-12a1 1 0 0 1 1.994.167L19 19.053a3 3 0 0 1-3 2.954H8a3 3 0 0 1-3-2.954L4.004 7.091a1 1 0 0 1 .913-1.08Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v3a1 1 0 1 1-2 0V4h-4v3a1 1 0 0 1-2 0V4a2 2 0 0 1 .586-1.414Z" clip-rule="evenodd"/>'],
    Refresh: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M4 3.008a1 1 0 0 1 1 1V6.28a9.1 9.1 0 0 1 15.99 4.59 1 1 0 0 1-1.98.275A7.1 7.1 0 0 0 6.19 8.008H9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1ZM3.862 12.017a1 1 0 0 1 1.129.853 7.1 7.1 0 0 0 12.818 3.138H15a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.273a9.1 9.1 0 0 1-15.99-4.59 1 1 0 0 1 .852-1.128Z" clip-rule="evenodd"/>'],
    Filter: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M5.17 4.049a1 1 0 0 1 .33-.056h13a1 1 0 0 1 .331.056 2 2 0 0 1 1 3c-.027.04-.058.08-.091.116L15 12.38v6.614a1 1 0 0 1-1.6.8l-4-3a1 1 0 0 1-.4-.8v-3.614L4.26 7.165a1 1 0 0 1-.09-.116 2 2 0 0 1 1-3Zm.727 1.944 4.843 5.327a1 1 0 0 1 .26.673v3.5l2 1.5v-5a1 1 0 0 1 .26-.673l4.843-5.327H5.897Z" clip-rule="evenodd"/>'],
    Tag: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M7 4a3 3 0 0 0-3 3v3.586l8.682 8.682a.5.5 0 0 0 .636 0l5.95-5.95a.5.5 0 0 0 0-.636L10.586 4H7Zm-3.536-.536A5 5 0 0 1 7 2h4a1 1 0 0 1 .707.293l9 9 .038.04a2.5 2.5 0 0 1-.038 3.374l-6 6a2.5 2.5 0 0 1-3.414 0l-9-9A1 1 0 0 1 2 11V7a5 5 0 0 1 1.464-3.536Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9 8.007a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/>'],
    World: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M2.6 9a1 1 0 0 1 1-1h16.8a1 1 0 1 1 0 2H3.6a1 1 0 0 1-1-1ZM2.6 15a1 1 0 0 1 1-1h16.8a1 1 0 1 1 0 2H3.6a1 1 0 0 1-1-1Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12.03 2.152a1 1 0 0 1 .318 1.377 16 16 0 0 0 0 16.942 1 1 0 1 1-1.697 1.058 18 18 0 0 1 0-19.058 1 1 0 0 1 1.378-.32Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M11.97 2.152a1 1 0 0 1 1.378.319 18 18 0 0 1 0 19.058 1 1 0 1 1-1.696-1.058 16 16 0 0 0 0-16.942 1 1 0 0 1 .319-1.377Z" clip-rule="evenodd"/>'],
    Pencil: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M13.793 4.785a3.828 3.828 0 1 1 5.414 5.415l-10.5 10.5a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.708l10.5-10.5Zm2.707.88c-.485 0-.95.192-1.293.535L5 16.407v2.585h2.586L17.793 8.785a1.828 1.828 0 0 0-1.293-3.12Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12.793 5.785a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.415l-4-4a1 1 0 0 1 0-1.415Z" clip-rule="evenodd"/>'],
    Link: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M13.293 4.29a4.536 4.536 0 0 1 6.414 6.413L15.71 14.7a4.5 4.5 0 0 1-6.424-.004 1 1 0 0 1 1.428-1.4 2.5 2.5 0 0 0 3.572 0l.007-.007 4-4a2.536 2.536 0 0 0-3.586-3.586l-.5.5a1 1 0 1 1-1.414-1.414l.5-.5Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9.757 8.305a4.5 4.5 0 0 1 4.957.999 1 1 0 0 1-1.428 1.4 2.5 2.5 0 0 0-3.572 0l-.007.007-4 4a2.535 2.535 0 1 0 3.586 3.586l.5-.5a1 1 0 1 1 1.414 1.414l-.5.5a4.536 4.536 0 0 1-6.414-6.414L8.289 9.3a4.5 4.5 0 0 1 1.468-.995Z" clip-rule="evenodd"/>'],
    FileCheck: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M14 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4a2 2 0 0 1-2-2V3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M7 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8.414L13.586 4H7ZM4.879 2.879A3 3 0 0 1 7 2h7a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 20 8v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a3 3 0 0 1 .879-2.121Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M15.707 12.3a1 1 0 0 1 0 1.415l-4 4a1 1 0 0 1-1.414 0l-2-2A1 1 0 1 1 9.707 14.3L11 15.593l3.293-3.293a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/>'],
    Check: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M20.707 6.3a1 1 0 0 1 0 1.415l-10 10a1 1 0 0 1-1.414 0l-5-5A1 1 0 0 1 5.707 11.3L10 15.593 19.293 6.3a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/>'],
    Cross: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M18.707 5.293a1 1 0 0 1 0 1.414l-12 12a1 1 0 0 1-1.414-1.414l12-12a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M5.293 5.293a1 1 0 0 1 1.414 0l12 12a1 1 0 0 1-1.414 1.414l-12-12a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"/>'],
    Clock: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12 6.007a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.415l-3-3a1 1 0 0 1-.293-.707v-5a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>'],
    InfoCircle: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M11 7.993a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1ZM10 12a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>'],
    ArrowUpRight: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M17.707 6.29a1 1 0 0 1 0 1.413l-10 10a1 1 0 0 1-1.414-1.414l10-10a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M7 6.996a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0v-8H8a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>'],
    Trulyinbox: ['0 0 16 17', '<path fill="#1D4ED8" d="M12.076 3.095a.44.44 0 0 0-.424-.242H4.349a.439.439 0 0 0-.425.242l-2.56 6a.651.651 0 0 0-.03.167v3.348a1.167 1.167 0 0 0 1.212 1.152h10.909a1.167 1.167 0 0 0 1.212-1.152V9.262a.757.757 0 0 0-.03-.182l-2.561-5.985ZM10.03 8.913a.44.44 0 0 0-.454.334C9.56 9.292 9.303 10.55 8 10.55S6.455 9.383 6.424 9.247a.44.44 0 0 0-.454-.334H2.455l2.182-5.151h6.727l2.182 5.151H10.03Z"/><path fill="#1D4ED8" d="M6.015 5.732h3.97a.455.455 0 1 0 0-.91h-3.97a.455.455 0 0 0 0 .91ZM10.591 6.792H5.41a.454.454 0 1 0 0 .91h5.181a.454.454 0 1 0 0-.91Z"/>'],
    Send: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M21.707 2.293a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414-1.414l11-11a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M21.707 2.293a1 1 0 0 1 .234 1.047l-6.5 18a1.55 1.55 0 0 1-2.84.096l-3.346-6.69-6.69-3.346a1.55 1.55 0 0 1 .095-2.84l18-6.5a1 1 0 0 1 1.047.233ZM4.372 10.068l6.075 3.038a1 1 0 0 1 .448.447l3.037 6.075 5.404-14.964-14.964 5.404Z" clip-rule="evenodd"/>'],
    Flame: ['0 0 24 24', '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.362 5.213A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.36-6.867 8.21 8.21 0 0 0 3 2.48l.002.001Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.973 5.973 0 0 1-2.132-1A3.75 3.75 0 0 0 12 18v0Z"/>'],
    AlertTriangle: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M12 8a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm0 6a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M10.476 2.38a3 3 0 0 1 4.145 1.126l6.997 12.245c.022.038.041.078.058.12A3 3 0 0 1 19 19.996H5.035c-.029 0-.058 0-.087-.002a3 3 0 0 1-2.625-4.125 1 1 0 0 1 .058-.12L9.378 3.507a3 3 0 0 1 1.098-1.125ZM5.037 17.998H18.97a1 1 0 0 0 .873-1.322L12.873 4.48a1 1 0 0 0-1.75 0l-.006.012-6.961 12.182a1 1 0 0 0 .88 1.322Z" clip-rule="evenodd"/>'],
    ChevronUp: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M11.293 8.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L12 10.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l6-6Z" clip-rule="evenodd"/>'],
    ChevronDown: ['0 0 24 24', '<path fill="currentColor" fill-rule="evenodd" d="M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"/>'],
  };
  const svg = (name, size = 16, cls = '', attrs = '') => {
    const [vb, inner] = ICONS[name];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="${vb}" role="img"${cls ? ` class="${cls}"` : ''}${attrs ? ' ' + attrs : ''} aria-hidden="true">${inner}</svg>`;
  };
  window.EA_SVG = svg;

  /* 50px page header, left side (email-accounts-header.tsx) */
  window.EA_HEADER = (count) => `<div class="p-0"><div class="d-flex header-with-notification"><div class="d-flex justify-content-between align-items-center">
    <div class="email-accounts-header d-flex align-items-center"><p class="email-accounts-header--title">Email Accounts</p>
      <div class="connected-email-accounts-badge"><span data-ea="count">${count}</span></div></div></div></div></div>`;

  const checkbox = (attrs, state) => `<label class="bs-checkbox-wrapper"><span class="bs-checkbox${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}><span class="bs-checkbox-inner"></span></span></label>`;

  /* ───────── cells (fields/*.tsx) ───────── */
  const TYPE_IMG = { google: 'google-icon.svg', microsoft: 'microsoft-logo-small.svg' };
  function switchCell(a) {
    // email-account-switch.tsx: Active = checked + "Pause"; Paused = "Activate"; Disconnected = "Connect"
    const cls = a.status === 'active' ? 'connected-status' : 'disconnected-status';
    const tip = a.status === 'active' ? 'Pause' : a.status === 'paused' ? 'Activate' : 'Connect';
    return `<div class="switchToggle switch-small ${cls}"><input type="checkbox" name="Switch" id="ea-sw-${a.id}" data-ea-switch="${a.id}"${a.status === 'active' ? ' checked' : ''} aria-label="${tip} ${esc(a.email)}"><label for="ea-sw-${a.id}" data-nx-tip="${tip}"><span></span></label></div>`;
  }
  function senderCell(a) {
    const name = `<h1 class="fromName" role="button" tabindex="0">${esc(a.name)}</h1>`;
    const typeEl = a.type === 'smtp'
      ? '<div class="sender-name-field-smtp-label"><div class="smtp-label-container undefined"><span class="semibold-1 font-medium gray-txt-15">SMTP</span></div></div>'
      : `<img class="type" src="${IMG(TYPE_IMG[a.type])}" alt="Email Type">`;
    const def = a.isDefault ? '<div class="default-email-badge">Default</div>' : '';
    const modify = a.type === 'smtp' ? `<div class="sender-name-field-modify" role="button" tabindex="0" data-nx-tip="Edit Email Settings">${svg('Pencil', 16)}</div>` : '';
    const email = `<p class="fromEmail" role="button" tabindex="0">${esc(a.email)}</p>`;
    let second;
    if (a.status === 'active') second = `${email}<img class="status" src="${IMG('circle-check-green.svg')}" alt="Email Type" data-nx-tip="Connected">`;
    else if (a.status === 'paused') second = email;
    else second = `<img class="status" src="${IMG('alert-triangle-red.svg')}" alt="Email Type" data-nx-tip="Disconnected">${email}`;
    return `<div class="sender-name-field"><div class="sender-name-field--inner">${name}${typeEl}${def}${modify}</div><div class="sender-name-field--inner">${second}</div></div>`;
  }
  const seqCell = (a) => `<div class="active-sequences-field">${a.sequences.length
    ? `<p class="active-sequences-label cursor-pointer" role="button" tabindex="0">${a.sequences.length}</p>`
    : '<p class="active-sequences-label blue-txt-15">-</p>'}</div>`;
  const WARM = { running: ['running clickable', 'Running', 'Warm-up active. Click to pause warm-up.'], paused: ['paused clickable', 'Paused', 'Warm-up paused. Click to activate warm-up.'], stopped: ['stopped', 'Stopped', 'Email warm-up is stopped because of the technical issues.'] };
  const warmCell = (a) => { const [c, l, t] = WARM[a.warmup]; return `<div class="${c}" role="button" tabindex="0" data-nx-tip="${t}"><span class="badge-dot"></span><span class="badge-label">${l}</span></div>`; };
  function readinessCell(a) {
    const s = a.readiness >= 90 ? ['ready-for-outreach', 'Ready for Outreach', 'Send', "Your email deliverability looks good. You're ready to start outreach."]
      : a.readiness >= 50 ? ['warming-up', 'Warming Up', 'Flame', 'Your email is still warming up. Keep going before starting outreach.']
        : ['needs-recovery', 'Needs Recovery', 'AlertTriangle', 'Your email deliverability is low. Continue warming up to recover.'];
    return `<div class="outreach-readiness-status ${s[0]}" data-nx-tip="${esc(s[3])}"><span class="badge-icon">${svg(s[2], 14)}</span><span class="badge-label">${s[1]}</span></div>`;
  }
  const delivCell = (a) => (a.deliverability ? `<span class="font-weight-medium">${a.deliverability}%</span>` : '<span>-</span>');
  function scoreCell(a) {
    if (!a.health || a.health < 10) return '<button type="button" class="shd-button shd-button--link"><span>Check New Score</span></button>';
    const st = a.health > 70 ? 'excellent' : a.health > 50 ? 'average' : 'poor';
    return `<div class="setup-score-field ${st}" role="button" tabindex="0" data-nx-tip="Click to know more"><span>${a.health}</span></div>`;
  }
  const dnsCell = (ok, label) => `<div class="cursor-pointer" role="button" tabindex="0">${ok
    ? `<span data-nx-tip="${label} verified - view record details">${svg('Check', 16, 'check-cross-icon', 'color="#059669"')}</span>`
    : `<span data-nx-tip="Click to Learn More">${svg('Cross', 16, 'check-cross-icon', 'color="#DC2626"')}</span>`}</div>`;
  const blCell = (n) => `<div class="cursor-pointer${n ? ' font-weight-medium' : ''} ${n > 2 ? 'color-red' : n > 0 ? 'color-orange' : 'color-green'}" role="button" tabindex="0"><span>${n}</span></div>`;
  const customDomainCell = (ok) => (ok ? `<div class="">${svg('Check', 16, 'check-cross-icon', 'color="#059669"')}</div>`
    : `<div class="cursor-pointer"><span data-nx-tip="Click to Setup">${svg('Cross', 16, 'check-cross-icon', 'color="#DC2626"')}</span></div>`);
  function tagsCell(tags) { // prospect-tags-row.tsx
    if (!tags.length) return '<div class="prospect-tag-row">-</div>';
    const tag = (t) => `<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2 d-flex"><span class="">${esc(t)}</span></span></div></div>`;
    if (tags.length >= 3) return `<div class="prospect-tag-row">${tag(tags[0])}<div><div class="bs-tag bs-tag-blue-17 d-flex flex-row" role="button" tabindex="0"><span class="regular-2">+${tags.length - 1}</span></div></div></div>`;
    return `<div class="prospect-tag-row">${tags.map(tag).join('')}</div>`;
  }
  function sentCell(a) {
    const pct = a.limit ? (a.sent * 100) / a.limit : 0;
    const col = pct > 80 ? 'red-19 red-bar' : 'blue-13 blue-bar';
    const bg = pct >= 86 ? '#F87171' : pct >= 51 ? '#FBBF24' : '#34D399';
    return `<div><div class="email-sent-field" data-nx-tip="Daily sending limit: ${a.limit}, used today: ${a.sent}, remaining: ${a.limit - a.sent}"><div class="email-sent-progress-bar ${col}"><div class="progress-bar-wrapper"><span style="width: ${pct}%;"><span class="progress-bar-wrapper__bar" style="background-color: ${bg};"></span></span></div></div><div class="email-sent-stat"><p style="cursor: pointer;" role="button" tabindex="0"><span>${a.sent}</span>/${a.limit}</p></div></div></div>`;
  }
  const addedByCell = (a) => `<div class="added-by-field"><div class="shd-avatar shd-avatar--sm" data-nx-tip="${esc(a.addedBy)}"><span>${a.addedBy.split(' ').map((p) => p[0]).join('').toUpperCase()}</span></div></div>`;

  /* ───────── table (organisms/table + get-email-accounts-columns.tsx) ───────── */
  const sortIcon = `<div role="button" class="sort-button"><img src="${IMG('arrows-sort.svg')}" alt=""></div>`;
  const thText = (t, cls, sort) => `<th tabindex="0" class="${sort ? 'true ' : ''}${cls}" style="text-align: start;"><div class="d-flex"><span class="semibold-1 gray-txt-12">${t}</span>${sort ? sortIcon : ''}</div></th>`;
  const thTI = (t, sort) => `<th tabindex="0" class="${sort ? 'true' : ''}" style="text-align: start;"><div class="d-flex"><div class="trulyinbox">${svg('Trulyinbox', 16, 'icon-trulyinbox')}<span>${t}</span></div>${sort ? sortIcon : ''}</div></th>`;
  const thInfo = (t) => `<th tabindex="0" class="" style="text-align: start;"><div class="d-flex"><div class="header-icon-component"><span>${t}</span><div>${svg('InfoCircle', 16, 'info-icon-popover-btn cursor-pointer isInfoIconNotVisible')}</div></div></div></th>`;

  function rowHTML(a, sel) {
    return `<tr data-ea-row="${a.id}">
      <td class="selection-cell">${checkbox(`data-ea-sel="${a.id}" aria-label="Select ${esc(a.email)}"`, sel)}</td>
      <td class="status-cell email-account-switch-cell">${switchCell(a)}</td>
      <td class="sender-name-cell name-cell with-toggle">${senderCell(a)}</td>
      <td class="active-sequences-cell active-sequence-cell-header">${seqCell(a)}</td>
      <td class="warmup-status-cell">${warmCell(a)}</td>
      <td class="warmup-status-cell">${readinessCell(a)}</td>
      <td class="deliverability-score-cell">${delivCell(a)}</td>
      <td class="setup-score-cell">${scoreCell(a)}</td>
      <td>${dnsCell(a.dns.spf, 'SPF')}</td>
      <td>${dnsCell(a.dns.dkim, 'DKIM')}</td>
      <td>${dnsCell(a.dns.dmarc, 'DMARC')}</td>
      <td>${dnsCell(a.dns.ptr, 'PTR (rDNS)')}</td>
      <td>${blCell(a.dns.domainBl)}</td>
      <td>${blCell(a.dns.ipBl)}</td>
      <td>${dnsCell(a.dns.mx, 'MX Record')}</td>
      <td>${customDomainCell(a.dns.custom)}</td>
      <td class="tag-detail" style="width: 5rem;">${tagsCell(a.tags)}</td>
      <td class="email-sent-cell">${sentCell(a)}</td>
      <td class="added-by-cell">${addedByCell(a)}</td>
      <td style="text-align: right; padding-left: 0rem; padding-right: 0rem; border-top: none;"><div class="grid-flex"><div class="grid-action"><div class="dropdown-custom dropdown"><button aria-haspopup="true" aria-expanded="false" id="dropdown-basic-${a.id}" type="button" class="dropdown-toggle-custom btn btn-dropdown-custom" data-ea-menu="${a.id}" aria-label="Actions for ${esc(a.email)}"><i class="sh-more-vertical-alt icon-hover gray-txt-15"></i></button></div></div></div></td>
    </tr>`;
  }

  function pagination(total, limit) {
    const pages = Math.max(1, Math.ceil(total / limit));
    return `<div class="pagination-container d-flex pagination-container-new"><div class="pagination-row d-flex">
      <div class="pagination-select-count d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt mr-2">Showing</span>
        <div class="transfer-select-box"><div class="bs-select-box" tabindex="0"><div class="bs-select-box-text"><span class="blue-txt-15">${limit}</span></div><div class="bs-select-box-icon-wrapper">${svg('ChevronDown', 16)}</div></div></div>
        <span class="regular-2 popover-arrow-color-txt ml-2 total-pagination-count">out of ${total}</span></div>
      <div class="divider"></div>
      <div class="pagination-page-input d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt mr-2 go-to-page">Go to page:</span><div class="mt-1"><form onsubmit="return false"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default"><input type="number" min="1" max="${pages}" class="bs-input-md bs-input" value="" aria-label="Go to page"></span></form></div><span class="regular-2 popover-arrow-color-txt ml-2">/${pages}</span></div>
      <ul class="pagination"><li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-left"></i></span><span class="sr-only">Previous</span></span></li><li class="page-item active"><span class="page-link">1<span class="sr-only">(current)</span></span></li><li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-right"></i></span><span class="sr-only">Next</span></span></li></ul>
    </div></div>`;
  }

  window.EA_TABLE = (d) => {
    const selOnPage = d.rows.filter(d.isSel).length;
    const head = d.rows.length && selOnPage === d.rows.length ? true : selOnPage ? 'mixed' : false;
    const rows = d.rows.map((a) => rowHTML(a, d.isSel(a))).join('');
    return `<div class="table-scroll-container email-accounts-table ${d.anySelected ? 'selected' : 'not-selected'}" style="overflow-x: auto; white-space: nowrap; position: relative;">
      <div class="table-list email-accounts-table"><div class="bs-table bs-table-small"><div class="bs-table-container"><div class="bs-table-content"><div class="react-bootstrap-table">
        <table class="table table-organism"><thead class="table-organism-header "><tr>
          <th class="selection-cell-header" data-row-selection="true" style="width: 20px;">${checkbox('data-ea="check-all" aria-label="Select all on this page"', head)}</th>
          <th tabindex="0" class="status-header" style="text-align: start;"><div class="d-flex"><span class="semibold-1 gray-txt-12"></span></div></th>
          ${thText('Sender Name', 'name-header with-toggle')}${thText('Active Sequences', 'active-sequence-cell-header')}
          ${thTI('Warm-up Status')}${thTI('Outreach Readiness')}${thTI('Deliverability Score', true)}${thText('Setup Score', '', true)}
          ${thInfo('SPF')}${thInfo('DKIM')}${thInfo('DMARC')}${thInfo('PTR (rDNS)')}${thInfo('Domain Blacklist')}${thInfo('IP Blacklist')}${thInfo('MX Record')}${thInfo('Custom Domain')}
          <th tabindex="0" class="" style="text-align: left;"><div class="d-flex"><span class="semibold-1 gray-txt-12">Tags</span></div></th>
          <th tabindex="0" class="" style="min-width: 10.5rem; width: 10.5rem; text-align: start;"><div class="d-flex"><span class="semibold-1 gray-txt-12">Email Sent</span></div></th>
          ${thText('Added By', '')}
          <th tabindex="0" class="bs-table-thead" style="display: table-cell; text-align: center;"><div class="d-flex"><span class="semibold-1 gray-txt-12"></span></div></th>
        </tr></thead>
        <tbody class="table-organism-body  ">${rows}</tbody></table>
      </div></div>${pagination(d.total, 25)}</div></div></div></div>`;
  };

  /* ───────── actions bar (email-accounts-actions.tsx) ───────── */
  window.EA_ACTIONS = (d) => `<div class="email-accounts-actions">
      <div class="d-flex align-items-center ea-actions-left">
        <form onsubmit="return false"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default search-input"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search" class="bs-input-md bs-input" value="" aria-label="Search email accounts"></span></form>
        <div class="icon-container position-relative"><div class="d-flex align-items-center justify-content-center icon" role="button" tabindex="0" aria-label="Filters" data-ea-noop>${svg('Filter', 24)}</div></div>
        <div class="separator-line"></div>
        <div class="${d.view === 'today' ? 'd-flex align-items-center justify-content-center email-account-icons' : 'ea-bulk-host'}" data-ea="bulk"></div>
      </div>
      <div class="d-flex gap-16 justify-content-center align-items-center ea-actions-right">
        <span data-nx-tip="Domains" role="button" tabindex="0" aria-label="Domains" data-ea-noop class="d-flex">${svg('World', 24, '', 'color="#6B7280" cursor="pointer"')}</span>
        <button type="button" class="shd-button shd-button--secondary header-btn login-with-trulyinbox" data-ea-noop><span>Warm-up Dashboard${svg('ArrowUpRight', 16, 'blue-txt-11 ml-1')}</span></button>
        <button type="button" class="shd-button shd-button--primary header-btn" data-ea-noop><span>Add Email Account</span></button>
      </div>
    </div>`;

  /* Today's icon bar: four icon actions plus AddRemoveTag's tag button; disabled until something is selected */
  window.EA_TODAY_ICONS = (enabled) => {
    const cls = `icon d-flex align-items-center justify-content-center${enabled ? '' : ' disabled'}`;
    const it = (key, tip, ic) => `<div class="${cls}" role="button" tabindex="0" data-ea-today="${key}" aria-label="${tip}" data-nx-tip="${tip}">${svg(ic, 24)}</div>`;
    return it('bulk_update_settings', 'Bulk update Settings', 'Adjustments') + it('refresh_setup_score', 'Refresh Setup Score', 'Refresh')
      + it('disconnect', 'Disconnect Email Accounts', 'Unlink') + it('delete', 'Delete Email Accounts', 'Trash')
      + `<div class="tag-button-container"><div class="tag-icon d-flex align-items-center justify-content-center ${enabled ? '' : 'disabled'}" role="button" tabindex="0" data-ea-today="tags" aria-label="Add or remove tags" data-nx-tip="Add or remove tags">${svg('Tag', 24)}</div></div>`;
  };
  /* AddRemoveTag dropdown: Add Tags / Remove Tags */
  window.EA_TAG_DROPDOWN = () => `<div class="add-btn-container"><ul class="dropdown-container">
      <li class="menu-item" role="button" tabindex="0" data-ea-tagmenu="add"><div class="add-tag-btn dropdown"><div class="p-text-tag"><p class="tag-list-font menu-text">Add Tags</p></div></div></li>
      <li class="menu-item" role="button" tabindex="0" data-ea-tagmenu="remove"><div class="add-tag-btn dropdown"><div class="p-text-tag remove-tag-modal"><p class="tag-list-font menu-text">Remove Tags</p></div></div></li>
    </ul></div>`;

  /* ───────── selection banner, today (email-selected-info-banner.tsx) ───────── */
  window.EA_TODAY_BANNER = (o) => {
    const el = h('<div class="email-selected-row-info email-selected-row-info-waring"></div>');
    const row = h('<div class="d-flex"></div>');
    if (o.count === 25000) row.appendChild(h('<span class="semibold-1 popover-arrow-color-txt mr-1">First</span>'));
    row.appendChild(h(`<span class="semibold-1 popover-arrow-color-txt mr-2">${fmt(o.count)} Email Account(s) selected.</span>`));
    if (!o.allSelected && o.total !== o.count) {
      const s = h(`<span role="button" tabindex="0" class="semibold-1 blue-txt-11">Select all ${o.total} Email Account(s)</span>`);
      s.addEventListener('click', o.onSelectAll);
      row.append(s, h('<span class="divider-vertical"></span>'));
    }
    const c = h('<span role="button" tabindex="0" class="semibold-1 blue-txt-11">Clear selection</span>');
    c.addEventListener('click', o.onClear);
    row.appendChild(c);
    el.appendChild(row);
    return el;
  };

  /* ───────── row actions dropdown (organisms/table generateDropdownItemsListFromActions) ───────── */
  window.EA_ROW_MENU_HTML = (items) => `<div class="dropdown-menu-custom show ea-row-menu" role="menu" x-placement="bottom-start">${items.map((it) => `<a href="#" role="menuitem" class="dropdown-item-custom${it.disabled ? ' table-action-icon-disabled' : ''}" data-ea-act="${it.key}"${it.tip ? ` data-nx-tip="${esc(it.tip)}"` : ''}>${svg(it.icon, 16)}<span class="regular-2 gray-txt-15 ml-2">${it.label}</span></a>`).join('')}</div>`;

  /* ───────── today's modals, production markup and copy ───────── */
  function modalShell(o) {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="contained-modal-title-vcenter" class="fade ${o.cls} modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          ${o.header === false ? '' : `<div class="bs-modal-header modal-header"><div class="modal-title h4" id="contained-modal-title-vcenter">${o.title}</div>${o.close ? '<button type="button" class="close btn btn-solid-default btn-solid-md" aria-label="Close"><i class="sh-close"></i></button>' : ''}</div>`}
          <div class="bs-modal-body modal-body">${o.body}</div>
          ${o.footer === false ? '' : `<div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;">
            <button type="button" class="btn-ghost btn-ghost-outlined btn-ghost-md${o.cancelCls ? ' ' + o.cancelCls : ''}" data-ea-m="cancel">${o.cancel || 'Cancel'}</button>
            <button type="button" class="btn-solid btn-solid-primary btn-solid-md${o.submitCls ? ' ' + o.submitCls : ''}" data-ea-m="submit"${o.submitDisabled ? ' disabled' : ''}>${o.submit || 'Yes'}</button></div></div>`}
        </div></div></div></div></div>`);
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape' && !o.static) close(); }
    document.addEventListener('keydown', onKey, true);
    root.querySelectorAll('[data-ea-m="cancel"], .close').forEach((b) => b.addEventListener('click', close));
    const submit = root.querySelector('[data-ea-m="submit"]');
    if (submit) submit.addEventListener('click', () => { if (submit.disabled) return; o.onSubmit && o.onSubmit({ root, close, submit }); });
    document.body.appendChild(root);
    return { root, close, submit };
  }
  window.EA_MODAL = modalShell;

  const V3_TITLE = (icon, title) => `<div class="confirmation-modal-v3--title d-flex align-items-center icon-${icon[0]}"><img src="${IMG(icon[1])}" alt="empty-data/"><h2>${title}</h2></div>`;
  const DELETE_COPY = 'Once you delete an email account, all the sequences using the email account will be paused. If any sequence is not started, you can change the email account and resume it later. Other sequences can not be activated later.';

  /* Bulk Disconnect: ConfirmationModalV3, yellow info icon (email-accounts-actions.tsx L684-700) */
  window.EA_TODAY_BULK_DISCONNECT = (onYes) => modalShell({
    cls: 'bs-modal-container confirmation-modal-v3 email-account-confirmation-popup disconnect', close: true,
    title: V3_TITLE(['info-circle-yellow', 'info-circle-yellow.svg'], 'Disconnect Email Accounts'),
    body: '<div class="confirmation-modal-v3--body"><div class="confirmation-modal-v3--body__content"><div class="">Are you sure you want to disconnect all the selected email accounts?</div></div></div>',
    onSubmit: ({ close }) => { close(); onYes(); },
  });
  /* Bulk Delete: ConfirmationModalV3, red trash icon, no close icon (L722-740) */
  window.EA_TODAY_BULK_DELETE = (onYes) => modalShell({
    cls: 'bs-modal-container confirmation-modal-v3 email-account-confirmation-popup delete',
    title: V3_TITLE(['trash-red', 'trash-danger.svg'], 'Delete Email Accounts'),
    body: `<div class="confirmation-modal-v3--body"><div class="confirmation-modal-v3--body__content"><div class=""><span>${DELETE_COPY}</span></div></div></div>`,
    onSubmit: ({ close }) => { close(); onYes(); },
  });
  /* Single Delete: Modal "delete-modal" with AlertInfoCircle (delete-email-account-modal.tsx) */
  window.EA_TODAY_DELETE = (onYes) => modalShell({
    cls: 'bs-modal-container delete-modal',
    title: `<div class="d-flex"><img src="${IMG('info-circle-red.svg')}" alt="sh-logo-icon/"><div class="pl-2"> Delete Email Accounts</div></div>`,
    body: `<div><span class="regular-2">${DELETE_COPY}</span></div>`,
    onSubmit: ({ close }) => { close(); onYes(); },
  });
  /* Single Disconnect: legacy ConfirmationModal, no header or footer (disconnect-email-account-modal.tsx) */
  window.EA_TODAY_DISCONNECT = (onYes) => {
    const m = modalShell({
      cls: 'bs-modal-container confirm-modal-width disconnect-email-account-modal', header: false, footer: false, static: true,
      body: `<div class="bs-modal-content"><div class="bs-modal-icon icon-warning"><i class="sh-info"></i></div><div class="bs-modal-inner-content"><h3 class="bs-modal-inner-content__title">Do you want to disconnect this email account?</h3><p class="bs-mb-20 bs-mt-15">Once you disconnect the email account, Your all sequences using this email account will be paused.</p></div></div>
        <div class="d-flex justify-content-end "><button type="button" class="bs-mr-5 btn-solid btn-solid-outlined btn-solid-md" data-ea-m="cancel2">Cancel</button><button type="button" class="submit-btn btn-solid btn-solid-primary btn-solid-md" data-ea-m="yes2">Yes</button></div>`,
    });
    m.root.querySelector('[data-ea-m="cancel2"]').addEventListener('click', m.close);
    m.root.querySelector('[data-ea-m="yes2"]').addEventListener('click', () => { m.close(); onYes(); });
    return m;
  };
  /* Remove Tags: AddRemoveTag modal with TagAutosuggest2, Apply (add-remove-tag.tsx L102-153 per the audit) */
  window.EA_TODAY_REMOVE_TAGS = (tags, onApply) => {
    const picked = [];
    const m = modalShell({
      cls: 'bs-modal-container add-remove-tag-email-modal', close: true, static: true, submit: 'Apply', submitCls: 'submit-btn', cancelCls: 'cancel-btn', submitDisabled: true,
      title: `<div class="modal-header-title"><img src="${IMG('tag-blue.svg')}" alt="sh-tag-icon/"><div class="pl-2">Remove Tags</div></div>`,
      body: `<div class="email-tab-tags remove-tag-modal modal-input remove-tag-modal-color"><div class="tags-autosuggest-container"><div class="react-autosuggest__container react-autosuggest__container--open">
        <div class="fixed-height-input-container"><div class="tags-wrapper"><span data-ea="chips" class="ea-chips"></span><div class="d-inline-block w-100"><div><input class="selected-tags-inline-input" placeholder="Enter a tag" aria-label="Enter a tag"></div></div></div></div>
        <div class="react-autosuggest__suggestions-container react-autosuggest__suggestions-container--open ea-sugg" style="display: block; border: 1px solid #D1D5DB; border-radius: 4px; font-family: Inter; font-size: 14px; line-height: 20px; margin-top: 10px; height: 11.45rem; overflow: auto; background-color: white;">
          <ul role="listbox" class="react-autosuggest__suggestions-list" style="margin: 0; padding: 0; list-style-type: none;"></ul></div>
      </div></div></div>`,
      onSubmit: ({ close }) => { close(); onApply(picked.slice()); },
    });
    const ul = m.root.querySelector('ul');
    const chips = m.root.querySelector('[data-ea="chips"]');
    const draw = () => {
      ul.innerHTML = tags.filter((t) => !picked.includes(t)).map((t) => `<li role="option" class="react-autosuggest__suggestion" data-ea-sug="${esc(t)}"><div class="bs-py-6 bs-px-12 pointer">${esc(t)}</div></li>`).join('');
      chips.innerHTML = picked.map((t) => `<div><div class="bs-tag bs-tag-blue-17 d-inline-flex ea-chip"><span class="regular-2">${esc(t)}</span><i class="sh-close ml-1" role="button" tabindex="0" data-ea-unpick="${esc(t)}" aria-label="Remove ${esc(t)}"></i></div></div>`).join('');
      m.submit.disabled = !picked.length;
    };
    ul.addEventListener('click', (e) => { const li = e.target.closest('[data-ea-sug]'); if (li) { picked.push(li.getAttribute('data-ea-sug')); draw(); } });
    chips.addEventListener('click', (e) => { const x = e.target.closest('[data-ea-unpick]'); if (x) { picked.splice(picked.indexOf(x.getAttribute('data-ea-unpick')), 1); draw(); } });
    draw();
    return Object.assign(m, { pick: (t) => { picked.push(t); draw(); } });
  };
})();
