


$( document ).ready(function() {
	
	//TEMP DEV
	
//	$( "#form-search" ).on( "submit", function( event ) {
//	  event.preventDefault();
//	  var formData = JSON.stringify($(this).serializeJSON());
//	  var formData64 = $.base64.encode(formData);
//	  console.log(formData64);
//	  window.location.href = "/search?req=" + formData64;
//	});
	
//	$( "#form-search" ).on( "submit", function( event ) {
//	  event.preventDefault();
//	  
//	  console.log(JSON.stringify($(this).serializeJSON()));
//		
//		$.post("search",
//				$(this).serializeJSON(),
//			    function(data, status){
//			        alert("Data: " + data + "\nStatus: " + status);
//			    }
//		);
//	});
	
	//set toggle switch options
	$.fn.bootstrapSwitch.defaults.state = 'false';
	$.fn.bootstrapSwitch.defaults.size = 'mini';
	$.fn.bootstrapSwitch.defaults.onColor = 'success';
	$.fn.bootstrapSwitch.defaults.onText = '&check;';
	$.fn.bootstrapSwitch.defaults.offText = '&Cross;';
	$.fn.bootstrapSwitch.defaults.labelText = '';
	$.fn.bootstrapSwitch.defaults.labelWidth = '1';
	
	//init keyosk OSK
	keyoskInit($("#search-utils-osk"));

	//init toggle switches
	$("#search-utils-osk").bootstrapSwitch();
	$("#search-utils-osk").on('switchChange.bootstrapSwitch', function(event, state) {
		keyoskDisplay(state);
	});
	
	$("#search-utils-trans-preview").bootstrapSwitch();
	$("#search-utils-trans-preview").on('switchChange.bootstrapSwitch', function(event, state) {
		//TODO
	});
	
	$("#form-filters [type='checkbox']").each(function(){
		$(this).bootstrapSwitch();
		$(this).on('switchChange.bootstrapSwitch', function(event, state) {
			//TODO
		});
	});
	

	//add extra term functionality
//	function renameInputs(block, index){
//		block.find("input, select").each(function(){
//			$(this).attr("name", $(this).attr("name").replace(/[0-9]/g, index));
//		});
//	}
	
	$(".btn-add-token-plus").click(function(){
		if ($("#form-search .token-class").length < 4){
			$(this).parent().before($("#form-search .token-class").last().clone().hide().fadeIn());
		}
		if ($("#form-search .token-class").length >= 4){
			$(this).hide();
		}
		if ($("#form-search .token-class").length > 1){
			$(".btn-add-token-minus").show();
		}
//		renameInputs($("#form-search .token-class").last(), $("#form-search .token-class").last().index());

		//update
		keyoskUpdate();
		transliterationInit();
	});
	$(".btn-add-token-minus").hide();
	$(".btn-add-token-minus").click(function(){
		if ($("#form-search .token-class").length <= 2){
			$(this).hide();
		}
		if ($("#form-search .token-class").length > 1){
			$("#form-search .token-class").last().fadeOut(function(){
				$(this).remove();
				if ($("#form-search .token-class").length < 4){
					$(".btn-add-token-plus").show();
				}
			});
		}
		
		//update
		keyoskUpdate();
		transliterationInit();
	});
	
	
	////TRANSLITERATION PREVIEW
	var transInput;
	
	function transliteration(){
		$("#trans-popup").text(Sanscript.t(transInput.val(), $("#trans-from").val(), "devanagari"));
	}
	
	function transliterationInit(){
		$(".trans-input").focus(function(){
			transInput = $(this);
			if ($("#search-utils-trans-preview").bootstrapSwitch('state')){
				transInput.after("<span id='trans-popup'>...</span>");
				$("#trans-popup").parent().css("position", "relative");
				transliteration();
				
				transInput.on("change keyup paste", function() {
					transliteration();
				});
			}
		});
		
		$(".trans-input").focusout(function(){
			$("#trans-popup").parent().css("position", "static");
			$("#trans-popup").remove();
			$(this).unbind("change keyup paste");
		});
	}
	
	transliterationInit();

});