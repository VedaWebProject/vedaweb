
function req(url, params){
	//loader
	$("body").append("<div id='loader'></div>");
	
	// Send the data using post
	var posting = $.post(url, params);

	// Put the results in a div
	posting.done(function(data) {
		$("#loader").remove();
		$("#content-area").html(data);
		initSidebarToggles();
	});
}