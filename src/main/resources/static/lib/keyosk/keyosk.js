
var keyoskToggle;
var keyoskInput;

function keyoskInit(toggle) {
	
	if (!keyoskMap){
		console.log("keyOSK Error: keyoskMap.js not found.");
		return;
	}
	
	keyoskToggle = toggle;

	//append keyboard
	$("#keyosk-view").append('<div id="keyosk-keyboard"></div>');

	//append close button
	$("#keyosk-keyboard").append('<div id="keyosk-close-wrapper"><div id="keyosk-close">&Cross;</div></div>');

	//append keys
	$.each(keyoskMap, function(i, val) {
		$("#keyosk-keyboard").append('<div class="keyosk-key" data-out="' + val + '">' + i + '</div>');
	});


	$(".keyosk-input").focus(function(){
		keyoskInput = $(this);
	});
	    
	$(".keyosk-key").not("#keyosk-close").click(function(){
		keyoskInput.focus();
		var key = $(this);
		keyoskInput.val(keyoskInput.val() + key.attr("data-out"));
		key.addClass("keyosk-key-clicked");
		window.setTimeout(function(){
		  key.removeClass("keyosk-key-clicked");
		}, 100);
	});

	$("#keyosk-close").click(function(){
		//ḱeyoskToggle = null;
		$("#keyosk-view").hide("fast");
		keyoskToggle.bootstrapSwitch('toggleState', false);
	});

}


function keyoskUpdate(){
	$(".keyosk-input").unbind("focus");
	$(".keyosk-input").focus(function(){
		keyoskInput = $(this);
	});
}


function keyoskDisplay(state){
	if (state){
		keyoskShow();
	} else {
		keyoskHide();
	}
}


function keyoskShow(){
	$("#keyosk-view").show("fast");
}


function keyoskHide(){
	$("#keyosk-view").hide("fast");
}