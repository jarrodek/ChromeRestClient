(function() {
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

  function sendScreen(ctx, next) {
    // var path = ctx.path;
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
      case 'project':
        if (ctx.params.action === 'edit') {
          screenName = 'Edit project';
        }
        break;
      case 'drive': screenName = 'Drive selector'; break;
    }
    var event = new CustomEvent('send-analytics', {
      detail: {
        type: 'screenview',
        name: screenName,
        bubbles: true
      }
    });
    document.dispatchEvent(event);
    next();
  }
  // Routes
  arc.app.router.middle(scrollToTop, closeDrawer, sendScreen);
  arc.app.router.register('/', function() {
    var params = {
      'type': 'restore'
    };
    app.params = params;
    app.route = 'request';
  });
  // arc.app.router.register('/request/saved/:savedId/:indexId', function(ctx) {
  //   ctx.params.type = 'saved';
  //   app.params = ctx.params;
  //   app.route = 'request';
  // });
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
  arc.app.router.register('/request/history/:historyId/:indexId', function(ctx) {
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
  arc.app.router.register('/project/:projectId/edit', function(ctx) {
    ctx.params.action = 'edit';
    app.params = ctx.params;
    app.route = 'project';
  });
  arc.app.router.register('/drive', function() {
    app.route = 'drive';
  });
  window.page = arc.app.router.redirect;
  arc.app.router.start();

  window.addEventListener('navigate', function(e) {
    let params = e.detail;
    var url;
    switch (params.base) {
      case 'default': url = '/'; break;
      case 'history': url = '/history'; break;
      case 'settings': url = '/settings'; break;
      case 'about': url = '/about'; break;
      case 'socket': url = '/socket'; break;
      case 'saved': url = '/saved'; break;
      case 'dataimport': url = '/dataimport'; break;
      case 'project':
        if (params.id) {
          url = '/project/' + params.id;
        }
        break;
      case 'request':
        url = '/request/' + params.type + '/' + encodeURIComponent(params.id);
        break;
      case 'drive': url = '/drive'; break;
    }
    if (url) {
      arc.app.router.redirect(url);
    } else {
      throw new Error('The route is not handled correctly', params);
    }
  });

  let event = new Event('ArcInitialized');
  window.dispatchEvent(event);
});
})();
