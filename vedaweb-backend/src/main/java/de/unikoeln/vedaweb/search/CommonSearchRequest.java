package de.unikoeln.vedaweb.search;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.common.Strings;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.sort.SortOrder;

public class CommonSearchRequest {
	
	private static final FetchSourceContext FETCH_SOURCE_CONTEXT =
		new FetchSourceContext(
			true,
			new String[]{"book", "hymn", "stanza", "hymnAddressee", "hymnGroup", "strata"},
			Strings.EMPTY_ARRAY
		);
	
	
	public static final SearchRequest getSearchRequest(String indexName) {
		return new SearchRequest(indexName);
	}
	
	
	public static final SearchSourceBuilder getSearchSourceBuilder(AbstractSearchData searchData) {
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
	
	
	public static final HighlightBuilder getHighlightBuilder(String... fields){
		HighlightBuilder highlightBuilder = new HighlightBuilder(); 
		
		for (String field : fields){
			highlightBuilder.field(new HighlightBuilder.Field(field));
		}
		
		//disable highlight fragmentation
		highlightBuilder.numOfFragments(0);
		
		return(highlightBuilder);
	}
	
	
	public static final BoolQueryBuilder getSearchScopesQuery(AbstractSearchData searchData) {
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
	
	
	public static final BoolQueryBuilder getSearchMetaQuery(AbstractSearchData searchData) {
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
	
	
	public static final FetchSourceContext getFetchSourceContext() {
		return FETCH_SOURCE_CONTEXT;
	}
	
	
}
