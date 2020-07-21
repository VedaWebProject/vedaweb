package de.unikoeln.vedaweb.search.metricalposition;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import de.unikoeln.vedaweb.search.CommonSearchRequest;

public class MetricalPositionSearchRequestBuilder {
	

	public static SearchRequest buildSearchRequest(MetricalPositionSearchData searchData) {
		//root bool query
		BoolQueryBuilder bool = QueryBuilders.boolQuery();
		
		//add actual metrical search query
		bool.must(
			QueryBuilders.termQuery("metricalPositions",
					searchData.getPosition() + "_" + searchData.getInput()));
		
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
