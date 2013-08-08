Meteor.subscribe("games");

Meteor.startup(function(){
  Pagination.style('bootstrap');
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




