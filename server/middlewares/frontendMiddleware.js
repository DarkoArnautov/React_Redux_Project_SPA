/* eslint-disable global-require */
const express = require('express');
const path = require('path');
const compression = require('compression');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
var btoa = require('btoa');
var https = require('https');
var jquery = require('https');
var querystring = require('querystring');
var conf = require('../../app/conf');
var stripe = require('stripe')(conf.stripeSecretKey);

var tokenUser = {
  username: 'test1234',
  apiToken: '5eee2e7c-962f-4013-ac86-356b7379b49f',
};
// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      const filename = req.path.replace(/^\//, '');
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
    });
  }

  app.get('/user/:username/verify_email', function(req, res) {
    const username = req.params && req.params.username;
    const query = req.query;
    if (typeof username === 'undefined' || typeof query === 'undefined') {
      return res.json({
        status: 422,
        field: 'username or token',
        message: 'username or token not found',
      });
    }

    const getUrl = 'users' + req.originalUrl.substring(5);

    sendReq('GET', getUrl, req, function(response, body) {
      console.log(response.statusCode);
      if (response.statusCode === 404) {
        return res.json({
          status: 404,
          field: 'token',
          message: 'token is not found',
        });
      } else if (response.statusCode === 422) {
        return res.json({
          status: 422,
          field: 'token',
          message: 'Invalid token',
        });
      }
      return res.redirect('/');
    });
  });

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });

  function sendReq(option, dest, req, cb) {
    var host = conf.host;
    if (req.body.content && req.body.save) {
      req.body = { content: JSON.parse(req.body.content) };
    }
    var myCookie = req.headers['set-cookie'] || '';
    var request = require('request');

    request(
      {
        uri: 'https://' + host + '/api/' + dest,
        rejectUnauthorized: false,
        method: option,
        headers: {
          Authorization: req.headers['Authorization'] || 'Basic',
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: myCookie,
        },
        form: req.body,
      },
      function(error, response, body) {
        if (error) return console.log(error);
        cb(response, body);
      }
    );
  }


  app.post('/users/new', function(req, res, next) {
    sendReq('POST', 'users', req, function(response, body) {
      res.send(response);
    });
  });

  app.post('/users/login', function(req, res, next) {
    sendReq('POST', 'session', req, function(response, body) {
      res.send(response);
    });
  });

  app.post('/users', function(req, res, next) {
    req.headers.Authorization =
      'Basic ' + btoa('ziyang:b15bee73-119b-4df1-9c0c-81c581c528ca');
    sendReq('GET', 'users', req, function(response, body) {
      res.send(body);
    });
  });


  app.post('/users/info', function(req, res, next) {
    req.headers.Authorization =
      'Basic ' + btoa('ziyang:b15bee73-119b-4df1-9c0c-81c581c528ca');
    delete req.headers['set-cookie'];
    sendReq('GET', 'users/' + req.body.username, req, function(response, body) {
      res.send(body);
    });
  });


};
// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy

  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.get('/user/:username/verify_email', function(req, res) {
    const username = req.params && req.params.username;
    const query = req.query;
    if (typeof username === 'undefined' || typeof query === 'undefined') {
      return res.json({
        status: 422,
        field: 'username or token',
        message: 'username or token not found',
      });
    }

    const getUrl = 'users' + req.originalUrl.substring(5);

    sendReq('GET', getUrl, req, function(response, body) {
      console.log(response.statusCode);
      if (response.statusCode === 404) {
        return res.json({
          status: 404,
          field: 'token',
          message: 'token is not found',
        });
      } else if (response.statusCode === 422) {
        return res.json({
          status: 422,
          field: 'token',
          message: 'Invalid token',
        });
      }
      return res.redirect('/');
    });
  });

  app.get('*', (req, res) => {
    //console.log(req.session);
    if (
      !/chunks|claraplayer|\.jpg$|\.ico$|\.png|appcache|\.json/.test(req.path)
    ) {
      res.sendFile(path.resolve(outputPath, 'index.html'));
    } else {
      //    console.log(req.path.substring(22))
      res.sendFile(path.resolve(outputPath, req.path.substring(22)));
    }
  });

  function sendReq(option, dest, req, cb) {
    var host = conf.host;
    if (req.body.content && req.body.save) {
      req.body = { content: JSON.parse(req.body.content) };
    }
    var myCookie = req.headers['set-cookie'] || '';
    var request = require('request');
    request(
      {
        uri: 'https://' + host + '/api/' + dest,
        rejectUnauthorized: false,
        method: option,
        headers: {
          Authorization: req.headers['Authorization'] || 'Basic',
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: myCookie,
        },
        form: req.body,
      },
      function(error, response, body) {
        if (error) return console.log(error);
        cb(response, body);
      }
    );
  }


  app.post('/users/new', function(req, res, next) {
    sendReq('POST', 'users', req, function(response, body) {
      res.send(response);
    });
  });

  app.post('/users', function(req, res, next) {
    req.headers.Authorization =
      'Basic ' + btoa('ziyang:b15bee73-119b-4df1-9c0c-81c581c528ca');
    sendReq('GET', 'users', req, function(response, body) {
      res.send(body);
    });
  });

  app.post('/users/login', function(req, res, next) {
    sendReq('POST', 'session', req, function(response, body) {
      res.send(response);
    });
  });


  app.post('/users/info', function(req, res, next) {
    req.headers.Authorization =
      'Basic ' + btoa('ziyang:b15bee73-119b-4df1-9c0c-81c581c528ca');
    delete req.headers['set-cookie'];
    sendReq('GET', 'users/' + req.body.username, req, function(response, body) {
      res.send(body);
    });
  });

};

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    addProdMiddlewares(app, options);
  } else {
    var webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};
