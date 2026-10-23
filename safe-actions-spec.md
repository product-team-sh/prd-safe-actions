# Safe actions: spec for the prototype and dev

Companion to the clickable prototype in [prototype/](prototype/index.html). Source audit: [confirmation-audit.md](confirmation-audit.md). Directions explored: [01-directions.html](prototype/01-directions.html). Code references are webui `main` at [aeda4e3](https://github.com/saleshandy/saleshandy-webui/tree/aeda4e3654fd76c54725fd676463c3694a35eed3) unless stated.

## Decisions (22 Oct 2026)

| Layer | In | Out |
|---|---|---|
| Before the click | **A** selection states its real scope, **B** risky actions get words and distance, **C** one explained "Change status" menu | |
| At the click | **F** impact dialog on every risky action, from one item to 25,000 | Tiered rule, plain dialog, type-to-confirm |
| After the click | **H** 10-second undo, backed by a delayed, cancellable job | 30-day restore, activity record |
| Guard the account | **K** prove it is you, **L** total cost before any spend, **M** plan changes name what stops | |

Everything below states the required outcome. How it is built is dev's call.

## A. Selection says its real scope

The banner above a bulk table must always say how much is selected **relative to everything**, so the user knows the blast radius before clicking.

| State | Banner copy |
|---|---|
| Part of one page | "**7 of 2,340** prospects selected." Links: "Select all 2,340", "Clear selection" |
| Whole page, more exist | "**All 25 on this page** are selected." Links: "Select all 2,340 prospects", "Clear selection" |
| Everything (by header checkbox when it all fits on one page, or by "Select all") | "**All 7 prospects in this sequence** are selected." Link: "Clear selection" |
| Everything, filters or a tab applied | "**All 312 prospects matching your filters** are selected." Link: "Clear selection" |
| Over the 25,000 cap | "**First 25,000 of 31,200** prospects are selected. You can act on up to 25,000 at a time." Link: "Clear selection" |

Today the banner says "7 Prospects are selected." and hides "Select all" when the page already holds everyone ([banner L77-113](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/prospect/helpers/prospect-selected-row-info-banner.tsx#L77-L113)), which is exactly how the reported customer emptied a sequence without knowing it.

Applies to every table with bulk select: Sequence > Prospects, CRM prospects, email accounts, Unified Inbox, Tasks, Lead Finder. Noun changes per table ("conversations", "tasks", "email accounts", "leads").

## B. Risky actions get words and distance

| Rule | Detail |
|---|---|
| Labels | Every bulk action shows a text label when the bar has room. Icon-only is allowed for safe actions only, with a tooltip |
| Distance | Risky actions sit at the right end of the bar, after a divider |
| Count | The risky button is a plain verb ("Remove", "Delete") with no number (23 Oct 2026). The count lives in the selection banner and in the dialog's title and primary button ("Remove 7 prospects") |
| Colour | Red text only when data is lost: delete, remove with history, unsubscribe. Nothing else on the bar is red |
| Icon | A remove action never uses an X (X means close or clear). Use the trash or user-minus icon |
| Width | When the bar runs out of room, safe actions collapse into "More". Risky actions never hide in "More" |

## C. One "Change status" menu that explains

Replaces the five status icons on Sequence > Prospects (Replied, Unsubscribe, Finished, Pause, Resume).

| Order | Option | One-line description | Then |
|---|---|---|---|
| 1 | Pause | Stops sending until you resume | F dialog (blue), with pause duration picker kept from today |
| 2 | Resume | Picks up from their current step | F dialog (blue) |
| divider | | | |
| 3 | Mark as replied | Stops the sequence for them | F dialog (blue) |
| 4 | Mark as finished | Stops the sequence for them | F dialog (blue) |
| 5 | Unsubscribe | Never email them again, from any sequence | F dialog (red) |

Options that do not apply to the selection are disabled with the reason ("All selected prospects are already paused").

## F. Impact dialog

One dialog pattern for every risky action. Anatomy, top to bottom:

| Part | Rule | Example |
|---|---|---|
| Title | Verb + count + noun + where, as a question. Single item: name it | "Remove 7 prospects from "SaaS founders, Oct"?" / "Delete the custom field "Industry"?" |
| Breakdown | Up to 4 rows describing **what is affected**: the selection split by status, or the knock-on (sequences that pause, prospects that lose a value). Rows with 0 are hidden. If only one row would show, write it as a sentence instead | Still in progress 1,906 / Email scheduled in the next hour 214 / Replied 312 / Paused 122 |
| Consequence | One or two short sentences: what stops, what is lost, and whether it can be undone | "They stop getting emails from this sequence. You can undo this for 10 seconds; after that their progress here is gone." |
| Buttons | Secondary "Cancel". Primary = verb + count + noun, never "Yes" or "OK". When one item is named in the title, verb + noun with no "1" | "Remove 7 prospects" / "Remove prospect" |
| Colour | Red primary when data is lost: something is deleted, removed with its history (remove from sequence), or can never be undone (unsubscribe). Blue when nothing is lost and it can be redone by hand: pause, resume, assign outcome, skip, remove tags, remove from a list | |

States every dialog must cover:

| State | Behaviour |
|---|---|
| Counting | Dialog opens at once with title and count; breakdown rows show a placeholder; primary stays enabled (the count in the title is already known) |
| Breakdown fails to load | Breakdown replaced by "We couldn't load the details. You can still continue." Action still allowed |
| Submitting | Primary shows a spinner and ignores further clicks |
| Action fails | Dialog stays open with what happened, why, and what to do ("We couldn't remove these prospects because the sequence was deleted. Refresh the page.") |
| Selection is everything | Title says "all": "Remove all 2,340 prospects from …?" and the consequence adds "This empties the sequence." |
| Keyboard | Esc and clicking outside = Cancel. Initial focus on Cancel for red dialogs, on the primary for blue |

## H. 10-second undo

| Rule | Detail |
|---|---|
| What the user sees | Rows leave the table at once. A toast at the bottom: "Removed 7 prospects from "SaaS founders, Oct"" with **Undo** and a 10-second ring |
| Hover | The timer pauses while the pointer is on the toast |
| Undo | Rows come back exactly as they were (same position, status and selection cleared). Toast: "Undone. 7 prospects are back" |
| Expiry | After 10 seconds the toast closes and the action is final |
| Leaving the page | The action still completes after 10 seconds. Undo is not offered elsewhere |
| Two actions in a row | The second toast replaces the first; the first commits immediately |
| Required backend outcome | The real change starts only after 10 seconds and can be cancelled before then. Several of these actions already run as background jobs ("Estimated time: 30 minutes"), which makes the delay a scheduling change, not a rewrite |

Not offered for: spends (credits, plan changes), security switches, account deletion, disconnecting integrations or mailboxes (side effects outside Saleshandy happen at once). These rely on F, K, L, M.

## K. Prove it is you

| Trigger | Ask | Then |
|---|---|---|
| Turn off "Require email OTP" | Current password; Google or Microsoft users re-validate with their provider | Toggle changes, toast "Email codes are off for all 12 users" |
| Turn off "Login with SSO" | Same | Same pattern |
| Turn on "Allow team members to export" | Same | Same pattern |
| Turn on "Send Integration/Webhook events for entire account" | F dialog only (no password): breakdown of users whose events start flowing, and the duplication warning from today's tooltip | |
| Delete account, Google or Microsoft users | F dialog with what is erased, then provider re-validation (today's flow skips the warning) | |

The password check already exists in the delete-account flow for password users ([delete-account L101-190](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/my-profile/components/delete-account-modal/delete-email-modal-flow/delete-account.tsx#L101-L190)).

## L. Total cost before any spend

| Part | Rule |
|---|---|
| Title | What is bought: "Reveal work emails for 250 leads?" |
| Breakdown | Credits this uses / You have / Left after. When the per-item cost varies (email vs phone), one row per type |
| Not enough | The shortfall replaces "Left after": "You need 60 more credits". Primary becomes "Buy credits"; a secondary "Reveal 190 emails" spends what is there, if the action supports partial runs |
| Primary | Verb + count: "Reveal 250 emails", "Verify 1,200 emails", "Run on 480 rows" |

## M. Plan changes name what stops

| Change | The dialog must show |
|---|---|
| Remove email slots | Slots in use vs after; the user picks which mailboxes disconnect, each with "In N sequences"; the date it happens. Today the slot input simply refuses to go below what is in use, so this is new capability, not only a warning |
| Remove seats | Production has no separate seats: one slot covers one email account and one team member. When team members exceed the new count, the same picker lists users and what they own |
| Downgrade plan | What stops on the date: sequences that pause, features that switch off. Today's unused `DowngradeWarningModal` copy is the starting point |

## Surfaces

Every P1 and P2 row of the audit, mapped. "Breakdown" lists the rows the F dialog shows; dev confirms each count can be served.

| # | Surface | Action | Patterns | Breakdown / data the dialog needs | Undo | Prototype page |
|---|---|---|---|---|---|---|
| 1 | Sequence > Prospects | Remove from sequence | A B F H | By status: in progress, email scheduled within the hour, replied, paused | Yes | sequence-prospects.html |
| 2 | Sequence > Prospects | Unsubscribe | A C F H | By status; plus "also in N other sequences" | Yes | sequence-prospects.html |
| 3 | Sequence > Prospects | Mark as replied, Mark as finished | A C F H | By status | Yes | sequence-prospects.html |
| 4 | Sequence > Prospects | Pause, Resume | A C F H | Pause: in progress, scheduled within the hour. Resume: paused, will send today | Yes | sequence-prospects.html |
| 5 | Sequence list | Bulk pause / resume (up to 100) | A B F H | Sequences named (first 3 + "and N more"), active prospects affected, subsequences | Yes | sequence-list.html |
| 6 | Sequence > Steps | Delete step | F | Prospects currently on this step, emails scheduled from it, where those prospects go next | No | sequence-steps.html |
| 7 | Sequence > Settings | Remove email account from sequence | F | Account named, prospects whose next email was due from it, follow-ups that stop | No | sequence-steps.html |
| 8 | Unified Inbox | Bulk delete conversation | A B F H | Conversations, of which from active sequence prospects | Yes | unified-inbox.html |
| 9 | Unified Inbox | Bulk unsubscribe | A B F H | Prospects, of which in active sequences | Yes | unified-inbox.html |
| 10 | Unified Inbox | Bulk assign outcome | A F H | Conversations, of which already have a different outcome (will be replaced) | Yes | unified-inbox.html |
| 11 | Tasks | Bulk skip | A B F H | Tasks by type; prospects who move to their next step | Yes | tasks.html |
| 12 | CRM prospects | Bulk delete | A B F H | Prospects, in active sequences, with replies, with notes | Yes | crm-prospects.html |
| 13 | CRM prospects | Bulk unsubscribe | A B F H | Prospects, in active sequences | Yes | crm-prospects.html |
| 14 | CRM prospects | Remove tags | A F H | Prospects, tags being removed | Yes | crm-prospects.html |
| 15 | CRM > Import CSV | Update All Fields / Overwrite | F | Existing prospects that will change, values that will be cleared (blank cells clear values for **both** options: [edge L2890-2903](https://github.com/saleshandy/saleshandy-edge/blob/4617c54245290552db5483f112542b98d6901fc9/src/contacts/services/contacts-import.service.ts#L2890-L2903); the Overwrite option text does not say so), new prospects added | No | csv-import.html |
| 16 | CRM > AI column | Run (new column), run on existing column | L (+F for overwrite) | Rows, credits, values replaced | No | crm-prospects.html |
| 17 | Email accounts | Bulk delete / disconnect | A B F | Accounts, active sequences that pause, emails scheduled today | No | email-accounts.html |
| 18 | Email accounts | Single delete / disconnect | F | Account named, sequences that pause | No | email-accounts.html |
| 19 | Email accounts | Status switch to Pause | F H | Sequences using it, emails scheduled today | Yes | email-accounts.html |
| 20 | Email accounts | Remove tags | A F H | Accounts, tags | Yes | email-accounts.html |
| 21 | Lead Finder | Bulk reveal email / phone | A L | Credits by type | No | lead-finder.html |
| 22 | Lead Finder | Save to list, Add to sequence with reveal | L | Credits | No | lead-finder.html |
| 23 | Lead Finder | Remove from list | A F H | Leads, list named | Yes | lead-finder.html |
| 24 | Lead Finder | Delete saved filter | F | Filter named | No | lead-finder.html |
| 25 | Email Verifier | Verify | L | Emails, credits | No | lead-finder.html |
| 26 | Settings > Users | Delete user | F | User named; sequences, prospects, email accounts they own and what happens to them | No | settings.html |
| 27 | Settings > Users | Change role (incl. Owner) | F | User, old role, new role, what they gain or lose; blocked if it leaves no admin | No | settings.html |
| 28 | Settings > Custom fields | Delete field | F | Field named, prospects holding a value, templates and steps using it | No | settings.html |
| 29 | Settings > Schedule | Delete schedule | F | Schedule named, sequences using it | No | settings.html |
| 30 | Settings > Custom domain | Delete tracking domain | F | Domain named, sequences and email accounts using it | No | settings.html |
| 31 | Settings > Integrations | CRM disconnect, LinkedIn card disconnect | F | App named, active syncs and workflows that stop | No | settings.html |
| 32 | Agency clients | Reset password | F | Client named, that they are signed out | No | settings.html |
| 33 | Admin settings | MFA off, SSO off, export on | K | Users affected | No | admin-billing.html |
| 34 | Admin settings | Account-wide integration events | F | Users whose events start flowing | No | admin-billing.html |
| 35 | Profile | Delete account (Google/Microsoft users) | F + K | Everything erased | No | admin-billing.html |
| 36 | Billing | Remove slots / seats, downgrade | M | See M | No | admin-billing.html |
| 37 | Sequence list | Delete sequences (bulk up to 100, and the row menu) | B F | Sequences named (first 3 + "and N more"), prospects in progress, emails scheduled in the next hour, subsequences deleted with them. Replaces the typed "delete" modal | No | sequence-list.html |

## Backend asks

| Ask | Needed by | Why it earns its place |
|---|---|---|
| Breakdown counts before the dialog opens | F, rows 1-14, 17-20, 26-31 | The knock-on (replied prospects, paused sequences, wiped values) is what users miss; the client cannot compute it for "select all" |
| Delay bulk changes 10 seconds and allow cancel | H, rows marked Yes | Replaces the need for a second safety step on the most frequent destructive actions; several already run as background jobs |
| Re-check identity for admin switches | K, row 33 | Security switches for every user; the check exists for account deletion |
| Preview what a plan change cuts | M, row 36 | Users learn what paused only after renewal today |

## Not in scope

Restore after the 10 seconds, an activity record, typed confirmation, the separate bugs listed in the audit, Lead Finder v1 (`/leads`), Dialer, public API.

## Counter-case

| You will hear | Answer |
|---|---|
| "A dialog on every action is fatigue" | Every dialog says something specific (counts, names, knock-on); generic "Are you sure?" is what trains click-through. Undo means most people never need to read it twice |
| "Undo alone would not have saved the reported customer" | True: they noticed after 4 minutes. A, B and F are what would have stopped the click. Restore stays out of scope by decision |
| "Counts cost a backend call per dialog" | Only for bulk; single-item dialogs need no lookup |
| "No typed confirmation for emptying a sequence of 25,000" | Decision taken; F's "all" title and "This empties the sequence" line carry that case |
