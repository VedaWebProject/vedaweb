package de.unikoeln.vedaweb.search;

import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.List;
import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.common.Strings;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;


public class SearchRequestBuilder {
	
	public static final String AGGREGATE_GRAMMAR_FIELDS = "grammar_fields";
	
	public static final FetchSourceContext FETCH_SOURCE_CONTEXT =
			new FetchSourceContext(true, new String[]{"book", "hymn", "verse"}, Strings.EMPTY_ARRAY);
	
	
	
	public static SearchRequest buildSmart(String query){
		SearchRequest searchRequest = new SearchRequest("vedaweb"); 
		searchRequest.types("doc");
		
		//TODO scrolling!
		//searchRequest.scroll(TimeValue.timeValueMinutes(1L));
		
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); 
		
		//bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		bool.should(new MatchQueryBuilder(containsAccents(query) ? "form_raw" : "form", query));
		searchSourceBuilder.query(bool);
		
		//Highlighting
		addHighlighting(searchSourceBuilder, "form", "form_raw", "translation");
		
		searchSourceBuilder.size(10);
		searchSourceBuilder.fetchSource(FETCH_SOURCE_CONTEXT);
		searchRequest.source(searchSourceBuilder);
		return searchRequest;
	}
	
	
	public static SearchRequest buildGrammar(SearchData formData){
		SearchRequest searchRequest = new SearchRequest("vedaweb"); 
		searchRequest.types("doc");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); 
		
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add search block queries
		addBlockQueries(bool, formData);
		
		//add search scope queries
		addScopeQueries(bool, formData.getScopes());
		
		searchSourceBuilder.query(bool);
		searchSourceBuilder.fetchSource(FETCH_SOURCE_CONTEXT);

		//System.out.println("\n\n" + searchSourceBuilder.toString() + "\n\n");
		searchRequest.source(searchSourceBuilder);
			
		return searchRequest;
	}
	
	
	public static SearchRequest buildAggregationFor(String grammarField){
		SearchRequest searchRequest = new SearchRequest("vedaweb"); 
		searchRequest.types("doc");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); 
		
		//match all
		MatchAllQueryBuilder match = QueryBuilders.matchAllQuery();
		
		//aggregation request
		TermsAggregationBuilder terms
			= AggregationBuilders.terms("agg")
				.field("tokens." + grammarField)
				.size(100);
		NestedAggregationBuilder nestedAgg
			= AggregationBuilders.nested("tokens", "tokens")
				.subAggregation(terms);
		
		searchSourceBuilder.query(match);
		searchSourceBuilder.aggregation(nestedAgg);
		searchSourceBuilder.size(0);
		//System.out.println("\n\n" + searchSourceBuilder.toString() + "\n\n");
		searchRequest.source(searchSourceBuilder);
		return searchRequest;
	}
	
	
	private static void addScopeQueries(BoolQueryBuilder rootQuery, List<SearchScope> scopes){
		
		//TODO temp: only one range!
		SearchScope scope = null;
		if (scopes.size() > 0)
			scope = scopes.get(0);
		else
			return;
		
		
		//construct book scope query
		RangeQueryBuilder bookRange = QueryBuilders.rangeQuery("book");
		if (scope.fromBook > 0) bookRange.gte(scope.fromBook);
		if (scope.toBook > 0) bookRange.lte(scope.toBook);
		rootQuery.must(bookRange);
		
		//construct book scope query
		RangeQueryBuilder hymnRange = QueryBuilders.rangeQuery("hymn");
		if (scope.fromHymn > 0) hymnRange.gte(scope.fromHymn);
		if (scope.toHymn > 0) hymnRange.lte(scope.toHymn);
		rootQuery.must(hymnRange);
	}
	
	
	private static void addBlockQueries(BoolQueryBuilder rootQuery, SearchData formData){
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
	
	
	private static void addHighlighting(SearchSourceBuilder searchSourceBuilder, String... fields){
		HighlightBuilder highlightBuilder = new HighlightBuilder(); 
		
		for (String field : fields){
			HighlightBuilder.Field highlightField =
			        new HighlightBuilder.Field(field); 
			highlightField.highlighterType("unified");  
			highlightBuilder.field(highlightField);
		}
		  
		searchSourceBuilder.highlighter(highlightBuilder);
	}
	
	
	public static boolean containsAccents(String text) {
	    return text == null ? false :
	        Normalizer.normalize(text, Form.NFD)
	            .matches(".*\\u0301.*");
	}
	

}
