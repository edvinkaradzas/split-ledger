import { Expense } from './Expense.js'

/**
 * Represents a group of people who share expenses, such as a trip or a household.
 */
export class ExpenseGroup {
  #members
  #name
  #expenses

  /**
   * Creates a new group without any members.
   *
   * @param {string} name - The name of the group, for example 'Åre 2026'.
   */
  constructor(name) {
    this.#name = name
    this.#members = []
    this.#expenses = []
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
   * @returns {Expense} The expense that was added.
   * @throws {Error} If the payer or a participant is not a member, or the amount is not positive.
   */
  addExpense(details) {
    const { description, paidBy, amount, participants } = details

    if (!this.#members.includes(paidBy)) {
      throw new Error(`Unknown member: ${paidBy}`)
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Amount must be a positive number. ${amount}`)
    }

    const splitBetween = participants ?? this.#members

    if (!splitBetween.every((name) => this.#members.includes(name))) {
      throw new Error('All participants must be members')
    }

    const expense = new Expense({ description, paidBy, amount, participants: splitBetween })

    this.#expenses.push(expense)

    return expense
  }
}
