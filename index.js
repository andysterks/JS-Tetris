var express = require('express');
var app = express();
const path = require('path');

app.listen(3000, () => {
    console.log("listening . . . ");
 });
 
 app.use(express.static('static'));

 app.get('/*', function (request, response){
    response.sendFile(path.join(__dirname, 'static','index.html'));
  })