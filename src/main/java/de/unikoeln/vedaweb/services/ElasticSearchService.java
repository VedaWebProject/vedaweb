package de.unikoeln.vedaweb.services;

import java.io.IOException;
import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.NestedQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchResult;
import de.unikoeln.vedaweb.search.SearchResults;
import de.unikoeln.vedaweb.search.VWSearchRequest;

@Service
public class ElasticSearchService {

	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private ElasticService elastic;
	
	
	public SearchResults search(Map<String, String> params){
		return search(generateSearchRequest(params));
	}
	
	
	public SearchResults search(VWSearchRequest req){
		req.cleanAndFormatFields();
		System.out.println(req);
		
		SearchRequest searchRequest = buildSearchRequest(req);
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
	
	
	private SearchRequest buildSearchRequest(VWSearchRequest req){
		SearchRequest searchRequest = new SearchRequest("vedaweb"); 
		searchRequest.types("doc");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); 
		
		//parent bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		for (Map<String, Object> block : req.getBlocks()){
			bool.must(buildQueryForSearchBlock(block));
		}
		
		searchSourceBuilder.query(bool);
		System.out.println("\n\n" + searchSourceBuilder.toString() + "\n\n");
		searchRequest.source(searchSourceBuilder);
			
		return searchRequest;
	}
	
	
	private NestedQueryBuilder buildQueryForSearchBlock(Map<String, Object> block){
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		for (String key : block.keySet()){
			bool.must(QueryBuilders.matchQuery("tokens." + key, block.get(key)));
		}
		
		return QueryBuilders.nestedQuery("tokens", bool, ScoreMode.Avg);
	}
	
	
	private VWSearchRequest generateSearchRequest(Map<String, String> params) {
		VWSearchRequest sr = new VWSearchRequest();
		
		for (String key : params.keySet()){
			if (params.get(key).length() == 0){
				continue;
			} else if (params.get(key).equals("book") && params.get(key).matches("\\d+")){
				sr.setBook(Integer.parseInt(params.get(key)));
			} else if (params.get(key).equals("hymn") && params.get(key).matches("\\d+")){
				sr.setHymn(Integer.parseInt(params.get(key)));
			}
		}
		
		return sr;
	}
	
	
	private SearchResults buildSearchResults(SearchResponse response){
		SearchResults results = new SearchResults();
		for (SearchHit hit : response.getHits()){
			results.add(new SearchResult(hit.getScore(), hit.getId(), verseRepo.findById(hit.getId())));
		}
		return results;
	}
	
	
}
