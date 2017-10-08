/*global tau */
(function(){
	/**
	 * page - Rotary event page element
	 * progressBar - Circle progress element
	 * progressBarWidget - TAU circle progress instance
	 * rotaryDetentHandler - rotarydetent event handler
	 */
	var page = document.getElementById( "authorizedPage" );
	//var mqttSubscribed = false;
	var remainingSensorCalls = 6;
	var remainingSensorCallsTimeout = 10;
	var sensorsData = [];
	var tizenId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
	var tizenElement = document.getElementById("tizenId");
	tizenElement.innerText = tizenId;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	
	
	

	page.addEventListener("pagebeforeshow", function() {
		try {
		//alert('test');
		console.log(page.innerHTML);
		console.log('startNewAuth2Page');
		var tizenId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
		var tizenElement = document.getElementById("smwatchId");
		tizenElement.innerText = tizenId;
		console.log("tizenelement=" + tizenElement.outerHTML);
		
		console.log(" authpagetizenid = " + tizenId);
		}
		catch(err) {
		    console.log(err.message);
		}

		// sensors playground

		 function onchangedCB(pedometerInfo) {
			 try{
		 var sensorData = { "sensorName":"PEDOMETER", "value":pedometerInfo };
		        console.log("Step status : " + pedometerInfo.stepStatus);
		        console.log("Accumulative total step count : " + pedometerInfo.accumulativeTotalStepCount);
		        console.log("Speed : " + pedometerInfo.speed);
		        console.log("Distance : " + pedometerInfo.accumulativeDistance);
		 sensorsData.push(sensorData);
		        console.log(JSON.stringify(sensorsData));
		        tizen.humanactivitymonitor.unsetAccumulativePedometerListener();
		         remainingSensorCalls = remainingSensorCalls - 1;
				}
				catch(err) {
				    console.log(err.message);
				}
		 }
		 
		 function HRMSonsuccessCB(hrmInfo) {
			 try{
		 	 var sensorData = { "sensorName":"HRM", "value":hrmInfo };
		     console.log("Heart Rate : " + hrmInfo.heartRate);
		     console.log("HRM Interval : " + hrmInfo.rRInterval);
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));
		     remainingSensorCalls = remainingSensorCalls - 1;
				}
				catch(err) {
				    console.log(err.message);
				}
		 }

		 function onerrorCB(error) {
			 try{
		     console.log("Error occurs. name:"+error.name + ", message: "+error.message);
				}
				catch(err) {
				    console.log(err.message);
				}
		 }

		 function onchangedHRM(pedometerdata) {
			 try{
		     //console.log("From now on, you will be notified when the pedometer data changes.");
		     // To get the current data information
		     tizen.humanactivitymonitor.getHumanActivityData("HRM", HRMSonsuccessCB);
		     tizen.humanactivitymonitor.stop("HRM");
				}
				catch(err) {
				    console.log(err.message);
				}
		 }
		 
		 //GPS2 Start

		//var wLocation = {"altitude":localStorage.getItem("altitude"),"longitude":localStorage.getItem("longitude"),"latitude":localStorage.getItem("latitude")};
		navigator.geolocation.getCurrentPosition(showMap);



		function showMap(position) {
		      console.log('0.....latitude: ' + position.coords.latitude);
		      //localStorage.setItem("longitude", position.coords.longitude);
		      //localStorage.setItem("latitude", position.coords.latitude);
		      sensorsData.push({
		    	    "sensorName": "GPS",
		    	    "value": {
		    	      "altitude": position.coords.altitude,
		    	      "longitude": position.coords.longitude,
		    	      "latitude": position.coords.latitude,
		    	      "speed": position.coords.speed
		    	    }
		    	  });
		    }
		 
		 //GPS2 End
		 
		 //GPS Start
			try{
		 var myCallbackInterval = 240000;
		var mySampleInterval = 10000;

		function onchangedGPS(gpsInfo) {
			try{
		    console.log('this callback is called every ' + myCallbackInterval + ' milliseconds');
		    console.log('the gpsInfo includes the GPS information that is collected every ' +
		               mySampleInterval + ' milliseconds');
		     	 var sensorData = { "sensorName":"GPS", "value":gpsInfo.gpsInfo[0] };
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));
		               tizen.humanactivitymonitor.stop('GPS');
		               remainingSensorCalls = remainingSensorCalls - 1;
			}
			catch(err) {
			    console.log(err.message);
			}
		}

		function onerrorGPS(error) {
		    console.log('Error occurred. Name:' + error.name + ', message: ' + error.message);
		}
		

		var option = {
		    'callbackInterval': myCallbackInterval,
		    'sampleInterval': mySampleInterval
		};


		tizen.humanactivitymonitor.start('GPS', onchangedGPS, onerrorGPS, option);
		}
		catch(err) {
		    console.log(err.message);
		}
		 
		 //GPS End
		 
		 //HumanActivityHRMData 
		
		try{

		 tizen.humanactivitymonitor.start("HRM", onchangedHRM);
		 
		 //tizen.humanactivitymonitor.start("PEDOMETER", onchangedCB);

		 tizen.humanactivitymonitor.setAccumulativePedometerListener(onchangedCB);
		}
		catch(err) {
		    console.log(err.message);
		}
		 
		 //HumanActivityHRMData 
		 
		 // light sensor start
		 try{
		 var lightSensor = tizen.sensorservice.getDefaultSensor('LIGHT');
		
		function onGetSuccessLightCB(sensorData) {
		    console.log('light level: ' + sensorData.lightLevel);
		    var sensorData = { "sensorName":"LIGHT", "value":sensorData };
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));
		     remainingSensorCalls = remainingSensorCalls - 1;
		}

		function LSonsuccessCB() {
		    console.log('light sensor started');
		    lightSensor.getLightSensorData(onGetSuccessLightCB);
		    lightSensor.stop();
		}

		
		lightSensor.start(LSonsuccessCB);

			}
			catch(err) {
			    console.log(err.message);
			}
		 // light sensor end
		 
		 // Pressure and UV Sensor Start
		 
		 //Capability testing & Getting default sensor
			try{
		 var pressureCapability = tizen.systeminfo.getCapability("http://tizen.org/feature/sensor.barometer");

		 if (pressureCapability === true) {
			var pressureSensor = tizen.sensorservice.getDefaultSensor("PRESSURE"); 
			pressureSensor.start(PRSonsuccessCB);
			
		    }
		    
		 function PRSonsuccessCB(){
		 pressureSensor.getPressureSensorData(PRSonGetSuccessCB);
		 }
		    
		 function PRSonGetSuccessCB(sensorData) {
			 
		    var sensorData = { "sensorName":"PRESSURE", "value":sensorData };
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));  
		     pressureSensor.stop();  
		     remainingSensorCalls = remainingSensorCalls - 1;                     
		 }

		 var ultravioletCapability = tizen.systeminfo.getCapability("http://tizen.org/feature/sensor.ultraviolet");
		console.log("support uv: " + ultravioletCapability);
		 if (ultravioletCapability === true) {
			 var ultravioletSensor = tizen.sensorservice.getDefaultSensor("ULTRAVIOLET");
			ultravioletSensor.start(UVSonsuccessCB);
			
		    }
		    
		 function UVSonsuccessCB(){
		 console.log("start uv");
		 ultravioletSensor.getUltravioletSensorData(UVSonGetSuccessCB);
		 }
		    
		 function UVSonGetSuccessCB(sensorData) {
			  console.log("success uv");
		    var sensorData = { "sensorName":"ULTRAVIOLET", "value":sensorData };
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));  
		     ultravioletSensor.stop();   
		     remainingSensorCalls = remainingSensorCalls - 1;                    
		 }
			}
			catch(err) {
			    console.log(err.message);
			}
		 // Pressure and UV Sensor End
		 

		// sensors playground

		// wait for all values to finish

		var refreshIntervalId = setInterval(checkIfCompleted, 1000);

		function checkIfCompleted(){
		console.log("checking " + remainingSensorCalls);
		remainingSensorCallsTimeout = remainingSensorCallsTimeout - 1;
		// && mqttSubscribed === true
		if ((remainingSensorCalls < 1 || remainingSensorCallsTimeout < 1)) {
		console.log("all sensors done");
		clearInterval(refreshIntervalId);
		sensorsData.push({sessionId:localStorage.getItem("sessionId")});
		message = new Paho.MQTT.Message(JSON.stringify(sensorsData));
		message.destinationName = "telemetry/student1";
		log.info({logType:'txLog',txnType:'0.telemetryStart',endPoint:'watch'});
		client.send(message);
		}
		}

		// end wait
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		//progressBarWidget.destroy();
		//document.removeEventListener("rotarydetent", rotaryDetentHandler);
	});
}());
