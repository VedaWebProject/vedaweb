
function initSearchForm(){

	//add extra term functionality
	
	$(".btn-add-token-plus").click(function(){
		var blockCount = $("#form-search .token-class").length;
		
		if (blockCount < 4){
			var newBlock = $("#form-search .token-class").last().clone();
			$(this).parent().before(newBlock.hide().fadeIn());
			
//			$.each(newBlock.find("input, select"), function(){
//				$(this).attr("name", $(this).attr("name").replace("/\d/", blockCount));
//			});
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
	
	//search form submit
	$("#form-search").submit(function(event) {
		// Stop form from submitting normally
		event.preventDefault();

		// Get some values from elements on the page:
		var $form = $(this);
		var params = JSON.stringify($form.serializeJSON());
		var url = $form.attr( "action" );
		
		//DEV
		console.log(params);

		//send request, load response into content area,
		//add click handlers to search results
		req(url, params, function(){
			$(".search-result-link").click(function(){
				req($(this).attr("data-url"), null);
			});
		});	//request.js
	});
	
}