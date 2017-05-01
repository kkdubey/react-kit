OneMedia Dashboard Project
===

This project includes source code for OneMedia Dashboard Project

Build Status
[ ![Codeship Status for onedigitalad/onemedia-dashboard](https://codeship.com/projects/90483f90-c1c7-0133-4163-52a5a9222382/status?branch=master)](https://codeship.com/projects/137590)


## prerequisites


Make sure following is installed
* Mongo 3.0+
* Redis3.0 +
* Cassandra 3.0+
* Node 6.0+
* Npm 3.3+
* PostgresSql


[Teck stack & development process](https://github.com/onedigitalad/onemedia-dashboard/wiki)


## Get Started

Install dependencies 


```shell
npm install
```

Starting Development server
npm start

[Detailed development guide](docs/getting-started.md)



## Unit Testing

### Automated Unit Test cases

```shell
npm test
```

### Running tests without coverage report
```shell
npm run test:unit
```


### Running lint with autofix attempt
```shell
npm run lintfix
```

### Running pagespeed insights locally
```shell
npm run build -- --release
node build/server.js
npm run psi
```



## Integration Testing

### Integration Test localhost:3001 chrome

```shell
npm start
npm install -g selenium-standalone@latest
selenium-standalone install
selenium-standalone start
npm run test:integration-local
```

### Integration Test localhost:3001 in browserstack-ie

Download the installer from https://www.browserstack.com/local-testing#command-line

```shell
npm run build -- --release
node build/server.js
export BROWSERSTACK_USERNAME=xxxx
export BROWSERSTACK_ACCESS_KEY=xxxx
~/Downloads/BrowserStackLocal $BROWSERSTACK_ACCESS_KEY localhost,3000,0
npm run test:integration-local-bs
```

### Integration Test cases heroku in chrome


```shell
npm install -g selenium-standalone@latest
selenium-standalone install
selenium-standalone start
npm run test:integration-heroku
```

### Integration Test cases run on heroku in browserstack-ie


```shell
export BROWSERSTACK_USERNAME=xxxx
export BROWSERSTACK_ACCESS_KEY=xxxx
npm run test:integration-heroku-bs
```


## Staging Setup

###staging is setup can be accesed with [heroku url](http://onemedia-dashboard.herokuapp.com)

```shell
npm run deploy -- --release
```
### License

Copyright (c) 2016 OneDigitalAd

