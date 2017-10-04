if(sessionStorage.getItem('extractVar')=='true'){
	var extractObj=JSON.parse(sessionStorage.getItem('extractVarObj'));
	if(null!=extractObj && undefined!=extractObj){
		var counter=0;
		for (var key in extractObj) {
			$('.list-group').append('<p href="#" class="list-group-item" customId=' + "summary_" +  counter + '><strong>Summary of ' +  key.substring(0,key.lastIndexOf("_smry")) + '</strong><br>' + splitParaIntoSentences(extractObj[key]) + '</p>');
			if($('.list-group-item[customId=' + "summary_" + counter + ']').text()=='Summary of ' + key.substring(0,key.lastIndexOf("_smry")))
				$('.list-group-item[customId=' + "summary_" + counter + ']').remove();
			counter++;
		}
	}
}
else{
for(i=0;i<sessionStorage.length;i++){
	if(sessionStorage.key(i).indexOf('_smry')<0){
	$('.list-group').append('<p class="list-group-item" customId=' + "summary_" +  i + '><strong>Summary of ' +  sessionStorage.key(i) + '</strong><br>' + splitParaIntoSentences(sessionStorage.getItem(sessionStorage.key(i) + "_smry")) + '</p>');
}
}
}

$('#searchSummaries').click(function(e){
	var obj = null;
	if(!$.trim($("#SearchBox").val())){
		obj=searchWithKeywords('');
	}
	else{
		obj=searchWithKeywords($("#SearchBox").val());
	}

	$('.list-group').empty();
	var i=0;
	for (var key in obj) {
		$('.list-group').append('<p class="list-group-item" customId=' + "summary_" +  i + '><strong>Summary of ' +  key.substring(0,key.lastIndexOf("_smry")) + '</strong><br>' + obj[key] + '</p>');
		if($('.list-group-item[customId=' + "summary_" + i + ']').text()=='Summary of ' + key.substring(0,key.lastIndexOf("_smry")))
			$('.list-group-item[customId=' + "summary_" + i + ']').remove();
		i++;
	}

});

document.getElementById("SearchBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("searchSummaries").click();
    }
});


function splitParaIntoSentences(paragraph)
{
    //sessionStorage.getItem(sessionStorage.key(i)+ "_smry")
    var sentences = paragraph.match( /[^\.!\?]+[\.!\?]+/g );
    var newSumPara = "";
    for(i = 0; i < sentences.length; i++)
    {
        newSumPara += "- " + sentences[i] + "<br/>";
    }
    return newSumPara;
}
