


$( document ).ready(function() {
	
	//TEMP DEV
	$( "form" ).on( "submit", function( event ) {
	  event.preventDefault();
	  
	  var formData = JSON.stringify($(this).serializeJSON());
	  
	  $.ajax({
		  type: "POST",
		  url: "/search",
		  data: formData,
		  success: function(){},
		  dataType: "json",
		  contentType : "application/json"
		});
	});

	//init keyosk OSK
	keyoskInit();

	//set toggle switch options
	$.fn.bootstrapSwitch.defaults.state = 'false';
	$.fn.bootstrapSwitch.defaults.size = 'mini';
	$.fn.bootstrapSwitch.defaults.onColor = 'success';
	$.fn.bootstrapSwitch.defaults.onText = '&check;';
	$.fn.bootstrapSwitch.defaults.offText = '&Cross;';
	$.fn.bootstrapSwitch.defaults.labelText = '';
	$.fn.bootstrapSwitch.defaults.labelWidth = '1';

	//init toggle switches
	$("#form-filters [type='checkbox']").each(function(){
		var ts = $(this);
		ts.bootstrapSwitch();
		$(this).on('switchChange.bootstrapSwitch', function(event, state) {
			console.log(this); // DOM element
			console.log(event); // jQuery event
			console.log(state); // true | false
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
		//renameInputs($("#form-search .token-class").last(), $("#form-search .token-class").last().index());
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
	});

});