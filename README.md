# Global Cinema

A laravel app for students to enter film screenings and save them to a project database (and for instructors to verify that they have done so).

## Getting Started

To set up a development environment, clone this repository and then run `sh ./setup.sh` in the project directory (this will require appropriate php, npm, and composer versions). Once that script has finished building the project, you can serve the site with the command, `php artisan serve`.

`setup.sh` will seed the development database with dummy data, including users. The following are sample user credentials to view the site from the perspective of different user types:

| Role        | Username    | email                   | Password |
| ----------- | ----------- | ----------------------- | -------- |
| admin       | admin       | admin@example.com       | password |
| student     | student     | student@example.com     | password |
| instructor  | instructor  | instructor@example.com  | password |
| contributor | contributor | contributor@example.com | password |

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
