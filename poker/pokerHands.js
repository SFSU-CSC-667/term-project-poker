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
[ ]Royal Flush

*/


/********************************************************************/
/********************* testing **************************************/
/********************************************************************/

/* test kickers */
function testKickers(){
  
  /* ace, 2, 9, 7, jack, queen, king */
  let hand = [0, 1];
  let sharedCards = [8, 20, 22, 23, 24];
  hand = combineHand(hand, sharedCards);
  
  let numOfKickers = 5; 
  let kickers = getKickers(hand, numOfKickers);
  
  /* should be 0, 24, 23, 22, 8 */ 
  console.log("\nTesting kickers hand with 5 cards:", kickers);
}

/* test pair */
function testPair(){
  
  let hand = [0, 1];
  let sharedCards = [2, 3, 4, 5, 13];
  
  let pairFound = containsPair(hand, sharedCards);
  console.log("\nTesting containsPair():", pairFound, ": true" );
  
  let pairHand = getPairHand(hand, sharedCards);
  console.log("Testing getPairHand():", pairHand, ": [ 0, 13, 5, 4, 3]" );
  
  sharedCards = [2, 3, 4, 5, 6];

  pairFound = containsPair(hand, sharedCards);
  console.log("Testing containsPair():", pairFound, ": false" );
}

/* test pair */
function testTwoPair(){
  
  let hand = [0, 1];
  let sharedCards = [14, 3, 4, 5, 13];
  
  let twoPairFound = containsTwoPair(hand, sharedCards);
  console.log("\nTesting containsTwoPair():", twoPairFound);
  
  let twoPairHand = getTwoPairHand(hand, sharedCards);
  console.log("Testing getTwoPairHand():", twoPairHand);
}

/* test trips*/
function testTrips(){

  let hand = [0, 1];
  let sharedCards = [2, 3, 4, 13, 26];
  
  let tripsFound = containsTrips(hand, sharedCards);
  console.log("\nTesting containsTrips():", tripsFound, ": true" );
  
  let tripsHand = getTripsHand(hand, sharedCards);
  console.log("Testing getTripsHand():", tripsHand, ": [ 0, 13, 26, 4, 3]" );
  
  sharedCards = [2, 3, 4, 5, 26];

  tripsFound = containsTrips(hand, sharedCards);
  console.log("Testing containsTrips():", tripsFound, ": false" );
  
}

/* test straight */
function testStraight(){

  let hand = [0, 1];
  let sharedCards = [15, 14, 29, 17, 5];
  
  let straightFound = containsStraight(hand, sharedCards);
  console.log("\nTesting containsStraight():", straightFound);
  
  let straightCards = getStraightCards(hand, sharedCards);
  console.log("Testing getStraighCards():", straightCards);
 
  let straightHand = getStraightHand(hand, sharedCards);
  console.log("Testing getStraightHand():", straightHand);

}

/* test flush */
function testFlush(){

  let hand = [26, 27];
  let sharedCards = [28, 29, 32, 34, 1];
  
  let flushFound = containsFlush(hand, sharedCards);
  console.log("\nTesting containsFlush():", flushFound);
  
  let flushSuit = getFlushSuit(hand, sharedCards);
  console.log("Testing getFlushSuit():", flushSuit);
  
  let flushHand = getFlushHand(hand, sharedCards);
  console.log("Testing getSuitHand():", flushHand);

}

/* test full house */
function testFullHouse(){

  let hand = [0, 13];
  let sharedCards = [26, 1, 14, 2, 3];
  
  let fullHouseFound = containsFullHouse(hand, sharedCards);
  console.log("\nTesting containsFullHouse():", fullHouseFound);
  
  let fullHouseHand = getFullHouseHand(hand, sharedCards);
  console.log("Testing getFullHouseHand():", fullHouseHand);
}

/* test Quads */
function testQuads(){

  let hand = [0, 13];
  let sharedCards = [26, 39, 1, 2, 3];
  
  let quadFound = containsQuads(hand, sharedCards);
  console.log("\nTesting containsQuads:", quadFound);
  
  let quadHand = getQuadHand(hand, sharedCards);
  console.log("Testing getQuadHand():", quadHand);

}

/* test straight flush */
function testStraightFlush(){

  let hand = [39, 40];
  let sharedCards = [41, 42, 43, 44, 5];
  
  let straightFlushFound = containsStraightFlush(hand, sharedCards);
  console.log("\nTesting containsStraightFlush:", straightFlushFound);
  
  let straightFlushHand = getStraightFlushHand(hand, sharedCards);
  console.log("Testing getQuadHand():", straightFlushHand);
  
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

  hand.sort();
  
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

  for( let index = 0; index < hand.length - 1; index++ )
    if( hand[index] == hand[index+1])
      return hand[index];

  return -1;

}

function getPairHand(hand, sharedCards){
  
  /* get pair cards and add to new hand */
  let pairCard = getPairCard(hand, sharedCards); 
  let newHand = [];
  let numOfKickers = 3;
  let kickers;

  hand = combineHand(hand, sharedCards);
  
  for(let i = 0; i < hand.length; i++)
    if(hand[i]%13 == pairCard)
      newHand.push(hand[i]);
  
  hand = filter(pairCard, hand);
  kickers = getKickers(hand, numOfKickers);
  newHand = newHand.concat(kickers);

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
   
  if(hand.includes(0))
    hand.push(13);
  
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
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  /* find 5 consecutive numbers */
  for( let i = 6; i > 3; i-- ){
    
    let newHand = [];

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
  hand.sort();
  
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

function getFlushCards(hand, sharedCards){
  
  let flushSuit = getFlushSuit(hand, sharedCards);
  let newHand = [];
  let cardSuit; 
  hand = combineHand(hand, sharedCards);
  
  //TODO: Max cards out at 5. Return highest cards

  for(let i = 0; i < hand.length; i++){
    
    cardSuit = Math.floor( hand[i] / 13 );
    
    if(cardSuit == flushSuit)
      newHand.push(hand[i]);

  }

  newHand.sort();
  newHand.reverse();
  
  return newHand;
  
}

function getFlushHand(hand, sharedCards){
  
  let flushCards = getFlushCards(hand, sharedCards);
   
   
  if(flushCards.length == 5)
    return flushCards;

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
    if(hand[i] == hand[i+1] == hand[i+2] == hand[i+3])
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
  hand.sort();

  for(let i = 0; i < hand.length - 4; i++)    
    if( (hand[i] == hand[i+1]-1 ) && (hand[i] == hand[i+2]-2 ) &&
        (hand[i] == hand[i+3]-3 ) && (hand[i] == hand[i+4]-4))
      return true;

  return false;

}


function getStraightFlushHand(hand, sharedCards){
  
  let newHand = [];
  hand = combineHand(hand, sharedCards);
  hand.sort();
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
