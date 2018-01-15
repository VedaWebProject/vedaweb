
function req(url, params, after){
	//loader
	$("body").append("<div id='loader'></div>");
	
	// Send the data using post
	var posting = $.post(url, params);

	// Put the results in a div
	posting.done(function(data) {
		$("#loader").remove();				//remove spinner
		$("#content-area").html(data);		//load content
		$("#search-area").collapse("hide");	//collapse search area
		initSidebarToggles();
		
		//scroll to top
//		$('html, body').animate({
//            scrollTop: 0
//        }, 0);
		
		if (after instanceof Function){
			after();
		}
	});
}