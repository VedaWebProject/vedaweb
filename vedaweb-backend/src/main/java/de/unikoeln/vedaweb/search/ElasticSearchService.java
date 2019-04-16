package de.unikoeln.vedaweb.search;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ElasticSearchService {

	@Autowired
	private ElasticService elastic;
	
	
	public SearchResponse search(SearchData searchData){
		//searchData.cleanAndFormatFields();
		
		switch (searchData.getMode()){
		case "smart":
			return submitSearch(SearchRequestBuilder.buildSmartQuery(searchData));
		case "grammar":
			return submitSearch(SearchRequestBuilder.buildGrammarQuery(searchData));
		default: return null;
		}
	}
	
	
	public String aggregateGrammarField(String field){
		SearchRequest searchRequest = SearchRequestBuilder.buildAggregationFor(field);
		SearchResponse searchResponse = submitSearch(searchRequest);
		return searchResponse.toString();
	}
	
	
	private SearchResponse submitSearch(SearchRequest searchRequest){
		//System.out.println(searchRequest.source().toString());
		try {
			return elastic.client().search(searchRequest);
		} catch (Exception e) {
			System.err.println("[ERROR] in ElasticSearchService:submitSearch() [MALFORMED QUERY?]");
			//e.printStackTrace();
		}
		return null;
	}
	
	
}
