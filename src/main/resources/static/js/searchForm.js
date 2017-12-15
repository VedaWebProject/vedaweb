
function initSearchForm(){

	//add extra term functionality
	
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
	
		//update js
		keyoskUpdate();
		initTransliteration();
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
		initTransliteration();
	});
	
}