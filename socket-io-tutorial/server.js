// Dependencies on http, url, file system and request modules
var http = require("http");
var url = require('url');
var fs = require('fs');
var httpRequest = require('request');

// Create an HTTP server and define basic router behaviour to serve our index page.
var server = http.createServer(function(request, response){
  var path = url.parse(request.url).pathname;
  switch(path) {
    case '/':
      fs.readFile(__dirname + '/index.html', function(error, data){
          if (error){
              response.writeHead(404);
              response.write('Error - page not found.');
              response.end();
          }
          else{
              response.writeHead(200, {'Content-Type': 'text/html'});
              response.write(data, 'utf8');
              response.end();
          }
      });
      break;
    default:
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Error - page not found.');
      response.end();
  }
});

// Instruct our server to listen for requests on port 8000.
server.listen(8000);

// Open a socket connection using the server we created.
var io = require('socket.io').listen(server);

// URL for the public price ticker on blockchain.info
var priceURL = 'https://blockchain.info/ticker';

// Initialise price variable and get starting data point from the API when we first load.
var price = 0;
httpRequest(priceURL, function (error, response, body) {
  try {
    price = JSON.parse(body).GBP.buy;
  } catch (e) {
    console.log("Couldn't get price from API.");
  }
});

// Define behaviour in response to scoket connection event.
// We trigger an interval function which obtains the price from the API.
// We then emit data via the socket which can be received by the client.
io.on('connection', function(socket){
  console.log('Client connected.');
  setInterval(function(){
      httpRequest(priceURL, function (error, response, body) {
        try {
          price = JSON.parse(body).GBP.buy;
        } catch (e) {
          console.log("Couldn't get price from API.");
        }
      });
      console.log('Emitting update \(' + price + '\).' );
      socket.emit('stream', {'price': price});
  }, 1000);
});
