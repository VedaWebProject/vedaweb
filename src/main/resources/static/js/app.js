


$( document ).ready(function() {
	
	//init
	keyoskInit($("#search-utils-osk")); //init keyosk OSK
	initToggleSwitches(); 				//setup toggle switch options and defaults
	initTransliteration();				//init transliteration preview functionality
	initSearchForm();					//init search form block functionality
	
	//initially load start page
	//req("/start", null);
	req("/verse?id=5a097fa933d6e732ace8e29c", null);
	
});