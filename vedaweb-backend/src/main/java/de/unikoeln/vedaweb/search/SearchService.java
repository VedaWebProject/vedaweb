package de.unikoeln.vedaweb.search;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.search.grammar.GrammarAggregationsBuilder;
import de.unikoeln.vedaweb.search.grammar.GrammarSearchData;
import de.unikoeln.vedaweb.search.grammar.GrammarSearchRequestBuilder;
import de.unikoeln.vedaweb.search.metrical.MetricalSearchData;
import de.unikoeln.vedaweb.search.metrical.MetricalSearchRequestBuilder;
import de.unikoeln.vedaweb.search.quick.QuickSearchData;
import de.unikoeln.vedaweb.search.quick.QuickSearchRequestBuilder;

@Service
public class SearchService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ElasticService elastic;
	
	
	public SearchResponse search(CommonSearchData searchData){
		if (searchData instanceof QuickSearchData) {
			return submitSearch(
					QuickSearchRequestBuilder.buildSearchRequest(
							(QuickSearchData)searchData));
		} else if (searchData instanceof GrammarSearchData) {
			return submitSearch(
					GrammarSearchRequestBuilder.buildSearchRequest(
							(GrammarSearchData)searchData));
		} else if (searchData instanceof MetricalSearchData) {
			return submitSearch(
					MetricalSearchRequestBuilder.buildSearchRequest(
							(MetricalSearchData)searchData));
		} else {
			return null;
		}
	}
	
	
	public SearchResponse searchOcc(GrammarSearchData searchData){
		return submitSearch(
				GrammarSearchRequestBuilder
					.buildGrammarOccurrencesRequest(searchData));
	}
	
	
	public String aggregateGrammarField(String field){
		SearchRequest searchRequest = GrammarAggregationsBuilder.buildGrammarAggregationsRequest(field, "vedaweb");
		SearchResponse searchResponse = submitSearch(searchRequest);
		return searchResponse.toString();
	}
	
	
	private SearchResponse submitSearch(SearchRequest searchRequest){
		try {
			return elastic.client().search(searchRequest, RequestOptions.DEFAULT);
		} catch (Exception e) {
			log.debug("Malformed query in submitSearch() ?");
		}
		return null;
	}
	
	
}
