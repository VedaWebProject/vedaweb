package de.unikoeln.vedaweb.search;

import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;

public class QueryBuilder {
	
	
	public static SearchRequest build(SearchFormData formData){
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
	
	
	private static void addScopeQueries(BoolQueryBuilder rootQuery, SearchFormData formData){
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
	
	
	private static void addBlockQueries(BoolQueryBuilder rootQuery, SearchFormData formData){
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
	

}
