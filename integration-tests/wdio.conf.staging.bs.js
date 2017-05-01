exports.config = {

  specs: [
    './integration-tests/specs/**/*.js',
  ],

  // capabilities: [{ browserName: 'firefox' }],

  host: 'hub.browserstack.com',
  port: 80,
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  capabilities: [{
    browserName: 'ie',
    os: 'Windows',
    os_version: '10',
  }],

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error

  logLevel: 'error',

  //
  // Enables colors for log output.
  coloredLogs: true,

  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './errorShots/',

  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", the base url gets prepended.
  baseUrl: 'http://onemedia-dashboard.herokuapp.com',

  //
  // Default timeout for all waitForXXX commands.
  waitforTimeout: 10000,

  framework: 'mocha',

  reporters: ['dot'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 90000,
    slow: 1000,
  },

  //
  // =====
  // Hooks
  // =====
  // Run functions before or after the test. If one of them returns with a promise, WebdriverIO
  // will wait until that promise got resolved to continue.
  //
  // Gets executed before all workers get launched.

  before: () => {
    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');

    chai.use(chaiAsPromised);
    chai.Should();
    chaiAsPromised.transferPromiseness = browser.transferPromiseness;
  },

};
