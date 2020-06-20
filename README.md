# CWL 207

A laravel app for uploading film screenings

## Contributing

If you are going to contribute to the project's codebase, please familiarize yourself with existing code and follow the guidelines outlined below. Also make sure to run eslint and prettier before committing new code.

### Naming conventions

The following are some guidelines for variable naming. The list is non-exhaustive and does not include _necessary_ formatting rules, like the fact that React components must be in pascal case (`SomeComplicatedComponent`). Prettier will also enforce best practices in formatting frontend code, and plugins like vscode's CS-Fixer and Intelephense are recommended to keep backend code consistent as well.

#### General principles

Arrays are plural: `const names = ['Matt', 'Rini']`
Booleans begin with 'is,' 'are,' or 'has': `const isValid = true` and `const hasFocus = false`
Prefer verbs for function names: `const validate = year => 1900 <= year && year <= new Date().getFullYear()` and `sendEmail()`

##### Language-specific conventions

TypeScript interfaces are not I-prefixed or otherwise distinguished from proper classes
Function names in backend tests should be snake case and form (mostly) complete sentences (`guests_can_register()` or `admins_can_alter_user_privileges()`)
Functions and variables in Laravel code should generally be camel case (`camelCaseVariable`)
React component files should have the same name as the component inside.
