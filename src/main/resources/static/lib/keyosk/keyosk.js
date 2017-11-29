
var keyoskToggle;

function keyoskInit() {

	if (!keyoskMap) return;

	//append keyboard
	$("#keyosk-view").append('<div id="keyosk-keyboard"></div>');

	//append close button
	$("#keyosk-keyboard").append('<div id="keyosk-close-wrapper"><div id="keyosk-close">&Cross;</div></div>');

	//append keys
	$.each(keyoskMap, function(i, val) {
		$("#keyosk-keyboard").append('<div class="keyosk-key" data-out="' + val + '">' + i + '</div>');
	});


	$(".keyosk-toggle").click(function(){
		keyoskToggle = $(this);
		$("#keyosk-view").show("fast");
	});
	    
	$(".keyosk-key").not("#keyosk-close").click(function(){
		keyoskToggle.focus();
		var key = $(this);
		keyoskToggle.val(keyoskToggle.val() + key.attr("data-out"));
		key.addClass("keyosk-key-clicked");
		window.setTimeout(function(){
		  key.removeClass("keyosk-key-clicked");
		}, 100);
	});

	$("#keyosk-close").click(function(){
		ḱeyoskToggle = null;
		$("#keyosk-view").hide("fast");
	});

}