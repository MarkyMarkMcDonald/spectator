Meteor.subscribe("games");
Meteor.subscribe("cards");


Meteor.Router.add({
  '/': 'home',
  '/games/new': 'createGameDialog',
  '/games/:id': function(id){
    Session.set('selectedGame_id', id);
    return 'selectedGame';
  }
});

Meteor.Router.filters({
  requireLogin: function(page) {
    if (this.userId) {
      return page;
    } else {
      return 'home'
    }
  }
});

Meteor.Router.filter('requireLogin', {only: 'createGame'});

Template.games.events({
  'click .create': function(){
    Meteor.Router.to('/games/new');
  }
});

Session.setDefault('hovered-card', {});

var showCard = function(e){
  var name = $(e.target).attr('name');
  Meteor.http.get('/card/' + name, {}, function(error,data){
    var json = JSON.parse(data.content);
    Session.set('hovered-card', json);
  });
};

Template.hoveredCard.card = function() {
  return Session.get('hovered-card');

};

Template.games.games = function() {
  return Games.find({}, {sort: {name: 1}})
};


Template.selectedGame.game = function(){
  var selectedGame_id = Session.get("selectedGame_id");
  return selectedGame_id && Games.findOne({_id: selectedGame_id});
};

Template.selectedGame.events({
  'click .home': function(){
    Meteor.Router.to('/');
  },
  'mouseenter .card': showCard
});

