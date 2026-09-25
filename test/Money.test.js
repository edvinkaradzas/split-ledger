import { describe, it, expect } from 'vitest'
import { Money } from '../src/Money.js'

describe('constructor', () => {
  it('converts kronor to öre', () => {
    expect(new Money(199.9).getOre()).toBe(19990)
  })
})

describe('add', () => {
  it('adds two amounts', () => {
    const price = new Money(199.9)
    const shipping = new Money(24.5)

    const total = price.add(shipping)

    expect(total.getKronor()).toBe(224.4)
  })

  it('adds without floating point errors', () => {
    const tenOre = new Money(0.1)
    const twentyOre = new Money(0.2)

    const total = tenOre.add(twentyOre)

    expect(total.getOre()).toBe(30)
  })

  it('does not change the original amount', () => {
    const price = new Money(100)

    price.add(new Money(50))

    expect(price.getOre()).toBe(10000)
  })
})

describe('subtract', () => {
  it('subtracts two amounts', () => {
    const price = new Money(199.9)
    const shipping = new Money(24.5)

    const total = price.subtract(shipping)

    expect(total.getKronor()).toBe(175.4)
  })

  it('subtracts without floating point errors', () => {
    const fortyOre = new Money(0.4)
    const twentyOre = new Money(0.2)

    const total = fortyOre.subtract(twentyOre)

    expect(total.getOre()).toBe(20)
  })

  it('returns a negative amount when subtracting a larger amount', () => {
    const coffee = new Money(24.5)
    const dinner = new Money(199.9)

    const difference = coffee.subtract(dinner)

    expect(difference.getKronor()).toBe(-175.4)
  })
})

describe('allocate', () => {
  it('splits an amount evenly when divided equally', () => {
    const shares = new Money(900).allocate(3)

    expect(shares.map((share) => share.getKronor())).toEqual([300, 300, 300])
  })

  it('gives the extra öre to the first parts', () => {
    const shares = new Money(100).allocate(3)

    expect(shares.map((share) => share.getOre())).toEqual([3334, 3333, 3333])
  })

  it('always adds up to the original amount', () => {
    for (const parts of [2, 3, 6, 7]) {
      const shares = new Money(100).allocate(parts)
      const total = shares.reduce((sum, share) => sum + share.getOre(), 0)

      expect(total).toBe(10000)
    }
  })
})
