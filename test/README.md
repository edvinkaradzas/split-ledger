# Integration Tests

This directory holds integration and system-level tests — flows that exercise
the application end-to-end (e.g. spawning `src/app.js` as a subprocess and
asserting on its output), as opposed to the unit tests colocated with the
source files in `src/` (e.g. `src/app.test.js`).

Vitest picks up any `*.test.js` file here automatically; there is no separate
configuration needed. Delete this file once real tests are added.
