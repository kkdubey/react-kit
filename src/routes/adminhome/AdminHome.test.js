import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { AdminHome } from './AdminHome';
import Tab from 'material-ui/Tabs/Tab';
import Table from 'material-ui/Table/Table';

describe('AdminHome', () => {
  describe(' When userid 1 is loggedin and available in sessionStorage', () => {
    global.sessionStorage = { user: '{"user":{"id":"1"}}' };

    describe(' activeCampaigns is blank array', () => {
      const wrapper = shallow(
        <AdminHome
          campaigns={[]}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
      it('has 0 tabs', () => {
        const tabs = wrapper.find(Tab);
        expect(tabs.length).to.equal(0);
      });
      it('has 1 tables', () => {
        const tables = wrapper.find(Table);
        expect(tables.length).to.equal(1);
      });
    });

    describe(' activeCampaigns is 1 campaign array campaign name c1 ', () => {
      const wrapper = shallow(
        <AdminHome
          campaigns={[{ _id: 'ß', campaign_running_status: 'Started', campaign_name: 'c1',
            performance: { impressions: 1 }, campaign_budget: { amount: 1 } }]}
        />
      );

      it('renders w/o errors', () => {
        expect(wrapper.type()).to.be.equal('div');
      });
      it('has table rendered with one column as c1 ', () => {
        const campaignName = wrapper.find('TableRowColumn[children="c1"]');
        expect(campaignName.length).to.be.equal(1);
      });
      it('has table green color status ', () => {
        const campaignStatus = wrapper.find('TableRowColumn[children="Running"]');
        const { style } = campaignStatus.props('style');
        expect(style).to.include.keys('color');
        expect(style.color).to.be.equal('green');
      });
    });
  });
});
