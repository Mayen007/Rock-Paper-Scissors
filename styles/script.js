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
      result = 'Tie';
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

  updateScoreElement();
  document.querySelector('.js-result').innerHTML = result;

  document.querySelector('.js-moves').innerHTML = ` You
    <img src="./images/${playerMove}-emoji.png" alt="${playerMove}" class="move-icon">
    <img src="./images/${computerMove}-emoji.png" alt="${computerMove}" class="move-icon">
    computer`;
}

function updateScoreElement() {
  document.getElementById('win-count').textContent = score.wins;
  document.getElementById('loss-count').textContent = score.losses;
  document.getElementById('tie-count').textContent = score.ties;
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
