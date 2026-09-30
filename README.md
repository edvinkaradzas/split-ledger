# split-ledger

A JavaScript module for splitting shared expenses in a group and figuring out who should pay whom.

It solves the same problem as apps like Splitwise or Steven, but as a dependency-free library you can
build your own app on: a trip planner, a household budget, a chat bot or a command line tool.

## What it does

- Keeps track of the members and expenses of a group.
- Splits an expense equally between the participants, or by exact amounts per person.
- Calculates each member's balance: what they have paid compared to what they have used.
- Creates a settlement plan: who pays whom, in at most n−1 transfers for a group of n members.
- Records payments that have already been made, so a group can keep going after settling up.
- Calculates in whole öre (1/100 of a Swedish krona) internally, so no money is lost or created when
  an amount is split three ways.

## What it does not do

- Store data — saving and loading is up to your app.
- Move any money — it only tells you which payments to make.
- Provide a user interface — this is a module for programmers, not an app.
- Handle more than one currency — every amount in a group is in kronor, and no exchange rates are
  fetched or converted.
- Split by percentage or by shares — an expense is either split equally or by exact amounts.
- Change or remove an expense once it has been added. To correct a mistake, build the group again
  from your own data.
- Guarantee the theoretically smallest number of transfers. The settlement uses a greedy algorithm,
  which always settles the group in at most n−1 transfers for n members, but a different combination
  can occasionally need one transfer less.
- Handle interest, due dates or anything else that depends on time.

## Installation

Requires Node.js 24.12.0 or later. The module has no runtime dependencies.

```bash
npm install github:edvinkaradzas/split-ledger
```

## Example

```js
import { ExpenseGroup } from 'split-ledger'

const trip = new ExpenseGroup('Åre 2026')
trip.addMember('Anna')
trip.addMember('Bo')
trip.addMember('Cia')

// Split equally between every member.
trip.addExpense({ description: 'Cabin', paidBy: 'Anna', amount: 900 })

// Split between two of them only.
trip.addExpense({ description: 'Taxi', paidBy: 'Bo', amount: 300, participants: ['Bo', 'Cia'] })

// Split by exact amounts, when everyone had something different.
trip.addExpense({
  description: 'Dinner',
  paidBy: 'Anna',
  amount: 450,
  exactAmounts: { Anna: 100, Bo: 150, Cia: 200 },
})

for (const [name, balance] of trip.getBalances()) {
  console.log(`${name}: ${balance.getKronor()} kr`)
}
// Anna: 950 kr
// Bo: -300 kr
// Cia: -650 kr

const plan = trip.getSettlementPlan()

for (const transfer of plan.getTransfers()) {
  console.log(String(transfer))
}
// Bo pays Anna 300.00 kr
// Cia pays Anna 650.00 kr

// Bo has swished his part, so the group is up to date again.
trip.recordPayment({ from: 'Bo', to: 'Anna', amount: 300 })
```

## The public interface

You only create `ExpenseGroup` yourself. The other classes are returned by the module and read from.

### ExpenseGroup

| Method | Description |
| --- | --- |
| `new ExpenseGroup(name)` | Creates an empty group. |
| `addMember(name)` | Adds a member. Names must be unique within the group. |
| `getMembers()` | Returns the member names. |
| `getName()` | Returns the name of the group. |
| `addExpense(details)` | Adds an expense and returns it as an `Expense`. |
| `recordPayment({ from, to, amount })` | Records a payment one member has already made to another. |
| `getBalances()` | Returns a `Map` from member name to `Money`. A positive balance means the member has paid more than their share. |
| `getSettlementPlan()` | Returns a `SettlementPlan` with the transfers that settle the group. |

`addExpense` takes an object:

| Field | Required | Description |
| --- | --- | --- |
| `description` | yes | What the expense was for. |
| `paidBy` | yes | The member who paid. |
| `amount` | yes | The amount in kronor, as a positive number. |
| `participants` | no | The members who share the cost. Defaults to every member. |
| `exactAmounts` | no | An exact amount per member, for example `{ Anna: 100, Bo: 150 }`. The amounts must add up to `amount`, and the members listed become the participants. |

### Expense

`getDescription()`, `getPaidBy()`, `getAmount()`, `getParticipants()` and `getShares()`, where
`getShares()` returns a `Map` from participant name to the `Money` that person owes for the expense.

### SettlementPlan

`getTransfers()`, `getTransferCount()` and `getTransfersFrom(name)`.

### Transfer

`getFrom()`, `getTo()`, `getAmount()` and `toString()`, which gives `'Bo pays Anna 150.00 kr'`.

### Money

Amounts are `Money` objects, stored as whole öre so that arithmetic stays exact. `getKronor()` gives
a number you can display, `getOre()` gives the exact integer. `isZero()`, `isNegative()` and
`isLessThan(otherAmount)` answer questions about an amount, which is handy for checking whether a
member is even or owes money. `Money` is immutable: `add`, `subtract` and `allocate` return new
objects instead of changing the existing one.

## Errors

The module throws an `Error` instead of failing silently when it is used incorrectly:

- A member name is empty, or already used in the group.
- The payer or a participant is not a member.
- The amount is not a positive number.
- The exact amounts do not add up to the total.

## Rounding

Amounts are rounded to the nearest öre. When an amount cannot be split evenly, the leftover öre are
given to the first participants, and the payer is placed first. `100 kr` split three ways becomes
`33.34`, `33.33` and `33.33`, so the parts always add up to the original amount.

## Development

```bash
npm install
npm test          # run the tests in watch mode
npm run test:run  # run them once
npm run lint
```

See [TEST_REPORT.md](TEST_REPORT.md) for what is tested and how.

## Contributing

Bug reports and suggestions are welcome as
[issues](https://github.com/edvinkaradzas/split-ledger/issues).

## License

Released into the public domain under [the Unlicense](LICENSE).
