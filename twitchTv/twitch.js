$(window).load(function() {
  var twitchUsers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "brunofin", "cretetion"];
  
  // Run twitchGETInfo on each user in array twitchUsers to input
  // data into the templates.
  twitchUsers.forEach(function(currUser) {
    twitchGETInfo(currUser, twitchStreamerTemplate)
  });

  $(".streamer-menu-link").click(function(data) {
    
    if (data.currentTarget.innerText == "Online") {
      // Target elements with the class '.streamer-tmpl' and not
      // '.streamer-online' and hide them from view.
      $(".streamer-tmpl").not(".streamer-online").slideUp();
      // Target all elements with the class '.streamer-online'
      // and make them visible.
      $(".streamer-online").slideDown();
    }
    else if (data.currentTarget.innerText == "Offline") {
      // Similar to above, but with offline streamers instead.
      $(".streamer-tmpl").not(".streamer-offline").slideUp();
      $(".streamer-offline").slideDown();
    }
    else 
      $(".streamer-tmpl").slideDown();
  });
});

function twitchGETInfo(user, callback) {
  $.getJSON('https://api.twitch.tv/kraken/channels/' + user + '/?callback=?', function(data) {
    // Combine the status with the game streaming and trail off with
    // an ellipsis if too lengthy.
    var streamInfo = data.game + ": " + data.status;
    if (streamInfo.length > 50)
      streamInfo = streamInfo.slice(0,47) + "...";
    
    if (data.error) {
      // Have the callback handle errors
      callback({
        displayName: user,
        url: false,
        game: data.message,
        logo: "http://dummyimage.com/100x100/000000/fff/&text=0x260x2363;", 
      });
    } else { 
      callback({
        displayName: data.display_name,
        // If streamer is offline, put in a place-holder.
        game: (data.game) ? streamInfo : "Offline.",
        url: data.url,
        // Use a placeholder image if no logo available.
        logo: (data.logo) ? data.logo : "http://dummyimage.com/100x100/000000/fff&text=0x260x2363;",
      });
    }
  });   
}

function twitchStreamerTemplate(streamerObj) {
  // Assumes that the object streamerObj contains the properties displayName, game, url, logo.

  // If the url property is false, render with the false-streamer-template.
  var tmpl = (streamerObj.url) ? $.templates("#streamer-template") : $.templates("#false-streamer-template");
  $("#streamer-container").append(tmpl.render(streamerObj));

  // Target the last appended streamer
  var currStreamer = $("#streamer-container > .streamer-tmpl:last");
  currStreamer.fadeIn(1000);
  // Add a class depending on whether the streamer is online or not.
  if (streamerObj.game == "Offline.")
    currStreamer.addClass("streamer-offline");
  else if (streamerObj.url)
    currStreamer.addClass("streamer-online");
}
