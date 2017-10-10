
if(sessionStorage.getItem('extractVar')=='true'){ // Keyword summarisation when a keyword is clicked
	var extractObj=JSON.parse(sessionStorage.getItem('extractVarObj'));
	var keyword = sessionStorage.getItem('keyword');
	sessionStorage.removeItem('keyword');
	sessionStorage.removeItem('extractVarObj');
	sessionStorage.removeItem('extractVar');

	if(null!=extractObj && undefined!=extractObj){
		var counter=0;
		for (var key in extractObj) {
            
            var FullSummary = extractObj[key];
            var SummarySplit = FullSummary.split('@#$%^&*');
            var EditedSummary="";

            for(j = 0; j < (SummarySplit.length - 1); j++) {
                EditedSummary += ' - ' + SummarySplit[j] + '<br/>';
            }
            
            
			$('.list-group').append('<p href="#" class="list-group-item" customId=' + "summary_" +  counter + '><strong>Summary of ' +  key.substring(0,key.lastIndexOf("_smry")) + '</strong><br>' + EditedSummary + '</p>');
            
			if($('.list-group-item[customId=' + "summary_" + counter + ']').text()=='Summary of ' + key.substring(0,key.lastIndexOf("_smry")))
				$('.list-group-item[customId=' + "summary_" + counter + ']').remove();
			counter++;
		}
	}

	var myHilitor = new Hilitor("content");
  	myHilitor.apply(keyword);
} else {
	
	//Remove the keyword selected
	sessionStorage.removeItem('extractVarObj');
	sessionStorage.removeItem('extractVar');
	
	
	var isFileChanged = false;
	//Determine if there has been change in files uploaded.
	for(i = 0; i < sessionStorage.length; i++){
        if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0){
        	var FullSummary = sessionStorage.getItem(sessionStorage.key(i) + "_smry");
        	if(FullSummary == null){
        		isFileChanged = true;
        		break;
        	}
        }
	}
	//If changed, make adjustments, get the summaries again
	if(isFileChanged){
		var obj={};
		var iterationLength=sessionStorage.length;

    	for(i = 0; i < iterationLength; i++){
    		if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0){
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
    	for (var key in obj) {
    		sessionStorage.setItem(key, obj[key]);
    	}
	}
	
	//Display the summaries
    for(i = 0; i < sessionStorage.length; i++){
        if(sessionStorage.key(i).indexOf('_smry') < 0 && sessionStorage.key(i).indexOf('_keyword') < 0){

            var FullSummary = sessionStorage.getItem(sessionStorage.key(i) + "_smry");
            var SummarySplit = FullSummary.split('@#$%^&*');
            var EditedSummary="";

            for(j = 0; j < (SummarySplit.length - 1); j++) {
                EditedSummary += ' - ' + SummarySplit[j] + '<br/>';
            }

            $('.list-group').append('<p class="list-group-item" customId=' + "summary_" +  i + '><strong>Summary of ' +  sessionStorage.key(i) + '</strong><br>' + EditedSummary + '</p>');
        }
    }
}

$('#searchSummaries').click(function(e){
	var obj = null;
	var keyword = null;

	if(!$.trim($("#SearchBox").val())){
		obj=searchWithKeywords('');
		keyword = null;
	}
	else{
		obj=searchWithKeywords($("#SearchBox").val());
		keyword = $("#SearchBox").val();
	}
	$('.list-group').empty();
	var i=0;
	
	for (var key in obj) {
        
        var FullSummary = obj[key];
        var SummarySplit = FullSummary.split('@#$%^&*');
        var EditedSummary="";

        for(j=0; j < (SummarySplit.length -1); j++) {
            EditedSummary += ' - ' + SummarySplit[j] + '<br/>';
        }
        
		$('.list-group').append('<p class="list-group-item" customId=' + "summary_" +  i + '><strong>Summary of ' +  key.substring(0,key.lastIndexOf("_smry")) + '</strong><br>' + EditedSummary + '</p>');
        
		if($('.list-group-item[customId=' + "summary_" + i + ']').text()=='Summary of ' + key.substring(0,key.lastIndexOf("_smry")))
			$('.list-group-item[customId=' + "summary_" + i + ']').remove();
		i++;
	}

	var myHilitor = new Hilitor("content");
  	myHilitor.apply(keyword); //can call remove aswell

});

//checking to see if
document.getElementById("SearchBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("searchSummaries").click();
    }
});