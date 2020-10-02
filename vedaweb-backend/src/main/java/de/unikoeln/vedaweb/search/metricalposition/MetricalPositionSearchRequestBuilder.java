package de.unikoeln.vedaweb.search.metricalposition;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.InnerHitBuilder;
import org.elasticsearch.index.query.NestedQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.SimpleQueryStringBuilder;
import org.elasticsearch.index.query.SimpleQueryStringFlag;

import de.unikoeln.vedaweb.search.CommonSearchRequest;
import de.unikoeln.vedaweb.util.StringUtils;

/**
 * Utility class that constructs a request for a metrical position search
 * 
 * @author bkis
 *
 */
public class MetricalPositionSearchRequestBuilder {
	
	private static final String[] HIGHLIGHT = {"metricalPositions.form_raw"};
	

	public static SearchRequest buildSearchRequest(MetricalPositionSearchData searchData) {
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//prepare query data
		String field = "metricalPositions.form" + (searchData.isAccents() ? "_raw" : "");
		String input = searchData.getInput().trim();
		input = (searchData.isAccents() ? input : StringUtils.removeVowelAccents(input));
		input = StringUtils.normalizeNFC(input); // normalize NFC
		
		//System.out.println(field + ": " + input);
		
		//query
		SimpleQueryStringBuilder q = QueryBuilders.simpleQueryStringQuery(input)
			.field(field)
			.defaultOperator(Operator.AND)
			.flags(SimpleQueryStringFlag.PREFIX)
			.analyzeWildcard(true);
		
		//nested query
		NestedQueryBuilder nestedQuery = QueryBuilders
			.nestedQuery("metricalPositions", q, ScoreMode.Total)
			.innerHit(new InnerHitBuilder()
				.setSize(10)
				.setHighlightBuilder(
						CommonSearchRequest.getHighlightBuilder(HIGHLIGHT)));
		
		//add query to boolean query
		bool.must(nestedQuery);
		
		//add search scope filters to boolean query
		if (searchData.getScopes().size() > 0)
			bool.filter(CommonSearchRequest.getSearchScopesQuery(searchData));
		
		//add search meta filters to boolean query
		if (searchData.getMeta().size() > 0)
			bool.filter(CommonSearchRequest.getSearchMetaQuery(searchData));
		
		return CommonSearchRequest.getSearchRequest(searchData.getIndexName()).source(
				CommonSearchRequest.getSearchSourceBuilder(searchData)
				.query(bool)
				.fetchSource(CommonSearchRequest.getFetchSourceContext())
		);
	}

}
