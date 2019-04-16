var cards = document.querySelectorAll('.memory_card');
var fronts = document.querySelectorAll('.front');

let hasFlippedCard = false;
let lockBoard = false;
let matches = 0;
let firstCard, secondCard;

function flip() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');
    if (!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    secondCard=this;

    checkMatch();
}

function checkMatch(){
    let match = firstCard.dataset.framework === secondCard.dataset.framework;
    match ? disableCards() : unflip();
}

function disableCards(){
    firstCard.removeEventListener('click', flip);
    secondCard.removeEventListener('click', flip);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches = matches + 1;
    checkDone();
    resetBoard();
}

function checkDone(){
    if (matches == 26){
        alert('Congrats! You win! Press New Game to continue');
    }
    else return;
}

function unflip(){
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard(){
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function draw(deck_id){
    var req = new XMLHttpRequest();
        req.open('GET', 'https://deckofcardsapi.com/api/deck/'+deck_id);
        req.onload = function(){
            var data2 = JSON.parse(this.response);
            if (req.status >=200 && req.status < 400){
                console.log(data2);
                let i = 0;
                cards.forEach(function(card){
                    console.log(data2.cards[i]);
                    card.dataset.framework = data2.cards[i].value;
                    console.log(data2.cards[i].value);
                    

                    fronts[i].src = data2.cards[i].image;
                    i = i + 1;
                })
            } else {
                console.log('error in second req - draw')
            }
        }
        req.send();
}

function newGame(){
    resetBoard();
    matches = 0;
    cards.forEach(function(card){
        card.classList.remove('flip');
        card.addEventListener('click', flip);
        card.classList.remove('matched');
    });
    shuffle();
}

function shuffle(){
    var request = new XMLHttpRequest();
    request.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    request.onload = function(){
        var data = JSON.parse(this.response);
        if (request.status >=200 && request.status < 400){
            deck_id = data.deck_id+'/draw/?count=52';
            console.log(data);
            draw(deck_id);
        }
        else {
            console.log('error');
        }
    }
    request.send();
}

(function prepBoard(){
    shuffle();
})();

cards.forEach(function(card){
    card.addEventListener('click', flip);
});