//Hide Spinner on loading the extract page.
$('.loading').hide();

//Variable to store boolean for checking if the keyword extraction has been performed previously
var isExtracted = false;

//Check if there is keyword extracted before
for(i = 0; i < sessionStorage.length; i++){
	if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0) {
		var fullKeywords = sessionStorage.getItem(sessionStorage.key(i) + "_keyword");
    	if(fullKeywords == null){
    		isExtracted = true;
    		break;
    	}
	}
}

if(isExtracted){ //No keyword has been extracted, so extract.
	
	try{
		
		//Start the spinner
		$('.loading').show();
		
		setTimeout(function(){ //Start a new thread for getting the keywords.
			var obj={};
			for(i = 0; i < sessionStorage.length; i++){ //Get keywords from the server
				if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0){
					var data = new FormData();
					data.append('data', sessionStorage.getItem(sessionStorage.key(i)));

					var ourRequest = new XMLHttpRequest();
					ourRequest.open('POST', "/extractKeywords", false);

					ourRequest.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							obj[sessionStorage.key(i)]=ourRequest.responseText;
						}
					};
					ourRequest.send(data);
				}
			}
			$('.loading').hide(); //Hide the spinner

			$('.list-group').empty(); //Remove all the elements (keywords shown previously) in the UI
			var i = 0;
			var mainString = [];
			for (var key in obj) {
				$('.list-group').append('<br><h2 id="titleText">' + key + '</h2><br>')
				mainString = obj[key];
				var subString = mainString.split('@#$%^&'); //Split the set of keywords for each file
				for(var line in subString) { //Loop through keywords for each file.
					var keyWords;
					if(subString[line] != ''){ //Make sure it's not empty
						var categoryAndKeywords = subString[line].split('&'); //Split category and keywords
						var categories = categoryAndKeywords[0]; 
						cat = categories.split('/')[1]; //higest category level
						if(!(cat == "book" || cat == "people")) {
							cat  = categories.split('/')[2]; //lower category level
							var keyWordsList = categoryAndKeywords[1]; //Get the list of keywords

							keyWords = keyWordsList.split(':'); //List of keywords
							if(keyWords.length != 1) { //Make sure there is at least one keyword to process
								var clickableKeywords = "";
								for(var keyword in keyWords) { //Loop through each keyword, assign bullet point, make it clickable
									if ((keyword % 5) == 4){
										var temp = '<a href="#" class="containedKeywords">'+ ' &#9702' + ' ' + keyWords[keyword].replace(/ *\([^)]*\) */g, '')  + ' </a><br/>';
									} else {
										var temp = '<a href="#" class="containedKeywords">'+ ' &#9702' + ' ' + keyWords[keyword].replace(/ *\([^)]*\) */g, '')  + ' </a>';
									}
									clickableKeywords += temp;
								}
								//Append it to the UI, below "Extracted Keywords:" section
								$('.list-group').append('<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + cat + '</strong><br>' + clickableKeywords + '</p>');
								
								//store into session storage for later use. This improves performance, as it is not required to re-extract the keywords if there is no additional files added.
								if(sessionStorage.getItem(key+"_keyword") == null){
									sessionStorage.setItem(key+"_keyword", '<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + cat + '</strong><br>' + clickableKeywords + '</p>');
								}else{
									sessionStorage.setItem(key+"_keyword", sessionStorage.getItem(key+"_keyword") + "@#$%^&" + '<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + cat + '</strong><br>' + clickableKeywords + '</p>');
								}
								i++;
							}
						}
					}
				}
				
				/*$('.list-group').append('<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + key.substring(0,key.lastIndexOf("_kywrd")) + '</strong><br>' + obj[key] + '</p>')*/
			}
		},15);
	}catch(err){
		console.log('An error occured ' + err);
	}
}else{ //The keywords are extracted, display them which are stored in the session storage
	for(i = 0; i < sessionStorage.length; i++){
		if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0) {
			var clickableKeyword = sessionStorage.getItem(sessionStorage.key(i) + "_keyword");
			$('.list-group').append('<br><h2 id="titleText">' + sessionStorage.key(i) + '</h2><br>');
			var clickableKeywords = clickableKeyword.split("@#$%^&");
			for(j = 0; j < clickableKeywords.length; j++){
				$('.list-group').append(clickableKeywords[j]);
			}
		}
	}
}

/**
 * Function to store the clicked keyword, and the page goes to keyword search page to summarise the uploaded files using the clicked keyword.
 */
$(document).on("click", '.containedKeywords', function(event) {
	var globalExtractObj=searchWithKeywords($(this).text().replace(/^\s+|\s+$/g, ""));
	var kword = $(this).text();

	sessionStorage.setItem('extractVar','true');
	sessionStorage.setItem('keyword', kword);
	sessionStorage.setItem('extractVarObj',JSON.stringify(globalExtractObj));
	window.location.href='/keywordsearch';
});

/**
 * Function to call "keyword summarisation" to the server. It takes text and keyword(s)
 * @param keywords
 * @returns
 */
function searchWithKeywords(keywords){
	var obj={};
	for(i = 0; i < sessionStorage.length; i++){
		if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('extractVar') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0){
			var data = new FormData();
			data.append('data', sessionStorage.getItem(sessionStorage.key(i)));
			data.append('keywords', keywords);

			var ourRequest = new XMLHttpRequest();
			ourRequest.open('POST', "/fetchFilteredSummaries", false);

			ourRequest.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(ourRequest.responseText != 'Empty File') {
						obj[sessionStorage.key(i) + "_smry"]=ourRequest.responseText;
					}
				}else{

				}
			};
			ourRequest.send(data);
		}
	}
	return obj;
}
