import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressSession from 'express-session';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import { ErrorPage } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { mongoUrl, port, auth, analytics, apiMode } from './config';
import cors from 'cors';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import fs from 'fs';
import FileStreamRotator from 'file-stream-rotator';
import compression from 'compression';
import postgres from './core/db';
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { setLoginSuccess } from './actions/login';

postgres.connect(async (client) => {
  if (client) {
    console.warn('connected successfully with reports db.');
  }
}, (err) => {
  console.warn('Got the error while connecting with reports db');
  console.warn(err);
});

const app = express();
const logDirectory = `${__dirname}/logs`;

// ensure logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

app.use(cors());
app.use(favicon(`${__dirname}/public/favicon32X32.png`));

const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: `${logDirectory}/onemedia_dashboard-%DATE%.log`,
  frequency: 'daily',
  verbose: false,
});

function skipFunction(req, res) {
  return res.statusCode < 400;
}

if (app.get('env') === 'production') {
  app.use(morgan('common', {
    skip: skipFunction,
    stream: accessLogStream,
  }));
} else {
  // Prints log in
  app.use(morgan('dev'));
}

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

const mongoose = require('mongoose');
mongoose.connect(mongoUrl);

function connectionError() {
  console.warn('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
}

mongoose.connection.on('error', connectionError);

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));
app.use(expressSession({
  secret: auth.jwt.secret,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  }
);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register API middleware for static content
// -----------------------------------------------------------------------------
// app.use('/api/content', require('./api/content').default);

//
// Register API middleware for backend data
// -----------------------------------------------------------------------------

//
// Content upload api.
app.use('/api/content', require('./api/content/content').default);

// Campaign Dashboard api.
app.use('/api/dc', require('./api/dashboard/campaign').default);

// Campaign Dashboard api.
app.use('/api/sa', require('./api/dashboard/site').default);

// Campaign api
app.use('/api/campaign', require('./api/campaign').default);

// backend api
app.use('/api/user', require('./api/user').default);

// Reach api
app.use('/api/reach', require('./api/reach').default);

// Static api
app.use('/api/static', require('./api/static').default);

// backend api
app.use('/api/contactus', require('./api/contactus').default);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    let css = [];
    let statusCode = 200;
    const data = { title: '', description: '', style: '', script: assets.main.js, children: '' };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    const store = configureStore({}, {
      cookie: req.headers.cookie,
    });

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    store.dispatch(setRuntimeVariable({
      name: 'apiMode',
      value: apiMode,
    }));

    if (req.user) {
      store.dispatch(setLoginSuccess({
        email: req.user.email,
        user: {
          status: 'OK',
          avtaarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/8d3k/128.jpg',
          user: req.user,
        },
      }));
    }

    await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      context: {
        store,
        insertCss: (...styles) => {
          styles.forEach(style => css.push(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },

        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = [];
        statusCode = status;
        data.children = ReactDOM.renderToString(component);
        data.style = css.join('');
        data.state = store.getState();
        return true;
      },
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

    res.status(statusCode);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err));
  const statusCode = err.status || 500;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>
  );
  res.status(statusCode);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */

module.exports = app;
