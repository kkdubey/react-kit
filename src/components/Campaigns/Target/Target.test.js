import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Target } from './Target';

describe('Target', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };
    const staticData = new Map().set('age_group', []);
    staticData.set('income_group', []);
    describe('Target will return div', () => {
      const wrapper = shallow(
        <Target
          target={{
            gender: '',
            income_group: [],
            tags: [],
            agegroup: [],
            interests: [],
            websites: [],
            tagsInclude: true,
            interestsInclude: true,
            webSitesInclude: true,
          }}
          staticData={staticData}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
    });
  });
});
