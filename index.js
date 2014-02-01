var app     = require('http').createServer(handler),
    io      = require('socket.io').listen(app),
    fs      = require('fs'),
    watcher = require('chokidar').watch(process.argv[2]),
    clients = [];
    
console.log("Watching: ", process.argv[2]);
    
var prototyperShellHTML = fs.readFileSync(__dirname + '/www/index.html');


watcher.on("change", function(path) {
  console.log(path);
  for(var i=0;i<clients.length;i++) {
    clients[i].emit("update", path);
  }
});

app.listen(process.env.PORT | 8080);

function handler (req, res) {

    if(req.url == "/") {
        res.setHeader("Content-Type", "text/html");
        res.end(prototyperShellHTML);
    } else {
        fs.readFile(req.url.substr(1), function(err, data) {
           if(err) {
               res.writeHead(404);
               res.end("File not found: " + req.url);
               return;
           }
           
           res.writeHead(200);
           res.end(data);
        });
    }
}

io.sockets.on('connection', function (socket) {
  clients.push(socket);
});