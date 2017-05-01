/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import Link from '../Link';

function Footer() {
  return (
    <footer className={s.container}>
      <div>
        <ul className={s.linkedlist}>
          <li>
            <span>© OneDigitalAd(2016)</span>
            <span className={s.spacer}>·</span>
          </li>
          <li>
            <Link to="/not-found">Term Of Use</Link>
            <span className={s.spacer}>·</span>
          </li>
          <li>
            <Link to="/about">About us</Link>
            <span className={s.spacer}>·</span>
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
            <span className={s.spacer}>·</span>
          </li>
          <li>
            <Link to="/contact">Contact us</Link>
          </li>
        </ul>
      </div>
    </footer>

  );
}

export { Footer as Footer };
export default withStyles(s)(Footer);
