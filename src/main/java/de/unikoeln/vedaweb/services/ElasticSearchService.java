package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.Optional;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchDataAdvanced;
import de.unikoeln.vedaweb.search.SearchRequestBuilder;
import de.unikoeln.vedaweb.search.SearchResult;
import de.unikoeln.vedaweb.search.SearchResults;

@Service
public class ElasticSearchService {

	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private ElasticService elastic;
	
	
	public SearchResponse smartSearch(String query){
		query = ElasticIndexService.normalizeForIndex(query);
		SearchRequest searchRequest = SearchRequestBuilder.buildSmart(query);
		SearchResponse searchResponse = search(searchRequest);
		System.out.println(searchResponse);
		return searchResponse;
//		System.out.println(searchResponse);
//		SearchResults searchResults = buildSearchResults(searchResponse);
//		return searchResults;
	}
	
	
	public SearchResults search(SearchDataAdvanced formData){
		formData.cleanAndFormatFields();
//		System.out.println(formData);
		
		SearchRequest searchRequest = SearchRequestBuilder.buildAdvanced(formData);
		SearchResponse searchResponse = search(searchRequest);
//		System.out.println(searchResponse);
		SearchResults searchResults = buildSearchResults(searchResponse);
		
		return searchResults;
	}
	
	
	public String aggregateGrammarField(String field){
		SearchRequest searchRequest = SearchRequestBuilder.buildAggregationFor(field);
		SearchResponse searchResponse = search(searchRequest);
		return searchResponse.toString();
	}
	
	
	private SearchResults buildSearchResults(SearchResponse response){
		SearchResults results = new SearchResults();
		for (SearchHit hit : response.getHits()){
			results.add(
				new SearchResult(
					hit.getScore(),
					hit.getId(),
					hit.getFields()));
		}
		return results;
	}
	
	
	private SearchResponse search(SearchRequest searchRequest){
		try {
			return elastic.client().search(searchRequest);
		} catch (IOException e) {
			System.err.println("[ERROR] Search request error");
			e.printStackTrace();
		}
		return null;
	}
	
	
}
