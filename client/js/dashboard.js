Meteor.Router.filter('requireLogin', {only: 'createGame'});

Template.games.events({
  'click .create': function(){
    Meteor.Router.to('/games/new');
  }
});

Template.games.publicGames = function() {
  if (Meteor.userId()) {
    return Games.find({owner: !Meteor.userId(), public: true}, {sort: {name: 1}, limit: 10});
  } else {
    return Games.find({public: true}, {sort: {name: 1}, limit: 10});
  }
};

Template.games.userGames = function(){
  return Games.find({owner: Meteor.userId()}, {sort: {name: 1}});
};

Template.gameRow.isOwner = function(){
  return this.owner == Meteor.userId();
};