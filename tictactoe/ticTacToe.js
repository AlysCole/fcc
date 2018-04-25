$(window).load(function() {
  var userMarker = "";
  var aiMarker = "";

  // Load the game squares.
  function loadGameRow() {
    $(".game-row").each(function() {
      for (var i = 0; i < 3; i++) {
        $(this).append("<div class='game-square'><span class='game-content no-select'></span></div>");
      }
    });
  }
  loadGameRow();

  function calculateStateEnd(state) {
    // Array of valid row positions.
    var rowPositions = [[0,4,8],[2,4,6],[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8]];
    // Map state into an array of valid rows.
    var validRows = rowPositions.map(function(rowInds) {
      return rowInds.map(function(ind) {
        return state[ind];
      });
    });

    // Set a global counter for the entire game state.
    var globalCount = {"X": 0, "O": 0, "blanks": 0};
    for (var row = 0; row < validRows.length; row++) {
      // Set a counter for a row.
      var count = {"X": 0, "O": 0, "blanks": 0};
      for (var square = 0; square < validRows[row].length; square++) {
        if (!validRows[row][square]) {
          count.blanks++;
          globalCount.blanks++;
        }
        else {
          count[validRows[row][square]]++;
          globalCount[validRows[row][square]]++;
        }
      }
      
      if (count[userMarker] === 3)
        return {"score": -1, "message": "You win!"};
      if (count[aiMarker] === 3)
        return {"score": 1, "message": "You lose!"};
    }

    if (globalCount["blanks"] === 0)
      return {"score": 0, "message": "It's a tie!"};
    
    return false;
  }

  function calculateAIMoves(state, depth, aiTurn) {
    var stateEnd = calculateStateEnd(state).score;
    // Check if the state is an end game, or the depth is less than 0.
    if (depth <= 0 || stateEnd === -1 || stateEnd === 1 || stateEnd === 0)
      return (depth == 0) ? 0 : stateEnd;
    // Always check if it's the AI's turn.
    var bestValue = (aiTurn) ? -Infinity : Infinity;
    for (var i = 0; i < state.length; i++) {
      if (!state[i]) {
        state[i] = aiTurn ? aiMarker : userMarker;
        // Call the function on a new state.
        var score = calculateAIMoves(state, depth - 1, !aiTurn);
        state[i] = "";
        bestValue = aiTurn ? (Math.max(bestValue, score)) : (Math.min(bestValue, score));
      }
    }
    return bestValue;
  }
    
  function getGameState() {
    var state = [];
    // Returns a one-dimensional array of current game.
    $(".game-row > .game-square").each(function() {
      state.push($(this).children()[0].innerHTML);
    });
    return state;
  }

  function inputAIMarker() {
    var scores = [], state = getGameState();
    for (var i = 0; i < state.length; i++) {
      if (!state[i]) {
        state[i] = aiMarker;
        scores.push({
          'score': calculateAIMoves(state, Infinity, false),
          'ind': i
        });
        state[i] = '';
      }
    }
    var maxScore = scores.reduce(function(prevScore, score) {
      return ((score.score > prevScore.score) ? score : prevScore);
    });
    // Input AI's move with the move that grants the highest score.
    $(".game-square > .game-content")[maxScore.ind].innerHTML = aiMarker;
  }

  function endGame() {
    var message = calculateStateEnd(getGameState()).message;
    if (message) {
      $("#game-end-window").fadeIn();
      $(".pop-up-window > #game-end-result").html(message);
      $("#game-end-window > .pop-up-window").slideDown();
      return true;
    }
    return false;
  }

  $(".game-square").click(function() {
    // If square is empty, fill it in.
    var square = $(this).children()[0];
    if (!$(square).html()) {
      $(square).html(userMarker);
      
      var game = endGame();
      // Check if game has not yet ended...
      if (!game) {
        inputAIMarker(); // Fill in AI's move.
        endGame(); // Make the same check.
      }
    }
  });

  $(".player-choices > .player-choice").click(function() {
    // Set the player and begin game
    userMarker = $(this).attr("value");
    aiMarker = (userMarker == "X") ? "O" : "X";
    $(".pop-up > .pop-up-window").slideUp();
    $(".pop-up").fadeOut();
    
    // Let the AI start with a random move if the user chooses "X"
    if (userMarker === "X")
      $(".game-square > .game-content")[Math.floor(Math.random() * 10)].innerHTML = aiMarker;
    
    $(".player-choices > .player-choice").unbind("click");
  });
});
