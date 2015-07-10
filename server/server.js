var http = require('http');
var nodeStatic = require('node-static');
var fileServer = new nodeStatic.Server('.');

var PORT = 8000;

http.createServer()
  .on('request', function(req, res) {

    req.on('data', function(chunk) {});

    req.on('end', function() {

      if (req.url == '/time') {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });

        res.end(JSON.stringify({
          time: Date.now(),
          zone: new Date().getTimezoneOffset()
        }));
        
        return;
      }

      fileServer.serve(req, res);
    });

  })
  .listen(PORT);

console.log('HTTP server started (port ' + PORT + ')');
