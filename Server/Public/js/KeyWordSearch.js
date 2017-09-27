if(sessionStorage.getItem('extractVar')=='true'){
	var extractObj=JSON.parse(sessionStorage.getItem('extractVarObj'));
	if(null!=extractObj && undefined!=extractObj){
		var counter=0;
		for (var key in extractObj) {
			$('.list-group').append('<a href="#" class="list-group-item" customId=' + "summary_" +  counter + '><strong>Summary of ' +  key.substring(0,key.lastIndexOf("_smry")) + '</strong><br>' + extractObj[key] + '</a>');
			if($('.list-group-item[customId=' + "summary_" + counter + ']').text()=='Summary of ' + key.substring(0,key.lastIndexOf("_smry")))
				$('.list-group-item[customId=' + "summary_" + counter + ']').remove();
			counter++;
		}
	}
}
else{
for(i=0;i<sessionStorage.length;i++){
	if(sessionStorage.key(i).indexOf('_smry')<0){
	$('.list-group').append('<a href="#" class="list-group-item" customId=' + "summary_" +  i + '><strong>Summary of ' +  sessionStorage.key(i) + '</strong><br>' + sessionStorage.getItem(sessionStorage.key(i) + "_smry") + '</a>');
}
}
}

$('#searchSummaries').click(function(e){
	if(!$.trim($("#SearchBox").val())){
//		do nothing
	}
	else{
	var obj=searchWithKeywords($("#SearchBox").val());
		
		$('.list-group').empty();
		var i=0;
		for (var key in obj) {
			$('.list-group').append('<a href="#" class="list-group-item" customId=' + "summary_" +  i + '><strong>Summary of ' +  key.substring(0,key.lastIndexOf("_smry")) + '</strong><br>' + obj[key] + '</a>');
			if($('.list-group-item[customId=' + "summary_" + i + ']').text()=='Summary of ' + key.substring(0,key.lastIndexOf("_smry")))
				$('.list-group-item[customId=' + "summary_" + i + ']').remove();
			i++;
		}

	}

});