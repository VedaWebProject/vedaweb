package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.NestedQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchResult;
import de.unikoeln.vedaweb.search.SearchResults;
import de.unikoeln.vedaweb.search.SeachFormData;

@Service
public class ElasticSearchService {

	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private ElasticService elastic;
	
	
//	public SearchResults search(Map<String, String> params){
//		return search(generateSearchRequest(params));
//	}
	
	
	public SearchResults search(SeachFormData formData){
		formData.cleanAndFormatFields();
		System.out.println(formData);
		
		SearchRequest searchRequest = buildSearchRequest(formData);
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
	
	
	private SearchRequest buildSearchRequest(SeachFormData formData){
		SearchRequest searchRequest = new SearchRequest("vedaweb"); 
		searchRequest.types("doc");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); 
		
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add search block queries
		addBlockQueries(bool, formData);
		
		//add search scope queries
		addScopeQueries(bool, formData);
		
		searchSourceBuilder.query(bool);
		System.out.println("\n\n" + searchSourceBuilder.toString() + "\n\n");
		searchRequest.source(searchSourceBuilder);
			
		return searchRequest;
	}
	
	
	private void addScopeQueries(BoolQueryBuilder rootQuery, SeachFormData formData){
		//check if book scope is set
		if (formData.getScopeBook() < 1) return;
		
		//construct book scope query
		RangeQueryBuilder bookRange = QueryBuilders.rangeQuery("book_nr");
		bookRange.gte(formData.getScopeBook());
		bookRange.lte(formData.getScopeBook());
		rootQuery.must(bookRange);
		
		//check if hymn scope is set
		if (formData.getScopeHymn() < 1) return;
		
		//construct book scope query
		RangeQueryBuilder hymnRange = QueryBuilders.rangeQuery("hymn_nr");
		hymnRange.gte(formData.getScopeHymn());
		hymnRange.lte(formData.getScopeHymn());
		rootQuery.must(hymnRange);
	}
	
	
	private void addBlockQueries(BoolQueryBuilder rootQuery, SeachFormData formData){
		//iterate search blocks
		for (Map<String, Object> block : formData.getBlocks()){
			//construct bool query for each block
			BoolQueryBuilder bool = QueryBuilders.boolQuery();
			for (String key : block.keySet()){
				bool.must(QueryBuilders.matchQuery("tokens." + key, block.get(key)));
			}
			//wrap in nested query, add to root query
			rootQuery.must(QueryBuilders.nestedQuery("tokens", bool, ScoreMode.Avg));
		}
	}
	
	
//	private SeachFormData generateSearchRequest(Map<String, String> params) {
//		SeachFormData sr = new SeachFormData();
//		
//		for (String key : params.keySet()){
//			if (params.get(key).length() == 0){
//				continue;
//			} else if (params.get(key).equals("book") && params.get(key).matches("\\d+")){
//				sr.setBook(Integer.parseInt(params.get(key)));
//			} else if (params.get(key).equals("hymn") && params.get(key).matches("\\d+")){
//				sr.setHymn(Integer.parseInt(params.get(key)));
//			}
//		}
//		
//		return sr;
//	}
	
	
	private SearchResults buildSearchResults(SearchResponse response){
		SearchResults results = new SearchResults();
		for (SearchHit hit : response.getHits()){
			results.add(new SearchResult(hit.getScore(), hit.getId(), verseRepo.findById(hit.getId())));
		}
		return results;
	}
	
	
}
