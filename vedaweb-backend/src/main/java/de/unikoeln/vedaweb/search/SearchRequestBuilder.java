package de.unikoeln.vedaweb.search;

import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.common.Strings;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.InnerHitBuilder;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;

import de.unikoeln.vedaweb.util.StringUtils;


public class SearchRequestBuilder {
	
	private static final FetchSourceContext FETCH_SOURCE_CONTEXT = new FetchSourceContext(
			true,
			new String[]{"book", "hymn", "verse", "hymnAddressee", "hymnGroup", "strata"},
			Strings.EMPTY_ARRAY);
	
	private static final FetchSourceContext FETCH_SOURCE_CONTEXT_GRAMMAR = new FetchSourceContext(
			true,
			new String[]{"book", "hymn", "form_raw", "verse", "hymnAddressee", "hymnGroup", "strata", "tokens"},
			Strings.EMPTY_ARRAY);
	
	private static final String[] HIGHLIGHT_SMART = {"versions.form", "versions.form_raw"};
	
	
//	public static SearchRequest buildSmartQuery(SearchData searchData){
//		if (searchData.getField().equals("translation")) {
//			return buildTranslationQuery(searchData);
//		}
//		SearchSourceBuilder source = getCommonSearchSource(searchData);
//		
//		String searchTerm = StringUtils.normalizeNFC(searchData.getInput());
//		String field = searchData.getField();
//		String lemmataField = "lemmata";
//		
//		if (StringUtils.containsAccents(searchTerm)) {
//			field += "_raw";
//			lemmataField += "_raw";
//		}
//		
//		//query string query (using lucene query language)
//		source.query(
//			QueryBuilders.queryStringQuery(searchTerm)
//				.field(field, 1.2f)
//				.field(lemmataField)
//		);
//
//		//Highlighting
//		source.highlighter(getHighlighting(HIGHLIGHT_SMART));
//		//set _source fields
//		source.fetchSource(FETCH_SOURCE_CONTEXT);
//		
//		return getCommonSearchRequest().source(source);
//	}
	
	
	public static SearchRequest buildSmartQuery(SearchData searchData) {
		SearchSourceBuilder source = getCommonSearchSource(searchData);
		
		String searchTerm = StringUtils.normalizeNFC(
				searchData.isAccents() ? searchData.getInput()
						: StringUtils.removeVowelAccents(searchData.getInput()));
		String searchField = "versions.form" + (searchData.isAccents() ? "_raw" : "");
			
		source.query(
			QueryBuilders.nestedQuery(
				"versions",
				QueryBuilders.boolQuery()
					.must(QueryBuilders.matchQuery("versions.id", searchData.getField()))
					.must(QueryBuilders.queryStringQuery(searchTerm).field(searchField)),
				ScoreMode.Max
			).innerHit(
				new InnerHitBuilder()
					.setHighlightBuilder(getHighlighting(HIGHLIGHT_SMART)))
		);
		
		//set _source fields
		source.fetchSource(FETCH_SOURCE_CONTEXT);
		
		System.out.println(source);
		
		return getCommonSearchRequest().source(source);
	}
	
	
	public static SearchRequest buildGrammarQuery(SearchData searchData){
		SearchRequest req = getCommonSearchRequest();
		SearchSourceBuilder source = getCommonSearchSource(searchData);
		
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add search block queries
		addGrammarBlockQueries(bool, searchData);
		
		//add search scope queries
		if (searchData.getScopes().size() > 0)
			bool.must(getSearchScopesQuery(searchData));
		
		//add search meta queries
		if (searchData.getMeta().size() > 0)
			bool.must(getSearchMetaQuery(searchData));
		
		return req.source(source.query(bool).fetchSource(FETCH_SOURCE_CONTEXT_GRAMMAR));
	}
	
	
	private static BoolQueryBuilder getSearchMetaQuery(SearchData searchData) {
		BoolQueryBuilder metasQuery = QueryBuilders.boolQuery();
		for (String meta : searchData.getMeta().keySet()) {
			if (searchData.getMeta().get(meta).length == 0) continue;
			BoolQueryBuilder metaQuery = QueryBuilders.boolQuery();
			for (String value : searchData.getMeta().get(meta)) {
				metaQuery.should(QueryBuilders.termQuery(meta, value));
			}
			//add to root meta query
			metasQuery.should(metaQuery);
		}
		return metasQuery;
	}
	
	
	private static void addGrammarBlockQueries(BoolQueryBuilder rootQuery, SearchData searchData){
		//iterate search blocks
		for (Map<String, Object> block : searchData.getBlocks()){
			//construct bool query for each block
			BoolQueryBuilder bool = QueryBuilders.boolQuery();
			
			//remove empty fields
			block.values().stream().filter(v -> v != null && v.toString().length() > 0);
			
			//trim values
			block.values().forEach(v -> v = v.toString().trim());
			
			//add queries for block data
			for (String key : block.keySet()){
				
				//unimplemented
				if (key.equalsIgnoreCase("distance"))
					continue; //TEMP DEV
				
				//if fields="form", also search in "lemma"-field
				if (key.equals("form")) {
					bool.must(getMultiFieldBoolQuery(
							StringUtils.removeVowelAccents((String)block.get(key)),
							false,
							"tokens.form",
							"tokens.lemma"
					));
				} else {
					//...otherwise, add a simple term query
					bool.must(QueryBuilders.termQuery("tokens.grammar." + key, block.get(key)));
				}
			}
			
			//wrap in nested query, add to root query
			rootQuery.must(QueryBuilders.nestedQuery("tokens", bool, ScoreMode.Max));
		}
	}
	
	
	private static BoolQueryBuilder getMultiFieldBoolQuery(String query, boolean must, String ... fields) {
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//TODO: fuzzy or nah?
		for (String field : fields) {
			if (must) {
				bool.must(QueryBuilders.matchQuery(field, query));
			} else {
				bool.should(QueryBuilders.matchQuery(field, query));
			}
		}
		
		return bool;
	}
	
	
	private static HighlightBuilder getHighlighting(String... fields){
		HighlightBuilder highlightBuilder = new HighlightBuilder(); 
		
		for (String field : fields){
			HighlightBuilder.Field highlightField =
			        new HighlightBuilder.Field(field); 
			highlightField.highlighterType("unified");  
			highlightBuilder.field(highlightField);
		}
		
		//disable highlight fragmentation
		highlightBuilder.numOfFragments(0);
		  
		return(highlightBuilder);
	}
	
	
	private static BoolQueryBuilder getSearchScopesQuery(SearchData searchData) {
		BoolQueryBuilder scopesQuery = QueryBuilders.boolQuery();
		for (SearchScope scope : searchData.getScopes()) {
			BoolQueryBuilder scopeQuery = QueryBuilders.boolQuery();
			//construct and add query for book range
			if (scope.getFromBook() > 0 || scope.getToBook() > 0) {
				RangeQueryBuilder bookRange = QueryBuilders.rangeQuery("book");
				if (scope.getFromBook() > 0)
					bookRange.gte(scope.getFromBook());
				if (scope.getToBook() > 0)
					bookRange.lte(scope.getToBook());
				scopeQuery.must(bookRange);
			}
			//construct and add query for hymn range
			if (scope.getFromHymn() > 0 || scope.getToHymn() > 0) {
				RangeQueryBuilder hymnRange = QueryBuilders.rangeQuery("hymn");
				if (scope.getFromHymn() > 0)
					hymnRange.gte(scope.getFromHymn());
				if (scope.getToHymn() > 0)
					hymnRange.lte(scope.getToHymn());
				scopeQuery.must(hymnRange);
			}
			//add to root scopes query
			scopesQuery.should(scopeQuery);
		}
		return scopesQuery;
	}
	
	
	public static SearchRequest buildAggregationFor(String grammarField){
		SearchRequest req = getCommonSearchRequest();
		SearchSourceBuilder source = new SearchSourceBuilder(); 
		
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
		
		source.query(match);
		source.aggregation(nestedAgg);
		source.size(0);
		//System.out.println("\n\n" + searchSourceBuilder.toString() + "\n\n");
		req.source(source);
		return req;
	}
	
	
	private static SearchRequest getCommonSearchRequest() {
		return new SearchRequest("vedaweb").types("doc");
	}
	
	
	private static SearchSourceBuilder getCommonSearchSource(SearchData searchData) {
		return new SearchSourceBuilder()
			.from(searchData.getFrom() >= 0 ? searchData.getFrom() : 0)
			.size(searchData.getSize() >= 0 ? searchData.getSize() : 0);
	}
	
	
}
