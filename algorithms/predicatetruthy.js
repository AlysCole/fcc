function every(arr, predicate) {
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i][predicate] === "undefined")
      return false;
  }
  return true;
}

every([{'user': 'Tinky-Winky', 'sex': 'male'}, {'user': 'Dipsy', 'sex': 'male'}, {'user': 'Laa-Laa', 'sex': 'female'}, {'user': 'Po', 'sex': 'female'}], 'sex');


function add() {
  var addArray = [],
      sum;
  for (var x in arguments){
    addArray.push(arguments[x]);
  }
  function flatten(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (!(arr[i] instanceof Array))
        newArr.push(arr[i]);
      else
        newArr = newArr.concat(arr[i]);
    }
    return newArr;
  }
  addArray = flatten(addArray);
  print(addArray);
  return addArray.reduce( function(a,b){
    return a + b;
  });
}

add((2),([3]));
