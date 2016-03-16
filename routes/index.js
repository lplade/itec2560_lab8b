var express = require("express");
var router = express.Router();

var request = require('request');
var moment = require('moment');

var baseURL = 'https://openexchangerates.org/api/latest.json' ;


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



// based on astropix lab
function oxrRequest(httpRes, base) {
	var queryParam = {};
	var APPID = process.env.OXR_APP_KEY;

	if (base) {
		queryParam = {
			'app_id' : APPID,
			'base' : base
		};
	}
	else {
		queryParam = {'app_id' : APPID };
	}

	request( {uri :baseURL, qs: queryParam} , function(error, oxr_response, body){
		if (!error && oxr_response.statusCode == 200){
			//request worked
			oxrJSON = JSON.parse(body);
			conversions.USD = oxrJSON.rates.USD;
			//TODO pick up here

		}
		else {
			//Log error to console and render error page
			console.log("Error in JSON request: " + error);
			console.log(oxr_response);
			console.log(body);
			httpRes.render('oxrError');
		}
	});
}



module.exports = router;
