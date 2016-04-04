(function() {
'use strict';

/* global app */
window.addEventListener('initializeRouting', function() {

  function mayStopController(ctx, next) {
    var ctrl = document.querySelector('#pages [opened]');
    if (!ctrl || !ctrl.mayStop) {
      next();
      return;
    }
    Promise.resolve(ctrl.mayStop())
    .then((may) => {
      if (may) {
        next();
      }
    })
    .catch(() => {
      next();
    });
  }

  // Middleware
  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  function closeDrawer(ctx, next) {
    app.closeDrawer();
    next();
  }

  function sendScreen(ctx, next) {
    var path = ctx.path;
    var screenName = '[unknown]';
    switch (ctx.path) {
      case '': screenName = 'Request - empty'; break;
      case 'request/project': screenName = 'Request - project'; break;
      case 'request/saved': screenName = 'Request - saved'; break;
      case 'request/history': screenName = 'Request - history'; break;
      case 'request/current': screenName = 'Request - current'; break;
      case 'request/drive': screenName = 'Request - drive'; break;
      case 'history': screenName = 'History'; break;
      case 'settings': screenName = 'Settings'; break;
      case 'about': screenName = 'About'; break;
      case 'socket': screenName = 'Socket'; break;
      case 'saved': screenName = 'Saved'; break;
      case 'dataimport': screenName = 'Data import / export'; break;
    }
    arc.app.analytics.sendScreen(screenName);
    next();
  }
  // Routes
  arc.app.router.middle(mayStopController, scrollToTop, closeDrawer, sendScreen);
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
  arc.app.router.register('/request/drive/:driveId', function(ctx) {
    ctx.params.type = 'drive';
    app.params = ctx.params;
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
})();
