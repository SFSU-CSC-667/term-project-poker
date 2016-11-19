class Card{
  
  constructor( name ){
    
    this.name = name;
    this.suit = getSuit(value);
    this.value = getValue(name);

  }

  getSuit(name){
   
    if( name.contains('hearts') )
      return 0;
    else if( name.contains('diamonds') )
      return 1;
    else if( name.contains('spades') )
      return 2;
    else if( name.contains( 'clubs' ) )
      return 3;
  
  }

  getValue(name){
    
    if( name.contains('ace' ) )
      return 13;
    if( name.contains('two' ) )
      return 2;
    if( name.contains('three' ) )
      return 3;
    if( name.contains('four' ) )
      return 4;
    if( name.contains('five' ) )
      return 5;
    if( name.contains('six' ) )
      return 6;
    if( name.contains('seven' ) )
      return 7;
    if( name.contains('eight' ) )
      return 8;
    if( name.contains('nine' ) )
      return 9;
    if( name.contains('ten' ) )
      return 10;
    if( name.contains('jack' ) )
      return 11;
    if( name.contains('queen' ) )
      return 12;
    if( name.contains('king' ) )
      return 13;

  }

}
