/**
 * Apart from the exported `keyEvent` function, all the code in this file is
 * derived from the `@ember/test-helpers` package, converted from TS to JS, and
 * the `fireEvent`, `__triggerKeyEvent__`, and `triggerKeyEvent` functions modified
 * to return the Event object (or a Promise<Event> in the case of `triggerKeyEvent`).
 */

import { assign } from '@ember/polyfills';
import { find, settled } from '@ember/test-helpers';

const DEFAULT_EVENT_OPTIONS = { bubbles: true, cancelable: true };

const DEFAULT_MODIFIERS = Object.freeze({
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
});

const FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];

const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

// This is not a comprehensive list, but it is better than nothing.
const keyFromKeyCode = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'v',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'Meta',
  93: 'Meta', // There is two keys that map to meta,
  187: '=',
  189: '-',
};

function isWindow(target) {
  return target instanceof Window;
}

function isDocument(target) {
  return target.nodeType === Node.DOCUMENT_NODE;
}

function isFormControl(element) {
  return (
    !isWindow(element) &&
    !isDocument(element) &&
    FORM_CONTROL_TAGS.indexOf(element.tagName) > -1 &&
    element.type !== 'hidden'
  );
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(Number(n));
}

function isKeyboardEventType(eventType) {
  return KEYBOARD_EVENT_TYPES.includes(eventType);
}

function buildBasicEvent(type, options = {}) {
  let event = document.createEvent('Events');

  let bubbles = options.bubbles !== undefined ? options.bubbles : true;
  let cancelable = options.cancelable !== undefined ? options.cancelable : true;

  delete options.bubbles;
  delete options.cancelable;

  // bubbles and cancelable are readonly, so they can be
  // set when initializing event
  event.initEvent(type, bubbles, cancelable);
  assign(event, options);
  return event;
}

function buildKeyboardEvent(type, options = {}) {
  let eventOpts = assign({}, DEFAULT_EVENT_OPTIONS, options);
  let event;
  let eventMethodName;

  try {
    event = new KeyboardEvent(type, eventOpts);

    // Property definitions are required for B/C for keyboard event usage
    // If this properties are not defined, when listening for key events
    // keyCode/which will be 0. Also, keyCode and which now are string
    // and if app compare it with === with integer key definitions,
    // there will be a fail.
    //
    // https://w3c.github.io/uievents/#interface-keyboardevent
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
    Object.defineProperty(event, 'keyCode', {
      get() {
        return parseInt(eventOpts.keyCode);
      },
    });

    Object.defineProperty(event, 'which', {
      get() {
        return parseInt(eventOpts.which);
      },
    });

    return event;
  } catch (e) {
    // left intentionally blank
  }

  try {
    event = document.createEvent('KeyboardEvents');
    eventMethodName = 'initKeyboardEvent';
  } catch (e) {
    // left intentionally blank
  }

  if (!event) {
    try {
      event = document.createEvent('KeyEvents');
      eventMethodName = 'initKeyEvent';
    } catch (e) {
      // left intentionally blank
    }
  }

  if (event && eventMethodName) {
    event[eventMethodName](
      type,
      eventOpts.bubbles,
      eventOpts.cancelable,
      window,
      eventOpts.ctrlKey,
      eventOpts.altKey,
      eventOpts.shiftKey,
      eventOpts.metaKey,
      eventOpts.keyCode,
      eventOpts.charCode
    );
  } else {
    event = buildBasicEvent(type, options);
  }

  return event;
}

function fireEvent(element, eventType, options = {}) {
  if (!element) {
    throw new Error('Must pass an element to `fireEvent`');
  }

  let event = buildKeyboardEvent(eventType, options);

  element.dispatchEvent(event);
  return event;
}

function keyFromKeyCodeAndModifiers(keycode, modifiers) {
  if (keycode > 64 && keycode < 91) {
    if (modifiers.shiftKey) {
      return String.fromCharCode(keycode);
    } else {
      return String.fromCharCode(keycode).toLocaleLowerCase();
    }
  }
  let key = keyFromKeyCode[keycode];
  if (key) {
    return key;
  }
}

function keyCodeFromKey(key) {
  let keys = Object.keys(keyFromKeyCode);
  let keyCode =
    keys.find((keyCode) => keyFromKeyCode[Number(keyCode)] === key) ||
    keys.find(
      (keyCode) => keyFromKeyCode[Number(keyCode)] === key.toLowerCase()
    );

  return keyCode !== undefined ? parseInt(keyCode) : undefined;
}

function __triggerKeyEvent__(
  element,
  eventType,
  key,
  modifiers = DEFAULT_MODIFIERS
) {
  let props;
  if (typeof key === 'number') {
    props = {
      keyCode: key,
      which: key,
      key: keyFromKeyCodeAndModifiers(key, modifiers),
    };
  } else if (typeof key === 'string' && key.length !== 0) {
    let firstCharacter = key[0];
    if (firstCharacter !== firstCharacter.toUpperCase()) {
      throw new Error(
        `Must provide a \`key\` to \`triggerKeyEvent\` that starts with an uppercase character but you passed \`${key}\`.`
      );
    }

    if (isNumeric(key) && key.length > 1) {
      throw new Error(
        `Must provide a numeric \`keyCode\` to \`triggerKeyEvent\` but you passed \`${key}\` as a string.`
      );
    }

    let keyCode = keyCodeFromKey(key);
    props = { keyCode, which: keyCode, key };
  } else {
    throw new Error(
      `Must provide a \`key\` or \`keyCode\` to \`triggerKeyEvent\``
    );
  }

  let options = assign(props, modifiers);

  return fireEvent(element, eventType, options);
}

async function triggerKeyEvent(
  target,
  eventType,
  key,
  modifiers = DEFAULT_MODIFIERS
) {
  if (!target) {
    throw new Error('Must pass an element or selector to `triggerKeyEvent`.');
  }

  let element = find(target);
  if (!element) {
    throw new Error(
      `Element not found when calling \`triggerKeyEvent('${target}', ...)\`.`
    );
  }

  if (!eventType) {
    throw new Error(`Must provide an \`eventType\` to \`triggerKeyEvent\``);
  }

  if (!isKeyboardEventType(eventType)) {
    let validEventTypes = KEYBOARD_EVENT_TYPES.join(', ');
    throw new Error(
      `Must provide an \`eventType\` of ${validEventTypes} to \`triggerKeyEvent\` but you passed \`${eventType}\`.`
    );
  }

  if (isFormControl(element) && element.disabled) {
    throw new Error(`Can not \`triggerKeyEvent\` on disabled ${element}`);
  }

  const event = __triggerKeyEvent__(element, eventType, key, modifiers);

  await settled();
  return event;
}

export default async function keyEvent(target, key, options) {
  let event = await triggerKeyEvent(target, 'keydown', key, options);
  if (event.defaultPrevented) return;
  event = await triggerKeyEvent(target, 'keypress', key, options);
  if (event.defaultPrevented) return;
  return triggerKeyEvent(target, 'keyup', key, options);
}
