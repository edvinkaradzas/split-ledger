/**
 * Represents a group of people who share expenses, such as a trip or a household.
 */
export class ExpenseGroup {
  #members
  #name

  /**
   * Creates a new group without any members.
   *
   * @param {string} name - The name of the group, for example 'Åre 2026'.
   */
  constructor(name) {
    this.#name = name
    this.#members = []
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
}
