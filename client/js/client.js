Meteor.subscribe("games");

Meteor.Router.add({
  '/': 'home',
  '/games/new': 'createGameDialog',
  '/games/:id': function(id){
    Session.set('currentGame_id', id);
    return 'selectedGame';
  },
  '/games/:id/record': function(id) {
    Session.set('currentGame_id', id);
    return 'recordingGame';
  }
});

Meteor.Router.beforeRouting = function() {
  Session.set('hovered-card', null);
};

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

Template.gameRow.isOwner = function(){
  return this.owner == Meteor.userId();
};

findCurrentGame = function(){
  var id = Session.get("currentGame_id");
  return id && Games.findOne({_id: id});
};

Template.selectedGame.game = Template.recordingGame.game  = findCurrentGame;

Template.selectedGame.events({
  'click .home': function(){
    Meteor.Router.to('/');
  },
  'mouseenter .card': showCard
});

