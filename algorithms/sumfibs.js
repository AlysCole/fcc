function sumFibs(num) {
  var fibs = [1, 1];
  while (fibs[fibs.length - 1] + fibs[fibs.length - 2] <= num) {
    fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);
  }
  return fibs.reduce(function(pre, cur) {
    if (cur % 2 !== 0)
      return pre + cur;
    return pre;
  });
}
sumFibs(4);
