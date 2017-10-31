var argv = require('minimist')(process.argv.slice(2));
var targetWatch = '192.168.0.123'
console.dir(argv);
try {
    if (argv.targetWatch != null) {
        targetWatch = argv.targetWatch;
    }
}
catch(err) {}



var d = new Date();
var n = d.getTime();
var episode = argv.episodeId + '-' + n;


//tconfig
const { execSync } = require('child_process');
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
try{

    /*var sudo = require('sudo');
    var options = {
        cachePassword: true,
        prompt: 'Password, yo? ',
        spawnOptions: { /!* other options for spawn *!/ }
    };
    var child = sudo([ 'sudo tcdel --device ens33 --all' ], options);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    child = sudo([ 'sudo tcset -f /home/alsolh/code/wearable-school-workspace/tcconfigprofiles/testdummy.json' ], options);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });*/


var stdout = execSync('sudo tcdel --device ens33 --all');

}
catch(err) {
    console.log(err.message);
}

try{
    if(argv.profile != "Phy-wifi-baseline") {
        var stdout = execSync('sudo tcset -f /home/alsolh/code/wearable-school-workspace/wearable-school-server/tcconfigprofiles/' + argv.profile + '.json');
        var stdout = execSync('sudo tcshow --device ens33');
    }
console.log(stdout.toString());
}
catch(err) {
    console.log(err.message);
}
//tconfig

//tshark
// http://nodejs.org/api.html#_child_processes
const { exec } = require('child_process');
console.log('tshark -i any -f "tcp port 3000 or tcp port 1883" -w /home/alsolh/code/wearable-school-workspace/wearable-school-server/pcaps/'+ episode + '.pcap');
exec('tshark -i any -f "tcp port 3000 or tcp port 1883" -w /home/alsolh/code/wearable-school-workspace/wearable-school-server/pcaps/'+ episode + '.pcap', (err, stdout, stderr) => {
    if (err) {
        console.log(err.message);
        // node couldn't execute the command
        return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
console.log(`stderr: ${stderr}`);
});
//tshark


var sensors = ["HRM", "GPS", "LIGHT", "PEDOMETER", "PRESSURE", "ULTRAVIOLET"];
//var sensorsAggregatedObject =
var bunyan = require('bunyan');
var LogStream = require('bunyan-couchdb-stream');
var log = bunyan.createLogger({
    name: 'wearableschoolserver',
    //streams: [{
    //    stream: new LogStream('http://admin:asolh787@192.168.43.10:5984/watchlog'),
    //    type: 'raw' // this is required
    //}],
});
var http = require('http');
var btoa = require('btoa');
var async = require('async');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var mqtt = require('mqtt');
var jsonQuery = require('json-query');
//var client  = mqtt.connect('mqtt://alsolh.asuscomm.com:32770');
var client  = mqtt.connect('mqtt://192.168.0.110:1883');
var questions = '';
var savedDistance = 0;

var express = require('express');
var restApp = express();
var preparedResponse;

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var tempCourses;
var allCourses = null;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/classroom.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly','https://www.googleapis.com/auth/classroom.coursework.students.readonly','https://www.googleapis.com/auth/classroom.profile.emails','https://www.googleapis.com/auth/classroom.profile.photos','https://www.googleapis.com/auth/classroom.rosters','https://www.googleapis.com/auth/classroom.rosters.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
//var TOKEN_DIR = '/home/alsolh/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'classroom.googleapis.com-nodejs-quickstart.json';

console.log(TOKEN_PATH);

client.on('connect', function () {
    client.subscribe('telemetry/#');
    client.subscribe('wrapper/#');
    //client.publish('World','testssss111222333');
})

function registerWatch(data){
/*    var req = new XMLHttpRequest();
    req.open("POST", 'http://192.168.43.10:5984/watches', true);
    //req.open("POST", 'http://alsolh.myqnapcloud.com:32772/watches', true);
    req.setRequestHeader("Authorization", "Basic " + btoa('admin' + ":" + 'asolh787'));
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this.status + ' - ' + this.responseText);
            //window.open('authorized.html');
        }
    };
    req.send(JSON.stringify(data));*/
// An object of options to indicate where to post to
    var post_options = {
        host: '192.168.0.110',
        port: '5984',
        path: '/watches',
        method: 'POST',
        headers: {
            'Authorization': "Basic " + btoa('admin' + ":" + 'asolh787'),
            'Content-Type': 'application/json'
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(JSON.stringify(data));
    post_req.end();

}

client.on('message', function (topic, message) {
    var d = new Date();
    var n = d.getTime();
    payLoad = JSON.parse(message.toString());
    //var responseTimeMW;
    //try {
    //    responseTimeMW = payLoad.responseTimeLog;
    //responseTimeMW.records.push({txTime: n, endPoint: "middleware"});
    //    console.log(responseTimeMW);
    //}
    //catch (ex){

    //}
    //log.info({txn:'testbunyan',epochTime:n},topic);
    console.log(topic);
    console.log(message.toString());
    if(topic.indexOf('isWatchRegistered') > -1) {

        var req = new XMLHttpRequest();
        //req.open("GET", 'http://alsolh.myqnapcloud.com:32772/watches/' + watchId.replace('+', '%2B'), true);
        req.open("GET", payLoad.url, true);
        req.setRequestHeader("Authorization", "Basic " + btoa('admin' + ":" + 'asolh787'));
        req.setRequestHeader("Content-type", "application/json");
        req.onreadystatechange = function() {
            if (this.readyState == 4) {
                //this.responseText = JSON.stringify(JSON.parse(this.responseText).episodeId = episode);
                //this.responseText.episodeId = episode;
                console.log(this.status + ' - ' + this.responseText);
                var response = JSON.parse(this.responseText);
                if(response.studentId != null){
                    response.episodeId = episode;
                    response.telemetrySendInterval = argv.frequency;
                    response.mode = argv.mode;

                    console.log(topic.replace("wrapper","response"));
                    console.log(JSON.stringify(response));
                    //client.publish(topic.replace("wrapper","response"), JSON.stringify({responseTimeLog:responseTimeMW,response:true}));
                    client.publish(topic.replace("wrapper","response"), JSON.stringify(response));
                    //window.open('authorized.html');
                }
                else
                {
                    //no need to send back false
                    registerWatch(payLoad.data)
                }
            }
        };
        req.send(payLoad.data);
    }
    else if (topic.indexOf('wrapper') > -1){
        payLoad = JSON.parse(message.toString());
        var post_options = {
            host: payLoad.host,
            port: payLoad.port,
            path: payLoad.path,
            method: payLoad.method,
            headers: {
                'Authorization': "Basic " + btoa('admin' + ":" + 'asolh787'),
                'Content-Type': 'application/json'
            }
        };

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                client.publish(topic.replace("wrapper","response"), 'Response: ' + chunk);
            });
        });

        // post the data
        post_req.write(JSON.stringify(payLoad.data));
        post_req.end();
    }
    else {
        // message is Buffer
        if (allCourses != null) {
            console.log(message.toString());
            telemetry = JSON.parse(message);

            aggregatedTelemetry = [];


            var sum = 0;
            for (var i = 0; i < sensors.length; i++) {
                queryTelemetry = jsonQuery('[*sensorName=' + sensors[i] + '].value', {
                    data: telemetry.sensorsData
                }).value;

                for (var j = 1; j < queryTelemetry.length; j++) {
                    for (var property in queryTelemetry[0]) {
                        if (queryTelemetry[0].hasOwnProperty(property)) {
                            if (!isNaN(queryTelemetry[0][property])) {
                                /*queryTelemetry[0][property] = queryTelemetry[0][property] + queryTelemetry[j][property];*/
                                if (queryTelemetry[0][property] < queryTelemetry[j][property]) {
                                    if (property == "longitude") {
                                        if (queryTelemetry[j][property] != 200) {
                                            queryTelemetry[0][property] = queryTelemetry[j][property];
                                        }
                                    }
                                    else {
                                        queryTelemetry[0][property] = queryTelemetry[j][property];
                                    }
                                }
                            }
                        }
                    }
                }

                if (queryTelemetry.length > 0) {
                    aggregatedTelemetry.push({"sensorName": sensors[i], "value": queryTelemetry[0]});
                }

                /*            for (var property in queryTelemetry[0]) {
                                if (queryTelemetry[0].hasOwnProperty(property)) {
                                    if(!isNaN(queryTelemetry[0][property])){
                                        queryTelemetry[0][property] = queryTelemetry[0][property] / queryTelemetry.length;
                                    }
                                }
                            }*/

                //console.log(sum);
                //console.log("sensor sum = " + JSON.stringify(queryTelemetry[0]));
                /*if(sensors[i] == "GPS"){

                }*/

            }


            /*        gpsTelemetry = jsonQuery('[sensorName=GPS].value', {
                        data: telemetry
                    }).value;*/
            //console.log(gpsTelemetry.value.longitude);
            var courseWork = [];
            //resultQuestions.courseWork = [];
            for (var iCourses = 0; iCourses < allCourses.length; iCourses++) {
                for (var iStudents = 0; iStudents < allCourses[iCourses].students.length; iStudents++) {
                    //console.log(allCourses[iCourses].students[iStudents].userId);
                    //console.log(telemetry.studentId);
                    if (allCourses[iCourses].students[iStudents].userId == telemetry.studentId) {
                        for (var iCourseWork = 0; iCourseWork < allCourses[iCourses].courseWork.length; iCourseWork++) {
                            courseWork.push(allCourses[iCourses].courseWork[iCourseWork]);
                        }
                        break;
                    }
                }
            }


            //resultQuestions = clone(questions);
            if (courseWork.length != 0) {
                //start of handling new question format
                for (var i = 0; i < courseWork.length; i++) {
                    try {
                        var eligible = false;
                        qtiContent = JSON.parse(courseWork[i].description);
                        requiredSensors = qtiContent["assessmentItem"]["context"]["sensorNames"];
                        //TODO:Add or condition / better loop it for each sensor type
                        pedoTelemetry = jsonQuery('[sensorName=' + requiredSensors[0] + '].value', {
                            data: aggregatedTelemetry
                        }).value;
                        for (var attributename in pedoTelemetry) {
                            console.log(attributename + ": " + pedoTelemetry[attributename]);
                            qtiContent = JSON.parse(JSON.stringify(qtiContent).replaceAll('<' + requiredSensors[0] + '.' + attributename + '>', pedoTelemetry[attributename]));
                            courseWork[i].multipleChoiceQuestion.choices = JSON.parse(JSON.stringify(courseWork[i].multipleChoiceQuestion.choices).replaceAll('<' + requiredSensors[0] + '.' + attributename + '>', pedoTelemetry[attributename]));
                        }
                        //process variables
                        if (qtiContent.itemBody.variables != null) {
                            for (var j = 0; j < qtiContent.itemBody.variables.length; j++) {
                                qtiContent.itemBody.variables[j] = eval(qtiContent.itemBody.variables[j]);
                                console.log(qtiContent.itemBody.variables[j]);
                            }

                            for (var j = 0; j < qtiContent.itemBody.variables.length; j++) {
                                //.itemBody.p .itemBody.p
                                qtiContent = JSON.parse(JSON.stringify(qtiContent).replaceAll('<var' + j + '>', qtiContent.itemBody.variables[j]));
                                for (var k = 0; k < courseWork[i].multipleChoiceQuestion.choices.length; k++) {
                                    courseWork[i].multipleChoiceQuestion.choices[k] = courseWork[i].multipleChoiceQuestion.choices[k].replaceAll('<var' + j + '>', qtiContent.itemBody.variables[j]);
                                }
                            }
                        }
                        //end process variables
                        //process correct response
                        console.log("eligibility - " + qtiContent.assessmentItem);
                        eligible = eval(qtiContent.assessmentItem.context.eligibility);
                        qtiContent.assessmentItem.context.eligibility = eligible;

                        qtiContent.responseDeclaration.correctResponse = eval(qtiContent.responseDeclaration.correctResponse);

                        courseWork[i].description = qtiContent;
                        if (eligible) {
                            for (var j = 0; j < courseWork[i].multipleChoiceQuestion.choices.length; j++) {
                                courseWork[i].multipleChoiceQuestion.choices[j] = eval(courseWork[i].multipleChoiceQuestion.choices[j]);
                            }
                        }


                        console.log(JSON.stringify(courseWork));
                    } catch (err) {
                        // handle the error safely
                        console.log(err);
                    }

                }

                filteredCourseWork = [];

                for (var i = 0; i < courseWork.length; i++) {
                    try {
                        if (courseWork[i].description.assessmentItem.context.eligibility) {
                            filteredCourseWork.push(courseWork[i]);
                        }
                    } catch (err) {
                        // handle the error safely
                        console.log(err);
                    }
                }

                client.publish(topic.replace("telemetry", "assessments"), JSON.stringify(filteredCourseWork));
                /*
                        var targetedQuestion = '';
                        console.log(questions.courseWork[1].title);
                        targetedQuestion = clone(questions);
                        questionContent = JSON.parse(questions.courseWork[1].description);
                        var distance = getDistanceFromLonLatInKm(gpsTelemetry.latitude, gpsTelemetry.longitude, questionContent.parameters.latitude, questionContent.parameters.longitude).toFixed(2);
                        if (!(savedDistance === distance)) {
                            targetedQuestion.courseWork[1].description = questionContent.body.replace('<value>', distance);
                            console.log(targetedQuestion.courseWork[1].description);
                            console.log(targetedQuestion.courseWork[1].multipleChoiceQuestion);
                            for (var i = 0; i < targetedQuestion.courseWork[1].multipleChoiceQuestion.choices.length; i++) {
                                console.log(targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i]);
                                targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i] = targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i].replace('<value>', distance);
                                console.log(targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i]);
                                targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i] = eval(targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i]).toFixed(2);
                                console.log(targetedQuestion.courseWork[1].multipleChoiceQuestion.choices[i]);
                            }
                            console.log(JSON.stringify(targetedQuestion));
                            //client.publish('assessments/student1',JSON.stringify(targetedQuestion));
                            savedDistance = distance;
                        }*/
            }
            //client.end()
        }
    }
})

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

function getDistanceFromLonLatInKm(lon1,lat1,lon2,lat2) {
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
// TODO:this is very specific to the user directory
fs.readFile('/home/alsolh/code/wearable-school-workspace/wearable-school-server/client_secret.json', function processClientSecrets(err, content) {
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

function checkTempCoursesValid(){
    try {
        for (var i = 0; i < tempCourses.length; i++) {
            if (tempCourses[i].students.length > 0) {

            }
            if (tempCourses[i].courseWork.length > 0) {

            }
        }
    }
    catch (err) {
        return;
    }
    allCourses = clone(tempCourses);
}

function doListCourses(auth){
    var classroom = google.classroom('v1');
classroom.courses.list({
    auth: auth,
    pageSize: 10
}, function(err, response) {
    if (err) {
        console.log('The API returned an error: ' + err);
        return;
    }
try {
    var courses = response.courses;
    if (courses.length > 0) {
        tempCourses = response.courses;
        console.log('Courses:');
        for (var i = 0; i < courses.length; i++) {
            var course = courses[i];
            console.log('%s (%s)', course.name, course.id);
            //async.series([
            listCourseWorks(auth, course.id, i);
            listStudents(auth, course.id, i);
            //]);
        }

        setTimeout(function () {
            if (allCourses == null) {
                for (var i = 0; i < 100; i++) {
                    var isError = false;
                    try {
                        console.log('~/tizen-studio/tools/sdb connect ' + targetWatch);
                        execSync('~/tizen-studio/tools/sdb connect ' + targetWatch);
                        execSync('~/tizen-studio/tools/sdb shell launch_app M89Api9FK8.WearableSchool');
                    }

                    catch (err) {
                        isError = true;
                        //allCourses = clone(tempCourses);
                        checkTempCoursesValid();
                        console.log(JSON.stringify(tempCourses));
                        console.log(err.message);
                    }
                    finally {
                        if (!isError) {
                            setTimeout(function () {
                                process.exit()
                            }, 1800000);
                            break;
                        }
                    }
                }
            }

            //allCourses = clone(tempCourses);
            checkTempCoursesValid();
            console.log(JSON.stringify(tempCourses));
        }, 10000);
    }
}
catch(err){
        console.log(err.message);
}
});

}

function listCourses(auth) {
    doListCourses(auth);
    setInterval(function(){doListCourses(auth)}, 300000);
}

function listStudents(auth, cid,i) {
    var classroom = google.classroom('v1');
    classroom.courses.students.list({
        auth: auth,
        courseId:cid
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log("logging students for course id:" + cid);
        console.log("students - " + response);
        try {
            if (response.students.length > 0) {
                tempCourses[i].students = response.students;
            }
        }
        catch (err){
            console.log(err.message);
        }
        //questions = response;
        //client.publish('assessments/student1',JSON.stringify(response));
    });
}

function listCourseWorks(auth, cid,i) {
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
    try {
        if (response.courseWork.length > 0) {
            tempCourses[i].courseWork = response.courseWork;
        }
    }
    catch (err){
        console.log("error - " + err.message);
    }
    //questions = response;
      //client.publish('assessments/student1',JSON.stringify(response));
  });
}
