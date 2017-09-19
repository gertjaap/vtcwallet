const fs = require('fs');
const path = require('path');
const ini = require('ini');
const uuidv4 = require('uuid/v4');
const async = require('async');
const level = require('level');
const zpad = require('zpad');
const bech32 = require('bech32');

var blockCache = {};
var blockchainIndexing = {};
var last100 = new Date();
var last100txos = 0;
var last100txis = 0;
var last100txes = 0;

var ensureIndexFolder = function(callback) {
  var indexDir = path.join(__dirname, '..');
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
  var indexDir = path.join(__dirname, '..');

  blockchainIndexing.db = level(path.join(indexDir,'blockchainIndex'));
  callback();
}

var readKey = function(key, callback) {
  if(blockCache[key]) callback(blockCache[key]);
  else {
    blockchainIndexing.db.get(key, function (err, value) {
      if(err) callback(undefined);
      else callback(value);
    });
  }
}

var putKey = function(key, value) {
  blockCache[key] = value;
}

var getNextIndex = function(key, callback) {
  var nextIndex = 0;
  blockchainIndexing.db.createKeyStream({
    start: key + "-00000001",
    end: key + "-99999999"
  })
  .on('data', function() {
    nextIndex++;
  })
  .on('end', function() {
    nextIndex++;
    while(blockCache[key + "-" + zpad(nextIndex,8)] !== undefined)
      nextIndex++;
    callback(nextIndex);
  });
}

var commitKeys = function(callback) {
  var batch = [];
  for (var key in blockCache) {
    if (blockCache.hasOwnProperty(key)) {
      batch.push({type:'put',key:key,value:blockCache[key]});
    }
  }
  blockchainIndexing.db.batch(batch, {"sync": true}, function(err) {
    callback();
  });

  blockCache = {};
}

var processTx = function(payload, callback) {
  //var timer = blockchainIndexing.winston.startTimer();

  var hash = payload.tx;
  var txn = payload.txn;
  var block = payload.block;
  last100txes++;

  blockchainIndexing.vertcoind.request('getrawtransaction', [hash, true], function(err, result, body) {
    //timer.done("Got raw TX ");

    if(body.result) {

      var processVin = function(txi, innerCallback) {
        var started = new Date();

        if(!txi.txid) {
          innerCallback();
          return;
        }

        last100txis++;

        putKey("txo-" + txi.txid + "-" + txi.vout + "-spent", hash);
        innerCallback();
      };

      var processVout = function(txo, innerCallback) {
        if(!txo.scriptPubKey) {
          console.log("No scriptPubKey!", txo);
          innerCallback();
          return;
        } else {
          var processAddress = function(addr, innerInnerCallback) {
            getNextIndex(addr + "-txo", function(nextIndex){
              putKey(addr + "-txo-" + zpad(nextIndex,8), JSON.stringify({txid : hash, vout : txo.index}));
              innerInnerCallback();
            });
          };

          var addrDrain = function() {
            putKey("txo-" + hash + "-" + txo.index, txo.value);
            innerCallback();
          };

          switch(txo.scriptPubKey.type) {
            case 'pubkey':
            case 'scripthash':
            case 'pubkeyhash':
              last100txos++;

              var processAddressQueue = async.queue(processAddress, 10);
              processAddressQueue.drain = addrDrain;
              if(txo.scriptPubKey.addresses.length == 0) processAddressQueue.drain();
              for(var j = 0; j < txo.scriptPubKey.addresses.length; j++) {
                var addr = txo.scriptPubKey.addresses[j];
                processAddressQueue.push(addr);
              }

              break;
            case 'witness_v0_keyhash':
            case 'witness_v0_scripthash':
                last100txos++;
                var hashes = txo.scriptPubKey.asm.split(' ');

                var processAddressQueue = async.queue(processAddress, 1);
                processAddressQueue.drain = addrDrain;
                if(hashes.length == 0) processAddressQueue.drain();
                for(var j = 1; j < hashes.length; j++) {
                    var hashWords = bech32.toWords(Buffer.from(hashes[j], 'hex'));
                    // first word should be the witness version
                    hashWords = [0].concat(hashWords);
                    var addr = bech32.encode('vtc', hashWords);
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
        //var innerTimer = blockchainIndexing.winston.startTimer();
        if(payload.txi) processVin(payload.txi, function() {
          //innerTimer.done("Processed vin " + payload.txi.index);
          callback();
        });
        if(payload.txo) processVout(payload.txo, function() {
          //innerTimer.done("Processed vout " + payload.txo.index);
          callback();
        });
      }

      var vinoutQueue = async.queue(processVinout, 1);
      vinoutQueue.drain = function() {
        //timer.done("Done processing vin/vout");

        callback();
      }
      var count = 0;
      for(var i = 0; i < body.result.vin.length; i++) {
        var txi = body.result.vin[i];
        txi.index = i;
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
  }, true);
}


var processBlock = function(index, callback) {
  if(index % 100 == 0)
  {
    var timePer100 = new Date() - last100;
    last100 = new Date();
    console.log("Processing block", index, "Time per 100:", timePer100, "TX:", last100txes, "TXO:", last100txos);
    last100txos = 0;
    last100txis = 0;
    last100txes = 0;
  }
  var started = new Date();
  blockchainIndexing.vertcoind.request('getblockhash', [index], function(err, result, body) {
    //timer.done("Get blockhash " + index);
    blockchainIndexing.vertcoind.request('getblock', [body.result], function(err, result, body) {
      //timer.done("Get block " + index);

      var txQueue = async.queue(processTx, 1);
      txQueue.drain = function() {
        putKey("lastBlock", index);
        if(index % 1000 == 0) {
          commitKeys(callback);
        } else {
          callback();
        }
      };
      for(i = 0; i < body.result.tx.length; i++) {
        txQueue.push({ tx : body.result.tx[i] });
      }
    }, true);

  }, true);


}


var processIndexes = function() {
    console.log("Processing additional indexes");
    if(!blockchainIndexing.vertcoind || blockchainIndexing.vertcoind.progress != 100) {
        blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
        return;
    }

    blockchainIndexing.vertcoind.request('getblockchaininfo', [], function(err, result, body) {
        if(err) {
            console.log("Error", err);
            blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
            return;
        }

        if(body.result.verificationprogress < 0.999) {
            console.log("vertcoind not yet synced, waiting. Progress: " + body.result.verificationprogress);
            blockchainIndexing.timeout = setTimeout(processIndexes, 1000 * 120);
            return;
        }

        readKey("lastBlock", function(value) {
        var startBlock = 0;
        if(value) startBlock = parseInt(value);
        console.log("Starting building additional indexes from block: ",startBlock);
        blockchainIndexing.vertcoind.request('getblockcount', [], function(err, result, body) {
          var blockQueue = async.queue(processBlock, 1);
          blockQueue.drain = function() {
            commitKeys(function() {
              blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
            });

          };
          if(startBlock == body.result)
            blockQueue.drain();
          else
            for(i = startBlock + 1; i <= body.result; i++) {
              blockQueue.push(i);
            }

        }, true);
        });
    });
};

ensureIndexFolder(function() {
  setup(function() {
    blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
  });
})

module.exports = blockchainIndexing;
