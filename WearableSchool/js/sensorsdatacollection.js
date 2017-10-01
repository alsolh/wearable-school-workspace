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
		//alert('test');
		console.log(page.innerHTML);
		console.log('startNewAuth2Page');
		var tizenId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
		var tizenElement = document.getElementById("smwatchId");
		tizenElement.innerText = tizenId;
		console.log("tizenelement=" + tizenElement.outerHTML);
		
		console.log(" authpagetizenid = " + tizenId);

		// sensors playground

		 function onchangedCB(pedometerInfo) {
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
		 
		 function HRMSonsuccessCB(hrmInfo) {
		 	 var sensorData = { "sensorName":"HRM", "value":hrmInfo };
		     console.log("Heart Rate : " + hrmInfo.heartRate);
		     console.log("HRM Interval : " + hrmInfo.rRInterval);
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));
		     remainingSensorCalls = remainingSensorCalls - 1;
		 }

		 function onerrorCB(error) {
		     console.log("Error occurs. name:"+error.name + ", message: "+error.message);
		 }

		 function onchangedHRM(pedometerdata) {
		     //console.log("From now on, you will be notified when the pedometer data changes.");
		     // To get the current data information
		     tizen.humanactivitymonitor.getHumanActivityData("HRM", HRMSonsuccessCB);
		     tizen.humanactivitymonitor.stop("HRM");
		 }
		 
		 //GPS Start
		 
		 var myCallbackInterval = 240000;
		var mySampleInterval = 10000;

		function onchangedGPS(gpsInfo) {
		    console.log('this callback is called every ' + myCallbackInterval + ' milliseconds');
		    console.log('the gpsInfo includes the GPS information that is collected every ' +
		               mySampleInterval + ' milliseconds');
		     	 var sensorData = { "sensorName":"GPS", "value":gpsInfo.gpsInfo[0] };
		     sensorsData.push(sensorData);
		     console.log(JSON.stringify(sensorsData));
		               tizen.humanactivitymonitor.stop('GPS');
		               remainingSensorCalls = remainingSensorCalls - 1;
		}

		function onerrorGPS(error) {
		    console.log('Error occurred. Name:' + error.name + ', message: ' + error.message);
		}

		var option = {
		    'callbackInterval': myCallbackInterval,
		    'sampleInterval': mySampleInterval
		};

		tizen.humanactivitymonitor.start('GPS', onchangedGPS, onerrorGPS, option);
		 
		 //GPS End
		 
		 //HumanActivityHRMData 

		 tizen.humanactivitymonitor.start("HRM", onchangedHRM);
		 
		 //tizen.humanactivitymonitor.start("PEDOMETER", onchangedCB);

		 tizen.humanactivitymonitor.setAccumulativePedometerListener(onchangedCB);
		 
		 //HumanActivityHRMData 
		 
		 // light sensor start
		 
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
		 
		 // light sensor end
		 
		 // Pressure and UV Sensor Start
		 
		 //Capability testing & Getting default sensor
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
