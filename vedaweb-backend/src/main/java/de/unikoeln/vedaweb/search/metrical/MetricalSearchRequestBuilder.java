package de.unikoeln.vedaweb.search.metrical;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.InnerHitBuilder;
import org.elasticsearch.index.query.NestedQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import de.unikoeln.vedaweb.search.CommonSearchRequest;

/**
 * Utility class that constructs a request for a metrical pattern search
 * 
 * @author bkis
 *
 */
public class MetricalSearchRequestBuilder {
	
	private static final String[] HIGHLIGHT = {"versions.form*"};
	

	public static SearchRequest buildSearchRequest(MetricalSearchData searchData) {
		String targetVersionId = searchData.getField()
				+ (searchData.getField().endsWith("_") ? "*" : "");

		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//actual query
		BoolQueryBuilder query = QueryBuilders
			.boolQuery()
			.filter(QueryBuilders
					.queryStringQuery(targetVersionId).field("versions.id"))
			.must(QueryBuilders
					.queryStringQuery(searchData.getInput()
							.replaceAll("\\s", "\\ "))
					.field("versions.metrical"));
		
		//add actual metrical search query
		NestedQueryBuilder nestedQuery = QueryBuilders
				.nestedQuery("versions", query,	ScoreMode.Avg
			).innerHit(
				new InnerHitBuilder()
					.setSize(10)
					.setHighlightBuilder(CommonSearchRequest.getHighlightBuilder(HIGHLIGHT)));
		
		bool.must(nestedQuery);
		
		//add search scope filters
		if (searchData.getScopes().size() > 0)
			bool.filter(CommonSearchRequest.getSearchScopesQuery(searchData));
		
		//add search meta filters
		if (searchData.getMeta().size() > 0)
			bool.filter(CommonSearchRequest.getSearchMetaQuery(searchData));
		
		return CommonSearchRequest.getSearchRequest(searchData.getIndexName()).source(
				CommonSearchRequest.getSearchSourceBuilder(searchData)
				.query(bool)
				.fetchSource(CommonSearchRequest.getFetchSourceContext())
		);
	}

}
