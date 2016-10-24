var express = require('express');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var handler = require('./request-handler');


var db = require('./db/config');
var User = require('./db/models/User');
var Goal = require('./db/models/Goal');
var Task = require('./db/models/Task');

// server
var app = express();

app.use(bodyParser.json());
// middleware
//app.use();

//routes
app.get('/', handler.getHandler);
// app.get('/', handler.getHandler);
// app.get('/', handler.getHandler);

//app.post('/', handler.postHandler);

app.post('/addTask', handler.addTask);

app.get('/addGoal', handler.getGoal);
app.post('/addGoal', handler.addGoal);

app.put('/toggleTask', handler.toggleTask);


// listen
app.set('port', 3000);

app.listen(app.get('port'), function () {
  console.log('Listening on port ' + app.get('port') );
});
