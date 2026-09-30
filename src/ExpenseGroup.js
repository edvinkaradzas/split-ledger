import { Expense } from './Expense.js'
import { Money } from './Money.js'
import { SettlementPlan } from './SettlementPlan.js'
import { Transfer } from './Transfer.js'

/**
 * Represents a group of people who share expenses, such as a trip or a household.
 */
export class ExpenseGroup {
  #members
  #name
  #expenses
  #payments

  /**
   * Creates a new group without any members.
   *
   * @param {string} name - The name of the group, for example 'Åre 2026'.
   */
  constructor(name) {
    this.#name = name
    this.#members = []
    this.#expenses = []
    this.#payments = []
  }

  /**
   * Adds a member to the group.
   *
   * @param {string} name - The name of the member. Must be unique within the group.
   * @throws {Error} If the name is empty or already used by another member.
   */
  addMember(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('This is not a valid name.')
    }

    if (this.#members.includes(name)) {
      throw new Error('This name has already been used.')
    }
    this.#members.push(name)
  }

  /**
   * Gets the members of the group.
   *
   * @returns {string[]} A copy of the member names, in the order they were added.
   */
  getMembers() {
    return [...this.#members]
  }

  /**
   * Gets the name of the group.
   *
   * @returns {string} The name given when the group was created.
   */
  getName() {
    return this.#name
  }

  /**
   * Adds an expense to the group.
   *
   * @param {object} details - The details of the expense.
   * @param {string} details.description - What the expense was for, for example 'Dinner'.
   * @param {string} details.paidBy - The name of the member who paid.
   * @param {number} details.amount - The amount in kronor. Must be a positive number.
   * @param {string[]} [details.participants] - The members who share the cost. Defaults to every member.
   * @param {object} [details.exactAmounts] - The amount in kronor per member, when the cost is not
   *   shared equally. The amounts must add up to the total, and the members listed become the
   *   participants.
   * @returns {Expense} The expense that was added.
   * @throws {Error} If the payer or a participant is not a member, the amount is not positive, or the
   *   exact amounts do not add up to the total.
   */
  addExpense(details) {
    const { description, paidBy, amount, participants, exactAmounts } = details
    const splitBetween = exactAmounts ? Object.keys(exactAmounts) : (participants ?? this.#members)

    this.#validateExpense({ paidBy, amount, splitBetween, exactAmounts })

    const expense = new Expense({ description, paidBy, amount, participants: splitBetween, exactAmounts })

    this.#expenses.push(expense)

    return expense
  }

  /**
   * Checks that an expense can be added to the group.
   *
   * @param {object} details - The expense to check.
   * @param {string} details.paidBy - The member who paid.
   * @param {number} details.amount - The amount in kronor.
   * @param {string[]} details.splitBetween - The members who share the cost.
   * @param {object} [details.exactAmounts] - The exact amount per member, when there is one.
   * @throws {Error} If the payer or a participant is unknown, the amount is not positive, or the
   *   exact amounts do not add up to the total.
   */
  #validateExpense({ paidBy, amount, splitBetween, exactAmounts }) {
    if (!this.#members.includes(paidBy)) {
      throw new Error(`Unknown member: ${paidBy}`)
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Amount must be a positive number. ${amount}`)
    }
    if (!splitBetween.every((name) => this.#members.includes(name))) {
      throw new Error('All participants must be members')
    }
    if (exactAmounts && !this.#addsUpTo(exactAmounts, amount)) {
      throw new Error(`The exact amounts must add up to ${amount}`)
    }
  }

  /**
   * Checks whether a set of exact amounts adds up to a total, compared in whole öre so that the
   * comparison is exact.
   *
   * @param {object} exactAmounts - The amount per member, in kronor.
   * @param {number} total - The total the amounts must add up to, in kronor.
   * @returns {boolean} True if the amounts add up to the total.
   */
  #addsUpTo(exactAmounts, total) {
    let sum = new Money(0)

    for (const shareAmount of Object.values(exactAmounts)) {
      sum = sum.add(new Money(shareAmount))
    }

    return sum.getOre() === new Money(total).getOre()
  }

  /**
   * Records a payment that one member has already made to another, for example a Swish payment.
   *
   * @param {object} payment - The payment.
   * @param {string} payment.from - The member who paid.
   * @param {string} payment.to - The member who received the money.
   * @param {number} payment.amount - The amount in kronor. Must be a positive number.
   * @throws {Error} If either member is unknown, or the amount is not positive.
   */
  recordPayment({ from, to, amount }) {
    if (!this.#members.includes(from)) {
      throw new Error(`Unknown member: ${from}`)
    }
    if (!this.#members.includes(to)) {
      throw new Error(`Unknown member: ${to}`)
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Amount must be a positive number. ${amount}`)
    }
    this.#payments.push({ from, to, amount: new Money(amount) })
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

  /**
   * Works out who should pay whom to make everyone even, keeping the number of transfers down.
   *
   * Members who owe money are matched against members who are owed money, and each transfer settles
   * as much as possible. A group of n members therefore needs at most n - 1 transfers.
   *
   * @returns {SettlementPlan} A plan with the transfers that settle the group.
   */
  getSettlementPlan() {
    const balances = this.getBalances()
    const debtors = this.#debtorsFrom(balances)
    const creditors = this.#creditorsFrom(balances)
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
   * Finds the members who owe money.
   *
   * @param {Map<string, Money>} balances - The balances of the group.
   * @returns {object[]} One entry per member who owes money, with the debt as a positive amount.
   */
  #debtorsFrom(balances) {
    const debtors = []

    for (const [name, balance] of balances) {
      if (balance.isNegative()) {
        debtors.push({ name, amount: new Money(0).subtract(balance) })
      }
    }

    return debtors
  }

  /**
   * Finds the members who are owed money.
   *
   * @param {Map<string, Money>} balances - The balances of the group.
   * @returns {object[]} One entry per member who is owed money.
   */
  #creditorsFrom(balances) {
    const creditors = []

    for (const [name, balance] of balances) {
      if (!balance.isNegative() && !balance.isZero()) {
        creditors.push({ name, amount: balance })
      }
    }

    return creditors
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
