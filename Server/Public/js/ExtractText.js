$('.loading').hide();
$('#extractText').on('click',function(e){
	try{
		$('.loading').show();
		setTimeout(function(){
			var obj={};
			for(i=0;i<sessionStorage.length;i++){
				if(sessionStorage.key(i).indexOf('_smry')<0){
					var data = new FormData();
					data.append('data', sessionStorage.getItem(sessionStorage.key(i)));

					var ourRequest = new XMLHttpRequest();
					ourRequest.open('POST', "/extractKeywords", false);

					ourRequest.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							obj[sessionStorage.key(i) + "_kywrd"]=ourRequest.responseText;
						}
					};
					ourRequest.send(data);
				}

			}
			$('.loading').hide();

			$('.list-group').empty();

			var mainString = [];
			for (var key in obj) {
				mainString = obj[key];
				console.log(mainString);
				var subString = mainString.split('@#$%^&');
				for(var line in subString) {
					var keyWords;
					if(subString[line]!=''){
						var categoryAndKeywords = subString[line].split('&');
						console.log(categoryAndKeywords[0]);
						console.log(categoryAndKeywords[1]);
						var cat = categoryAndKeywords[0];
						var keyWordsList = categoryAndKeywords[1];

						keyWords = keyWordsList.split(':');

						var clickableKeywords = "";
						for(var keyword in keyWords) {
							if ((keyword % 5) == 4){
								var temp = '<a href="#" class="containedKeywords">'+ ' &#9702' + ' ' + keyWords[keyword].replace(/ *\([^)]*\) */g, '')  + ' </a><br/>';
							} else {
								var temp = '<a href="#" class="containedKeywords">'+ ' &#9702' + ' ' + keyWords[keyword].replace(/ *\([^)]*\) */g, '')  + ' </a>';
							}
							clickableKeywords += temp;
						}
						$('.list-group').append('<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + cat + '</strong><br>' + clickableKeywords + '</p>')
					}
				}

				/*$('.list-group').append('<p class="list-group-item" customId=' + "keyword_" +  i + '><strong>' + key.substring(0,key.lastIndexOf("_kywrd")) + '</strong><br>' + obj[key] + '</p>')*/
			}

		},15);


	}catch(err){
		console.log('An error occured ' + err);
	}

});

$(document).on("click", '.containedKeywords', function(event) {
	var kword = $(this).text();
	var globalExtractObj=searchWithKeywords($(this).text().replace(/^\s+|\s+$/g, ""));


	sessionStorage.setItem('extractVar','true');
	sessionStorage.setItem('keyword', kword);
	sessionStorage.setItem('extractVarObj',JSON.stringify(globalExtractObj));
	window.location.href='/keywordsearch';
});

function searchWithKeywords(keywords){
	var obj={};
	for(i=0;i<sessionStorage.length;i++){
		if(sessionStorage.key(i).indexOf('_smry')<0 && sessionStorage.key(i).indexOf('extractVar')<0){
			var data = new FormData();
			data.append('data', sessionStorage.getItem(sessionStorage.key(i)));
			data.append('keywords', keywords);



			var ourRequest = new XMLHttpRequest();
			ourRequest.open('POST', "/fetchFilteredSummaries", false);

			ourRequest.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(ourRequest.responseText!='Empty File')
						obj[sessionStorage.key(i) + "_smry"]=ourRequest.responseText;

				}else{

				}

			};
			ourRequest.send(data);
		}
	}
	return obj;
}