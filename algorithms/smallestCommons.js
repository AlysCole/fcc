function smallestCommons(arr) {
  var num = 0;
  for (var i = 1; num === 0; i++) {
    for (var n1 = (arr[0] < arr[1] ? arr[0] : arr[1]);
         n1 <= ((arr[0] < arr[1]) ? arr[1] : arr[0]);
         n1++) {
      if (i % n1 !== 0)
        break;
      else if (n1 === (arr[1] > arr[0] ? arr[1] : arr[0])
               && i % n1 === 0)
        return i;
    }
  }
}


smallestCommons([1,5]);
