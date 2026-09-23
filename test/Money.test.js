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
    const coffe = new Money(24.5)
    const dinner = new Money(199.9)

    const difference = coffe.subtract(dinner)

    expect(difference.getKronor()).toBe(-175.4)
  })
})
