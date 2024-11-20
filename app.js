var http = require('http')
var fs = require('fs')

var server = http.createServer(function(req, res){s
    console.log('request was made: '+ req.url);
    res.writeHead(200, {'content-Type': 'text/html'});
    var myReadStream fs.createReadStream(__diname + '/Index.html', 'utf8');
    myReadStream.pipe(res);
});

server.listen(3000, '127.0.0.1');
console.log('yo dawgs, now listening to port 3000s ')