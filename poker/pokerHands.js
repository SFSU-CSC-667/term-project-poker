/* DONE WITH 

[X]Kickers
[X]Pair
[X]Two Pair
[X]Trips 
[X]Straight
[X]Flush
[X]Full House
[X]Quads
[X]Straight Flush
[X]Royal Flush

Check to see if hands account for Ace
[X]Kickers
[X]Pair
[X]Two Pair
[X]Trips 
[X]Straight
[X]Flush
[X]Full House
[X]Quads
[X]Straight Flush
[X]Royal Flush

Check to see if working with getHand()
[X]Kickers
[X]Pair
[X]Two Pair
[X]Trips 
[X]Straight
[X]Flush
[X]Full House
[X]Quads
[X]Straight Flush
[X]Royal Flush

Check to see if working with compareHand()
[X]Kickers
[X]Pair
[ ]Two Pair
[ ]Trips 
[X]Straight
[X]Flush
[ ]Full House
[ ]]Quads
[X]Straight Flush
[X]Royal Flush

*/



function testGetHand(){
  
  let hand = [ 0, 1];
  let sharedCards = [ 8, 9, 10, 11, 12 ];

  let playerHand = getHand(hand, sharedCards);
  console.log(playerHand);
}

function getHand(hand, sharedCards){
  
  let playerHand = [];

  if(containsRoyalFlush(hand, sharedCards)){
    playerHand = getRoyalFlushHand(hand, sharedCards);
    playerHand.push(10);
  }
  else if(containsStraightFlush(hand, sharedCards)){
    playerHand = getStraightFlushHand(hand, sharedCards);
    playerHand.push(9);
  }
  else if(containsQuads(hand, sharedCards)){
    playerHand = getQuadHand(hand, sharedCards);
    playerHand.push(8);
  }
  else if(containsFullHouse(hand, sharedCards)){
    playerHand = getFullHouseHand(hand, sharedCards);
    playerHand.push(7);
  }
  else if(containsFlush(hand, sharedCards)){
    playerHand = getFlushHand(hand, sharedCards);
    playerHand.push(6);
  }
  else if(containsStraight(hand, sharedCards)){
    playerHand = getStraightHand(hand, sharedCards);
    playerHand.push(5);
  }
  else if(containsTrips(hand, sharedCards)){
    playerHand = getTripsHand(hand, sharedCards);
    playerHand.push(4);
  }
  else if(containsTwoPair(hand, sharedCards)){
    playerHand = getTwoPairHand(hand, sharedCards);
    playerHand.push(3);
  }
  else if(containsPair(hand, sharedCards)){
    playerHand = getPairHand(hand, sharedCards);
    playerHand.push(2);
  }
  else{
    playerHand = getHighHand(hand, sharedCards);
    playerHand.push(1);
  }
  
  return playerHand;

}

/********************************************************************/
/********************* testing **************************************/
/********************************************************************/

/* test kickers */
function testKickers(){
  
  let hand = [0, 1];
  let sharedCards = [3, 20, 22, 23, 24]; 
  console.log("\nTesting high-hand getHand(): ", getHand(hand, sharedCards));
}

/* test pair */
function testPair(){
  
  let hand = [0, 1];
  let sharedCards = [2, 49, 16, 5, 13];
  
  console.log("\nTesting pair getHand(): ", getHand(hand, sharedCards));

}

/* test pair */
function testTwoPair(){
  
  let hand = [0, 1];
  let sharedCards = [2, 3, 13, 14, 15];
  
  console.log("\nTesting two-pair getHand(): ", getHand(hand, sharedCards));
}

/* test trips*/
function testTrips(){

  let hand = [0, 1];
  let sharedCards = [15, 9, 4, 13, 26];
  
  console.log("\nTesting trips getHand(): ", getHand(hand, sharedCards));
  
}

/* test straight */
function testStraight(){

  let hand = [13, 8];
  let sharedCards = [9, 10, 11, 25, 26];
  
  console.log("\nTesting straight getHand(): ", getHand(hand, sharedCards));
}

/* test flush */
function testFlush(){

  let hand = [26, 27];
  let sharedCards = [28, 29, 32, 34, 1];
  
  console.log("\nTesting flush getHand(): ", getHand(hand, sharedCards));

}

/* test full house */
function testFullHouse(){

  let hand = [0, 13];
  let sharedCards = [29, 1, 14, 27, 3];
  
  console.log("\nTesting full house getHand(): ", getHand(hand, sharedCards));
}

/* test Quads */
function testQuads(){

  let hand = [0, 13];
  let sharedCards = [26, 39, 1, 2, 3];
  
  console.log("\nTesting quads getHand(): ", getHand(hand, sharedCards));

}

/* test straight flush */
function testStraightFlush(){

  let hand = [39, 40];
  let sharedCards = [41, 42, 43, 44, 5];
  
  console.log("\nTesting straight flush getHand(): ", getHand(hand, sharedCards));
  
}

/* test royal flush */
function testRoyalFlush(){

  let hand = [39, 51];
  let sharedCards = [50, 49, 48, 44, 5];
  
  console.log("\nTesting royal flush getHand(): ", getHand(hand, sharedCards));
  
}

testKickers();
testPair();
testTwoPair();
testTrips();
testStraight();
testFlush();
testFullHouse();
testQuads();
testStraightFlush();
testRoyalFlush();

/********************************************************************/
/********************* prepare hand  ********************************/
/********************************************************************/
function combineHand(hand, sharedCards){

  hand = hand.concat(sharedCards);
  
  return hand;

}

function prepareHand(hand){

  for( var index in hand )
    hand[index] = hand[index] % 13;

  hand.sort(function(a,b){return a-b;});
  
  return hand;

}

function prepareFlush(hand){

  for( var index in hand )
    hand[index] = Math.floor( hand[index] / 13 );
  
  return hand;

}

function filter(card, hand){
  
  var newHand = [];
  
  for(let i in hand)
    if( hand[i]%13 != card )
      newHand.push(hand[i]);

  return newHand;

}

function getIndex(hand, pairCard){
  
  for(let i = 0; i < hand.length; i++)
    if(hand[i]%13 == pairCard)
      return hand[i];

}

/********************************************************************/
/********************** get kickers  ********************************/
/********************************************************************/

function getKickers(hand, numOfCards){
  
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

function getHighHand(hand, sharedCards){
  
  let numOfKickers = 5;
  let newHand = [];

  hand = combineHand(hand, sharedCards);

  newHand = getKickers(hand, numOfKickers);
  
  return newHand;

}

/********************************************************************/
/************************ find pair  ********************************/
/********************************************************************/
function containsPair(hand, sharedCards){

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();

  for( let index = 0; index < hand.length - 1; index++ )
    if( hand[index] == hand[index+1])
      return true;

  return false;


}

function getPairCard(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();
  
  /* return ace */
  if(hand[hand.length-1] == 0 && hand[hand.length-2] == 0)
    return 0;

  for( let index = 0; index < hand.length - 1; index++ )
    if( hand[index] == hand[index+1])
      return hand[index];

  return -1;

}

function getPairHand(hand, sharedCards){
  
  /* get pair cards and add to new hand */
  let pairCard = getPairCard(hand, sharedCards); 
  let pairHand = [];
  let newHand = [];
  let numOfKickers = 3;
  let kickers;

  hand = combineHand(hand, sharedCards);
  
  for(let i = 0; i < hand.length; i++)
    if(hand[i]%13 == pairCard)
      pairHand.push(hand[i]);
  
  hand = filter(pairCard, hand);
  kickers = getKickers(hand, numOfKickers);
  newHand.push(pairHand);
  newHand.push(kickers);

  return newHand;

}

/********************************************************************/
/************************ find two pair  ****************************/
/********************************************************************/
function containsTwoPair(hand, sharedCards){
  
  let pairFound = containsPair(hand, sharedCards);
  let pairCard;

  if(pairFound)
    pairCard = getPairCard(hand, sharedCards);
  else
    return false;

  hand = filter(pairCard, hand);
  sharedCards = filter(pairCard, sharedCards);
  
  pairFound = containsPair(hand, sharedCards);

  if(pairFound)
    return true;
  else
    return false;

}

function getPairIndex(hand, sharedCards, pairCard){

  let newHand = []; 
  let combinedHand = hand.concat(sharedCards);
  
  let firstCardIndex = getIndex(combinedHand, pairCard);
  let index = combinedHand.indexOf(firstCardIndex);

  combinedHand.splice(index, 1);

  let secondCardIndex = getIndex(combinedHand, pairCard);
  
  newHand.push(firstCardIndex);
  newHand.push(secondCardIndex);

  return newHand;

}

function getTwoPairHand(hand, sharedCards){
  
  let newHand = [];
  let pairCards = []; 
  let numOfKickers = 1;
  
  for(let i = 0; i < 2; i++){
    
    pairCard = getPairCard(hand, sharedCards);
    pairCardIndexs = getPairIndex(hand, sharedCards, pairCard);
    
    newHand = newHand.concat(pairCardIndexs);
    
    hand = filter(pairCard, hand);
    sharedCards = filter(pairCard, sharedCards);
  
  }
  
  hand = combineHand(hand, sharedCards);
  let kickers = getKickers(hand, numOfKickers);
  
  newHand = newHand.concat(kickers);

  return newHand;

}

/********************************************************************/
/********************** find trpple  ********************************/
/********************************************************************/
function containsTrips(hand, sharedCards){

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();
  
  for( let i = 0; i < hand.length - 2; i++)
    if(hand[i] == hand[i + 1])
      if(hand[i] == hand[i + 2])
        return true;

  return false;

}

function getTripsCard(hand, sharedCards){

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
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

function getTripsIndexs(hand, sharedCards, tripsCard){
  
  let newHand = [];
  hand = combineHand(hand, sharedCards);
  
  for(let i = 0; i < hand.length; i++)
    if(hand[i]%13 == tripsCard)
      newHand.push(hand[i]);

  return newHand;

}

function getTripsHand(hand, sharedCards){
  
  /* add trips to new hand */
  let tripsCard = getTripsCard(hand, sharedCards);
  let newHand = [];
  let numOfKickers = 2;
  
  newHand = getTripsIndexs(hand, sharedCards, tripsCard);

  hand = combineHand(hand, sharedCards);
  hand = filter(tripsCard, hand);
  
  let kickers = getKickers(hand, numOfKickers);
  
  newHand = newHand.concat(kickers);
  
  return newHand;

}

/********************************************************************/
/********************* find straight ********************************/
/********************************************************************/
function containsStraight(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand); 
  hand = removeDuplicates(hand);
   
  let ace = 0, king = 12, queen = 11, jack = 10, ten = 9; 
   
  if(hand.includes(ace)   && hand.includes(king) && hand.includes(queen) &&
     hand.includes(jack)  && hand.includes(ten))
     return true;

  /* find 5 consecutive numbers */
  for( let i = 0; i < hand.length - 4; i++ ){
    
    let tempHand = [];

    for( let j = i; j < i + 5; j++ )
      tempHand.push(hand[j]);
    
    if(checkStraight(tempHand))
      return true;
  
  }
  
  return false;

}

function checkStraight(hand){

  for( let i = 0; i < hand.length - 1 ; i++ )
    if(hand[i] != (hand[i + 1] - 1) )
       return false;

  return true;
  
}

function removeDuplicates(hand){
  
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

function getStraightCards(hand, sharedCards){
  
  let newHand = [];

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
 
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
    
    if(checkStraight(newHand.reverse()))
      return newHand;
    
  
  }

  return -1;

}

function getStraightHand(hand, sharedCards){
  
  let straightCards = getStraightCards(hand, sharedCards);
  let straightHand = [];

  hand = combineHand(hand, sharedCards);
  
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

function containsFlush(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareFlush(hand);
    
  /* need to check for grouping */
  for( let suit = 0; suit < 4; suit++ )
    if( checkFlush(suit, hand) )
      return true;
  
  return false;

}


function checkFlush(suit, cards){
  
  let counter = 0;

  for( let index in cards )
    if( suit == cards[index] )
      counter++;
  
  if(counter > 4)
    return true;

  return false;

}

function getFlushSuit(hand, sharedCards){

  hand = combineHand(hand, sharedCards);
  hand = prepareFlush(hand);
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
function getFlushCards(hand, sharedCards){
  
  let flushSuit = getFlushSuit(hand, sharedCards);
  let newHand = [];
  let cardSuit; 
  hand = combineHand(hand, sharedCards);
  
  for(let i = 0; i < hand.length; i++){
    
    cardSuit = Math.floor( hand[i] / 13 );
    
    if(cardSuit == flushSuit)
      newHand.push(hand[i]);

  }

  newHand.sort(function(a,b){ return a-b});
  newHand.reverse();
  
  return newHand;
  
}

function getFlushHand(hand, sharedCards){
  
  let flushCards = getFlushCards(hand, sharedCards);
    
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

function containsQuads(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  for( let i = 0; i < 4; i++ )
    if(hand[i] == hand[i+1] && hand[i] == hand[i+2] && hand[i] == hand[i+3])
      return true;
   
  return false;
  
}

function getQuadCard(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  for( let i = 0; i < 4; i++ )
    if(hand[i] == hand[i+1] == hand[i+2] == hand[i+3])
      return hand[i];
   
}

function getQuadHand(hand, sharedCards){
  
  let quadCard = getQuadCard(hand, sharedCards);
  let newHand = [];
  let numOfKickers = 1;
  
  hand = hand.concat(sharedCards);

  for( let i = 0; i < 4; i++ )
    if(hand[i]%13 == quadCard)
      newHand.push(hand[i]);
  
  hand = filter(quadCard, hand);
  let kickers = getKickers(hand, numOfKickers);

  newHand = newHand.concat(kickers);
  
  return newHand;
     
}

/********************************************************************/
/********************* find full house  *****************************/
/********************************************************************/

function containsFullHouse(hand, sharedCards){

  let tripsFound = containsTrips(hand, sharedCards);
  let tripsCard;
  
  if(tripsFound)
    tripsCard = getTripsCard(hand, sharedCards);
  else
    return false;
 
  hand = filter(tripsCard, hand);
  sharedCards = filter(tripsCard, sharedCards);

  let pairFound = containsPair(hand, sharedCards);

  if(pairFound)
    return true;
  else
    return false;

}

function getFullHouseHand(hand, sharedCards){
  
  let newHand = []; 

  let tripsCard = getTripsCard(hand, sharedCards);
  let tripIndex = getTripsIndexs(hand, sharedCards, tripsCard);

  hand = filter(tripsCard, hand);
  sharedCards = filter(tripsCard, sharedCards);
  
  let pairCard = getPairCard(hand, sharedCards); 
  let pairIndex = getPairIndex(hand, sharedCards, pairCard);

  newHand = newHand.concat(tripIndex);
  newHand = newHand.concat(pairIndex);

  return newHand;

}
/********************************************************************/
/****************** find straight flush  ****************************/
/********************************************************************/

function containsStraightFlush(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand.sort(function(a,b){ return a - b});

  for(let i = 0; i < hand.length - 4; i++)    
    if( (hand[i] == hand[i+1]-1 ) && (hand[i] == hand[i+2]-2 ) &&
        (hand[i] == hand[i+3]-3 ) && (hand[i] == hand[i+4]-4))
      return true;

  return false;

}

function getStraightFlushHand(hand, sharedCards){
  
  let flushFound = containsFlush(hand, sharedCards);

  if(flushFound)
    hand = getFlushCards(hand, sharedCards);

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

function containsRoyalFlush(hand, sharedCards){
  
  let flushFound = containsFlush(hand, sharedCards); 
  let ace = 0, king = 12, queen = 11, jack = 10, ten = 9;
  
  if(!flushFound)
    return false;

  let flushHand = getFlushHand(hand, sharedCards);

  if(flushHand[0]%13 == king &&
     flushHand[1]%13 == queen &&
     flushHand[2]%13 == jack &&
     flushHand[3]%13 == ten &&
     flushHand[4]%13 == ace)
     return true;

  return false;
 
}

function getRoyalFlushHand(hand, sharedCards){
  
  let flushHand = getFlushHand(hand, sharedCards);

  return flushHand;

}


/********************************************************************/
/********************* compare hands testing  ***********************/
/********************************************************************/

/* Testing no hand */
TestCompareHandHighHand();
function TestCompareHandHighHand(){
  
  playerOne = [];
  playerOneID = "Player1";
  playerTwo = [];
  playerTwoID = "Player2";

  playerOne.push(playerOneID);
  playerTwo.push(playerTwoID);

  let playerOneHand = [36, 37]; 
  let playerTwoHand = [23, 24];
  let sharedCards = [0, 1, 2, 3 ,25 ];
  
  playerOneHand = getHand(playerOneHand, sharedCards);
  playerTwoHand = getHand(playerTwoHand, sharedCards)
  
  playerOne.push(playerOneHand);
  playerTwo.push(playerTwoHand);

  console.log(playerOne);
  console.log(playerTwo);
  

  let winner = compareHand(playerOne, playerTwo);
  console.log("Testing High Hand: ", winner);

}

TestCompareHandPairHand();
function TestCompareHandPairHand(){
  
  playerOne = [];
  playerOneID = "Player1";
  playerTwo = [];
  playerTwoID = "Player2";

  playerOne.push(playerOneID);
  playerTwo.push(playerTwoID);

  let playerOneHand = [13, 37]; 
  let playerTwoHand = [14, 24];
  let sharedCards = [0, 1, 2, 3 ,25 ];
  
  playerOneHand = getHand(playerOneHand, sharedCards);
  playerTwoHand = getHand(playerTwoHand, sharedCards)
  
  playerOne.push(playerOneHand);
  playerTwo.push(playerTwoHand);

  console.log(playerOne);
  console.log(playerTwo);
  

  let winner = compareHand(playerOne, playerTwo);
  console.log("Testing High Hand: ", winner);

}


/********************************************************************/
/********************* compare winners ******************************/
/********************************************************************/

//what do I want to return?
function compareHand(playerOne, playerTwo ){
  
  let playerOneID = playerOne[0];
  let playerOneCards = playerOne[1];
  let playerOneHand = playerOneCards.pop();

  let playerTwoID = playerTwo[0];
  let playerTwoCards = playerTwo[1];
  let playerTwoHand = playerTwoCards.pop();
  
  if( playerOneHand > playerTwoHand )
    return playerOneID;
  else if( playerOneHand < playerTwoHand )
    return playerTwoID;
  else{

    /* in case of same type of hand e.g. both players have full houses */    
    if(playerOneHand == 1)
      return compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards);
    else if(playerOneHand == 2)
      return comparePair(playerOneID, playerOneCards, playerTwoID, playerTwoCards);
    else if(playerOneHand == 5)
      return compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards);
    else if(playerOneHand == 6)
      return compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards); 
    else if(playerOneHand == 9)
      return compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards); 
    else if(playerOneHand == 10)
      return compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards);
  }
   
}

function compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards){
    
  playerOneCards = prepareHand(playerOneCards);
  playerTwoCards = prepareHand(playerTwoCards);
  
  for(let i = 0; i < 5; i++){
    
    if(playerOneCards[i] > playerTwoCards[i])
      return playerOneID;
    else if(playerOneCards[i] < playerTwoCards[i])
      return playerTwoID;

  }

  return "tie";

}

function comparePair(playerOneID, playerOneCards, playerTwoID, playerTwoCards){
  
  playerOnePair = getValue(playerOneCards[0][0]);
  playerTwoPair = getValue(playerTwoCards[0][0]);
  
  playerOneKickers = playerOneCards[1];
  playerTwoKickers = playerTwoCards[1];
  
  if(playerOnePair > playerTwoPair)
    return playerOneID;
  else if(playerOnePair < playerTwoPair)
    return playerTwoID;
  else
    return compareValue(playerOneID, playerOneCards, playerTwoID, playerTwoCards);
}

function getValue(card){
  
  cardValue = card%13;
  
  if(cardValue == 0)
    cardValue = 13;

  return cardValue;

}

function compareTwoPair(playerOneID, playerOneCards, playerTwoID, playerTwoCards){

  playerOneFirstPair = getValue(playerOneCards[0][0]);

}

function compareTrips(playerOneID, playerOneCards, playerTwoID, playerTwoCards){



}
