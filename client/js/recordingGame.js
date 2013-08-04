Session.setDefault('currentPlayer','player1');

Template.recordingGame.currentPlayer = function(){
  var player = Session.get('currentPlayer');
  return this[player];
};

Template.recordingGame.events({
  'click .switch-players': function(){
    var currentPlayer = Session.get('currentPlayer');
    var nextPlayer = (currentPlayer == 'player1') ? 'player2' : 'player1';
    Session.set('currentPlayer', nextPlayer)
  },
  'click .details .card': function(){
    var currentPlayer = Session.get('currentPlayer');
    var game = findCurrentGame();
    var target = currentPlayer + '.zones.play.cards';
    var pushObject = {};
    pushObject[target] = {name: this.name};
    Games.update({_id: game._id},{$push: pushObject});
  }
});