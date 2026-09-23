# split-ledger

A JavaScript module for splitting shared expenses in a group and figuring out who should pay whom.

## What it does

* Keeps track of members and expenses in a group.
* Splits an expense equally, by exact amounts, by percentage or by shares -- mix freely between expenses.
* Calculates in whole Öre (1/100 of a Swedish Krona) internally, so no money is lost or created when an amount is split three ways.
Calculates each member's balance: what they paid compared to what they used.
* Creates a settlement plan: who pays whom, using as few transfers as possible.

## What it does not do

* Store data.
* Move any money.
* Provide a user interface.

## Example

<!-- Kodexempel på hur man använder modulen -->
