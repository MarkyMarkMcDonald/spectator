Meteor.subscribe("games");

Meteor.startup(function(){
});

findCurrentGame = function(){
  var id = Session.get("currentGame_id");
  return id && Games.findOne({_id: id});
};

getCard = function(name, game){
  if (game == undefined) {
    game = findCurrentGame();
  }
  var namesEqual = function(card){
    return card.name == name;
  };
  return _.find(game.player1.decklist, namesEqual) ||
    _.find(game.player2.decklist, namesEqual);
};

/**
 * sorts by card type in this order: land, creatures, PWs, instants, sorceries,[equipment] artifacts, enchants, other
 * @param decklist array of card objects
 */
sortDecklist = function(decklist){
  return _.sortBy(decklist, function(card){
    if (!card.type) return 11;
    if (card.type.match(/land/i)) {
      return 0
    } else if (card.type.match(/creature/i)) {
      return 1
    } else if (card.type.match(/planeswalker/i)) {
      return 2
    } else if (card.type.match(/instant/i)) {
      return 3
    } else if (card.type.match(/sorcery/i)) {
      return 4
    } else if (card.type.match(/equipment/i)) {
      return 5
    } else if (card.type.match(/artifact/i)) {
      return 6
    } else if (card.type.match(/aura/i)) {
      return 7
    } else {
      return 10
    }
  })
};


