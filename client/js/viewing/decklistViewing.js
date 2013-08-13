/**
 * Pagination I whipped up, using Session variables and slicing arrays
 */

Session.setDefault('decklist1Page', 0);
Session.setDefault('decklist2Page', 0);

var defaultNumPages = 10;

Template.decklistsViewing.player1Decklist= function() {
  var currentPage = Session.get('decklist1Page');
  return findCurrentGame().player1.decklist.slice(currentPage * defaultNumPages, currentPage * defaultNumPages + defaultNumPages);
};

Template.decklistsViewing.player2Decklist= function(){
  var currentPage = Session.get('decklist2Page');
  return findCurrentGame().player2.decklist.slice(currentPage * defaultNumPages, currentPage * defaultNumPages + defaultNumPages);
};

Template.decklistsViewing.player1DecklistNav = function() {
  var html = '';
  var currentPage = Session.get('decklist1Page');
  var maxPages = findCurrentGame().player1.decklist.length / defaultNumPages - 1;
  if (currentPage > 0) {
    html += '<a class="prev"><</a>';
  }
  if (currentPage < maxPages) {
    html += '<a class="next">></a>';
  }
  return html;
};

Template.decklistsViewing.player2DecklistNav = function() {
  var html = '';
  var currentPage = Session.get('decklist2Page');
  var maxPages = findCurrentGame().player2.decklist.length / defaultNumPages - 1;
  if (currentPage > 0) {
    html += '<a class="prev"><</a>';
  }
  if (currentPage < maxPages) {
    html += '<a class="next">></a>';
  }
  return html;
};

Template.decklistsViewing.events({
  'click .player1 .prev': function() {
    var currentPage = Session.get('decklist1Page');
    Session.set('decklist1Page', currentPage - 1);
  },
  'click .player2 .prev': function() {
    var currentPage = Session.get('decklist2Page');
    Session.set('decklist2Page', currentPage - 1);
  },
  'click .player1 .next': function() {
    var currentPage = Session.get('decklist1Page');
    Session.set('decklist1Page', currentPage + 1);
  },
  'click .player2 .next': function() {
    var currentPage = Session.get('decklist2Page');
    Session.set('decklist2Page', currentPage + 1);
  }
});