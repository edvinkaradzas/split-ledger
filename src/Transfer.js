/** @typedef {import('./Money.js').Money} Money */

/**
 * Represents a single payment that settles part of a debt: who pays whom, and how much.
 */
export class Transfer {
  #from
  #to
  #amount

  /**
   * Creates a new transfer.
   *
   * @param {object} details - The details of the transfer.
   * @param {string} details.from - The name of the member who pays.
   * @param {string} details.to - The name of the member who receives the payment.
   * @param {Money} details.amount - The amount to pay.
   */
  constructor({ from, to, amount }) {
    this.#from = from
    this.#to = to
    this.#amount = amount
  }

  /**
   * Gets the member who pays.
   *
   * @returns {string} The name of the payer.
   */
  getFrom() {
    return this.#from
  }

  /**
   * Gets the member who receives the payment.
   *
   * @returns {string} The name of the receiver.
   */
  getTo() {
    return this.#to
  }

  /**
   * Gets the amount to pay.
   *
   * @returns {Money} The amount.
   */
  getAmount() {
    return this.#amount
  }

  /**
   * Describes the transfer in a readable way.
   *
   * @returns {string} For example 'Bo pays Anna 150.00 kr'.
   */
  toString() {
    return `${this.#from} pays ${this.#to} ${this.#amount.getKronor().toFixed(2)} kr`
  }
}
