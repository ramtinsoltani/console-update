const readline = require('readline');

let ConsoleUpdate = function() {

  // Top-level reference
  let that = this;

  // Helpers (hidden)
  // Define a hidden helper to create hidden properties
  Object.defineProperty(this, '__hiddenProperty', {

    writable: false,
    enumerable: false,
    configurable: false,
    value: (key, value) => {

      Object.defineProperty(this, key, {

        value: value,
        writable: true,
        configurable: false,
        enumerable: false

      });

    }

  });

  // Use the __hiddenProperty helper to define other hidden helpers
  this.__hiddenProperty('__readOnlyProperty', (key, value) => {

    Object.defineProperty(this, key, {

      value: value,
      writable: false,
      enumerable: true,
      configurable: false

    })

  });
  this.__hiddenProperty('__buildString', input => {

    let output = this.__template;

    input.forEach((string, index) => {

      output = output.replace(`{{${index}}}`, string);

    });

    output = output.replace(/{{\d+}}/g, '');

    return output;

  });
  this.__hiddenProperty('__updateChaining', () => {

    if ( this.__chaining ) {

      console.log = (...args) => {

        that.__originalLog.call(console, ...args);

        return console;

      };

    }
    else {

      console.log = this.__originalLog;

    }

  });

  // Properties (hidden)
  this.__hiddenProperty('__template', '{{0}}');
  this.__hiddenProperty('__new', true);
  this.__hiddenProperty('__chaining', false);
  this.__hiddenProperty('__originalLog', console.log);

  // Constants (visible)
  this.__readOnlyProperty('DEFAULT_TEMPLATE', '{{0}}');

  // Interface (added to console)
  // Define console.chaining in a way so changes apply to console.log right away
  Object.defineProperty(console, 'chaining', {

    configurable: false,
    enumerable: true,
    get: function() { return that.__chaining },
    set: function(newValue) {

      // Only accepting boolean values
      that.__chaining = typeof newValue === 'boolean' ? newValue : that.__chaining;

      // Update the console.log chaining based on the __chaining value
      that.__updateChaining();

    }

  });

  console.close = () => {

    this.__new = true;
    process.stdout.write('\n');

    if ( this.__chaining ) return console;

  };

  console.update = (...args) => {

    if ( ! args.length ) return;

    let strings = [];

    args.forEach(arg => {

      strings.push(arg + '');

    });

    if ( ! this.__new ) {

      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

    }
    else {

      this.__new = false;

    }

    process.stdout.write(this.__buildString(strings));

    if ( this.__chaining ) return console;

  };

  console.template = template => {

    if ( typeof template !== 'string' ) return;

    this.__template = template;

    if ( this.__chaining ) return console;

  };

};

module.exports = new ConsoleUpdate();
