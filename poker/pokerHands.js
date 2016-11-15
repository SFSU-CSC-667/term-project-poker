var hands = [ 0 , 1 ];
var sharedCards = [ 12 , 13 , 26 , 39 , 5 ];

/* testing straight */
var straightSharedCards = [ 2, 3, 4, 5, 6 ];
var straightHand = getStraight(hands, straightSharedCards);
console.log("checking for straight:" , straightHand);

/* testing flush */

/* testing quad */
/*
let quadSharedCards = [ 13, 26, 39, 40, 41]
let quadHand = getQuadHand(hands, quadSharedCards);
console.log("checking for quads:", quadHand);
*/
/* testing pair */
var pairSharedCards = [ 2 , 3 , 4 , 5 , 13 ]
var pairHand = getPairHand(hands, pairSharedCards);
console.log("checking for getPairsHand", pairHand);

/* testing trips */

var tripsSharedCards = [ 13 , 26 , 8 , 22 , 7 ]
var tripHand = getTripsHand(hands, tripsSharedCards);
console.log("checking for trips:", tripHand);


/* test for full house */

/*
var fullHouseSharedCards = [ 13 , 20 , 14 , 5 , 7 ]
var fullHouseFound = containsFullHouse(hands, fullHouseSharedCards);
console.log("contains full house:", fullHouseFound);
var fullHouseHand = getFullHouseHand(hands, fullHouseSharedCards);
console.log("checking for full house:", fullHouseHand);
*/
/* test for two pair */
/*
var twoPairSharedCards = [ 2 , 3 , 4 , 13 , 14 ]
var twoPairHand = getTwoPairHand(hands, twoPairSharedCards);
console.log("checking for two pair", twoPairHand);
*/
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

function getKickers(hand, numOfCards){
  
  var kickers = []
  let tempHand = hand;

  /*   */
  for(let i = 0; i < numOfCards; i++){
    
    let largestCard = hand[i];
    let indexToRemove = i;

    for( let j = i+1 ; j < hand.length ; j++ )
      
      if( largestCard%13 < hand[j]%13 ){
        
	console.log(largestCard, hand[j]);
	largestCard = hand[j];
	indexToRemove = j;
      
      }
    
    console.log(hand);
    tempHand.push(largestCard);
    hand.splice(indexToRemove, 1);

  }

  for(var index = 0; index < numOfCards; index++)
    kickers.push(hand[index]);
      
  return kickers;

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
  console.log(hand, sharedCards);
  if(pairFound)
    return true;
  else
    return false;

}

function getTwoPairHand(hand, sharedCards){
  
  let newHand = [];
  let pairCard = getPairCard(hand, sharedCards);
  
  newHand.push(pairCard);
  newHand.push(pairCard);
  
  hand = filter(pairCard, hand);
  sharedCards = filter(pairCard, sharedCards);
  pairCard = getPairCard(hand, sharedCards);

  newHand.push(pairCard);
  newHand.push(pairCard);

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();
  
  let numOfKickers = 1;
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
  
  for( var index = 0; index < hand.length - 2; index++)
    if(hand[index] == hand[index+1])
      if(hand[index] == hand[index +2])
        return true;

  return false;

}

function getTripsCard(hand, sharedCards){

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();
  
  for( var index = 0; index < hand.length - 2; index++)
    if(hand[index] == hand[index+1])
      if(hand[index] == hand[index +2])
        return hand[index];

}


function getTripsHand(hand, sharedCards){
  
  /* add trips to new hand */
  let tripsCard = getTripsCard(hand, sharedCards);
  let newHand = [];
  let numOfKickers = 2;
  
  hand = combineHand(hand, sharedCards);

  for(let i = 0; i < hand.length; i++)
    if( hand[i]%13 == tripsCard )
      newHand.push(hand[i]);
  
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
  
  /* find 5 consecutive numbers */
  for( let i = 6; i > 3; i-- ){
    
    let tempHand = [];

    for( let j = i; j > i - 5; j-- )
      tempHand.push(hand[j]);

    if(checkStraight(tempHand))
      return true;
  
  }

  return false;

}

function checkStraight(cards){
  
  cards.reverse();
  
  /* Note need to check for Ace at the end */
  if( cards.includes(0) )
    cards.push(13);

  for( let i = 0; i < hands.length - 1 ; i++ )
    if(cards[i] != (cards[i + 1] - 1) )
       return false;

  return true;
  
}

function getStraight(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  /* find 5 consecutive numbers */
  for( let i = 6; i > 3; i-- ){
    
    let newHand = [];

    for( let j = i; j > i - 5; j-- )
      newHand.push(hand[j]);

    if(checkStraight(newHand))
      return newHand;
  
  }

  return -1;

}
/********************************************************************/
/********************* find flush ** ********************************/
/********************************************************************/

function containsFlush(hand, sharedCards){
  
  hand = combinehand(hand, sharedcards);
  hand = prepareFlush(hand);
    
  /* need to check for grouping */
  for( let suit = 0; suit < 4; suit++ )
    if( checkflush(suit, hand) )
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

function getFlushHand(hand, sharedCards){

  hand = combinehand(hand, sharedcards);
  hand = prepareflush(hand);


}

function getFlushSuit(hand, sharedcards){




}
/********************************************************************/
/********************* find quads ***********************************/
/********************************************************************/

function containsQuads(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  for( let i = 0; i < 4; i++ )
    if(hand[i] == hand[i=1] == hand[i+2] == hand[i+3])
      return true;
   
  return false;
  
}

function getQuadCard(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  for( let i = 0; i < 4; i++ )
    if(hand[i] == hand[i=1] == hand[i+2] == hand[i+3])
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

  newHand.push(kickers);
  
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
  sharedCards = filter(tripsCard, hand);

  let pairFound = containsPair(hand, sharedCards);

  if(pairFound)
    return true;
  else
    return false;

}

function getFullHouseHand(hand, sharedCards){
  
  let newHand = []; 
  let tripsCard = getTripsCard(hand, sharedCards);

  newHand.push(tripsCard);
  newHand.push(tripsCard);
  newHand.push(tripsCard); 
  
  hand = filter(tripsCard, hand);
  sharedCards = filter(tripsCard, hand);

  let pair = getPairCard(hand, sharedCards);
  
  newHand.push(pair);
  newHand.push(pair);
  
  return newHand;

}


/********************************************************************/
/********************* find royal flush  ****************************/
/********************************************************************/
