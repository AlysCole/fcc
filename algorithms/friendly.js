function friendly(str) {
  // make sure the earlier date is indexed
  // before the later one
  str = str.sort(function(a,b) {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
  });

  // split the dates into separate arrays
  var firstDate = str[0].split("-"), secondDate = str[1].split("-"),
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // convert the dates into numbers
  firstDate = firstDate.map(Number);
  secondDate = secondDate.map(Number);

  // a function that appends 'st' 'nd' 'rd', or 'th'
  // to a number, for the days
  function appendToNum(day) {
    var lastChar = String(day).slice(-1);
    var lastTwo = String(day).slice(-2);
    if (Number(lastTwo) > 10 && Number(lastTwo) < 20) return day + "th";
    // make sure all numbers between 10 and 20 are
    // appended with 'th', specifically 11, 12, 13
    else if (lastChar == 1) return day + "st";
    else if (lastChar == 2) return day + "nd";
    else if (lastChar == 3) return day + "rd";
    else return day + "th";
  }

  
  function formatDate(arr) {
    // format the dates for easier reading
    if (arr[2])
      return months[arr[1] - 1] + " " + appendToNum(arr[2]) + ", " + arr[0];
    else
      return months[arr[0] - 1] + " " + appendToNum(arr[1]);
  }

  var result = [];
  // if conditionals checking how exactly to format
  // the dates returned.
  if (firstDate[0] === secondDate[0]) {
    if (firstDate[1] === secondDate[1]) {
      if (firstDate[2] === secondDate[2])
        result = [formatDate(firstDate)];
      else {
        firstDate.splice(0,1); secondDate.splice(0,1);
        result = [formatDate(firstDate), appendToNum(secondDate[1])];
      }
    }
    else {
      firstDate.splice(0,1); secondDate.splice(0,1);
      result = [formatDate(firstDate), formatDate(secondDate)];
    }
  }
  // if secondDate is just a year
  // ahead of firstDate
  else if (firstDate[0] + 1 === secondDate[0] &&
           ((secondDate[1] + firstDate[1]) - firstDate[1]) < 4){
    firstDate.splice(0,1); secondDate.splice(0,1);
    result = [formatDate(firstDate), formatDate(secondDate)];
  }
  else
    result = [formatDate(firstDate), formatDate(secondDate)];
  return result;
  return [firstDate, secondDate];
}

friendly(['2017-01-01', '2017-01-01']);


