import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { NewCampaign } from './NewCampaign';

describe('NewCampaign', () => {
  describe(' When user is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };

    describe(' brandcategory agegroup incomegroup is blank array', () => {
      const wrapper = shallow(
        <NewCampaign
          brandcategory={{ values: [] }}
          agegroup={{ values: [] }}
          incomegroup={{ values: [] }}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
    });
  });
});
