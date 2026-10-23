/* Production markup for Unified Inbox (/conversations), reproduced from webui main aeda4e3:
   unified-inbox.tsx, unified-inbox-content.tsx (mobile banner, actions row, list + thread panes),
   unified-inbox-actions-row.tsx (feed tabs, "This Page", bulk icons, selection text, refresh, filters,
   pagination, the three ConfirmationModalV3 dialogs), sub-components/mail-item.tsx, email-category.tsx,
   feed-types-filter.tsx, no-selected-threads.tsx, ActionStatesModal. Icons are the production SVGs
   (shared/svg and @saleshandy/icons). Anything new is marked .nx-new. Loaded before unified-inbox.js. */
(function () {
  'use strict';
  const { esc, h, IMG } = NX;
  /* @saleshandy/icons path data (node_modules/@saleshandy/icons dist), [viewBox, paths] */
  const SHI = {"Like":["0 0 24 24",["M13 5.007a1 1 0 0 0-1 1v1a5 5 0 0 1-4 4.9v5.1a2 2 0 0 0 2 2h7a1 1 0 0 1 .085.004c.087.007.238-.017.43-.21.2-.199.396-.54.508-1.007l.974-4.869a1 1 0 0 0-.997-.918h-3a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1Zm-5.4 15.2a2.007 2.007 0 0 1-1.6.8H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3a3 3 0 0 0 3-3v-1a3 3 0 0 1 6 0v4h2a3 3 0 0 1 3 3c0 .066-.006.132-.02.197l-1 5-.006.032c-.177.752-.524 1.46-1.044 1.98-.518.517-1.207.84-1.967.791H10a4 4 0 0 1-2.4-.8Zm-1.6-8.2H4v7h2v-7Z"]],"Dislike":["0 0 24 24",["M16.963 3.012c.76-.049 1.449.274 1.967.792.52.52.867 1.228 1.044 1.98l.007.032 1 5c.012.065.019.13.019.196a3 3 0 0 1-3 3h-2v4a3 3 0 0 1-6 0v-1a3 3 0 0 0-3-3H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2a2 2 0 0 1 1.6.8 4 4 0 0 1 2.4-.8h6.963ZM6 5.012H4v7h2v-7Zm2 7.101v-5.1a2 2 0 0 1 2-2h7a1 1 0 0 0 .085-.004c.087-.008.238.017.43.21.2.198.396.54.508 1.006l.974 4.87a1 1 0 0 1-.997.917h-3a1 1 0 0 0-1 1v5a1 1 0 0 1-2 0v-1a5 5 0 0 0-4-4.899Z"]],"Calendar":["0 0 24 24",["M6 6.004a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1H6Zm-3 1a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-12Z","M16 2a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1ZM8 2a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1ZM3 11.004a1 1 0 0 1 1-1h16a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1ZM10 15a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Z","M12 14a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"]],"OutOfOffice":["0 0 24 25",["M1.639 14.18a.675.675 0 0 1 .931.208l2.866 4.52h13.782a.675.675 0 1 1 0 1.35H4.693L1.43 15.11a.675.675 0 0 1 .209-.931Z","M4.518 20.577 1.16 15.283a.995.995 0 1 1 1.68-1.066l2.772 4.37h13.606a.995.995 0 1 1 0 1.99h-14.7Zm.918-1.67-2.865-4.519a.675.675 0 0 0-1.14.723l3.263 5.146h14.524a.675.675 0 1 0 0-1.35H5.436Z","M5.642 18.926a.675.675 0 0 1 .498.814l-.74 3.07a.675.675 0 0 1-1.313-.316l.74-3.07a.675.675 0 0 1 .815-.498Z","M5.717 18.615a.995.995 0 0 1 .734 1.2l-.74 3.07a.995.995 0 0 1-1.935-.466l.74-3.07a.995.995 0 0 1 1.2-.734Zm.423 1.125a.675.675 0 0 0-1.313-.316l-.74 3.07a.675.675 0 1 0 1.312.317l.74-3.07ZM18.322 18.98a.675.675 0 0 0-.498.814l.74 3.071a.675.675 0 0 0 1.313-.316l-.74-3.07a.675.675 0 0 0-.815-.499Z","M18.247 18.67a.995.995 0 0 0-.734 1.2l.74 3.07a.995.995 0 0 0 1.935-.466l-.74-3.07a.995.995 0 0 0-1.2-.735Zm-.423 1.124a.675.675 0 0 1 1.313-.316l.74 3.07a.675.675 0 0 1-1.313.317l-.74-3.07ZM18.508 5.124c-1.584-1.326-3.49-1.82-4.766-1.732a.675.675 0 0 1-.047.001c-2.702 0-4.515 1.353-5.716 3.097-.834 1.21-1.36 2.595-1.653 3.805a3.762 3.762 0 0 1 2.24-.312c.78.133 1.436.497 1.912.887 1.51-1.068 2.958-1.318 4.198-1.122a5.167 5.167 0 0 1 2.458 1.108c.762-.484 1.703-.544 2.506-.462a8.07 8.07 0 0 1 1.641.355c-.233-2.652-1.385-4.463-2.773-5.625Zm.867-1.035c1.865 1.562 3.3 4.061 3.3 7.666a.675.675 0 0 1-.966.61c-.516-.246-1.366-.543-2.205-.628-.863-.088-1.528.064-1.906.475a.675.675 0 0 1-1-.007c-.38-.427-1.142-.967-2.133-1.124-.96-.152-2.202.046-3.608 1.197a.675.675 0 0 1-.935-.078 2.845 2.845 0 0 0-1.583-.886c-.664-.114-1.524.025-2.485.932a.675.675 0 0 1-1.135-.556c.154-1.591.771-3.967 2.148-5.966 1.389-2.016 3.574-3.673 6.805-3.68 1.638-.106 3.872.513 5.703 2.045Z","M5.094 12.361a.675.675 0 0 1-.375-.67c.154-1.592.772-3.968 2.148-5.967 1.389-2.016 3.575-3.673 6.805-3.68 1.639-.106 3.872.513 5.703 2.045 1.865 1.562 3.3 4.061 3.3 7.666a.675.675 0 0 1-.966.61c-.516-.246-1.366-.543-2.205-.628-.863-.088-1.527.064-1.905.475a.675.675 0 0 1-1.001-.007c-.38-.427-1.142-.968-2.132-1.124-.96-.152-2.203.046-3.609 1.197a.675.675 0 0 1-.935-.078 2.845 2.845 0 0 0-1.583-.886c-.664-.114-1.523.025-2.485.932a.675.675 0 0 1-.76.115Zm8.568-10.638c-3.354.012-5.626 1.74-7.059 3.82-1.414 2.053-2.045 4.485-2.202 6.116a.995.995 0 0 0 1.673.82c.894-.844 1.654-.945 2.211-.85a2.525 2.525 0 0 1 1.397.782.995.995 0 0 0 1.378.114c1.341-1.097 2.493-1.264 3.356-1.128.907.143 1.605.642 1.943 1.02a.995.995 0 0 0 1.475.011c.275-.299.809-.457 1.638-.373.793.08 1.608.364 2.1.598a.995.995 0 0 0 1.423-.898c0-3.7-1.476-6.289-3.415-7.912-1.887-1.58-4.195-2.228-5.918-2.12Zm4.64 3.646c-1.523-1.275-3.348-1.74-4.538-1.658a.99.99 0 0 1-.069.002c-2.573 0-4.297 1.28-5.453 2.958-.673.978-1.142 2.08-1.445 3.106a4.017 4.017 0 0 1 1.824-.11c.743.128 1.38.447 1.869.807 1.505-1.001 2.965-1.243 4.236-1.043.99.157 1.821.575 2.435 1.039.808-.431 1.742-.473 2.512-.395.427.044.847.127 1.237.231-.313-2.308-1.365-3.897-2.607-4.937Zm2.943 5.033c-.3-2.464-1.41-4.167-2.737-5.278-1.584-1.326-3.49-1.82-4.766-1.732a.675.675 0 0 1-.047.001c-2.702 0-4.515 1.353-5.716 3.097-.745 1.081-1.244 2.303-1.551 3.414-.036.132-.07.262-.101.391.123-.057.245-.106.367-.15a3.713 3.713 0 0 1 1.873-.162c.779.133 1.435.497 1.912.887 1.509-1.068 2.957-1.318 4.197-1.122a5.167 5.167 0 0 1 2.458 1.108c.762-.484 1.703-.544 2.507-.462a7.792 7.792 0 0 1 1.64.355c-.01-.117-.022-.233-.036-.347Z","M14.469 2.705a.675.675 0 0 1-.438.849c-.386.123-.763.428-1.12.932-.355.502-.658 1.155-.907 1.886-.497 1.46-.742 3.118-.812 4.191a.675.675 0 0 1-1.347-.088c.075-1.157.336-2.937.881-4.539.273-.8.627-1.585 1.084-2.23.455-.644 1.048-1.194 1.81-1.438a.675.675 0 0 1 .849.437Z","M14.773 2.608a.995.995 0 0 1-.644 1.25c-.297.095-.623.342-.957.813-.332.468-.622 1.09-.865 1.804-.486 1.428-.727 3.056-.796 4.109a.995.995 0 0 1-1.986-.13c.077-1.176.341-2.985.898-4.62.279-.819.644-1.634 1.125-2.313.48-.676 1.123-1.286 1.974-1.558a.995.995 0 0 1 1.251.645Zm-.742.946a.675.675 0 1 0-.411-1.286c-.762.244-1.355.794-1.81 1.438-.458.645-.811 1.43-1.084 2.23-.546 1.602-.806 3.382-.882 4.54a.675.675 0 1 0 1.348.087c.07-1.073.314-2.73.812-4.191.249-.73.551-1.384.907-1.886.357-.504.734-.809 1.12-.932Z","M13.055 2.705a.675.675 0 0 0 .438.849c.386.123.763.428 1.12.932.355.502.658 1.155.907 1.886.497 1.46.742 3.118.812 4.191a.675.675 0 1 0 1.347-.088c-.075-1.157-.336-2.937-.881-4.539-.273-.8-.627-1.585-1.084-2.23-.456-.644-1.048-1.194-1.81-1.438a.675.675 0 0 0-.849.437Z","M12.75 2.608a.995.995 0 0 0 .645 1.25c.297.095.623.342.956.813.332.468.622 1.09.865 1.804.487 1.428.728 3.056.797 4.109a.995.995 0 1 0 1.985-.13c-.076-1.176-.34-2.985-.898-4.62-.278-.819-.644-1.634-1.125-2.313-.479-.676-1.122-1.286-1.974-1.558a.995.995 0 0 0-1.25.645Zm.742.946a.675.675 0 1 1 .412-1.286c.762.244 1.354.794 1.81 1.438.457.645.81 1.43 1.083 2.23.546 1.602.806 3.382.882 4.54a.675.675 0 1 1-1.347.087c-.07-1.073-.315-2.73-.813-4.191-.248-.73-.55-1.384-.906-1.886-.358-.504-.735-.809-1.12-.932ZM13.835 9.844c.373 0 .675.302.675.675v8.954a.675.675 0 0 1-1.35 0v-8.954c0-.373.302-.675.675-.675Z","M13.835 9.524c.55 0 .995.445.995.995v8.954a.995.995 0 1 1-1.99 0v-8.954c0-.55.446-.995.995-.995Zm.675.995a.675.675 0 1 0-1.35 0v8.954a.675.675 0 1 0 1.35 0v-8.954ZM2.939 16.293c0-.373.302-.675.675-.675h5.645c.438 0 .873.133 1.186.482.303.337.402.773.402 1.189v1.928a.675.675 0 1 1-1.35 0v-1.928c0-.223-.054-.285-.056-.286 0-.001-.005-.006-.023-.013a.459.459 0 0 0-.159-.022H3.614a.675.675 0 0 1-.675-.675Z","M9.177 17.288v1.929a.995.995 0 0 0 1.99 0v-1.928c0-.46-.109-.986-.483-1.402-.391-.436-.924-.589-1.425-.589H3.614a.995.995 0 1 0 0 1.99h5.563Zm.32 1.929a.675.675 0 0 0 1.35 0v-1.928c0-.416-.098-.852-.401-1.189-.314-.349-.748-.482-1.187-.482H3.614a.675.675 0 1 0 0 1.35H9.26c.087 0 .136.013.16.022.018.007.022.012.023.013 0 .001.055.063.055.286v1.928Zm-.373-2.178Zm.02.08v.003l.003.007-.003-.01Zm.025.052.006.009-.006-.01Z"]],"Clock":["0 0 24 24",["M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z","M12 6.007a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.415l-3-3a1 1 0 0 1-.293-.707v-5a1 1 0 0 1 1-1Z"]],"CircleX":["0 0 24 24",["M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z","M9.293 9.3a1 1 0 0 1 1.414 0L12 10.593 13.293 9.3a1 1 0 0 1 1.414 1.415l-1.293 1.293 1.293 1.292a1 1 0 0 1-1.414 1.415L12 13.422l-1.293 1.293A1 1 0 0 1 9.293 13.3l1.293-1.293-1.293-1.292a1 1 0 0 1 0-1.415Z"]],"Mail":["0 0 24 24",["M5 5.993a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1H5Zm-3 1a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-10Z","M2.168 6.453a1 1 0 0 1 1.387-.278L12 11.805l8.445-5.63a1 1 0 0 1 1.11 1.665l-9 6a1 1 0 0 1-1.11 0l-9-6a1 1 0 0 1-.277-1.387Z"]],"Send":["0 0 24 24",["M21.707 2.293a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414-1.414l11-11a1 1 0 0 1 1.414 0Z","M21.707 2.293a1 1 0 0 1 .234 1.047l-6.5 18a1.55 1.55 0 0 1-2.84.096l-3.346-6.69-6.69-3.346a1.55 1.55 0 0 1 .095-2.84l18-6.5a1 1 0 0 1 1.047.233ZM4.372 10.068l6.075 3.038a1 1 0 0 1 .448.447l3.037 6.075 5.404-14.964-14.964 5.404Z"]],"ArrowBackUp":["0 0 24 24",["M9.707 4.297a1 1 0 0 1 0 1.414L7.414 8.004H16a5 5 0 1 1 0 10h-1a1 1 0 1 1 0-2h1a3 3 0 1 0 0-6H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0Z"]],"Ban":["0 0 24 24",["M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z","M4.993 4.988a1 1 0 0 1 1.414 0l12.6 12.6a1 1 0 0 1-1.414 1.414l-12.6-12.6a1 1 0 0 1 0-1.414Z"]],"CalendarSchedule":["0 0 24 24",["M6 6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4.5a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3a1 1 0 1 1-2 0V7a1 1 0 0 0-1-1H6Z","M16 2a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1ZM8 2a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1ZM3 11a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM14.464 14.464a5 5 0 1 1 7.071 7.07 5 5 0 0 1-7.07-7.07ZM18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z","M18 15.5a1 1 0 0 1 1 1v1.086l.207.207a1 1 0 0 1-1.414 1.414l-.5-.5A1 1 0 0 1 17 18v-1.5a1 1 0 0 1 1-1Z"]],"DeviceMobile":["0 0 24 24",["M6 5.008a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-14Zm10 0H8v14h8v-14Z","M10 4.992a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1ZM12 15.992a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0v-.01a1 1 0 0 1 1-1Z"]]};
  const shi = (n, size = 18, cls = '', style = '') => {
    const [vb, ds] = SHI[n];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="${vb}" role="img" aria-hidden="true"${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}>${ds.map((d) => `<path fill="currentColor" fill-rule="evenodd" d="${d}" clip-rule="evenodd"/>`).join('')}</svg>`;
  };
  /* shared/svg (18 x 18 viewBox) used by the actions row and pagination */
  const SV = (paths, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${paths}</svg>`;
  const pe = (d, fill = 'currentColor') => `<path fill-rule="evenodd" clip-rule="evenodd" d="${d}" fill="${fill}"/>`;
  const PSVG = {
    mailOpen: SV(pe('M8.58397 1.62596C8.8359 1.45801 9.1641 1.45801 9.41603 1.62596L16.166 6.12596C16.3747 6.26506 16.5 6.49924 16.5 6.75C16.5 7.00076 16.3747 7.23494 16.166 7.37404L9.41603 11.874C9.1641 12.042 8.8359 12.042 8.58397 11.874L1.83397 7.37404C1.62533 7.23494 1.5 7.00076 1.5 6.75C1.5 6.49924 1.62533 6.26506 1.83397 6.12596L8.58397 1.62596ZM3.60208 6.75L9 10.3486L14.3979 6.75L9 3.15139L3.60208 6.75Z')
      + pe('M2.25 6C2.66421 6 3 6.33579 3 6.75V14.25C3 14.4489 3.07902 14.6397 3.21967 14.7803C3.36032 14.921 3.55109 15 3.75 15H14.25C14.4489 15 14.6397 14.921 14.7803 14.7803C14.921 14.6397 15 14.4489 15 14.25V6.75C15 6.33579 15.3358 6 15.75 6C16.1642 6 16.5 6.33579 16.5 6.75V14.25C16.5 14.8467 16.2629 15.419 15.841 15.841C15.419 16.2629 14.8467 16.5 14.25 16.5H3.75C3.15326 16.5 2.58097 16.2629 2.15901 15.841C1.73705 15.419 1.5 14.8467 1.5 14.25V6.75C1.5 6.33579 1.83579 6 2.25 6Z')
      + pe('M7.28033 9.22553C7.57322 9.51842 7.57322 9.9933 7.28033 10.2862L2.78033 14.7862C2.48744 15.0791 2.01256 15.0791 1.71967 14.7862C1.42678 14.4933 1.42678 14.0184 1.71967 13.7255L6.21967 9.22553C6.51256 8.93264 6.98744 8.93264 7.28033 9.22553Z')
      + pe('M10.7197 9.22553C11.0126 8.93264 11.4874 8.93264 11.7803 9.22553L16.2803 13.7255C16.5732 14.0184 16.5732 14.4933 16.2803 14.7862C15.9874 15.0791 15.5126 15.0791 15.2197 14.7862L10.7197 10.2862C10.4268 9.9933 10.4268 9.51842 10.7197 9.22553Z')),
    mailRead: SV(pe('M3.75 4.49438C3.33579 4.49438 3 4.83017 3 5.24438V12.7444C3 13.1586 3.33579 13.4944 3.75 13.4944H14.25C14.6642 13.4944 15 13.1586 15 12.7444V5.24438C15 4.83017 14.6642 4.49438 14.25 4.49438H3.75ZM1.5 5.24438C1.5 4.00174 2.50736 2.99438 3.75 2.99438H14.25C15.4926 2.99438 16.5 4.00174 16.5 5.24438V12.7444C16.5 13.987 15.4926 14.9944 14.25 14.9944H3.75C2.50736 14.9944 1.5 13.987 1.5 12.7444V5.24438Z')
      + pe('M1.62604 4.83959C1.85581 4.49495 2.32146 4.40182 2.6661 4.63158L9.00008 8.85423L15.3341 4.63158C15.6787 4.40182 16.1444 4.49495 16.3741 4.83959C16.6039 5.18424 16.5108 5.64989 16.1661 5.87966L9.4161 10.3797C9.16418 10.5476 8.83598 10.5476 8.58405 10.3797L1.83405 5.87966C1.48941 5.64989 1.39628 5.18424 1.62604 4.83959Z')
      + '<path d="M16 14C16 14.5523 15.5523 15 15 15C14.4477 15 14 14.5523 14 14C14 13.4477 14.4477 13 15 13C15.5523 13 16 13.4477 16 14Z" fill="currentColor"/>'
      + pe('M17 14C17 15.1046 16.1046 16 15 16C13.8954 16 13 15.1046 13 14C13 12.8954 13.8954 12 15 12C16.1046 12 17 12.8954 17 14ZM15 15C15.5523 15 16 14.5523 16 14C16 13.4477 15.5523 13 15 13C14.4477 13 14 13.4477 14 14C14 14.5523 14.4477 15 15 15Z', 'white')),
    tag: SV(pe('M5.25 3C4.65326 3 4.08097 3.23705 3.65901 3.65901C3.23705 4.08097 3 4.65326 3 5.25V7.93934L9.51161 14.4509C9.57862 14.5061 9.66287 14.5365 9.75 14.5365C9.83713 14.5365 9.92138 14.5061 9.98839 14.4509L14.4509 9.98839C14.5061 9.92138 14.5365 9.83713 14.5365 9.75C14.5365 9.66287 14.5061 9.57862 14.4509 9.51161L7.93934 3H5.25ZM2.59835 2.59835C3.30161 1.89509 4.25544 1.5 5.25 1.5H8.25C8.44891 1.5 8.63968 1.57902 8.78033 1.71967L15.5303 8.46967C15.5402 8.47951 15.5497 8.48963 15.559 8.5C15.8665 8.84376 16.0365 9.28879 16.0365 9.75C16.0365 10.2112 15.8665 10.6562 15.559 11C15.5497 11.0104 15.5402 11.0205 15.5303 11.0303L11.0303 15.5303C11.0205 15.5402 11.0104 15.5497 11 15.559C10.6562 15.8665 10.2112 16.0365 9.75 16.0365C9.28879 16.0365 8.84376 15.8665 8.5 15.559C8.48963 15.5497 8.47951 15.5402 8.46967 15.5303L1.71967 8.78033C1.57902 8.63968 1.5 8.44891 1.5 8.25V5.25C1.5 4.25544 1.89509 3.30161 2.59835 2.59835Z')
      + pe('M6.75 6.00586C6.33579 6.00586 6 6.34165 6 6.75586C6 7.17007 6.33579 7.50586 6.75 7.50586C7.16421 7.50586 7.5 7.17007 7.5 6.75586C7.5 6.34165 7.16421 6.00586 6.75 6.00586ZM4.5 6.75586C4.5 5.51322 5.50736 4.50586 6.75 4.50586C7.99264 4.50586 9 5.51322 9 6.75586C9 7.9985 7.99264 9.00586 6.75 9.00586C5.50736 9.00586 4.5 7.9985 4.5 6.75586Z')),
    trash: SV(pe('M2.25 5.25562C2.25 4.8414 2.58579 4.50562 3 4.50562H15C15.4142 4.50562 15.75 4.8414 15.75 5.25562C15.75 5.66983 15.4142 6.00562 15 6.00562H3C2.58579 6.00562 2.25 5.66983 2.25 5.25562Z')
      + pe('M7.5 7.49438C7.91421 7.49438 8.25 7.83017 8.25 8.24438V12.7444C8.25 13.1586 7.91421 13.4944 7.5 13.4944C7.08579 13.4944 6.75 13.1586 6.75 12.7444V8.24438C6.75 7.83017 7.08579 7.49438 7.5 7.49438Z')
      + pe('M10.5 7.49438C10.9142 7.49438 11.25 7.83017 11.25 8.24438V12.7444C11.25 13.1586 10.9142 13.4944 10.5 13.4944C10.0858 13.4944 9.75 13.1586 9.75 12.7444V8.24438C9.75 7.83017 10.0858 7.49438 10.5 7.49438Z')
      + pe('M3.68776 4.5082C4.10054 4.4738 4.46305 4.78054 4.49745 5.19333L5.24745 14.1933C5.24918 14.214 5.25004 14.2348 5.25004 14.2556C5.25004 14.4545 5.32906 14.6453 5.46971 14.7859C5.61036 14.9266 5.80113 15.0056 6.00004 15.0056H12C12.199 15.0056 12.3897 14.9266 12.5304 14.7859C12.671 14.6453 12.75 14.4545 12.75 14.2556C12.75 14.2348 12.7509 14.214 12.7526 14.1933L13.5026 5.19333C13.537 4.78054 13.8995 4.4738 14.3123 4.5082C14.7251 4.5426 15.0318 4.90511 14.9975 5.3179L14.2498 14.2899C14.2409 14.8743 14.0049 15.4327 13.591 15.8466C13.1691 16.2686 12.5968 16.5056 12 16.5056H6.00004C5.4033 16.5056 4.83101 16.2686 4.40905 15.8466C3.99519 15.4327 3.75921 14.8743 3.7503 14.2899L3.00263 5.3179C2.96823 4.90511 3.27497 4.5426 3.68776 4.5082Z')
      + pe('M6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60217 12 3V5.25C12 5.66421 11.6642 6 11.25 6C10.8358 6 10.5 5.66421 10.5 5.25V3H7.5L7.5 5.25C7.5 5.66421 7.16421 6 6.75 6C6.33579 6 6 5.66421 6 5.25V3C6 2.60217 6.15804 2.22064 6.43934 1.93934Z')),
    chevL: SV(pe('M11.7803 3.96967C12.0732 4.26256 12.0732 4.73744 11.7803 5.03033L7.81066 9L11.7803 12.9697C12.0732 13.2626 12.0732 13.7374 11.7803 14.0303C11.4874 14.3232 11.0126 14.3232 10.7197 14.0303L6.21967 9.53033C5.92678 9.23744 5.92678 8.76256 6.21967 8.46967L10.7197 3.96967C11.0126 3.67678 11.4874 3.67678 11.7803 3.96967Z')),
    chevR: SV(pe('M6.21967 3.96967C6.51256 3.67678 6.98744 3.67678 7.28033 3.96967L11.7803 8.46967C12.0732 8.76256 12.0732 9.23744 11.7803 9.53033L7.28033 14.0303C6.98744 14.3232 6.51256 14.3232 6.21967 14.0303C5.92678 13.7374 5.92678 13.2626 6.21967 12.9697L10.1893 9L6.21967 5.03033C5.92678 4.73744 5.92678 4.26256 6.21967 3.96967Z')),
  };
  /* NoMessages, size "sm" (shared/svg/no-messages.tsx) */
  const NO_MESSAGES = '<svg width="64" height="60" viewBox="0 0 64 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 40.8893L10.9146 38.624L19.9757 42.1249L11.7383 46.6555L0 40.8893Z" fill="url(#nm0)"/><path d="M63.0164 40.8893L52.1018 38.624L43.0406 42.1249L51.278 46.6555L63.0164 40.8893Z" fill="url(#nm1)"/><path d="M19.9754 42.125H43.0402L51.2776 46.6556H11.738L19.9754 42.125Z" fill="url(#nm2)"/><path d="M23.3152 22.5352C27.0271 20.3921 31.7735 21.6639 33.9165 25.3758C36.0596 29.0876 34.7878 33.834 31.0759 35.977L26.7108 38.4972L25.5392 43.7471C25.3948 44.3943 24.5306 44.5267 24.199 43.9525L22.1828 40.4602C19.144 40.8852 16.0123 39.4736 14.3838 36.653C12.2408 32.9411 13.5125 28.1948 17.2244 26.0517L23.3152 22.5352Z" fill="url(#nm3)"/><circle cx="1.2126" cy="1.2126" r="1.2126" transform="matrix(-0.866025 0.5 0.5 0.866025 28.6897 26.9937)" fill="#F4F7FC"/><circle cx="1.2126" cy="1.2126" r="1.2126" transform="matrix(-0.866025 0.5 0.5 0.866025 24.4893 29.4189)" fill="#F4F7FC"/><circle cx="1.2126" cy="1.2126" r="1.2126" transform="matrix(-0.866025 0.5 0.5 0.866025 20.2883 31.8438)" fill="#F4F7FC"/><path d="M36.3042 7.76697C30.8039 6.29315 25.1502 9.55731 23.6764 15.0577C22.2026 20.558 25.4667 26.2117 30.9671 27.6855L37.4362 29.4189L40.7449 35.7531C41.1528 36.5339 42.3073 36.4067 42.5354 35.5557L43.922 30.3806C47.9675 29.881 51.5007 26.9926 52.6205 22.8132C54.0944 17.3129 50.8302 11.6592 45.3298 10.1854L36.3042 7.76697Z" fill="url(#nm4)"/><circle cx="32.0794" cy="17.309" r="1.61103" transform="rotate(15 32.0794 17.309)" fill="#F4F7FC"/><circle cx="38.304" cy="18.9775" r="1.61103" transform="rotate(15 38.304 18.9775)" fill="#F4F7FC"/><circle cx="44.5276" cy="20.645" r="1.61103" transform="rotate(15 44.5276 20.645)" fill="#F4F7FC"/><path d="M11.738 46.6553H51.2776V54.0689L44.1072 57.2956C40.146 59.0782 35.8516 59.9999 31.5078 59.9999C27.164 59.9999 22.8696 59.0782 18.9084 57.2956L11.738 54.0689V46.6553Z" fill="url(#nm5)"/><defs><linearGradient id="nm0" x1="10.5106" y1="46.4119" x2="10.5048" y2="41.0074" gradientUnits="userSpaceOnUse"><stop stop-color="#D0D3DB"/><stop offset="1" stop-color="#D6DBE7"/></linearGradient><linearGradient id="nm1" x1="52.5058" y1="46.4119" x2="52.5116" y2="41.0074" gradientUnits="userSpaceOnUse"><stop stop-color="#D0D3DB"/><stop offset="1" stop-color="#D6DBE7"/></linearGradient><linearGradient id="nm2" x1="-1.44182" y1="60.8651" x2="-3.96241" y2="43.8076" gradientUnits="userSpaceOnUse"><stop stop-color="#9DA2AD"/><stop offset="1" stop-color="#CED3E0"/></linearGradient><linearGradient id="nm3" x1="27.5559" y1="18.9667" x2="23.5747" y2="49.8902" gradientUnits="userSpaceOnUse"><stop stop-color="#E3E8F3"/><stop offset="1" stop-color="#CCD1DD"/></linearGradient><linearGradient id="nm4" x1="23.8073" y1="39.6734" x2="53.2658" y2="6.96319" gradientUnits="userSpaceOnUse"><stop stop-color="#A7ABB6"/><stop offset="1" stop-color="#C7CCD7"/></linearGradient><linearGradient id="nm5" x1="32.5425" y1="80.203" x2="32.4877" y2="56.922" gradientUnits="userSpaceOnUse"><stop stop-color="#D4D9E3"/><stop offset="1" stop-color="#D2D5DC"/></linearGradient></defs></svg>';

  /* Default outcomes (MailCategories), sentiment classes from email-category.tsx, icons from getOutcomeIcon */
  const OUTCOMES = [
    { key: 'unc', name: 'Uncategorized', s: '' },
    { key: 'int', name: 'Interested', s: 'positive' },
    { key: 'ni', name: 'Not Interested', s: 'negative' },
    { key: 'mtg', name: 'Meeting Booked', s: 'positive' },
    { key: 'ooo', name: 'Out of Office', s: 'neutral' },
    { key: 'cls', name: 'Closed', s: 'positive' },
    { key: 'now', name: 'Not Now', s: 'neutral' },
    { key: 'dnc', name: 'Do Not Contact', s: 'negative' },
  ];
  const outcomeIcon = (key, size = 18) => {
    const g = 'gray-txt-15';
    switch (key) {
      case 'int': return shi('Like', size, g);
      case 'mtg': return shi('Calendar', size, g);
      case 'cls': return `<img src="${IMG('bx-dollar-gray.svg')}" alt="" height="${size}" width="${size}">`;
      case 'ooo': return shi('OutOfOffice', size, g);
      case 'ni': return shi('Dislike', size, g);
      case 'now': return shi('Clock', size, g);
      case 'dnc': return shi('CircleX', size, g);
      default: return shi('Mail', size, g);
    }
  };
  window.UI_OUTCOMES = OUTCOMES;
  window.UI_OUTCOME_ICON = outcomeIcon;
  window.UI_SHI = shi;

  const checkbox = (attrs, state, label = '', cls = '') => `<label class="bs-checkbox-wrapper${cls ? ' ' + cls : ''}"><span class="bs-checkbox${state === 'mixed' ? ' bs-checkbox-indeterminate' : ''}"><input type="checkbox" class="bs-checkbox-input" ${attrs}${state === true ? ' checked' : ''}><span class="bs-checkbox-inner"></span></span>${label ? `<span class="checkbox-label-text">${label}</span>` : ''}</label>`;

  /* mail-item.tsx */
  function mailItem(t, d) {
    const o = OUTCOMES.find((x) => x.key === t.out) || OUTCOMES[0];
    const sentCls = o.s ? `${o.s}-sentiment` : 'default-sentiment';
    const name = o.name.length > 14 ? o.name.substring(0, 11) + '...' : o.name;
    const cat = !t.unsub && o.key !== 'unc' ? `<div class="email-category ${sentCls}">${outcomeIcon(o.key, 18)}<span color="gray-txt-15">${name}</span></div>` : '';
    const seq = t.seq.length > 20 ? t.seq.slice(0, 20) + '...' : t.seq;
    const [first, last] = t.name.split(' ');
    const init = (first[0] + (last ? last[0] : '')).toUpperCase();
    const cls = ['mail-item', t.unread ? 'unread' : '', d.isSel(t) ? 'isSelected' : ''].filter(Boolean).join(' ');
    const right = d.feed === 'scheduled'
      ? `<span class="scheduledTime">${shi('CalendarSchedule', 12)}<span>${esc(t.schedAt)}</span></span>`
      : `<span class="duration">${esc(t.date)}</span>`;
    return `<div class="${cls}" data-ui-thread="${t.id}">
      <div class="mail-item--left">${checkbox(`data-ui-row="${t.id}" aria-label="Select conversation with ${esc(t.name)}"`, d.isSel(t), '', 'mail-item-checkbox')}<div class="shd-avatar shd-avatar--sm mail-item-avatar"><span>${init}</span></div></div>
      <div class="mail-item--right" role="button" tabindex="0" data-ui-open="${t.id}">
        <h2><span class="name-wrapper"><span class="name">${esc(t.name)}</span>${t.unread ? '<div class="dot"></div>' : ''}${d.feed === 'draft' ? '<span class="draft-label">Draft</span>' : ''}</span><span class="details-wrapper">${right}</span></h2>
        <h3>${esc(t.subject.replace('Re:', ''))}</h3>
        <div style="display: flex; align-items: center;">${t.you ? `${shi('ArrowBackUp', 14, 'gray-txt-15').replace('width="14" height="14"', 'width="14" height="12"')}<span class="regular-1 line-height-18 gray-txt-15">You:</span>` : ''}<p>${esc(t.preview)}</p></div>
        <div class="unified-inbox-unSubScribed"><div class="d-flex align-items-center mt-1"><div class="shd-pills shd-pills--solid shd-pills--sm sequence-pill">${shi('Send', 12)}<span class="pills-label">${esc(seq)}</span></div>${cat}</div>${t.unsub ? '<div class="d-flex align-items-center mt-1"><p class="unsubscribed-message">Unsubscribed</p></div>' : ''}</div>
      </div></div>`;
  }

  /* production getPaginationLabel: numbers are not comma-formatted */
  const pageLabel = (page, per, total) => {
    const x = (page - 1) * per + 1, y = page * per;
    if (!total) return '';
    if (x > total) return `${total}-${total} of ${total} threads`;
    if (total <= y) return `${x}-${total} of ${total} threads`;
    return `${x}-${y} of ${total} threads`;
  };

  /* The page under the header. d: { feed, unread, rows, isSel, anySelected, pageAll, page, pages, per, total, view } */
  window.UI_PAGE = (d) => {
    const tab = (v, label) => `<div class="${d.feed === v ? 'active' : ''}"><span class="regular-2 font-medium ${d.feed === v ? 'blue-txt-11 active__email-nav' : 'gray-txt-30'}" role="button" tabindex="0" data-ui-feed="${v}">${label}</span>${v === 'unread' && d.unread > 0 ? `<span class="regular-1 font-medium gray-txt-1 green-13 pr-1 pl-1 ml-1 br-7">${d.unread}</span>` : ''}</div>`;
    const sel = d.anySelected ? `${checkbox('data-ui="this-page" aria-label="Select this page"', d.pageAll, '<span class="checkbox-label">This Page</span>')}<div class="unified-inbox-action-separator"></div><div class="ui-bulk-host" data-ui="bulk"></div>` : '';
    const list = d.rows.length
      ? d.rows.map((t) => mailItem(t, d)).join('')
      : '';
    const search = `<span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default search-input unified-inbox-search"><span class="mx-1 d-flex input-icons-left"><span class="bs-input-prefix"><i class="sh-search"></i></span></span><input class="bs-input-md bs-input" placeholder="${d.rows.length ? 'Search Conversation' : 'Search Conversations...'}" autocomplete="off" aria-label="Search Conversation"></span>`;
    const empty = `<div class="no-selected-email"><img src="${IMG('no-result-gradient.svg')}" alt=""><div><h1>No email found</h1><p>Sorry, we couldn't find any conversations that match your desired criteria.</p></div></div>`;
    return `<div class="unified-inbox p-0 flex-grow-1 overflow-hidden container-fluid"><div class="unified-inbox-content h-100 d-flex flex-column">
      ${d.rows.length ? `<div class="fade danger-alert alert show mobile-app-banner alert-primary-2" role="alert"><div class="d-flex align-items-center">${shi('DeviceMobile', 18, '', 'color:#6d28d9')}<span class="alert-message-text">Send and track customer replies on the go with the Unified Inbox Mobile App.</span><button class="shd-button shd-button--primary upgrade-btn ml-0 p-0" type="button" data-ui-noop><span>Download Mobile App</span></button></div></div>` : ''}
      <div class="unified-inbox-content--row">
        <div class="row-left"><div class="d-flex gap-20 position-relative">${tab('all', 'All')}${tab('unread', 'Unread')}${tab('scheduled', 'Scheduled')}${tab('draft', 'Draft')}</div>${sel}</div>
        <div class="row-center" data-ui="center"></div>
        <div class="row-right">
          <div class="refresh-unified-inbox" role="button" tabindex="0" aria-label="Refresh" data-nx-tip="Refresh" data-ui-noop><i class="sh-refresh"></i></div>
          <div class="unified-inbox-action-separator"></div>
          <div class="unified-filter-icon-container"><div class="unified-filter-icon-main d-flex align-items-center" role="button" tabindex="0" data-ui-noop><i class="sh-filter unified-inbox-action-icon"></i><span class="regular-2 font-medium line-height-20">Filters</span></div></div>
          <div class="unified-inbox-action-separator"></div>
          <div class="unified-inbox-pagination-wrapper"><p class="unified-inbox-pagination-info">${pageLabel(d.page, d.per, d.total)}</p><div class="unified-inbox-pagination-btn"><div class="${d.page === 1 ? 'disabled' : ''}" role="button" tabindex="0" aria-label="Previous page" data-ui-page="prev">${PSVG.chevL}</div><div class="${d.page >= d.pages ? 'disabled' : ''}" role="button" tabindex="0" aria-label="Next page" data-ui-page="next">${PSVG.chevR}</div></div></div>
        </div>
      </div>
      <div class="ui-banner-host" data-ui="banner"></div>
      <div class="unified-inbox-content--container flex-grow-1 overflow-hidden">
        <div class="unified-inbox-mail-list">${d.rows.length ? search + ' ' + list : search + ' ' + empty}</div>
        <div class="unified-inbox-mail-content d-flex flex-column"><div class="no-selected-thread">${NO_MESSAGES}<p>No conversations selected</p></div></div>
      </div>
    </div></div>`;
  };

  /* Today: production's bulk icons (OverlayTooltip + .unified-inbox-action-btn) */
  window.UI_TODAY_ICONS = () => `<div class="unified-inbox-action-btns">
      <div class="unified-inbox-action-btn" role="button" tabindex="0" aria-label="Mark as read" data-nx-tip="Mark as read" data-ui-today="read">${PSVG.mailOpen}</div>
      <div class="unified-inbox-action-btn" role="button" tabindex="0" aria-label="Mark as unread" data-nx-tip="Mark as unread" data-ui-today="unread">${PSVG.mailRead}</div>
      <div class="unified-inbox-action-btn" role="button" tabindex="0" aria-label="Mark as unsubscribe" data-nx-tip="Mark as unsubscribe" data-ui-today="unsubscribe">${shi('Ban', 18)}</div>
      <div class="unified-inbox-action-btn" role="button" tabindex="0" aria-label="Assign outcome" data-nx-tip="Assign outcome" data-ui-today="outcome">${PSVG.tag}</div>
      <div class="unified-inbox-action-btn" role="button" tabindex="0" aria-label="Delete conversation" data-nx-tip="Delete conversation" data-ui-today="delete">${PSVG.trash}</div>
    </div>`;

  /* Today: renderSelectedEmailThreadsDetails (row-center). Numbers are formatted except in "Select all N". */
  window.UI_TODAY_CENTER = ({ count, total, all, cap }) => {
    const f = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${count === cap ? '<span>First</span>' : ''}<span>${f(count)} ${count > 1 ? 'conversations selected.' : 'conversation selected.'}</span>${all || count === total
      ? '<span class="action-btn" role="button" tabindex="0" data-ui-center="clear">Clear selection</span>'
      : `<span class="action-btn" role="button" tabindex="0" data-ui-center="all">Select all ${total} conversations</span>`}${count > cap ? `<span class="info-error">(You can select max ${f(cap)} email threads.)</span>` : ''}`;
  };

  /* Today's three ConfirmationModalV3 dialogs (actions-row L647-740), production copy and classes */
  function todayModal({ title, content, icon, iconImg, submit, submitCls, body, onSubmit, label }) {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-label="${esc(label || title)}" class="fade bs-modal-container confirmation-modal-v3 delete-conversation-confirmation-modal modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-header modal-header"><div class="modal-title h4"><div class="confirmation-modal-v3--title d-flex align-items-center icon-${iconImg ? 'undefined' : ''}">${iconImg ? `<img src="${iconImg}" alt="empty-data/">` : ''}${icon ? `<div class="orange-txt-14 d-flex align-items-center">${icon}</div>` : ''}<h2>${title}</h2></div></div></div>
          <div class="bs-modal-body modal-body"><div class="confirmation-modal-v3--body">${content ? `<div class="confirmation-modal-v3--body__content"><div class="">${content}</div></div>` : ''}</div></div>
          <div class="bs-modal-footer modal-footer"><div class="bs-modal-footer-action-buttons" style="display: flex; align-items: center;"><button type="button" class="action-btn-cancel btn-ghost btn-ghost-outlined btn-ghost-md">Cancel</button><button type="button" class="${submitCls} btn-solid btn-solid-primary btn-solid-md">${submit}</button></div></div>
        </div></div></div></div></div>`);
    if (body) root.querySelector('.confirmation-modal-v3--body').appendChild(body);
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey, true); };
    function onKey(e) { if (e.key === 'Escape' && !document.querySelector('.ui-transfer')) close(); }
    document.addEventListener('keydown', onKey, true);
    const [cancel, ok] = root.querySelectorAll('.bs-modal-footer-action-buttons button');
    cancel.addEventListener('click', close);
    ok.addEventListener('click', () => { if (ok.disabled) return; close(); onSubmit(); });
    document.body.appendChild(root);
    NX.settle(root);
    return { el: root, close, ok };
  }
  window.UI_TODAY_DELETE = (onSubmit) => todayModal({
    title: 'Are you sure you want to remove this email thread?',
    content: 'The emails will remain in your mailbox. However, they will not be visible in Saleshandy anymore.',
    iconImg: IMG('trash-danger.svg'), submit: 'Delete', submitCls: 'action-btn-delete', onSubmit,
  });
  window.UI_TODAY_UNSUB = (n, onSubmit) => {
    const w = n > 1 ? 'prospects' : 'prospect';
    return todayModal({
      title: `Do you want to unsubscribe this ${w}?`,
      content: `If you unsubscribe the ${w}, you will not be able to send emails to the ${w}.`,
      icon: shi('Ban', 24, 'blue-txt-11'), submit: 'Yes', submitCls: 'w-100px', onSubmit,
    });
  };
  window.UI_TODAY_OUTCOME = (onSubmit) => {
    let picked = null;
    const body = document.createElement('div');
    const dlg = todayModal({ title: 'Assign Outcome', iconImg: IMG('tag-blue.svg'), submit: 'Done', submitCls: '', body, onSubmit: () => onSubmit(picked) });
    window.UI_OUTCOME_SELECT(body, (k) => { picked = k; });
    return dlg;
  };

  /* Design-system Select (select.tsx + select-bar.tsx + transfer) with the outcome renderers from the actions row */
  window.UI_OUTCOME_SELECT = (host, onPick, opts = {}) => {
    const opt = (o) => `<div class="sentiment-content"><div class="sentiment-icon">${outcomeIcon(o.key, 16)}</div><div>${o.name.charAt(0).toUpperCase() + o.name.slice(1)}</div></div>`;
    host.innerHTML = `<div class="bs-select-box unified-inbox-filter-assign-bar" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-label="Outcome"><div class="bs-select-box-text placeholder">Select outcome</div><div class="bs-select-box-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"/></svg></div></div>`;
    const bar = host.querySelector('.bs-select-box');
    const txt = bar.querySelector('.bs-select-box-text');
    let pop = null;
    let current = null;
    let raf = 0;
    const place = () => { if (!pop) return; const r = bar.getBoundingClientRect(); pop.style.width = r.width + 'px'; pop.style.left = r.left + 'px'; pop.style.top = (r.bottom + 4) + 'px'; raf = requestAnimationFrame(place); };
    const close = () => { if (pop) { cancelAnimationFrame(raf); pop.remove(); pop = null; bar.setAttribute('aria-expanded', 'false'); document.removeEventListener('mousedown', outside, true); window.removeEventListener('keydown', key, true); } };
    function outside(e) { if (pop && !pop.contains(e.target) && !bar.contains(e.target)) close(); }
    function key(e) { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); bar.focus(); } }
    const choose = (k) => {
      current = k;
      const o = OUTCOMES.find((x) => x.key === k);
      txt.className = 'bs-select-box-text';
      txt.innerHTML = `<div class="d-flex align-items-center">${outcomeIcon(k, 16)}<span class="email-category-renderer gray-txt-15 ml-1">${esc(o.name)}</span></div>`;
      close();
      onPick(k);
    };
    const open = () => {
      if (pop) { close(); return; }
      const r = bar.getBoundingClientRect();
      pop = h(`<div class="transfer-overlay transfer-select-box unified-inbox-filter-assign ui-transfer" style="position: fixed; z-index: 1600; width: ${r.width}px; left: ${r.left}px; top: ${r.bottom + 4}px;"><div class="transfer-container ui-transfer-c"><div class="transfer-body disabled">
        <div class="transfer-search"><span class="bs-input-affix-wrapper bs-input-affix-wrapper-md input-default transfer-search-input"><input class="bs-input-md bs-input" placeholder="Search" autocomplete="off" aria-label="Search outcomes"></span></div>
        <div class="transfer-content"><ul class="transfer-list" role="listbox"><div>${OUTCOMES.map((o) => `<li class="${current === o.key ? 'active' : ''}" role="option" tabindex="-1" data-k="${o.key}">${opt(o)}</li>`).join('')}</div></ul></div>
      </div></div></div>`);
      document.body.appendChild(pop);
      bar.setAttribute('aria-expanded', 'true');
      const inp = pop.querySelector('input');
      inp.addEventListener('input', () => { const q = inp.value.toLowerCase(); pop.querySelectorAll('li').forEach((li) => { li.hidden = !OUTCOMES.find((o) => o.key === li.dataset.k).name.toLowerCase().includes(q); }); });
      pop.querySelectorAll('li').forEach((li) => li.addEventListener('click', () => choose(li.dataset.k)));
      place();
      // window capture runs before the dialog's document listener, so Esc closes the list and not the dialog
      setTimeout(() => { document.addEventListener('mousedown', outside, true); window.addEventListener('keydown', key, true); }, 0);
      if (opts.focusSearch !== false) inp.focus({ preventScroll: true });
    };
    bar.addEventListener('click', open);
    bar.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); open(); } });
    return { open, close, choose, bar };
  };

  /* ActionStatesModal while a select-all bulk request is pending (Lottie loader drawn as a static placeholder) */
  window.UI_ACTION_STATES = () => {
    const root = h(`<div class="nx-modal-root"><div class="fade modal-backdrop show"></div>
      <div role="dialog" aria-modal="true" aria-label="Please Wait!" class="fade bs-modal-container unsubscribe-link-modal action-states-modal modal show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-content-container">
          <div class="bs-modal-body modal-body"><div><div class="d-flex flex-column align-items-center"><span class="semibold-3 popover-arrow-color-txt">Please Wait!</span><span class="regular-2">It might take up to <span class="font-medium">30 secs</span> to process.</span></div>
          <div><div class="animation-container ui-lottie" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="carousel slide bg-blue-container"><div class="carousel-inner"><div class="carousel-item active"><div class="d-flex flex-column"><span class="semibold-2 popover-arrow-color-txt">Did you know?</span><span class="regular-2 font-weight-medium gray-txt-15">Saleshandy auto pauses a sequence when there are any chances of email bounce.</span></div></div></div></div></div></div></div>
        </div></div></div></div></div>`);
    document.body.appendChild(root);
    NX.settle(root);
    return { close: () => root.remove() };
  };
})();
