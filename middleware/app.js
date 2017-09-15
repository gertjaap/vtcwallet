var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var vertcoind = require('./services/vertcoind');

winston.level = 'debug';
winston.add(winston.transports.File, { filename: 'middleware.log' });

var blockchainIndexing = require('./services/blockchainindexing');
blockchainIndexing.vertcoind = vertcoind;
blockchainIndexing.winston = winston;

var index = require('./routes/index');
index.vertcoind = vertcoind;

var status = require('./routes/status');
status.vertcoind = vertcoind;
status.blockchainIndexing = blockchainIndexing;

var blockExplorer = require('./routes/blockexplorer');
blockExplorer.blockchainIndexing = blockchainIndexing;
blockExplorer.vertcoind = vertcoind;

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/status', status);
app.use('/blockExplorer', blockExplorer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
