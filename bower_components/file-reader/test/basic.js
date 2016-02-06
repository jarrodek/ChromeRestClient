suite('basic', function() {
        test('file-reader reads the file', function(done) {
            var f = fixture('basic');
            var reader = f.querySelector('file-reader');
            var debug = JSON.stringify({
                hello: "world"
            }, null, 2);
            var blob = new Blob([debug], {
                type: 'application/json'
            });
            reader.blob = blob;
            reader.readAs = 'text';
            reader.addEventListener('file-read', function(e) {
                var result = e.detail.result;
                expect(result).to.be.a('string');
                expect(foo).to.equal(debug);
                done();
            });
            reader.addEventListener('file-error', function(e) {
              should.not.exist(e);
            });
            reader.read();
        });
        test('file-reader reads the file automatically', function(done) {
            var f = fixture('basic');
            var reader = f.querySelector('file-reader');
            var debug = JSON.stringify({
                hello: "world"
            }, null, 2);
            var blob = new Blob([debug], {
                type: 'application/json'
            });
            reader.blob = blob;
            reader.readAs = 'text';
            reader.addEventListener('file-read', function(e) {
                var result = e.detail.result;
                expect(result).to.be.a('string');
                expect(foo).to.equal(debug);
                done();
            });
            reader.addEventListener('file-error', function(e) {
              should.not.exist(e);
            });
            reader.auto = true;
        });
    });