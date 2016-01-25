'use strict';

/* global app */
window.addEventListener('initializeRouting', function() {
  try {
    history.redirect('!', '/app/');
    page.base(app.baseUrl.replace(/\/$/, ''));
  } catch (e) {}
  // Middleware
  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  function closeDrawer(ctx, next) {
    app.closeDrawer();
    next();
  }

  // Routes
  page('*', scrollToTop, closeDrawer, function(ctx, next) {
    next();
  });

  page('/', function() {
    app.route = 'request';
  });
  page('/request/saved/:savedId', function() {
    app.route = 'request';
    app.params = ctx.params;
  });
  page('/request/history/:historyId', function() {
    app.route = 'request';
    app.params = ctx.params;
  });
  page('/request/project/:projectid', function(ctx) {
    app.route = 'request';
    app.params = ctx.params;
  });

  page('/history', function() {
    app.route = 'history';
  });
  page('/settings', function() {
    app.route = 'settings';
  });
  page('/about', function() {
    app.route = 'about';
  });
  page('/socket', function() {
    app.route = 'socket';
  });
  page('/saved', function() {
    app.route = 'saved';
  });
  
  page('/dataimport', function() {
    app.route = 'dataimport';
  });

  // 404
  page('*', function() {
    page.redirect('/');
  });

  page({
    hashbang: true,
    popstate: false
  });

  let event = new Event('ArcInitialized');
  window.dispatchEvent(event);
});
