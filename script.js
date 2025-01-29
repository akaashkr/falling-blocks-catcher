const gameArea = document.getElementById('gameArea');
        const basket = document.getElementById('basket');
        const scoreDisplay = document.getElementById('score');
        const livesDisplay = document.getElementById('lives');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const finalScore = document.getElementById('finalScore');

        let score = 0;
        let lives = 3;
        let blocks = [];
        let gameRunning = true;

        document.addEventListener('keydown', moveBasket);

        function moveBasket(e) {
            const basketRect = basket.getBoundingClientRect();
            const areaRect = gameArea.getBoundingClientRect();

            if ((e.key === 'ArrowLeft' || e.key === 'a') && basketRect.left > areaRect.left) {
                basket.style.left = `${Math.max(0, basket.offsetLeft - 20)}px`;
            } else if ((e.key === 'ArrowRight' || e.key === 'd') && basketRect.right < areaRect.right) {
                basket.style.left = `${Math.min(gameArea.clientWidth - basket.clientWidth, basket.offsetLeft + 20)}px`;
            }
        }

        function createBlock() {
            const block = document.createElement('div');
            const isGoodBlock = Math.random() > 0.5;
            block.classList.add('block', isGoodBlock ? 'goodBlock' : 'badBlock');
            block.style.left = `${Math.random() * (gameArea.clientWidth - 20)}px`;
            block.style.top = '0px';
            gameArea.appendChild(block);
            blocks.push({ element: block, isGood: isGoodBlock, speed: 2 + score * 0.1 });
        }

        function updateBlocks() {
            blocks.forEach((block, index) => {
                if (!gameRunning) return;

                const blockRect = block.element.getBoundingClientRect();
                const basketRect = basket.getBoundingClientRect();
                const areaRect = gameArea.getBoundingClientRect();

                if (blockRect.top > areaRect.bottom) {
                    block.element.remove();
                    blocks.splice(index, 1);
                } else if (
                    blockRect.bottom >= basketRect.top &&
                    blockRect.left < basketRect.right &&
                    blockRect.right > basketRect.left
                ) {
                    block.element.remove();
                    blocks.splice(index, 1);
                    
                    if (block.isGood) {
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
                    block.element.style.top = `${block.element.offsetTop + block.speed}px`;
                }
            });
            if (gameRunning) {
                requestAnimationFrame(updateBlocks);
            }
        }

        function startGame() {
            score = 0;
            lives = 3;
            gameRunning = true;
            scoreDisplay.textContent = `Score: ${score}`;
            livesDisplay.textContent = `Lives: ${lives}`;
            gameOverScreen.style.visibility = 'hidden';
            blocks.forEach(block => block.element.remove());
            blocks = [];
            
            setInterval(createBlock, 1000);
            requestAnimationFrame(updateBlocks);
        }

        function endGame() {
            gameRunning = false;
            gameOverScreen.style.visibility = 'visible';
            finalScore.textContent = `Final Score: ${score}`;
        }

        startGame();