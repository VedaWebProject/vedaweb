package de.unikoeln.vedaweb.search;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.search.grammar.GrammarSearchData;
import de.unikoeln.vedaweb.search.quick.QuickSearchData;

@Service
public class ElasticSearchService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ElasticService elastic;
	
	
	public SearchResponse search(AbstractSearchData searchData){
		if (searchData instanceof QuickSearchData) {
			return submitSearch(SearchRequestBuilder.buildQuickQuery((QuickSearchData)searchData));
		} else if (searchData instanceof GrammarSearchData) {
			return submitSearch(SearchRequestBuilder.buildGrammarQuery((GrammarSearchData)searchData));
		} else {
			return null;
		}
	}
	
	
	public SearchResponse searchQuick(QuickSearchData searchData){
		return submitSearch(SearchRequestBuilder.buildQuickQuery(searchData));
	}
	
	
	public SearchResponse searchOcc(GrammarSearchData searchData){
		return submitSearch(SearchRequestBuilder.buildOccurrencesQuery(searchData));
	}
	
	
	public String aggregateGrammarField(String field){
		SearchRequest searchRequest = SearchRequestBuilder.buildAggregationFor(field);
		SearchResponse searchResponse = submitSearch(searchRequest);
		return searchResponse.toString();
	}
	
	
	private SearchResponse submitSearch(SearchRequest searchRequest){
		try {
			return elastic.client().search(searchRequest);
		} catch (Exception e) {
			log.debug("Malformed query in submitSearch() ?");
		}
		return null;
	}
	
	
}
