$('.loading').hide();
sessionStorage.removeItem('extractVar');
sessionStorage.removeItem('extractVarObj');
	if(sessionStorage.length){
		if($('#filesUploadedStatus').text()=='No Files Uploaded'){
			$('#filesUploadedStatus').text('Files Uploaded');
		}
		for(i=0;i<sessionStorage.length;i++){
			if(sessionStorage.key(i).indexOf('_smry')<0){
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
			setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
			console.log("function called");
		 }
	
		 $('#buttonSubmit').on('click',function(e){

			var file=$('input[name="myFile"]').prop('files')[0];
			if(file == undefined){
				snackbar("No files uploaded...");
				return;
			}
			

			 $('.loading').show(); 
			 setTimeout(function(){
				
				 $('#errorText').text(''); //Initially clear previous errors if present
			        var isDuplicateFile=false;

					var fileName=file.name;
											
					
					var fileExt=fileName.substring(fileName.lastIndexOf('.')+1,fileName.length);
					if('undefined'!=fileExt && ''!=fileExt){
						if('pdf'==fileExt || 'pptx'==fileExt || 'docx'==fileExt || 'ppt'==fileExt || 'doc'==fileExt || 'txt'==fileExt){

							var data = new FormData();
							data.append('myFile', file);



							var ourRequest = new XMLHttpRequest();
							ourRequest.open('POST', "/result", false);

							ourRequest.onreadystatechange = function() {
								
								if (this.readyState == 4 && this.status == 200) {
									sessionStorage.setItem(fileName, ourRequest.responseText);
									$('.loading').hide();
								}else{
									sessionStorage.setItem(fileName, 'Empty File');
									$('.loading').hide();
								}

							};
							ourRequest.send(data);
						}else
						$('#errorText').text('Invalid File Type!');
						isDuplicateFile=checkDuplicateFile(isDuplicateFile,fileName); //prevents duplicate filename from being appended, however the duplicate file will replace the old file in the session!!!
						if(!isDuplicateFile && !$('#errorText').text()){
							if($('#filesUploadedStatus').text()=='No Files Uploaded'){
								$('#filesUploadedStatus').text('Files Uploaded');
							}
							$('.list-group').append('<p class="list-group-item" customId=' + "list_" +  (sessionStorage.length) + '>' + fileName + '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></p>');
							setActiveFile();
						    }
					}
 					
			 },15);
 			 
			  
			
		});
		 
		 function setActiveFile(){
				
					$('.list-group-item').on('mouseover',function(){
						$('.list-group-item').removeClass('active');
						$('.list-group-item[customId=' + $(this).attr('customId') + ']').addClass('active');
					});
					
					$('.list-group-item').on('mouseout',function(){
						$(this).removeClass('active');
					});
			 }
		 
		 function checkDuplicateFile(param,fileName){
			 $('.list-group').find('.list-group-item').each(function(){
				 var listItem=$(this).text().substring(0,$(this).text().length-1);
				 if(listItem==fileName){
					 param=true;
					 return false;
				 }
				 });
				 
			 return param;
		 }


	
	$('#buttonSummarize').on('click',function(e){
		var obj={};
		
		var iterationLength=sessionStorage.length;

			if(iterationLength == 0){
				snackbar("No files uploaded...");
				return;
			}

			for(i=0;i<iterationLength;i++){
				if(sessionStorage.key(i).indexOf('_smry')<0){
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
			
			window.location.href='/keywordsearch';
	});

	$(document).on("click", '.close', function(event) {  //delete file
		var fileToRemove=$(this).parents('p').text();
		fileToRemove=fileToRemove.substring(0,fileToRemove.length-1); //x button text also appears
		sessionStorage.removeItem(fileToRemove);
		sessionStorage.removeItem(fileToRemove + "_smry");
		$(this).parents('p').remove();
		if(!$('.list-group-item').length)
			$('#filesUploadedStatus').text('No Files Uploaded');
			
	});