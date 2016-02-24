var express = require("express");
var router = express.Router();

/* GET the app's home page */
router.get('/', homepage);

function homepage(req, res){
  res.send("Currency site");
}

module.exports = router;
