$(window).load(function() {
  function numberPadding(num, padLength) {
    num = String(num);
    /* Joins together an empty array with repeated 0s by padLength and cuts off the length of the variable num from this before joining it to said variable */
    return (new Array(padLength + 1).join(0)).substring(num.length) + num;
  }

  var Game = function(length) {
    function genArrCircleQuarters(len) {
      // Recursively generates an array of random elements with the class "circle-quarter".
      if (len > 0)
        return [$(".circle-quarter")[Math.floor(Math.random() * $(".circle-quarter").length)]].concat(genArrCircleQuarters(len - 1));
      else
        return [];
    };

    this.restart = function(clear) {
      if (clear) {
        this.clearGame();
      }
      for (var i in this.timers)
        clearTimeout(this.timers[i]);
    };

    this.clearGame = function() {
      this.count = 1,
      /* Keep the sequence at 20, so game ends once player 
       /* reaches that count. */
      this.sequence = genArrCircleQuarters(20),
      $("#count-text").html(numberPadding(this.count, 2));
    };

    // Initialize a game.
    this.timers = [],
    this.strict = false;
    this.restart(true);

    this.endGame = function() {
      var self = this;
      // When game ends, clear the previous game.
      self.restart(true);
      // Let the player know they've won.
      $("#end-window-shadow").fadeIn(function() {
        /* When player clicks anywhere at the game window, 
         /* fade out the end-window and flash a sequence, 
         /* starting the game over. */
        $("#end-window-shadow").click(function() {
          $("#end-window-shadow").fadeOut();
          $(".circle-quarter").attr("opacity", ".5");
          self.timers.push(setTimeout(function () {
            $(".circle-quarter").attr("opacity", "1");
            self.flashSequence();
          }, 400));                  
        });
      });
    };
    
    this.flashSequence = function() {
      var self = this;
      // If current sequence count is more than length, end game.
      if (!self.sequence[self.count - 1]) {
        self.endGame();
        return false;
      }

      // Unbind click/hover events while flashing sequences.
      $(".circle-quarter").unbind("click");
      $(".circle-quarter-activated").unbind("click");
      $(".circle-quarter").removeClass("circle-quarter-activated");
      function flashSequenceUpToCount(ind, callback) {
        // Check if the index is less than current count before
        // flashing sequence up to count.
        if (ind < self.count) {
          self.timers.push(setTimeout(function() {
            $(self.sequence[ind]).attr("opacity", ".5");
            new Audio($(self.sequence[ind]).attr("mp3")).play();
            self.timers.push(setTimeout(function() {
              $(self.sequence[ind]).attr("opacity", "1");
              flashSequenceUpToCount(ind + 1, callback);
            }, 300));
          }, 400));
        } else if (ind >= self.count) {
          // Once sequence has finished showing, allow player 
          // input after a tiny delay.
          self.timers.push(setTimeout(function() {
            $(".circle-quarter").addClass("circle-quarter-activated");
            $(".circle-quarter-activated").click(function() {
              game.wrongMove(game);
            });
            callback(0, self);
          }, 500));
        }
        return self.timers;
      }
      // Start flashing sequence at index 0.
      flashSequenceUpToCount(0, this.bindSequenceClicks);
    };

    this.bindSequenceClicks = function(ind, self) {
      var currButton = self.sequence[ind];
      // Unbind the default click event (a fail) for current.
      $(currButton).unbind("click");
      $(".circle-quarter-activated").click(function() {
        new Audio($(this).attr("mp3")).play();
      });
      $(currButton).mousedown(function() {
        $(currButton).attr("style", "fill: #3DAB4F; opacity: 1;");
      });
      $(currButton).mouseup(function() {
        $(currButton).removeAttr("style");
        $(currButton).unbind("mouseup mousedown");
      });
      
      if (ind < self.count) {
        $(currButton).click(function() {
          // After click succeeds, bind it so that clicking it will bring up a game fail.
          $(this).click(function() {
             self.wrongMove(self);
          });
          // Register the next in sequence as a click event.
          self.bindSequenceClicks(ind + 1, self);
        });        
      } else if (ind == self.count) {
        // Flash sequence after adding to the count.
        $("#count-text").html(numberPadding(self.count += 1, 2));
        self.flashSequence();
      }
    };
    
    this.wrongMove = function(self) {
      $("#count-text").html("!!");
      self.timers.push(setTimeout(function() {
        $("#count-text").html(numberPadding(self.count, 2));
        // If strict is enabled, clear game and restart.
        if (self.strict)
          self.restart(true);
        else
          self.restart();
        self.flashSequence();
      }, 600));
    };
    
    return this;
  };

  var game;
  
  $("#start-button").click(function() {
    $(".circle-quarter").attr("opacity", "1");
    // Check if a game already exists and if so, clear it.
    if (game) {
      game.restart();
      $("#count-text").html("--");
      game = false;
      // Lighten the color of start button to represent the game
      // not being started.
      $("#start-button-activated").attr("id", "start-button-box");
    } else {
      // Start game if one does not exist.
      
      // Darken color of start button to represent the game being
      // started.
      $("#start-button-box").attr("id", "start-button-activated");
      game = new Game();
      console.log(game.sequence);
      game.flashSequence();
    }
  });

  $("#strict-button").click(function() {
    if (game) {
      if (game.strict) {
        game.strict = false;
        $("#strict-button-activated").attr("id", "strict-button-box");
      } else {
        game.strict = true;
        $("#strict-button-box").attr("id", "strict-button-activated");
      }
    }
  });

  $("#about-button").click(function() {
    $("#about-window-shadow").fadeIn();
  });
  $("#about-window-shadow").click(function() {
    $("#about-window-shadow").fadeOut();
  });
});
