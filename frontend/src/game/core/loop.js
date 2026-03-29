// render loop - maybe tick accumulation - start/stop/pause
// orchestrate the logic (not contain)

export function createGameLoop({ update, render }) {
  let animationFrameId = null;
  let running = false;
  let previousTimestamp = 0;

  function frame(timestamp) {
    if (!running) {
      return;
    }

    const deltaTime = previousTimestamp === 0 ? 0 : timestamp - previousTimestamp;
    previousTimestamp = timestamp;

    if (typeof update === 'function') {
      update(deltaTime, timestamp);
    }

    if (typeof render === 'function') {
      render();
    }

    animationFrameId = window.requestAnimationFrame(frame);
  }

  function start() {
    if (running) {
      return;
    }

    running = true;
    previousTimestamp = 0;
    animationFrameId = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;

    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  return {
    start,
    stop
  };
}