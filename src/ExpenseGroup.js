export class ExpenseGroup {
  #members
  #expenses
  #name

  constructor(name) {
    this.#name = name
    this.#members = []
    this.#expenses = []
  }

  addMember(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('This is not a valid name.')
    }

    if (this.#members.includes(name)) {
      throw new Error('This name has already been used.')
    }
    this.#members.push(name)
  }

  getMembers() {}
}
