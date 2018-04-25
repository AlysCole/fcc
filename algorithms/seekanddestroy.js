function destroyer(arr) {
  // Remove all the values
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return arr.filter(function(el) {
    for (var i = 0; i < args.length; i++) {
      if (el === args[i])
        return false;
    }
    return true;
  });
}

console.log(destroyer([1, 2, 3, 1, 2, 3], 2, 3));
