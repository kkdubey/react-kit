import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { BudgetAndSchedule } from './BudgetAndSchedule';

describe('BudgetAndSchedule', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };

    describe('BudgetAndSchedule will return div', () => {
      const wrapper = shallow(
        <BudgetAndSchedule
          budget={{
            currency: '10',
            total: '',
            cpm: '',
            campaign_budget_upload: '',
          }}
          schedule={{
            startdate: '',
            enddate: '',
            starttime: '',
            endtime: '',
            campaign_schedule_upload: '',
          }}
          fequencyCapUser={{
            total_views: '100',
            daily_views: '10',
          }}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
    });
  });
});
