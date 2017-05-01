import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Footer } from './Footer';
import Link from '../Link';

describe('Footer', () => {
  describe(' When User is present', () => {
    const wrapper = shallow(<Footer />);
    const links = wrapper.find(Link);
    it('renders footer component with 4 links', () => {
      expect(wrapper.type()).to.be.equal('footer');
      expect(links.length).to.be.equal(4);
      expect(wrapper.text()).to.contain('© OneDigitalAd(2016)');
    });
  });
});
