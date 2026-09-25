import { describe, it, expect } from 'vitest'
import { ExpenseGroup } from '../src/ExpenseGroup.js'

describe('addMember', () => {
  it('adds a member to the group', () => {
    const trip = new ExpenseGroup('Åre')

    trip.addMember('Anna')

    expect(trip.getMembers()).toEqual(['Anna'])
  })

  it('throws when the name is empty', () => {
    const trip = new ExpenseGroup('Åre')

    expect(() => trip.addMember('   ')).toThrow('This is not a valid name')
  })

  it('throws when the name is already used', () => {
    const trip = new ExpenseGroup('Åre')
    trip.addMember('Anna')

    expect(() => trip.addMember('Anna')).toThrow('already been used')
  })
})

describe('getMembers', () => {
  it('returns a copy that cannot change the group', () => {
    const trip = new ExpenseGroup('Åre')
    trip.addMember('Anna')

    trip.getMembers().push('Hacker')

    expect(trip.getMembers()).toEqual(['Anna'])
  })
})
