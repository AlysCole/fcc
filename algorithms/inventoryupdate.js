function removeSymbols(str) {
  return str.replace(/\W/g, "").toLowerCase();
}
function inventory(arr1, arr2) {
  arr1 = arr1.map(function(element) {
    arr2 = arr2.filter(function(element2) {
      if (element[1] == element2[1]) {
        element[0] += element2[0];
        return false;
      }
      return true;
    });
    return element;
  });
  print(arr1,arr2);
  return arr1.concat(arr2).sort(function(a, b) {
    aLower = removeSymbols(a[1]);
    bLower = removeSymbols(b[1]);
    if (aLower < bLower)
      return -1;
    else if (bLower < aLower)
      return 1;
    else 
      return 0;
  });
  // All inventory must be accounted for or you're fired!
}

// Example inventory lists
var curInv = [
  [21, 'Bowling Ball'],
  [2, 'Dirty Sock'],
  [1, 'Hair Pin'],
  [5, 'Microphone']
];

var newInv = [
  [2, 'Hair Pin'],
  [3, 'Half-Eaten Apple'],
  [67, 'Bowling Ball'],
  [7, 'Toothpaste']
];

//inventory(curInv, newInv);
inventory([[21, 'Bowling Ball'], [2, 'Dirty Sock'], [1, 'Hair Pin'], [5, 'Microphone']], [[2, 'Hair Pin'], [3, 'Half-Eaten Apple'], [67, 'Bowling Ball'], [7, 'Toothpaste']]);
