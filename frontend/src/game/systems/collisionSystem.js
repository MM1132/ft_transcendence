// check - wall hit - self hit

function isOutOfBounds(position, board) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= board.cols ||
    position.y >= board.rows
  );
}

function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isPositionOnSnake(position, snake, { ignoreHead = false } = {}) {
  const segmentsToCheck = ignoreHead ? snake.segments.slice(1) : snake.segments;

  return segmentsToCheck.some((segment) => positionsEqual(segment, position));
}

function getRandomGridPosition(board) {
  return {
    x: Math.floor(Math.random() * board.cols),
    y: Math.floor(Math.random() * board.rows)
  };
}

// function getFreeFoodPosition(board, snakes) {
//   let position = getRandomGridPosition(board);

//   while (snakes.some((snake) => isPositionOnSnake(position, snake))) {
//     position = getRandomGridPosition(board);
//   }

//   return position;
// }

// not loop for ever
function getFreeFoodPosition(board, snakes) {
  const maxAttempts = 100;

  for (let i = 0; i < maxAttempts; i++) {
    const position = getRandomGridPosition(board);

    const collision = snakes.some((snake) =>
      snake.segments.some((seg) => seg.x === position.x && seg.y === position.y)
    );

    if (!collision) return position;
  }

  // * fallback not perfect though
  return { x: 0, y: 0 };
}

export function checkWallCollision(position, board) {
  return isOutOfBounds(position, board);
}

export function checkSelfCollision(position, snake) {
  return isPositionOnSnake(position, snake, { ignoreHead: false });
}

export function checkFoodCollision(position, food) {
  if (!food) {
    return false;
  }

  return positionsEqual(position, food);
}

export function respawnFood(state) {
  state.food = getFreeFoodPosition(state.board, state.snakes);
}