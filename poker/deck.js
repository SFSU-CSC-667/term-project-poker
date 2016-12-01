class Deck {
  constructor() {
    this.createDeck();
  }
    
  getDeck(){
    return this.deck;
  }
  draw() {
    if (!this.deck.length) {
      this.createDeck();
      this.shuffle();
      return this.deck.pop();
    }
    return this.deck.pop();
  }

  shuffle() {
    let array = this.deck;
    for (let i = array.length; i; i--) {
        let random = Math.floor(Math.random() * i);
        [array[i - 1], array[random]] = [array[random], array[i - 1]];
    }
  }

  createDeck() {
    this.deck = [
      'ace-hearts', 'two-hearts', 'three-hearts', 'four-hearts', 'five-hearts',
      'six-hearts', 'seven-hearts', 'eight-hearts', 'nine-hearts', 'ten-hearts',
      'jack-hearts', 'queen-hearts', 'king-hearts',

      'ace-diamonds', 'two-diamonds', 'three-diamonds', 'four-diamonds', 'five-diamonds',
      'six-diamonds', 'seven-diamonds', 'eight-diamonds', 'nine-diamonds', 'ten-diamonds',
      'jack-diamonds', 'queen-diamonds', 'king-diamonds',

      'ace-spades', 'two-spades', 'three-spades', 'four-spades', 'five-spades',
      'six-spades', 'seven-spades', 'eight-spades', 'nine-spades', 'ten-spades',
      'jack-spades', 'queen-spades', 'king-spades',

      'ace-clubs', 'two-clubs', 'three-clubs', 'four-clubs', 'five-clubs',
      'six-clubs', 'seven-clubs', 'eight-clubs', 'nine-clubs', 'ten-clubs',
      'jack-clubs', 'queen-clubs', 'king-clubs'
    ];
  }

}

module.exports = Deck;
