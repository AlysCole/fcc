function orbitalPeriod(arr) {
  var GM = 398600.4418;
  var earthRadius = 6367.4447;
  var results = [];
  for (var i = 0; i < arr.length; i++) {
    var result = Math.pow(earthRadius + arr[i].avgAlt,3) / GM;
    result = Math.sqrt(result) * (Math.PI * 2);
    results.push({name: arr[i].name, orbitalPeriod: Number(result.toFixed())});
  }
  return results;
}
var res = orbitalPeriod([{name : "sputkin", avgAlt : 35873.5553}]);
