
var hands = ["0", "20"];
var sharedCards = ["12", "13", "26", "39", "5"];


var straightHand = findStraight(hands, sharedCards);
var flushHand = findFlush(hands, sharedCards);
var quadHand = findQuads(hands, sharedCards);

console.log("checking for straight:" , straightHand);
console.log("checking for flush:" ,flushHand);
console.log("checking for quads:", quadHand);

function countPairs(hand, sharedCards){
  
  var counter = 0;

  if(findPair(hand[0], sharedCards))
    counter++;

  if(findPair(hand[1], sharedCards))
    counter++;

  if(findPair(hand[0], hand[1]))
    counter++;

  if(counter >= 2)
    return 2;

  if(counter == 1)
    return 1;

  return 0;

}

function findPair(card, sharedCards){
  
  card %= 13;
  
  for( var index in sharedCards)
    sharedCards[index] = sharedCards[index] % 13;

  for(var index in sharedCards)  
    if(card == sharedCards[index]);
      return true;
  
  return false;

}

function findTripple(card, sharedCards){

  



}

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
  
  for( var i = 0; i < 4; i++ ){
  
    var counter = 1;
    
    for( var j = i; j < 7; j++ )
      if(hand[j] == hand[j+1])
        counter++;
    
    if(counter >= 4)
      return true;
      
  }

  return false;
  
}
