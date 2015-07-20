var app = {};

app.getBeer = function(){

// AJAX request

  $.ajax({
    url: 'http://lcboapi.com/products?where=is_ocb&per_page=100',
    type: 'GET',
    dataType: 'jsonp',
    success: function(beer){
      console.log(beer.result);
      app.beers = beer.result;
    }
  });

}; // end getBeer

app.getFood = function(){

  $('#food').on('change', function() {

    // Get value for food input
    var originalFood = $(this).val();

    // Convert to lower case
    var food = originalFood.toLowerCase();
  
    // Create boundary variable for food item
    re = new RegExp("\\b" + food)
    
    // Find suggestions that match food item

    var matchedBeers = [];
    
    $.each(app.beers, function(index,beer) {        
           
      var hasSuggestion = beer.serving_suggestion && beer.serving_suggestion.match(re);
      var hasPicture = !!beer.image_thumb_url; // will be true or false
      var duplicates = matchedBeers.filter(function(item){
        return item.name === beer.name;
      });
      var isUnique = !duplicates.length;

      if (hasSuggestion && hasPicture && isUnique) {
        matchedBeers.push(beer);
      } else {

      // Empty success label
      $('#success').empty();

      // Add sorry label
      var sorry = $('<h2>').text('Sorry, please try another food.');
      $('#sorry').html(sorry);

      };
    
    }); // end each

    // Empty existing beer results
    $('#beer').empty();

    console.log(matchedBeers);

    $.each(matchedBeers,function(i,piece){

      // Empty sorry label
      $('#sorry').empty();

      // Success label
      var success = $('<h2>').text('You should be drinking:');
      $('#success').html(success);

      // Add beer name
      var name = $('<h3>').text(piece.name);

      // Set thumbnail image as background image
      var image = $('<div>').addClass('beerImage').css('background-image', 'url('+piece.image_thumb_url+')');

      // Create beer divs
      var selectedBeers = $('<div>').addClass('beer').append(name,image);
      $('#beer').append(selectedBeers);

    }); // end each

  }); // end change

}; // end getFood

$(function() {

  app.getBeer();
  app.getFood();

});  // End of doc ready