package de.unikoeln.vedaweb.search;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ElasticSearchService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ElasticService elastic;
	
	
	public SearchResponse search(SearchData searchData){
		switch (searchData.getMode()){
		case "quick":
			return submitSearch(SearchRequestBuilder.buildQuickQuery(searchData));
		case "grammar":
			return submitSearch(SearchRequestBuilder.buildGrammarQuery(searchData));
		default:
			return null;
		}
	}
	
	
	public SearchResponse searchOcc(SearchData searchData){
		return submitSearch(SearchRequestBuilder.buildOccurrencesQuery(searchData));
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
			log.debug("Malformed query in submitSearch() ?");
		}
		return null;
	}
	
	
}
