var express = require('express');
var router = express.Router();

/* GET about page */
router.get('/', about);

function about (req, res) {
	console.log("Request about page");
	res.render('about');
}

module.exports = router;
