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

Template.board.rendered = function(){
  $('.board .cards').sortable({
    connectWith: '.cards',
    dropOnEmpty: true
  });

  $('.board').on('sortreceive', function(event, ui){
    var senderName = ui.sender.attr('data-name');
    var receiverName = ui.item.parent('.cards').attr('data-name');
    var cardName = ui.item.attr('data-name');

    var game = findCurrentGame();
    var currentPlayer = Session.get('currentPlayer');

    var sendingObject = {};
    var sendingTarget = currentPlayer + '.zones.' + senderName + '.cards';
    sendingObject[sendingTarget] = {name: cardName};

    var receivingObject = {};
    var receivingTarget = currentPlayer + '.zones.' + receiverName+ '.cards';
    receivingObject[receivingTarget] = {name: cardName};

    Games.update({_id: game._id},{$pull: sendingObject}, function(error){
      if (!error) {
        Games.update({_id: game._id},{$push: receivingObject});
      }
    });
  })
};