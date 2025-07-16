let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};
updateScoreElement();
let isAutoPlaying = false;
let intervalId;

let resetBtn = document.querySelector('.js-auto-play');

// Visual Effects System
class VisualEffects {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Create particles for win/loss effects
  createParticles(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
        size: Math.random() * 4 + 2,
        color: color
      });
    }
  }

  // Create confetti for big wins
  createConfetti(count = 50) {
    const colors = ['#d4af37', '#4CAF50', '#2196F3', '#FF9800', '#E91E63'];

    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: 1
      });
    }
  }

  // Animate particles and confetti
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Animate particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Animate confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const piece = this.confetti[i];

      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.rotationSpeed;
      piece.vy += 0.1; // gravity

      if (piece.y > this.canvas.height + 10) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(piece.x, piece.y);
      this.ctx.rotate(piece.rotation * Math.PI / 180);
      this.ctx.fillStyle = piece.color;
      this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }

  // Button click effect
  buttonClickEffect(button) {
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    this.createParticles(x, y, '#d4af37', 10);
  }

  // Win effect
  winEffect() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.createParticles(centerX, centerY, '#4CAF50', 30);

    // Add confetti for big wins
    if (Math.random() < 0.3) { // 30% chance for confetti
      this.createConfetti(30);
    }
  }

  // Loss effect
  lossEffect() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.createParticles(centerX, centerY, '#e41818', 20);
  }
}

// Initialize visual effects
const visualEffects = new VisualEffects();

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
      playGame(playerMove);
    }, 1000);
    resetBtn.innerHTML = "Stop";
    isAutoPlaying = true;
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    resetBtn.innerHTML = "Auto-Play";
  }
}

// Event listeners
document.querySelector('.js-rock-button').addEventListener('click', () => {
  playGame('rock');
});

document.querySelector('.js-paper-button').addEventListener('click', () => {
  playGame('paper');
});

document.querySelector('.js-scissors-button').addEventListener('click', () => {
  playGame('scissors');
});

document.querySelector('.js-reset-score').addEventListener('click', () => {
  resetScore();
});

document.querySelector('.js-auto-play').addEventListener('click', () => {
  autoPlay();
});

// Add click effects to move buttons
document.querySelectorAll('.move-button').forEach(button => {
  button.addEventListener('click', () => {
    visualEffects.buttonClickEffect(button);
  });
});

document.body.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.key.toLowerCase() === 'r') {
    playGame('rock');
  } else if (event.key.toLowerCase() === 'p') {
    playGame('paper');
  } else if (event.key.toLowerCase() === 's') {
    playGame('scissors');
  } else if (event.key.toLowerCase() === 'a') {
    autoPlay();
  } else if (event.key === 'Backspace') {
    resetScore();
  }
});

// Enhanced playGame function with visual effects
function playGame(playerMove) {
  console.log('Game played with:', playerMove);
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'scissors') {
    if (computerMove === 'rock') {
      result = 'You lose.';
    } else if (computerMove === 'paper') {
      result = 'You win.';
    } else if (computerMove === 'scissors') {
      result = 'Tie.';
    }
  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') {
      result = 'You win.';
    } else if (computerMove === 'paper') {
      result = 'Tie.';
    } else if (computerMove === 'scissors') {
      result = 'You lose.';
    }
  } else if (playerMove === 'rock') {
    if (computerMove === 'rock') {
      result = 'Tie.';
    } else if (computerMove === 'paper') {
      result = 'You lose.';
    } else if (computerMove === 'scissors') {
      result = 'You win.';
    }
  }

  if (result === 'You win.') {
    score.wins += 1;
    visualEffects.winEffect(); // Add win effect
  } else if (result === 'You lose.') {
    score.losses += 1;
    visualEffects.lossEffect(); // Add loss effect
  } else if (result === 'Tie.') {
    score.ties += 1;
  }

  localStorage.setItem('score', JSON.stringify(score));

  const historyResult = result === 'You win.' ? 'win' : result === 'You lose.' ? 'loss' : 'tie';
  addToHistory(playerMove, computerMove, historyResult);

  updateScoreElement();

  // Enhanced result display
  const resultElement = document.querySelector('.js-result');
  resultElement.innerHTML = result;
  resultElement.className = 'js-result result'; // Reset classes

  if (result === 'You win.') {
    resultElement.classList.add('win');
    // Check for big win (5+ win streak)
    if (currentStreak >= 5 && streakType === 'win') {
      resultElement.classList.add('big-win');
      visualEffects.createConfetti(50);
    }
  } else if (result === 'You lose.') {
    resultElement.classList.add('lose');
  }

  document.querySelector('.js-moves').innerHTML = ` You
    <img src="./images/${playerMove}-emoji.png" alt="${playerMove}" class="move-icon" data-move="${playerMove}" data-player="true">
    <img src="./images/${computerMove}-emoji.png" alt="${computerMove}" class="move-icon" data-move="${computerMove}" data-player="false">
    computer`;

  setTimeout(() => {
    const moveElements = document.querySelectorAll('.js-moves .move-icon');

    if (moveElements.length === 2) {
      const playerMoveEl = moveElements[0];
      const computerMoveEl = moveElements[1];

      playerMoveEl.classList.add(`animate-${playerMove}`);
      computerMoveEl.classList.add(`animate-${computerMove}`);

      if (result === 'You win.') {
        playerMoveEl.classList.add('animate-win', 'winner', 'glowing');
        computerMoveEl.classList.add('animate-lose', 'loser');
      } else if (result === 'You lose.') {
        playerMoveEl.classList.add('animate-lose', 'loser');
        computerMoveEl.classList.add('animate-win', 'winner', 'glowing');
      }
    }
  }, 100);
}

function updateScoreElement() {
  document.getElementById('win-count').textContent = score.wins;
  document.getElementById('tie-count').textContent = score.ties;
  document.getElementById('loss-count').textContent = score.losses;
}

function pickComputerMove() {
  const randomNumber = Math.random();
  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}

function resetScore() {
  const modal = document.getElementById('reset-modal');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';

  const closeModal = () => modal.style.display = 'none';

  document.getElementById('confirm-reset').onclick = () => {
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;

    resetGame();
    localStorage.removeItem('score');
    updateScoreElement();
    closeModal();
  };

  document.getElementById('cancel-reset').onclick = closeModal;
}

// Theme toggle functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
  themeToggleBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Game history and statistics
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let streakType = localStorage.getItem('streakType') || '';

function addToHistory(playerMove, computerMove, result) {
  const historyItem = {
    playerMove,
    computerMove,
    result,
    timestamp: new Date().toLocaleTimeString()
  };

  gameHistory.unshift(historyItem);

  // Keep only last 10 games
  if (gameHistory.length > 10) {
    gameHistory.pop();
  }
  localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

  updateStreak(result);
  updateStatistics();
  displayHistory();
}

// Update streak tracking
function updateStreak(result) {
  if (result === streakType) {
    currentStreak++;
  } else {
    currentStreak = 1;
    streakType = result;
  }

  if (result === 'win' && currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }
  localStorage.setItem('currentStreak', currentStreak.toString());
  localStorage.setItem('bestStreak', bestStreak.toString());
  localStorage.setItem('streakType', streakType);
}

// Update statistics display
function updateStatistics() {
  const totalGames = score.wins + score.losses + score.ties;
  const winRate = totalGames > 0 ? Math.round((score.wins / totalGames) * 100) : 0;

  document.getElementById('win-rate').textContent = `${winRate}%`;
  document.getElementById('current-streak').textContent = currentStreak;
  document.getElementById('best-streak').textContent = bestStreak;
  document.getElementById('total-games').textContent = totalGames;
}

// Display game history
function displayHistory() {
  const historyContainer = document.getElementById('game-history');

  if (gameHistory.length === 0) {
    historyContainer.innerHTML = '<p class="no-history">No games played yet!</p>';
    return;
  }

  const historyHTML = gameHistory.map(game => {
    const resultClass = game.result;
    const resultEmoji = game.result === 'win' ? '🏆' : game.result === 'loss' ? '💀' : '🤝';

    return `
      <div class="history-item ${resultClass}">
        <div class="game-moves">
          ${getMoveEmoji(game.playerMove)} vs ${getMoveEmoji(game.computerMove)}
        </div>
        <div class="game-result">${resultEmoji} ${game.result}</div>
        <div class="game-time">${game.timestamp}</div>
      </div>
    `;
  }).join('');

  historyContainer.innerHTML = historyHTML;
}

// Helper function to get move emoji
function getMoveEmoji(move) {
  const emojis = { rock: '🗿', paper: '📄', scissors: '✂️' };
  return emojis[move] || move;
}

// Update your reset function to clear history and stats
function resetGame() {
  score = { wins: 0, losses: 0, ties: 0 };
  gameHistory = [];
  currentStreak = 0;
  bestStreak = 0;
  streakType = '';

  localStorage.removeItem('gameHistory');
  localStorage.removeItem('currentStreak');
  localStorage.removeItem('bestStreak');
  localStorage.removeItem('streakType');

  updateScoreElement();
  updateStatistics();
  displayHistory();
}

// Initialize on page load
updateStatistics();
displayHistory();