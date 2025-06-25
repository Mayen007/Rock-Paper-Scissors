let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};
updateScoreElement();
let isAutoPlaying = false;
let intervalId;

let resetBtn = document.querySelector('.js-auto-play');

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
  }
  else if (event.key.toLowerCase() === 'a') {
    autoPlay();
  } else if (event.key === 'Backspace') {
    resetScore();
  }
});


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
  } else if (result === 'You lose.') {
    score.losses += 1;
  } else if (result === 'Tie.') {
    score.ties += 1;
  }
  localStorage.setItem('score', JSON.stringify(score));

  const historyResult = result === 'You win.' ? 'win' : result === 'You lose.' ? 'loss' : 'tie';
  addToHistory(playerMove, computerMove, historyResult);

  updateScoreElement();
  document.querySelector('.js-result').innerHTML = result;

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
        playerMoveEl.classList.add('animate-win');
        computerMoveEl.classList.add('animate-lose');
      } else if (result === 'You lose.') {
        playerMoveEl.classList.add('animate-lose');
        computerMoveEl.classList.add('animate-win');
      }
    }
  }, 100);
}

function updateScoreElement() {
  document.getElementById('win-count').textContent = score.wins;
  document.getElementById('tie-count').textContent = score.ties;
  document.getElementById('loss-count').textContent = score.losses;

  // Add pulse animation to updated score
  const scoreItems = document.querySelectorAll('.score-item');
  scoreItems.forEach(item => {
    item.classList.add('updated');
    setTimeout(() => item.classList.remove('updated'), 600);
  });
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
};

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
}
updateStatistics();
displayHistory();