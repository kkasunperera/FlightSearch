var express = require('express');
var request = require('request');
var moment = require('moment');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req)
    res.send('respond with search output');
});

router.post('/', function (req, res_1, next) {
    //console.log("#################################")
    var data = req.body;
    //console.log(req.body)
    var toLocationCode;
    var fromLocationCode;
    console.log("data.from_location : " + data.from_location)
    console.log("data.to_location : " + data.to_location)
    console.log("data.date : " + data.date)
    if (moment().isSameOrBefore(data.date, 'day')) {
        getLocationCode(data.from_location, function (fromLocation) {
            fromLocationCode = fromLocation;
            getLocationCode(data.to_location, function (toLocation) {
                toLocationCode = toLocation;

                getDates(data.date, function (dateArray) {
                    //console.log("********* this is our date array ************")
                    // console.log(JSON.stringify(dateArray))

                    getAirlinesCodes(function (airlineCodeArray) {
                        //console.log("************* this is our airlines code array *****************")
                        // console.log(JSON.stringify(airlineCodeArray))
                        var searchOutput = {};
                        async.forEach(dateArray, function (date, callback1) {
                            searchOutput[date] = [];
                            //console.log(date); // print the key
                            async.forEach(airlineCodeArray, function (airlineCode, callback2) {
                                //console.log(airlineCode); // print the key
                                searchFlights(fromLocationCode, toLocationCode, date, airlineCode, function (result) {
                                    searchOutput[date] = searchOutput[date].concat(result);
                                    callback2();
                                });


                            }, function (err) {
                                callback1(); // tell async that the iterator has completed
                                //console.log('iterating done');
                            });



                        }, function (err) {
                            //console.log('iterating done');
                            //console.log(searchOutput)
                            res_1.send(searchOutput);
                        });

                    })
                })
            })
        })
    } else {
        res_1.send(null);
    }











});

function getLocationCode(location, cb) {
    var url = 'http://localhost:3000/airports'
    var options = {
        method: 'post',
        url: url,
        json: {
            data: location
        }
    }
    request(options, function (err, res_2, body) {
        if (err) {
            console.log('airport POST request error: ' + err);
        } else if (res_2.statusCode === 200) {
            console.log('airport POST request is success');
            cb(res_2.body[0].airportCode);

        }
    })
}

function getDates(givenDate, cb) {
    var dateArray = [];
    for (var i = -2; i <= 2; i++) {
        if (i === 0) {
            dateArray.push(givenDate)
        } else {
            var newDate = moment(givenDate, "YYYY-MM-DD").add(i, 'days').format("YYYY-MM-DD");
            if (moment().isBefore(newDate)) {
                dateArray.push(newDate)
            }

        }

    }
    cb(dateArray);
}

function getAirlinesCodes(cb) {
    var airlineCodeArray = [];
    var url = 'http://localhost:3000/airlines'
    var options = {
        method: 'post',
        url: url
    }
    request(options, function (err, res, body) {
        if (err) {
            console.log('airlines POST request error: ' + err);
        } else if (res.statusCode === 200) {
            //console.log('airlines POST request is success');
            //console.log(res.body);
            //console.log(typeof res.body)
            var airlines = JSON.parse(res.body)

            airlines.forEach(function (value) {
                //.log(value.code);
                airlineCodeArray.push(value.code)

            });
            cb(airlineCodeArray);


        }
    })
}

function searchFlights(from, to, date, airline, cb) {

    var url = "http://node.locomote.com/code-task/flight_search/" + airline + "?date=" + date + "&from=" + from + "&to=" + to;
    //console.log(" URL " + url)
    var options = {
        method: 'get',
        url: url
    }
    request(options, function (err, res, body) {
        if (err) {
            console.log('flight search API GET request error: ' + err);
        } else if (res.statusCode === 200) {
            //console.log('flight search API GET request is success');
            //console.log("$$$$$$$$$$$$$ search output $$$$$$$$$$$$$$$")
            //console.log(res.body);
            //console.log("$$$$$$$$$$$$$ search output $$$$$$$$$$$$$$$")
            cb(JSON.parse(res.body));
            //res.send(res_2.body);
        }

    })

}

module.exports = router;