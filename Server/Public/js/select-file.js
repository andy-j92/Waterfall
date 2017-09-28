$('.loading').hide();
sessionStorage.removeItem('extractVar');
sessionStorage.removeItem('extractVarObj');
if (sessionStorage.length) {
	if ($('#filesUploadedStatus').text() == 'No Files Uploaded') {
		$('#filesUploadedStatus').text('Files Uploaded');
	}
	for (i = 0; i < sessionStorage.length; i++) {
		if (sessionStorage.key(i).indexOf('_smry') < 0) {
			$('.list-group')
					.append(
							'<a class="list-group-item" customId='
									+ "list_"
									+ i
									+ '>'
									+ sessionStorage.key(i)
									+ '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></a>');
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

$('#buttonSubmit').on('click', function(e) {

	var input = document.getElementById('UploadCV');
	//Check if the user has actually selected file(s)
	if (input.files.length == 0) {
		snackbar("No files uploaded...");
		return;
	}
	
	//Check if the file type is correct.
	for (var x = 0; x < input.files.length; x++) {
		var fileName = input.files[x].name;
		var fileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
		if ('undefined' != fileExt && '' != fileExt) {
			if ('pdf' != fileExt && 'pptx' != fileExt
					&& 'docx' != fileExt && 'ppt' != fileExt
					&& 'doc' != fileExt && 'txt' != fileExt) {
				snackbar("Invalid file type...")
				return;
			}
		} else {
			snackbar("Invalid file type...")
			return;
		}
	}
	// Initially clear previous errors if present
	$('#errorText').text('');
	//Start loading
	
	
	var count = 0;
	
	for (var x = 0; x < input.files.length; x++) {
		$('.loading').show();
		var fileName = input.files[x].name;
		var fileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
		var data = new FormData();
		data.append('myFile', input.files[x]);
		var ourRequest = new XMLHttpRequest();
		ourRequest.open('POST', "/result", false);
		
		//Listener for request
		ourRequest.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				sessionStorage.setItem(fileName,ourRequest.responseText);
				count++;
				console.log("RESPONSE");
				console.log(count + " " + ourRequest.responseText);
			} else {
				sessionStorage.setItem(fileName, 'Empty File');
				count++;
				console.log("RESPONSE FAILED");
				console.log(count);
			}
		};
		ourRequest.send(data);
	}
	if (count == input.files.length) {
		$('.loading').hide();
	}
	for (var x = 0; x < input.files.length; x++) {
		var isDuplicateFile = false;
		var fileName = input.files[x].name;
		/* prevents duplicate filename from being appended, however the
		 duplicate file will replace the old file in the session!!!*/
		isDuplicateFile = checkDuplicateFile(isDuplicateFile,fileName); 
		if (!isDuplicateFile && !$('#errorText').text()) {
			if ($('#filesUploadedStatus').text() == 'No Files Uploaded') {
				$('#filesUploadedStatus').text('Files Uploaded');
			}
			$('.list-group').append('<a href="#" class="list-group-item" customId='
									+ "list_" + fileName + '>'
									+ fileName
									+ '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></a>');
			setActiveFile();
		}
	}
					
});

function setActiveFile() {

	$('.list-group-item').on('mouseover',function() {
		$('.list-group-item').removeClass('active');
		$('.list-group-item[customId='+ $(this).attr('customId') + ']').addClass('active');
	});

	$('.list-group-item').on('mouseout', function() {
		$(this).removeClass('active');
	});
}

function checkDuplicateFile(param, fileName) {
	$('.list-group').find('.list-group-item').each(function() {
		var listItem = $(this).text().substring(0, $(this).text().length - 1);
		if (listItem == fileName) {
			param = true;
			return false;
		}
	});

	return param;
}

$('#buttonSummarize')
		.on(
				'click',
				function(e) {
					var obj = {};

					var iterationLength = sessionStorage.length;

					if (iterationLength == 0) {
						snackbar("No files uploaded...");
						return;
					}

					for (i = 0; i < iterationLength; i++) {
						if (sessionStorage.key(i).indexOf('_smry') < 0) {
							var data = new FormData();
							data.append('data', sessionStorage
									.getItem(sessionStorage.key(i)));
							data.append('keywords', '');

							var ourRequest = new XMLHttpRequest();
							ourRequest.open('POST', "/fetchFilteredSummaries",
									false);

							ourRequest.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									obj[sessionStorage.key(i) + "_smry"] = ourRequest.responseText;

								} else {
									obj[sessionStorage.key(i) + "_smry"] = "The file is empty";
								}

							};
							ourRequest.send(data);
						}
					}
					for ( var key in obj) {
						sessionStorage.setItem(key, obj[key]);
					}

					window.location.href = '/keywordsearch';
				});

$(document).on("click", '.close', function(event) { // delete file
	var fileToRemove = $(this).parents('a').text();
	fileToRemove = fileToRemove.substring(0, fileToRemove.length - 1); // x
																		// button
																		// text
																		// also
																		// appears
	sessionStorage.removeItem(fileToRemove);
	sessionStorage.removeItem(fileToRemove + "_smry");
	$(this).parents('a').remove();
	if (!$('.list-group-item').length)
		$('#filesUploadedStatus').text('No Files Uploaded');

});