const spawn = require('child_process').spawn;
const request = require('request')
const fs = require('fs');
const path = require('path');
const ini = require('ini');
const uuidv4 = require('uuid/v4');

var processName = 'vertcoind';
if(process.platform === 'win32')
  processName = 'vertcoind.exe';

var vertcoind = {};

var bootstrap = function() {
  vertcoind.status = "Creating folder for vertcoind";
  vertcoind.progress = 5;
  ensureVertcoindFolder(function() {
    vertcoind.status = "Creating folder for vertcoind data";
    vertcoind.progress = 10;
    ensureDataFolder(function() {
      vertcoind.status = "Checking if daemon is present";
      vertcoind.progress = 15;
      checkDownloaded(function() {
        vertcoind.status = "Checking RPC config";
        vertcoind.progress = 25;
        checkRpcConfig(function(rpcUser, rpcPassword) {
          vertcoind.status = "Starting vertcoin daemon";
          vertcoind.progress = 40;
          vertcoind.rpcUser = rpcUser;
          vertcoind.rpcPassword = rpcPassword;
          startNode(function() {
            vertcoind.status = "Waiting for JSON-RPC to be ready";
            vertcoind.progress = 55;
            checkJsonRPCAvailable(function() {
              vertcoind.status = "Ready";
              vertcoind.progress = 100;
            });
          });
        });
      });
    });
  });

}

vertcoind.request = function(method, params, callback, retry) {
  if(retry === undefined) retry = true;
  var time = Date.now()
  var requestBody = {
    jsonrpc: "1.0",
    id: time,
    method: method,
    params: params
  };
  request.post('http://localhost:5888/',{ 'auth' : {
    user : vertcoind.rpcUser,
    pass : vertcoind.rpcPassword
  }, 'body' : JSON.stringify(requestBody), 'timeout' : 30}, function(err, result, body) {
    if(err && !retry === false) {
      vertcoind.request(method, params, callback, retry);
    } else {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.log("Error parsing JSON",e,"\r\nJSON:\r\n",body);
        vertcoind.request(method, params, callback, retry);
        return;
      }
      callback(err, result, body);
    }
  });

}

var checkJsonRPCAvailable = function(callback) {
  vertcoind.request('getblockcount', [], function(err, result, body) {
    if(!err && result.statusCode === 200) {
      callback();
    } else {
      setTimeout(function() { checkJsonRPCAvailable(callback); }, 500);
    }

  });
};

var startNode = function(callback) {
  var process = path.join(__dirname, '..', 'vertcoind' , processName);
  var arguments = ['--txindex','--datadir=' + path.join(__dirname, '..', 'vertcoind', 'data')];
  vertcoind.nodeProcess = spawn(process, arguments);
  vertcoind.nodeProcess.stdout.on('data', (data) => {
    console.log(`vertcoind [out]: ${data}`);
  });

  vertcoind.nodeProcess.stderr.on('data', (data) => {
    console.log(`vertcoind [err]: ${data}`);
  });

  vertcoind.nodeProcess.on('close', (code) => {
    console.log(`vertcoind exited with code ${code}`);
  });
  callback();
}

var ensureVertcoindFolder = function(callback) {
  var vertcoindDir = path.join(__dirname, '..', 'vertcoind');
  if(!fs.existsSync(vertcoindDir))
  {
    fs.mkdir(vertcoindDir, function(err) {
      // TODO: Error handling
      callback();
    });
  } else {
    callback();
  }
}

var ensureDataFolder = function(callback) {
  var dataDir = path.join(__dirname, '..', 'vertcoind', 'data');
  if(!fs.existsSync(dataDir))
  {
    fs.mkdir(dataDir, function(err) {
      // TODO: Error handling
      callback();
    });
  } else {
    callback();
  }
}

var checkDownloaded = function(callback) {
  if(!fs.existsSync(path.join(__dirname, '..', 'vertcoind' , processName)))
  {
    const platform = process.platform.replace('darwin', 'mac').replace('win32', 'win').replace('freebsd', 'linux').replace('sunos', 'linux');
    const architecture = process.arch;

    if(platform === 'mac') {

    } else if (platform === 'win') {

    } else if (platform === 'linux') {

    }
  } else {
    callback();
  }
}

var checkRpcConfig = function(callback) {
  var config = {};
  var dataDir = path.join(__dirname, '..', 'vertcoind', 'data');
  var vertcoindConfigFile = path.join(dataDir, 'vertcoin.conf');
  if(fs.existsSync(vertcoindConfigFile)) {
    config = ini.parse(fs.readFileSync(vertcoindConfigFile, 'utf-8'))
  }

  config.server = '1';
  config.rpcallowip = '127.0.0.1';
  config.rpcport = '5888';

  if(!config.rpcuser || !config.rpcpassword) {
    config.rpcuser = 'vertcoinrpc';
    config.rpcpassword = uuidv4();
    config.rpcworkqueue = 64;
  }

  fs.writeFileSync(vertcoindConfigFile, ini.stringify(config));
  callback(config.rpcuser, config.rpcpassword);
}

setTimeout(bootstrap, 100);

module.exports = vertcoind;
