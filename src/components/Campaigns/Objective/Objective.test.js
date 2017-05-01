import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Objective } from './Objective';

describe('Objective', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };
    const staticData = new Map().set('brand_category', []);
    describe('Objective will return div', () => {
      const wrapper = shallow(
        <Objective
          campaigns={[]}
          campaign={{
            campaign_name: '',
            campaign_brand_category: '',
            campaign_objective: '',
            campaign_type: '',
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
