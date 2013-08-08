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
  'click .card': function(event){
    var currentPlayer = Session.get('currentPlayer');
    var game = findCurrentGame();
    var cardName = $(event.target).attr('data-name');
    var card = getCard(cardName, game);
    var target = currentPlayer + '.zones.hand.cards';
    var pushObject = {};
    pushObject[target] = card;
    Games.update({_id: game._id},{$push: pushObject});
  }
});

Template.board.rendered = function(){
  $('.board .cards').sortable({
    connectWith: '.cards',
    dropOnEmpty: true
  });

  $('.board').on('sortreceive', function(event, ui){
    var options = {};

    options.senderName = ui.sender.attr('data-name');
    options.receiverName = ui.item.parent('.cards').attr('data-name');

    options.cardName = ui.item.attr('data-name');
    options.game_id = findCurrentGame()._id;

    options.currentPlayer = Session.get('currentPlayer');

    Meteor.call('moveCard', options, function(error){
      console.log(error);
    });
  })
};