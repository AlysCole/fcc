var express = require('express'),
  app = express();

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.listen(8080, function() {
  console.log("Connected at port %s", this.address().port);
});
