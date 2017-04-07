function pairwise(arr, arg) {
  var sum = [];
  var result = 0;
  var usedEls = [];
  
  for(var i = 0; i < arr.length - 1; i++){
    for(var j = i + 1; j < arr.length; j++){
      if((arr[i] + arr[j]) === arg && typeof sum[i] === 'undefined' && typeof sum[j] === 'undefined'){
        sum[i] = true;
        sum[j] = true;
        result += i + j;
      }
    }
  }
  return result;
}

pairwise([1,4,2,3,0,5], 7);
