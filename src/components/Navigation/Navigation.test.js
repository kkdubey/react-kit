import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Navigation } from './Navigation';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import browserHistory from '../../core/history';
import IconButton from 'material-ui/IconButton/IconButton';
import sinon from 'sinon';

describe('Navigation', () => {
  describe(' When User is operations@onedigitalad.com disableFeatures:false', () => {
    const wrapper = shallow(
      <Navigation
        user={{
          status: 'OK',
          user: { name: 'User 1', email: 'operations@onedigitalad.com' } }}
        disableFeatures={false}
      />
    );

    it('renders w/o errors', () => {
      expect(wrapper.type()).to.be.equal('div');
    });

    it('has 5 menu items', () => {
      const menuItems = wrapper.find(MenuItem);
      expect(menuItems.length).to.equal(5);
    });

    it('has Home,Campaigns Reports,Campaigns Admin,Site Visitor Report,New Campaign', () => {
      const menuItems = ['Home', 'Campaigns Reports',
        'Campaigns Admin', 'Site Visitor Report', 'New Campaign'];
      menuItems.map((menuItem) =>
        expect(wrapper.find({ primaryText: menuItem }).length).to.equal(1));
    });

    it('has New Campaign disabled', () => {
      const menuItems = wrapper.find({ primaryText: 'New Campaign' });
      expect(menuItems.length).to.equal(1);
      expect(menuItems.first().prop('disabled')).to.be.equal(false);
    });
  });

  describe(' When User is operations@xyz.com disableFeatures:true', () => {
    const wrapper = shallow(
      <Navigation
        user={{
          status: 'OK',
          user: { name: 'User 1', email: 'operations@xyz.com' } }}
        disableFeatures
      />
    );

    it('renders w/o errors', () => {
      expect(wrapper.type()).to.be.equal('div');
    });

    it('has 5 menu items', () => {
      const menuItems = wrapper.find(MenuItem);
      expect(menuItems.length).to.equal(5);
    });

    it('has Home,Campaigns Reports,Campaigns Admin,Site Visitor Report,New Campaign', () => {
      const menuItems = ['Home', 'Campaigns Reports',
        'Campaigns Admin', 'Site Visitor Report', 'New Campaign'];
      menuItems.map((menuItem) =>
        expect(wrapper.find({ primaryText: menuItem }).length).to.equal(1));
    });

    it('has New Campaign enabled', () => {
      const menuItems = wrapper.find({ primaryText: 'New Campaign' });
      expect(menuItems.length).to.equal(1);
      expect(menuItems.first().prop('disabled')).to.be.equal(true);
    });
  });

  describe(' When User is not present', () => {
    const wrapper = shallow(
      <Navigation
        user={undefined}
      />
    );

    it('renders w/o errors', () => {
      expect(wrapper.type()).to.be.equal('div');
    });

    it('has 4 menu items', () => {
      const menuItems = wrapper.find(MenuItem);
      expect(menuItems.length).to.equal(4);
    });

    it('does not have ,Campaigns Reports,Campaigns Admin,Site Visitor Report,New Campaign', () => {
      const menuItems = ['Campaigns Reports',
        'Campaigns Admin', 'Site Visitor Report', 'New Campaign'];
      menuItems.map((menuItem) =>
        expect(wrapper.find({ primaryText: menuItem }).length).to.equal(0));
    });

    it('onTouchTap Home menuitem should call browserHistory.push / and has open false', () => {
      sinon.stub(browserHistory, 'push').returns(true);
      wrapper.find({ primaryText: 'Home' }).simulate('touchTap');
      expect(browserHistory.push.called).to.equal(true);
      expect(browserHistory.push.calledOnce).to.equal(true);
      expect(browserHistory.push.calledWith('/')).to.equal(true);
      expect(wrapper.state().open).to.equal(false);
      browserHistory.push.restore();
    });

    it('onTouchTap IconButton should call toggle open state', () => {
      wrapper.find(IconButton).simulate('touchTap');
      expect(wrapper.state().open).to.equal(true);
      wrapper.find(IconButton).simulate('touchTap');
      expect(wrapper.state().open).to.equal(false);
      wrapper.find(IconButton).simulate('touchTap');
      expect(wrapper.state().open).to.equal(true);
      wrapper.find(IconButton).simulate('touchTap');
      expect(wrapper.state().open).to.equal(false);
    });
  });
});
