var http = require('http');
var fs = require('fs');
var url = require('url');
var serverUrl = "127.0.0.1";


// Create a server
var server = http.createServer( function (request, response) {
    // Parse the request containing file name
    var pathname = url.parse(request.url).pathname;

    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");

    // Read the requested file content from file system
    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            console.log(err);
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {'Content-Type': 'text/html'});
        }else{
            //Page found
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200, {'Content-Type': 'text/html'});

            // Write the content of the file to response body
            response.write(data.toString());
        }
        // Send the response body
        response.end();
    });
});
var io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.on('writeDataToFile', function(message){
        fs.writeFile(message.file, message.data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
    socket.on('writeJsonToFile', function(message){
        fs.writeFile(message.file, JSON.stringify(message.data), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });

    socket.on('appendDataToFile', function(message){
        fs.appendFile(message.file, message.data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Changes saved!");
        });
    });

    socket.on('readProcessedData', function(msg){
        fs.readFile('processed.txt', 'utf8', function (err, data) {
            socket.emit('readProcessedData',data);
        })
    });
});
server.listen(3000, serverUrl);
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');/**
 * Created by rostam on 12.09.16.
 */
