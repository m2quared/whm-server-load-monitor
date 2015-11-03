'use strict';

var app      = require('app');
var Tray     = require('tray');
var Menu     = require('menu');
var path     = require('path');
var cpanel   = require('cpanel-lib');

var load, tid, appIcon;
var show = 'one';
var iconBright  = path.join(__dirname, 'iconBright.png');

var options = {
    host: 'whm.domain.com',
    port: 2087,
    secure: true,
    username: 'WHM_USERNAME',
    accessKey: 'ACCESS_KEY',
    ignoreCertError: true
};

var cpanelClient = cpanel.createClient(options);

app.on('ready', function() {

    if (app.dock) app.dock.hide()
  
    appIcon = new Tray(iconBright);
  
    var contextMenu = Menu.buildFromTemplate(
    [{
        label: '1 minute avg',
        click: function() { changeDisplay('one'); },
        type: 'radio',
        checked: true
    },
    {
        label: '5 minute avg',
        click: function() { changeDisplay('five'); },
        type: 'radio'
    },
    {
        label: '15 minute avg',
        click: function() { changeDisplay('fifteen'); },
        type: 'radio'
    },
    {
        type: 'separator'
    },
    {
        label: 'Quit',
        selector: 'terminate:'
    },
    {
        label: 'Version ' + app.getVersion(),
        type: 'normal',
        enabled: false
    }]);
    
    appIcon.setTitle('--');
    appIcon.setContextMenu(contextMenu);

    ping();
});

function ping() {
    cpanelClient.call('loadavg', {}, function (err, res) {
        console.log('Load: ', res);
        load = res;
        setTitle();
    });

    tid = setTimeout(ping, 10000); // repeat myself
}

function changeDisplay(display) {
    show = display;
    setTitle();
}

function setTitle() {
    appIcon.setTitle(load[show]);
}
