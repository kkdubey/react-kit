import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Header } from './Header';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Navigation from '../Navigation';

describe('Header', () => {
  describe(' When User is present', () => {
    const wrapper = shallow(
      <Header
        user={{ status: 'OK', user: { name: 'User 1' },
          avtaarUrl: 'http://lorempixel.com/100/100/people' }}
      />
    );
    const AppbarWraper = wrapper.find(AppBar);
    const iconElementLeft = AppbarWraper.prop('iconElementLeft');
    const iconElementRight = shallow(AppbarWraper.prop('iconElementRight'));

    it('renders AppBar', () => {
      expect(wrapper.type()).to.be.equal('header');
      expect(wrapper.children().first().type()).to.be.equal(AppBar);
    });

    it('has Naviagation present', () => {
      expect(iconElementLeft.type).to.equal(Navigation);
    });

    it('has Right Element Feedback and Help', () => {
      expect(iconElementRight.find({ primaryText: 'Send feedback' }).length).to.equal(1);
      expect(iconElementRight.find({ primaryText: 'Help' }).length).to.equal(1);
    });

    it('has Right Element SignOut present Signin not present', () => {
      const menuItems = iconElementRight.find(MenuItem);
      expect(menuItems.length).to.equal(3);

      const signOutMenuItems = iconElementRight.find({ primaryText: 'Sign out' });
      expect(signOutMenuItems.length).to.equal(1);

      const signInMenuItems = iconElementRight.find({ label: 'Signin' });
      expect(signInMenuItems.length).to.equal(0);
    });
  });

  describe('When User is not present', () => {
    const wrapper = shallow(
      <Header user={{ status: 'Failed' }} />
    );
    const AppbarWraper = wrapper.find(AppBar);
    const iconElementLeft = AppbarWraper.prop('iconElementLeft');
    const iconElementRight = shallow(AppbarWraper.prop('iconElementRight'));

    it('renders AppBar', () => {
      expect(wrapper.type()).to.be.equal('header');
      expect(wrapper.children().first().type()).to.be.equal(AppBar);
    });

    it('has Naviagation present', () => {
      expect(iconElementLeft.type).to.equal(Navigation);
    });

    it('has Right Element Feedback and Help', () => {
      expect(iconElementRight.find({ primaryText: 'Send feedback' }).length).to.equal(1);
      expect(iconElementRight.find({ primaryText: 'Help' }).length).to.equal(1);
    });

    it('has Right Element SignOut not present Signin present', () => {
      const menuItems = iconElementRight.find(MenuItem);
      expect(menuItems.length).to.equal(2);

      const signOutMenuItems = iconElementRight.find({ primaryText: 'Sign out' });
      expect(signOutMenuItems.length).to.equal(0);

      const signInMenuItems = iconElementRight.find({ label: 'Signin' });
      expect(signInMenuItems.length).to.equal(1);
    });
  });
});
