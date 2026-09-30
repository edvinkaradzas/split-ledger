# Test Report

## Summary

I tested the module with unit tests written in [Vitest](https://vitest.dev), which comes with the
course template. I chose automated tests because nothing in the module is random: there are no
dates, no network calls and no randomness, so the same input always gives the same result. That
means I can run all the tests with one command and get the same answer every time.

I only test through the public interface, the same methods someone else would use. This turned out
to be useful when I refactored the code at the end: I split several long methods into smaller
private ones, and the tests still passed, which showed me that I had not changed the behaviour.

The tests are of three kinds:

1. **Result tests** check a known input against a known output, for example that 900 kr split
   between three members gives each of them a balance of −300 kr.
2. **Invariant tests** check things that must always be true, no matter the input: all balances add
   up to exactly zero, the parts of a split add up to the original amount, and applying a settlement
   plan leaves everyone even.
3. **Error tests** check that wrong use throws an error instead of failing silently. Every `throw`
   in the public interface has a test.

To run the tests you need Node.js 24.12.0 or later (I used v24.21.0):

```bash
git clone https://github.com/edvinkaradzas/laboration-2.git
cd laboration-2
npm install
npm run test:run
```

The tests also run on every push through GitHub Actions, together with ESLint and Prettier, see
[.github/workflows/ci.yml](.github/workflows/ci.yml).

**Last run (2026-09-30, Node v24.21.0): all 33 tests passed in 3 test files.**

```
 Test Files  3 passed (3)
      Tests  33 passed (33)
   Duration  164ms
```

There are some things I did not test. The one-line getters `getName()`, `getDescription()`,
`getParticipants()` and `getTo()` have no tests of their own, since they only return a value and
most of them are used by the other tests anyway. `Money` does not check its own input, so
`new Money('hello')` and `allocate(0)` are not handled and not tested — all validation of user input
happens in `ExpenseGroup` instead. I have no coverage tool installed, so the list below comes from
going through the public interface by hand, not from a measured percentage.

## Test Results

| What was tested | How it was tested | Result |
| ---------------- | ------------------ | ------- |
| `new Money(amount)` converts kronor to whole öre. | Automated unit test (Vitest): created `new Money(199.9)` and checked that `getOre()` returned `19990`. | ✅ Passed. |
| `Money.add()` and `Money.subtract()` are exact, without floating point errors. | Automated unit tests: added `0.1 + 0.2` and compared the result in öre to `30` — the case where ordinary decimal numbers give `0.30000000000000004`. | ✅ Passed. |
| `Money.add()` does not change the original amount. | Automated unit test: saved the amount in öre, called `add()` and discarded the result, then checked that the original was unchanged. | ✅ Passed. |
| `Money.subtract()` can return a negative amount, which is how debts are represented. | Automated unit test: subtracted 199.90 kr from 24.50 kr and expected −175.40 kr. | ✅ Passed. |
| `Money.allocate()` splits an amount evenly when it divides equally. | Automated unit test: split 900 kr into 3 parts and expected 300 kr each. | ✅ Passed. |
| `Money.allocate()` gives the leftover öre to the first parts. | Automated unit test: split 100 kr into 3 parts and expected `[3334, 3333, 3333]` in öre. | ✅ Passed. |
| **Invariant:** the parts of a split always add up to the original amount. | Automated unit test: split 100 kr into 2, 3, 6 and 7 parts and checked that the sum was exactly 10000 öre every time. | ✅ Passed. |
| `addMember()` adds a member, and rejects empty or duplicate names. | Three automated unit tests: added a member and read it back, then expected `addMember('   ')` and a repeated name to throw. | ✅ Passed. |
| `getMembers()` returns a copy that cannot be used to change the group. | Automated unit test: called `push()` on the returned array and checked that the group was unchanged. | ✅ Passed. |
| `getBalances()` gives the payer a positive balance and the participants a negative one. | Automated unit test: one expense of 900 kr paid by Anna and split between three members, expecting +600, −300 and −300. | ✅ Passed. |
| `getBalances()` adds up several expenses. | Automated unit test: two expenses with different payers, expecting +500, −100 and −400. | ✅ Passed. |
| **Invariant:** all balances always add up to exactly zero. | Automated unit test: three expenses, including the uneven amount 33.33 kr and one shared by only two of four members, then summed every balance in öre and expected 0. | ✅ Passed. |
| A member without any expenses has a balance of zero. | Automated unit test: created a group with members but no expenses and checked `isZero()`. | ✅ Passed. |
| **Invariant:** applying the settlement plan leaves everyone even. | Automated unit test: built a plan, registered each of its transfers as an expense paid to the receiver, then checked that every balance was zero. | ✅ Passed. |
| The settlement plan needs at most n−1 transfers for n members. | Automated unit test: five members and three expenses, expecting at most 4 transfers. | ✅ Passed. |
| A group where nobody owes anything gives an empty plan. | Automated unit test: group with members but no expenses, expecting `getTransferCount()` to be 0. | ✅ Passed. |
| `getTransfersFrom()` returns only the transfers a given member has to pay. | Automated unit test: expected one transfer for the debtor and none for the creditor. | ✅ Passed. |
| `getShares()` gives the leftover öre to the payer. | Automated unit test: 100 kr paid by Bo and split between three members, expecting Bo to owe 33.34 kr and the others 33.33 kr. | ✅ Passed. |
| Members outside an expense get no share of it. | Automated unit test: an expense shared by two of three members, checking that the third had no share and a balance of zero. | ✅ Passed. |
| `exactAmounts` splits an expense by exact amounts per member. | Automated unit test: 450 kr paid by Anna with `{ Anna: 100, Bo: 150, Cia: 200 }`, expecting balances +350, −150 and −200. | ✅ Passed. |
| `addExpense()` rejects exact amounts that do not add up to the total. | Automated unit test: expected `{ Anna: 50, Bo: 99 }` for a total of 150 kr to throw. | ✅ Passed. |
| `addExpense()` rejects an unknown payer, a non-positive amount and an unknown participant. | Three automated unit tests, one per case, each expecting an error. | ✅ Passed. |
| `recordPayment()` evens out the balances when a debt is paid. | Automated unit test: one expense of 200 kr, then a payment of 100 kr from the debtor, expecting both balances to be zero. | ✅ Passed. |
| `recordPayment()` rejects an unknown member and a non-positive amount. | Two automated unit tests, each expecting an error. | ✅ Passed. |
| `Transfer.toString()` describes the transfer in a readable way. | Automated unit test: built a plan from a 300 kr expense and expected the string `'Bo pays Anna 150.00 kr'`. | ✅ Passed. |
