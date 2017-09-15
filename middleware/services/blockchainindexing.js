const fs = require('fs');
const path = require('path');
const ini = require('ini');
const uuidv4 = require('uuid/v4');
const async = require('async');
const level = require('level');


var blockchainIndexing = {};
var last100 = new Date();
var last100txos = 0;
var last100txis = 0;
var last100txes = 0;

var ensureIndexFolder = function(callback) {
  var indexDir = path.join(__dirname, '..', 'blockchainIndex');
  if(!fs.existsSync(indexDir))
  {
    fs.mkdir(indexDir, function(err) {
      // TODO: Error handling
      callback();
    });
  } else {
    callback();
  }
}

var setup = function(callback) {
  var indexDir = path.join(__dirname, '..', 'blockchainIndex');

  blockchainIndexing.addrDb = level(path.join(indexDir,'addressTxo'));
  blockchainIndexing.txoDb = level(path.join(indexDir,'txo'));
  blockchainIndexing.settingsDb = level(path.join(indexDir,'settings'));

  callback();
}

var processTx = function(payload, callback) {
  var hash = payload.tx;
  var txn = payload.txn;
  last100txes++;

  blockchainIndexing.vertcoind.request('getrawtransaction', [hash, true], function(err, result, body) {
    if(body.result) {

      var processVin = function(txi, innerCallback) {
        var started = new Date();

        if(!txi.txid) {
          innerCallback();
          return;
        }

        last100txis++;

        // Mark the output as spent
        blockchainIndexing.txoDb.get("txo-" + txi.txid + "-" + txi.vout, function (err, value) {
          var txo = {};
          if(value) {
            txo = JSON.parse(value);
          }
          txo.spent = true;
          txo.spentTxID = hash;

          blockchainIndexing.txoDb.put("txo-" + txi.txid + "-" + txi.vout, JSON.stringify(txo), function(err) {
            innerCallback();
          });
        });
      };

      var processVout = function(txo, innerCallback) {
        if(!txo.scriptPubKey) {
          console.log("No scriptPubKey!", txo);
          innerCallback();
          return;
        } else {
          switch(txo.scriptPubKey.type) {
            case 'pubkey':
            case 'pubkeyhash':
              last100txos++;
              var processAddress = function(addr, innerInnerCallback) {

                blockchainIndexing.addrDb.get(addr + "-txos", function(err, value) {

                  var txos = [];
                  if(value) txos = JSON.parse(value);
                  txos.push({txid : hash, vout : txo.index});

                  blockchainIndexing.addrDb.put(addr + "-txos", JSON.stringify(txos), function(err) {
                    if(err) console.log("Error updating address TXOs:", err);
                    innerInnerCallback();
                  });
                });

              };
              var processAddressQueue = async.queue(processAddress, 1);
              processAddressQueue.drain = function() {
                blockchainIndexing.txoDb.get("txo-" + hash + "-" + txo.index, function (err, value) {
                  var updatedTxo = {};
                  if(value) {
                    updatedTxo = JSON.parse(value);
                  }
                  updatedTxo.v = txo.value;

                  blockchainIndexing.txoDb.put("txo-" + hash + "-" + txo.index, JSON.stringify(updatedTxo), function(err) {
                    innerCallback();
                  });
                });
              }
              if(txo.scriptPubKey.addresses.length == 0) processAddressQueue.drain();
              for(var j = 0; j < txo.scriptPubKey.addresses.length; j++) {
                var addr = txo.scriptPubKey.addresses[j];
                processAddressQueue.push(addr);
              }

              break;
            case 'nulldata':
              // Ignore
              innerCallback();
              break;
            default:
              console.log("Unrecognized scriptPubKey type", txo);
              innerCallback();
          }
        }
      }

      var processVinout = function(payload, callback) {
        if(payload.txi) processVin(payload.txi, function() {
          callback();
        });
        if(payload.txo) processVout(payload.txo, function() {
          callback();
        });
      }

      var vinoutQueue = async.queue(processVinout, 10);
      vinoutQueue.drain = function() {
        callback();
      }
      var count = 0;
      for(var i = 0; i < body.result.vin.length; i++) {
        var txi = body.result.vin[i];
        vinoutQueue.push({ txi : txi });
        count++;
      }

      for(var i = 0; i < body.result.vout.length; i++) {
        var txo = body.result.vout[i];
        txo.index = i;
        vinoutQueue.push({txo : txo});
        count++;
      }

      if(count == 0) vinoutQueue.drain();
    }
  });
}


var processBlock = function(index, callback) {
  var timer = blockchainIndexing.winston.startTimer();

  if(index % 10 == 0)
  {
    var timePer100 = new Date() - last100;
    last100 = new Date();
    console.log("Processing block", index, "Time per 10:", timePer100, "TX:", last100txes, "TXO:", last100txos);
    last100txos = 0;
    last100txis = 0;
    last100txes = 0;
  }
  var started = new Date();
  blockchainIndexing.vertcoind.request('getblockhash', [index], function(err, result, body) {
    timer.done("Get blockhash " + index);
    blockchainIndexing.vertcoind.request('getblock', [body.result], function(err, result, body) {
      timer.done("Get block " + index);
      var txQueue = async.queue(processTx, 100);
      txQueue.drain = function() {
        blockchainIndexing.settingsDb.put("lastBlock", index, function(err) {
          timer.done("Processed block " + index);
          callback();
        });
      };
      for(i = 0; i < body.result.tx.length; i++) {
        txQueue.push({ tx : body.result.tx[i] });
      }
    });

  });


}


var processIndexes = function() {
  console.log("Processing additional indexes");
  if(!blockchainIndexing.vertcoind || blockchainIndexing.vertcoind.progress != 100) {
    blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
    return;
  }

  blockchainIndexing.settingsDb.get("lastBlock", function(err, value) {
    var startBlock = 0;
    if(value) startBlock = parseInt(value);
    console.log("Starting building additional indexes from block: ",startBlock);
    blockchainIndexing.vertcoind.request('getblockcount', [], function(err, result, body) {
      var blockQueue = async.queue(processBlock, 1);
      blockQueue.drain = function() {
        blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
      };
      if(startBlock == body.result)
        blockQueue.drain();
      else
        for(i = startBlock + 1; i <= body.result; i++) {
          blockQueue.push(i);
        }

    });
  });
};

ensureIndexFolder(function() {
  setup(function() {
    blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
  });
})

module.exports = blockchainIndexing;
