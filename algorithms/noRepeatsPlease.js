function permAlone(str) {
  var result = [], used = [];
  function permutate(str) {
    var ch, chars = str.split("");
    for (var i = 0; i < chars.length; i++) {
      ch = chars.splice(i, 1);
      // get and delete the character at index 'i'
      used.push(ch);
      // push the character into the 'used' array
      if (chars.length == 0)
        result.push(used.join(""));
      // if the chars array is empty, push the chars
      // in 'used' to the result array
      permutate(chars.join(""));
      // use recursion with the rest of the characters
      chars.splice(i, 0, ch);
      // take the character off of the used array
      used.pop();
    }
  }

  permutate(str);
  // run a regex test looking for strings with
  // consecutive letters, and return the false for
  // those.
  return result.filter(function(perm) {
    return !(/(.)(?=\1)/g.test(perm));
  }).length;
  // returns the length of the result.
}

permAlone('aab');


// 1. Start function with the first letter of the string.
// 2. Switch base character with characters after the base index.
// 3. After every switch, use recursion to switch the character in the next position to a character in any position after it.
// 4. Push each permutation into a result array.
