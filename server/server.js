var http = require('http');
var nodeStatic = require('node-static');
var fileServer = new nodeStatic.Server('.');

var PORT = 8000;

http.createServer()
  .on('request', function(req, res) {

    req.on('data', function(chunk) {});

    req.on('end', function() {

      if (req.url == '/upload' && req.method == 'POST') {
        console.log('Получен файл');

        res.writeHead(200, 'OK');
        res.end();

        return;
      }

      if (req.method != 'GET') {
        res.writeHead(405, 'Method Not Allowed', {
          'Allow': 'GET'
        });
        res.end();

        return;
      }

      fileServer.serve(req, res);
    });

  })
  .listen(PORT);

console.log('HTTP server started (port ' + PORT + ')');
