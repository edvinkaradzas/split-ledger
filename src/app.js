#!/usr/bin/env node

/**
 * Extracts the name argument from the command line.
 *
 * @example
 * parseArgs(['Ada Lovelace']) // Returns 'Ada Lovelace'
 * parseArgs([]) // Returns undefined
 * @param {string[]} argv - Command-line arguments, excluding the node
 *   executable and script path (i.e. `process.argv.slice(2)`).
 * @returns {string|undefined} The first positional argument, if any.
 */
export function parseArgs(argv) {
  return argv[0]
}

/**
 * Generates a formatted greeting message.
 *
 * @example
 * generateGreeting('Ada Lovelace') // Returns 'Hello, Ada Lovelace!'
 * generateGreeting(123) // Returns 'Hello, Guest!'
 * @param {string} [name='Brian Kernighan'] - The name of the person to greet.
 * @returns {string} The complete greeting message.
 */
export function generateGreeting(name = 'Brian Kernighan') {
  // Guard clause: Handle missing or invalid types strictly to ensure predictable behavior
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Hello, Guest!'
  }

  return `Hello, ${name}!`
}

/**
 * Execution entry point.
 */
function main() {
  console.log('🚀 CLI Application is up and running!')
  console.log("Edit src/app.js and run 'npm start' to see your changes.")

  try {
    const name = parseArgs(process.argv.slice(2))
    const greeting = generateGreeting(name)
    console.log(`\nMessage of the day: ${greeting}`)
  } catch (error) {
    console.error('An unexpected error occurred during execution:', error.message)
    process.exitCode = 1
  }
}

main()
