var express = require('express');
var router = express.Router();
var initializationStatus = 0;

var initInterval = setInterval(function() { initializationStatus += 5; if(initializationStatus >= 100) { clearInterval(initInterval); } }, 500);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    initializationStatus: initializationStatus
  });
});

module.exports = router;
