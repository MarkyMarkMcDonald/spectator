Meteor.subscribe("games");
Meteor.subscribe("cards");

Meteor.startup(function(){

});

var openCreateGameDialog = function(){
  Session.set("createError",null);
  Session.set("showCreateGameDialog", true);
};

Template.games.events({
  'click .create': openCreateGameDialog
});

var showCard = function(e){
  var name = $(e.target).attr('name');
  if (name) {
    Session.set("hoveredCard", name);
  }
};

Template.hoveredCard.card = function() {
  return Cards.findOne({name: Session.get("hoveredCard")});
};

Template.page.events({
  'mouseenter .card': showCard
});

Template.page.showCreateGameDialog = function() {
  return Session.get("showCreateGameDialog");
};

Template.games.games = function() {
  return Games.find({}, {sort: {name: 1}})
};

Template.gameRow.events({
  'click .select': function(event, template){
    Session.set("selectedGame_id",template.data._id);
  }
});

Template.selectedGame.game = function(){
  var selectedGame_id = Session.get("selectedGame_id");
  return Games.findOne({_id: selectedGame_id});
};

Template.createGameDialog.events({
  'click .save': function(event, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var player1 = template.find('.player1 .name').value;
    var player1Decklist = template.find('.player1 .decklist').value;
    var player2 = template.find('.player2 .name').value;
    var player2Decklist = template.find('.player2 .decklist').value;

    Meteor.call('createGame', {
      title: title,
      description: description,
      public: public,
      player1: player1,
      player2: player2,
      decklist1: player1Decklist,
      decklist2: player2Decklist

    }, function (error, game) {
      if (! error) {
        Session.set("selectedGame", game);
      }
    });
    Session.set("showCreateGameDialog", false);
  },

  'click .cancel': function() {
    Session.set("showCreateGameDialog", false);
  }
});