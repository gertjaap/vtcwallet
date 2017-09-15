var express = require('express');
var router = express.Router();
var initializationStatus = 0;

var initInterval = setInterval(function() { initializationStatus += 5; if(initializationStatus >= 100) { clearInterval(initInterval); } }, 500);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var status = {};
  status.vertcoindStatus = router.vertcoind.status;
  status.vertcoindProgress = router.vertcoind.progress;

  if(status.vertcoindProgress < 100)
  {
    status.initStatus = status.vertcoindStatus;
    status.initProgress = status.vertcoindProgress;
  }
  else {
    status.initStatus = "Ready";
    status.initProgress = 100;
  }

  res.json(status);
});

router.get('/blockHeight', function(req, res, next) {
  router.vertcoind.request('getblockcount', [], function(err, result, body) {
    if(err) {
      res.sendStatus(500);
      return;
    }

    res.json({
      blockHeight: body.result
    });
  });
});

router.get('/indexHeight', function(req, res, next) {
  router.blockchainIndexing.settingsDb.get("lastBlock", function(err, value) {
    var indexHeight = -1;
    if(value) indexHeight = parseInt(value);
    res.json({
      indexHeight: indexHeight
    });
  });
});
module.exports = router;
