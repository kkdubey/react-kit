import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Location } from './Location';

describe('Location', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };
    describe('Location will return div', () => {
      const wrapper = shallow(
        <Location
          location={{
            cities: [],
            locationInclude: true,
            markers: [],
          }}
          objective={{
            campaign_name: '',
            campaign_brand_category: '',
            campaign_objective: '',
            campaign_type: '',
          }}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
    });
  });
});
