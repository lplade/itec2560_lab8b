var express = require("express");
var router = express.Router();

/* GET the app's home page */
router.get('/', homepage);

/*function homepage(req, res){
 res.send("Currency site");
 }*/

function homepage(req, res) {
	res.render('index');
}

/* GET request, for form submit */
router.get('/convert', convert);

function convert(req, res) {
	//Data send as a post request is available in the
	//body.query attribute; properties same as names in form

	var money = req.query.fromamount;
	var convertFrom = req.query.fromcurrency;
	var convertTo = req.query.tocurrency;

	console.log("query was: convert " + money + " to " + convertTo);

	//Our conversion rates - current as of 24 Feb 2016
	var conversions = {"USD":1.0, "GBP": 0.72, "EUR": 0.91};

	//convert price into dollars, then into desired currency.
	var baseUSD = money / conversions[convertFrom];
	console.log("Internal conversion $" + baseUSD);
	var conversionRate = conversions[convertTo];

	var convertedVal = conversionRate * baseUSD;

	res.render('result', {
		startmoney: money,
		origcurrency: convertFrom,
		currency: convertTo,
		converted: convertedVal.toFixed(2)
	});
}

module.exports = router;
