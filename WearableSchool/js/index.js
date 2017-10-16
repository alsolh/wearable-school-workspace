
		/*global tau */
		(function(){
			
			
			
			var page = document.getElementById( "main" );

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */

			page.addEventListener("pagebeforeshow", function() {
				//TODO:put the correct location later
				
				console.log('pageChangedyestests')
			
					localStorage.setItem("sessionId", sessionId);
				
				//localStorage.setItem("automated", true);
				
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