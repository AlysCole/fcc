function drawer(price, cash, cid) {
  var change = cash - price;
  var coin = {
    'PENNY': 0.01,
    'NICKEL': 0.05,
    'DIME': 0.10,
    'QUARTER': 0.25,
    'ONE': 1.00,
    'FIVE': 5.00,
    'TEN': 10.00,
    'TWENTY': 20.00,
    'ONE HUNDRED': 100.00
  };
  function addFloating(num1, num2) {
    return Math.round((num1 * 100) + (num2 * 100)) / 100;
  }
  function sumOfElements(arr)  {
    if (arr.length === 0)
      return 0;
    return arr.reduce(function(a, b) {
      return addFloating(a, b[1]);
    }, 0);
  }
  function arrSearch(arr, firstElement) {
    return arr.reduce(function(a, b) {
      if (b[0] === firstElement)
        return true;
      return false;
    }, 0);
  }
  function mapResult(arr, coinName) {
    if (arr.length < 0 || !arrSearch(arr, coinName)) {
      arr.push([coinName, coin[coinName]]);
      return arr;
    }
    return arr.map(function(el) {
      if (el[0] === coinName)
        el[1] = addFloating(el[1], coin[coinName]);
      return el;
    });
  }
  var res = [];
  var totalChange = 0;
  for (var i = cid.length - 1; i >= 0; i--) {
    if (coin[cid[i][0]] <= change) {
      while (sumOfElements(res) !== change) {
        //print(sumOfElements(res),cid[i][1]);
        if (addFloating(sumOfElements(res), coin[cid[i][0]])
            <= change && cid[i][1] > 0) {
          res = mapResult(res, cid[i][0]);
          cid[i][1] = addFloating(cid[i][1], -(coin[cid[i][0]]));
        }
        else {
          /*print(sumOfElements(res) + coin[cid[i][0]], sumOfElements(res) + coin[cid[i][0]] <= change);
          print("continuing on", cid[i][0], "-", cid[i][1], ",", sumOfElements(res));*/
          break;
        }
      }
      totalChange += cid[i][1];
    }
  }
  //print(sumOfElements(res), cid);
  if (sumOfElements(res) < change) {
    return "Insufficient Funds";
  }
  else if (totalChange === 0)
    return "Closed";
  else if (sumOfElements(res) === change)
    return res;
}

// Example cash-in-drawer array:
// [['PENNY', 1.01],
// ['NICKEL', 2.05],
// ['DIME', 3.10],
// ['QUARTER', 4.25],
// ['ONE', 90.00],
// ['FIVE', 55.00],
// ['TEN', 20.00],
// ['TWENTY', 60.00],
// ['ONE HUNDRED', 100.00]]

/*drawer(19.50, 20.00, [['PENNY', 1.01], ['NICKEL', 2.05], ['DIME', 3.10], ['QUARTER', 4.25], ['ONE', 90.00], ['FIVE', 55.00], ['TEN', 20.00], ['TWENTY', 60.00], ['ONE HUNDRED', 100.00]]);*/
/*drawer(19.50, 20.00, [['PENNY', 0.50], ['NICKEL', 0], ['DIME', 0], ['QUARTER', 0], ['ONE', 0], ['FIVE', 0], ['TEN', 0], ['TWENTY', 0], ['ONE HUNDRED', 0]]);*/
drawer(3.26, 100.00, [['PENNY', 1.01], ['NICKEL', 2.05], ['DIME', 3.10], ['QUARTER', 4.25], ['ONE', 90.00], ['FIVE', 55.00], ['TEN', 20.00], ['TWENTY', 60.00], ['ONE HUNDRED', 100.00]]);
