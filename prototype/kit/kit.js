/* Safe actions prototype kit (kit.js). Load after kit.css and prod/index.css.
 *
 * Every element production does not have carries the class .nx-new, so the "What's new"
 * toggle in the demo bar outlines it. Existing UI uses production class names.
 * All functions are globals (also on window.NX). Strings may contain HTML; pass user data escaped (NX.esc).
 *
 * ─── Shell ─────────────────────────────────────────────────────────────────────────────
 * nxShell({
 *   active: 'sequences',             // sidebar item: sequences | tasks | inbox | leads | crm | more | settings
 *   title: 'Page title',             // 50px production .page-header text (ignored when headerHTML is given)
 *   headerHTML: '...',               // optional: left part of the header (production keeps bolt, bell, avatar on the right)
 *   indexHref: 'index.html',         // "Back to index" link
 *   controls: [                      // demo bar scenario controls
 *     { key, label, options: [[value, label], ...], value, onChange(value) },   // segmented
 *     { key, label, toggle: true, value: false, onChange(bool) },              // checkbox
 *   ],
 *   devNotes: { intro, rows: [{ n, surface, action, patterns, breakdown, undo, code: [{label, url}], v3 }], notes: ['...'] },
 * }) -> { body, main, stage, header, setControl(key, value), openDevNotes(bool), setWhatsNew(bool) }
 *   body is a flex column filling the space under the header (add class nx-scroll for a scrolling page).
 *   URL flags read by the shell: ?new=1 turns on "What's new", ?dev=1 opens Dev notes.
 *
 * ─── Pattern F: impact dialog ──────────────────────────────────────────────────────────
 * nxImpactDialog({
 *   title,                            // 'Remove 7 prospects from “SaaS founders, Oct”?'
 *   rows: [{ label, value, sub }],    // up to 4; value 0 rows hide; sub: true indents a subset row
 *   sentence,                         // string or fn(row): used instead of the list when only one row shows
 *   note,                             // optional muted line under the breakdown (e.g. who is not affected)
 *   consequence,                      // one or two sentences: what stops, what is lost, can it be undone
 *   primaryLabel,                     // verb + count + noun: 'Remove 7 prospects'
 *   tone: 'danger' | 'primary',       // red when something is deleted/removed/never undoable; blue when reversible
 *   breakdown: 'ok' | 'slow' | 'fail',// counting placeholder: ok 500ms, slow 2s, fail shows the load-failure line
 *   submit: 'ok' | 'fail',
 *   failMessage: { title, body },     // what happened + why, and what to do
 *   extra: { render(el), value() },   // optional extra controls (e.g. pause duration), value passed to onConfirm
 *   icon,                             // title icon URL; default trash for danger, info circle for primary.
 *                                     // kit/img has unsubscribe-ban.svg and info-circle-red.svg for red actions that are not deletes
 *   typeToConfirm,                    // typed confirmation, built into nxDialog: ON for every tone 'danger' dialog (all patterns).
 *                                     // Word = first word of primaryLabel, lowercased, fixed at open. Label "Confirm by typing <b>word</b>".
 *                                     // string = other word; false = off. Primary enabled only when the word matches (trim, case-insensitive)
 *                                     // AND every other condition holds. Enter submits when valid; initial focus on the field; a failed action keeps it.
 *                                     // ctrl.confirm() (screenshot runners) types the word first. Blue dialogs never get it.
 *   breakdownDelay, submitDelay,      // ms overrides (screenshots)
 *   onConfirm(value), onCancel()
 * }) -> { el, close(), confirm(), type(value) }   type(value) fills the typed field (screenshots)
 *   undoable: { n, all }            // the action has the 10-second undo. Rule A (default): the dialog turns blue, no typing. Rule B: stays red,
 *                                     // typing only when all is true or n > 100. Rule is NX.rule() ('A' | 'B'), set from the demo bar or ?rule=B.
 *   Keyboard: Esc and overlay click = Cancel. Initial focus: Cancel for danger, primary for blue.
 *   Submitting: spinner, further clicks ignored. Failure keeps the dialog open with the error.
 *
 * ─── Pattern H: 10-second undo toast ───────────────────────────────────────────────────
 * nxUndoToast({ message, undoneMessage, seconds: 10, onUndo(), onCommit() }) -> { el, undo(), commit(), pause(), resume() }
 *   Timer ring pauses while hovered or focused. A second toast commits the first at once.
 * nxToast({ message, variant: 'success' | 'error', delay: 3000 })      // production toast, no undo
 *
 * ─── Pattern A: selection banner ───────────────────────────────────────────────────────
 * nxSelectionBanner({
 *   count, total, pageRows, allSelected, filtered, cap: 25000,
 *   noun: 'prospect', plural: 'prospects', scope: 'in this sequence', filteredScope: 'matching your filters',
 *   mode: 'proposed' | 'today', onSelectAll(), onClear()
 * }) -> HTMLElement | null   (production .prospect-selected-row-info, wrap it in .prospect-banner)
 *
 * ─── Pattern B: bulk bar ───────────────────────────────────────────────────────────────
 * nxBulkBar({
 *   actions: [{ id, label, icon, onClick(btn), disabled, reason, menu }],  // safe actions; icon = SalesHandy font name
 *   risky:   [{ id, label, count, icon: 'trash' | 'user-remove', onClick(btn), disabled, reason }],
 * }) -> HTMLElement   Labels when there is room; then safe actions go icon-only (tooltip); then into "More".
 *                     Risky actions keep their label and never move into "More". Call el.nxFit() after layout changes.
 *
 * ─── Pattern C: status menu ────────────────────────────────────────────────────────────
 * nxStatusMenu({ anchor, options: [{ id, label, desc, icon, disabled, reason, danger, divider }], onPick(id), align: 'left' | 'right' })
 *   -> { el, close() }   divider: true draws a line before the option. Disabled options show the reason instead of desc.
 *
 * ─── Patterns K, L, M ──────────────────────────────────────────────────────────────────
 * nxReauthDialog({ title, sentence, rows, consequence, method: 'password' | 'google' | 'microsoft',
 *                  primaryLabel, tone, icon, submit: 'ok' | 'fail', failMessage, onConfirm() })
 *   Primary stays disabled until the password is typed or the provider confirms. Red tone uses the red info icon;
 *   pass icon: NX.IMG('trash-danger.svg') when the action deletes (delete account).
 * nxCostDialog({ title, items: [{ label, credits }], have, primaryLabel, partial: { label, onConfirm }, onBuy(),
 *                submit, failMessage, onConfirm() })        // not enough: shortfall row, primary becomes "Buy credits"
 * nxPlanChangeDialog({ title, kind: 'slots' | 'seats' | 'downgrade', inUse, after, items: [{ id, name, meta }],
 *                      noun: 'email account', stops: [{ label, value }], date, primaryLabel, tone, onConfirm(pickedIds) })
 *   slots/seats: primary enabled only when exactly inUse - after items are picked. stops values may be numbers or text.
 *
 * ─── Low level ─────────────────────────────────────────────────────────────────────────
 * nxDialog({ title, icon, tone, body (el|html), primaryLabel, primaryDisabled, secondary: { label, onClick },
 *            onPrimary(ctrl), onCancel() }) -> ctrl { el, body, close(), setBusy(bool), setError(html|null),
 *            setPrimary({label, disabled, tone}), primaryBtn, cancelBtn }
 * NX.fmt(n) -> '2,340'   NX.plural(n, 'prospect', 'prospects')   NX.esc(str)   NX.settle()  // stop entry animation replays
 * NX.param(name) -> URL query value
 */
(function () {
  'use strict';

  const KIT = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/kit\.js(\?.*)?$/, '') : 'kit/';
  const IMG = (n) => KIT + 'img/' + n;

  const fmt = (n) => Number(n).toLocaleString('en-US');
  const plural = (n, one, many) => (n === 1 ? one : many);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const param = (name) => new URLSearchParams(location.search).get(name);
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const icon = (name, cls = '') => `<i class="sh-${name}${cls ? ' ' + cls : ''}" aria-hidden="true"></i>`;

  /* Rule for undoable bulk actions (open design choice): A = blue, no typing; B = red, typing only above a threshold. */
  const RULE_KEY = 'nx-rule';
  let ruleNow = (() => {
    const q = param('rule');
    if (q === 'A' || q === 'B') return q;
    try { const v = localStorage.getItem(RULE_KEY); if (v === 'A' || v === 'B') return v; } catch (e) { /* storage blocked */ }
    return 'A';
  })();
  const rule = () => ruleNow;
  const setRule = (v) => { ruleNow = v === 'B' ? 'B' : 'A'; try { localStorage.setItem(RULE_KEY, ruleNow); } catch (e) { /* */ } };
  const TYPE_THRESHOLD = 100;

  /* Input modality: Undo takes focus only when the confirm came from the keyboard. */
  let kbd = false;
  document.addEventListener('keydown', (e) => { if (['Tab', 'Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) kbd = true; }, true);
  document.addEventListener('pointerdown', () => { kbd = false; }, true);

  /* Where focus goes when the element that opened a dialog or toast is gone (menu item, re-rendered bar). */
  let menuAnchor = null; let menuAnchorAt = 0;
  function focusHome() {
    const m = document.querySelector('main.home-container') || document.querySelector('main');
    if (!m) return;
    if (!m.hasAttribute('tabindex')) m.setAttribute('tabindex', '-1');
    try { m.focus({ preventScroll: true }); } catch (e) { /* */ }
  }
  function returnFocus(el, quietIfMouse) {
    if (el && el.isConnected && el !== document.body) { try { el.focus({ preventScroll: true }); return; } catch (e) { /* */ } }
    if (kbd || !quietIfMouse) focusHome();
  }

  /* Production plays one-shot entry animations (modals, drawers, rows). The prototype re-renders on
     clicks, so after an action every running animation is finished and replays are switched off. */
  function settle(root) {
    (root || document).getAnimations?.({ subtree: true })?.forEach((a) => {
      const t = a.effect && a.effect.getComputedTiming && a.effect.getComputedTiming();
      if (t && t.iterations === Infinity) return; // spinners keep spinning
      try { a.finish(); } catch (e) { /* ignore */ }
    });
  }

  /* ───────────────────────── tooltip ───────────────────────── */
  let tipEl = null;
  function showTip(target) {
    const text = target.getAttribute('data-nx-tip');
    if (!text) return;
    if (!tipEl) {
      tipEl = h('<div class="tooltip bs-tooltip-bottom show nx-tip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>');
      document.body.appendChild(tipEl);
    }
    tipEl.querySelector('.tooltip-inner').textContent = text;
    tipEl.style.visibility = 'hidden';
    tipEl.style.display = 'block';
    const r = target.getBoundingClientRect();
    const w = tipEl.offsetWidth;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    tipEl.style.left = left + 'px';
    tipEl.style.top = (r.bottom + 2) + 'px';
    const arrow = tipEl.querySelector('.arrow');
    arrow.style.left = (r.left + r.width / 2 - left - 6) + 'px';
    tipEl.style.visibility = '';
  }
  function hideTip() { if (tipEl) tipEl.style.display = 'none'; }
  document.addEventListener('mouseover', (e) => { const t = e.target.closest && e.target.closest('[data-nx-tip]'); if (t) showTip(t); });
  document.addEventListener('mouseout', (e) => { const t = e.target.closest && e.target.closest('[data-nx-tip]'); if (t && !t.contains(e.relatedTarget)) hideTip(); });
  document.addEventListener('focusin', (e) => { const t = e.target.closest && e.target.closest('[data-nx-tip]'); if (t && t.matches(':focus-visible')) showTip(t); });
  document.addEventListener('focusout', hideTip);
  document.addEventListener('scroll', hideTip, true);

  /* ───────────────────────── shell ───────────────────────── */
  /* Production sidebar (components/home/components/sidebar), collapsed, with @saleshandy/icons inline SVG. */
  const SVG = (vb, d) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="${vb}" role="img" aria-hidden="true">${d}</svg>`;
  const P = (d, rule = true) => `<path fill="currentColor"${rule ? ' fill-rule="evenodd" clip-rule="evenodd"' : ''} d="${d}"/>`;
  const SIDE_ICONS = {
    sequences: SVG('0 0 24 24', P('M20.563 3.34a1.002 1.002 0 0 0-.989-.08l-17 8a1 1 0 0 0 .026 1.821L8 15.446v4.779a1 1 0 0 0 1.581.813L13.836 18l4.764 2.084a1 1 0 0 0 1.399-.85l1-15a1.005 1.005 0 0 0-.436-.893Zm-2.466 14.34-5.269-2.306 1.678-3.283c.45-.88-.513-1.81-1.376-1.33L8.35 13.418 5.42 12.134l13.471-6.34-.793 11.886Z', false)),
    tasks: SVG('0 0 24 24', P('M20.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L12 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z') + P('M6 5.007a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 0 1 2 0v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3h9a1 1 0 1 1 0 2H6Z')),
    inbox: SVG('0 0 24 24', P('M6 5.008a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1H6Zm-3 1a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-12Z') + P('M3 13.008a1 1 0 0 1 1-1h3a1 1 0 0 1 .707.292l2.707 2.707h3.172l2.707-2.707a1 1 0 0 1 .707-.293h3a1 1 0 1 1 0 2h-2.586l-2.707 2.708a1 1 0 0 1-.707.293h-4a1 1 0 0 1-.707-.293l-2.707-2.707H4a1 1 0 0 1-1-1Z')),
    leads: SVG('0 0 24 24', P('M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-8 6a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z') + P('M14.293 14.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414Z')),
    crm: SVG('0 0 18 18', P('M6.375 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.75 2.25a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM4.875 12a2.25 2.25 0 0 0-2.25 2.25v1.5a.75.75 0 0 1-1.5 0v-1.5a3.75 3.75 0 0 1 3.75-3.75h3a3.75 3.75 0 0 1 3.75 3.75v1.5a.75.75 0 0 1-1.5 0v-1.5A2.25 2.25 0 0 0 7.875 12h-3Z') + P('M16.875 5.25a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75ZM16.875 8.25a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75ZM16.875 11.25a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75Z', false)),
    more: SVG('0 0 24 24', P('M3 11.992a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM10 11.992a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM17 11.992a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z')),
    settings: SVG('0 0 24 24', P('M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4Zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2Z', false) + P('m2.844 16.136 1 1.73c.531.917 1.81 1.261 2.73.73l.53-.306a8.1 8.1 0 0 0 1.895 1.112V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.53.306c.922.53 2.197.188 2.73-.731l1-1.729a2.001 2.001 0 0 0-.732-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.53-.92-1.808-1.265-2.73-.732l-.53.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.73.732l-1 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.73 2.733Zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.057-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.124-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399 1 1 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.17 1.378a1 1 0 0 0 .47 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108Z', false)),
    feedback: SVG('0 0 20 20', P('M2.5 6.667a3.333 3.333 0 0 1 3.333-3.334H10A.833.833 0 0 1 10 5H5.833c-.92 0-1.666.746-1.666 1.667v8.893l1.875-1.946a.916.916 0 0 1 .66-.28h7.465c.92 0 1.666-.747 1.666-1.667V10a.833.833 0 0 1 1.667 0v1.667A3.333 3.333 0 0 1 14.167 15H7.02l-2.944 3.055c-.573.593-1.577.188-1.577-.636V6.667Z', false) + P('M16.097 1.037a.766.766 0 0 1 1.041 0l.03.028 1.771 1.808a.804.804 0 0 1 0 1.12l-4.664 4.759a.77.77 0 0 1-.484.229l-2.115.183a.785.785 0 0 1-.84-.864l.167-1.81.004-.034c.023-.171.1-.33.22-.452l4.841-4.939.03-.028Zm-3.709 5.82-.074.805 1.126-.097 4.05-4.132-.872-.89-4.23 4.314ZM13.333 10l.086.004a.833.833 0 0 1 0 1.659l-.086.004H6.667a.833.833 0 0 1 0-1.667h6.666ZM8.333 6.667l.086.004a.834.834 0 0 1 0 1.658l-.086.004H6.667a.833.833 0 1 1 0-1.666h1.666Z', false)),
    support: SVG('0 0 24 24', P('M12.384 4.992c-1.968-.08-3.89.48-5.405 1.555-1.514 1.075-2.51 2.58-2.842 4.22-.332 1.636.013 3.331.992 4.779a1 1 0 0 1 .12.876l-.747 2.242 2.99-.637a1 1 0 0 1 .645.079c1.714.832 3.72 1.086 5.64.706 1.92-.38 3.594-1.363 4.726-2.735 1.128-1.37 1.644-3.035 1.482-4.689-.162-1.656-.997-3.228-2.388-4.415-1.394-1.189-3.245-1.901-5.213-1.981Zm-9.44 16.012a.996.996 0 0 0 .281-.024l4.357-.927c2.04.907 4.363 1.161 6.584.72 2.338-.462 4.433-1.669 5.88-3.424 1.45-1.76 2.146-3.947 1.93-6.156-.217-2.207-1.325-4.244-3.081-5.742-1.754-1.496-4.04-2.36-6.43-2.457-2.39-.097-4.75.58-6.644 1.922-1.895 1.345-3.204 3.277-3.645 5.454-.408 2.017-.038 4.086 1.025 5.87l-1.144 3.433a.995.995 0 0 0 .198 1 .995.995 0 0 0 .69.331Z') + P('M12 11a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1ZM8 11a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1ZM16 11a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1Z')),
    bolt: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="d-flex bolt"><path fill="currentColor" fill-rule="evenodd" d="M13.31 2.049A1 1 0 0 1 14 3v6h5a1 1 0 0 1 .809 1.588l-8 11A1 1 0 0 1 10 21v-6H5a1 1 0 0 1-.809-1.588l8-11a1 1 0 0 1 1.118-.363ZM6.963 13H11a1 1 0 0 1 1 1v3.925L17.036 11H13a1 1 0 0 1-1-1V6.075L6.964 13Z" clip-rule="evenodd"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true" class="d-flex notification"><path fill="currentColor" fill-rule="evenodd" d="M12 4a1 1 0 0 0-1 .984 1.003 1.003 0 0 1-.591.929A6 6 0 0 0 7 11.024V14c0 .04-.002.08-.007.12A5 5 0 0 1 6.37 16h11.26a5 5 0 0 1-.623-1.88A1.006 1.006 0 0 1 17 14v-2.976a6 6 0 0 0-3.427-5.12A1 1 0 0 1 13 5a1 1 0 0 0-1-1Zm-2.93.356a3 3 0 0 1 5.86 0A8 8 0 0 1 19 11v2.935a3 3 0 0 0 1.493 2.195A1 1 0 0 1 20 18H4a1 1 0 0 1-.493-1.87A3 3 0 0 0 5 13.935V11l.001-.047a8 8 0 0 1 4.07-6.597Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9 16.004a1 1 0 0 1 1 1v1a2 2 0 1 0 4 0v-1a1 1 0 1 1 2 0v1a4 4 0 1 1-8 0v-1a1 1 0 0 1 1-1Z" clip-rule="evenodd"/></svg>',
  };
  const LOGO = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g clip-path="url(#nxlg-c)"><path d="M8.61824 0.9375C7.56029 0.9375 7.03046 2.19978 7.77855 2.93802L27.4742 22.3745C28.2223 23.1127 29.5014 22.5899 29.5014 21.5458V2.10938C29.5014 1.46217 28.9697 0.9375 28.3139 0.9375H8.61824Z" fill="url(#nxlg-g)"/><path d="M14.9185 26.3902C15.4795 26.9439 16.4389 26.5518 16.4389 25.7688V14.707C16.4389 14.2216 16.0401 13.8281 15.5482 13.8281H4.33901C3.54555 13.8281 3.14818 14.7748 3.70924 15.3285L14.9185 26.3902Z" fill="url(#nxlg-g)"/><path d="M7.11276 28.0622C7.4868 28.4314 8.12636 28.1699 8.12636 27.6479V22.6172C8.12636 22.2936 7.86053 22.0312 7.53261 22.0312H2.43479C1.90581 22.0312 1.6409 22.6624 2.01494 23.0315L7.11276 28.0622Z" fill="url(#nxlg-g)"/></g><defs><linearGradient id="nxlg-g" x1="7.02639" y1="23.7992" x2="29.2176" y2="2.34994" gradientUnits="userSpaceOnUse"><stop stop-color="#2563EB"/><stop offset="1" stop-color="#3B82F6"/></linearGradient><clipPath id="nxlg-c"><rect width="28.5001" height="28.125" fill="white" transform="translate(1 0.9375)"/></clipPath></defs></svg>';
  const NAV = [['sequences', 'Sequences'], ['tasks', 'Tasks'], ['inbox', 'Unified Inbox'], ['leads', 'Lead Finder'], ['crm', 'CRM'], ['more', 'More']];
  const navItem = (k, label, active, tag = 'a') => `<div class="app-sidebar__nav-item-container${active ? ' active' : ''}"><${tag} class="app-sidebar__nav-item${active ? ' active' : ''}"${tag === 'a' ? ' href="#"' : ''} aria-label="${label}" data-nx-tip="${label}"${active ? ' aria-current="page"' : ''}><div class="nav-item-left"><div class="nav-item-icon">${SIDE_ICONS[k]}<div class="app-sidebar__badges"></div></div><span class="nav-item-text">${label}</span></div><div class="nav-item-right"><div class="app-sidebar__badges expanded"></div></div></${tag}></div>`;
  function sidebarHTML(active) {
    return `<div class="app-sidebar" role="presentation">
      <div class="app-sidebar__header"><a href="#" aria-label="Saleshandy"><div class="logo-icon">${LOGO}</div><div class="logo-text"></div></a></div>
      <div class="scrollbar-container ps"><div class="app-sidebar__nav">${NAV.map(([k, l]) => navItem(k, l, k === active, k === 'more' ? 'div' : 'a')).join('')}</div></div>
      <div class="app-sidebar__footer"><div class="app-sidebar-footer-divider"></div>${navItem('settings', 'Settings', active === 'settings')}
        <button type="button" class="app-sidebar__nav-item-container chat-button" aria-label="Submit Feedback" data-nx-tip="Submit Feedback"><div class="app-sidebar__nav-item"><div class="nav-item-left"><div class="nav-item-icon">${SIDE_ICONS.feedback}</div><span class="nav-item-text">Submit Feedback</span></div><div class="nav-item-right"></div></div></button>
        <button type="button" class="app-sidebar__nav-item-container chat-button" aria-label="Need support?" data-nx-tip="Need support?"><div class="app-sidebar__nav-item"><div class="nav-item-left"><div class="nav-item-icon">${SIDE_ICONS.support}</div><span class="nav-item-text">Need support?</span></div><div class="nav-item-right"></div></div></button>
      </div></div>`;
  }
  /* Right side of production's page header: changelog bolt, notifications, avatar (header.tsx) */
  const HEADER_RIGHT = `<div class="w-auto text-right justify-content-end align-items-center d-flex p-0">
      <span class="ml-3"><div style="cursor: pointer;" class="d-flex hover-on-header">${SIDE_ICONS.bolt}</div></span>
      <span class="ml-3"><div><div class="notification-circle d-flex bs-badge hover-on-header" role="button" tabindex="0" aria-label="Notifications">${SIDE_ICONS.bell}</div></div></span>
      <span class="ml-3"><div class="d-flex align-items-center pointer"><div class="d-flex align-items-center pointer" role="button" tabindex="0" aria-label="Profile"><span class="bs-avatar bs-avatar-md bs-avatar-circle light-blue-color header-avatar"><span class="bs-avatar-string text-primary">HA</span></span><i class="sh-chevron-down ml-2 profile-dropdown-icon"></i></div></div></span>
    </div>`;

  function nxShell(o) {
    o = Object.assign({ active: 'sequences', title: '', indexHref: 'index.html', controls: [], devNotes: null }, o || {});
    document.body.classList.add('nx-kit');
    const demo = h('<div class="nx-demo" role="region" aria-label="Prototype controls"></div>');
    demo.appendChild(h(`<a class="nx-demo-back" href="${o.indexHref}">${icon('chevron-left')}<span>Back to index</span></a>`));
    const ctlByKey = {};
    const controls = o.controls.slice();
    if (o.rule) controls.push({ key: 'rule', label: 'Rule', value: rule(), options: [['A', 'A'], ['B', 'B']], onChange: (v) => setRule(v), title: 'A: undoable actions are blue, no typing. B: undoable actions stay red, typing only for all or over 100.' });
    controls.forEach((c) => {
      demo.appendChild(h('<span class="nx-demo-sep" aria-hidden="true"></span>'));
      if (c.toggle) {
        const lab = h(`<label class="nx-tg"><input type="checkbox"${c.value ? ' checked' : ''}><span>${c.label}</span></label>`);
        const inp = lab.querySelector('input');
        inp.addEventListener('change', () => c.onChange && c.onChange(inp.checked));
        ctlByKey[c.key] = { set: (v) => { inp.checked = !!v; } };
        demo.appendChild(lab);
        return;
      }
      const wrap = h(`<span class="nx-demo-ctl"${c.title ? ` title="${c.title}"` : ''}><span class="nx-demo-t" id="nxc-${c.key}">${c.label}</span><span class="nx-seg" role="group" aria-labelledby="nxc-${c.key}"></span></span>`);
      const seg = wrap.querySelector('.nx-seg');
      const set = (v) => seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(v))));
      c.options.forEach(([v, l]) => {
        const b = h(`<button type="button" data-v="${v}">${l}</button>`);
        b.addEventListener('click', () => { set(v); c.onChange && c.onChange(v); });
        seg.appendChild(b);
      });
      set(c.value);
      ctlByKey[c.key] = { set };
      demo.appendChild(wrap);
    });
    const right = h(`<span class="nx-demo-right">
      <label class="nx-tg"><input type="checkbox" data-nx="new"><span class="nx-key" aria-hidden="true"></span><span>What's new</span></label>
      <label class="nx-tg"><input type="checkbox" data-nx="dev"><span>Dev notes</span></label></span>`);
    demo.appendChild(right);
    // the bar wraps; publish its measured height so the stage and modal backdrops start below it
    const syncDemoH = () => document.body.style.setProperty('--nx-demo-h', Math.ceil(demo.getBoundingClientRect().height) + 'px');
    if (window.ResizeObserver) new ResizeObserver(syncDemoH).observe(demo);
    requestAnimationFrame(syncDemoH);

    // Production app shell: .row.position-relative > .app-sidebar (absolute) + main.home-container
    const stage = h('<div class="p-0 container-fluid nx-stage"><div class="m-0 flex-nowrap position-relative row nx-stage-row"></div></div>');
    const row = stage.firstElementChild;
    const rail = h(sidebarHTML(o.active));
    rail.addEventListener('click', (e) => { if (e.target.closest('a')) e.preventDefault(); });
    const main = h('<main class="flex-1 home-container"></main>');
    const hdr = h(`<div class="page-header noBoxShadow row">${o.headerHTML || `<div class="p-0"><div class="d-flex header-with-notification"><span class="nx-page-title">${o.title}</span></div></div>`}${HEADER_RIGHT}</div>`);
    const body = h('<div class="nx-body"></div>');
    main.append(hdr, body);
    row.append(rail, main);
    // Dev notes drawer
    const dev = h(`<aside class="nx-dev" hidden aria-label="Dev notes"><div class="nx-dev-hd"><h2>Dev notes</h2><button type="button" aria-label="Close dev notes">${icon('close')}</button></div><div class="nx-dev-bd"></div></aside>`);
    const devBody = dev.querySelector('.nx-dev-bd');
    if (o.devNotes) devBody.innerHTML = renderDevNotes(o.devNotes);
    row.appendChild(dev);
    const devInput = right.querySelector('[data-nx="dev"]');
    const openDev = (on) => { dev.hidden = !on; devInput.checked = !!on; };
    devInput.addEventListener('change', () => openDev(devInput.checked));
    dev.querySelector('.nx-dev-hd button').addEventListener('click', () => openDev(false));

    const newInput = right.querySelector('[data-nx="new"]');
    const setNew = (on) => { document.body.classList.toggle('nx-show-new', !!on); newInput.checked = !!on; };
    newInput.addEventListener('change', () => setNew(newInput.checked));

    document.body.prepend(demo, stage);
    if (param('new') === '1') setNew(true);
    if (param('dev') === '1') openDev(true);
    return { body, main, stage, header: hdr, demo, setControl: (k, v) => ctlByKey[k] && ctlByKey[k].set(v), openDevNotes: openDev, setWhatsNew: setNew };
  }

  function renderDevNotes(d) {
    const rows = (d.rows || []).map((r) => `
      <section class="nx-dev-row">
        <h3><span class="nx-dev-n">#${r.n}</span><span>${r.action}</span></h3>
        <dl>
          <dt>Surface</dt><dd>${r.surface}</dd>
          <dt>Patterns</dt><dd>${String(r.patterns).split(/\s+/).map((p) => `<span class="nx-pill">${p}</span>`).join('')}</dd>
          <dt>Breakdown</dt><dd>${r.breakdown}</dd>
          <dt>Undo</dt><dd>${r.undo}</dd>
          <dt>Code today</dt><dd>${(r.code || []).map((c) => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('')}</dd>
          ${r.v3 ? `<dt>V3</dt><dd class="nx-inline">${r.v3}</dd>` : ''}
        </dl>
      </section>`).join('');
    const notes = d.notes && d.notes.length ? `<p class="nx-dev-sub">Behaviour notes</p><ul class="nx-dev-list">${d.notes.map((n) => `<li>${n}</li>`).join('')}</ul>` : '';
    return `${d.intro ? `<p class="nx-dev-intro">${d.intro}</p>` : ''}${rows}${notes}`;
  }

  /* ───────────────────────── dialog shell (production ConfirmationModalV3) ───────────────────────── */
  let dialogSeq = 0;
  const openDialogs = [];

  function nxDialog(o) {
    o = Object.assign({ tone: 'primary', icon: null, wide: false, secondary: null, primaryDisabled: false }, o);
    const id = 'nx-dlg-' + (++dialogSeq);
    // one red icon type: trash for deletes, the red info circle for every other red dialog (the ban glyph is not used red)
    let iconSrc = o.icon || (o.tone === 'danger' ? IMG('trash-danger.svg') : IMG('info-circle-blue.svg'));
    if (o.tone === 'danger' && /unsubscribe-ban\.svg$/.test(iconSrc)) iconSrc = IMG('info-circle-red.svg');
    if (o.tone !== 'danger' && /(unsubscribe-ban|trash-danger|info-circle-red)\.svg$/.test(iconSrc)) iconSrc = IMG('info-circle-blue.svg');
    const root = h(`<div class="nx-modal-root">
      <div class="fade modal-backdrop"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="${id}-t" aria-describedby="${id}-d" tabindex="-1" class="fade bs-modal-container confirmation-modal-v3 nx-dialog${o.wide ? ' nx-wide' : ''} modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content"><div class="modal-content-container">
            <div class="bs-modal-header modal-header">
              <div class="modal-title h4"><div class="confirmation-modal-v3--title d-flex align-items-center"><img src="${iconSrc}" alt=""><h2 id="${id}-t"></h2></div></div>
              <button type="button" class="close" aria-label="Close">${icon('close')}</button>
            </div>
            <div class="bs-modal-body modal-body"><div class="confirmation-modal-v3--body" id="${id}-d"></div></div>
            <div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display:flex;align-items:center"></div></div>
          </div></div>
        </div>
      </div></div>`);
    const modal = root.querySelector('.modal');
    const backdrop = root.querySelector('.modal-backdrop');
    root.querySelector('h2').innerHTML = o.title;
    const body = root.querySelector('.confirmation-modal-v3--body');
    if (o.body) typeof o.body === 'string' ? (body.innerHTML = o.body) : body.appendChild(o.body);
    const footer = root.querySelector('.modal-footer');
    const btns = root.querySelector('.bs-modal-footer-action-buttons');
    const cancelBtn = h('<button type="button" class="btn-ghost btn-ghost-outlined btn-ghost-md nx-cancel">Cancel</button>');
    const primaryBtn = h(`<button type="button" class="shd-button"><span class="nx-plabel"></span></button>`);
    let secondaryBtn = null;
    if (o.secondary) {
      secondaryBtn = h(`<button type="button" class="shd-button shd-button--secondary nx-new"><span>${o.secondary.label}</span></button>`);
      secondaryBtn.addEventListener('click', () => { if (!busy) o.secondary.onClick(ctrl); });
      btns.append(cancelBtn, secondaryBtn, primaryBtn);
    } else btns.append(cancelBtn, primaryBtn);

    let busy = false;
    let closed = false;
    const errBox = h(`<div class="nx-error nx-new" role="alert" hidden><img src="${IMG('alert-triangle-red.svg')}" alt=""><div></div></div>`);

    // typed confirmation: every danger dialog, word = first word of the primary label, fixed at open
    let word = null;
    if (o.tone === 'danger' && o.typeToConfirm !== false) {
      word = typeof o.typeToConfirm === 'string' ? o.typeToConfirm : String(o.primaryLabel || '').replace(/<[^>]*>/g, '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!word) word = null;
    }
    let typed = null;
    if (word) {
      const tw = h(`<div class="nx-typed"><p class="nx-typed-label nx-new bs-mb-10">Confirm by typing <b class="nx-typed-word">${esc(word)}</b></p><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default"><input name="confirm" autocomplete="off" class="bs-input-md bs-input" aria-label="Confirm by typing ${esc(word)}"></span></div>`);
      typed = tw.querySelector('input');
      tw.querySelector('.bs-input-affix-wrapper').addEventListener('mousedown', (e) => { if (e.target !== typed) { e.preventDefault(); typed.focus(); } });
      body.appendChild(tw);
    }
    const typedOk = () => !typed || typed.value.trim().toLowerCase() === word;
    let baseDisabled = false;
    const applyDisabled = () => { primaryBtn.disabled = baseDisabled || !typedOk(); };

    const ctrl = {
      el: root, body, primaryBtn, cancelBtn, secondaryBtn, footer,
      get busy() { return busy; },
      setPrimary({ label, disabled, tone } = {}) {
        if (label != null) primaryBtn.querySelector('.nx-plabel').innerHTML = label;
        if (tone) { o.tone = tone; }
        primaryBtn.className = 'shd-button ' + (o.tone === 'danger' ? 'shd-button--danger' : 'shd-button--primary') + (o.primaryNew ? ' nx-new' : '');
        if (disabled != null) baseDisabled = !!disabled;
        applyDisabled();
      },
      setBusy(on) {
        busy = !!on;
        primaryBtn.setAttribute('aria-busy', String(busy));
        const ld = primaryBtn.querySelector('.shd-loader');
        if (busy && !ld) primaryBtn.prepend(h('<div class="shd-loader" aria-hidden="true"><div></div><div></div><div></div><div></div></div>'));
        if (!busy && ld) ld.remove();
        if (busy && document.activeElement === cancelBtn) primaryBtn.focus({ preventScroll: true });
        cancelBtn.disabled = busy;
        if (secondaryBtn) secondaryBtn.disabled = busy;
        root.querySelector('.close').disabled = busy;
      },
      setError(html) {
        if (!html) { errBox.hidden = true; return; }
        errBox.querySelector('div').innerHTML = html;
        errBox.hidden = false;
        if (!errBox.isConnected) body.appendChild(errBox);
        errBox.scrollIntoView({ block: 'nearest' });
      },
      close(reason) {
        if (closed) return;
        closed = true;
        document.removeEventListener('keydown', onKey, true);
        root.remove();
        const i = openDialogs.indexOf(ctrl); if (i >= 0) openDialogs.splice(i, 1);
        if (reason === 'cancel' && o.onCancel) o.onCancel();
        if (reason === 'done') setTimeout(() => { if (!document.activeElement || document.activeElement === document.body) returnFocus(lastFocus, true); }, 0); // after a confirm, the toast may take focus first
        else returnFocus(lastFocus);
      },
      type(v) { if (typed) { typed.value = v; applyDisabled(); } },
      // programmatic confirm (screenshot states, tests): types the word first
      confirm() { if (typed && !typedOk()) ctrl.type(word); primaryBtn.click(); },
    };
    ctrl.setPrimary({ label: o.primaryLabel, disabled: o.primaryDisabled });

    const cancel = () => { if (!busy) ctrl.close('cancel'); };
    cancelBtn.addEventListener('click', cancel);
    root.querySelector('.close').addEventListener('click', cancel);
    modal.addEventListener('mousedown', (e) => { if (e.target === modal || e.target.classList.contains('modal-dialog')) cancel(); });
    primaryBtn.addEventListener('click', () => {
      if (busy || primaryBtn.disabled) return; // double-click latch
      o.onPrimary && o.onPrimary(ctrl);
    });

    function onKey(e) {
      if (openDialogs[openDialogs.length - 1] !== ctrl) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); return; }
      if (e.key === 'Tab') {
        const f = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]')].filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    let lastFocus = document.activeElement;
    if (!lastFocus || lastFocus === document.body || (lastFocus.closest && lastFocus.closest('.nx-menu'))) {
      if (menuAnchor && menuAnchor.isConnected && Date.now() - menuAnchorAt < 3000) lastFocus = menuAnchor; // opened from a menu item
    }
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(root);
    openDialogs.push(ctrl);
    hideTip();
    // entry animation once: production's fade + 50px slide, then settled
    void modal.offsetWidth;
    backdrop.classList.add('show');
    modal.classList.add('show');
    setTimeout(() => settle(root), 320);
    if (typed) {
      typed.addEventListener('input', applyDisabled);
      typed.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (!busy && !primaryBtn.disabled) primaryBtn.click(); } });
      const sb = ctrl.setBusy;
      ctrl.setBusy = (on) => { sb(on); typed.disabled = !!on; };
    }
    // Cancel for danger (also keeps the phone keyboard from covering the button); the typed field is one Tab away
    (o.tone === 'danger' ? cancelBtn : primaryBtn).focus({ preventScroll: true });
    return ctrl;
  }

  /* ───────────────────────── F: impact dialog ───────────────────────── */
  function renderRows(rows, sentence) {
    const vis = rows.filter((r) => (typeof r.value === 'string' ? r.value !== '' : Number(r.value) > 0)).slice(0, 4);
    if (!vis.length) return '';
    if (vis.length === 1 && sentence) return `<p class="nx-sentence">${typeof sentence === 'function' ? sentence(vis[0]) : sentence}</p>`;
    return `<dl class="nx-rows">${vis.map((r) => `<div class="nx-row${r.sub ? ' nx-sub' : ''}${r.cls ? ' ' + r.cls : ''}"><dt>${r.label}</dt><dd>${typeof r.value === 'number' ? fmt(r.value) : r.value}</dd></div>`).join('')}</dl>`;
  }

  function nxImpactDialog(o) {
    o = Object.assign({ tone: 'danger', rows: [], breakdown: 'ok', submit: 'ok' }, o);
    if (o.undoable) {
      // the action has the 10-second undo: the open rule decides colour and typing
      if (rule() === 'A') { o.tone = 'primary'; o.typeToConfirm = false; o.icon = null; }
      else { o.tone = 'danger'; if (!(o.undoable.all || o.undoable.n > TYPE_THRESHOLD)) o.typeToConfirm = false; }
    }
    const wrap = h('<div class="nx-impact nx-new"></div>');
    const rowsBox = h('<div class="nx-breakdown" aria-live="polite"></div>');
    const n = Math.max(1, Math.min(4, o.rows.length));
    rowsBox.innerHTML = o.rows.length ? `<dl class="nx-rows" aria-busy="true" aria-label="Counting">${Array.from({ length: n }, () => '<div class="nx-row"><dt><span class="react-loading-skeleton nx-skel-l"></span></dt><dd><span class="react-loading-skeleton"></span></dd></div>').join('')}</dl>` : '';
    if (o.rows.length) wrap.appendChild(rowsBox);
    const noteEl = o.note ? h(`<p class="nx-note">${o.note}</p>`) : null;
    if (noteEl) { noteEl.hidden = true; wrap.appendChild(noteEl); }
    let extraEl = null;
    if (o.extra) { extraEl = h('<div class="nx-extra"></div>'); o.extra.render(extraEl); wrap.appendChild(extraEl); }
    if (o.consequence) wrap.appendChild(h(`<p class="nx-consequence">${o.consequence}</p>`));

    const ctrl = nxDialog({
      typeToConfirm: o.typeToConfirm,
      title: o.title, tone: o.tone, body: wrap, primaryLabel: o.primaryLabel, icon: o.icon, wide: o.wide,
      onCancel: o.onCancel,
      onPrimary(c) {
        c.setError(null);
        c.setBusy(true);
        setTimeout(() => {
          if (!c.el.isConnected) return;
          if (o.submit === 'fail') {
            c.setBusy(false);
            const fm = o.failMessage || { title: 'That did not go through.', body: 'Something went wrong on our side. Try again in a minute.' };
            c.setError(`<b>${fm.title}</b>${fm.body}`);
            c.primaryBtn.focus();
            return;
          }
          c.close('done');
          o.onConfirm && o.onConfirm(o.extra ? o.extra.value() : undefined);
        }, o.submitDelay != null ? o.submitDelay : 900);
      },
    });
    if (o.rows.length) {
      const delay = o.breakdownDelay != null ? o.breakdownDelay : (o.breakdown === 'slow' ? 2000 : o.breakdown === 'fail' ? 1200 : 500);
      setTimeout(() => {
        if (!ctrl.el.isConnected) return;
        if (o.breakdown === 'fail') {
          rowsBox.innerHTML = `<p class="nx-loadfail"><img src="${IMG('info-circle-blue.svg')}" alt="">We couldn't load the details. You can still continue.</p>`;
        } else {
          rowsBox.innerHTML = renderRows(o.rows, o.sentence);
          if (noteEl) noteEl.hidden = false;
        }
      }, delay);
    }
    return { el: ctrl.el, close: () => ctrl.close('cancel'), confirm: () => ctrl.confirm(), type: (v) => ctrl.type(v), ctrl };
  }

  /* ───────────────────────── H: undo toast ───────────────────────── */
  let toastHost = null;
  let activeUndo = null;
  function host() {
    if (!toastHost || !toastHost.isConnected) {
      toastHost = h('<div class="bs-message-container nx-toasts"><div class="bs-message top"></div><div class="bs-message bottom"></div></div>');
      document.body.appendChild(toastHost);
    }
    return toastHost.querySelector('.bs-message.bottom');
  }

  function nxToast(o) {
    o = Object.assign({ variant: 'success', delay: 3000 }, o);
    if (o.variant === 'success' && /not part of this prototype/i.test(o.message)) o.variant = 'info'; // a stub is not a success
    const info = o.variant === 'info'; // neutral: for prototype stubs, so a stub never reads as "done"
    const v = o.variant === 'error' ? 'variant-error' : info ? 'variant-success regular-2 nx-toast-info' : 'variant-success regular-2';
    const src = o.variant === 'error' ? IMG('alert-triangle-red.svg') : info ? IMG('info-circle.svg') : IMG('checks-green.svg');
    const el = h(`<div role="status" aria-live="polite" aria-atomic="true" class="fade toast message-container theme-new ${v} show"><div class="message-icon ${o.variant === 'error' ? 'icon-error' : 'icon-success'}"><img src="${src}" alt=""></div><div class="message-desc">${o.message}</div></div>`);
    host().appendChild(el);
    if (o.delay) setTimeout(() => el.remove(), o.delay);
    return el;
  }

  function nxUndoToast(o) {
    o = Object.assign({ seconds: 10 }, o);
    if (activeUndo) activeUndo.commit(); // a second action commits the first at once
    const total = o.seconds * 1000;
    const born = performance.now();
    let remaining = total;
    let paused = false;
    let done = false;
    const C = 2 * Math.PI * 8;
    // the ring is decorative (aria-hidden): the window is announced once, in words, by the polite live region
    const el = h(`<div role="status" aria-live="polite" aria-atomic="true" class="fade toast message-container theme-new variant-success regular-2 show">
      <div class="message-icon icon-success"><img src="${IMG('checks-green.svg')}" alt=""></div>
      <div class="message-desc">${o.message}</div>
      <button type="button" class="message-undo" aria-keyshortcuts="Enter">Undo</button>
      <svg class="nx-ring nx-new" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle class="nx-ring-bg" cx="10" cy="10" r="8"/><circle class="nx-ring-fg" cx="10" cy="10" r="8" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg>
    </div>`);
    const fg = el.querySelector('.nx-ring-fg');
    const undoBtn = el.querySelector('.message-undo');
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      if (!paused) remaining -= (now - last);
      last = now;
      const left = Math.max(0, remaining);
      fg.setAttribute('stroke-dashoffset', String(C * (1 - left / total)));
      if (left <= 0) api.commit();
    };
    const iv = setInterval(tick, 100);
    // when the toast goes while focus is inside it, put focus somewhere logical instead of dropping it to the page
    const stop = () => {
      const had = el.contains(document.activeElement);
      done = true; clearInterval(iv); el.remove(); if (activeUndo === api) activeUndo = null;
      if (had) setTimeout(() => focusHome(), 0);
    };
    const api = {
      el,
      commit() { if (done) return; stop(); o.onCommit && o.onCommit(); },
      undo() {
        if (done) return; stop();
        o.onUndo && o.onUndo();
        if (o.undoneMessage) nxToast({ message: o.undoneMessage });
      },
      pause() { paused = true; },
      resume() { paused = false; last = performance.now(); },
      get remaining() { return remaining; },
    };
    // an Enter or Space still held from the dialog must not trigger Undo (keyboard click inside the first 0.6 s is ignored)
    undoBtn.addEventListener('click', (e) => { if (e.detail === 0 && performance.now() - born < 600) return; api.undo(); });
    el.addEventListener('mouseenter', api.pause);
    el.addEventListener('mouseleave', () => { if (!el.contains(document.activeElement)) api.resume(); });
    el.addEventListener('focusin', api.pause);
    el.addEventListener('focusout', (e) => { if (!el.contains(e.relatedTarget) && !el.matches(':hover')) api.resume(); });
    host().appendChild(el);
    activeUndo = api;
    // announce the window once, after the live region exists, so screen readers speak it
    setTimeout(() => { if (!done) { const sr = h(`<span class="nx-sr">. You can undo this for ${o.seconds} seconds.</span>`); el.querySelector('.message-desc').appendChild(sr); } }, 80);
    // keyboard users: Undo is the next stop (focus is paused while it is there)
    if (kbd) undoBtn.focus({ preventScroll: true });
    return api;
  }

  /* ───────────────────────── A: selection banner ───────────────────────── */
  function nxSelectionBanner(o) {
    o = Object.assign({ cap: 25000, noun: 'prospect', plural: 'prospects', scope: 'in this sequence', filteredScope: 'matching your filters', mode: 'proposed', pageRows: 25 }, o);
    const count = o.allSelected ? Math.min(o.total, o.cap) : o.count;
    if (!count || !o.total) return null;
    const el = h('<div class="prospect-selected-row-info prospect-selected-row-info-waring"></div>');
    const link = (label, fn, isNew) => { const b = h(`<button type="button" class="nx-banner-link${isNew ? ' nx-new' : ''}">${label}</button>`); b.addEventListener('click', fn); return b; };
    const div = () => h('<span class="divider-vertical"></span>');

    if (o.mode === 'today') {
      // Production today: "7 Prospects are selected." and "Select all prospects" hidden when the page holds everyone.
      const row = h('<div class="d-flex"></div>');
      if (count === o.cap) row.appendChild(h('<span class="semibold-1 popover-arrow-color-txt mr-1">First</span>'));
      row.appendChild(h(`<span class="semibold-1 popover-arrow-color-txt mr-2">${fmt(count)} ${count > 1 ? 'Prospects are selected.' : 'Prospect is selected'}</span>`));
      if (!(o.allSelected || o.count === o.total)) {
        const s = h('<span role="button" tabindex="0" class="semibold-1 blue-txt-11">Select all prospects</span>');
        s.addEventListener('click', o.onSelectAll); row.append(s, div());
      }
      const c = h('<span role="button" tabindex="0" class="semibold-1 blue-txt-11">Clear selection</span>');
      c.addEventListener('click', o.onClear); row.appendChild(c);
      if (o.total > o.cap) row.appendChild(h('<span class="regular-1 blue-txt-15 ml-2">(You can select max 25,000 prospects.)</span>'));
      el.appendChild(row);
      return el;
    }

    const row = h('<div class="nx-banner-row"></div>');
    let text;
    const everything = o.allSelected || count >= o.total;
    if (o.allSelected && o.total > o.cap) {
      text = `<b>First ${fmt(o.cap)} of ${fmt(o.total)}</b> ${o.plural} are selected. You can act on up to ${fmt(o.cap)} at a time.`;
    } else if (everything) {
      if (o.total === 1) text = `<b>The only ${o.noun} ${o.filtered ? o.filteredScope : o.scope}</b> is selected.`;
      else text = `<b>All ${fmt(o.total)} ${o.plural} ${o.filtered ? o.filteredScope : o.scope}</b> are selected.`;
    } else if (count === o.pageRows && o.total > o.pageRows) {
      text = `<b>All ${fmt(count)} on this page</b> are selected.`;
    } else {
      text = `<b>${fmt(count)} of ${fmt(o.total)}</b> ${o.plural} selected.`;
    }
    row.appendChild(h(`<span class="nx-banner-text nx-new">${text}</span>`));
    if (!everything) {
      row.appendChild(div());
      const label = (count === o.pageRows && o.total > o.pageRows) ? `Select all ${fmt(o.total)} ${o.plural}` : `Select all ${fmt(o.total)}`;
      row.appendChild(link(label, o.onSelectAll, true));
    }
    row.appendChild(div());
    row.appendChild(link('Clear selection', o.onClear, false));
    el.appendChild(row);
    return el;
  }

  /* Reserves the banner row while nothing is selected, so the table does not jump down when the banner appears. */
  function bannerPlaceholder() {
    return h('<div class="prospect-selected-row-info nx-banner-ph" aria-hidden="true" inert><div class="nx-banner-row"><span class="nx-banner-text">&nbsp;</span></div></div>');
  }

  /* ───────────────────────── menus ───────────────────────── */
  let openMenu = null;
  function closeMenu() { if (openMenu) { const m = openMenu; openMenu = null; m.close(); } }
  document.addEventListener('mousedown', (e) => {
    if (openMenu && !openMenu.el.contains(e.target) && !(openMenu.anchor && openMenu.anchor.contains(e.target))) closeMenu();
  }, true);
  window.addEventListener('resize', () => { if (openMenu && openMenu.anchor && openMenu.anchor.isConnected) placeMenu(openMenu.el, openMenu.anchor, openMenu.align); });

  function placeMenu(el, anchor, align) {
    const r = anchor.getBoundingClientRect();
    el.style.visibility = 'hidden'; el.hidden = false;
    const w = el.offsetWidth, hh = el.offsetHeight;
    let left = align === 'right' ? r.right - w : r.left;
    if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
    left = Math.max(8, left);
    let top = r.bottom + 4;
    if (top + hh > window.innerHeight - 8 && r.top - hh - 4 > 8) top = r.top - hh - 4;
    el.style.left = left + 'px'; el.style.top = top + 'px';
    el.style.visibility = '';
  }

  function nxStatusMenu(o) {
    closeMenu();
    const el = h(`<div class="nx-menu nx-new" role="menu" aria-label="${o.label || 'Change status'}" style="width:${o.width || 320}px"></div>`);
    o.options.forEach((op) => {
      if (op.divider) el.appendChild(h('<div class="nx-mhr" role="separator"></div>'));
      const dis = !!op.disabled;
      const it = h(`<button type="button" role="menuitem" class="nx-mi${op.danger ? ' nx-danger' : ''}" ${dis ? 'aria-disabled="true"' : ''} data-id="${op.id}">
        ${op.icon ? icon(op.icon) : ''}<span class="nx-mi-t"><b>${op.label}</b>${(dis ? op.reason : op.desc) ? `<small>${dis ? op.reason : op.desc}</small>` : ''}</span></button>`);
      it.addEventListener('click', () => { if (dis) return; api.close(); o.onPick && o.onPick(op.id); });
      el.appendChild(it);
    });
    document.body.appendChild(el);
    if (o.anchor) { menuAnchor = o.anchor; menuAnchorAt = Date.now(); }
    placeMenu(el, o.anchor, o.align);
    if (o.anchor) o.anchor.setAttribute('aria-expanded', 'true');
    const items = () => [...el.querySelectorAll('.nx-mi')];
    el.addEventListener('keydown', (e) => {
      const list = items(); const i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); api.close(); o.anchor && o.anchor.focus(); }
      else if (e.key === 'Tab') { api.close(); }
    });
    const api = {
      el, anchor: o.anchor, align: o.align,
      close() { if (!el.isConnected) return; el.remove(); if (o.anchor) o.anchor.setAttribute('aria-expanded', 'false'); if (openMenu === api) openMenu = null; },
    };
    openMenu = api;
    hideTip();
    const first = items().find((x) => x.getAttribute('aria-disabled') !== 'true');
    if (first && o.focus !== false) first.focus({ preventScroll: true });
    return api;
  }

  /* ───────────────────────── B: bulk bar ───────────────────────── */
  function nxBulkBar(o) {
    const el = h('<div class="nx-bulk nx-new" role="toolbar" aria-label="Bulk actions"></div>');
    const safe = h('<div class="nx-bulk-safe"></div>');
    const actBtn = (a, opts = {}) => {
      const iconOnly = opts.iconOnly;
      const tip = a.disabled && a.reason ? a.reason : (iconOnly ? a.label : '');
      const b = h(`<button type="button" class="nx-act${iconOnly ? ' nx-icon-only' : ''}${a.risky ? ' nx-risky' : ''}" data-id="${a.id}" ${a.disabled ? 'disabled' : ''} ${tip ? `data-nx-tip="${esc(tip)}"` : ''} ${iconOnly ? `aria-label="${esc(a.label)}"` : ''} ${a.menu ? 'aria-haspopup="menu" aria-expanded="false"' : ''}>
        ${icon(a.icon)}${iconOnly ? '' : `<span>${a.label}${a.count != null ? ` <span class="nx-count">${fmt(a.count)}</span>` : ''}</span>`}${a.menu && !iconOnly ? icon('chevron-down') : ''}</button>`);
      if (a.disabled) {
        // disabled buttons swallow mouse events; keep the reason reachable on hover via a wrapper
        const w = h(`<span style="display:inline-flex" data-nx-tip="${esc(tip)}"></span>`); w.appendChild(b); return w;
      }
      b.addEventListener('click', () => a.onClick && a.onClick(b));
      return b;
    };
    const risky = (o.risky || []).map((r) => Object.assign({ risky: true }, r));
    let level = -1;
    function render(lv) {
      level = lv;
      safe.innerHTML = '';
      const acts = o.actions || [];
      if (lv <= 1) acts.forEach((a) => safe.appendChild(actBtn(a, { iconOnly: lv === 1 })));
      else {
        const more = actBtn({ id: 'more', label: 'More', icon: 'more', menu: true }, {});
        more.addEventListener('click', () => {
          nxStatusMenu({
            anchor: more, label: 'More actions', width: 240,
            options: acts.map((a) => ({ id: a.id, label: a.label + (a.menu ? '…' : ''), icon: a.icon, disabled: a.disabled, reason: a.reason })),
            onPick: (id) => { const a = acts.find((x) => x.id === id); a && a.onClick && a.onClick(more); },
          });
        });
        safe.appendChild(more);
      }
    }
    el.appendChild(safe);
    if (risky.length) {
      el.appendChild(h('<span class="divider-vertical nx-bulk-div" aria-hidden="true"></span>'));
      risky.forEach((r) => el.appendChild(actBtn(r)));
    }
    el.nxFit = function () {
      if (!el.isConnected) return;
      const before = level;
      if (level !== 0) render(0);
      let lv = 0;
      const over = () => el.scrollWidth > el.clientWidth + 1 || (el.parentElement && el.parentElement.scrollWidth > el.parentElement.clientWidth + 1);
      while (lv < 2 && over()) { lv++; render(lv); }
      if (lv !== before && openMenu && el.contains(openMenu.anchor) === false && openMenu.anchor && !openMenu.anchor.isConnected) closeMenu();
    };
    render(0);
    const ro = new ResizeObserver(() => el.nxFit());
    requestAnimationFrame(() => { el.nxFit(); if (el.parentElement) ro.observe(el.parentElement); });
    return el;
  }

  /* ───────────────────────── K: prove it is you ───────────────────────── */
  function nxReauthDialog(o) {
    o = Object.assign({ method: 'password', tone: 'danger', submit: 'ok' }, o);
    const wrap = h('<div class="nx-impact nx-new"></div>');
    if (o.sentence) wrap.appendChild(h(`<p>${o.sentence}</p>`));
    if (o.rows && o.rows.length) wrap.appendChild(h(renderRows(o.rows) || '<span></span>'));
    if (o.consequence) wrap.appendChild(h(`<p class="nx-consequence">${o.consequence}</p>`));
    let ok = false;
    let field;
    if (o.method === 'password') {
      field = h(`<div class="nx-field"><label for="nx-pw-${dialogSeq + 1}">Your password</label><input type="password" id="nx-pw-${dialogSeq + 1}" autocomplete="current-password"><span class="nx-field-err" hidden></span></div>`);
      wrap.appendChild(field);
    } else {
      const prov = o.method === 'google' ? 'Google' : 'Microsoft';
      field = h(`<div class="nx-field"><span class="nx-label">Confirm it is you with ${prov}</span><button type="button" class="nx-provider-btn">${icon(o.method === 'google' ? 'google' : 'microsoft')}<span>Continue with ${prov}</span></button></div>`);
      wrap.appendChild(field);
    }
    const ctrl = nxDialog({
      title: o.title, tone: o.tone, typeToConfirm: o.typeToConfirm, body: wrap, primaryLabel: o.primaryLabel, primaryDisabled: true, icon: o.icon || (o.tone === 'danger' ? IMG('info-circle-red.svg') : null),
      onCancel: o.onCancel,
      onPrimary(c) {
        c.setError(null); c.setBusy(true);
        setTimeout(() => {
          if (!c.el.isConnected) return;
          c.setBusy(false);
          if (o.submit === 'fail') {
            if (o.method === 'password') {
              field.classList.add('nx-invalid');
              const er = field.querySelector('.nx-field-err'); er.hidden = false; er.textContent = 'That password is not right. Try again, or reset it from the sign-in page.';
              field.querySelector('input').focus();
            } else {
              if (ok) { ok = false; const pb = field.querySelector('.nx-provider-btn'); pb.classList.remove('nx-done'); pb.innerHTML = `${icon(o.method === 'google' ? 'google' : 'microsoft')}<span>Continue with ${o.method === 'google' ? 'Google' : 'Microsoft'}</span>`; c.setPrimary({ disabled: true }); }
              c.setError(`<b>${o.method === 'google' ? 'Google' : 'Microsoft'} did not confirm it is you.</b>The sign-in window closed before it finished. Try again.`);
            }
            return;
          }
          c.close('done');
          o.onConfirm && o.onConfirm();
        }, o.submitDelay != null ? o.submitDelay : 900);
      },
    });
    if (o.method === 'password') {
      const inp = field.querySelector('input');
      inp.addEventListener('input', () => { field.classList.remove('nx-invalid'); field.querySelector('.nx-field-err').hidden = true; ctrl.setPrimary({ disabled: !inp.value }); });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && inp.value) ctrl.confirm(); });
      setTimeout(() => inp.focus(), 0);
    } else {
      const pb = field.querySelector('.nx-provider-btn');
      pb.addEventListener('click', () => {
        if (ok) return; ok = true;
        pb.classList.add('nx-done'); pb.innerHTML = `${icon('check')}<span>Confirmed</span>`;
        ctrl.setPrimary({ disabled: false }); ctrl.primaryBtn.focus();
      });
    }
    return { el: ctrl.el, close: () => ctrl.close('cancel'), confirm: () => ctrl.confirm(), ctrl };
  }

  /* ───────────────────────── L: total cost before any spend ───────────────────────── */
  function nxCostDialog(o) {
    o = Object.assign({ items: [], have: 0, submit: 'ok' }, o);
    const uses = o.items.reduce((s, i) => s + i.credits, 0);
    const short = Math.max(0, uses - o.have);
    const cr = (n) => `${fmt(n)} ${plural(n, 'credit', 'credits')}`;
    // an item is { name, qty, rate, credits }; older callers pass { label, credits }
    const iname = (i) => i.name || i.label;
    const imath = (i) => (i.qty != null ? `${fmt(i.qty)} × ${fmt(i.rate)}` : '');
    // what it costs reads like a receipt (total last); the balance is one line under it
    const bal = short
      ? `You have ${cr(o.have)}. <b class="nx-cost-short">${fmt(short)} short.</b>`
      : `You have ${cr(o.have)}. <b>${fmt(o.have - uses)}</b> left after this.`;
    const html = o.items.length > 1
      ? `<dl class="nx-rows nx-receipt">${o.items.map((i) => `<div class="nx-row"><dt>${iname(i)}<span class="nx-math">${imath(i)}</span></dt><dd>${fmt(i.credits)}</dd></div>`).join('')}<div class="nx-row nx-total"><dt>Total</dt><dd>${cr(uses)}</dd></div></dl><p class="nx-balance">${bal}</p>`
      : `<p class="nx-cost-line">This uses <b>${cr(uses)}</b>.</p><p class="nx-balance">${bal}</p>`;
    const body = h(`<div class="nx-impact nx-new nx-cost">${html}${o.consequence ? `<p class="nx-consequence">${o.consequence}</p>` : ''}</div>`);
    const run = (fn) => (c) => {
      c.setError(null); c.setBusy(true);
      setTimeout(() => {
        if (!c.el.isConnected) return;
        if (o.submit === 'fail') { c.setBusy(false); const fm = o.failMessage || { title: 'No credits were used.', body: 'The request did not reach us. Try again.' }; c.setError(`<b>${fm.title}</b>${fm.body}`); return; }
        c.close('done'); fn && fn();
      }, o.submitDelay != null ? o.submitDelay : 900);
    };
    const ctrl = nxDialog({
      title: o.title, tone: 'primary', body, icon: o.icon,
      primaryLabel: short ? 'Buy credits' : o.primaryLabel,
      secondary: short && o.partial ? { label: o.partial.label, onClick: run(o.partial.onConfirm) } : null,
      onCancel: o.onCancel,
      onPrimary: short ? (c) => { c.close('done'); o.onBuy && o.onBuy(); } : run(o.onConfirm),
    });
    return { el: ctrl.el, close: () => ctrl.close('cancel'), confirm: () => ctrl.confirm(), ctrl, short };
  }

  /* ───────────────────────── M: plan changes name what stops ───────────────────────── */
  function nxPlanChangeDialog(o) {
    o = Object.assign({ kind: 'slots', items: [], stops: [], tone: 'danger', noun: 'email account', plural: null, submit: 'ok' }, o);
    const pl = o.plural || o.noun + 's';
    const body = h('<div class="nx-impact nx-new"></div>');
    let need = 0;
    const picked = new Set();
    if (o.kind === 'downgrade') {
      body.appendChild(h(`<p>On <b>${o.date}</b>, these stop:</p>`));
      body.appendChild(h(renderRows(o.stops) || '<span></span>'));
      if (o.list && o.list.items.length) {
        // named list of what pauses, so nothing is a surprise on the date
        body.appendChild(h(`<p class="nx-list-title">${o.list.title}</p>`));
        const nl = h(`<ul class="nx-namelist" tabindex="0" aria-label="${esc(o.list.title)}"></ul>`);
        o.list.items.forEach((it) => nl.appendChild(h(`<li><span class="nx-pk-name">${it.name}</span><span class="nx-pk-meta">${it.meta || ''}</span></li>`)));
        body.appendChild(nl);
      }
    } else {
      need = Math.max(0, o.inUse - o.after);
      body.appendChild(h(`<dl class="nx-rows"><div class="nx-row"><dt>${o.kind === 'seats' ? 'Seats in use' : 'Slots in use'}</dt><dd>${fmt(o.inUse)}</dd></div><div class="nx-row"><dt>After the change</dt><dd>${fmt(o.after)}</dd></div></dl>`));
      if (need) {
        body.appendChild(h(`<p>Pick ${need} ${plural(need, o.noun, pl)} to ${o.kind === 'seats' ? 'remove' : 'disconnect'} on ${o.date}.</p>`));
        const list = h('<div class="nx-picklist" role="group"></div>');
        o.items.forEach((it) => {
          const l = h(`<label><input type="checkbox" value="${it.id}"><span class="nx-pk-name">${it.name}</span><span class="nx-pk-meta">${it.meta || ''}</span></label>`);
          l.querySelector('input').addEventListener('change', (e) => { e.target.checked ? picked.add(it.id) : picked.delete(it.id); sync(); });
          list.appendChild(l);
        });
        body.appendChild(list);
        body.appendChild(h('<p class="nx-picklist-status" aria-live="polite"></p>'));
      } else body.appendChild(h(`<p>Nothing needs to ${o.kind === 'seats' ? 'be removed' : 'disconnect'}. The change happens on ${o.date}.</p>`));
    }
    if (o.consequence) body.appendChild(h(`<p class="nx-consequence">${o.consequence}</p>`));
    const ctrl = nxDialog({
      title: o.title, tone: o.tone, typeToConfirm: o.typeToConfirm, body, primaryLabel: o.primaryLabel, icon: o.icon || (o.tone === 'danger' ? IMG('info-circle-red.svg') : null),
      primaryDisabled: need > 0, onCancel: o.onCancel,
      onPrimary(c) {
        c.setError(null); c.setBusy(true);
        setTimeout(() => {
          if (!c.el.isConnected) return;
          if (o.submit === 'fail') { c.setBusy(false); const fm = o.failMessage || { title: 'Your plan did not change.', body: 'The billing service did not respond. Try again in a minute.' }; c.setError(`<b>${fm.title}</b>${fm.body}`); return; }
          c.close('done'); o.onConfirm && o.onConfirm([...picked]);
        }, o.submitDelay != null ? o.submitDelay : 900);
      },
    });
    function sync() {
      const st = body.querySelector('.nx-picklist-status');
      if (!st) return;
      st.textContent = `${picked.size} of ${need} picked`;
      st.classList.toggle('nx-bad', picked.size > need);
      if (picked.size > need) st.textContent = `${picked.size} picked. Pick ${need}.`;
      ctrl.setPrimary({ disabled: picked.size !== need });
    }
    sync();
    return { el: ctrl.el, close: () => ctrl.close('cancel'), confirm: () => ctrl.confirm(), ctrl };
  }

  const NX = { fmt, plural, esc, param, h, icon, settle, closeMenu, IMG, renderRows, SIDE_ICONS, rule, setRule, bannerPlaceholder };
  Object.assign(window, { NX, nxShell, nxDialog, nxImpactDialog, nxUndoToast, nxToast, nxSelectionBanner, nxBulkBar, nxStatusMenu, nxReauthDialog, nxCostDialog, nxPlanChangeDialog });
})();
