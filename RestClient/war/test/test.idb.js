describe('Indexed DB connector', function() {

  /**
   * Legacy requests definitions used in tests
   */
  var requests = [{
    "id": 1,
    "headers": "X-Test-Header: header value\nX-2d-heade: text value",
    "method": "GET",
    "name": "Text request #1",
    "payload": "",
    "skipHeaders": 0,
    "skipHistory": 0,
    "skipMethod": 0,
    "skipParams": 0,
    "skipPath": 0,
    "skipPayload": 0,
    "skipProtocol": 0,
    "skipServer": 0,
    "time": 1450722152707,
    "url": "http://test.com/jsonapi/getLocations.json?lang=pl"
  }, {
    "id": 2,
    "headers": "X-Test-Header2: header value\nX-2d-heade: text value\nContent-Type: application/atom+xml",
    "method": "POST",
    "name": "Text request #2",
    "payload": "<atom>\n</atom>",
    "skipHeaders": 0,
    "skipHistory": 0,
    "skipMethod": 0,
    "skipParams": 0,
    "skipPath": 0,
    "skipPayload": 0,
    "skipProtocol": 0,
    "skipServer": 0,
    "time": 1450722152707,
    "url": "http://test.com/test2/"
  }];
  var project = {
    'name': 'Test project',
    'time': 1450722152685
  };

  describe('Database opened', function() {
    it('Open should not throw an error', function() {
      return arc.app.db.idb.open()
        .should.be.fulfilled();
    });
  });

  describe('headers store', function() {
    let header = {
      key: 'X-Test header',
      type: 'request',
      desc: 'test case',
      example: 'test case example'
    };

    it('Inserting header should return key', function() {
      return arc.app.db.idb.open()
        .then(function(db) {
          return db.transaction('rw', db.headers, function(headers) {
              return db.headers.put(header);
            })
            .finally(function() {
              db.close();
            });
        })
        .should.be.fulfilledWith([header.key, header.type])
    });

    it('getHeaderByName() should return header', function() {
      return arc.app.db.idb.getHeaderByName('X-Test header', 'request')
        .should.be.fulfilledWith(header);
    });

    it('getHeadersByName() should return list with the header', function() {
      return arc.app.db.idb.getHeadersByName('X-Test header', 'request')
        .should.be.fulfilledWith([header]);
    });
  });

  describe('historyUrls store', function() {

    let url = {
      'url': 'http://www.domain.com/path.js?param=value#hash',
      'time': 123
    };

    it('addUrlHistory() should return key', function() {
      return arc.app.db.idb.addUrlHistory(url.url, url.time)
        .should.be.fulfilledWith(url.url);
    });

    it('getHistoryUrls() should return a historyUrls', function() {
      return arc.app.db.idb.getHistoryUrls(url.url)
        .should.be.fulfilledWith([url]);
    });

    it('updateUrlHistory() should return a historyUrls key', function() {
      return arc.app.db.idb.updateUrlHistory(url.url, url.time)
        .should.be.fulfilledWith(url[arc.app.db.idb._db.historyUrls.schema.primKey.name]);
    });

  });


  describe('projects store', function() {

    it('importProjectWithRequests() should return project key', function() {
      return arc.app.db.idb.importProjectWithRequests(project, requests)
        .should.be.fulfilled()
        .should.be.finally.a.Number();
    });

    it('getProject() should return newly created project from legacy import', function() {
      return arc.app.db.idb.importProjectWithRequests(project, requests)
        .then(function(projectId) {
          return arc.app.db.idb.getProject(projectId);
        })
        .should.be.fulfilled()
        .should.finally.have.properties({
          'name': project.name,
          'created': new Date(project.time)
        });
    });

    it('updateProjectLegacy() should update only title property.', function() {
      var updateTitle = 'It is updated title';
      return arc.app.db.idb.importProjectWithRequests(project, requests)
        .then(function(projectId) {
          return arc.app.db.idb.getProject(projectId);
        })
        .then(function(project) {
          return arc.app.db.idb.updateProjectLegacy(project.id, updateTitle, project.created);
        })
        .then(function(projectId) {
          return arc.app.db.idb.getProject(projectId);
        })
        .should.be.fulfilled()
        .should.finally.have.properties({
          'name': updateTitle,
          'created': new Date(project.time)
        });
    });

    it('listProjects() should not be empty array.', function() {
      return arc.app.db.idb.listProjects()
        .should.be.fulfilled()
        .should.be.finally.an.Array()
        .should.not.be.finally.empty();
    });

    it('deleteProject() should be fulfilled.', function() {
      return arc.app.db.idb.importProjectWithRequests(project, requests)
        .then(function(projectId) {
          return arc.app.db.idb.deleteProject(projectId);
        })
        .should.be.fulfilled();
    });

    it('addProject() should be fulfilled.', function() {
      return arc.app.db.idb.addProject('test project', new Date())
        .then(function(projectId) {
          return arc.app.db.idb.deleteProject(projectId);
        })
        .should.be.fulfilled();
    });

    it('deleteProjectRecursive() should fulfill.', function() {
      return arc.app.db.idb.importProjectWithRequests(project, requests)
        .then(function(projectId) {
          return arc.app.db.websql.deleteProjectRecursive(projectId);
        })
        .should.be.fulfilled();
    });

  });

  describe('requestObjects store', function() {

    it('importRequests() should import legacy requests and result with not empty array', function() {
      return arc.app.db.idb.importRequests(requests)
        .should.be.fulfilled()
        .should.be.finally.an.Array()
        .should.not.be.finally.empty()
        .should.finally.matchEach(function(value) {
          value.should.not.be.NaN();
        });
    });

    it('importRequests() should not accept not array argument', function() {
      return arc.app.db.idb.importRequests({
          name: 'test'
        })
        .should.be.rejected();
    });

    it('getRequest() should result with RequestObject', function() {
      return arc.app.db.idb.importRequests(requests)
        .then(function(ids) {
          return arc.app.db.idb.getRequest(ids[0]);
        })
        .should.be.finally.instanceof(RequestObject, 'It is not a RequestObject mister.');
    });

    it('getProjectRequests() should return an array of RequestObjects.', function() {
      return arc.app.db.idb.importProjectWithRequests(project, requests)
        .then(function(projectId) {
          return arc.app.db.idb.getProjectRequests(projectId);
        })
        .should.be.fulfilled()
        .should.be.finally.an.Array()
        .should.not.be.finally.empty();
    });

  });

});
