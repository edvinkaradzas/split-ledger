import { describe, it, expect } from 'vitest'
import { generateGreeting, parseArgs } from './app.js'

describe('parseArgs()', () => {
  it('should return the first positional argument', () => {
    expect(parseArgs(['Ada Lovelace'])).toBe('Ada Lovelace')
  })

  it('should return undefined when no arguments are given', () => {
    expect(parseArgs([])).toBeUndefined()
  })
})

describe('generateGreeting()', () => {
  it('should return a personalized greeting when a valid name is provided', () => {
    const result = generateGreeting('Ada Lovelace')
    expect(result).toBe('Hello, Ada Lovelace!')
  })

  it('should return a greeting for Brian Kernighan when no argument is passed', () => {
    const result = generateGreeting()
    expect(result).toBe('Hello, Brian Kernighan!')
  })

  it('should return a guest greeting when the input is an empty or blank string', () => {
    // Testing edge cases handled by name.trim()
    expect(generateGreeting('')).toBe('Hello, Guest!')
    expect(generateGreeting('   ')).toBe('Hello, Guest!')
  })

  it('should return a guest greeting when the input is not a string data type', () => {
    expect(generateGreeting(123)).toBe('Hello, Guest!')
    expect(generateGreeting(null)).toBe('Hello, Guest!')
    expect(generateGreeting(true)).toBe('Hello, Guest!')
  })
})
