Template.gameViewing.game = findCurrentGame;

var getCardByEvent = function(e) {
  var name = $(e.target).attr('data-name');
  Session.set('hovered-card', getCard(name));
};

Template.gameViewing.events({
  'mouseenter .card': getCardByEvent
});

Session.setDefault('hovered-card', {});

Template.hoveredCard.card = function() {
  return Session.get('hovered-card');
};

Template.gameViewing.decklistQuery = function(){

};
