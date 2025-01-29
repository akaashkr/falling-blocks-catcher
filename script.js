const gameArea = document.getElementById('gameArea');
        const basket = document.getElementById('basket');
        const scoreDisplay = document.getElementById('score');
        const livesDisplay = document.getElementById('lives');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const finalScore = document.getElementById('finalScore');

        let score = 0;
        let lives = 3;
        let gameInterval;
        let blockInterval;

        document.addEventListener('keydown', moveBasket);

        function moveBasket(e) {
            const basketRect = basket.getBoundingClientRect();
            const areaRect = gameArea.getBoundingClientRect();

            if (e.key === 'ArrowLeft' || e.key === 'a') {
                if (basketRect.left > areaRect.left) {
                    basket.style.left = `${basket.offsetLeft - 20}px`;
                }
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                if (basketRect.right < areaRect.right) {
                    basket.style.left = `${basket.offsetLeft + 20}px`;
                }
            }
        }

        function createBlock() {
            const block = document.createElement('div');
            const isGoodBlock = Math.random() > 0.5;
            block.classList.add('block');
            block.classList.add(isGoodBlock ? 'goodBlock' : 'badBlock');
            block.style.left = `${Math.random() * (gameArea.clientWidth - 20)}px`;
            block.style.top = '0px';
            gameArea.appendChild(block);

            let fallInterval = setInterval(() => {
                const blockRect = block.getBoundingClientRect();
                const basketRect = basket.getBoundingClientRect();
                const areaRect = gameArea.getBoundingClientRect();

                if (blockRect.top > areaRect.bottom) {
                    clearInterval(fallInterval);
                    block.remove();
                } else if (
                    blockRect.bottom >= basketRect.top &&
                    blockRect.left < basketRect.right &&
                    blockRect.right > basketRect.left
                ) {
                    clearInterval(fallInterval);
                    block.remove();

                    if (isGoodBlock) {
                        score++;
                        scoreDisplay.textContent = `Score: ${score}`;
                    } else {
                        lives--;
                        livesDisplay.textContent = `Lives: ${lives}`;
                        if (lives === 0) {
                            endGame();
                        }
                    }
                } else {
                    block.style.top = `${block.offsetTop + 5}px`;
                }
            }, 30);
        }

        function startGame() {
            score = 0;
            lives = 3;
            scoreDisplay.textContent = `Score: ${score}`;
            livesDisplay.textContent = `Lives: ${lives}`;
            gameOverScreen.style.visibility = 'hidden';

            gameInterval = setInterval(() => {
                createBlock();
            }, 1000);
        }

        function endGame() {
            clearInterval(gameInterval);
            document.querySelectorAll('.block').forEach(block => block.remove());
            gameOverScreen.style.visibility = 'visible';
            finalScore.textContent = `Final Score: ${score}`;
        }

        startGame();