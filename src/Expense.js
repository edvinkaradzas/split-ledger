import { Money } from './Money.js'

/**
 * Represents a single expense: what it was, who paid for it and who shares the cost.
 */
export class Expense {
  #description
  #paidBy
  #amount
  #participants
  #exactAmounts

  /**
   * Creates a new expense.
   *
   * @param {object} details - The details of the expense.
   * @param {string} details.description - What the expense was for, for example 'Dinner'.
   * @param {string} details.paidBy - The name of the member who paid.
   * @param {number} details.amount - The amount in kronor.
   * @param {string[]} details.participants - The names of the members who share the cost.
   * @param {object} [details.exactAmounts] - Optional exact amount in kronor per participant.
   */
  constructor({ description, paidBy, amount, participants, exactAmounts }) {
    this.#description = description
    this.#paidBy = paidBy
    this.#amount = new Money(amount)
    this.#participants = [...participants]
    this.#exactAmounts = exactAmounts
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

  /**
   * Calculates what each participant owes for this expense.
   *
   * @returns {Map<string, Money>} One amount per participant. The payer gets any leftover öre.
   */
  getShares() {
    if (this.#exactAmounts) {
      return this.#exactShares()
    }

    return this.#equalShares()
  }

  /**
   * Builds the shares from the exact amounts given when the expense was created.
   *
   * @returns {Map<string, Money>} One amount per participant.
   */
  #exactShares() {
    const shares = new Map()

    for (const [name, shareAmount] of Object.entries(this.#exactAmounts)) {
      shares.set(name, new Money(shareAmount))
    }

    return shares
  }

  /**
   * Splits the amount equally between the participants.
   *
   * @returns {Map<string, Money>} One amount per participant, where the payer gets any leftover öre.
   */
  #equalShares() {
    const payerFirst = this.#participantsWithPayerFirst()
    const shareAmounts = this.#amount.allocate(payerFirst.length)
    const shares = new Map()

    for (let position = 0; position < payerFirst.length; position++) {
      shares.set(payerFirst[position], shareAmounts[position])
    }

    return shares
  }

  /**
   * Puts the payer first among the participants, so that the payer gets any leftover öre.
   *
   * @returns {string[]} The participants, with the payer first when the payer shares the cost.
   */
  #participantsWithPayerFirst() {
    const otherParticipants = this.#participants.filter((name) => name !== this.#paidBy)

    if (this.#participants.includes(this.#paidBy)) {
      return [this.#paidBy, ...otherParticipants]
    }

    return otherParticipants
  }
}
