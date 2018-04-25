$(window).load(function() {
  var inputDiv = $("#calculator-input");
  var currAns = "";
  var validExp = /[-\*\/\+\%]/;

  function extractInts(exp, returnLast) {
    var extractedInts = exp.split(validExp);
    if (returnLast)
      return extractedInts[extractedInts.length - 1];
    return extractedInts;
  }
  
  $(".calc-exp").click(function() {
    // Store the value of the button clicked.
    var input = this.innerHTML;
    // Return false if element already contains an operation,
    // or if input is a period and the current integer already contains one.
    if ( ( validExp.test(input) && /[-\*\/\+\%]$/.test(inputDiv.html()) ) ||
         ( input == "." && /\./.test(extractInts(inputDiv.html(), true)) ) )
      return false;
    // Append value of button into div element if it returns true to being a
    // Number, or if it matches valid operations.
    else if ( !isNaN(input) || validExp.test(input) || input == ".")
      inputDiv.html(inputDiv.html() + input); 
  });

  $("#equals").click(function() {
    var exp = inputDiv.html();
    // If percentage operation is used, shift the decimal and multiply.
    exp = exp.replace(/([0-9\.]+)\%/, function(match, p1) {
      // If a decimal does not already exist, append string with one.
      var num = /\./.test(p1) ? p1 : p1 + ".";
      num = num.split("");
      // Pad string with zeroes until offset -2 from index of decimal exists.
      while (num.indexOf(".") - 2 < 0)
        num.unshift("0");
      var ind = num.indexOf(".");
      // Move decimal two indexes to the left.        
      num.splice(ind, 1);
      num.splice(ind - 2, 0, ".");
      // Return the number with a * operator 
      return num.join("") + "*";
    });
    if (/^([-\*\/\+]*[0-9\.]+)+$/.test(exp)) {
      currAns = String(eval(exp));
      inputDiv.html(currAns);
    }
  });

  $("#ans").click(function() {
    // Append last answer to calculator if expression ends with an operation.
    if ( /[-\+\/\*\%]$/.test(inputDiv.html()) )
      inputDiv.html(inputDiv.html() + currAns);
  });

  $("#ac").click(function() {
    inputDiv.html("");
  });

  $("#ce").click(function() {
    inputDiv.html(inputDiv.html().slice(0,-1));
  });
});
