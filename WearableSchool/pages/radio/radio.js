
		
		
		/*global tau */
		(function(){
			/**
			 * page - Rotary event page element
			 * progressBar - Circle progress element
			 * progressBarWidget - TAU circle progress instance
			 * rotaryDetentHandler - rotarydetent event handler
			 */
			var watchId = tizen.systeminfo.getCapability("http://tizen.org/system/tizenid");
			var encodedWatchId = encodeURIComponent(watchId);
			var selectedAnswer = "";
			var timesPageLoaded = 0;
			var submitAnswerClicked;
			var timeoutSubmitAnswer = 6000;

			var page = document.getElementById( "radioPage" );
			//var old_element_main = document.getElementById("pagePlaceholder");
			//var pageCopy = old_element_main.cloneNode(true);
			/**
			 * pagebeforeshow event handler
			 * Do preparatory works and adds event listeners
			 */
			
			

			
			
			

			page.addEventListener("pagebeforeshow", function() {
				tizen.power.turnScreenOn();
				timeoutSubmitAnswer = localStorage.getItem("timeoutSubmitAnswer");
				var questionObject = null;
				selectedAnswer = "";
				timesPageLoaded = timesPageLoaded + 1;
				submitAnswerClicked = false;
				//refreshIntervalId = null;

				//TODO:put the correct location later
				
				//console.log("reached radio page");
				
				document.getElementById('answersRadio').innerHTML = "";
				//old_element_main.parentNode.replaceChild(pageCopy, old_element_main);
				
				function submitAnswer(selectedAnswer) {
					var d = new Date();
				    var n = d.getTime();
				    var assessmentOutcome;
				    if(selectedAnswer == questionObject.description.responseDeclaration.correctResponse) {
				    	assessmentOutcome = "pass";
				    }
				    else{
				    	assessmentOutcome = "fail";
				    }
					var answerData = {
						"episodeId": localStorage.getItem("episodeId"),
						"answerTime": n,
					    "questionId": questionObject.id,
					    "questionTitle": questionObject.title,
					    "questionDetail": questionObject.description.itemBody.p,
					    "questionPrompt": questionObject.description.itemBody.choiceInteraction.prompt,
					    "selectedAnswer": selectedAnswer,
					    "correctAnswer": questionObject.description.responseDeclaration.correctResponse,
					    "assessmentOutcome": assessmentOutcome,
					    "answeredWatchId": watchId,
					    "answeredStudentId": localStorage.getItem("studentId"),
					    "answeredStudentEmail": localStorage.getItem("studentEmail")
					};
					


								message = new Paho.MQTT.Message(JSON.stringify({method:"POST",data:answerData,host:"192.168.0.110",port:"5984",path:"/wearable",sessionId:localStorage.getItem("sessionId")}));
								//TODO:change to wrapper/postAnswer
								message.destinationName = "wrapper/" + encodedWatchId + "/postAnswer";
								//console.log(JSON.stringify(message));
								log.info({logType:'txLog',txnType:'0.postAnswerStart',endPoint:'watch'});
								client.send(message);
								

								/*old_element.parentNode.replaceChild(new_element, old_element);*/


					    
//					        var req = new XMLHttpRequest();
//					    req.open("POST", 'http://192.168.43.10:5984/wearable', true);
//					    //req.open("POST", 'http://alsolh.myqnapcloud.com:32772/wearable', true);
					//req.setRequestHeader("Authorization", "Basic " + btoa('admin' + ":" + 'asolh787'));
//					    req.setRequestHeader("Content-type", "application/json");
//					    req.send(JSON.stringify(data));
					    
					}
				
				//console.log('start okbutton listener');
				var element = document.getElementById('okButton1');
/*				var old_element = document.getElementById("okButton1");
				var new_element = old_element.cloneNode(true);*/
				//if(timesPageLoaded < 2){
				element.addEventListener('click', function() { 
					//console.log("clicked" + selectedAnswer);
					if(submitAnswerClicked == false){
					submitAnswer(selectedAnswer); 
					submitAnswerClicked = true;
					}
					
					}, false);
				//}
					    questionObject = JSON.parse(localStorage["question"]);
					    
					    //console.log("question object = " + localStorage["question"]);
					    //var questionObject = '{"courseWork":[{"courseId":"1017124722","id":"2012123131","title":"Time to Eiffel Tower","description":"if you are in a plane flying at the speed of 500 Km per hour and the Eiffel tower is currently 9001.02 Km away from you. how long will it take to reach there in hours time?","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MjAxMjEyMzEzMVpa/details","creationTime":"2017-04-27T16:06:43.477Z","updateTime":"2017-04-27T18:33:23.417Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["18.00","360.04","12.00","90.01"]}},{"courseId":"1017124722","id":"1018019307","title":"What is 2 + 3?","description":"please select the correct result","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MTAxODAxOTMwN1pa/details","creationTime":"2017-03-06T12:51:43.064Z","updateTime":"2017-04-22T13:44:22.745Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["6","5","4","1"]}}]}';
					    //var questionObject = {"courseWork":[{"courseId":"1017124722","id":"1018019307","title":"Q1","state":"PUBLISHED","alternateLink":"http://classroom.google.com/c/MTAxNzEyNDcyMlpa/mc/MTAxODAxOTMwN1pa/details","creationTime":"2017-03-06T12:51:43.064Z","updateTime":"2017-03-06T12:52:42.289Z","maxPoints":100,"workType":"MULTIPLE_CHOICE_QUESTION","submissionModificationMode":"MODIFIABLE_UNTIL_TURNED_IN","multipleChoiceQuestion":{"choices":["correct","wrong"]}}]};
					    
					    var myStringArray = questionObject.multipleChoiceQuestion.choices;
					    var arrayLength = myStringArray.length;
					for (var i = 0; i < arrayLength; i++) {
						//console.log(myStringArray[i]);
					    document.getElementById('answersRadio').innerHTML += '<li class="li-has-radio" id="' + i + 'radioanswer"><label>' + myStringArray[i] + '<input type="radio" name="radio-sample" /></label></li>';
					    
					    //console.log(document.getElementById('answersRadio').innerHTML);
					    //Do something
					}

					for (var i = 0; i < arrayLength; i++) {
				    document.getElementById(i + "radioanswer").addEventListener('click', function() { 
						//console.log("clicked" + this.innerText);
						selectedAnswer=this.innerText;
						}, false);
					}
					    //document.getElementById('menu-detail').innerText = questionObject.courseWork[0].description;
					
					if(localStorage.getItem("automated") == "true"){
					    setTimeout(function () {
					    	document.getElementById( Math.floor((Math.random() * arrayLength)) + 'radioanswer').click();
					    	document.getElementById('okButton1').click();
					    }, timeoutSubmitAnswer);
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