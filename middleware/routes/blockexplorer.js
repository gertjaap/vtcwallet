var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/address/:addr', function(req, res, next) {
  router.blockchainIndexing.addrDb.get(req.params.addr + "-txos", function(err, value) {
    var txos = [];
    if(value) txos = JSON.parse(value);
    var expandedTxos = [];

    var expandTxo = function(txo, callback) {
      router.blockchainIndexing.txoDb.get("txo-" + txo.txid + "-" + txo.vout, function (err, json) {
        if(json) {
          var txoObject = JSON.parse(json);
          txoObject.txid = txo.txid;
          txoObject.vout = txo.vout;
          expandedTxos.push(txoObject);
        }
        callback();
      });
    };
    var queue = async.queue(expandTxo, 10);
    queue.drain = function() {
      res.json({txos:expandedTxos});
    }
    for(var i = 0; i < txos.length; i++) {
      queue.push(txos[i]);
    }
    if(txos.length == 0) queue.drain();
  });
});

module.exports = router;
