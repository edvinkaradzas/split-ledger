import { Money } from './Money.js'

export class Expense {
  #description
  #paidBy
  #amount
  #participants

  constructor({ description, paidBy, amount, participants }) {
    this.#description = description
    this.#paidBy = paidBy
    this.#amount = new Money(amount)
    this.#participants = [...participants]
  }

  getDescription() {
    return this.#description
  }

  getPaidBy() {
    return this.#paidBy
  }

  getAmount() {
    return this.#amount
  }

  getParticipants() {
    return this.#participants
  }
}
