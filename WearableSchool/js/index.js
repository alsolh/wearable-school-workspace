
		/*global tau */
		(function(){
			
			
			var page = document.getElementById( "main" );

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */

			page.addEventListener("pagebeforeshow", function() {
				//TODO:put the correct location later
				
				function guid() {
					  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					    s4() + '-' + s4() + s4() + s4();
					}

					function s4() {
					  return Math.floor((1 + Math.random()) * 0x10000)
					    .toString(16)
					    .substring(1);
					}

					localStorage.setItem("sessionId", guid());
				
				localStorage.setItem("automated", false);
				if(localStorage.getItem("automated") == "true"){
				    setTimeout(function () {
				    	console.log('maintain screen state');
				    	//tizen.power.request('SCREEN', 'CPU_AWAKE');
				    	tizen.power.request("SCREEN", "SCREEN_NORMAL");
				    	tizen.power.turnScreenOn();
				    	//tizen.power.setScreenBrightness(1);
				    	//tizen.power.restoreScreenBrightness();
				    }, 1000);
				}
				var tizenId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
				document.getElementById("tizenId").innerText = tizenId;
				console.log(" tizenid = " + tizenId);
			});

			/**
			 * pagehide event handler
			 * Destroys and removes event listeners
			 */
			page.addEventListener("pagehide", function() {

			});
		}());