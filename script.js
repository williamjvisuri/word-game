// script.js

const puzzleData = [
    { category: "WORDS USING ONLY ROMAN NUMERALS", words: ["CIVIC", "MIMIC", "LIVID", "DID"] },
    { category: "SELF-ANTONYMS (CONTRONYMS)", words: ["CLEAVE", "DUST", "LEFT", "SEED"] },
    { category: "WORDS THAT SPELL OTHER WORDS BACKWARDS", words: ["STOPS", "REPAID", "REWARD", "STRESSED"] },
    { category: "TYPED ONLY ON THE TOP ROW OF A KEYBOARD", words: ["TYPEWRITER", "PROPRIETOR", "PERPETUITY", "POTTERY"] }
];

const gridContainer = document.getElementById('grid-container');
const solvedGroupsContainer = document.getElementById('solved-groups-container');
const messageContainer = document.getElementById('message-container');
const submitButton = document.getElementById('submit-button');
const deselectAllButton = document.getElementById('deselect-all-button');

let selectedWords = [];
let solvedCategories = [];

function initGame() {
    let allWords = puzzleData.flatMap(group => group.words);
    for (let i = allWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    allWords.forEach(word => {
        const tile = document.createElement('div');
        tile.classList.add('grid-item');
        tile.textContent = word;
        tile.addEventListener('click', handleTileClick);
        gridContainer.appendChild(tile);
    });
}

function handleTileClick(event) {
    const clickedTile = event.target;
    if (clickedTile.classList.contains('solved')) return; // Ignore clicks on solved tiles
    const word = clickedTile.textContent;
    if (selectedWords.includes(word)) {
        selectedWords = selectedWords.filter(w => w !== word);
        clickedTile.classList.remove('selected');
    } else {
        if (selectedWords.length < 4) {
            selectedWords.push(word);
            clickedTile.classList.add('selected');
        }
    }
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
    submitButton.disabled = selectedWords.length !== 4;
}

function handleSubmit() {
    if (selectedWords.length !== 4) return;
    const foundCategory = puzzleData.find(category => {
        const isAlreadySolved = solvedCategories.some(solved => solved.category === category.category);
        if (isAlreadySolved) return false;
        return selectedWords.every(word => category.words.includes(word));
    });

    if (foundCategory) {
        handleCorrectGuess(foundCategory);
    } else {
        handleIncorrectGuess();
    }
}

function handleCorrectGuess(foundCategory) {
    solvedCategories.push(foundCategory);
    displayMessage("Correct!", "correct");

    const solvedCard = document.createElement('div');
    solvedCard.classList.add('solved-group', `color-${solvedCategories.length - 1}`);
    solvedCard.innerHTML = `<strong>${foundCategory.category}</strong><p>${foundCategory.words.join(', ')}</p>`;
    solvedGroupsContainer.appendChild(solvedCard);
    
    selectedWords.forEach(word => {
        const tile = [...gridContainer.children].find(t => t.textContent === word);
        if (tile) {
            tile.classList.add('solved');
        }
    });
    
    deselectAll();
    checkForWin();
}

function handleIncorrectGuess() {
    displayMessage("Not a group, try again!", "incorrect");
    const selectedTiles = document.querySelectorAll('.grid-item.selected');
    selectedTiles.forEach(tile => {
        tile.classList.add('shake'); // Future enhancement: add a shake animation
    });
}

function deselectAll() {
    selectedWords = [];
    const selectedTiles = document.querySelectorAll('.grid-item.selected');
    selectedTiles.forEach(tile => {
        tile.classList.remove('selected');
    });
    updateSubmitButtonState();
}

function displayMessage(text, type, duration = 1500) {
    messageContainer.textContent = text;
    messageContainer.className = `message-${type}`;
    if (type !== 'win') {
        setTimeout(() => messageContainer.textContent = '', duration);
    }
}

function checkForWin() {
    if (solvedCategories.length === puzzleData.length) {
        displayMessage("Congratulations, You Win!", "win");
        gridContainer.style.display = 'none';
        document.getElementById('actions-container').style.display = 'none';
    }
}

deselectAllButton.addEventListener('click', deselectAll);
submitButton.addEventListener('click', handleSubmit);

initGame();
