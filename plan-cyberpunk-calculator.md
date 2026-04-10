# Cyberpunk Ledger UI Refactor Plan (Calculator Mode)

## Goal
Refactor the Cyberpunk Ledger UI into a calculator-style interface (functionality refactor, not button styling):
- Keep the existing PDF download link
- Add a calculator-style display and keypad
- Allow users to create custom buttons (editable + deletable)
- Each custom button applies a positive or negative value when pressed
- Maintain a transaction log that can be undone/removed
- Provide a back button to undo the most recent change

## Scope
- Applies to the Cyberpunk Ledger page only (`/projects/cyberpunk-ledger`)
- Refactor functionality, keep existing button styling as much as possible
- Preserve existing PDF download flow/link

## UX Summary
1. **Calculator Display**
   - Shows current total (stash)
   - Shows recent transaction or input value
2. **Default Keypad**
   - Digits `0-9`
   - `+` / `-` operator
   - `Apply` (commit entered value as a transaction)
   - `Back` (undo last transaction)
   - `Clear` (clear current input)
3. **Custom Buttons**
   - User can create a new button with:
     - Label
     - Amount (+ or -)
   - Buttons are editable and deletable
   - Clicking a custom button applies a transaction immediately
4. **Transaction Log**
   - List of applied transactions
   - Each item can be removed (undo individual)
   - Back button undoes most recent

## Data Model (Proposed)
- `currentValue` (number)
- `inputValue` (string)
- `transactions`: array of `{ id, label, amount, timestamp }`
- `customButtons`: array of `{ id, label, amount }`

## Implementation Approach
1. **Create calculator state** in `src/pages/CyberpunkLedger.jsx`:
   - Replace existing ledger table functionality with calculator flow
2. **Build calculator UI**:
   - Display area + keypad grid
   - Back button to undo last transaction
3. **Custom button manager**:
   - Add form to create new button
   - Inline edit/delete actions
4. **Transaction handling**:
   - Applying input or custom button pushes to `transactions`
   - Current total derived from starting value + transaction sum
   - Back removes most recent transaction
   - Removing individual transaction updates total
5. **Local storage**:
   - Store calculator state (`currentValue`, `transactions`, `customButtons`)
   - Rehydrate on load
6. **Preserve PDF link**:
   - Keep the download section intact

## Acceptance Criteria
- Calculator UI replaces the ledger table in the cyberpunk page
- User can add, edit, and delete custom buttons
- Pressing a custom button applies its amount
- Back button undoes the most recent transaction
- Transaction log updates correctly and supports removal
- PDF download link still works
- Cached data (current total + transaction log + custom buttons) restores correctly on reload
- CSV download exports the transaction log and current total

## Risks / Considerations
- Ensure undo logic stays consistent with transaction removal
- Avoid breaking existing save/export flows (replace or disable as needed)
- Keep performance snappy with growing transaction lists
- Validate cached data on load (schema/versioning) to avoid corrupted state

## Next Steps
1. Confirm desired calculator layout and fields
2. Implement calculator state + UI
3. Add custom button CRUD
4. Add transaction log + undo
5. Add caching + CSV export validation
6. Test persistence + CSV + PDF link
