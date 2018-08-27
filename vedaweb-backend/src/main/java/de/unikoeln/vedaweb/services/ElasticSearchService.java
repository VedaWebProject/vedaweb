package de.unikoeln.vedaweb.services;

import java.io.IOException;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.search.SearchData;
import de.unikoeln.vedaweb.search.SearchRequestBuilder;
import de.unikoeln.vedaweb.util.StringUtils;

@Service
public class ElasticSearchService {

	@Autowired
	private ElasticService elastic;
	
	
	public SearchResponse search(SearchData searchData){
		searchData.cleanAndFormatFields();
		
		switch (searchData.getMode()){
		case "smart":
			return searchSmart(searchData);
		case "grammar":
			return searchGrammar(searchData);
		default: return null;
		}
	}
	
	
	private SearchResponse searchSmart(SearchData searchData){
		SearchRequest searchRequest = SearchRequestBuilder.buildSmartQuery(searchData);
		return submitSearch(searchRequest);
	}
	
	
	private SearchResponse searchGrammar(SearchData searchData){
		SearchRequest searchRequest = SearchRequestBuilder.buildGrammarQuery(searchData);
		return submitSearch(searchRequest);
	}
	
	
	public String aggregateGrammarField(String field){
		SearchRequest searchRequest = SearchRequestBuilder.buildAggregationFor(field);
		SearchResponse searchResponse = submitSearch(searchRequest);
		return searchResponse.toString();
	}
	
	
//	private SearchResults buildSearchResults(SearchResponse response){
//		SearchResults results = new SearchResults();
//		for (SearchHit hit : response.getHits()){
//			results.add(
//				new SearchResult(
//					hit.getScore(),
//					hit.getId(),
//					hit.getFields()));
//		}
//		return results;
//	}
	
	
	private SearchResponse submitSearch(SearchRequest searchRequest){
		try {
			return elastic.client().search(searchRequest);
		} catch (IOException e) {
			System.err.println("[ERROR] Search request error");
			e.printStackTrace();
		}
		return null;
	}
	
	
}
