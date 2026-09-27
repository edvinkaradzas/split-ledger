import { Money } from './Money.js'

/**
 * Represents a single expense: what it was, who paid for it and who shares the cost.
 */
export class Expense {
  #description
  #paidBy
  #amount
  #participants

  /**
   * Creates a new expense.
   *
   * @param {object} details - The details of the expense.
   * @param {string} details.description - What the expense was for, for example 'Dinner'.
   * @param {string} details.paidBy - The name of the member who paid.
   * @param {number} details.amount - The amount in kronor.
   * @param {string[]} details.participants - The names of the members who share the cost.
   */
  constructor({ description, paidBy, amount, participants }) {
    this.#description = description
    this.#paidBy = paidBy
    this.#amount = new Money(amount)
    this.#participants = [...participants]
  }

  /**
   * Gets what the expense was for.
   *
   * @returns {string} The description.
   */
  getDescription() {
    return this.#description
  }

  /**
   * Gets the member who paid.
   *
   * @returns {string} The name of the payer.
   */
  getPaidBy() {
    return this.#paidBy
  }

  /**
   * Gets the total amount of the expense.
   *
   * @returns {Money} The amount, as a Money object.
   */
  getAmount() {
    return this.#amount
  }

  /**
   * Gets the members who share the cost.
   *
   * @returns {string[]} A copy of the participant names.
   */
  getParticipants() {
    return [...this.#participants]
  }
}
