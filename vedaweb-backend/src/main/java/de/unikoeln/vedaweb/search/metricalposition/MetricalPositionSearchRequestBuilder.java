package de.unikoeln.vedaweb.search.metricalposition;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import de.unikoeln.vedaweb.search.CommonSearchRequest;
import de.unikoeln.vedaweb.util.StringUtils;

public class MetricalPositionSearchRequestBuilder {
	

	public static SearchRequest buildSearchRequest(MetricalPositionSearchData searchData) {
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//prepare query data
		String field = "metricalPositions" + (searchData.isAccents() ? "_raw" : "");
		String input = searchData.getInput().trim().split(" ", 2)[0];
		input = searchData.getPosition() + (searchData.isAccents()
						? input : StringUtils.removeVowelAccents(input));
		System.out.println(field + ": " + input);
		input = StringUtils.normalizeNFC(input); // normalize NFC
		
		//add query
		bool.must(QueryBuilders.queryStringQuery(input).field(field));
		
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
