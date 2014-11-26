'use strict';

/* global __dirname */

var Home2 = require('../../../verticalhome/test/marionette/lib/home2');
var Search = require('./lib/search');
var Server = require('../../../../shared/test/integration/server');
var Rocketbar = require('../../../system/test/marionette/lib/rocketbar.js');

var assert = require('chai').assert;

marionette('Browser test', function() {

  var client = marionette.client(Home2.clientOptions);
  var search, system, server, home, rocketbar;

  suiteSetup(function(done) {
    Server.create(__dirname + '/fixtures/', function(err, _server) {
      server = _server;
      done();
    });
  });

  setup(function() {
    home = new Home2(client);
    search = new Search(client);
    rocketbar = new Rocketbar(client);
    system = client.loader.getAppClass('system');
    system.waitForStartup();
    search.removeGeolocationPermission();
  });


  test.skip('Test title injecting html', function() {
    var url = server.url('xsstitle.html');

    // Launch the rocketbar and trigger its first run notice
    home.waitForLaunch();
    home.focusRocketBar();
    search.triggerFirstRun(rocketbar);

    // Input a url and press enter to visit
    rocketbar.enterText(url + '\uE006');
    rocketbar.switchToBrowserFrame(url);

    // Go home
    client.switchToFrame();
    home.pressHomeButton();

    client.apps.launch(Search.URL);
    client.apps.switchToApp(Search.URL);

    client.waitFor(function() {
      return search.getHistoryResults().length == 1;
    });

    var title = client.executeScript(function() {
      return document.querySelector('#history .title').innerHTML;
    });

    assert.equal(title, '&lt;em&gt;test&lt;/em&gt;');
  });

  test.skip('Large Icon', function() {

    var url = server.url('largeicon.html');

    home.waitForLaunch();
    home.focusRocketBar();
    search.triggerFirstRun(rocketbar);

    // Input a url and press enter to visit
    rocketbar.enterText(url + '\uE006');
    rocketbar.switchToBrowserFrame(url);

    client.switchToFrame();
    home.pressHomeButton();

    client.apps.launch(Search.URL);
    client.apps.switchToApp(Search.URL);

    client.waitFor(function() {
      return search.getHistoryResults().length == 1;
    });

    var width = client.executeScript(function() {
      var icon = document.querySelector('#history .icon');
      return icon.clientWidth;
    });

    assert.equal(width, 16);
  });

  test.skip('Ensure fallback to url when no place title', function() {

    var url = server.url('notitle.html');

    home.waitForLaunch();
    home.focusRocketBar();
    search.triggerFirstRun(rocketbar);

    // Input a url and press enter to visit
    rocketbar.enterText(url + '\uE006');
    rocketbar.switchToBrowserFrame(url);

    client.switchToFrame();
    home.pressHomeButton();

    client.apps.launch(Search.URL);
    client.apps.switchToApp(Search.URL);

    client.waitFor(function() {
      return search.getTopSites().length == 1;
    });

    var topSite = search.getTopSites()[0];
    assert.equal(topSite.text(), url);
  });
});