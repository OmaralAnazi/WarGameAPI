const cardsContainer = document.getElementById('cards');
const newDeckBtn = document.getElementById('new-deck');
const drawCardBtn = document.getElementById('draw-cards');
const header = document.getElementById('header');
const remainingText = document.getElementById('remaining');
const computerScoreEl = document.getElementById('computer-score');
const myScoreEl = document.getElementById('my-score');

let deckId;
let computerScore = 0;
let myScore = 0;

newDeckBtn.addEventListener('click', getNewDeck);
drawCardBtn.addEventListener('click', drawCards);

async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function getNewDeck() {
    const data = await fetchAPI('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    if (data) {
        remainingText.textContent = `Remaining cards: ${data.remaining}`;
        deckId = data.deck_id;
        newDeckBtn.disabled = true;
        drawCardBtn.disabled = false;
        resetGame();
    }
}

async function drawCards() {
    const data = await fetchAPI(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
    if (data) {
        remainingText.textContent = `Remaining cards: ${data.remaining}`;
        updateCardsDisplay(data.cards);
        checkGameOver(data.remaining);
    }
}

function resetGame() {
    computerScore = 0;
    myScore = 0;
    header.textContent = 'Game of War';
    computerScoreEl.textContent = `Computer score: ${computerScore}`;
    myScoreEl.textContent = `My score: ${myScore}`;
    cardsContainer.innerHTML = `
        <div class="card-slot"></div>
        <div class="card-slot"></div>
    `
}

function updateCardsDisplay(cards) {
    cardsContainer.children[0].innerHTML = `<img src='${cards[0].image}' class='card' />`;
    cardsContainer.children[1].innerHTML = `<img src='${cards[1].image}' class='card' />`;
    const winnerText = determineCardWinner(cards[0], cards[1]);
    header.textContent = winnerText;
}

function checkGameOver(remaining) {
    if (remaining === 0) {
        newDeckBtn.disabled = false;
        drawCardBtn.disabled = true;
        const finalResult = computerScore > myScore ? 'The computer won the game!' :
                            myScore > computerScore ? 'You won the game!' : 'It\'s a tie game!';
        header.textContent = finalResult;
    }
}

function determineCardWinner(card1, card2) {
    const valueOptions = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];
    const card1ValueIndex = valueOptions.indexOf(card1.value);
    const card2ValueIndex = valueOptions.indexOf(card2.value);

    if (card1ValueIndex > card2ValueIndex) {
        computerScore++;
        computerScoreEl.textContent = `Computer score: ${computerScore}`;
        return 'Computer wins!';
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++;
        myScoreEl.textContent = `My score: ${myScore}`;
        return 'You win!';
    } else {
        return 'War!';
    }
}
