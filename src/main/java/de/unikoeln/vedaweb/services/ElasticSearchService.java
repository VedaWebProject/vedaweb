package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchResult;
import de.unikoeln.vedaweb.search.SearchResults;
import de.unikoeln.vedaweb.search.SearchRequestBuilder;
import de.unikoeln.vedaweb.search.SearchFormData;

@Service
public class ElasticSearchService {

	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private ElasticService elastic;
	
	
	public SearchResults search(SearchFormData formData){
		formData.cleanAndFormatFields();
		System.out.println(formData);
		
		SearchRequest searchRequest = SearchRequestBuilder.build(formData);
		SearchResponse searchResponse = null;
		
		try {
			searchResponse = elastic.client().search(searchRequest);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		System.out.println(searchResponse);
		SearchResults searchResults = buildSearchResults(searchResponse);
		
		return searchResults;
	}
	
	
	private SearchResults buildSearchResults(SearchResponse response){
		SearchResults results = new SearchResults();
		for (SearchHit hit : response.getHits()){
			results.add(new SearchResult(hit.getScore(), hit.getId(), verseRepo.findById(hit.getId())));
		}
		return results;
	}
	
	
}
