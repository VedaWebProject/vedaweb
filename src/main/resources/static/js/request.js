
function req(url, params, after){
	//loader
	$("body").append("<div id='loader'></div>");
	
	// Send the data using post
	$.ajax({ 
	    url:url,
	    type:"POST", 
	    contentType: "application/json; charset=utf-8",
	    data: params,    //Stringified Json Object
	    cache: false,    //This will force requested pages not to be cached by the browser  
	    processData:false, //To avoid making query String instead of JSON
	    success: function(data){
	    	$("#loader").remove();				//remove spinner
			$("#content-area").html(data);		//load content
			$("#search-area").collapse("hide");	//collapse search area
			initSidebarToggles();
			
			//scroll to top
//			$('html, body').animate({
//	            scrollTop: 0
//	        }, 0);
			
			if (after instanceof Function){
				after();
			}
	    }
	});
	
	console.log("posted: " + params + " TO: " + url);
}