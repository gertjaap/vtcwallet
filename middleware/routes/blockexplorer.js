var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/addressBalance/:addr', function(req, res, next) {
  var balance = 0;

  var expandTxo = function(txo, callback) {
    router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout, function (err, value) {
      router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout + "-spent", function (err, spent) {
        if(value) {
          if(spent === undefined) {
            balance += parseFloat(value);
          }
        }
        callback();
      });
    });
  };

  var queue = async.queue(expandTxo, 10);
  queue.drain = function() {
    res.json({balance:balance});
  }
  var count = 0;
  router.blockchainIndexing.db.createReadStream({
    start: req.params.addr + "-txo-00001",
    end: req.params.addr + "-txo-99999"
  })
  .on('data', function(data) {
    queue.push(JSON.parse(data.value));
    count++;
  })
  .on('end', function() {
    if(count == 0) queue.drain();
  });
});

router.get('/addressTxos/:addr', function(req, res, next) {
  var expandedTxos = [];

  var expandTxo = function(txo, callback) {
    router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout, function (err, value) {
      router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout + "-spent", function (err, spent) {
        if(value) {
          var txoObject = { value: parseFloat(value) };
          txoObject.txid = txo.txid;
          txoObject.vout = txo.vout;
          if(spent) {
            txoObject.spent = true;
            txoObject.spentTxID = spent;
          }
          expandedTxos.push(txoObject);
        }
        callback();
      });
    });
  };

  var queue = async.queue(expandTxo, 10);
  queue.drain = function() {
    res.json({txos:expandedTxos});
  }
  var count = 0;
  router.blockchainIndexing.db.createReadStream({
    start: req.params.addr + "-txo-00001",
    end: req.params.addr + "-txo-99999"
  })
  .on('data', function(data) {
    queue.push(JSON.parse(data.value));
    count++;
  })
  .on('end', function() {
    if(count == 0) queue.drain();
  });
});

router.get('/tx/:txid', function(req, res, next) {
  router.vertcoind.throttledRequest('getrawtransaction', [req.params.txid, true], function(err, result, body) {
    if(err) res.sendStatus(500);
    else res.json(body.result);
  });
});

router.get('/blockByHash/:hash', function(req, res, next) {

  router.vertcoind.throttledRequest('getblock', [req.params.hash], function(err, result, body) {
    if(err) res.sendStatus(500);
    else res.json(body.result);
  });
});

router.get('/blockByIndex/:block', function(req, res, next) {
  router.vertcoind.throttledRequest('getblockhash', [parseInt(req.params.block)], function(err, result, body) {

    router.vertcoind.throttledRequest('getblock', [body.result], function(err, result, body) {
      if(err) res.sendStatus(500);
      else res.json(body.result);
    });
  });
});

module.exports = router;
