////TRANSLITERATION PREVIEW
var transInput;


function transliteration(){
	transInput
		.tooltip('hide')
		.attr("data-original-title", Sanscript.t(transInput.val(), $("#trans-from").val(), "devanagari"))
		.tooltip('show');
}


function initTransliteration(){
	$(".trans-input").focus(function(){
		transInput = $(this);
		
		if ($("#search-utils-trans-preview").bootstrapSwitch('state')){
			transliteration();
			
			transInput.on("change keyup paste", function() {
				transliteration();
			});
		}
	});
	
	$(".trans-input").focusout(function(){
		$(this).unbind("change keyup paste");
		transInput
			.tooltip('dispose')
			.attr("data-original-title", "");
		transInput = null;
	});
}



