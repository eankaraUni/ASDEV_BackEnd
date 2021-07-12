var express = require('express');
//var http = require("http");
var app = express();
//var server = http.createServer(app);

app.get('/', function (req, res) {
res.send('Hello axsacsWorld');
});
// var server = app.listen(3000, function () {
// var host = server.address().address
// var port = server.address().port
// console.log("Example app listening at http://%s:%s", host, port)
// })
app.listen(3000);