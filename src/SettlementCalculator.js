import { Money } from './Money.js'
import { SettlementPlan } from './SettlementPlan.js'
import { Transfer } from './Transfer.js'

/**
 * Works out which payments settle a group's debts, given the balance of every member.
 */
export class SettlementCalculator {
  #balances

  /**
   * Creates a calculator for one set of balances.
   *
   * @param {Map<string, Money>} balances - One balance per member, as returned by ExpenseGroup.
   */
  constructor(balances) {
    this.#balances = balances
  }

  /**
   * Works out who should pay whom to make everyone even, keeping the number of transfers down.
   *
   * Members who owe money are matched against members who are owed money, and each transfer settles
   * as much as possible. A group of n members therefore needs at most n - 1 transfers.
   *
   * @returns {SettlementPlan} A plan with the transfers that settle the group.
   */
  getPlan() {
    const debtors = this.#debtorsFrom()
    const creditors = this.#creditorsFrom()
    const transfers = []

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0]
      const creditor = creditors[0]
      const amount = this.#smallestOf(debtor.amount, creditor.amount)

      transfers.push(new Transfer({ from: debtor.name, to: creditor.name, amount }))
      debtor.amount = debtor.amount.subtract(amount)
      creditor.amount = creditor.amount.subtract(amount)

      this.#removeSettled(debtors, creditors)
    }

    return new SettlementPlan(transfers)
  }

  /**
   * Finds the members who owe money.
   *
   * @returns {object[]} One entry per member who owes money, with the debt as a positive amount.
   */
  #debtorsFrom() {
    const debtors = []

    for (const [name, balance] of this.#balances) {
      if (balance.isNegative()) {
        debtors.push({ name, amount: new Money(0).subtract(balance) })
      }
    }

    return debtors
  }

  /**
   * Finds the members who are owed money.
   *
   * @returns {object[]} One entry per member who is owed money.
   */
  #creditorsFrom() {
    const creditors = []

    for (const [name, balance] of this.#balances) {
      if (!balance.isNegative() && !balance.isZero()) {
        creditors.push({ name, amount: balance })
      }
    }

    return creditors
  }

  /**
   * Picks the smaller of two amounts.
   *
   * @param {Money} amount - The first amount.
   * @param {Money} otherAmount - The second amount.
   * @returns {Money} The smaller amount, or otherAmount when they are equal.
   */
  #smallestOf(amount, otherAmount) {
    if (amount.isLessThan(otherAmount)) {
      return amount
    }

    return otherAmount
  }

  /**
   * Removes the members who have nothing left to pay or receive.
   *
   * @param {object[]} debtors - The members who still owe money.
   * @param {object[]} creditors - The members who are still owed money.
   */
  #removeSettled(debtors, creditors) {
    if (debtors[0].amount.isZero()) {
      debtors.shift()
    }
    if (creditors[0].amount.isZero()) {
      creditors.shift()
    }
  }
}
