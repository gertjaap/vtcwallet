var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/address/:addr', function(req, res, next) {
  var expandedTxos = [];

  var expandTxo = function(txo, callback) {
    router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout, function (err, value) {
      router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout + "-spent", function (err, spent) {
        if(value) {
          var txoObject = { value: value };
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

module.exports = router;
