function sym() {
  var args = Array.prototype.slice.call(arguments);
  var result = [];
  function checkDiff(arr1, arr2) {
    res = [arr1.filter(function(num, index) {
      if (arr2.indexOf(num) !== -1) {
        while (arr2.indexOf(num) !== -1) {
          arr2.splice(arr2.indexOf(num), 1);
        }
        return false;
      }
      return true;
    })];
    res.push(arr2);
    return res;
  }
  for (var i = 0; i < args.length; i++) {
    for (var n = i + 1; n < args.length; n++) {
      var res = checkDiff(args[i], args[n]);
      args[i] = res[0];
      args[n] = res[1];
    }
  }
  return args.reduce(function(prev, curr) {
    return prev.concat(curr);
  }).filter(function(num, index, arr) {
      if (arr.indexOf(num) !== -1 && arr.indexOf(num) !== index)
        return false;
      return true;
  });
}

sym([1, 2, 3], [5, 2, 1, 4]);
// -> [3,5,4]
sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5]);
// -> [1,4,5]
sym([1, 1]);
// -> [1]

// 1. make a function that checks the difference
// between two arrays.
// Loop through the arguments, and make an inner Loop
// that loops through all the arguments after the outer loop.
// Start comparing and reducing each argument.

