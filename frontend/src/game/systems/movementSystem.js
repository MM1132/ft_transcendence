// move snakes according to direction and tick.

function getNextHeadPosition(head, direction) {
  switch (direction) {
    case 'up':
      return { x: head.x, y: head.y - 1 };
    case 'down':
      return { x: head.x, y: head.y + 1 };
    case 'left':
      return { x: head.x - 1, y: head.y };
    case 'right':
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
}

function isOppositeDirection(currentDirection, nextDirection) {
  return (
    (currentDirection === 'up' && nextDirection === 'down') ||
    (currentDirection === 'down' && nextDirection === 'up') ||
    (currentDirection === 'left' && nextDirection === 'right') ||
    (currentDirection === 'right' && nextDirection === 'left')
  );
}

export function moveSnakeOneStep(state) {
  const snake = state.snakes[0];

  if (!snake || !snake.alive) {
    return;
  }

  if (
    snake.pendingDirection &&
    !isOppositeDirection(snake.direction, snake.pendingDirection)
  ) {
    snake.direction = snake.pendingDirection;
  }

  const currentHead = snake.segments[0];
  const nextHead = getNextHeadPosition(currentHead, snake.direction);

  const newSegments = [nextHead, ...snake.segments.slice(0, -1)];
  snake.segments = newSegments;
}