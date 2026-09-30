import { describe, it, expect } from 'vitest'
import { ExpenseGroup } from '../src/ExpenseGroup.js'

/**
 * Creates a group with the given members, to keep the tests short.
 *
 * @param {string[]} names - The members to add.
 * @returns {ExpenseGroup} A group with the members added.
 */
function groupWith(names) {
  const trip = new ExpenseGroup('Åre')
  for (const name of names) {
    trip.addMember(name)
  }

  return trip
}

/**
 * Adds up every balance in a group.
 *
 * @param {ExpenseGroup} trip - The group to sum.
 * @returns {number} The sum of all balances, in öre.
 */
function sumOfBalances(trip) {
  let total = 0
  for (const [, balance] of trip.getBalances()) {
    total += balance.getOre()
  }

  return total
}

describe('getBalances', () => {
  it('gives the payer a positive balance and the others a negative one', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])

    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 900 })

    expect(trip.getBalances().get('Anna').getKronor()).toBe(600)
    expect(trip.getBalances().get('Bo').getKronor()).toBe(-300)
    expect(trip.getBalances().get('Cia').getKronor()).toBe(-300)
  })

  it('adds up several expenses', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])

    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 900 })
    trip.addExpense({ description: 'Taxi', paidBy: 'Bo', amount: 300 })

    expect(trip.getBalances().get('Anna').getKronor()).toBe(500)
    expect(trip.getBalances().get('Bo').getKronor()).toBe(-100)
    expect(trip.getBalances().get('Cia').getKronor()).toBe(-400)
  })

  it('always adds up to zero', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia', 'Dan'])

    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 100 })
    trip.addExpense({ description: 'Taxi', paidBy: 'Bo', amount: 33.33 })
    trip.addExpense({ description: 'Cabin', paidBy: 'Cia', amount: 500, participants: ['Cia', 'Dan'] })

    expect(sumOfBalances(trip)).toBe(0)
  })

  it('gives a member without any expenses a balance of zero', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(trip.getBalances().get('Anna').isZero()).toBe(true)
    expect(trip.getBalances().get('Bo').isZero()).toBe(true)
  })
})

describe('getSettlementPlan', () => {
  it('settles the group so that everyone is even', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])
    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 900 })
    trip.addExpense({ description: 'Taxi', paidBy: 'Bo', amount: 300 })

    const plan = trip.getSettlementPlan()

    for (const transfer of plan.getTransfers()) {
      trip.addExpense({
        description: 'Settlement',
        paidBy: transfer.getFrom(),
        amount: transfer.getAmount().getKronor(),
        participants: [transfer.getTo()],
      })
    }

    for (const [, balance] of trip.getBalances()) {
      expect(balance.isZero()).toBe(true)
    }
  })

  it('needs at most one transfer less than the number of members', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia', 'Dan', 'Eva'])
    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 500 })
    trip.addExpense({ description: 'Taxi', paidBy: 'Bo', amount: 250 })
    trip.addExpense({ description: 'Tickets', paidBy: 'Cia', amount: 125 })

    const plan = trip.getSettlementPlan()

    expect(plan.getTransferCount()).toBeLessThanOrEqual(4)
  })

  it('returns an empty plan when nobody owes anything', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(trip.getSettlementPlan().getTransferCount()).toBe(0)
  })

  it('lists the transfers a single member has to pay', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])
    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 900 })

    const plan = trip.getSettlementPlan()

    expect(plan.getTransfersFrom('Bo')).toHaveLength(1)
    expect(plan.getTransfersFrom('Anna')).toHaveLength(0)
  })
})

describe('getShares', () => {
  it('gives the extra öre to the payer', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])

    const expense = trip.addExpense({ description: 'Dinner', paidBy: 'Bo', amount: 100 })

    expect(expense.getShares().get('Bo').getOre()).toBe(3334)
    expect(expense.getShares().get('Anna').getOre()).toBe(3333)
    expect(expense.getShares().get('Cia').getOre()).toBe(3333)
  })

  it('does not give a share to members outside the expense', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])

    const expense = trip.addExpense({
      description: 'Cabin',
      paidBy: 'Anna',
      amount: 500,
      participants: ['Anna', 'Bo'],
    })

    expect(expense.getShares().has('Cia')).toBe(false)
    expect(trip.getBalances().get('Cia').isZero()).toBe(true)
  })

  it('uses the exact amounts when they are given', () => {
    const trip = groupWith(['Anna', 'Bo', 'Cia'])

    trip.addExpense({
      description: 'Dinner',
      paidBy: 'Anna',
      amount: 450,
      exactAmounts: { Anna: 100, Bo: 150, Cia: 200 },
    })

    expect(trip.getBalances().get('Anna').getKronor()).toBe(350)
    expect(trip.getBalances().get('Bo').getKronor()).toBe(-150)
    expect(trip.getBalances().get('Cia').getKronor()).toBe(-200)
  })
})

describe('addExpense', () => {
  it('throws when the exact amounts do not add up to the total', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(() =>
      trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 150, exactAmounts: { Anna: 50, Bo: 99 } })
    ).toThrow()
  })

  it('throws when the payer is not a member', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(() => trip.addExpense({ description: 'Dinner', paidBy: 'Dan', amount: 150 })).toThrow()
  })

  it('throws when the amount is not positive', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(() => trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 0 })).toThrow()
  })

  it('throws when a participant is not a member', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(() =>
      trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 150, participants: ['Anna', 'Dan'] })
    ).toThrow()
  })
})

describe('recordPayment', () => {
  it('evens out the balances when a debt is paid', () => {
    const trip = groupWith(['Anna', 'Bo'])
    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 200 })

    trip.recordPayment({ from: 'Bo', to: 'Anna', amount: 100 })

    expect(trip.getBalances().get('Anna').isZero()).toBe(true)
    expect(trip.getBalances().get('Bo').isZero()).toBe(true)
  })

  it('throws when a member is unknown', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(() => trip.recordPayment({ from: 'Dan', to: 'Anna', amount: 100 })).toThrow()
  })

  it('throws when the amount is not positive', () => {
    const trip = groupWith(['Anna', 'Bo'])

    expect(() => trip.recordPayment({ from: 'Bo', to: 'Anna', amount: -50 })).toThrow()
  })
})

describe('Transfer', () => {
  it('describes itself in a readable way', () => {
    const trip = groupWith(['Anna', 'Bo'])
    trip.addExpense({ description: 'Dinner', paidBy: 'Anna', amount: 300 })

    const transfer = trip.getSettlementPlan().getTransfers()[0]

    expect(String(transfer)).toBe('Bo pays Anna 150.00 kr')
  })
})
