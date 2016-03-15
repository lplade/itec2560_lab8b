var express = require("express");

var routes = require("./routes/index");
var about = require("./routes/about");

var path = require("path");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "static")));

app.use('/', routes);
app.use('/about', about);

// mod for Heroku
app.listen(process.env.PORT || 3010, function() {
  console.log("Currency app listening on port 3010 (or port assigned by host)");
});


module.exports = app;
