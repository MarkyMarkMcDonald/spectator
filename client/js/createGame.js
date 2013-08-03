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

    }, function (error) {
      Session.set('error', error);
    });
    Meteor.Router.to('/');
  },

  'click .cancel': function() {
    Meteor.Router.to('/');
  }
});