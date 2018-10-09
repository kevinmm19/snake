'use strict';
(function game() {
    const SNAKE_COLOR = 'turquoise';
    const SNAKE_BORDER_COLOR = 'darkgreen';
    const FOOD_COLOR = 'pink';
    const FOOD_BORDER_COLOR = 'magenta';
    const CANVAS_BORDER_COLOR = 'lime';
    const CANVAS_BACKGROUND_COLOR = 'steelblue';
    const TIME = 50;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    let px = 10;
    let py = 0;
    let score = 0;
    let foodX = 0;
    let foodY = 0;
    let newDirection = false;
    let snake = [
        {x: 50, y: 20},
        {x: 40, y: 20},
        {x: 30, y: 20},
        {x: 20, y: 20},
        {x: 10, y: 20}
    ];
    const canvas = document.querySelector('.js-canvas');
    const ctx = canvas.getContext('2d');

    let random = function (max) {
        return Math.round((Math.random() * max) / 10) * 10;
    };
    
    let generateFood = function () {
        foodX = random(canvas.width - 10);
        foodY = random(canvas.height - 10);
        snake.forEach(function checkFoodPosition(pos) {
            const invalidPosition = pos.x === foodX && pos.y === foodY;
            if (invalidPosition) {
                generateFood();
            }
        });
    };

    let drawFood = function () {
        ctx.fillStyle = FOOD_COLOR;
        ctx.strokestyle = FOOD_BORDER_COLOR;
        ctx.fillRect(foodX, foodY, 10, 10);
        ctx.strokeRect(foodX, foodY, 10, 10);
    };

    let drawCanvas = function () {
        ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
        ctx.strokestyle = CANVAS_BORDER_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };
    
    let drawSnake = function () {
        snake.forEach(drawSnakePiece);
    };
    
    let drawSnakePiece = function (piece) {
        ctx.fillStyle = SNAKE_COLOR;
        ctx.strokestyle = SNAKE_BORDER_COLOR;
        ctx.fillRect(piece.x, piece.y, 10, 10);
        ctx.strokeRect(piece.x, piece.y, 10, 10);
    };
    
    let updateDirection = function (evt) {
        if (newDirection) {
            return;
        }
        newDirection = true;
        const keyCode = evt.keyCode;
        const up = py === -10;
        const down = py === 10;
        const right = px === 10;
        const left = px === -10;
        if (keyCode === UP_KEY && !down) {
            px = 0;
            py = -10;
        }
        if (keyCode === DOWN_KEY && !up) {
            px = 0;
            py = 10;
        }
        if (keyCode === RIGHT_KEY && !left) {
            px = 10;
            py = 0;
        }
        if (keyCode === LEFT_KEY && !right) {
            px = -10;
            py = 0;
        }
    };

    let moveSnake = function () {
        const head = {x: snake[0].x + px, y: snake[0].y + py};
        snake.unshift(head);
        const ate = snake[0].x === foodX && snake[0].y === foodY;
        if (ate) {
            score += 10;
            document.querySelector('.js-score').innerHTML = score;
            generateFood();
        } else {
            snake.pop();
        }
    };

    let lost = function () {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }
        const topBorder = snake[0].y < 0;
        const bttmBorder = snake[0].y > canvas.height - 10;
        const leftBorder = snake[0].x < 0;
        const rightBorder = snake[0].x > canvas.width - 10;
        return leftBorder || rightBorder || topBorder || bttmBorder;
    };

    let play = function () {
        if (lost()) {
            document.querySelector('.js-score').innerHTML = 'Final Score: ' + score + '<br><br>Please refresh the page to play again.';
            return;
        }
        setTimeout(function tick() {
            newDirection = false;
            drawCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            play();
        }, TIME);
    };

    let init = function () {
        play();
        generateFood();
        document.addEventListener('keydown', updateDirection);
    };

    init();
}());
