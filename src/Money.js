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
   * @param {Money} other - The amount to add.
   * @returns {Money} A new amount, the sum of the two.
   */
  add(other) {
    const sum = this.#ore + other.#ore

    return new Money(sum / 100)
  }

  /**
   * Subtracts another amount from this one.
   *
   * @param {Money} other - The amount to subtract.
   * @returns {Money} A new amount, the difference of the two.
   */
  subtract(other) {
    const difference = this.#ore - other.#ore

    return new Money(difference / 100)
  }

  /**
   * Splits the amount into a number of parts.
   *
   * @param {number} parts - The number of parts to split into.
   * @returns {Money[]} One amount per part, where the first parts get any leftover öre.
   */
  allocate(parts) {
    const base = Math.floor(this.#ore / parts)
    const rest = this.#ore % parts
    const shares = []

    for (let i = 0; i < parts; i++) {
      let shareInOre = base
      if (i < rest) {
        shareInOre = shareInOre + 1
      }
      shares.push(new Money(shareInOre / 100))
    }
    return shares
  }
}
