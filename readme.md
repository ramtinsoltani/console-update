# Console Update

This module introduces a few new methods for the `console` object which allow logging and updating a line in the console.

# Installation

Install:
```
npm install console-update --save
```

Require:
```javascript
const consoleUpdate = require('console-update');
```

# API

After requiring the module, the following methods and properties are added to `console`:
- `template(string)`: Accepts a single string template. The template can contain handlebars with indexes to be replaced by the `update()` method. Example: `First Argument: {{0}}, Second Argument: {{1}}`.
- `update()`: Accepts any number of arguments, converts them to string, and then inserts them into the defined template by their index, and finally updates the line.
- `close()`: Closes the current line. Any future updates would create a new line first instead of updating the closed line. This method must be called before calling `console.log()` and is meant to be used to indicate the end of updates for the current line.
- `chaining`: A read-only boolean. Set it to true to allow chaining the `template()`, `update()`, `close()`, and `log()` methods. It defaults to `false`.

The `consoleUpdate` object contains the following constants:
- `DEFAULT_TEMPLATE`: Holds the default template. It can be used to set the current template to the default: `console.template(consoleUpdate.DEFAULT_TEMPLATE);`.

# Example

```javascript
const consoleUpdate = require('console-update');

console.chaining = true;

console
  .template('Loading {{0}}%')
  .update(5)    // Loading 5%
  .update(50)   // Loading 50%
  .update(75)   // Loading 75%
  .update(100)  // Loading 100%
  .close()
  .log('Loading finished!');
```
