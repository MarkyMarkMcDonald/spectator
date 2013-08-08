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
