		// Create a client instance
		//client = new Paho.MQTT.Client('alsolh.asuscomm.com', Number(32769), "clientId");
		client = new Paho.MQTT.Client('192.168.43.10', Number(3000), "clientId");

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
		  var watchId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid").replace('+', '%2B');
			message = new Paho.MQTT.Message(JSON.stringify({operation:"GET",data:{
			    "_id":watchId},url:'http://192.168.43.10:5984/watches/' + watchId}));
			message.destinationName = "wrapper/student1/isWatchRegistered";
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
				console.log("onMessageResponseArrived:"+message.payloadString);
				if(message.payloadString == "true"){
				tau.changePage('authorizedV2.html');
				}
			}
			else if(message.destinationName.indexOf('postAnswer') > -1){
				console.log(message.payloadString);
				window.tizen.application.getCurrentApplication().exit();
			}
			else{
		  console.log("onMessageArrived:"+message.payloadString);
		  localStorage.setItem("questions", message.payloadString);
		  tau.changePage('pages/radio/radioQuestions.html');
			}
		}