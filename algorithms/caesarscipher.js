function rot13(str) { // LBH QVQ VG!
  var result = "";
  for (var i = 0; i < str.length; i++) {
    // If the char code is above that of the letter 'Z',
    // Subtract the charcode of 'Z' from it and identify it's placement
    // right from the charcode of letter 'A'.
    var charCode = (/[A-Z]/.test(str[i])) ? str.charCodeAt(i) + 13 : str.charCodeAt(i);
    result += String.fromCharCode((charCode < 91) ? charCode : (charCode - 91) + 65);
  }
  return result;
}

// Change the inputs below to test
console.log(rot13("SERR PBQR PNZC"));

