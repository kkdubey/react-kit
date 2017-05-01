import mockery from 'mockery';

function mockServerBefore(done) {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
  });
  mockery.registerAllowable('../server');
  const secondMock = {};
  const thirdMock = {};
  mockery.registerMock('./routes', secondMock);
  mockery.registerMock('./assets', thirdMock);
  done();
}

function mockServerCleanup(done) {
  mockery.disable();
  done();
}

exports.mockServerBefore = mockServerBefore;
exports.mockServerCleanup = mockServerCleanup;
