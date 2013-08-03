Games = new Meteor.Collection("games");

Games.allow({

  insert: function (userId, playingField) {
    return false; // no cowboy inserts -- use createGame method
  },
  update: function (userId, game, fields, modifier) {
    if (userId !== game.owner)
      return false; // not the owner

    var allowed = ["title", "description"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, playingField) {
    // Only the owner can remove a playing field
    return playingField.owner === userId;
  }

});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var NonEmptyArray = Match.Where(function (x) {
  return !_.isEmpty(x);
});

var decklistFromString = function(decklist) {
  var lines = decklist.split('\n');
  var cards = [];
  lines.forEach(function(line){
    var name = line.slice(2);
    var quantity = line[0];
    cards.push({
      quantity: quantity,
      name: name
    })
  });
  return cards;
};

Meteor.methods({
  // options should include: title, description, public, player1, player2, decklist1, decklist2
  createGame: function(options) {
    check(options, {
      title: NonEmptyString,
      description: NonEmptyString,
      player1: NonEmptyString,
      player2: NonEmptyString,
      decklist1: NonEmptyArray,
      decklist2: NonEmptyArray,
      public: Match.Optional(Boolean)
    });

    if (options.title.length > 100) {
      throw new Meteor.Error(413, "Title too long (100 chars max)");
    }
    if (options.description.length > 1000) {
      throw new Meteor.Error(413, "Description too long (1000 chars max)");
    }
    if (! this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    var defaultZones = {
      hand: {cards: [], name: 'hand'}, // optimize later
      stack: {cards: [], name: 'stack'},
      play: {cards:[], name: 'play'},
      graveyard: {cards:[], name: 'graveyard'},
      exile: {cards:[], name: 'exile'}
    };

    var player1 = {
      name: options.player1,
      decklist: decklistFromString(options.decklist1),
      zones: defaultZones
    };

    var player2 = {
      name: options.player2,
      decklist: decklistFromString(options.decklist2),
      zones: defaultZones
    };

    return Games.insert({
      owner: this.userId,
      title: options.title,
      description: options.description,
      public: !! options.public,
      player1: player1,
      player2: player2
    })
  }
});

