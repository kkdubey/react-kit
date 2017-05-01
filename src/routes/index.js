/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import App from '../components/App';

// Child routes
import home from './home';
import contact from './contact';
import login from './login';
import signin from './signin';
import register from './register';
import content from './content';
import error from './error';
import siteanalytics from './siteanalytics';
import dashboard from './dashboard';
import underconstruction from './underconstruction';
import adminHome from './adminhome';
import newCampaign from './newcampaign';

export default {

  path: '/',

  children: [
    home,
    signin,
    siteanalytics,
    dashboard,
    adminHome,
    underconstruction,
    newCampaign,
    contact,
    login,
    register,
    content,
    error,

  ],

  async action({ next, render, context }) {
    const component = await next();
    if (component === undefined) return component;
    return render(
      <App context={context}>{component}</App>
    );
  },

};
