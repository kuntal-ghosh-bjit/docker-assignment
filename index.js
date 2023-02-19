const http = require('http');
const fs = require('fs');

let counter = 0;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the HTML page
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/counter') {
    // Return the current value of the counter
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(counter.toString());
  } else {
    // Return a 404 error for any other requests
    res.writeHead(404);
    res.end('Not found');
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Listen for WebSocket connections on the same port
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for button clicks
  socket.on('buttonClick', () => {
    counter++;
    io.emit('counterUpdate', counter);
  });
});
