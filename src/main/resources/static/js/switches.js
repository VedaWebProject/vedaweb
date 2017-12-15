//variables
var previewToggleState;

function initToggleSwitches(){
	
	//options and defaults
	$.fn.bootstrapSwitch.defaults.state = 'false';
	$.fn.bootstrapSwitch.defaults.size = 'mini';
	$.fn.bootstrapSwitch.defaults.onColor = 'success';
	$.fn.bootstrapSwitch.defaults.onText = '&check;';
	$.fn.bootstrapSwitch.defaults.offText = '&Cross;';
	$.fn.bootstrapSwitch.defaults.labelText = '';
	$.fn.bootstrapSwitch.defaults.labelWidth = '1';
	
	
	//onscreen keyboard toggle
	$("#search-utils-osk").bootstrapSwitch();
	$("#search-utils-osk").on('switchChange.bootstrapSwitch', function(event, state) {
		keyoskDisplay(state);
		
		//force input method and disable preview
		if (state){
			previewToggleState = $("#search-utils-trans-preview").bootstrapSwitch('state');
			$("#trans-from").val("devanagari");
			$("#trans-from").prop('disabled', 'disabled');
			$("#search-utils-trans-preview").bootstrapSwitch('state', false);
		} else {
			$("#trans-from").prop('disabled', false);
			$("#search-utils-trans-preview").bootstrapSwitch('state', previewToggleState);
		}
	});
	
	
	//transliteration preview toggle
	$("#search-utils-trans-preview").bootstrapSwitch();
//	$("#search-utils-trans-preview").on('switchChange.bootstrapSwitch', function(event, state) {
//		//TODO
//	});
	
	
	//sidebar filter toggles
	$("#form-filters [type='checkbox']").each(function(){
		$(this).bootstrapSwitch();
		var toggled = $(this);
		$(this).on('switchChange.bootstrapSwitch', function(event, state) {
			if (state){
				$("." + toggled.attr("data-target")).fadeIn();
			} else {
				$("." + toggled.attr("data-target")).fadeOut();
			}
		});
	});
	
}
