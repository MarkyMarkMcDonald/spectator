Meteor.publish("games", function(){
  return Games.find({$or: [{"public": true}, {owner: this.userId}]});
}, {});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

Meteor.methods({
  getCard: function(options){
    check(options, {name: String});
    var name = options.name;

    var card = cards[name];
    if (!card) return JSON.stringify({});
    var cardNumber = 0;
    for(var key in card.sets) {
      var obj = card.sets[key];
      for (var prop in obj) {
        cardNumber = prop;
        break;
      }
      break;
    }
    cardNumber = card.sets[Object.keys(card.sets)[0]];
    card.image = "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + cardNumber;
    card.name = card["name"];
    return card;
  },

  moveCard: function(options){
    check(options, {
      game_id: NonEmptyString,
      currentPlayer: NonEmptyString,
      cardName: NonEmptyString,
      senderName: NonEmptyString,
      receiverName: NonEmptyString
    });

    // Make sure this is a game owner
    var owner = Games.findOne({_id: options.game_id}).owner;
    if (owner != this.userId){
      throw new Meteor.Error(403, "You don't own this game!");
    }

    var game_id = options.game_id;
    var currentPlayer = options.currentPlayer;
    var cardName = options.cardName;
    var zoneLeaving = options.senderName;
    var zoneEntering = options.receiverName;
    var sentCard = Meteor.call('getCard', {name: cardName});

    var unsetGamePattern = {_id: game_id};
    var nameFilter = {name: cardName};
    var cardsToUnsetFrom = currentPlayer + '.zones.' + zoneLeaving + '.cards';
    unsetGamePattern[cardsToUnsetFrom + '.name'] = cardName;
    var unsetPattern = {};
    unsetPattern[(cardsToUnsetFrom + '.$')] = nameFilter;

    Games.update(unsetGamePattern, {"$unset": unsetPattern}, function(error){
      var pullPattern = {};
      var cardsToPullFrom = currentPlayer + '.zones.' + zoneLeaving + '.cards';
      pullPattern[cardsToPullFrom] = null;

      var pushPattern = {};
      var cardsToPushTo = currentPlayer + '.zones.' + zoneEntering + '.cards';
      pushPattern[cardsToPushTo] = sentCard;
      Games.update({_id: game_id}, {"$pull": pullPattern, "$push": pushPattern}, function(){
      // async 4 lyfe
      });
    });
  }
});
