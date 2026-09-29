/** @typedef {import('./Transfer.js').Transfer} Transfer */

/**
 * Represents a plan for settling a group's debts: who should pay whom, and how much.
 */
export class SettlementPlan {
  #transfers

  /**
   * Creates a new plan.
   *
   * @param {Transfer[]} transfers - The transfers that settle the group.
   */
  constructor(transfers) {
    this.#transfers = [...transfers]
  }

  /**
   * Gets every transfer in the plan.
   *
   * @returns {Transfer[]} A copy of the transfers.
   */
  getTransfers() {
    return [...this.#transfers]
  }

  /**
   * Gets how many transfers are needed to settle the group.
   *
   * @returns {number} The number of transfers.
   */
  getTransferCount() {
    return this.#transfers.length
  }

  /**
   * Gets the transfers a single member has to pay.
   *
   * @param {string} name - The name of the member.
   * @returns {Transfer[]} The transfers where the member is the payer, or an empty array if there are none.
   */
  getTransfersFrom(name) {
    return this.#transfers.filter((transfer) => transfer.getFrom() === name)
  }
}
