var express = require("express");
var routes = require("./routes/index");
var path = require("path");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.listen(3010, function() {
  console.log("Currencty app listening on port 3010");
});

app.use('/', routes);

module.exports = app;
