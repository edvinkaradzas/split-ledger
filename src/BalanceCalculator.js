import { Money } from './Money.js'

/** @typedef {import('./Expense.js').Expense} Expense */

/**
 * Works out what every member of a group has paid compared to what they have used.
 */
export class BalanceCalculator {
  #members
  #expenses
  #payments

  /**
   * Creates a calculator for one group's records.
   *
   * @param {object} records - The records to calculate from.
   * @param {string[]} records.members - The names of the members.
   * @param {Expense[]} records.expenses - The expenses of the group.
   * @param {object[]} records.payments - The payments that have already been made.
   */
  constructor({ members, expenses, payments }) {
    this.#members = members
    this.#expenses = expenses
    this.#payments = payments
  }

  /**
   * Calculates the balance of every member: what they have paid minus what they have used.
   *
   * A positive balance means the member has paid more than their share, a negative balance means
   * they owe money. All balances always add up to zero.
   *
   * @returns {Map<string, Money>} One balance per member.
   */
  getBalances() {
    const balances = this.#startingBalances()

    for (const expense of this.#expenses) {
      this.#applyExpense(balances, expense)
    }
    for (const payment of this.#payments) {
      this.#applyPayment(balances, payment)
    }

    return balances
  }

  /**
   * Creates a balance of zero for every member.
   *
   * @returns {Map<string, Money>} One balance per member, all of them zero.
   */
  #startingBalances() {
    const balances = new Map()

    for (const member of this.#members) {
      balances.set(member, new Money(0))
    }

    return balances
  }

  /**
   * Adds an expense to the balances: the payer is credited the whole amount, and every participant
   * is charged their share.
   *
   * @param {Map<string, Money>} balances - The balances to update.
   * @param {Expense} expense - The expense to apply.
   */
  #applyExpense(balances, expense) {
    const payer = expense.getPaidBy()
    balances.set(payer, balances.get(payer).add(expense.getAmount()))

    for (const [name, share] of expense.getShares()) {
      balances.set(name, balances.get(name).subtract(share))
    }
  }

  /**
   * Adds a payment to the balances: the member who paid is credited, the receiver is charged.
   *
   * @param {Map<string, Money>} balances - The balances to update.
   * @param {object} payment - The payment to apply.
   */
  #applyPayment(balances, payment) {
    balances.set(payment.from, balances.get(payment.from).add(payment.amount))
    balances.set(payment.to, balances.get(payment.to).subtract(payment.amount))
  }
}
