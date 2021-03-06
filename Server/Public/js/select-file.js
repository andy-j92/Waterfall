//Hide Spinner on loading the extract page
$('.loading').hide();
checkFileCount();
sessionStorage.removeItem('extractVar');
sessionStorage.removeItem('extractVarObj');
//when there is a file uploaded update the UI to let the user know which files have been uploaded
if (sessionStorage.length) {
	if ($('#filesUploadedStatus').text() == 'No Files Uploaded') {
		$('#filesUploadedStatus').text('Files Uploaded');
	}
	for(i = 0; i < sessionStorage.length; i++){
		if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0){
		$('.list-group').append('<p class="list-group-item" customId=' + "list_" +  i + '>' + sessionStorage.key(i) + '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></p>');
		}
	}
}

setActiveFile();

function snackbar(text) {
    
	var snackbar = document.getElementById("snackbar")

	// Add the "show" class to DIV
	snackbar.innerHTML = text;
	snackbar.className = "show";

	// After 3 seconds, remove the show class from DIV
	setTimeout(function() {
		snackbar.className = snackbar.className.replace("show", "");
	}, 3000);
	console.log("function called");
}

/**
 * Sends request to the server side to get the text of the file(s)
 */
$('#buttonSubmit').on('click', function(e) {

	//Get the selected files
	var input = document.getElementById('UploadCV');

	//Check if the user has actually selected file(s)
	if (input.files.length == 0) {
		snackbar("No files uploaded...");
		return;
	}
		
			// Initially clear previous errors if present
			$('#errorText').text('');
			$('.loading').show();
			setTimeout(function(){
				var count = 0;
				for (var x = 0; x < input.files.length; x++) {
					var isDuplicateFile = false;
					var fileName = input.files[x].name;
					var fileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);

					if('undefined'!=fileExt && ''!=fileExt && isCorrectType(fileExt)){

					var data = new FormData();
					data.append('myFile', input.files[x]);
					var ourRequest = new XMLHttpRequest();
					ourRequest.open('POST', "/result", false);

					//Listener for request
					ourRequest.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) { //Successful response
							sessionStorage.setItem(fileName,ourRequest.responseText); //Stores the text into the  current session
							count++;
							checkDuplicateAndAddFile(fileName);
						} else { //Unsuccessful response
							sessionStorage.setItem(fileName, 'Empty File');
							count++;
						}
					};
					//Send the file
					console.log(count);
					ourRequest.send(data);
					checkFileCount();

					if (count == input.files.length) {
						$('.loading').hide();
					}



				}else {
					$('.loading').hide();
					snackbar("Invalid file type..." + fileName);
					continue;
				}

			}
			},15);
		 
	//}
});

/**
 * Checks duplication and adds the given file to the list group
 * @param fileName
 * @returns
 */
function checkDuplicateAndAddFile(fileName){
	var isDuplicateFile = false;
	isDuplicateFile = checkDuplicateFile(isDuplicateFile,fileName);
	if (!isDuplicateFile && !$('#errorText').text()) {
		if ($('#filesUploadedStatus').text() == 'No Files Uploaded') {
			$('#filesUploadedStatus').text('Files Uploaded');
		}
		$('.list-group').append('<p href="#" class="list-group-item" customId='
							+ "list_" +  (sessionStorage.length) + '>'
							+ fileName
							+ '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></p>');
	}
	setActiveFile();
}

//checks to see if the file uploaded by the user is compatable with our web app.
function isCorrectType(fileExt) {
	if('pdf'==fileExt || 'pptx'==fileExt || 'docx'==fileExt || 'ppt'==fileExt || 'doc'==fileExt || 'txt'==fileExt) {
		return true;
	} else {
		return false;
	}
}

function setActiveFile() {
//When the mouse moves over a uploaded file name, that file is set to the active file
	$('.list-group-item').on('mouseover',function() {
		$('.list-group-item').removeClass('active');
		$('.list-group-item[customId='+ $(this).attr('customId') + ']').addClass('active');
	});

	$('.list-group-item').on('mouseout', function() {
		$(this).removeClass('active');
	});
}

//checks for duplicate file names and sets a flag if it finds a duplicate
function checkDuplicateFile(param, fileName) {
	$('.list-group').find('.list-group-item').each(function() {
		var listItem = $(this).text().substring(0, $(this).text().length - 1);
		if (listItem == fileName) {
			param = true;
			return false; //returns from JQuery function
		}
	});

	return param;
}


$('#buttonSummarize').on('click',function(e){
	
    //if there are no files uploaded a pop up in the UI will say ther are no files uploaded
	var obj={};
	var iterationLength=sessionStorage.length;
	if(iterationLength == 0){
		snackbar("No files uploaded...");
		return;
	}

    //store the content of the files uploaded in the session storage and send them to pyteaser to be summarised
	for(i = 0; i < iterationLength; i++){
		if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword')){
			var data = new FormData();
			data.append('data', sessionStorage.getItem(sessionStorage.key(i)));
			data.append('keywords', '');
			var ourRequest = new XMLHttpRequest();
			ourRequest.open('POST', "/fetchFilteredSummaries", false);

			ourRequest.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					obj[sessionStorage.key(i) + "_smry"]=ourRequest.responseText;
				}else{
					obj[sessionStorage.key(i) + "_smry"]="The file is empty";
				}
			};
			ourRequest.send(data);
		}
	}
    //once the files have been sent to pyteaser sucessfully automatically go to the summary page
	for (var key in obj) {
		sessionStorage.setItem(key, obj[key]);
	}
	window.location.href='/keywordsearch';
});

// when the 'X' button (close button) is clicked, remove the corresponding file form the session storage 
$(document).on("click", '.close', function(event) {  //delete file
		var fileToRemove=$(this).parents('p').text();
		fileToRemove=fileToRemove.substring(0,fileToRemove.length-1); //x button text also appears
		sessionStorage.removeItem(fileToRemove);
		sessionStorage.removeItem(fileToRemove + "_smry");
		sessionStorage.removeItem(fileToRemove + "_keyword");
		$(this).parents('p').remove();
		checkFileCount();
		if(!$('.list-group-item').length){
			$('#filesUploadedStatus').text('No Files Uploaded');
		}
	});

//If there are no files in the session storage, then don not display the summarize button
function checkFileCount() {
	if(sessionStorage.length == 0) {
		$('#buttonSummarize').hide()
	} else {
		$('#buttonSummarize').show()
	}
}
