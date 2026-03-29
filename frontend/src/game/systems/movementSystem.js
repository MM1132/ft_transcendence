// move snakes according to direction and tick.

import {
  checkWallCollision,
  checkFoodCollision,
  respawnFood
} from './collisionSystem.js';

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

  if (!snake || !snake.alive || state.status === 'game_over') {
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
  const ateFood = checkFoodCollision(nextHead, state.food);

  let newSegments;

  if (ateFood) {
    newSegments = [nextHead, ...snake.segments];
  } else {
    newSegments = [nextHead, ...snake.segments.slice(0, -1)];
  }

  if (checkWallCollision(nextHead, state.board)) {
    snake.alive = false;
    state.status = 'game_over';
    return;
  }

  const hitSelf = newSegments
    .slice(1)
    .some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (hitSelf) {
    snake.alive = false;
    state.status = 'game_over';
    return;
  }

  snake.segments = newSegments;

  if (ateFood) {
    state.scores[snake.id] += 1;
    respawnFood(state);
  }
}