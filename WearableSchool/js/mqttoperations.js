
				
		/*global tau */
		(function(){
			
			var watchId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
			var encodedWatchId = encodeURIComponent(watchId);
			var page = document.getElementById( "main" );

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */

			page.addEventListener("pagebeforeshow", function() {
				// Create a client instance
				//client = new Paho.MQTT.Client('alsolh.asuscomm.com', Number(32769), "clientId");
				client = new Paho.MQTT.Client('192.168.0.110', Number(3000), sessionId);

				// set callback handlers
				client.onConnectionLost = onConnectionLost;
				client.onMessageArrived = onMessageArrived;

				// connect the client
				client.connect({onSuccess:onConnect,onFailure:doFail});
				
				function doFail(e){
				    console.log(e);
				  }

				// called when the client connects
				function onConnect() {
				  // Once a connection has been made, make a subscription and send a message.
				  console.log("onConnect");
				  client.subscribe("assessments/" + encodedWatchId);
				  client.subscribe("response/" + encodedWatchId + "/#");
				  //mqttSubscribed = true;
				  //message = new Paho.MQTT.Message("Hello");
				  //message.destinationName = "World";
				  //client.send(message);
				  var d = new Date();
				  var n = d.getTime();
				  var watchId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
				  
					message = new Paho.MQTT.Message(JSON.stringify({responseTimeLog:{sessionId:sessionId,txnId:txnId,txType:'authentication',records:[{txTime:n,endPoint:'watch'}]},operation:"GET",data:{
					    "_id":watchId},url:'http://192.168.0.110:5984/watches/' + encodedWatchId}));
					//TODO: change to wrapper/isWatchRegistered
					message.destinationName = "wrapper/" + encodedWatchId + "/isWatchRegistered";
					log.info({logType:'txLog',txnType:'0.authenticationStart',endPoint:'watch'});
					client.send(message);
					
					
					
					
					

		/*		var i = 0;
				 var id = setInterval(function()
				                {
				                var wLocation = {"altitude":localStorage.getItem("altitude"),"longitude":localStorage.getItem("longitude"),"latitude":localStorage.getItem("latitude")};
				                  message = new Paho.MQTT.Message(JSON.stringify(wLocation));
				  message.destinationName = "telemetry/student1";
				  // temporairly disabled to work on new integration
				  // client.send(message);
				            i = i + 1;
				            navigator.geolocation.getCurrentPosition(showMap);
				            
				            },5000);*/

				}



		/*		function showMap(position) {
				      //console.log(position.coords.latitude);
				      localStorage.setItem("longitude", position.coords.longitude);
				      localStorage.setItem("latitude", position.coords.latitude);
				    }*/

				// called when the client loses its connection
				function onConnectionLost(responseObject) {
				  if (responseObject.errorCode !== 0) {
				    console.log("onConnectionLost:"+responseObject.errorMessage);
				  }
				}

				// called when a message arrives
				function onMessageArrived(message) {
					if(message.destinationName.indexOf('isWatchRegistered') > -1) {
						log.info({logType:'txLog',txnType:'1.authenticationEnd', endPoint: "watch"});
						console.log("onMessageResponseArrived:"+message.payloadString);
						payLoad = JSON.parse(message.payloadString);
					    //var d = new Date();
					    //var n = d.getTime();
					    //payLoad.responseTimeLog.records.push({txTime: n, endPoint: "watch"})
						//TODO:RemoveRedundantOperation
					    //log.info(payLoad.responseTimeLog);
					    
						if(payLoad.studentId != null){
						try{
							localStorage.setItem("studentId", payLoad.studentId);
							localStorage.setItem("studentEmail", payLoad.studentEmail);
							localStorage.setItem("telemetrySendInterval", payLoad.telemetrySendInterval);
							localStorage.setItem("timeoutSelectMode", payLoad.timeoutSelectMode);
							localStorage.setItem("timeoutConfirmQuestion", payLoad.timeoutConfirmQuestion);
							localStorage.setItem("timeoutSubmitAnswer", payLoad.timeoutSubmitAnswer);
							localStorage.setItem("episodeId", payLoad.episodeId);
						localStorage.setItem("automated", payLoad.automated);
						localStorage.setItem("mode", payLoad.mode);
						if(localStorage.getItem("automated") == "true"){
							if(localStorage.getItem("continous") != "true"){
								tizen.power.turnScreenOn();
/*						    setTimeout(function () {
						    	console.log('maintain screen state');
						    	//tizen.power.request('SCREEN', 'CPU_AWAKE');
						    	tizen.power.request("SCREEN", "SCREEN_NORMAL");
						    	tizen.power.turnScreenOn();
						    	//tizen.power.setScreenBrightness(1);
						    	//tizen.power.restoreScreenBrightness();
						    }, 1000);*/
							}
							else{
								tizen.power.turnScreenOn();
							}
						}
						}
						catch(err){
							
						}
						tau.changePage('/pages/radio/radioQuestionsMode.html');
						}
					}
					else if(message.destinationName.indexOf('postAnswer') > -1){
						log.info({logType:'txLog',txnType:'1.postAnswerEnd', endPoint: "watch"});
						console.log(message.payloadString);
						
						if(localStorage.getItem("automated") == "true"){
						    //setTimeout(function () {
							localStorage.setItem("logger1",JSON.stringify(logData));
							if(localStorage.getItem("continous") != "true"){
						    	window.location.href = ('/index.html');
							}
							else {
								//window.location.href = ('/index.html');
								tau.changePage('/authorizedV2.html');
							}
							//window.open('/index.html');
						    //}, 1000);
						}
						else {
							//log.sendAll();
							//ajaxAppender.sendAll();
		/*					log.info('endRun1');
							log.info('endRun2');
							log.info('endRun3');
							log.info('endRun4');*/
							if(localStorage.getItem("continous") == "true"){
								tau.changePage('/authorizedV2.html');
							}
							else{
							window.tizen.application.getCurrentApplication().exit();
							}
						}
						
						
					}
					else if(message.destinationName.indexOf('assessments') > -1){
						log.info({logType:'txLog',txnType:'1.telemetryEnd', endPoint: "watch"});
				  console.log("onMessageArrived:"+message.payloadString);
				  //# of questions
				  var questions = JSON.parse(message.payloadString);
				  console.log("questionLength - " + questions.length);
				  if(questions.length > 1){
					  localStorage.setItem("questions", message.payloadString);
					  tau.changePage('/pages/radio/radioQuestions.html');
				  }
				  else if(questions.length == 1){
					  localStorage.setItem("question", JSON.stringify(questions[0]));
					  tau.changePage('/pages/QuestionContent.html');
				  }
				  else if(questions.length == 0){
					  document.getElementById("smwatchId").innerText = "No Eligibile Questions Found!";
					  if(localStorage.getItem("continous") != "true"){
						  if(localStorage.getItem("automated") == "true"){
							  localStorage.setItem("logger1",JSON.stringify(logData));
							  window.location.href = ('/index.html');
						  }
						  else{
							  setTimeout(function(){ window.tizen.application.getCurrentApplication().exit();}, 1000);
						  }
					  }else{
						  tau.changePage('/pages/noContentFound.html');
						  //setTimeout(sendMQTTMessage, localStorage.getItem("telemetrySendInterval"));
						  //setTimeout(function(){ document.getElementById("smwatchId").innerText = "Reading Sensor Data..."; }, 1000);
					  }
				  }
				  
					}
				}
			});

			/**
			 * pagehide event handler
			 * Destroys and removes event listeners
			 */
			page.addEventListener("pagehide", function() {

			});
		}());