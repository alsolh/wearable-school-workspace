var battery = navigator.battery || navigator.webkitBattery
		|| navigator.mozBattery;
console.log(Math.floor(battery.level * 100) + '%');
var log = log4javascript.getLogger(tizen.systeminfo
		.getCapability("http://tizen.org/system/tizenid"));
// var log = log4javascript.getLogger();
var consoleAppender = new log4javascript.BrowserConsoleAppender();
var ajaxAppender = new log4javascript.AjaxAppender(
		"http://alsolh.myqnapcloud.com:32772/watchlog/_bulk_docs");
var layout = new log4javascript.JsonLayout(true, false);
layout.batchHeader = '{ "docs": [';
layout.batchFooter = "] }";
ajaxAppender.addHeader("Content-Type", "application/json");
ajaxAppender.setLayout(layout);
ajaxAppender.setBatchSize(5);
var consoleLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
consoleAppender.setLayout(consoleLayout);
log.addAppender(consoleAppender);
log.addAppender(ajaxAppender);
// console.log("test222");
battery.onlevelchange = function() {
	log.info(JSON.stringify({battery:battery.level}));
	//console.log('The battery level is ' + battery.level);
};

var id = null;
function onSuccessCallbackCPU(cpu) {
   log.info(JSON.stringify({cpu: cpu.load, mem:tizen.systeminfo.getAvailableMemory()}));
   //console.log("The available memory size is " + tizen.systeminfo.getAvailableMemory() + " bytes.");
   //if (id != null) { // After receiving the first notification, we clear it
   //    tizen.systeminfo.removePropertyValueChangeListener(id);
   //}
}

id = tizen.systeminfo.addPropertyValueChangeListener("CPU", onSuccessCallbackCPU);

//function myTimer() {
//	;
//	var sensors = tizen.sensorservice.getAvailableSensors();
	//console.log('Available sensor: ' + sensors.toString());
//}

//setInterval(myTimer, 1000);

function myTimerIntensive() {
	for(var i=0; i<100; i++) {
	tizen.systeminfo.getAvailableMemory();
	}
}

//setInterval(myTimerIntensive, 1);


