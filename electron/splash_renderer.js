// This file is required by the splash.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('status-data', function (event, data) {
    document.getElementById('status').innerText = data.initStatus;
    document.getElementById('progress').innerText = data.initProgress;
});
