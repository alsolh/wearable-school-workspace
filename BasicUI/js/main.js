
window.onload = function () {
    // TODO:: Do your initialization job
	
    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	var box = document.querySelector('#textbox');
    	box.innerHTML = (box.innerHTML === "Basic") ? "Sample" : "Basic";
    });
    
};
