/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from './App';

describe('App', () => {

  it('renders children correctly', () => {
    const wrapper = shallow(
      <App context={{ insertCss: () => {} }}>
        <div className="child" />
      </App>
    );

    /*

<Provider store={[undefined]}>
<MuiThemeProvider muiTheme={{...}}>
<div>
<WithStyles(Header) user={{...}} logout={[Function]} />
<main className={[undefined]}>
<div className="child" doLogin={[Function]} user={{...}} logout={[Function]} />
</main>
<WithStyles(Footer) />
</div>
</MuiThemeProvider>
</Provider>
    console.log(wrapper.children().first().childAt(1).debug());

    */
    console.log(wrapper.debug());
    const mainDiv = wrapper
      .children()
      .first()
      .children()
      .first()
      .childAt(1);
    expect(mainDiv.childAt(0).hasClass('child')).to.be.true;

  });

});
