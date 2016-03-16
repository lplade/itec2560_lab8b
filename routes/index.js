var express = require("express");
var router = express.Router();

var request = require('request');
var moment = require('moment');

var baseURL = 'https://openexchangerates.org/api/latest.json' ;

//Default conversion rates - crazy so we can tell if it fails
var conversions = {"USD":111111, "GBP": 222222, "EUR": 33333};

/* GET the app's home page */
router.get('/', homepage);

/*function homepage(req, res){
 res.send("Currency site");
 }*/

function homepage(req, res) {
	res.render('index', { title: 'Larry currency converter'});
}

/* GET request, for form submit */
router.get('/convert', convert);

function convert(req, res) {

	//populate the conversions object with current rates
	//do this before below assignment
	oxrRequest(res, "USD");

	console.log(conversions);
	//TODO this is not working right
	//Need to wait for oxrRequest to finish before proceeding?

	//Data send as a post request is available in the
	//body.query attribute; properties same as names in form

	var money = req.query.fromamount;
	var convertFrom = req.query.fromcurrency;
	var convertTo = req.query.tocurrency;

	console.log("query was: convert " + money + " to " + convertTo);



	//convert price into dollars, then into desired currency.
	//TODO rewrite this to just query appropriate base currency and get direct result
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

// API doc: https://docs.openexchangerates.org/docs/latest-json
/*
Parameters:

app_id: string Required
Your unique App ID (required)

base: string Optional
Change base currency (3-letter code, default: USD)

symbols: string Optional
Limit results to specific currencies (comma-separated list of 3-letter codes)


Return format: (HTTP 200 OK)
{
	disclaimer: "https://openexchangerates.org/terms/",
	license: "https://openexchangerates.org/license/",
	timestamp: 1449877801,
	base: "USD",
	rates: {
		AED: 3.672538,
		AFN: 66.809999,
		ALL: 125.716501,
		AMD: 484.902502,
		ANG: 1.788575,
		AOA: 135.295998,
		ARS: 9.750101,
		AUD: 1.390866,
		...
	}
};


*/

// method based on astropix lab
function oxrRequest(res, base) {
	console.log("Requesting rates...");
	var queryParam = {};
	var APPID = process.env.OXR_APP_ID;

	queryParam = {
		'app_id' : APPID,
		'base' : base
		//'symbols' : "USD,GBP,EUR" maybe only for paid users
	};

	request( {uri :baseURL, qs: queryParam} , function(error, oxr_response, body){
		if (!error && oxr_response.statusCode == 200){
			//request worked
			console.log("HTTP 200");
			oxrJSON = JSON.parse(body);
			conversions.USD = oxrJSON.rates.USD;
			conversions.GBP = oxrJSON.rates.GBP;
			conversions.EUR = oxrJSON.rates.EUR;
			console.log(conversions);
			//TODO this is working right

		}
		else {
			//Log error to console and render error page
			console.log("Error in JSON request: " + error);
			console.log(oxr_response);
			console.log(body);
			res.render('oxrError');
		}
	});
}



module.exports = router;
