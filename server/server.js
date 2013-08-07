Meteor.publish("games", function(){
  return Games.find({$or: [{"public": true}, {owner: this.userId}]});
}, {});

Meteor.Router.add('/card/:name', 'GET', function(name) {
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
  var cardNumber = card.sets[Object.keys(card.sets)[0]];
  card.image = "http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + cardNumber;
  card.name = card["name"];
  return JSON.stringify(card);
});

Meteor.methods({
  moveCard: function(options){
    try {
      check(options, {
        game_id: Match.Any,
        currentPlayer: Match.Any,
        cardName: Match.Any,
        senderName: Match.Any,
        receiverName: Match.Any
      });
      var owner = Games.findOne({_id: options.game_id}).owner;
      check(this.userId, owner);
    } catch(error) {
      console.log("server moveCard error: " + error);
    }

    var game_id = options.game_id;
    var currentPlayer = options.currentPlayer;
    var cardName = options.cardName;
    var senderName = options.senderName;
    var receiverName = options.receiverName;

    var sendingObject = {};
    var sendingTarget = currentPlayer + '.zones.' + senderName + '.cards';
    sendingObject[sendingTarget] = null;

    var sendingObjectUnset = {};
    var sendingTargetUnset = currentPlayer + '.zones.' + senderName + '.cards.$';
    sendingObjectUnset[sendingTargetUnset] = {name: cardName};
    var unsetSelector = {_id: game_id};
    unsetSelector[sendingTarget] = {name: cardName};

    var receivingObject = {};
    var receivingTarget = currentPlayer + '.zones.' + receiverName + '.cards';
    receivingObject[receivingTarget] = {name: cardName};

    Games.update(unsetSelector, {$unset: sendingObjectUnset}, function(error){
      if (error) {
        console.log(1);
        console.log(error);
      } else {
        Games.update({_id: game_id},{$pull: sendingObject}, function(error){
          if (error) {
            console.log(2);
            console.log(error);
          } else {
            Games.update({_id: game_id},{$push: receivingObject}, function(error){
              if (error) {
                console.log(3);
                console.log(error);
              }
            });
          }
        });
      }
    });
  }
});
