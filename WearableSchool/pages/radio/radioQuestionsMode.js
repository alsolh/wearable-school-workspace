
		
		
		/*global tau */
		(function(){
			/**
			 * page - Rotary event page element
			 * progressBar - Circle progress element
			 * progressBarWidget - TAU circle progress instance
			 * rotaryDetentHandler - rotarydetent event handler
			 */
			var selectedMode = "onDemand";
			var page = document.getElementById( "ModePage" );

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */
			
			

			
			
			

			page.addEventListener("pagebeforeshow", function() {
				//TODO:put the correct location later
				
				var element = document.getElementById('okButtonMode');
				element.addEventListener('click', function() { 
					console.log("clicked" + selectedMode);
					if(selectedMode == "onDemand"){
					localStorage.setItem("continous", "false"); 
					}
					else {
						localStorage.setItem("continous", "true"); 
					}
					tau.changePage('/authorizedV2.html');
					}, false);
				

				  
				   
				    //var questionObject = '{"courseWork":[{"courseId":"1017124722","id":"2012123131","title":"Time to Eiffel Tower","description":"if you are in a plane flying at the speed of 500 Km per hour and the Eiffel tower is currently 9001.02 Km away from you. how long will it take to reach there in hours time?","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MjAxMjEyMzEzMVpa/details","creationTime":"2017-04-27T16:06:43.477Z","updateTime":"2017-04-27T18:33:23.417Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["18.00","360.04","12.00","90.01"]}},{"courseId":"1017124722","id":"1018019307","title":"What is 2 + 3?","description":"please select the correct result","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MTAxODAxOTMwN1pa/details","creationTime":"2017-03-06T12:51:43.064Z","updateTime":"2017-04-22T13:44:22.745Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["6","5","4","1"]}}]}';
				    //var questionObject = {"courseWork":[{"courseId":"1017124722","id":"1018019307","title":"Q1","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MTAxODAxOTMwN1pa/details","creationTime":"2017-03-06T12:51:43.064Z","updateTime":"2017-03-06T12:52:42.289Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["correct","wrong"]}}]};
				    

				

			    document.getElementById('radioOnDemand').addEventListener('click', function() { 
			    	selectedMode = "onDemand";
					}, false);

			    document.getElementById('radioContinous').addEventListener('click', function() { 
			    	selectedMode = "continous";
					}, false);
			    
				if(localStorage.getItem("automated") == "true"){
			    	if(localStorage.getItem("mode") == "onDemand"){
				    	document.getElementById('radioOnDemand').click();
				    	//document.getElementById('radioOnDemandinput').click();
				    	}
				    	else{
				    	document.getElementById('radioContinous').click();
				    	//document.getElementById('radioContinousinput').click();
				    	}
				    setTimeout(function () {
				    	document.getElementById('okButtonMode').click();
				    }, 1000);
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