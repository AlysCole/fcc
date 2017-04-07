function convert(num) {
  var romanNumbers = [1, 5, 9, 10, 50, 100, 500, 1000];
  function repeatNumTimes(rep, times) {
    var str = "";
    rep = String(rep);
    if (!times)
      return str;
    for (var i = 0; i < times; i++) {
      str += rep;
    }
    return str;
  }

  var arr = romanSums([0], num);
  function romanSums(currentArray, target) {
    for (var i = romanNumbers.length - 1; i >= 0; i--) {
      var number = currentArray.reduce(function(pre,curr) {
        return pre + curr;
      });
      if (number + romanNumbers[i] < target &&
                 currentArray.slice(currentArray.length - 3,
                                    currentArray.length).join("") !== repeatNumTimes(romanNumbers[i],3)
                 && (currentArray[currentArray.length - 1] >= romanNumbers[i]
                     || currentArray[currentArray.length - 1] === 0)) {
        currentArray.push(romanNumbers[i]);
        print("add:",romanNumbers[i],currentArray);
        return romanSums(currentArray, target);
      } else if (number + romanNumbers[i] === target &&
                 currentArray.slice(currentArray.length - 3,
                                    currentArray.length).join("") !== repeatNumTimes(romanNumbers[i],3)) {
        currentArray.push(romanNumbers[i]);
        return currentArray;
      }
    }
  }
  return arr.map(function(el) {
    if (el === 1)
      return "I";
    else if (el === 5)
      return "V";
    else if (el === 9)
      return "IX";
    else if (el === 10)
      return "X";
    else if (el === 50)
      return "L";
    else if (el === 100)
      return "C";
    else if (el === 500)
      return "D";
    else if (el === 1000)
      return "M";
  }).join("");
}
convert(36);

// 1. Split into array
// 2. loop through array and convert each place value to a whole number
// 3. loop through new array, convert each number to a roman numeral
// 4. convert by finding numbers from the object that add up to the number.
// 5. remember: a roman numeral can only be joined three timesp.
// 6. join the mapped array


