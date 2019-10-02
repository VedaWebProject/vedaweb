package de.unikoeln.vedaweb.search;

import java.util.Map;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.common.Strings;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.InnerHitBuilder;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.NestedQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.sort.SortOrder;

import de.unikoeln.vedaweb.search.grammar.GrammarSearchData;
import de.unikoeln.vedaweb.search.metrical.MetricalSearchData;
import de.unikoeln.vedaweb.search.quick.QuickSearchData;
import de.unikoeln.vedaweb.util.StringUtils;


public class SearchRequestBuilder {
	
	private static final FetchSourceContext FETCH_SOURCE_CONTEXT = new FetchSourceContext(
			true,
			new String[]{"book", "hymn", "stanza", "hymnAddressee", "hymnGroup", "strata"},
			Strings.EMPTY_ARRAY);
	
	private static final String[] HIGHLIGHT_SMART = {"versions.form*"};
//	private static final String[] HIGHLIGHT_GRAMMAR = {"tokens.form*", "tokens.lemma*", "tokens.grammar.*"};
	
	
	public static SearchRequest buildQuickQuery(QuickSearchData searchData) {
		String searchTerm = StringUtils.normalizeNFC(
				searchData.isAccents() ? searchData.getInput()
						: StringUtils.removeVowelAccents(searchData.getInput()));
		String searchField = "versions.form" + (searchData.isAccents() ? "_raw" : "");
		String targetVersionId = searchData.getField().endsWith("_") ? searchData.getField() + "*" : searchData.getField();
		
		//QueryString query or Regex qery?
		QueryBuilder query;
		if (searchData.isRegex()) {
			query = QueryBuilders.regexpQuery(searchField, searchTerm);
		} else {
			query = QueryBuilders.queryStringQuery(searchTerm).field(searchField);
		}
		
		SearchSourceBuilder source = getCommonSearchSource(searchData)
			.query(
				QueryBuilders.nestedQuery(
					"versions",
					QueryBuilders.boolQuery()
						.filter(QueryBuilders.queryStringQuery(targetVersionId).field("versions.id"))
						.must(query),
					ScoreMode.Total
				).innerHit(
					new InnerHitBuilder()
						.setSize(10)
						.setHighlightBuilder(getHighlighting(HIGHLIGHT_SMART)))
			)
			.fetchSource(FETCH_SOURCE_CONTEXT); //set _source fields
		
		return getCommonSearchRequest().source(source);
	}
	
	
	public static SearchRequest buildMetricalQuery(MetricalSearchData searchData) {
		String targetVersionId = searchData.getField().endsWith("_") ? searchData.getField() + "*" : searchData.getField();

		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add actual metrical search query
		NestedQueryBuilder metricalQuery = QueryBuilders.nestedQuery(
				"versions",
				QueryBuilders.boolQuery()
					.filter(QueryBuilders.queryStringQuery(targetVersionId).field("versions.id"))
					.must(QueryBuilders.queryStringQuery(searchData.getInput().replaceAll("\\s", "\\ ")).field("versions.metrical")),
				ScoreMode.Total
			).innerHit(
				new InnerHitBuilder()
					.setSize(10)
					.setHighlightBuilder(getHighlighting(HIGHLIGHT_SMART)));
		
		bool.must(metricalQuery);
		
		//add search scope filters
		if (searchData.getScopes().size() > 0)
			bool.filter(getSearchScopesQuery(searchData));
		
		//add search meta filters
		if (searchData.getMeta().size() > 0)
			bool.filter(getSearchMetaQuery(searchData));
		
		return getCommonSearchRequest().source(
			getCommonSearchSource(searchData)
				.query(bool)
				.fetchSource(FETCH_SOURCE_CONTEXT)
		);
	}
	
	
	public static SearchRequest buildGrammarQuery(GrammarSearchData searchData){
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add search block queries
		addGrammarBlockQueries(bool, searchData);
		
		//add search scope filters
		if (searchData.getScopes().size() > 0)
			bool.filter(getSearchScopesQuery(searchData));
		
		//add search meta filters
		if (searchData.getMeta().size() > 0)
			bool.filter(getSearchMetaQuery(searchData));
		
		return getCommonSearchRequest().source(
			getCommonSearchSource(searchData)
				.query(bool)
				.fetchSource(FETCH_SOURCE_CONTEXT)
		);
	}
	
	
	private static BoolQueryBuilder getSearchMetaQuery(AbstractSearchData searchData) {
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
	
	
	private static void addGrammarBlockQueries(BoolQueryBuilder rootQuery, GrammarSearchData searchData){
		//iterate search blocks
		for (Map<String, Object> block : searchData.getBlocks()){
			//construct bool query for each block
			BoolQueryBuilder bool = QueryBuilders.boolQuery();
			
			//remove empty fields (already happens client-side)
			//block.values().stream().filter(v -> v != null && v.toString().length() > 0);
			
			//trim values
			block.values().forEach(v -> v = v.toString().trim());
			
			//add queries for block data
			for (String key : block.keySet()){
				
				//unimplemented
				if (key.equalsIgnoreCase("distance"))
					continue; //TEMP DEV
				
				//can be ignored, here
				if (key.equalsIgnoreCase("required"))
					continue; //TEMP DEV
				
				//if fields="term", also search in "lemma"-field
				if (key.equals("term") || key.equals("lemma")) {
					
					//set query string
					String termOrLemma = StringUtils.normalizeNFC((String) block.get(key));
					//if no search term: skip
					if (termOrLemma.length() == 0) continue;
					//set target field
					String field = "tokens." + (key.equals("lemma") ? "lemma" : "form");
					
					//set accent sensitive search
					if (searchData.isAccents())
						field += "_raw";
					else
						termOrLemma = StringUtils.removeVowelAccents(termOrLemma);
					
					//add this query to bool query
					bool.must(QueryBuilders.queryStringQuery(termOrLemma).field(field));
				} else {
					//...otherwise, add a simple term query
					bool.must(QueryBuilders.termQuery("tokens.grammar." + key, block.get(key)));
				}
			}
			
			//wrap block query in nested query
			NestedQueryBuilder blockQuery = QueryBuilders.nestedQuery("tokens", bool, ScoreMode.Total)
				.innerHit(
						new InnerHitBuilder()
							.setName("tokens." + block.hashCode())
							.setSize(10)
						);
			
			//add to root query
			if ((boolean)block.get("required")) {
				rootQuery.must(blockQuery);
			} else {
				rootQuery.should(blockQuery);
			}
			
		}
	}
	
	
	public static SearchRequest buildOccurrencesQuery(GrammarSearchData searchData) {
		SearchRequest req = buildGrammarQuery(searchData);
		req.source(req.source().size(19999).from(0)); //get ALL results always from 0
		return req;
	}
	
	
	private static HighlightBuilder getHighlighting(String... fields){
		HighlightBuilder highlightBuilder = new HighlightBuilder(); 
		
		for (String field : fields){
			highlightBuilder.field(new HighlightBuilder.Field(field));
		}
		
		//disable highlight fragmentation
		highlightBuilder.numOfFragments(0);
		
		return(highlightBuilder);
	}
	
	
	private static BoolQueryBuilder getSearchScopesQuery(AbstractSearchData searchData) {
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
	
	
	private static SearchSourceBuilder getCommonSearchSource(AbstractSearchData searchData) {
		SearchSourceBuilder source = new SearchSourceBuilder()
				.from(searchData.getFrom() >= 0 ? searchData.getFrom() : 0)
				.size(searchData.getSize() >= 0 ? searchData.getSize() : 0);
		
		if (searchData.getSortBy() == null) {
			return source;
		} else {
			return source.sort(
				searchData.getSortBy(),
				searchData.getSortOrder().equals("ascend") ? SortOrder.ASC : SortOrder.DESC
			);
		}
	}


}
