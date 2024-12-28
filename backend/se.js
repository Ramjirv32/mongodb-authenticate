// Import the HTTP module from Node.js
const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Log the incoming request (for demonstration)
  console.log('Request received!');

  // Simulate a time-consuming task (e.g., reading from a database or file)
  setTimeout(() => {
    // Send the response after the simulated task (non-blocking I/O)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Request processed after delay. Hello from Node.js!');
  }, 2000); // Simulate a delay of 2 seconds
});

// Define the server to listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
