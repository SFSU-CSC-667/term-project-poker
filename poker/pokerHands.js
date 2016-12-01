const deckFile = require('./deck.js');
const Deck = new deckFile();

class PokerHands{
  constructor() {
    this.winningHand = [];
  }

  getHand(hand, sharedCards){

    let playerHand = [];

    if(this.containsRoyalFlush(hand, sharedCards)){
      playerHand = this.getRoyalFlushHand(hand, sharedCards);
      playerHand.push(10);
    }
    else if(this.containsStraightFlush(hand, sharedCards)){
      playerHand = this.getStraightFlushHand(hand, sharedCards);
      playerHand.push(9);
    }
    else if(this.containsQuads(hand, sharedCards)){
      playerHand = this.getQuadHand(hand, sharedCards);
      playerHand.push(8);
    }
    else if(this.containsFullHouse(hand, sharedCards)){
      playerHand = this.getFullHouseHand(hand, sharedCards);
      playerHand.push(7);
    }
    else if(this.containsFlush(hand, sharedCards)){
      playerHand = this.getFlushHand(hand, sharedCards);
      playerHand.push(6);
    }
    else if(this.containsStraight(hand, sharedCards)){
      playerHand = this.getStraightHand(hand, sharedCards);
      playerHand.push(5);
    }
    else if(this.containsTrips(hand, sharedCards)){
      playerHand = this.getTripsHand(hand, sharedCards);
      playerHand.push(4);
    }
    else if(this.containsTwoPair(hand, sharedCards)){
      playerHand = this.getTwoPairHand(hand, sharedCards);
      playerHand.push(3);
    }
    else if(this.getContainsPair(hand, sharedCards)){
      playerHand = this.getPairHand(hand, sharedCards);
      playerHand.push(2);
    }
    else{
      playerHand = this.getHighHand(hand, sharedCards);
      playerHand.push(1);
    }

    return playerHand;

  }

  /********************************************************************/
  /********************* prepare hand  ********************************/
  /********************************************************************/
  combineHand(hand, sharedCards){

    hand = hand.concat(sharedCards);

    return hand;

  }

  prepareHand(hand){

    let newHand = [];

    for( let index in hand )
      newHand.push(hand[index] % 13) ;

    newHand.sort(function(a,b){return a-b;});

    return newHand;

  }

  prepareFlush(hand){

    for( let index in hand )
      hand[index] = Math.floor( hand[index] / 13 );

    return hand;

  }

  filter(card, hand){

    let newHand = [];

    for(let i in hand)
      if( hand[i]%13 != card )
        newHand.push(hand[i]);

    return newHand;

  }

  getIndex(hand, pairCard){

    for(let i = 0; i < hand.length; i++)
      if(hand[i]%13 == pairCard)
        return hand[i];

  }

  /********************************************************************/
  /********************** get kickers  ********************************/
  /********************************************************************/

  getKickers(hand, numOfCards){

    let kickers = [];

    while(true){

      let largestCard = hand[0];
      let indexToRemove = 0;

      if(hand[0] != 0)
        for( let j = 1 ; j < hand.length ; j++ )
      if( largestCard%13 < hand[j]%13 ){
        largestCard = hand[j];
        indexToRemove = j;
      }

      kickers.push(largestCard);
      hand.splice(indexToRemove, 1);

      if(kickers.length == numOfCards)
        return kickers;

    }

  }

  /********************************************************************/
  /************************ find pair  ********************************/
  /********************************************************************/

  getHighHand(hand, sharedCards){

    let numOfKickers = 5;
    let newHand = [];

    hand = this.combineHand(hand, sharedCards);

    newHand = this.getKickers(hand, numOfKickers);

    return newHand;

  }

  /********************************************************************/
  /************************ find pair  ********************************/
  /********************************************************************/
  getContainsPair(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);
    hand.reverse();

    for( let index = 0; index < hand.length - 1; index++ )
      if( hand[index] == hand[index+1])
        return true;

    return false;


  }

  getPairCard(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);
    hand.reverse();

    /* return ace */
    if(hand[hand.length-1] == 0 && hand[hand.length-2] == 0)
      return 0;

    for( let index = 0; index < hand.length - 1; index++ )
      if( hand[index] == hand[index+1])
        return hand[index];

    return -1;

  }

  getPairHand(hand, sharedCards){

    /* get pair cards and add to new hand */
    let pairCard = this.getPairCard(hand, sharedCards);
    let pairHand = [];
    let newHand = [];
    let numOfKickers = 3;
    let kickers;

    hand = this.combineHand(hand, sharedCards);

    for(let i = 0; i < hand.length; i++)
      if(hand[i]%13 == pairCard)
        pairHand.push(hand[i]);

    hand = this.filter(pairCard, hand);
    kickers = this.getKickers(hand, numOfKickers);
    newHand.push(pairHand);
    newHand.push(kickers);

    return newHand;

  }

  /********************************************************************/
  /************************ find two pair  ****************************/
  /********************************************************************/
  containsTwoPair(hand, sharedCards){

    let pairFound = this.getContainsPair(hand, sharedCards);
    let pairCard;

    if(pairFound)
      pairCard = this.getPairCard(hand, sharedCards);
    else
      return false;

    hand = this.filter(pairCard, hand);
    sharedCards = this.filter(pairCard, sharedCards);

    pairFound = this.getContainsPair(hand, sharedCards);

    if(pairFound)
      return true;
    else
      return false;

  }

  getPairIndex(hand, sharedCards, pairCard){

    let newHand = [];
    let combinedHand = hand.concat(sharedCards);

    let firstCardIndex = this.getIndex(combinedHand, pairCard);
    let index = combinedHand.indexOf(firstCardIndex);

    combinedHand.splice(index, 1);

    let secondCardIndex = this.getIndex(combinedHand, pairCard);

    newHand.push(firstCardIndex);
    newHand.push(secondCardIndex);

    return newHand;

  }

  getTwoPairHand(hand, sharedCards){

    let newHand = [];
    let pairCards = [];
    let numOfKickers = 1;

    for(let i = 0; i < 2; i++){

      let pairCard = this.getPairCard(hand, sharedCards);
      let pairCardIndexs = this.getPairIndex(hand, sharedCards, pairCard);

      newHand.push(pairCardIndexs);

      hand = this.filter(pairCard, hand);
      sharedCards = this.filter(pairCard, sharedCards);

    }

    hand = this.combineHand(hand, sharedCards);
    let kickers = this.getKickers(hand, numOfKickers);

    newHand.push(kickers);

    return newHand;

  }

  /********************************************************************/
  /********************** find trpple  ********************************/
  /********************************************************************/
  containsTrips(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);
    hand.reverse();

    for( let i = 0; i < hand.length - 2; i++)
      if(hand[i] == hand[i + 1])
        if(hand[i] == hand[i + 2])
          return true;

    return false;

  }

  getTripsCard(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);
    hand.reverse();

    let ace = 0;

    /* look for ace */
    if(hand[hand.length-1]%13 == ace && hand[hand.length-2]%13 == ace &&
       hand[hand.length-3]%13 == ace)
       return ace;

    for( let i = 0; i < hand.length - 2; i++)
      if(hand[i] == hand[i + 1])
        if(hand[i] == hand[i +2])
          return hand[i];

  }

  getTripsIndexs(hand, sharedCards, tripsCard){

    let newHand = [];
    hand = this.combineHand(hand, sharedCards);

    for(let i = 0; i < hand.length; i++)
      if(hand[i]%13 == tripsCard)
        newHand.push(hand[i]);

    return newHand;

  }

  getTripsHand(hand, sharedCards){

    /* add trips to new hand */
    let tripsCard = this.getTripsCard(hand, sharedCards);
    let newHand = [];
    let numOfKickers = 2;
    let tripsIndexs = this.getTripsIndexs(hand, sharedCards, tripsCard);

    hand = this.combineHand(hand, sharedCards);
    hand = this.filter(tripsCard, hand);

    let kickers = this.getKickers(hand, numOfKickers);

    newHand.push(tripsIndexs);
    newHand.push(kickers);

    return newHand;

  }

  /********************************************************************/
  /********************* find straight ********************************/
  /********************************************************************/
  containsStraight(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);
    hand = this.removeDuplicates(hand);

    let ace = 0, king = 12, queen = 11, jack = 10, ten = 9;

    if(hand.includes(ace)   && hand.includes(king) && hand.includes(queen) &&
       hand.includes(jack)  && hand.includes(ten))
       return true;

    /* find 5 consecutive numbers */
    for( let i = 0; i < hand.length - 4; i++ ){

      let tempHand = [];

      for( let j = i; j < i + 5; j++ )
        tempHand.push(hand[j]);

      if(this.checkStraight(tempHand))
        return true;

    }

    return false;

  }

  checkStraight(hand){

    for( let i = 0; i < hand.length - 1 ; i++ )
      if(hand[i] != (hand[i + 1] - 1) )
         return false;

    return true;

  }

  removeDuplicates(hand){

    let counter = 0;

    while(true){

      if(hand[counter] == hand[counter+1])
        hand.splice(counter, 1);
      else
        counter++;

      if(counter >= hand.length)
        return hand;

    }

  }

  getStraightCards(hand, sharedCards){

    let newHand = [];

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);

    /* check for aces */
    let ace = 0, king = 12, queen = 11, jack = 10, ten = 9;

    if(hand.includes(ace)   && hand.includes(king) && hand.includes(queen) &&
       hand.includes(jack)  && hand.includes(ten)){

         newHand.push(ace);
         newHand.push(king);
         newHand.push(queen);
         newHand.push(jack);
         newHand.push(ten);

         return newHand;

       }


    /* find 5 consecutive numbers */
    for( let i = 6; i > 3; i-- ){

      newHand = [];

      for( let j = i; j > i - 5; j-- )
        newHand.push(hand[j]);

      if(this.checkStraight(newHand.reverse()))
        return newHand;


    }

    return -1;

  }

  getStraightHand(hand, sharedCards){

    let straightCards = this.getStraightCards(hand, sharedCards);
    let straightHand = [];

    hand = this.combineHand(hand, sharedCards);

    /* push ace first */

    for(let i = 0; i < straightCards.length; i++)
      for(let j = 0; j <hand.length; j++)
        if(hand[j]%13 == straightCards[i]){
          straightHand.push(hand[j]);
      break;
        }

    return straightHand;

  }
  /********************************************************************/
  /********************* find flush ** ********************************/
  /********************************************************************/

  containsFlush(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareFlush(hand);

    /* need to check for grouping */
    for( let suit = 0; suit < 4; suit++ )
      if( this.checkFlush(suit, hand) )
        return true;

    return false;

  }

  checkFlush(suit, cards){

    let counter = 0;

    for( let index in cards )
      if( suit == cards[index] )
        counter++;

    if(counter > 4)
      return true;

    return false;

  }

  getFlushSuit(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareFlush(hand);
    hand.sort(function(a,b){ return a - b});

    let counter = 1;

    for(let i = 0; i < hand.length; i++){

      if(hand[i] == hand[i+1])
        counter++;
      else
        counter = 1;

      if(counter >= 5)
        return hand[i];

    }

  }

  /* check for aces */
  getFlushCards(hand, sharedCards){

    let flushSuit = this.getFlushSuit(hand, sharedCards);
    let newHand = [];
    let cardSuit;
    hand = this.combineHand(hand, sharedCards);

    for(let i = 0; i < hand.length; i++){

      cardSuit = Math.floor( hand[i] / 13 );

      if(cardSuit == flushSuit)
        newHand.push(hand[i]);

    }

    newHand.sort(function(a,b){ return a-b});
    newHand.reverse();

    return newHand;

  }

  getFlushHand(hand, sharedCards){

    let flushCards = this.getFlushCards(hand, sharedCards);

    if(flushCards.length == 5)
      return flushCards;

    if( (flushCards[flushCards.length-1] )%13 == 0){

      let ace = flushCards.pop();

      while(flushCards.length != 4)
        flushCards.pop();

      flushCards.push(ace);

    }
    else
      while(flushCards.length != 5)
        flushCards.pop();

    return flushCards;



  }

  /********************************************************************/
  /********************* find quads ***********************************/
  /********************************************************************/

  containsQuads(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);

    for( let i = 0; i < 4; i++ )
      if(hand[i] == hand[i+1] && hand[i] == hand[i+2] && hand[i] == hand[i+3])
        return true;

    return false;

  }

  getQuadCard(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand = this.prepareHand(hand);

    for( let i = 0; i < 4; i++ )
      if(hand[i] == hand[i+1] && hand[i] == hand[i+2] && hand[i] == hand[i+3])
        return hand[i];

  }

  getQuadIndexs(hand, quadCard){

    let newHand = [];

    for( let i = 0; i < hand.length; i++ )
      if(hand[i]%13 == quadCard)
        newHand.push(hand[i]);

    return newHand;

  }
  getQuadHand(hand, sharedCards){

    let quadCard = this.getQuadCard(hand, sharedCards);
    let newHand = [];
    let numOfKickers = 1;


    hand = hand.concat(sharedCards);

    let quadIndexs = this.getQuadIndexs(hand, quadCard);

    hand = this.filter(quadCard, hand);
    let kickers = this.getKickers(hand, numOfKickers);

    newHand.push(quadIndexs);
    newHand.push(kickers);

    return newHand;

  }

  /********************************************************************/
  /********************* find full house  *****************************/
  /********************************************************************/

  containsFullHouse(hand, sharedCards){

    let tripsFound = this.containsTrips(hand, sharedCards);
    let tripsCard;

    if(tripsFound)
      tripsCard = this.getTripsCard(hand, sharedCards);
    else
      return false;

    hand = this.filter(tripsCard, hand);
    sharedCards = this.filter(tripsCard, sharedCards);

    let pairFound = this.getContainsPair(hand, sharedCards);

    if(pairFound)
      return true;
    else
      return false;

  }

  getFullHouseHand(hand, sharedCards){

    let newHand = [];

    let tripsCard = this.getTripsCard(hand, sharedCards);
    let tripIndex = this.getTripsIndexs(hand, sharedCards, tripsCard);

    hand = this.filter(tripsCard, hand);
    sharedCards = this.filter(tripsCard, sharedCards);

    let pairCard = this.getPairCard(hand, sharedCards);
    let pairIndex = this.getPairIndex(hand, sharedCards, pairCard);

    newHand.push(tripIndex);
    newHand.push(pairIndex);

    return newHand;

  }
  /********************************************************************/
  /****************** find straight flush  ****************************/
  /********************************************************************/

  containsStraightFlush(hand, sharedCards){

    hand = this.combineHand(hand, sharedCards);
    hand.sort(function(a,b){ return a - b});

    for(let i = 0; i < hand.length - 4; i++)
      if( (hand[i] == hand[i+1]-1 ) && (hand[i] == hand[i+2]-2 ) &&
          (hand[i] == hand[i+3]-3 ) && (hand[i] == hand[i+4]-4))
        return true;

    return false;

  }

  getStraightFlushHand(hand, sharedCards){

    let flushFound = this.containsFlush(hand, sharedCards);

    if(flushFound)
      hand = this.getFlushCards(hand, sharedCards);

    let newHand = [];
    hand.sort(function(a,b){ return a-b});
    hand.reverse();

    for(let i = 0; i < hand.length - 4; i++)
      if( (hand[i] == hand[i+1]+1 ) && (hand[i] == hand[i+2]+2 ) &&
          (hand[i] == hand[i+3]+3 ) && (hand[i] == hand[i+4]+4 )){

      newHand.push(hand[i]);
      newHand.push(hand[i+1]);
      newHand.push(hand[i+2]);
      newHand.push(hand[i+3]);
      newHand.push(hand[i+4]);
          break;
       }

    return newHand;

  }

  /********************************************************************/
  /********************* find royal flush  ****************************/
  /********************************************************************/

  containsRoyalFlush(hand, sharedCards){

    let flushFound = this.containsFlush(hand, sharedCards);
    let ace = 0, king = 12, queen = 11, jack = 10, ten = 9;

    if(!flushFound)
      return false;

    let flushHand = this.getFlushHand(hand, sharedCards);

    if(flushHand[0]%13 == king &&
       flushHand[1]%13 == queen &&
       flushHand[2]%13 == jack &&
       flushHand[3]%13 == ten &&
       flushHand[4]%13 == ace)
       return true;

    return false;

  }

  getRoyalFlushHand(hand, sharedCards){

    let flushHand = this.getFlushHand(hand, sharedCards);

    return flushHand;

  }

  /********************************************************************/
  /********************* compare winners ******************************/
  /********************************************************************/

  compareHand(playerOne, playerTwo ){

    let playerOneID = playerOne[0];
    let playerOneCards = playerOne[1];
    let playerOneHand = playerOneCards[playerOneCards.length-1];

    let playerTwoID = playerTwo[0];
    let playerTwoCards = playerTwo[1];
    let playerTwoHand = playerTwoCards[playerTwoCards.length-1];

    if( playerOneHand > playerTwoHand )
      return playerOneID;
    else if( playerOneHand < playerTwoHand )
      return playerTwoID;
    else{

      /* in case of same type of hand e.g. both players have full houses */
      if(playerOneHand == 1)
        return this.compareValue(playerOne, playerTwo);
      else if(playerOneHand == 2)
        return this.comparePair(playerOne, playerTwo);
      else if(playerOneHand == 3)
        return this.compareTwoPair(playerOne, playerTwo);
      else if(playerOneHand == 4)
        return this.compareTrips(playerOne, playerTwo);
      else if(playerOneHand == 5)
        return this.compareValue(playerOne, playerTwo);
      else if(playerOneHand == 6)
        return this.compareValue(playerOne, playerTwo);
      else if(playerOneHand == 7)
        return this.compareFullHouse(playerOne, playerTwo);
      else if(playerOneHand == 8)
        return this.compareQuads(playerOne, playerTwo);
      else if(playerOneHand == 9)
        return this.compareValue(playerOne, playerTwo);
      else if(playerOneHand == 10)
        return this.compareValue(playerOne, playerTwo);
    }

  }

  compareValue(playerOne, playerTwo){

    let ace = 0;

    let playerOneID = playerOne[0];
    let playerTwoID = playerTwo[0];

    let playerOneCards = this.prepareHand(playerOne[1]);
    let playerTwoCards = this.prepareHand(playerTwo[1]);

    for(let i = 0; i < playerOneCards.length; i++){

      /* check for ace */
      if(playerOneCards[i] == ace && playerTwoCards[i] != ace)
        return playerOneID;
      else if(playerOneCards[i] != ace && playerTwoCards[i] == ace)
        return playerTwoID;

      if(playerOneCards[i] > playerTwoCards[i])
        return playerOneID;
      else if(playerOneCards[i] < playerTwoCards[i])
        return playerTwoID;

    }

    return "tie";

  }

  comparePair(playerOne, playerTwo){

    let playerOneID = playerOne[0];
    let playerOneCards = playerOne[1];

    let playerTwoID = playerTwo[0];
    let playerTwoCards = playerTwo[1];

    let playerOnePair = this.getValue(playerOneCards[0][0]);
    let playerTwoPair = this.getValue(playerTwoCards[0][0]);

    let playerOneKickers = playerOneCards[1];
    let playerTwoKickers = playerTwoCards[1];

    if(playerOnePair > playerTwoPair)
      return playerOneID;
    else if(playerOnePair < playerTwoPair)
      return playerTwoID;
    else
      return this.compareValue(playerOne, playerTwo);
  }

  getValue(card){

    let cardValue = card%13;

    if(cardValue == 0)
      cardValue = 13;

    return cardValue;

  }

  compareTwoPair(playerOne, playerTwo){

    let playerOneID = playerOne[0];
    let playerOneCards = playerOne[1];

    let playerTwoID = playerTwo[0];
    let playerTwoCards = playerTwo[1];

    let playerOneFirstPair = this.getValue(playerOneCards[0][0]);
    let playerOneSecondPair = this.getValue(playerOneCards[1][1]);
    let playerOneKicker = this.getValue(playerOneCards[2]);

    let playerTwoFirstPair = this.getValue(playerTwoCards[0][0]);
    let playerTwoSecondPair = this.getValue(playerTwoCards[1][1]);
    let playerTwoKicker = this.getValue(playerTwoCards[2]);

    if(playerOneFirstPair > playerTwoFirstPair)
      return playerOneID;
    else if(playerOneFirstPair < playerTwoFirstPair)
      return playerTwoID;
    else{
      if(playerOneSecondPair > playerTwoSecondPair)
        return playerOneID;
      else if(playerOneSecondPair < playerTwoSecondPair)
        return playerTwoID;
      else{
        if(playerOneKicker > playerTwoKicker)
          return playerOneID;
        else if(playerOneKicker < playerTwoKicker)
          return playerTwoID;
        else
          return "tie";
      }

    }

  }

  compareTrips(playerOne, playerTwo){

    let playerOneID = playerOne[0];
    let playerOneCards = playerOne[1];

    let playerTwoID = playerTwo[0];
    let playerTwoCards = playerTwo[1];

    let playerOneTrips = this.getValue(playerOneCards[0][1]);
    let playerOneKickers = playerOneCards[1];

    let playerTwoTrips = this.getValue(playerTwoCards[0][1]);
    let playerTwoKickers = playerTwoCards[1];

    if(playerOneTrips > playerTwoTrips)
      return playerOneID;
    else if(playerOneTrips < playerTwoTrips)
      return playerTwoID;
    else
      return this.compareValue(playerOne, playerTwo);

  }

  compareFullHouse(playerOne, playerTwo){

    let playerOneID = playerOne[0];
    let playerOneCards = playerOne[1];

    let playerTwoID = playerTwo[0];
    let playerTwoCards = playerTwo[1];

    let playerOneTrips = this.getValue(playerOneCards[0][1]);
    let playerOnePair = this.getValue(playerOneCards[1][1]);

    let playerTwoTrips = this.getValue(playerTwoCards[0][1]);
    let playerTwoPair = this.getValue(playerTwoCards[1][1]);

    if(playerOneTrips > playerTwoTrips)
      return playerOneID;
    else if(playerOneTrips < playerTwoTrips)
      return playerTwoID;
    else{
      if(playerOnePair > playerTwoPair)
        return playerOneID;
      else if(playerOnePair < playerTwoPair)
        return playerTwoID;
      else
        return "tie";
    }

  }

  compareQuads(playerOne, playerTwo){

    let playerOneID = playerOne[0];
    let playerOneCards = playerOne[1];

    let playerTwoID = playerTwo[0];
    let playerTwoCards = playerTwo[1];

    let playerOneQuads = this.getValue(playerOneCards[0][1]);
    let playerOneKicker = this.getValue(playerOneCards[1]);

    let playerTwoQuads = this.getValue(playerTwoCards[0][1]);
    let playerTwoKicker = this.getValue(playerTwoCards[1]);

    if(playerOneQuads > playerTwoQuads)
      return playerOneID;
    else if(playerOneQuads < playerTwoQuads)
      return playerTwoID;
    else
      return this.compareValue(playerOne, playerTwo);

  }

  getWinningIndexs(hand){

    let newHand = [];

    for(let i = 0; i < hand.length - 1; i++)
      newHand = newHand.concat(hand[i]);

    return newHand;


  }

  processHands(sharedCards, playerCards){

    let players = [];

    for(var i in playerCards){
      let playerHand = playerCards[1];
      playerHand = playerHand.concat(sharedCards);


    }
  }

  getIndices(playerHand){

    let newHand =  [];
    let deck = Deck.getDeck();

    for(var i in playerHand)
      newHand.push( deck.indexOf(playerHand[i]) );

    return newHand;

  }

  determineWinner(players){

    let currentWinner = players[0];
    let currentWinnerID;
    let winningHand = currentWinner[1];
    let winningInfo = [];

    let ID = 0;
    let tiePool = [];
    let tieFlag = false;


    for(let i = 1; i < players.length; i++){

      currentWinnerID = currentWinner[0];

      let newPlayer = players[i];
      let newPlayerID = players[i][ID];
      let winnerID = this.compareHand(currentWinner, newPlayer);


      if(winnerID == currentWinnerID)
        continue;
      else if(winnerID == newPlayerID){

        currentWinner = newPlayer;
        winningHand = currentWinner[1];
        currentWinnerID = currentWinner[0];

        tiePool = [];
        tieFlag = false;

      }
      else{

        winningHand = currentWinner[1];
        tiePool.push(newPlayerID);
        tieFlag = true;

        if( !tiePool.includes(currentWinnerID) )
          tiePool.push(currentWinnerID);

      }

    }

    if(tieFlag){

      this.winningHand = this.getWinningIndexs(winningHand);
      return tiePool;

    }
    else{

      winningInfo.push(currentWinnerID);
      this.winningHand = this.getWinningIndexs(winningHand);
      return winningInfo;

    }

  }

  processHands(sharedCards, playerCards){

    let players = [];
    let sharedIndices = this.getIndices(sharedCards);

    for(var i in playerCards){

      let playerID = playerCards[i][0];
      let playerIndices = this.getIndices(playerCards[i][1]);
      let playerHand = this.getHand(sharedIndices, playerIndices);
      let player = [];
      player.push(playerID);
      player.push(playerHand);
      players.push(player);

    }

    let winner = this.determineWinner(players);
    return winner;

  }

  getWinningHand(){

    let deck = Deck.getDeck();
    let winningCards = [];
    this.winningHand.forEach(cardIndex => { winningCards.push(deck[cardIndex]); });
    return winningCards;

  }

}//End class


module.exports = PokerHands;
