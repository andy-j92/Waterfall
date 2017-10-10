$('.loading').hide();

//Check if there is keyword extracted before
var isExtracted = false;
for(i = 0; i < sessionStorage.length; i++){
	if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0) {
		var fullKeywords = sessionStorage.getItem(sessionStorage.key(i) + "_keyword");
    	if(fullKeywords == null){
    		isExtracted = true;
    		break;
    	}
	}
}
if(isExtracted){ //Not extracted, extract
	
	try{
		$('.loading').show();
		setTimeout(function(){
			var obj={};
			for(i = 0; i < sessionStorage.length; i++){
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
			$('.loading').hide();

			$('.list-group').empty();
			var i = 0;
			var mainString = [];
			for (var key in obj) {
				$('.list-group').append('<br><h2 id="titleText">' + key + '</h2><br>')
				mainString = obj[key];
				var subString = mainString.split('@#$%^&');
				for(var line in subString) {
					var keyWords;
					if(subString[line] != ''){
						var categoryAndKeywords = subString[line].split('&');
						var categories = categoryAndKeywords[0];
						cat = categories.split('/')[1]; //higest category level
						if(!(cat == "book" || cat == "people")) {
							cat  = categories.split('/')[2]; //lower category level
							var keyWordsList = categoryAndKeywords[1];

							keyWords = keyWordsList.split(':');
							if(keyWords.length != 1) {
								var clickableKeywords = "";
								for(var keyword in keyWords) {
									if ((keyword % 5) == 4){
										var temp = '<a href="#" class="containedKeywords">'+ ' &#9702' + ' ' + keyWords[keyword].replace(/ *\([^)]*\) */g, '')  + ' </a><br/>';
									} else {
										var temp = '<a href="#" class="containedKeywords">'+ ' &#9702' + ' ' + keyWords[keyword].replace(/ *\([^)]*\) */g, '')  + ' </a>';
									}
									clickableKeywords += temp;
								}
								$('.list-group').append('<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + cat + '</strong><br>' + clickableKeywords + '</p>');
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
}else{ //Just display
	console.log("Just display");
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

$(document).on("click", '.containedKeywords', function(event) {
	var globalExtractObj=searchWithKeywords($(this).text().replace(/^\s+|\s+$/g, ""));
	var kword = $(this).text();

	sessionStorage.setItem('extractVar','true');
	sessionStorage.setItem('keyword', kword);
	sessionStorage.setItem('extractVarObj',JSON.stringify(globalExtractObj));
	window.location.href='/keywordsearch';
});

function searchWithKeywords(keywords){
	var obj={};
	for(i = 0; i < sessionStorage.length; i++){
		if(sessionStorage.key(i).indexOf('_smry')<0 && sessionStorage.key(i).indexOf('extractVar')<0){
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
