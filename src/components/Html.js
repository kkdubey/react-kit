import React, { PropTypes } from 'react';
import { analytics } from '../config';

function Html({ title, style, script, children, state }) {
  return (
    <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />

        <title>OneMedia</title>
        <meta
          name="description" content="OneMedia Platform The Leading
          Real-Time Advertising Platform for Brands and Advertisers.
          Manage display advertising through a single platform.
          Get insights, Take actions, Achieve results."
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="OneMedia Platform" />
        <link rel="apple-touch-icon-precomposed" href="180x180.png" />
        <meta name="msapplication-TileImage" content="152x152.png" />
        <meta name="msapplication-TileColor" content="#3372df" />
        <link rel="shortcut icon" href="favicon32X32.png" />
        <link rel="stylesheet" href="filepicker.css" />
        <link rel="stylesheet" href="dropzone.min.css" />
        <link rel="apple-touch-icon" sizes="57x57" href="57x57.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="76x76.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="120x120.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="128x128.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="180x180.png" />
        <style id="css" dangerouslySetInnerHTML={{ __html: style }} />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {script && (
          <script
            id="source"
            src={script}
            data-initial-state={JSON.stringify(state)}
          />
        )}
        {analytics.google.trackingId &&
          <script
            dangerouslySetInnerHTML={{ __html:
            'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
            `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
          />
        }
        {analytics.google.trackingId &&
          <script src="https://www.google-analytics.com/analytics.js" async defer />
        }
      </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  script: PropTypes.string,
  children: PropTypes.string,
  state: PropTypes.object.isRequired,
};

export default Html;
