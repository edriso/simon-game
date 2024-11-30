const title = document.getElementById('level-title');

const gameState = {
    name: 'Simon Game',
    colors: [
        'red',
        'green',
        'blue',
        'yellow',
    ],
    sequence: [],
    playerSequence: [],
    round: 0,
    score: 0,
    playerTurn: false,
    started: false,
    ended: false,

    getTitle() {
        if (this.ended) {
            return `Game Over! Your score is ${this.score}, \n Press Any Key to Restart`;
        }
        if (!this.started) {
            return 'Simon Game';
        }
        if (this.started && !this.ended) {
            return `Round ${this.round}`;
        }
        return 'Press Any Key to Start';
    },

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    },

    getColorSound(color) {
        return new Audio(`assets/sounds/${color}.mp3`);
    },

    resetGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.score = 0;
        this.playerTurn = false;
        this.started = false;
        this.ended = false;
    },

    startGame() {
        this.started = true;
        this.nextRound();
    },

    nextRound() {
        this.round += 1;
        this.playerSequence = [];
        this.sequence.push(this.getRandomColor());
        this.playSequence();
        
        title.textContent = gameState.getTitle();
    },

    playSequence() {
        this.playerTurn = false;
        this.sequence.forEach((color, index) => {
            setTimeout(() => {
                this.flashColor(color);
            }, 1000 * index);
        });
        setTimeout(() => {
            this.playerTurn = true;
        }, 1000 * this.sequence.length);
    },

    flashColor(color) {
        const colorSound = this.getColorSound(color);
        colorSound.play();
        document.getElementById(color).classList.add('pressed');
        setTimeout(() => {
            document.getElementById(color).classList.remove('pressed');
        }, 500);
    },

    playerClick(color) {
        if (this.playerTurn) {
            this.playerSequence.push(color);
            this.flashColor(color);
            if (this.playerSequence.length === this.sequence.length) {
                this.checkSequence();
            }
        }
    },

    checkSequence() {
        for (let i = 0; i < this.sequence.length; i += 1) {
            if (this.sequence[i] !== this.playerSequence[i]) {
                this.endGame();
                return;
            }
        }
        this.score += 1;
        this.nextRound();
    },

    endGame() {
        this.ended = true;
        title.textContent = gameState.getTitle();
        
        const wrongSound = new Audio('assets/sounds/wrong.mp3');
        wrongSound.play();
        document.body.classList.add('game-over');
        setTimeout(() => {
            document.body.classList.remove('game-over');
        }, 500);

        this.resetGame();
    },
};

function createColorButtons() {
    const container = document.querySelector('.container');
    const colors = gameState.colors;

    container.innerHTML = '';

    // Create a row for each pair of colors (2 per row)
    for (let i = 0; i < colors.length; i += 2) {
        const row = document.createElement('div');
        row.className = 'row';

        // Create and append two buttons to the row
        for (let j = 0; j < 2; j++) {
            if (colors[i + j]) {
                const button = document.createElement('div');
                button.type = 'button';
                button.id = colors[i + j];
                button.className = `btn ${colors[i + j]}`;
                row.appendChild(button);
            }
        }
        container.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createColorButtons();
    const startButton = document.getElementById('level-title');
    const colors = document.getElementsByClassName('btn');

    startButton.addEventListener('click', () => {
        if(!gameState.started || gameState.ended) {
            gameState.startGame();
        } else {
            gameState.resetGame();
        }
    });

    if(colors.length) {
        for (const color of colors) {
            color.addEventListener('click', () => {
                gameState.playerClick(color.id);
            });
        }
    }

    document.addEventListener('keydown', (event) => {
        if (!gameState.started || gameState.ended) {
            gameState.startGame();
        }
    });
});
