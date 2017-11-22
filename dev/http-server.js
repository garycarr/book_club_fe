/*eslint-disable*/
require('dotenv').config();

var chalk = require('chalk'),
    httpServer = require('http-server'),
    target = process.argv[2],
    root,
    port;

// log a message on exit
process.on('exit', function (code) {
    console.log(chalk.red('Stopping ' + target + ' on ' + port + '; exiting with code: ' + code));
});

root = 'reports/coverage/html/';
port = process.env.PORT_COVERAGE;

// create our server
var server = httpServer.createServer({
    root: root
});

// listen on a port
server.listen(port);

console.log(chalk.green('Serving ' + target + ' on ' + port + ': http://localhost:' + port + '/'));
