
		
		
		/*global tau */
		(function(){
			/**
			 * page - Rotary event page element
			 * progressBar - Circle progress element
			 * progressBarWidget - TAU circle progress instance
			 * rotaryDetentHandler - rotarydetent event handler
			 */

			var page = document.getElementById( "noQContentFound" );
			var timeoutConfirmQuestion = 3000;

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */
			
			

			
			
			

			page.addEventListener("pagebeforeshow", function() {
				if(tizen.power.isScreenOn()){
				setTimeout(function(){tau.changePage('/authorizedV2.html');}, 3000);
				}
				else{
					setTimeout(function(){tau.changePage('/authorizedV2.html');}, 100);
				}
			    
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