Cards = new Meteor.Collection("cards");

Cards.allow({
  insert: function(){return false},
  update: function(){return false},
  remove: function(){return false}
});