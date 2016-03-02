'use strict';

/* global app */
window.addEventListener('initializeRouting', function() {

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
  arc.app.router.middle(scrollToTop, closeDrawer);

  arc.app.router.register('/', function() {
    var params = {
      'type': 'restore'
    };
    app.params = params;
    app.route = 'request';
  });

  arc.app.router.register('/request/saved/:savedId', function(ctx) {
    ctx.params.type = 'saved';
    app.params = ctx.params;
    app.route = 'request';
  });
  arc.app.router.register('/request/history/:historyId', function(ctx) {
    ctx.params.type = 'history';
    app.params = ctx.params;
    app.route = 'request';
  });
  arc.app.router.register('/request/project/:projectid', function(ctx) {
    ctx.params.type = 'project';
    app.params = ctx.params;
    app.route = 'request';
  });
  arc.app.router.register('/request/current', function() {
    var params = {
      'type': 'current'
    };
    app.params = params;
    app.route = 'request';
  });

  arc.app.router.register('/history', function() {
    app.route = 'history';
  });
  arc.app.router.register('/settings', function() {
    app.route = 'settings';
  });
  arc.app.router.register('/about', function() {
    app.route = 'about';
  });
  arc.app.router.register('/socket', function() {
    app.route = 'socket';
  });
  arc.app.router.register('/saved', function() {
    app.route = 'saved';
  });

  arc.app.router.register('/dataimport', function() {
    app.route = 'dataimport';
  });
  window.page = arc.app.router.redirect;
  arc.app.router.start();
  //
  // // 404
  // page('*', function() {
  //   //console.warn('redirecting unknown page.');
  //   page.redirect('/');
  // });
  //
  // page({
  //   hashbang: true,
  //   popstate: false
  // });

  let event = new Event('ArcInitialized');
  window.dispatchEvent(event);
});
