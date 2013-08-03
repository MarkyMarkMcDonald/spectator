Meteor.Router.add('/card/:name', 'GET', function(name) {
  var card = cards[name];
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
