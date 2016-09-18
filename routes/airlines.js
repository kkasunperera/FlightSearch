var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.post('/', function(req, res, next) {
    
  var url = "http://node.locomote.com/code-task/airlines"
  
  
      var options = {
        method: 'get',
        url: url
    }
    request(options, function (err, res_2, body) {
        if (err) {
            console.log('airlines API GET request error: ' + err);
        } else if (res_2.statusCode === 200) {
            //console.log('airlines API GET request is success');
           // console.log(res_2.body);
            res.send(res_2.body);
        }
    })
});

module.exports = router;