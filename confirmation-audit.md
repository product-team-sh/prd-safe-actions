# Where Saleshandy should ask before it acts

Audit of every destructive or high-impact action in the production app (webui `main` at [aeda4e3](https://github.com/saleshandy/saleshandy-webui/tree/aeda4e3654fd76c54725fd676463c3694a35eed3), 21 Oct 2026) and V3 (`saleshandy-app` at [f6da0ba](https://github.com/saleshandy/saleshandy-app/tree/f6da0babb9ea74425ddee0fd11417134fd3b7b1c)). Triggered by [Prospects gets deleted with just one click.](https://app.basecamp.com/4378325/buckets/37128546/card_tables/cards/10379933153); root cause in [remove-from-sequence-one-click.md](../sequences/remove-from-sequence-one-click.md).

## Decision first

**The product has no consistent bar.** Single-item actions mostly confirm. Bulk actions that hit up to 25,000 records often do not, or confirm with copy that never says how many or what. Of ~110 actions audited: about 35 have no confirmation, about 35 have a weak one, about 40 are fine.

**Proposal:** adopt one rule (below), fix **11 P1 gaps** now (7 missing, plus V3), strengthen **11 P1 weak confirmations**, and queue P2. Most of the work is copy plus one shared "count / item name" slot in the existing modal.

## The rule

| Tier | When | What the user must see |
|---|---|---|
| **T0** none, or undo toast | Single item, reversible, does not change sending | Nothing, or a short undo |
| **T1** confirm | Any bulk action. Any single action that is irreversible or stops sending | The item name or the count, the consequence, whether it can be undone |
| **T2** confirm with impact | The action spills over (sequences pause, prospects reactivate, values wiped) | T1 plus the knock-on ("3 sequences will pause") |
| **T3** type to confirm | Irreversible and very large (whole sequence, 1,000+ records, whole account), or an account-wide security switch | T2 plus typing a word |
| **Money** | Spends credits or money | The total cost before the spend |

## P1: add a confirmation (none today)

| # | Action | Scope | Why it matters | Tier | Source |
|---|---|---|---|---|---|
| 1 | Sequence > Prospects > bulk **Remove From Sequence** (icon-only X) | Up to 25,000 | The reported case. Removes all selected, no undo, history in that sequence lost | T1, T3 for whole sequence | [header L119-130](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/contact-list-content/components/contact-list-header/contact-list-header.tsx#L119-L130) |
| 2 | Same bar > bulk **Mark as Unsubscribe**, **Mark as finished**, **Mark as Replied** (all icon-only) | Up to 25,000 | Each stops sending to everyone selected; unsubscribe is likely permanent | T1 | [header L131-163](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/contact-list-content/components/contact-list-header/contact-list-header.tsx#L131-L163), [handlers L586-621](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/contact-list-content/contact-list-content.tsx#L586-L621) |
| 3 | **V3** prospects bulk bar: the same four, plus **Resume** (legacy confirms Resume; V3 dropped it) | Up to 25,000 | The gap is being rebuilt into the new app | T1 | [ProspectsBulkActionBar L143-199](https://github.com/saleshandy/saleshandy-app/blob/f6da0babb9ea74425ddee0fd11417134fd3b7b1c/src/features/sequences/components/ProspectsBulkActionBar/ProspectsBulkActionBar.tsx#L143-L199) |
| 4 | CSV import > conflict action **Update All Fields** or **Overwrite** | Whole file | Overwrites existing prospect data; with Update All, a blank cell clears the value. Warning is a tooltip only | T2 (how many existing prospects change) | [conflict-action.ts L10-39](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/map-fields/conflict-action.ts#L10-L39) |
| 5 | Integrations > CRM card (HubSpot, Salesforce, Pipedrive) > **Disconnect** | Account | Disconnects and unsubscribes every sync event in one click | T2 | [crm-view L59-66](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/integrations/utils/crm-view.tsx#L59-L66), [handler L340-363](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/integrations/integrations.tsx#L340-L363) |
| 6 | Admin settings > **Require email OTP** (MFA) off, **Login with SSO** off | Whole account | Security switches. SSO *on* already confirms with impact copy; *off* does not | T2 | [MFA L1404-1411](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/admin-settings/admin-settings.tsx#L1404-L1411), [SSO L915-924](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/admin-settings/admin-settings.tsx#L915-L924) |
| 7 | Admin settings > **Allow team members to export** on; **Send Integration/Webhook events for entire account** on | Whole account | Data leaves the account; the events toggle warns of duplicates in a tooltip only | T1 | [export L433-443](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/admin-settings/admin-settings.tsx#L433-L443), [events L384-386](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/admin-settings/admin-settings.tsx#L384-L386) |
| 8 | Email Verifier > **Verify** | Every email pasted | Spends credits on the whole input and clears it; only guard is "not enough credits" | Money | [L87-101](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/email-verifier/email-verifier-input-and-file-upload/email-input-and-file-upload.tsx#L87-L101) |

## P1: strengthen a weak confirmation

These confirm, but the user cannot tell how many, which one, or what else breaks.

| Action | Scope | What is missing today | Tier | Source |
|---|---|---|---|---|
| CRM > bulk **Delete** prospects | Up to 25,000, permanent | No count. "Are you sure you want to delete the selected prospects." | T3 | [delete-prospect-modal L39-48](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/prospect/components/prospect-list/components/modals/delect-prospect-modal/delete-prospect-modal.tsx#L39-L48) |
| CRM > bulk **Unsubscribe** | Up to 25,000 | No count | T1 | [unsubscribe-prospect-modal L34-43](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/prospect/components/prospect-list/components/modals/unsubscribe-prospect-modal/unsubscribe-prospect-modal.tsx#L34-L43) |
| Email accounts > bulk **Delete** / **Disconnect** | Up to 25,000 | "all the selected email accounts", no count, no sequences-affected count | T2, T3 for delete | [actions L684-740](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/email-accounts/components/email-accounts-content/components/email-accounts-actions/email-accounts-actions.tsx#L684-L740), [copy en.ts L1647-1650](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/locales/en.ts#L1647-L1650) |
| Unified Inbox > bulk **Delete conversation** / **Unsubscribe** | Up to 10,000 | Singular copy ("this email thread"), no count | T1 | [actions-row L704-740](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/unified-inbox/components/unified-inbox-actions-row/unified-inbox-actions-row.tsx#L704-L740) |
| Users > **Delete** user | Single, permanent | No user name; silent on that user's sequences, prospects, mailboxes | T2 | [delete-user-modal L1-29](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/users-and-teams/components/users/modals/delete-user-modal.tsx#L1-L29) |
| Users > **Change Role** (includes making someone Owner) | Single | No user name, no old/new role, no consequence; last admin not guarded here (inferred) | T2 | [change-role-modal L51-83](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/users-and-teams/components/users/modals/change-role-modal.tsx#L51-L83) |
| Sequence > **Delete step** | Single, permanent | Typed confirm exists, but silent on prospects currently on that step | T2 | [delete-step-modal L6-12](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/shared/modals/delete-step-modal/delete-step-modal.tsx#L6-L12) |
| Settings > **Custom field** delete | Single, permanent | No field name; silent on values held by prospects | T2 | [delete-custom-field-modal L21-41](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/custom-fields/components/delete-custom-field-modal/delete-custom-field-modal.tsx#L21-L41) |
| Lead Finder > bulk **View Email / Phone**; **Save to List** | Up to plan limit | Shows count or a per-lead price, never the total credits | Money | [bulk-reveal-tag-modal L52-58](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/v2-lead/components/modal/bulk-reveal-tag-modal/bulk-reveal-tag-modal.tsx#L52-L58), [add-to-list-dropdown L527-560](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/v2-lead/components/add-to-list-dropdown/add-to-list-dropdown.tsx#L527-L560) |
| Billing > **reduce email slots or seats** / downgrade | Account | Slots cannot go below what is in use today (the input floors at the larger of users and email accounts, [upgrade-plan.tsx L121-137](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/billing-subscription/components/upgrade-plan/upgrade-plan.tsx#L121-L137)), so the user hits a dead end and must disconnect elsewhere first. The downgrade warning exists but is never shown | T2 + Money | [update-plan-modal L12-60](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/billing-subscription/components/outreach-plans/components/update-plan-modal/update-plan-modal.tsx#L12-L60), [unused downgrade-warning-modal](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/billing-subscription/components/upgrade-plan/components/downgrade-warning-modal.tsx#L8-L47) |
| Profile > **Delete Account** for Google/Microsoft sign-in users | Whole account, permanent | Only "Please validate your Google/Microsoft account to delete your account". Password users get a proper warning | T3 | [L948-971](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/my-profile/components/my-profile-content/my-profle-content.tsx#L948-L971) |

## P2: next pass

Single-item or reversible, but the user should still know what happens.

| Action | Today | Gap | Source |
|---|---|---|---|
| Email accounts > status switch to **Pause** | None | Stops sending in every sequence using it | [columns L250-263](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/email-accounts/components/email-accounts-content/components/email-accounts-table/utils/get-email-accounts-columns.tsx#L250-L263) |
| Agency clients > **Reset Password** (icon-only) | None | Changes a client's login instantly | [columns L55-83](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/agency-client-management/components/agency-client-table/utils/get-agency-client-columns.tsx#L55-L83) |
| Integrations > LinkedIn card > **Disconnect** | None, but **dead code** | `LinkedInAutomationCard` is imported nowhere (verified 22 Oct); the live HeyReach/Aimfox path confirms on its settings page with generic copy, so the gap there is Weak, not None | [card L174-182](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/integrations/components/linkedin-automation-card/linkedin-automation-card.tsx#L174-L182) |
| CRM > AI column > **Save & Run** (new column) | None | Spends AI credits on all rows; no total | [template-footer L277-386](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/prospect/components/ai-col-enrichment-modal/components/template-footer.tsx#L277-L386) |
| CRM > AI column > run on **existing** column | Weak | Overwrites values; no row count | [override modal L20-49](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/prospect/components/ai-col-enrichment-modal/components/override-generated-existing-column.tsx#L20-L49) |
| Sequence > Prospects > bulk **Pause** / **Resume** | Weak | No count | [resume modal L34-40](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/shared/components/resume-prospect-modal/resume-prospect-modal.tsx#L34-L40), [pause modal L67-116](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/shared/components/pause-prospect-modal/pause-prospect-modal.tsx#L67-L116) |
| Sequence list > bulk **Pause** / **Resume** (up to 100) | Weak | Singular "the Sequence", no count or names | [modal L38-47](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/shared/modals/pause-resume-sequence-modal/pause-resume-sequence-modal.tsx#L38-L47) |
| Tasks > bulk **Skip** (up to 25,000) | Weak | No count, and no undo (single skip has undo) | [tasks-content L2303-2345](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/tasks/components/tasks-content/tasks-content.tsx#L2303-L2345) |
| Unified Inbox > bulk **Assign outcome** | Weak | Silently replaces existing outcomes; no count | [actions-row L647-703](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/unified-inbox/components/unified-inbox-actions-row/unified-inbox-actions-row.tsx#L647-L703) |
| CRM / Email accounts > **Remove tags** | Weak | Tag picker with "Apply", no count | [add-remove-tag L102-153](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/shared/components/add-remove-tag/add-remove-tag.tsx#L102-L153) |
| Lead Finder > **Remove From List** | Weak | No count; re-adding may cost credits (inferred) | [remove-from-list-modal L49-70](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/v2-lead/components/remove-from-list-modal/remove-from-list-modal.tsx#L49-L70) |
| Settings > **Delete schedule** | Weak | No name, no count of sequences using it | [delete-schedule L11-21](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/schedule/components/delete-schedule/delete-schedule.tsx#L11-L21) |
| Settings > **Delete custom tracking domain** | Weak | No domain name | [helper L22-35](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/custom-domain/helper.ts#L22-L35) |
| Lead Finder > **Delete saved filter** | Weak | "Are you sure, you want to continue?" No name | [save-filter-modal L72-78](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/v2-lead/components/modal/save-filter-modal/save-filter-modal.tsx#L72-L78) |
| Email accounts > single **Delete** / **Disconnect** | Weak | Consequence stated, account not named | [delete modal L16-41](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/email-accounts/components/email-accounts-content/components/delete-email-account-modal/delete-email-account-modal.tsx#L16-L41) |
| Sequence > Settings > **remove email account** (after mail sent) | Weak | Account not named | [remove-email-warning-modal L16-38](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-settings/components/sequence-single-settings-content/components/remove-email-warning-modal/remove-email-warning-modal.tsx#L16-L38) |

## Leave as is

| Action | Why no confirmation is right |
|---|---|
| Tasks > single Skip / Complete | Already has a 5-second undo ([L548-589](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/tasks/components/tasks-content/tasks-content.tsx#L548-L589)) |
| Unified Inbox > mark read / unread, single outcome dropdown | Trivially reversible ([L486-503](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/unified-inbox/components/unified-inbox-actions-row/unified-inbox-actions-row.tsx#L486-L503)) |
| Sequence > Settings > remove associated client | Reversible by picking it again ([L160-170](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-settings/components/sequence-single-settings-content/components/sequence-associated-client/sequence-associated-client.tsx#L160-L170)) |
| Start Sequence | The intended outcome of setup; pausing is confirmed and available |
| Webhook pause switch | Reversible; delete already confirms ([status field L17-32](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/webhook/components/webhook-list/components/webhook-table/fields/webhook-status-field.tsx#L17-L32)) |
| Users > Expire session, Enable; team member remove; Lead Finder recent-search delete; single reveal (1 credit, tooltip says so) | Low stakes, reversible or self-evident |

## Bugs found on the way

| Bug | Source |
|---|---|
| Custom / call outcome delete: replacement defaults to outcome id 1 and Delete is allowed without choosing, so prospects can be silently re-labelled | [delete-custom-outcome-modal L30](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/custom-outcomes/components/delete-custom-outcome-modal/delete-custom-outcome-modal.tsx#L30) |
| CSV import "Overwrite" says "Fields that are currently empty will not be filled in" but never says a blank cell **erases** an existing value, which the backend does (same as Update All Fields) | [conflict-action.ts L27-30](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/sequence/components/sequence-single-content/components/sequence-single-contacts/components/map-fields/conflict-action.ts#L27-L30), [edge L2890-2903](https://github.com/saleshandy/saleshandy-edge/blob/4617c54245290552db5483f112542b98d6901fc9/src/contacts/services/contacts-import.service.ts#L2890-L2903) |
| Unified Inbox block modal says "Emails from this domain" when blocking a single address | [mails-content L608-633](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/unified-inbox/components/unified-inbox-mails-content/unified-inbox-mails-content.tsx#L608-L633) |
| Daily sending-limit confirmation is rendered but never opened (dead) | [email-accounts-content L1970-1985](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/email-accounts/components/email-accounts-content/email-accounts-content.tsx#L1970-L1985) |
| Downgrade warning ("ongoing sequences will get paused") exists in three copies, never shown | [downgrade-warning-modal L8-47](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/billing-subscription/components/upgrade-plan/components/downgrade-warning-modal.tsx#L8-L47) |

## Already good: copy these

| Benchmark | What makes it good | Source |
|---|---|---|
| MCP > disconnect session | Names the client, states the consequence, says it can be reconnected | [mcp-disconnect-modal L16-47](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/mcp-settings/components/mcp-disconnect-modal/mcp-disconnect-modal.tsx#L16-L47) |
| Custom field > delete dropdown option | Forces choosing where affected prospects go before Delete enables | [delete-option-modal L43-90](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/custom-fields/components/generic-create-update-custom-field-modal/delete-option-modal.tsx#L43-L90) |
| Email accounts > bulk settings update | Names the count: "for all {n} email accounts?" | [bulk-email-update-modal L832-880](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/email-accounts/components/email-accounts-content/components/bulk-email-update-modal/bulk-email-update-modal.tsx#L832-L880) |
| Admin > enable SSO | States who is affected and that sessions end | [admin-settings L1546-1562](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/admin-settings/admin-settings.tsx#L1546-L1562) |
| API keys > delete | Names the key, says it is not reversible | [delete-api-token-modal L21-47](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/api-tokens/components/delete-api-token-modal/delete-api-token-modal.tsx#L21-L47) |
| Profile > Delete Account (password users) | Re-auth, shows the email, says all data is erased | [delete-account L101-190](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/components/settings/components/my-profile/components/delete-account-modal/delete-email-modal-flow/delete-account.tsx#L101-L190) |

## What already exists (context for dev, not a prescription)

| Where | Component | Note |
|---|---|---|
| webui | [ConfirmationModalV3](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/shared/design-system/components/atoms/confirmation-modal/confirmation-modal-v3.tsx) | De facto standard, 39 call sites; has no slot for a count or item name, which is why most copy is generic |
| webui | [DeleteAlertModal](https://github.com/saleshandy/saleshandy-webui/blob/aeda4e3654fd76c54725fd676463c3694a35eed3/src/shared/components/delete-alert-modal/delete-alert-modal.tsx) | Type-to-confirm (T3) is built in and used by no caller |
| V3 | [AlertDialog](https://github.com/saleshandy/saleshandy-app/blob/f6da0babb9ea74425ddee0fd11417134fd3b7b1c/src/shared/components/ui/alert-dialog/alert-dialog.tsx) | Single primitive, 32 files; [DeleteClientDialog](https://github.com/saleshandy/saleshandy-app/blob/f6da0babb9ea74425ddee0fd11417134fd3b7b1c/src/features/clients/components/dialogs/DeleteClientDialog/DeleteClientDialog.tsx#L46-L71) is the pattern |

V3 has only sequences, clients, templates and an unfinished tasks area today. CRM, mailboxes, Lead Finder, inbox, settings and billing are not built there yet, so this rule should be written into V3 before those land.

## Counter-case

| You will hear | Answer |
|---|---|
| "Confirmation fatigue: power users clean lists daily" | Tiers keep single reversible actions free. A count makes a bulk prompt worth reading; a generic "Are you sure?" is what trains people to click through |
| "Use undo instead, like Gmail" | Several paths hard-delete on the backend (sequence removal wipes events, drafts, notes). Undo is a backend project per action; confirmation is not |
| "This started as one card" | P1 missing is 8 rows, and 4 of them are the same bulk bar. Most P1 weak rows are copy plus one count/name slot |
| "Admin toggles are deliberate; admins know" | MFA and SSO off are security downgrades for every user; one is already confirmed in the other direction |
| "Prevalence?" | Unknown. Metabase timed out on the 90-day `deletedAt` grouping; Intercom and Jira are not reachable from this account today |

## Verified vs assumed

| Verified | Inferred or not covered |
|---|---|
| Every P1 "add a confirmation" row: I re-read the control and handler at `aeda4e3` (and V3 at `f6da0ba`) myself | Backend effects: whether custom-field delete wipes values, what user delete does to their data, whether unsubscribe is reversible |
| P1 weak copy for email accounts, Unified Inbox, user delete, OAuth delete re-read by me; the rest read by audit agents from source | Change Role last-admin guard; which slot reductions disconnect accounts |
| All links point at pinned commits and were checked to resolve | Not audited: Lead Finder v1 (`/leads`, still routed), Dialer, Kanban stage moves, inline cell edits, CSV Enrichment tab, public API |
