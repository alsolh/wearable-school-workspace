function guid() {
				  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				    s4() + '-' + s4() + s4() + s4();
				}

				function s4() {
				  return Math.floor((1 + Math.random()) * 0x10000)
				    .toString(16)
				    .substring(1);
				}
//temporary initialization code
localStorage.removeItem('episodeId');
localStorage.removeItem('studentId');
localStorage.removeItem('studentEmail');
localStorage.removeItem('telemetrySendInterval');
localStorage.removeItem('timeoutSelectMode');
localStorage.removeItem('timeoutConfirmQuestion');
localStorage.removeItem('timeoutSubmitAnswer');
localStorage.removeItem('sessionId');
localStorage.removeItem('automated');
localStorage.removeItem('mode');
localStorage.removeItem('logger1');
localStorage.removeItem('questions');
localStorage.removeItem('question');
localStorage.removeItem('continous');
//temporary initialization code
var sessionId = guid();
var watchId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
var txnId = guid();
function postBulkCouchDbData(url,data){
var req = new XMLHttpRequest();
    req.open("POST", url, true);
    //req.open("POST", 'http://alsolh.myqnapcloud.com:32772/watches', true);
    req.setRequestHeader("Authorization", "Basic " + btoa('admin' + ":" + 'asolh787'));
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this.status + ' - ' + this.responseText);
            //window.open('authorized.html');
        }
    };
    req.send('{ "docs": '+JSON.stringify(data)+' }');
    console.log('{ "docs": '+JSON.stringify(data)+' }');
}

function postCouchDbData(url,data){
var req = new XMLHttpRequest();
    req.open("POST", url, true);
    //req.open("POST", 'http://alsolh.myqnapcloud.com:32772/watches', true);
    req.setRequestHeader("Authorization", "Basic " + btoa('admin' + ":" + 'asolh787'));
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this.status + ' - ' + this.responseText);
            //window.open('authorized.html');
        }
    };
    req.send(JSON.stringify(data));
}

var battery = navigator.battery || navigator.webkitBattery
		|| navigator.mozBattery;
console.log(Math.floor(battery.level * 100) + '%');
var log;
var logData = [];
// Temporary Code can be removed has to be back to support on demand
if(localStorage.getItem("logger1")!= null){
	logData = JSON.parse(localStorage.getItem("logger1"));
	console.log(JSON.stringify(logData));
	if(JSON.stringify(logData) == "{}"){
		logData = [];
	}
}
else{
	logData = [];
}
//Temporary Code can be removed has to be back to support on demand
var log = {
	    info : function(data) {
	    	var d = new Date();
		    var n = d.getTime();
	    	data.logTime = n;
	    	data.tizenId = watchId;
	    	data.sessionId = sessionId;
	    	data.episodeId = localStorage.getItem("episodeId");
	    	data.txnId = txnId;
	    	logData.push(data);
	    	//console.log(JSON.stringify(logData));
	    	console.log(logData.length);
	    	if (logData.length > 99){
	    		postBulkCouchDbData('http://192.168.1.189:5984/watchlog/_bulk_docs',logData);
	    		logData = [];
	    	}
	    }
	};
//localStorage.setItem("logger",null);
/*if(localStorage.getItem("logger1")!= null){
	log = JSON.parse(localStorage.getItem("logger1"));
}
else{
	log = log4javascript.getLogger(tizen.systeminfo
				.getCapability("http://tizen.org/system/tizenid"));
	// var log = log4javascript.getLogger();
	var consoleAppender = new log4javascript.BrowserConsoleAppender();
	var ajaxAppender = new log4javascript.AjaxAppender(
	"http://192.168.43.10:5984/watchlog/_bulk_docs");
			//"http://alsolh.myqnapcloud.com:32772/watchlog/_bulk_docs");
	var layout = new log4javascript.JsonLayout(true, false);
	layout.batchHeader = '{ "docs": [';
	layout.batchFooter = "] }";
	ajaxAppender.addHeader("Content-Type", "application/json");
	ajaxAppender.setLayout(layout);
	ajaxAppender.setBatchSize(50);
	//ajaxAppender.setSendAllOnUnload(true);
	var consoleLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
	consoleAppender.setLayout(consoleLayout);
	log.addAppender(consoleAppender);
	log.addAppender(ajaxAppender);
	// console.log("test222");
}*/


battery.onlevelchange = function() {
	log.info({logType:'batteryLog',battery:battery.level});
	//console.log('The battery level is ' + battery.level);
};

var id = null;
function onSuccessCallbackCPU(cpu) {
   log.info({logType:'resourceLog',cpu: cpu.load, mem:tizen.systeminfo.getAvailableMemory()});
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


