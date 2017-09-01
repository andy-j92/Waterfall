
function sendText(){
	var data = new Object();
		// window.JSONObj = new Object();
		// JSONObj.eventType = eventType;
		// JSONObj.location = pos;
		// JSONObj.date = date;



		var ourRequest = new XMLHttpRequest();
		ourRequest.open('GET', "/test");

		ourRequest.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				// alert("success");
				// alert(ourRequest.responseText);
				document.getElementById('Testingtext').innerHTML = ourRequest.responseText;
	
				return ourRequest.responseText;
			}

		};
		ourRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ourRequest.send("calling test");


}
