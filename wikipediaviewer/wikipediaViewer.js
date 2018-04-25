$(window).load(function() {
  $("#search-form").submit(function(event) {
    // Send a GET request for search results regarding the query
    var query = $("#search-input").val();
    wikipediaGET(query);
    event.preventDefault();
  });
});

function wikipediaGET(query) {
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    data: {"action": "opensearch", "format": "json", "search": query},
    dataType: "jsonp",
    success: templateSearchResults
  });
}

function templateSearchResults(data) {
  var resultTemplate = $("#result-template"),
      resultContainer = $("#result-container"),
      numberOfResults = data[1].length;
  // Clear any previous search results (if any)
  resultContainer.empty();
  // Assumes the results' titles are located at index 1, the descriptions at
  // index 2, and URLs at index 3
  
  // Loop through results and append results into HTML through template
  for (var i = 0; i < numberOfResults; i++) {
    var currResult = {
      "name": data[1][i],
      "desc": data[2][i],
      "link": data[3][i],
    };
    resultContainer.append(resultTemplate.render(currResult));
  }
  $(".result-body").fadeIn(500);
}

