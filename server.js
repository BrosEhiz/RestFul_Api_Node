const http = require('http');
const app = require ('./app')

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, hostname, ()=> {
    console.log(`Listening for request @ http://${hostname}:${port}/`);
});
