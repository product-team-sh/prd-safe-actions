/* Production markup for Tasks, reproduced from webui main aeda4e3:
   tasks.tsx, tasks-header/task-header.tsx, tasks-content/tasks-content.tsx, tasks-filter-bar.tsx,
   tasks-bulk-actions.tsx, tasks-selected-info-banner.tsx, utils/tasks-columns.tsx, utils/step-icon.tsx,
   organisms/table (react-bootstrap-table-next, isNewPagination), ContactNameField, Priority, @saleshandy/design-system
   Avatar and Button, ConfirmationModalV3, bulk-retry-modal.tsx, toaster with undo.
   Icons are @saleshandy/icons paths, copied verbatim. Anything new is marked .nx-new. Loaded before tasks.js. */
(function () {
  'use strict';
  const { fmt, h, esc } = NX;

  /* @saleshandy/icons (dist/index.esm.js), width/height filled in by svg() */
  const RAW = {
    ForwardStep: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M15.707 11.293a1 1 0 0 1 0 1.414l-8 6A1 1 0 0 1 6 18V6a1 1 0 0 1 1.707-.707l8 6ZM8 8.414v7.172L13.4 12 8 8.414Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M17 5c.552 0 1 .348 1 .778v12.444c0 .43-.448.778-1 .778s-1-.348-1-.778V5.778c0-.43.448-.778 1-.778Z\" clip-rule=\"evenodd\"/></svg>",
    Alarm: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"13\" r=\"8\" stroke=\"currentColor\" stroke-width=\"2\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M7.559 2.412a1 1 0 0 1-.22 1.397l-2.75 2A1 1 0 0 1 3.411 4.19l2.75-2a1 1 0 0 1 1.397.22ZM16.191 2.412a1 1 0 0 1 1.397-.22l2.75 2a1 1 0 1 1-1.176 1.617l-2.75-2a1 1 0 0 1-.22-1.397ZM12 9a1 1 0 0 1 1 1v3.586l1.707 1.707a1 1 0 0 1-1.414 1.414l-2-2A1 1 0 0 1 11 14v-4a1 1 0 0 1 1-1Z\" clip-rule=\"evenodd\"/></svg>",
    CircleCheck: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M15.707 9.3a1 1 0 0 1 0 1.415l-4 4a1 1 0 0 1-1.414 0l-2-2A1 1 0 1 1 9.707 11.3L11 12.593 14.293 9.3a1 1 0 0 1 1.414 0Z\" clip-rule=\"evenodd\"/></svg>",
    Link: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M13.293 4.29a4.536 4.536 0 0 1 6.414 6.413L15.71 14.7a4.5 4.5 0 0 1-6.424-.004 1 1 0 0 1 1.428-1.4 2.5 2.5 0 0 0 3.572 0l.007-.007 4-4a2.536 2.536 0 0 0-3.586-3.586l-.5.5a1 1 0 1 1-1.414-1.414l.5-.5Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M9.757 8.305a4.5 4.5 0 0 1 4.957.999 1 1 0 0 1-1.428 1.4 2.5 2.5 0 0 0-3.572 0l-.007.007-4 4a2.535 2.535 0 1 0 3.586 3.586l.5-.5a1 1 0 1 1 1.414 1.414l-.5.5a4.536 4.536 0 0 1-6.414-6.414L8.289 9.3a4.5 4.5 0 0 1 1.468-.995Z\" clip-rule=\"evenodd\"/></svg>",
    Refresh: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M4 3.008a1 1 0 0 1 1 1V6.28a9.1 9.1 0 0 1 15.99 4.59 1 1 0 0 1-1.98.275A7.1 7.1 0 0 0 6.19 8.008H9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1ZM3.862 12.017a1 1 0 0 1 1.129.853 7.1 7.1 0 0 0 12.818 3.138H15a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.273a9.1 9.1 0 0 1-15.99-4.59 1 1 0 0 1 .852-1.128Z\" clip-rule=\"evenodd\"/></svg>",
    Filter: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M5.17 4.049a1 1 0 0 1 .33-.056h13a1 1 0 0 1 .331.056 2 2 0 0 1 1 3c-.027.04-.058.08-.091.116L15 12.38v6.614a1 1 0 0 1-1.6.8l-4-3a1 1 0 0 1-.4-.8v-3.614L4.26 7.165a1 1 0 0 1-.09-.116 2 2 0 0 1 1-3Zm.727 1.944 4.843 5.327a1 1 0 0 1 .26.673v3.5l2 1.5v-5a1 1 0 0 1 .26-.673l4.843-5.327H5.897Z\" clip-rule=\"evenodd\"/></svg>",
    Signal: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M5 5.007a1 1 0 0 0-1 .975 15 15 0 0 0 14.026 14.025 1 1 0 0 0 .974-1v-3.323l-3.58-1.432-1.063 1.77a1 1 0 0 1-1.3.382 12 12 0 0 1-5.454-5.454 1 1 0 0 1 .383-1.3l1.77-1.062-1.433-3.58H5Zm-2.121-1.12A3 3 0 0 1 5 3.006h4a1 1 0 0 1 .928.63l2 5a1 1 0 0 1-.414 1.228l-1.673 1.004a10.001 10.001 0 0 0 3.297 3.298l1.005-1.674a1 1 0 0 1 1.228-.414l5 2a1 1 0 0 1 .629.928v4a3 3 0 0 1-3.06 2.999A17 17 0 0 1 2 6.007a3 3 0 0 1 .879-2.12Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M14 7.007a1 1 0 0 1 1-1 3 3 0 0 1 3 3 1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 0 1-1-1Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M14 3a1 1 0 0 1 1-1 7 7 0 0 1 7 7 1 1 0 1 1-2 0 5 5 0 0 0-5-5 1 1 0 0 1-1-1Z\" clip-rule=\"evenodd\"/></svg>",
    Mail: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M5 5.993a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1H5Zm-3 1a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-10Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M2.168 6.453a1 1 0 0 1 1.387-.278L12 11.805l8.445-5.63a1 1 0 0 1 1.11 1.665l-9 6a1 1 0 0 1-1.11 0l-9-6a1 1 0 0 1-.277-1.387Z\" clip-rule=\"evenodd\"/></svg>",
    LinkedinSquare: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><rect width=\"19\" height=\"19\" x=\"2.5\" y=\"2.5\" stroke=\"currentColor\" stroke-width=\"2\" rx=\"3.8\"/><path fill=\"currentColor\" d=\"M9.464 7.27c0 .7-.608 1.268-1.357 1.268-.75 0-1.357-.568-1.357-1.269C6.75 6.57 7.358 6 8.107 6c.75 0 1.357.568 1.357 1.27ZM6.936 9.471h2.32V16.5h-2.32V9.471ZM12.99 9.471h-2.32V16.5h2.32v-3.596c0-.83.283-1.665 1.415-1.665 1.278 0 1.27 1.087 1.265 1.929-.008 1.1.01 2.223.01 3.332H18v-3.71c-.02-2.368-.637-3.46-2.668-3.46-1.206 0-1.953.548-2.342 1.043V9.47Z\"/></svg>",
    AlertCircle: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12 7.004a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1ZM11 15.996a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z\" clip-rule=\"evenodd\"/></svg>",
    ChevronDown: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z\" clip-rule=\"evenodd\"/></svg>",
    ChevronUp: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M11.293 8.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L12 10.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l6-6Z\" clip-rule=\"evenodd\"/></svg>",
    Book: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M7.5 18.79a8 8 0 0 0-4 1.07 1 1 0 0 1-1-1.731 10 10 0 0 1 9.5-.27 10 10 0 0 1 9.5.27 1 1 0 0 1-1 1.732 8 8 0 0 0-8 0 1 1 0 0 1-1 0 8 8 0 0 0-4-1.072ZM7.5 5.793a8 8 0 0 0-4 1.072 1 1 0 1 1-1-1.732 10 10 0 0 1 9.5-.27 10 10 0 0 1 9.5.27 1 1 0 0 1-1 1.732 8 8 0 0 0-8 0 1 1 0 0 1-1 0 8 8 0 0 0-4-1.072Z\" clip-rule=\"evenodd\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M3 5a1 1 0 0 1 1 1v13a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1ZM12 5a1 1 0 0 1 1 1v13a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1ZM21 5a1 1 0 0 1 1 1v13a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z\" clip-rule=\"evenodd\"/></svg>",
    LayoutList: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"W\" height=\"H\" fill=\"none\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M6 5.007a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H6Zm-3 1a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2ZM6 14.992a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H6Zm-3 1a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2Z\" clip-rule=\"evenodd\"/></svg>",
  };
  const svg = (name, size, cls = '') => RAW[name].replace('width="W" height="H"', `width="${size}" height="${size}"${cls ? ` class="${cls}"` : ''}`);
  // shared/svg/retry-icon.tsx
  const retry = (size, cls = '') => `<svg width="${size}" height="${size}" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"${cls ? ` class="${cls}"` : ''} aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.95319 2.00003C7.25066 1.99494 5.60462 2.61052 4.32323 3.73153C3.04183 4.85254 2.2129 6.40213 1.99163 8.09023C1.91985 8.63784 1.41775 9.02357 0.870146 8.95179C0.322546 8.88001 -0.0631841 8.3779 0.00859443 7.8303C0.293089 5.65989 1.35884 3.66755 3.00636 2.22625C4.65387 0.78495 6.7702 -0.00650491 8.95917 4.02729e-05C11.1481 0.00658546 13.2597 0.810682 14.8986 2.26181C16.5374 3.71293 17.5912 5.71161 17.8628 7.88369C18.1343 10.0558 17.6049 12.2523 16.3736 14.0622C15.1424 15.8721 13.2937 17.1712 11.1737 17.7164C9.05371 18.2616 6.80768 18.0154 4.85608 17.024C3.74892 16.4616 2.77957 15.6812 2.00011 14.7398V16.9603C2.00011 17.5126 1.5524 17.9603 1.00011 17.9603C0.447828 17.9603 0.000112812 17.5126 0.000112812 16.9603V11.9603C0.000112812 11.408 0.447828 10.9603 1.00011 10.9603H1.47683C1.49218 10.9599 1.50751 10.9599 1.5228 10.9603H6.00011C6.5524 10.9603 7.00011 11.408 7.00011 11.9603C7.00011 12.5126 6.5524 12.9603 6.00011 12.9603H3.16022C3.81838 13.9195 4.71019 14.7066 5.7619 15.2409C7.27981 16.012 9.02672 16.2035 10.6756 15.7794C12.3245 15.3554 13.7624 14.345 14.72 12.9373C15.6776 11.5296 16.0894 9.82115 15.8782 8.13176C15.667 6.44236 14.8474 4.88784 13.5727 3.75918C12.298 2.63053 10.6557 2.00512 8.95319 2.00003Z" fill="currentColor"/></svg>`;
  // step-icon.tsx LightningBoltIcon (LinkedIn automation tasks)
  const bolt = (size, cls) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" class="${cls}" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  // shared/svg/vector.tsx (Start Tasks)
  const VECTOR = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M5.81176 3.26459C4.81119 2.64402 4 3.1524 4 4.39918V13.5999C4 14.8479 4.81119 15.3557 5.81176 14.7357L13.2493 10.1237C14.2502 9.50291 14.2502 8.49714 13.2493 7.87649L5.81176 3.26459Z" fill="white"/></svg>';
  const LIKE18 = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="gray-txt-15"><path fill="currentColor" fill-rule="evenodd" d="M13 5.007a1 1 0 0 0-1 1v1a5 5 0 0 1-4 4.9v5.1a2 2 0 0 0 2 2h7a1 1 0 0 1 .085.004c.087.007.238-.017.43-.21.2-.199.396-.54.508-1.007l.974-4.869a1 1 0 0 0-.997-.918h-3a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1Zm-7 8H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v-6Zm0-2H5a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h1.551A3.997 3.997 0 0 0 10 21.007h6.968c.743.042 1.444-.287 1.97-.81a4.09 4.09 0 0 0 1.076-2.042l.981-4.904a1 1 0 0 0 .005-.172 3 3 0 0 0-3-3H16v-4a3 3 0 0 0-6 0v1a3 3 0 0 1-3 3h-1Z" clip-rule="evenodd"/></svg>';

  /* step-icon.tsx, module 'tasks-columns' */
  const TYPE = {
    call: (t) => svg('Signal', 20, 'gray-txt-11 hr-purple'),
    linkedin: () => svg('LinkedinSquare', 20, 'gray-txt-11 hr-blue'),
    email: () => svg('Mail', 20, 'gray-txt-11'),
    auto: () => bolt(20, 'gray-txt-9'),
  };
  /* sequence-step.ts getStepPriority + shared/components/priority */
  const PRIORITY = {
    Urgent: ['priority__urgent', '#FEF2F2', '#DC2626'],
    High: ['priority__high', '#FFFBEB', '#D97706'],
    Normal: ['priority__normal', '#EFF6FF', '#3B82F6'],
    Low: ['priority__low', '#ECFEFF', '#0891B2'],
  };

  const checkbox = (attrs, state) => `<label class="bs-checkbox-wrapper"><span class="bs-checkbox${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}><span class="bs-checkbox-inner"></span></span></label>`;

  /* 50px page header, left side (header.tsx: h2 title + LinkBadge "Learn how to manage tasks") */
  window.TK_HEADER = `<div class="p-0"><div class="d-flex header-with-notification"><div class="d-flex align-items-center">
    <h2 class="semibold-3 mb-0 popover-arrow-color-txt">Tasks</h2>
    <span class="ml-2"><a href="#" class="link-badge-anchor" data-tk-noop><button type="button" class="link-badge-button  undefined">${svg('Book', 18)}Learn how to manage tasks</button></a></span>
  </div></div></div>`;

  /* tasks-header/task-header.tsx: status tabs with counts (formatNumberToKM) */
  const km = (n) => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}K`.replace(/\.0K$/, 'K') : String(n));
  function statusTabs(tabs, active) {
    return `<div class="tasks__header">${tabs.map((t) => {
      const on = t.key === active;
      const red = t.key === 'overdue' || t.key === 'failed';
      return `<div class="tasks__header--item ${on ? 'tasks__header--active' : 'false'}" role="button" tabindex="0" data-tk-tab="${t.key}"><div class="d-flex align-items-center">
        <span class="regular-2 font-medium line-height-20 label ${on ? 'font-semibold blue-txt-11' : 'gray-txt-30'}">${t.label}</span>
        <span class="ml-1 regular-1 font-medium count ${red ? 'red-txt-18 red-19' : 'gray-txt-15 gray-16'}">${km(t.count)}</span>
      </div></div>`;
    }).join('')}</div>`;
  }

  /* tasks-columns.tsx hover actions */
  const ACTIONS = [
    ['snooze', 'Alarm', 'Snooze Task'],
    ['skip', 'ForwardStep', 'Skip Task'],
    ['complete', 'CircleCheck', 'Complete Task'],
    ['copy', 'Link', 'Copy Task Link'],
  ];
  function titleCell(t, d) {
    const icon = t.auto ? TYPE.auto() : TYPE[t.type](t);
    let actions = '';
    if (d.tab === 'failed') {
      // Failed tab: Retry + Skip on hover for automated LinkedIn tasks (action-container--compact)
      actions = `<div class="action-container action-container--compact" data-tk-actions>
        <div class="action-item" role="button" tabindex="0" data-tk-act="retry" data-id="${t.id}" data-nx-tip="Retry">${retry(13, 'gray-txt-15')}</div>
        <div class="action-item" role="button" tabindex="0" data-tk-act="skip" data-id="${t.id}" data-nx-tip="Skip Task">${svg('ForwardStep', 20, 'gray-txt-15')}</div></div>`;
    } else if (!d.multiSelected) {
      actions = `<div class="action-container" data-tk-actions>${ACTIONS.map(([k, ic, tip]) => `<div class="action-item" role="button" tabindex="0" data-tk-act="${k}" data-id="${t.id}" data-nx-tip="${tip}">${svg(ic, 20, 'gray-txt-15')}</div>`).join('')}</div>`;
    }
    return `<div class="d-flex align-items-center test-task-title${t.auto ? ' li-auto-task-title' : ' justify-content-between'}" role="button" tabindex="0">
      <div class="task-title-wrapper">${icon}<div class="task-title-text-container"><span class="semibold-2 popover-arrow-color-txt ml-1 task-title-col">${esc(t.title)}</span></div></div>${actions}</div>`;
  }
  /* ContactNameField with showProspectDetailsTooltipOnEmail (no status tag: tasksTableData passes no status) */
  const prospectCell = (t) => `<div class="pointer"><div class="contact-field-name-container"><div class="name-field w-100"><div class="d-flex">
      <span class="mr-2 contact-name-field-tooltip" role="button" tabindex="0"><div class="contact-name-text-container"><span class="contact-name-col">${esc(t.first + ' ' + t.last)}</span></div></span><div></div></div></div>
      <div class="email-field bs-mt-2 email-field-tooltip"><div class="email-field-inner-container-tooltip"><div class="email-field-tooltip-container"><div class="contact-email-text-container w-100"><span class="contact-email-col">${esc(t.email)}</span></div></div></div></div></div></div>`;
  const sourceCell = (t) => `<div class="d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt">Step ${t.step}</span><a class="ml-1 regular-2 font-medium blue-txt-11 pointer" href="#" data-tk-noop><div class="sequence-name-text-container w-100"><span class="sequence-name-col">${esc(t.seq)}</span></div></a></div>`;
  const priorityCell = (t) => { const [c, bg, fg] = PRIORITY[t.priority]; return `<div class="d-flex white-space-nowrap"><div class="priority ${c}" style="background-color: ${bg}; color: ${fg};"><p class="font-12 font-medium">${t.priority}</p></div></div>`; };
  const dueCell = () => '<div class="d-flex white-space-nowrap"><span class="regular-2 popover-arrow-color-txt">Today</span></div>';
  const outcomeCell = (t) => `<div class="d-flex align-items-center">${t.outcome
    ? `<div class="prospect-custom-outcome-select positive-sentiment"><div class="selected-outcome-main"><div>${LIKE18}<span class="">${t.outcome}</span></div><div class="bs-select-box-icon-wrapper outcome-content-wrapper">${svg('ChevronDown', 16)}</div></div></div>`
    : `<div class="prospect-custom-outcome-select default-sentiment"><div class="selected-outcome-main"><div><span class="ml-2">Add Outcome</span></div><div class="bs-select-box-icon-wrapper">${svg('ChevronDown', 16)}</div></div></div>`}</div>`;
  const ownerCell = (t) => `<div class="d-flex align-items-center"><div class="shd-avatar shd-avatar--sm"><span>${t.owner.split(' ').map((s) => s[0]).join('')}</span></div><div class="ml-2 owner-name" style="flex: 1 1 0%; min-width: 0px;"><div class="owner-name-text-container"><span class="owner-name-col regular-2 gray-txt-10">${esc(t.owner)}</span></div></div></div>`;
  const failedAtCell = (t) => `<div class="d-flex white-space-nowrap"><span class="regular-2 gray-txt-10">${t.failedAt}</span></div>`;
  const reasonCell = (t) => `<div class="d-flex align-items-center"><button type="button" class="failed-reason-column__btn btn btn-link p-0 d-flex align-items-center regular-2 red-txt-12" data-tk-noop>${svg('AlertCircle', 16, 'failed-reason-column__icon')}${esc(t.reason)}</button></div>`;

  /* react-bootstrap-table-next header: sortable columns get the custom chevrons (useCustomSortIcon) */
  const SORT = `<div role="button" class="sort-button"><div class="sequence-sorting-icon "><div class="single-icon " role="button" tabindex="0">${svg('ChevronUp', 16)}</div><div class="single-icon " role="button" tabindex="0">${svg('ChevronDown', 16)}</div></div></div>`;
  const th = (text, cls = '', sort = false) => `<th tabindex="0" class="${(sort ? 'true ' : '') + cls}${sort ? ' sortable' : ''}" style="text-align: left;"><div class="d-flex"><span class="semibold-1 gray-txt-12">${text}</span>${sort ? SORT : ''}</div></th>`;

  /* organisms/table pagination, isNewPagination: "Showing [25] out of N | Go to page: [ ] /M" + pages */
  function pageModel(cur, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '…', last];
    if (cur >= last - 3) return [1, '…', last - 4, last - 3, last - 2, last - 1, last];
    return [1, '…', cur - 1, cur, cur + 1, '…', last];
  }
  function pagination(page, pages, total, pageSize) {
    if (total <= pageSize) return '';
    const cur = page + 1;
    const li = (n) => n === '…'
      ? '<li class="custom-ellipsis page-item"><a class="page-link" role="button" href="#" tabindex="-1"><span aria-hidden="true">…</span><span class="sr-only">More</span></a></li>'
      : n === cur ? `<li class="page-item active"><span class="page-link">${n}<span class="sr-only">(current)</span></span></li>`
        : `<li class="page-item"><a class="page-link" role="button" href="#" data-tk-page="${n - 1}">${n}</a></li>`;
    const arrow = (dir, dis) => (dis
      ? `<li class="page-item disabled"><span class="page-link" disabled=""><span aria-hidden="true"><i class="sh-chevron-${dir === 'prev' ? 'left' : 'right'}"></i></span><span class="sr-only">${dir === 'prev' ? 'Previous' : 'Next'}</span></span></li>`
      : `<li class="page-item"><a class="page-link" role="button" href="#" data-tk-page="${dir}"><span aria-hidden="true"><i class="sh-chevron-${dir === 'prev' ? 'left' : 'right'}"></i></span><span class="sr-only">${dir === 'prev' ? 'Previous' : 'Next'}</span></a></li>`);
    return `<div class="pagination-container d-flex pagination-container-new"><div class="pagination-row d-flex">
      <div class="pagination-select-count d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt mr-2">Showing</span>
        <div class="bs-select-box" tabindex="0"><div class="bs-select-box-text"><span class="blue-txt-15">${pageSize}</span></div><div class="bs-select-box-icon-wrapper">${svg('ChevronDown', 16)}</div></div>
        <span class="regular-2 popover-arrow-color-txt ml-2 total-pagination-count">out of ${fmt(total)}</span></div>
      <div class="divider"></div>
      <div class="pagination-page-input d-flex align-items-center"><span class="regular-2 popover-arrow-color-txt mr-2 go-to-page">Go to page:</span><div class="mt-1"><form onsubmit="return false"><input type="number" min="1" max="${pages}" class="bs-input page-number-input" value="" aria-label="Go to page"></form></div><span class="regular-2 popover-arrow-color-txt ml-2">/${pages}</span></div>
      <ul class="pagination">${arrow('prev', cur === 1)}${pageModel(cur, pages).map(li).join('')}${arrow('next', cur === pages)}</ul>
    </div></div>`;
  }

  /* Whole page: .tasks > header tabs + .tasks__content (filter bar, banner, table) */
  window.TK_PAGE = (d) => {
    const failed = d.tab === 'failed';
    const selOnPage = d.rows.filter(d.isSel).length;
    const head = d.rows.length && selOnPage === d.rows.length ? true : selOnPage ? 'mixed' : false;
    const cols = failed
      ? (t) => `<td class="name-field">${titleCell(t, d)}</td><td class="prospect-field prospect-task-col">${prospectCell(t)}</td><td class="name-field sequence-task-col">${sourceCell(t)}</td><td class="name-field">${failedAtCell(t)}</td><td class="name-field">${reasonCell(t)}</td><td class="owner">${ownerCell(t)}</td>`
      : (t) => `<td class="name-field">${titleCell(t, d)}</td><td class="prospect-field prospect-task-col">${prospectCell(t)}</td><td class="name-field sequence-task-col">${sourceCell(t)}</td><td class="tag-field">${priorityCell(t)}</td><td class="name-field">${dueCell(t)}</td><td class="prospect-outcome-col">${outcomeCell(t)}</td><td class="owner">${ownerCell(t)}</td>`;
    const rows = d.rows.map((t) => `<tr data-tk-tr="${t.id}"><td class="task-checkbox-field"><div>${checkbox(`data-tk-row="${t.id}" aria-label="Select ${esc(t.title)} for ${esc(t.first + ' ' + t.last)}"`, d.isSel(t))}</div></td>${cols(t)}</tr>`).join('');
    const headCells = failed
      ? th('Task Title') + th('Prospect', 'name-field') + th('Source') + th('Failed At') + th('Failed Reason') + th('Task Owner')
      : th('Task Title') + th('Prospect', 'name-field') + th('Source') + th('Priority', 'task-sorting', true) + th('Due Date', 'task-sorting', true) + th('Prospect Outcome') + th('Task Owner');
    const table = d.total === 0
      ? `<div class="empty-list"><div class="empty-list__inner"><div class="empty-list__content"><div class="empty-list__title">No tasks here</div></div></div></div>`
      : `<div class="tasks__content-table-list ${d.anySelected ? 'md-table' : ''} ${failed ? 'is-failed-tab' : ''}"><div class="table-list "><div class="bs-table bs-table-small"><div class="bs-table-container">
        <div class="bs-table-content"><div class="react-bootstrap-table"><table class="table table-organism">
          <thead class="table-organism-header tasks-table-header"><tr>
            <th tabindex="0" class="task-checkbox-header" style="text-align: left;"><div class="d-flex"><div class="d-flex align-items-center">${checkbox('data-tk="check-all" aria-label="Select all on this page"', head)}</div></div></th>
            ${headCells}
          </tr></thead>
          <tbody class="table-organism-body tasks-body-wrapper ">${rows}</tbody>
        </table></div></div>
        ${pagination(d.page, d.pages, d.total, d.pageSize)}
      </div></div></div></div>`;
    const done = d.tab === 'completed' || d.tab === 'skipped';
    return `<div class="tasks">${statusTabs(d.tabs, d.tab)}
      <div class="tasks__content">
        <div class="filter-container d-flex justify-content-between">
          <div class="d-flex align-items-center gap-20 tk-left">
            <form onsubmit="return false"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default search-input"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input placeholder="Search here..." class="bs-input-md bs-input" value="" aria-label="Search tasks"></span></form>
            <div class="task-filter-icon-container" role="button" tabindex="0" aria-label="Apply Filters" data-nx-tip="Apply Filters" data-tk-noop>${svg('Filter', 20, 'gray-txt-15')}</div>
            ${done ? '' : `<div class="tasks-separator"></div><div class="${d.view === 'today' ? 'tk-bulk-today' : 'tk-bulk-host'}" data-tk="bulk"></div>`}
          </div>
          <div class="d-flex align-items-center">
            ${d.anySelected ? '' : `<div class="refresh-icon-container" role="button" tabindex="0" aria-label="Refresh" data-nx-tip="Refresh" data-tk-noop>${svg('Refresh', 20, 'gray-txt-15')}</div>`}
            <div class="filter-border"></div>
            <div class="bs-mr-20"><button type="button" class="shd-button shd-button--tertiary task-type-btn transfer-select-btn" data-tk-noop><span><div class="transfer-select-btn-content"><div class="select-icon">${svg('LayoutList', 16)}</div>All Tasks</div><div class="bs-select-box-icon-wrapper">${svg('ChevronDown', 16)}</div></span></button></div>
            ${d.total !== 0 && !done ? `<button type="button" class="shd-button shd-button--primary start-tasks-btn" data-tk-noop><span>${VECTOR}<span class="ml-1">Start Tasks</span></span></button>` : ''}
          </div>
        </div>
        <div class="tasks-banner" data-tk="banner"></div>
        ${table}
      </div></div>`;
  };

  /* tasks-bulk-actions.tsx, as production renders it today */
  window.TK_TODAY_BULK = (tab, has, count) => {
    const item = (k, icon, tip, dis) => `<div class="bulk-actions__action ${dis ? 'cursor-not-allowed bulk-disable' : 'false'}"><div class="bulk-actions__action-icon ${dis ? 'cursor-not-allowed bulk-disable' : 'false'}" role="button" tabindex="0" data-tk-bulk="${k}" data-nx-tip="${tip}"${dis ? ' aria-disabled="true"' : ''}>${icon}</div></div>`;
    if (tab === 'failed') return `<div class="bulk-actions d-flex align-items-center">${item('retry', retry(15), 'Retry Tasks', !has)}${item('skip', svg('ForwardStep', 20), 'Skip Tasks', !has)}</div>`;
    return `<div class="bulk-actions d-flex align-items-center">${item('snooze', svg('Alarm', 20), 'Snooze Tasks', !has)}${item('skip', svg('ForwardStep', 20), 'Skip Tasks', !has)}${item('complete', svg('CircleCheck', 20), 'Complete Tasks', !has || count > 1)}</div>`;
  };

  /* tasks-selected-info-banner.tsx, as production renders it today: "1,120 Task(s) selected." */
  window.TK_TODAY_BANNER = (count, total, allSelected, pageCount) => {
    const showSelectAll = !allSelected && total !== pageCount;
    return `<div class="email-selected-row-info email-selected-row-info-waring"><div class="d-flex">
      ${count === 25000 ? '<span class="semibold-1 popover-arrow-color-txt mr-1">First</span>' : ''}
      <span class="semibold-1 popover-arrow-color-txt mr-2">${fmt(count)} Task(s) selected.</span>
      ${showSelectAll ? '<span role="button" class="semibold-1 blue-txt-11" tabindex="0" data-tk-today="all">Select all Task(s)</span><span class="divider-vertical"></span>' : ''}
      <span role="button" class="semibold-1 blue-txt-11" tabindex="0" data-tk-today="clear">Clear selection</span></div></div>`;
  };

  /* ConfirmationModalV3 as tasks-content.tsx L2303-2345 renders it (skip), and bulk-retry-modal.tsx */
  window.TK_TODAY_MODAL = (o) => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="contained-modal-title-vcenter" class="fade bs-modal-container confirmation-modal-v3 ${o.className} modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-header modal-header"><div class="modal-title h4"><div class="confirmation-modal-v3--title d-flex align-items-center icon-undefined"><div class="orange-txt-14 d-flex align-items-center">${o.icon}</div><h2>${o.title}</h2></div></div></div>
          <div class="bs-modal-body modal-body"><div class="confirmation-modal-v3--body"><div class="confirmation-modal-v3--body__content"><div class="">${o.content}</div></div></div></div>
          <div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;"><button type="button" class="btn-ghost btn-ghost-outlined btn-ghost-md">${o.cancel}</button><button type="button" class="btn-solid btn-solid-primary btn-solid-md">${o.submit}</button></div></div>
        </div></div></div></div></div>`);
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey, true);
    const [cancel, submit] = root.querySelectorAll('.bs-modal-footer-action-buttons button');
    cancel.addEventListener('click', close);
    submit.addEventListener('click', () => { close(); o.onSubmit(); });
    document.body.appendChild(root);
    return { close };
  };
  window.TK_SKIP_ICON24 = svg('ForwardStep', 24, 'orange-txt-14');
  window.TK_REFRESH_ICON20 = svg('Refresh', 20, 'blue-txt-6');

  /* toaster with showUndo (shared/toaster): production's single-task undo, 5 seconds, no timer ring */
  window.TK_TODAY_UNDO_TOAST = (message, onUndo, ms) => {
    let host = document.querySelector('.nx-toasts .bs-message.bottom');
    if (!host) { nxToast({ message: '', delay: 1 }); host = document.querySelector('.nx-toasts .bs-message.bottom'); }
    const el = h(`<div role="status" aria-live="polite" aria-atomic="true" class="fade toast message-container theme-new variant-success regular-2 show"><div class="message-icon icon-success"><img src="${NX.IMG('checks-green.svg')}" alt=""></div><div class="message-desc">${message}</div><button type="button" class="message-undo">Undo</button></div>`);
    const t = setTimeout(() => el.remove(), ms);
    el.querySelector('.message-undo').addEventListener('click', () => { clearTimeout(t); el.remove(); onUndo(); });
    host.appendChild(el);
    return el;
  };
})();
