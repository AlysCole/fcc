function sumPrimes(num) {
  var primes = [2, 3];
  for (var i = 5; i <= num; i++) {
    if ((function (checkNum) {
      for (var p = 0; p < primes.length; p++) {
        if (checkNum % primes[p] === 0)
          return false;
      }
      return true;
    })(i))
      primes.push(i);
  }
  return primes.reduce(function(pre, cur) {
    return pre + cur;
  });
}
sumPrimes(100);
