import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Creative } from './Creative';

describe('Creative', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };

    describe('Creative will return div', () => {
      const wrapper = shallow(
        <Creative />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
    });
  });
});
