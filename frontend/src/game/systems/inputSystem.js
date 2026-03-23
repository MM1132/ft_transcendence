// handle keyboard input and turns it into game actions
const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right'
};

export function attachInputListeners(state) {
  function handleKeyDown(event) {
    const direction = KEY_TO_DIRECTION[event.key];

    if (!direction) {
      return;
    }

    event.preventDefault();
    state.debug.lastInput = direction;
  }

  window.addEventListener('keydown', handleKeyDown);

  return function detachInputListeners() {
    window.removeEventListener('keydown', handleKeyDown);
  };
}