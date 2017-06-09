var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://alsolh.asuscomm.com:32770');
var questions = '';
var savedDistance = 0;

var express = require('express');
var restApp = express();
var preparedResponse;

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/classroom.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly','https://www.googleapis.com/auth/classroom.coursework.students.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'classroom.googleapis.com-nodejs-quickstart.json';

console.log(TOKEN_PATH);

client.on('connect', function () {
    client.subscribe('telemetry/student1');
    //client.publish('World','testssss111222333');
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    telemetry = JSON.parse(message);
    if(!(questions === '')) {
        var targetedQuestion = '';
        console.log(questions.courseWork[0].title);
        targetedQuestion = clone(questions);
        questionContent = JSON.parse(questions.courseWork[0].description);
        var distance = getDistanceFromLatLonInKm(telemetry.latitude, telemetry.longitude, questionContent.parameters.latitude, questionContent.parameters.longitude).toFixed(2);
        if (!(savedDistance === distance)) {
            targetedQuestion.courseWork[0].description = questionContent.body.replace('<value>', distance);
            console.log(targetedQuestion.courseWork[0].description);
            console.log(targetedQuestion.courseWork[0].multipleChoiceQuestion);
            for (var i = 0; i < targetedQuestion.courseWork[0].multipleChoiceQuestion.choices.length; i++) {
                console.log(targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i]);
                targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i] = targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i].replace('<value>', distance);
                console.log(targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i]);
                targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i] = eval(targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i]).toFixed(2);
                console.log(targetedQuestion.courseWork[0].multipleChoiceQuestion.choices[i]);
            }
            console.log(JSON.stringify(targetedQuestion));
            client.publish('assessments/student1',JSON.stringify(targetedQuestion));
            savedDistance = distance;
        }
    }
    //client.end()
})

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Classroom API.
  
  //restApp.get('/', function (req, res) {
    // res.send(preparedResponse);
   authorize(JSON.parse(content), listCourses);
});

//var server = restApp.listen(8081, function () {
//   var host = server.address().address
//   var port = server.address().port
//
//   console.log("Example app listening at http://%s:%s", host, port)
//})
  

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listCourses(auth) {
  var classroom = google.classroom('v1');
  classroom.courses.list({
    auth: auth,
    pageSize: 10
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    
    var courses = response.courses;
    if (!courses || courses.length == 0) {
      console.log('No courses found.');
    } else {
      console.log('Courses:');
      for (var i = 0; i < courses.length; i++) {
        var course = courses[i]; 
        console.log('%s (%s)', course.name, course.id);
        listCourseWorks(auth,course.id);
      }
    }
  });
}

function listCourseWorks(auth, cid) {
  var classroom = google.classroom('v1');
  classroom.courses.courseWork.list({
    auth: auth,
    courseId:cid
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log("logging coursework for course id:" + cid);
    console.log(response);
    questions = response;
      //client.publish('assessments/student1',JSON.stringify(response));
  });
}