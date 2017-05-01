/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.css';
import Footer from '../Footer';
import Header from '../../components/Header';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { fullBlack, fullWhite, amberA700, deepPurple200,
   deepPurple50, deepPurple500, amber200 }
  from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import Location from '../../core/history';

let userAgent = undefined;

if (userAgent === undefined && typeof global.navigator !== 'undefined') {
  userAgent = global.navigator.userAgent;
}

userAgent = userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36';//  eslint-disable-line max-len

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepPurple500,
    primary2Color: deepPurple200,
    primary3Color: deepPurple50,
    accent1Color: amberA700,
    accent2Color: deepPurple200,
    accent3Color: deepPurple50,
    textColor: fullBlack,
    alternateTextColor: fullWhite,
    canvasColor: fullWhite,
    borderColor: deepPurple50,
  },
  stepper: {
    activeAvatarColor: amber200,
    avatarSize: 48,
  },
}, { userAgent });

class App extends Component {
  static propTypes = {
    context: PropTypes.shape({
      store: PropTypes.object.isRequired,
      insertCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func,
    }).isRequired,
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      setTitle: context.setTitle || emptyFunction,
      setMeta: context.setMeta || emptyFunction,
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentDidMount() {
    try {
      if (this.props.context.store.getState().onemedia.loggedInUser.status !== 'OK') {
        if (!(Location.getCurrentLocation().pathname === '/Signin'
          || Location.getCurrentLocation().pathname === '/')) {
          // Should be dispatcher console.log('Unauthorized redirect to SignIn Page..');
          Location.push({
            pathname: '/Signin',
          });
        }
      }
    } catch (error) {
      console.error('Error occured', error); // eslint-disable-line no-console
    }
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    if (this.props.error) {
      return this.props.children;
    }

    const store = this.props.context.store;
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <Header />
            <main className={s.container}>
            {this.props.children}
            </main>
            <Footer />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }

}

export default App;
injectTapEventPlugin();
