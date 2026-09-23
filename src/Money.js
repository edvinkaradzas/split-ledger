/**
 * Represents an amount of money, stored as whole öre to avoid floating point errror.
 */
export class Money {
  #ore

  /**
   * Creates a new amount.
   *
   * @param {number} amount - The amount in kronor, for example 199.90.
   */
  constructor(amount) {
    this.#ore = Math.round(amount * 100)
  }

  /**
   * Gets the amount in öre.
   *
   * @returns {number} The amount as whole number of öre.
   */
  getOre() {
    return this.#ore
  }

  /**
   * Gets the amount in kronor.
   *
   * @returns {number} The amount in kronor, for example 199.90
   */
  getKronor() {
    return this.#ore / 100
  }
}
