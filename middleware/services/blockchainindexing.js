const fs = require('fs');
const path = require('path');
const ini = require('ini');
const uuidv4 = require('uuid/v4');
const async = require('async');
//const lmdb = require('node-lmdb');
const levelup = require('levelup');

var blockchainIndexing = {};

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
  blockchainIndexing.db = levelup(indexDir);
  /*blockchainIndexing.env = new lmdb.Env();
  blockchainIndexing.env.open({
      path: indexDir,
      mapSize: 20*1024*1024*1024, // maximum database size
      maxDbs: 3
  });
  blockchainIndexing.db = blockchainIndexing.env.openDbi({
      name: "blockchainIndexDb",
      create: true // will create if database did not exist
  });*/
  callback();
}

var processTx = function(hash, callback) {
  //console.log("Processing TX: ", hash);
  blockchainIndexing.vertcoind.request('getrawtransaction', [hash, true], function(err, result, body) {
    //blockchainIndexing.vertcoind.request('decoderawtransaction', [body.result], function(err, result, body) {
      if(!err && body.result) {
        for(var i = 0; i < body.result.vin.length; i++) {
          var txi = body.result.vin[i];
          if(txi.txid) {
            // Mark the output as spent
            //var txn = blockchainIndexing.env.beginTxn();
            //var value = txn.getString(blockchainIndexing.db, "txo-" + txi.txid + "-" + txi.vout);
            blockchainIndexing.db.get("txo-" + txi.txid + "-" + txi.vout, function(error, value) {
                if(error) { 
                    console.log("Error: VIN using a non-existing TXO", txi.txid);
                    blockchainIndexing.timeout = setTimeout(processTx, 10, hash, callback);
                    return;
                } else {
                
                    txo = JSON.parse(value);
                    txo.spent = true;
                    txo.spentTxID = hash;
                    blockchainIndexing.db.put("txo-" + txi.txid + "-" + txi.vout, JSON.stringify(txo), {"sync": true});
                }        
            });
            /*if(!value) { console.log("Error: VIN using a non-existing TXO"); }
            txo = JSON.parse(value);
            txo.spent = true;
            txo.spentTxID = hash;
            txn.putString(blockchainIndexing.db, "txo-" + txi.txid + "-" + txi.vout, JSON.stringify(txo));
            txn.commit();*/
            
          }
        }
        for(var i = 0; i < body.result.vout.length; i++) {
            var curTxo = i;
          if(!body.result.vout[i].scriptPubKey) {
            console.log("No scriptPubKey!", body.result.vout[i]);
          } else {
            switch(body.result.vout[i].scriptPubKey.type) {
              case 'pubkey':
              case 'pubkeyhash':
                for(var j = 0; j < body.result.vout[i].scriptPubKey.addresses.length; j++) {               
                  var addr = body.result.vout[i].scriptPubKey.addresses[j];
                  //var txn = blockchainIndexing.env.beginTxn();
                  blockchainIndexing.db.get(addr + "-txos", function(error, value) {
                      var txos = [];
                      if(!error && value) {
                          txos = JSON.parse(value);
                      }
                      
                      txos.push({txid : hash, vout : curTxo});
                      blockchainIndexing.db.batch([{type: 'put', key: addr + "-txos", value: JSON.stringify(txos)},
                      {type: 'put', key: "txo-" + hash + "-" + i, value: JSON.stringify({value:body.result.vout[curTxo].value})}], {"sync": true});
                  });
                  /*var value = txn.getString(blockchainIndexing.db, addr + "-txos");
                  var txos = [];
                  if(value) txos = JSON.parse(value);
                  txos.push({txid : hash, vout : i});
                  txn.putString(blockchainIndexing.db, addr + "-txos", JSON.stringify(txos));
                  txn.putString(blockchainIndexing.db, "txo-" + hash + "-" + i, JSON.stringify({value:body.result.vout[i].value}))
                  txn.commit();*/

                }
                break;
              case 'nulldata':
                // Ignore
                break;
              default:
                console.log("Unrecognized scriptPubKey type", body.result.vout[i]);
            }
          }
          //console.log("Found vout", );
        }
        
        callback();
      } else {
        console.log("Error", err);
        blockchainIndexing.timeout = setTimeout(processTx, 10, hash, callback);
        return;
      }
    //});
  });
}


var processBlock = function(index, callback) {
  if(index % 1000 === 0)
    console.log("Processing block", index);
  blockchainIndexing.vertcoind.request('getblockhash', [index], function(err, result, body) {
    if(!err && body.result) {
    blockchainIndexing.vertcoind.request('getblock', [body.result], function(err, result, body) {
      if(!err && body.result) {
          //console.log(body.result);
          var txQueue = async.queue(processTx, 1);
          txQueue.drain = function() {
            //var txn = blockchainIndexing.env.beginTxn();
            blockchainIndexing.db.put("lastBlock", index, {"sync": true});        
            //var value = txn.putString(blockchainIndexing.db, "lastBlock", index);
            //txn.commit();
            callback();
          };
          for(i = 0; i < body.result.tx.length; i++) {
            txQueue.push(body.result.tx[i]);
          }
      } else {
        console.log("Error", err);
        blockchainIndexing.timeout = setTimeout(processBlock, 10, index, callback);
        return;
      }
    });
    } else {
        console.log("Error", err);
        blockchainIndexing.timeout = setTimeout(processBlock, 10, index, callback);
        return;
    }
  });


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
    
    blockchainIndexing.db.get("lastBlock", function(error, value) {
      if(error) {
        value = 0;
      }
      
      value = parseInt(value);
      
      var startBlock = value;
    console.log("Starting building additional indexes from block: ",value);
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
  });

  //var txn = blockchainIndexing.env.beginTxn();
  //var value = txn.getString(blockchainIndexing.db, "lastBlock");
  //txn.commit();
 

  /*if(!value) value = -1;
  else value = parseInt(value);

    var startBlock = value;
    console.log("Starting building additional indexes from block: ",value);
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

    });*/

};

ensureIndexFolder(function() {
  setup(function() {
    blockchainIndexing.timeout = setTimeout(processIndexes, 1000);
  });
})

module.exports = blockchainIndexing;
