
				
		/*global tau */
		(function(){
			
			var page = document.getElementById( "main" );

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */

			page.addEventListener("pagebeforeshow", function() {
				// Create a client instance
				//client = new Paho.MQTT.Client('alsolh.asuscomm.com', Number(32769), "clientId");
				client = new Paho.MQTT.Client('192.168.43.10', Number(3000), localStorage.getItem("sessionId"));

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
				  client.subscribe("assessments/student1");
				  client.subscribe("response/student1/#");
				  //mqttSubscribed = true;
				  //message = new Paho.MQTT.Message("Hello");
				  //message.destinationName = "World";
				  //client.send(message);
				  var d = new Date();
				  var n = d.getTime();
				  var watchId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
				  
					message = new Paho.MQTT.Message(JSON.stringify({responseTimeLog:{sessionId:localStorage.getItem("sessionId"),txnId:guid(),txType:'authentication',records:[{txTime:n,endPoint:'watch'}]},operation:"GET",data:{
					    "_id":watchId},url:'http://192.168.43.10:5984/watches/' + watchId}));
					message.destinationName = "wrapper/student1/isWatchRegistered";
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
					    var d = new Date();
					    var n = d.getTime();
					    payLoad.responseTimeLog.records.push({txTime: n, endPoint: "watch"})
						//TODO:RemoveRedundantOperation
					    //log.info(payLoad.responseTimeLog);
						if(payLoad.response == true){
						tau.changePage('authorizedV2.html');
						}
					}
					else if(message.destinationName.indexOf('postAnswer') > -1){
						log.info({logType:'txLog',txnType:'1.postAnswerEnd', endPoint: "watch"});
						console.log(message.payloadString);
						
						if(localStorage.getItem("automated") == "true"){
						    //setTimeout(function () {
							localStorage.setItem("logger1",JSON.stringify(logData));
						    	window.location.href = ('/index.html');
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
							window.tizen.application.getCurrentApplication().exit();
						}
						
						
					}
					else{
						log.info({logType:'txLog',txnType:'1.telemetryEnd', endPoint: "watch"});
				  console.log("onMessageArrived:"+message.payloadString);
				  localStorage.setItem("questions", message.payloadString);
				  tau.changePage('pages/radio/radioQuestions.html');
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