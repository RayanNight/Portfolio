//i may add more to this later if needed
const WORDS = [
    'CODE', 'GAME', 'WORD', 'CARE', 'BEAR', 
    'FISH', 'BIRD', 'DOOR', 'TREE', 'BOOK', 
    'MOON', 'STAR', 'FIRE', 'WIND', 'SAND', 
    'ROCK', 'GOLD', 'BLUE', 'PINK', 'DARK',
    'JAVA', 'HTML', 'ROAR', 'FORT', 'KEYS',
    'BROS', 'CROW', 'TAIL', 'CELL', 'LINE',
    'CRYS', 'HOPE', 'READ', 'ALSO', 'ABLE',
    'ACID', 'HAVE', 'HAIR', 'HERE', 'HEAR',
    'INTO', 'IRON', 'JUMP', 'KICK', 'KILL',
    'LIFE', 'LIKE', 'LOVE', 'JUNK', 'JOKE'
];


let secretWord = '';
let currentRow = 0;
let currentGuess = '';
let gameActive = true;
const maxAttempts = 6;


const winsTxt = document.getElementById('wins');
const board = document.getElementById('board');
const wordInput = document.getElementById('wordInput');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const hintTxt = document.getElementById('hint');

var wins = 0;
var losses = 0;

function loadStats(){
    //if first time, save first then load to create keys.
    if(localStorage.getItem("wins") === null) saveStats();

    wins = localStorage.getItem("wins");
    losses = localStorage.getItem("losses");
}
function saveStats(){
    localStorage.setItem("wins", wins);
    localStorage.setItem("losses", losses);
}
function deleteStats(){
    const confirmed = confirm('Are you sure? This will permanently delete ALL win/loss records.');
    if(!confirmed) return;

    localStorage.removeItem('wins');
    localStorage.removeItem('losses');

    wins = 0;
    losses = 0;
    displayStats();
}
function displayStats(){
    winsTxt.innerText = `Wins: ${wins} | Losses: ${losses}`; 
}

function initBoard() {
    board.innerHTML = '';
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.id = `row-${i}`;
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    loadStats();
    displayStats();
}

function updateCurrentRowDisplay() {
    for (let i = 0; i < 4; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        if (i < currentGuess.length) {
            cell.textContent = currentGuess[i];
            cell.style.borderColor = '#818384';
        } else {
            cell.textContent = '';
            cell.style.borderColor = '#3a3a3c';
        }
    }
}

function submitGuess() {
    if (!gameActive) {
        return;
    }
    
    if (currentGuess.length !== 4) {
        wordInput.focus();
        return;
    }

    const secretArray = secretWord.split('');
    const guessArray = currentGuess.split('');
    const result = Array(4).fill('absent');
    
    // First pass: find exact matches (correct position)
    for (let i = 0; i < 4; i++) {
        if (guessArray[i] === secretArray[i]) {
            result[i] = 'correct';
            secretArray[i] = null;
            guessArray[i] = null;
        }
    }
    
    // Second pass: find letters that exist elsewhere (present)
    for (let i = 0; i < 4; i++) {
        if (guessArray[i] !== null) {
            const index = secretArray.indexOf(guessArray[i]);
            if (index !== -1) {
                result[i] = 'present';
                secretArray[index] = null;
            }
        }
    }
    
    // Apply colors to cells with delay for visual effect
    for (let i = 0; i < 4; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        setTimeout(() => {
            cell.classList.add(result[i]);
        }, i * 100);
    }
    
    // Check win condition
    if (currentGuess === secretWord) {
        gameActive = false;
        wordInput.disabled = true;
        submitBtn.disabled = true;
        hintTxt.innerText = `🎉 YOU GOT IT! The word was ${secretWord}`;
        resetBtn.focus();
        wins++;
        displayStats();
        saveStats();
        return;
    }
    
    // Move to next row
    currentRow++;
    currentGuess = '';
    wordInput.value = '';
    
    // Check loss condition
    if (currentRow >= maxAttempts) {
        gameActive = false;
        wordInput.disabled = true;
        submitBtn.disabled = true;
        hintTxt.innerText = `Good try, The word was ${secretWord}`;
        resetBtn.focus();
        losses++;
        displayStats();
        saveStats();
        return;
    }
    
    wordInput.focus();
}

function handleInput() {
    if (!gameActive) return;
    
    let value = wordInput.value.toUpperCase().replace(/[^A-Z]/g, ''); //input validation 
    if (value.length > 4) {
        value = value.slice(0, 4);
    }
    wordInput.value = value;
    currentGuess = value;
    updateCurrentRowDisplay();
}

function resetGame() {
    // Pick new random word
    const milliSec = new Date().getMilliseconds();
    secretWord = WORDS[(milliSec % WORDS.length)];
    console.log('Secret word:', secretWord); //leav hint for prof
    
    currentRow = 0;
    currentGuess = '';
    gameActive = true;
    wordInput.disabled = false;
    submitBtn.disabled = false;
    wordInput.value = '';
    hintTxt.innerText = '';
    wordInput.focus();
    
    // Clear all cells and reset colors
    for (let i = 0; i < maxAttempts; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.borderColor = '#3a3a3c';
        }
    }
    loadStats();
    displayStats();
}

// Event listeners
wordInput.addEventListener('input', handleInput);
submitBtn.addEventListener('click', () => submitGuess());
resetBtn.addEventListener('click', () => resetGame());
document.getElementById('delete').addEventListener('click', deleteStats);

// allow Enter key to submit
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

// Initialize game
initBoard();
resetGame();