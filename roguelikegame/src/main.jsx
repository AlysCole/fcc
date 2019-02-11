import React from "react";
import ReactDOM from "react-dom";
require("./styles.scss");

import Game from "./game.jsx";

Math.randomBetween = (a, b) => {
  return Math.floor(Math.random() * (b - a + 1) + a);
};

Math.checkPercentage = percentage => {
  let roll = Math.randomBetween(1, 100);
  if (roll <= percentage) return true;
  return false;
};

Array.prototype.remove = function(element) {
  return this.filter(el => el !== element);
};

// string utility functions
String.prototype.prefixArticle = function(article) {
  if (article) {
    return `${article} ${this}`;
  }

  const vowelRegexp = new RegExp("^[aeiou].*", "i");

  if (vowelRegexp.test(this)) {
    // return string prefixed with 'an'
    return "an " + this;
  } else {
    return "a " + this;
  }
};

String.prototype.capitalizeFirstLetter = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

ReactDOM.render(<Game />, document.getElementById("game"));
