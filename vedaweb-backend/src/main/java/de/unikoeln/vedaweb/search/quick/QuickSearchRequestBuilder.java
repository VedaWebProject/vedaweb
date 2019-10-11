package de.unikoeln.vedaweb.search.quick;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.InnerHitBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import de.unikoeln.vedaweb.search.CommonSearchRequest;
import de.unikoeln.vedaweb.util.StringUtils;

public class QuickSearchRequestBuilder {
	
	private static final String[] HIGHLIGHT = {"versions.form*"};


	public static SearchRequest buildSearchRequest(QuickSearchData searchData) {
		String searchTerm = StringUtils.normalizeNFC(
				searchData.isAccents() ? searchData.getInput()
						: StringUtils.removeVowelAccents(searchData.getInput()));
		String searchField = "versions.form" + (searchData.isAccents() ? "_raw" : "");
		String targetVersionId = searchData.getField().endsWith("_") ? searchData.getField() + "*" : searchData.getField();
		
		//QueryString query or Regex qery?
		QueryBuilder query;
		if (searchData.isRegex()) {
			query = QueryBuilders.regexpQuery(searchField + ".keyword", searchTerm);
		} else {
			query = QueryBuilders.queryStringQuery(searchTerm).field(searchField);
		}
		
		SearchSourceBuilder source = CommonSearchRequest.getSearchSourceBuilder(searchData)
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
						.setHighlightBuilder(CommonSearchRequest.getHighlightBuilder(HIGHLIGHT)))
			)
			.fetchSource(CommonSearchRequest.getFetchSourceContext()); //set _source fields
		
		return CommonSearchRequest.getSearchRequest(searchData.getIndexName()).source(source);
	}

}
