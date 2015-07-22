var app = {};

app.getBeer = function(){

// AJAX request

  $.ajax({
    url: 'http://lcboapi.com/products?where=is_ocb&per_page=100',
    headers: { 'Authorization': 'MDoyNTUyZjBiNi0yYTJhLTExZTUtODFkNi1hM2RmZmU0ZjYwN2I6aVFkVkVrc294dk1LOGYzaDdpOHpwZlYxQ2N4V1V0SkdUSVRq' },
    type: 'GET',
    dataType: 'jsonp',
    success: function(beer){
      app.beers = beer.result;
      $.ajax({
        // Gets second page of results (only 148 beers total)
        url: 'http://lcboapi.com/products?where=is_ocb&per_page=100&callback=jQuery110202786614007782191_1437587406535&_=1437587406536&page=2',
        headers: { 'Authorization': 'MDoyNTUyZjBiNi0yYTJhLTExZTUtODFkNi1hM2RmZmU0ZjYwN2I6aVFkVkVrc294dk1LOGYzaDdpOHpwZlYxQ2N4V1V0SkdUSVRq' },
        type: 'GET',
        dataType: 'jsonp',
        success: function(beer2){
          // Combines both results into one variable
          app.allBeers = beer.result.concat(beer2.result);
          console.log(app.allBeers);
        }
      });
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
    
    $.each(app.allBeers, function(index,beer) {        
           
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

      // Add tasting note to hover over beer image
      var tasting_note = $('<p>').addClass('tasting').text(piece.tasting_note);

      // Set thumbnail image as background image
      var image = $('<div>').addClass('beerImage').css('background-image', 'url('+piece.image_thumb_url+')');

      // Create beer divs
      var selectedBeers = $('<div>').addClass('beer').append(name,image,tasting_note);

      $('#beer').append(selectedBeers);



    }); // end eachs

  }); // end change

}; // end getFood

$(function() {

  app.getBeer();
  app.getFood();

});  // End of doc ready