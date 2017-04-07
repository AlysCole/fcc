var Person = function(firstAndLast) {
  // Not supposed to use prototypes?
  this.getFirstName = function() {
    return firstAndLast.split(" ")[0];
  };
  this.getLastName = function() {
    return firstAndLast.split(" ")[1];
  };
  this.getFullName = function() {
    return firstAndLast;
  };
  this.setFirstName = function(first) {
    firstAndLast = firstAndLast.split(" ");
    firstAndLast[0] = first;
    firstAndLast = firstAndLast.join(" ");
  };
  this.setLastName = function(last) {
    firstAndLast = firstAndLast.split(" ");
    firstAndLast[1] = last;
    firstAndLast = firstAndLast.join(" ");
  };
  this.setFullName = function(fullName) {
    firstAndLast = fullName;
  };
};

var bob = new Person('Bob Ross');
bob.getFullName();
