var express = require('express');
var bitcoin = require('bitcoinjs-lib');
var router = express.Router();
const async = require('async');

var vertcoinNetwork =  {
  messagePrefix: 'Vertcoin Signed Message:\n',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x47,
  scriptHash: 0x05,
  wif: 0x80
};


/* GET users listing. */
router.get('/addressBalance/:addr', function(req, res, next) {
  var balance = 0;

  var expandTxoLocal = function(txo, callback) {
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

  var queue = async.queue(expandTxoLocal, 10);
  queue.drain = function() {
    res.json({txos:expandedTxos});
  }
  getAddressTxos(req.params.addr, function(txos) {
    for(var i = 0; i < txos.length; i++)
    {
      queue.push(txos[i]);
    }
    if(txos.length === 0) queue.drain();
  });
});

router.get('/xpubBalance/:xpub', function(req, res, next) {

  var balance = 0;

  var expandTxoLocal = function(txo, callback) {
    expandTxo(txo, function(txoObject) {
      if(txoObject && !txoObject.spent)
        balance += txoObject.value;

      callback();
    });
  };

  var queue = async.queue(expandTxoLocal, 1);
  var node = bitcoin.HDNode.fromBase58(req.params.xpub,vertcoinNetwork);

  var maxNode = -1;
  var expandAddress = function(index, callback) {
    var derived = node.derive(index);
    address = derived.getAddress(vertcoinNetwork);
    getAddressTxos(address, function(txos) {
      for(var i = 0; i < txos.length; i++)
      {
        txos[i].address = address;
        queue.push(txos[i]);
      }
      if(txos.length > 0) {
        while(maxNode < index + 10) {
          maxNode++;
          addressQueue.push(maxNode);
        }
      }
      callback();
    });
  }



  var addressQueue = async.queue(expandAddress, 1);
  var sentResult = false;
  queue.drain = function() {
    if(addressQueue.length() == 0 && !sentResult)
    {
      sentResult = true;
      res.json({balance:balance});
    }
  }

  addressQueue.drain = function() {
    if(queue.length() == 0 && !sentResult)
    {
      sentResult = true;
      res.json({balance:balance});
    }
  }

  for(var i = 0; i < 10; i++)
  {
    maxNode++;
    addressQueue.push(maxNode);
  }
});

router.get('/xpubTxos/:xpub', function(req, res, next) {

  var expandedTxos = [];

  var expandTxoLocal = function(txo, callback) {
    expandTxo(txo, function(txoObject) {
      if(txoObject)
        expandedTxos.push(txoObject);

      callback();
    });
  };

  var queue = async.queue(expandTxoLocal, 1);
  var node = bitcoin.HDNode.fromBase58(req.params.xpub,vertcoinNetwork);

  var maxNode = -1;
  var expandAddress = function(index, callback) {
    var derived = node.derive(index);
    address = derived.getAddress(vertcoinNetwork);
    getAddressTxos(address, function(txos) {
      for(var i = 0; i < txos.length; i++)
      {
        txos[i].address = address;
        queue.push(txos[i]);
      }
      if(txos.length > 0) {
        while(maxNode < index + 10) {
          maxNode++;
          addressQueue.push(maxNode);
        }
      }
      callback();
    });
  }



  var addressQueue = async.queue(expandAddress, 1);
  var sentResult = false;
  queue.drain = function() {
    if(addressQueue.length() == 0 && !sentResult)
    {
      sentResult = true;
      res.json({txos:expandedTxos});
    }
  }

  addressQueue.drain = function() {
    if(queue.length() == 0 && !sentResult)
    {
      sentResult = true;
      res.json({txos:expandedTxos});
    }
  }

  for(var i = 0; i < 10; i++)
  {
    maxNode++;
    addressQueue.push(maxNode);
  }
});

var getAddressTxos = function(addr, callback) {
  var txos = [];
  router.blockchainIndexing.db.createReadStream({
    start: addr + "-txo-00001",
    end: addr + "-txo-99999"
  })
  .on('data', function(data) {
    txos.push(JSON.parse(data.value));
  })
  .on('end', function() {
    callback(txos);
  });
}

var expandTxo = function(txo, callback) {
  router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout, function (err, value) {
    router.blockchainIndexing.db.get("txo-" + txo.txid + "-" + txo.vout + "-spent", function (err, spent) {
      var txoObject = null;

      if(value) {
        txoObject = { value: parseFloat(value) };
        txoObject.txid = txo.txid;
        txoObject.vout = txo.vout;
        if(spent) {
          txoObject.spent = true;
          txoObject.spentTxID = spent;
        }
      }
      callback(txoObject);
    });
  });
};

router.get('/addressTxos/:addr', function(req, res, next) {
  var expandedTxos = [];

  var expandTxoLocal = function(txo, callback) {
    expandTxo(txo, function(txoObject) {
      if(txoObject)
        expandedTxos.push(txoObject);

      callback();
    });
  };

  var queue = async.queue(expandTxoLocal, 10);
  queue.drain = function() {
    res.json({txos:expandedTxos});
  }
  getAddressTxos(req.params.addr, function(txos) {
    for(var i = 0; i < txos.length; i++)
    {
      queue.push(txos[i]);
    }
    if(txos.length === 0) queue.drain();
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
