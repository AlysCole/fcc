function binaryAgent(str) {
  var arr = str.split(' ');
  function binaryToNum(binary) {
    return parseInt(binary, 2) >> 0;
  }
  function binaryToText(binary) {
    var num = /^0[01]{2}([01]+)/g.exec(binary);
    if (/^01[01]/g.test(binary)) {
      var char = binaryToNum(num[1]);
      if (num[0].charAt(2) === '0')
        return String.fromCharCode(96 + char).toUpperCase();
      return String.fromCharCode(96 + char);
    }
    else {
      num = binaryToNum(num[0]);
      return String.fromCharCode(num);
    }
  }
  return arr.map(function(el) {
      return binaryToText(el);
  }).join('');
}


console.log(binaryAgent('01000001 01110010 01100101 01101110 00100111 01110100 00100000 01100010 01101111 01101110 01100110 01101001 01110010 01100101 01110011 00100000 01100110 01110101 01101110 00100001 00111111'));
