var express = require('express');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var handler = require('./request-handler');
var stormpath = require('express-stormpath');


var db = require('./db/config');
var User = require('./db/models/User');
var Goal = require('./db/models/Goal');
var Task = require('./db/models/Task');

// server
var app = express();
app.use(express.static(__dirname + '/../client/app'));

// middleware
app.use(bodyParser.json());
app.use(stormpath.init(app, {
  web: {
    spa: {
      enabled: true,
      view: __dirname + '/../client/app/index.html'
    }
  }
}));

//routes
app.get('/', handler.getHandler);
app.get('/getGoals/:userId', handler.getGoals);
app.post('/addTask', handler.addTask);
app.post('/addGoal', handler.addGoal);
app.put('/toggleTaskCompleted', handler.toggleTaskCompleted);
app.put('/makeTaskComplete', handler.makeTaskComplete);
app.put('/makeGoalComplete', handler.makeGoalComplete);
app.get('/getTasksOfGoal/:goalId', handler.getTasksOfGoal);
app.get('/getTasksOfTask/:parentId', handler.getTasksOfTask);
// app.get('/elemsOfGoal/:id', handler.getElemsOfGoal);


// listen
app.set('port', 3000);

app.on('stormpath.ready', function () {
  app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port') );
  });
});

// app.listen(app.get('port'), function () {
//   console.log('Listening on port ' + app.get('port') );
// });
