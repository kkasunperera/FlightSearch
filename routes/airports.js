var express = require('express');
var request = require('request')
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    //console.log("*********************** req.body "+ JSON.stringify(req.body))
    //console.log( req.body.data)
    var url = "http://node.locomote.com/code-task/airports?q=" + req.body.data;
   // console.log("URL : " + url)

    var options = {
        method: 'get',
        url: url
    }
    request(options, function (err, res_2, body) {
        if (err) {
            console.log('airport API GET request error: ' + err);
        } else if (res_2.statusCode === 200) {
            //console.log('airport API GET request is success');
           // console.log("res_2.body ^^^^^^^^ " + res_2.body);
            res.send(res_2.body);
        }
    })
});

module.exports = router;