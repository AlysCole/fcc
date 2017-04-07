function steamroller(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array)
      newArr = newArr.concat(steamroller(arr[i]));
    else
      newArr.push(arr[i]);
  }
  return newArr;
}

steamroller([1, [2], [3, [[4]]]]);
