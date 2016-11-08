
var hands = [ 0 , 1 ];
var sharedCards = [ 12 , 13 , 26 , 39 , 5 ];


/* testing straight */
var straightHand = findStraight(hands, sharedCards);
console.log("checking for straight:" , straightHand);

/* testing flush */
var flushHand = findFlush(hands, sharedCards);
console.log("checking for flush:" ,flushHand);

/* testing quad */
var quadHand = findQuads(hands, sharedCards);
console.log("checking for quads:", quadHand);

/* testing pair */
var pairSharedCards = [ 2 , 3 , 4 , 5 , 13 ]
var pairHand = getPairHand(hands, pairSharedCards);
console.log("checking for getPairsHand", pairHand);

/* testing trips */
var tripsSharedCards = [ 13 , 26 , 8 , 5 , 7 ]
var tripHand = findTripple(hands, tripsSharedCards);
console.log("checking for trips:", tripHand);

/* test for full house */
var fullHouseSharedCards = [ 13 , 26 , 14 , 5 , 7 ]
var fullHouseHand = findFullHouse(hands, fullHouseSharedCards);
console.log("checking for full house:", fullHouseHand);

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

  for(var index in hand)
    if(card != hand[index])
      newHand.push(hand[index]);

  return newHand;

}

function getKickers(hand, num){
  
  var kickers = []

  for(var index = 0; index < num; index++)
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

  for( var index = 0; index < hand.length - 1; index++ )
    if( hand[index] == hand[index+1])
      return true;

  return false;


}

function getPair(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();

  for( var index = 0; index < hand.length - 1; index++ )
    if( hand[index] == hand[index+1])
      return hand[index];

  return -1;

}

function getPairHand(hand, sharedCards){
  
  /* get pairs */
  var pair = getPair(hand, sharedCards);
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();
  
  /* add pairs to new hand */
  var newHand = [];
  newHand.push(pair);
  newHand.push(pair);
  
  /* add kickers to new hand */
  hand = filter(pair, hand);
  kickers = getKickers(hand, 3);
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
        return hand[index];

  return -1;

}


function getTripple(hand, sharedCards){

  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  hand.reverse();
  
  for( var index = 0; index < hand.length - 2; index++)
    if(hand[index] == hand[index+1])
      if(hand[index] == hand[index +2])
        return hand[index];

  return -1;

}

/********************************************************************/
/********************* find straight ********************************/
/********************************************************************/
function findStraight(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  /* find 5 consecutive numbers */
  for( var i = 6; i > 3; i-- ){
    
    var tempHand = [];

    for( var j = i; j > i - 5; j-- )
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

  for( var index = 0; index < hands.length -1 ; index++ )
    if(cards[index] != (cards[index + 1] - 1) )
       return false;

  return true;
  
}

/********************************************************************/
/********************* find flush ** ********************************/
/********************************************************************/

function findFlush(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareFlush(hand);
    
  /* need to check for grouping */
  for( var suit = 0; suit < 4; suit++ )
    if( checkFlush(suit, hand) )
      return true;
  
  return false;

}


function checkFlush(suit, cards){
  
  var counter = 0;

  for( var index in cards )
    if( suit == cards[index] )
      counter++;
  
  if(counter > 4)
    return true;

  return false;

}

/********************************************************************/
/********************* find quads ***********************************/
/********************************************************************/

function findQuads(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  for( let i = 0; i < 4; i++ ){
  
    let counter = 1;
    
    for( let j = i; j < 7; j++ )
      if(hand[j] == hand[j+1])
        counter++;
      else
	break;
       
    if(counter >= 4)
      return true;
      
  }

  return false;
  
}
/********************************************************************/
/********************* find full house  *****************************/
/********************************************************************/

function findFullHouse(hand, sharedCards){
  
  hand = combineHand(hand, sharedCards);
  hand = prepareHand(hand);
  
  var tripple;
  var pair;
  var newHand = [];
  
  
  if((tripple = findTripple(hand)) != -1 ){
  
    hand = filter(tripple, hand);
    newHand.push(tripple);
    newHand.push(tripple);
    newHand.push(tripple);
  
  }
  else
    return -1;

  if( containsPair(hand) ){

    pair = getPair(hand);
    newHand.push(pair);
    newHand.push(pair);
  
  }
  else
    return -1;

  return newHand;

}


/********************************************************************/
/********************* prepare hand  ********************************/
/********************************************************************/


