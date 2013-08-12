Meteor.Router.add({
  '/': 'home',
  '/games/new': 'createGameDialog',
  '/games/:id': function(id){
    Session.set('currentGame_id', id);
    return 'gameViewing';
  },
  '/games/:id/record/:currentPlayer': function(id, currentPlayer) {
    Session.set('currentPlayer', currentPlayer);
    Session.set('currentGame_id', id);
    return 'gameRecording';
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
