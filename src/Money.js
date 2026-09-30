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
   * @returns {number} The amount in kronor, for example 199.90.
   */
  getKronor() {
    return this.#ore / 100
  }

  /**
   * Adds another amount to this one.
   *
   * @param {Money} otherAmount - The amount to add.
   * @returns {Money} A new amount, the sum of the two.
   */
  add(otherAmount) {
    const sum = this.#ore + otherAmount.#ore

    return new Money(sum / 100)
  }

  /**
   * Subtracts another amount from this one.
   *
   * @param {Money} otherAmount - The amount to subtract.
   * @returns {Money} A new amount, the difference of the two.
   */
  subtract(otherAmount) {
    const difference = this.#ore - otherAmount.#ore

    return new Money(difference / 100)
  }

  /**
   * Splits the amount into a number of parts.
   *
   * @param {number} partCount - The number of parts to split into.
   * @returns {Money[]} One amount per part, where the first parts get any leftover öre.
   */
  allocate(partCount) {
    const baseShare = Math.floor(this.#ore / partCount)
    const leftoverOre = this.#ore % partCount
    const shares = []

    for (let position = 0; position < partCount; position++) {
      const extraOre = position < leftoverOre ? 1 : 0

      shares.push(new Money((baseShare + extraOre) / 100))
    }

    return shares
  }

  /**
   * Checks whether this amount is smaller than another amount.
   *
   * @param {Money} otherAmount - The amount to compare with.
   * @returns {boolean} True if this amount is strictly smaller than the other one.
   */
  isLessThan(otherAmount) {
    return this.#ore < otherAmount.getOre()
  }

  /**
   * Checks whether the amount is below zero, which means a debt.
   *
   * @returns {boolean} True if the amount is negative.
   */
  isNegative() {
    return this.#ore < 0
  }

  /**
   * Checks whether the amount is exactly zero.
   *
   * @returns {boolean} True if nothing is owed and nothing is due.
   */
  isZero() {
    return this.#ore === 0
  }
}
