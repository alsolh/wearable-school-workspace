
		
		
		/*global tau */
		(function(){
			/**
			 * page - Rotary event page element
			 * progressBar - Circle progress element
			 * progressBarWidget - TAU circle progress instance
			 * rotaryDetentHandler - rotarydetent event handler
			 */

			var page = document.getElementById( "questionContentPage" );

			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */
			
			

			
			
			

			page.addEventListener("pagebeforeshow", function() {
			    var questionObject = JSON.parse(localStorage["question"]);
			    console.log(JSON.stringify(questionObject));
			    //var questionObject = {"courseWork":[{"courseId":"1017124722","id":"1018019307","title":"Q1","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MTAxODAxOTMwN1pa/details","creationTime":"2017-03-06T12:51:43.064Z","updateTime":"2017-03-06T12:52:42.289Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["correct","wrong"]}}]};
			    document.getElementById('menu-title').innerText = questionObject.title;
			    document.getElementById('menu-detail').innerText = questionObject.description.itemBody.p;
			    document.getElementById('menu-prompt').innerText = questionObject.description.itemBody.choiceInteraction.prompt;
			    var element = document.getElementById('calibration-btn');
				element.addEventListener('click', function() { 
					console.log("clicked");
					tau.changePage('radio/radio.html');
					}, false);
			    
			    
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