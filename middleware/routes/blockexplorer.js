var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/address/:addr', function(req, res, next) {
  var txn = router.blockchainIndexing.env.beginTxn({ readOnly: true });
  var value = txn.getString(router.blockchainIndexing.db, req.params.addr + "-txos");
  var txos = [];
  if(value) txos = JSON.parse(value);

  console.log("Fetching TXOS:", txos);
  var expandedTxos = [];

  var expandTxo = function(txo, callback) {
    var json = txn.getString(router.blockchainIndexing.db, "txo-" + txo.txid + "-" + txo.vout);
    if(json) {
      var txoObject = JSON.parse(json);
      txoObject.txid = txo.txid;
      txoObject.vout = txo.vout;
      expandedTxos.push(txoObject);
    }
    callback();
  };
  var queue = async.queue(expandTxo, 10);
  queue.drain = function() {
    txn.commit();
    res.json({txos:expandedTxos});
  }
  for(var i = 0; i < txos.length; i++) {
    queue.push(txos[i]);
  }
  if(txos.length == 0) queue.drain();


});

module.exports = router;
