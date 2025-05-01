let count = parseInt(localStorage.getItem('count')) || 0;
let total = parseInt(localStorage.getItem('total')) || 0;
let perClick = parseInt(localStorage.getItem('perClick')) || 1;
let autoClickers = parseInt(localStorage.getItem('autoClickers')) || 0;
let prestigeTokens = parseInt(localStorage.getItem('prestigeTokens')) || 0;
let startTime = parseInt(localStorage.getItem('startTime')) || Date.now();
let prestigeLevel = parseInt(localStorage.getItem('prestigeLevel')) || 0;

const countDisplay = document.getElementById('count');
const totalDisplay = document.getElementById('total');
const cpsDisplay = document.getElementById('cps');
const timeDisplay = document.getElementById('time');

const clicker = document.getElementById('clicker');
const upgradeClick = document.getElementById('upgrade-click');
const autoClicker = document.getElementById('auto-clicker');
const prestigeReset = document.getElementById('prestige-reset');
const resetBtn = document.getElementById('reset');

// Aktualizacja wyświetlacza
function updateDisplay() {
  countDisplay.textContent = count;
  totalDisplay.textContent = total;
  cpsDisplay.textContent = autoClickers;
  let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  timeDisplay.textContent = elapsedSeconds;
}

// Kliknięcie
clicker.addEventListener('click', () => {
  count += perClick;
  total += perClick;
  updateDisplay();
  saveGame();
});

// Ulepszenie kliknięcia
upgradeClick.addEventListener('click', () => {
  if (count >= 10) {
    count -= 10;
    perClick += 1;
    updateDisplay();
    saveGame();
  }
});

// Kup AutoKlikacza
autoClicker.addEventListener('click', () => {
  if (count >= 50) {
    count -= 50;
    autoClickers += 1;
    updateDisplay();
    saveGame();
  }
});

// Prestige reset
prestigeReset.addEventListener('click', () => {
  if (count >= 100) {
    count -= 100;
    prestigeTokens += 1;
    prestigeLevel += 1;
    perClick = 1;
    autoClickers = 0;
    updateDisplay();
    saveGame();
  }
});

// Reset gry
resetBtn.addEventListener('click', () => {
  if (confirm("Na pewno zresetować grę?")) {
    localStorage.clear();
    location.reload();
  }
});

// Auto klikanie
setInterval(() => {
  count += autoClickers;
  total += autoClickers;
  updateDisplay();
  saveGame();
}, 1000);

// Zapis gry
function saveGame() {
  localStorage.setItem('count', count);
  localStorage.setItem('total', total);
  localStorage.setItem('perClick', perClick);
  localStorage.setItem('autoClickers', autoClickers);
  localStorage.setItem('prestigeTokens', prestigeTokens);
  localStorage.setItem('prestigeLevel', prestigeLevel);
  localStorage.setItem('startTime', startTime);
}

// Start
updateDisplay();
