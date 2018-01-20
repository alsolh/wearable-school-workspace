/*global tau */
(function(){
	/**
	 * page - Rotary event page element
	 * progressBar - Circle progress element
	 * progressBarWidget - TAU circle progress instance
	 * rotaryDetentHandler - rotarydetent event handler
	 */
	var page = document.getElementById( "authorizedPage" );
	var timesPageLoaded = 0;
	//var mqttSubscribed = false;
	var remainingSensorCalls = 6;
	var remainingSensorCallsTimeout = 10;
	var sensorsData = [];
	var tizenId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
	var tizenElement = document.getElementById("tizenId");
	tizenElement.innerText = tizenId;
	var refreshIntervalId;
	var sensingActive = false;
	//var tizenId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
	var encodedWatchId = encodeURIComponent(tizenId); 
	var lightSensor = tizen.sensorservice.getDefaultSensor('LIGHT');
	var pressureSensor = null;
	var ultravioletSensor = null;
	telemetrySendInterval = 10000;
	
	//uv
	function UVSonsuccessCB(){
		 console.log("start uv");
		 ultravioletSensor.getUltravioletSensorData(UVSonGetSuccessCB);
		 }
		    
		 function UVSonGetSuccessCB(sensorData) {
			  console.log("success uv");
		    var sensorData = { "sensorName":"ULTRAVIOLET", "value":sensorData };
		     sensorsData.push(sensorData);
		     //console.log(JSON.stringify(sensorsData));
			    if(localStorage.getItem("continous") != "true"){
			    	ultravioletSensor.stop(); 
			    }
		     remainingSensorCalls = remainingSensorCalls - 1;                    
		 }
	//
	
	
	//pressure
	function PRSonsuccessCB(){
		 pressureSensor.getPressureSensorData(PRSonGetSuccessCB);
		 }
		    
		 function PRSonGetSuccessCB(sensorData) {
			 
		    var sensorData = { "sensorName":"PRESSURE", "value":sensorData };
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData)); 
			    if(localStorage.getItem("continous") != "true"){
			    	pressureSensor.stop();
			    }
		       
		     remainingSensorCalls = remainingSensorCalls - 1;                     
		 }
	//
	
	//pedometer
	 function onchangedCB(pedometerInfo) {
		 try{
	 var sensorData = { "sensorName":"PEDOMETER", "value":pedometerInfo };
	        console.log("Step status : " + pedometerInfo.stepStatus);
	        console.log("Accumulative total step count : " + pedometerInfo.accumulativeTotalStepCount);
	        console.log("Speed : " + pedometerInfo.speed);
	        console.log("Distance : " + pedometerInfo.accumulativeDistance);
	 sensorsData.push(sensorData);
	        console.log(JSON.stringify(sensorsData));
	        //tizen.humanactivitymonitor.unsetAccumulativePedometerListener();
	         remainingSensorCalls = remainingSensorCalls - 1;
			}
			catch(err) {
			    console.log(err.message);
			}
	 }
	//pedometer
	
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
	    if(localStorage.getItem("continous") != "true"){
	    	lightSensor.stop();
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
	     if(localStorage.getItem("continous") != "true"){
	    	 tizen.humanactivitymonitor.stop("HRM"); 
	     }
			}
			catch(err) {
			    console.log(err.message);
			}
	 }
	 
	//GPS Start
		//try{
	 var myCallbackInterval = 5000;
	var mySampleInterval = 2000;

	function onchangedGPS(gpsInfo) {
		try{
	    console.log('this callback is called every ' + myCallbackInterval + ' milliseconds');
	    console.log('the gpsInfo includes the GPS information that is collected every ' +
	               mySampleInterval + ' milliseconds');
	     	 var sensorData = { "sensorName":"GPS", "value":gpsInfo.gpsInfo[0] };
	     //sensorsData.push(sensorData);
	     console.log(JSON.stringify(sensorsData));
	     if(localStorage.getItem("continous") != "true"){
	    	 tizen.humanactivitymonitor.stop('GPS');
	     }
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
	
	function sendMQTTMessage(){
		//sensorsData.push({sessionId:localStorage.getItem("sessionId")});
		//sensorsData.studentId = localStorage.getItem("studentId");
		if(sensingActive){
		document.getElementById("smwatchId").innerText = "Sending Sensor Data...";
		message = new Paho.MQTT.Message(JSON.stringify({studentId:localStorage.getItem("studentId"),sensorsData:sensorsData}));
		message.destinationName = "telemetry/" + encodedWatchId;
		log.info({logType:'txLog',txnType:'0.telemetryStart',endPoint:'watch'});
		client.send(message);
		sensorsData = [];
		setTimeout(function(){ document.getElementById("smwatchId").innerText = "Reading Sensor Data..."; }, 3000);
		}
	}

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

	
	//}
	//catch(err) {
	//    console.log(err.message);
	//}
	 
	 //GPS End
	

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	
	
	

	page.addEventListener("pagebeforeshow", function() {
		//tizen.power.turnScreenOn();
		timesPageLoaded = timesPageLoaded + 1;
		//refreshIntervalId = null;
		if(timesPageLoaded > 1){
		txnId = guid();
		telemetrySendInterval = localStorage.getItem("telemetrySendInterval");
		remainingSensorCalls = 6;
		setTimeout(sendMQTTMessage, telemetrySendInterval);
		sensorsData = [];
		tizen.humanactivitymonitor.start("HRM", onchangedHRM);
		try{
		tizen.humanactivitymonitor.start('GPS', onchangedGPS, onerrorGPS, option);
		} catch (err) {}
		try{
		navigator.geolocation.getCurrentPosition(showMap);
		} catch (err) {}
		lightSensor.start(LSonsuccessCB);
		tizen.humanactivitymonitor.setAccumulativePedometerListener(onchangedCB);
		var pressureCapability = tizen.systeminfo.getCapability("http://tizen.org/feature/sensor.barometer");
		 if (pressureCapability === true) {
			pressureSensor = tizen.sensorservice.getDefaultSensor("PRESSURE"); 
			pressureSensor.start(PRSonsuccessCB);
		    }
		 var ultravioletCapability = tizen.systeminfo.getCapability("http://tizen.org/feature/sensor.ultraviolet");
			//console.log("support uv: " + ultravioletCapability);
			 if (ultravioletCapability === true) {
				 ultravioletSensor = tizen.sensorservice.getDefaultSensor("ULTRAVIOLET");
				ultravioletSensor.start(UVSonsuccessCB);
			    }
		remainingSensorCallsTimeout = 10;
		sensingActive = true;
		}
		if(timesPageLoaded < 2){
		try {
			telemetrySendInterval = localStorage.getItem("telemetrySendInterval");
			sensorsData = [];
			sensingActive = true;
		console.log("continous? - " + localStorage.getItem("continous"));
		//alert('test');
		console.log(page.innerHTML);
		console.log('startNewAuth2Page');
//encoded watch id was here
		var tizenElement = document.getElementById("smwatchId");
		//tizenId
		tizenElement.innerText = "Reading Sensor Data...";
		console.log("tizenelement=" + tizenElement.outerHTML);
		
		console.log(" authpagetizenid = " + tizenId);
		}
		catch(err) {
		    console.log(err.message);
		}

		// sensors playground

//pedometerwashere
		 
		 
		 //hrm was here
		 
		 //GPS2 Start

		//var wLocation = {"altitude":localStorage.getItem("altitude"),"longitude":localStorage.getItem("longitude"),"latitude":localStorage.getItem("latitude")};
try{
		navigator.geolocation.getCurrentPosition(showMap);
} catch (err) {}


//GPS2 old func
		 
		 //GPS2 End
		 
		 //gps1 was here
try{
		tizen.humanactivitymonitor.start('GPS', onchangedGPS, onerrorGPS, option);
} catch (err) {}
		 
		 //HumanActivityHRMData 
		
		/*try{*/

		 tizen.humanactivitymonitor.start("HRM", onchangedHRM);
		 
		 //tizen.humanactivitymonitor.start("PEDOMETER", onchangedCB);

		 tizen.humanactivitymonitor.setAccumulativePedometerListener(onchangedCB);
/*		}
		catch(err) {
		    console.log(err.message);
		}*/
		 
		 //HumanActivityHRMData 
		 
		 // light sensor start
		lightSensor.start(LSonsuccessCB);
/*		 try{
		 
		
		

		
		

			}
			catch(err) {
			    console.log(err.message);
			}*/
		 // light sensor end
		 
		 // Pressure and UV Sensor Start
		 
		 //Capability testing & Getting default sensor
		 var pressureCapability = tizen.systeminfo.getCapability("http://tizen.org/feature/sensor.barometer");

		 if (pressureCapability === true) {
			pressureSensor = tizen.sensorservice.getDefaultSensor("PRESSURE"); 
			pressureSensor.start(PRSonsuccessCB);
			
		    }
		    
		 

		var ultravioletCapability = tizen.systeminfo.getCapability("http://tizen.org/feature/sensor.ultraviolet");
		//console.log("support uv: " + ultravioletCapability);
		 if (ultravioletCapability === true) {
			 ultravioletSensor = tizen.sensorservice.getDefaultSensor("ULTRAVIOLET");
			ultravioletSensor.start(UVSonsuccessCB);
		    }
		    
		 
		 // Pressure and UV Sensor End
		 

		// sensors playground

		// wait for all values to finish
			
			if(localStorage.getItem("continous") != "true"){
		refreshIntervalId = setInterval(checkIfCompleted, 1000);
			}
			else{
				setTimeout(sendMQTTMessage, telemetrySendInterval);
			}

		function checkIfCompleted(){
		console.log("checking " + remainingSensorCalls);
		remainingSensorCallsTimeout = remainingSensorCallsTimeout - 1;
		// && mqttSubscribed === true
		if ((remainingSensorCalls < 1 || remainingSensorCallsTimeout < 1)) {
		console.log("all sensors done");
		clearInterval(refreshIntervalId);
		sendMQTTMessage();
		}
		}
		
		//sendmqtt func was here

		// end wait
		}
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		try{
		clearInterval(refreshIntervalId);
		} catch (err) {}
		sensingActive = false;
		try{
		tizen.humanactivitymonitor.stop("HRM");
		} catch (err) {}
		try{
		tizen.humanactivitymonitor.stop('GPS');
		} catch (err) {}
		try{
		lightSensor.stop();
		} catch (err) {}
		try{
		tizen.humanactivitymonitor.unsetAccumulativePedometerListener();
		} catch (err) {}
		try{
		if(pressureSensor != null){
		pressureSensor.stop();
		}
		if(ultravioletSensor != null){
			ultravioletSensor.stop();
			}
		} catch (err) {}
		//console.log("pagehidecalled");
		//clearInterval(refreshIntervalId);
		//progressBarWidget.destroy();
		//document.removeEventListener("rotarydetent", rotaryDetentHandler);
	});
}());
